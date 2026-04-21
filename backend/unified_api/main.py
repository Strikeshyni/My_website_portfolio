import os
import sys
import importlib
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Set
from urllib.parse import unquote, urlparse

import httpx
from bson import ObjectId
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.responses import JSONResponse, Response
from pymongo import MongoClient
from pymongo.errors import PyMongoError

BASE_DIR = Path(__file__).resolve().parents[1]
ROOT_DIR = BASE_DIR.parent

# Make sibling service modules importable.
sys.path.append(str(BASE_DIR / "sudoku"))
sys.path.append(str(BASE_DIR / "prediction_conform"))
sys.path.append(str(BASE_DIR / "ocr_sudoku"))

app = FastAPI(title="Portfolio Unified API", version="1.0.0")


def _normalize_demo_name(name: str) -> str:
    normalized = name.strip().lower().replace("_", "-")
    aliases = {
        "ocr": "ocr-sudoku",
        "ocrsudoku": "ocr-sudoku",
    }
    return aliases.get(normalized, normalized)


def _get_enabled_demos() -> Set[str]:
    all_demos = {"sudoku", "mushroom", "ocr-sudoku", "chatbot", "stock"}
    raw = (os.getenv("ENABLED_DEMOS") or os.getenv("DEMOS_TO_LOAD") or "").strip()
    if not raw:
        return all_demos

    requested = {
        _normalize_demo_name(name)
        for name in raw.split(",")
        if name.strip()
    }
    return requested & all_demos


ENABLED_DEMOS = _get_enabled_demos()
print(f"Enabled demos: {sorted(ENABLED_DEMOS)}")


def _is_demo_enabled(name: str) -> bool:
    return _normalize_demo_name(name) in ENABLED_DEMOS


def _require_demo_enabled(name: str) -> None:
    canonical = _normalize_demo_name(name)
    if canonical not in ENABLED_DEMOS:
        raise HTTPException(
            status_code=503,
            detail=f"Demo '{canonical}' is disabled by ENABLED_DEMOS/DEMOS_TO_LOAD.",
        )


def _project_demo_key(doc: Dict[str, Any]) -> Optional[str]:
    slug = (doc.get("slug") or "").strip().lower()
    if not slug:
        return None

    mapping = {
        "sudoku-solver": "sudoku",
        "chatbot": "chatbot",
        "mushroom-classifier": "mushroom",
        "stock-prediction": "stock",
        "ocr-sudoku": "ocr-sudoku",
    }
    return mapping.get(slug)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _get_mongodb_uri() -> str:
    uri = (os.getenv("MONGODB_URI") or "").strip()
    if uri:
        return uri

    # In production (Render), fail fast with an explicit error instead of
    # silently trying localhost, which is unavailable.
    if os.getenv("RENDER") or os.getenv("NODE_ENV") == "production":
        raise HTTPException(
            status_code=500,
            detail="MONGODB_URI is not configured on the server.",
        )

    return "mongodb://localhost:27017/portfolio"


PROJECTS_COLLECTION = os.getenv("PROJECTS_COLLECTION", "projects")


def _get_mongodb_db_name(uri: str) -> str:
    explicit_db = (os.getenv("MONGODB_DB") or "").strip()
    if explicit_db:
        return explicit_db

    parsed = urlparse(uri)
    path_db = parsed.path.lstrip("/").split("/", 1)[0].strip()
    if path_db:
        return unquote(path_db)

    return "portfolio"


def get_projects_collection():
    try:
        mongodb_uri = _get_mongodb_uri()
        mongodb_db = _get_mongodb_db_name(mongodb_uri)

        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=3000)
        client.admin.command("ping")
        db = client[mongodb_db]
        return db[PROJECTS_COLLECTION]
    except HTTPException:
        raise
    except PyMongoError as exc:
        raise HTTPException(status_code=503, detail=f"MongoDB is unreachable: {exc}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Mongo connection error: {exc}")


def serialize_project(doc: Dict[str, Any]) -> Dict[str, Any]:
    created_at = doc.get("createdAt")
    if isinstance(created_at, datetime):
        created_at_value: Any = created_at.isoformat()
    else:
        created_at_value = created_at

    demo_key = _project_demo_key(doc)
    demo_enabled = bool(demo_key and _is_demo_enabled(demo_key))

    return {
        "_id": str(doc.get("_id")),
        "slug": doc.get("slug"),
        "title": doc.get("title"),
        "description": doc.get("description"),
        "longDescription": doc.get("longDescription"),
        "technologies": doc.get("technologies", []),
        "imageUrl": doc.get("imageUrl"),
        "bannerUrl": doc.get("bannerUrl"),
        "githubUrl": doc.get("githubUrl"),
        "liveUrl": doc.get("liveUrl"),
        "category": doc.get("category"),
        "featured": doc.get("featured", False),
        "interactive": doc.get("interactive", False),
        "interactivePath": doc.get("interactivePath"),
        "demoEnabled": demo_enabled,
        "healthCheckUrl": doc.get("healthCheckUrl"),
        "maturity": doc.get("maturity"),
        "createdAt": created_at_value,
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "unified-api",
        "enabledDemos": sorted(ENABLED_DEMOS),
    }


@app.get("/api/health")
def api_health():
    return {"status": "ok", "message": "Unified API is running"}


@app.get("/api/projects")
def get_projects(
    category: Optional[str] = Query(default=None),
    featured: Optional[bool] = Query(default=None),
):
    filter_query: Dict[str, Any] = {}
    if category and category != "all":
        filter_query["category"] = category
    if featured is True:
        filter_query["featured"] = True

    collection = get_projects_collection()
    docs = list(collection.find(filter_query).sort("createdAt", -1))
    return [serialize_project(doc) for doc in docs]


@app.get("/api/projects/slug/{slug}")
def get_project_by_slug(slug: str):
    collection = get_projects_collection()
    doc = collection.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_project(doc)


@app.get("/api/projects/{project_id}")
def get_project_by_id(project_id: str):
    collection = get_projects_collection()
    try:
        object_id = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    doc = collection.find_one({"_id": object_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_project(doc)


@app.get("/api/test-images-sudoku")
def list_test_images_sudoku():
    image_dir = ROOT_DIR / "public" / "test_images_sudoku"
    if not image_dir.exists():
        return {"images": []}

    allowed_ext = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}
    images = sorted(
        [f.name for f in image_dir.iterdir() if f.is_file() and f.suffix.lower() in allowed_ext]
    )
    return {"images": images}


@app.post("/chatbot/chat")
async def chatbot_chat(payload: Dict[str, Any]):
    _require_demo_enabled("chatbot")

    message = (payload.get("message") or "").strip().lower()
    if not message:
        raise HTTPException(status_code=400, detail="message is required")

    # Optional forwarder to an external chatbot API.
    external_chatbot_url = os.getenv("CHATBOT_EXTERNAL_URL")
    if external_chatbot_url:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{external_chatbot_url.rstrip('/')}/chat",
                json=payload,
            )
        try:
            return JSONResponse(status_code=resp.status_code, content=resp.json())
        except ValueError:
            return Response(
                content=resp.text,
                status_code=resp.status_code,
                media_type=resp.headers.get("content-type", "text/plain"),
            )

    if any(word in message for word in ["bonjour", "salut", "hello", "hi"]):
        response = "Bonjour ! Je suis le chatbot du portfolio."
    elif any(word in message for word in ["portfolio", "projet", "site"]):
        response = "Le portfolio presente des projets IA, web et algorithmie avec demos interactives."
    elif any(word in message for word in ["contact", "email", "linkedin"]):
        response = "Tu peux me contacter via la section Contact du site."
    else:
        response = "Merci pour ton message. Je peux te parler des projets, competences et moyens de contact."

    return {"response": response}


@app.get("/chatbot/health")
def chatbot_health():
    _require_demo_enabled("chatbot")
    return {"status": "ok", "service": "chatbot"}


async def _proxy_stock_request(request: Request, path: str) -> Response:
    stock_api_url = os.getenv("STOCK_EXTERNAL_URL")
    if not stock_api_url:
        raise HTTPException(
            status_code=503,
            detail="Stock API is not configured. Set STOCK_EXTERNAL_URL.",
        )

    target_url = f"{stock_api_url.rstrip('/')}/{path.lstrip('/')}"
    headers = dict(request.headers)
    headers.pop("host", None)

    body = await request.body()

    async with httpx.AsyncClient(timeout=120.0) as client:
        upstream_resp = await client.request(
            method=request.method,
            url=target_url,
            params=request.query_params,
            headers=headers,
            content=body,
        )

    excluded_headers = {"content-encoding", "transfer-encoding", "connection"}
    response_headers = {
        k: v for k, v in upstream_resp.headers.items() if k.lower() not in excluded_headers
    }
    return Response(
        content=upstream_resp.content,
        status_code=upstream_resp.status_code,
        headers=response_headers,
        media_type=upstream_resp.headers.get("content-type"),
    )


@app.api_route("/stock/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def stock_proxy(path: str, request: Request):
    _require_demo_enabled("stock")
    return await _proxy_stock_request(request, path)


# Keep existing frontend routes working by mounting legacy services under their current prefixes.
if _is_demo_enabled("sudoku"):
    sudoku_flask_app = importlib.import_module("sudoku_api").app
    app.mount("/sudoku", WSGIMiddleware(sudoku_flask_app))

if _is_demo_enabled("mushroom"):
    mushroom_flask_app = importlib.import_module("mushroom_api").app
    app.mount("/mushroom", WSGIMiddleware(mushroom_flask_app))

if _is_demo_enabled("ocr-sudoku"):
    ocr_fastapi_app = importlib.import_module("api").app
    app.mount("/ocr-sudoku", ocr_fastapi_app)
