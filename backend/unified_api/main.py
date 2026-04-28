import os
import asyncio
from typing import Optional, Set

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

app = FastAPI(title="Portfolio Manager API", version="2.0.0")


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


def _require_demo_enabled(name: str) -> None:
    canonical = _normalize_demo_name(name)
    if canonical not in ENABLED_DEMOS:
        raise HTTPException(
            status_code=503,
            detail=f"Demo '{canonical}' is disabled by ENABLED_DEMOS/DEMOS_TO_LOAD.",
        )


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

@app.get("/warmup")
async def warmup():
    urls = [
        os.getenv("MUSHROOM_API_URL") + "/health",
        os.getenv("SUDOKU_API_URL") + "/health",
        os.getenv("OCR_SUDOKU_API_URL") + "/health",
        os.getenv("CHATBOT_API_URL") + "/health",
        os.getenv("STOCK_API_URL") + "/health",
    ]

    async with httpx.AsyncClient(timeout=60.0) as client:
        results = await asyncio.gather(
            *[client.get(url) for url in urls],
            return_exceptions=True
        )

    return {"status": "warming", "results": str(results)}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "manager-api",
        "enabledDemos": sorted(ENABLED_DEMOS),
    }


@app.get("/api/health")
def api_health():
    return {"status": "ok", "message": "Manager API is running"}


def _get_service_url(env_var: str) -> str:
    value = (os.getenv(env_var) or "").strip()
    if not value:
        raise HTTPException(
            status_code=503,
            detail=f"{env_var} is not configured on the manager API.",
        )
    return value


MAX_RETRIES = 3
RETRY_DELAY = 2

async def _fetch_with_retry(client, request, target_url, headers, body):
    last_exception = None

    for attempt in range(MAX_RETRIES):
        try:
            return await client.request(
                method=request.method,
                url=target_url,
                params=request.query_params,
                headers=headers,
                content=body,
            )
        except httpx.RequestError as exc:
            last_exception = exc

            if attempt < MAX_RETRIES - 1:
                await asyncio.sleep(RETRY_DELAY * (attempt + 1))  # backoff
            else:
                raise exc

    raise last_exception

async def _proxy_request(
    request: Request,
    base_url: str,
    prefix: str,
    path: str,
    strip_prefix: bool,
) -> Response:
    if strip_prefix:
        target_path = f"/{path}" if path else ""
    else:
        target_path = f"{prefix}/{path}" if path else prefix

    target_url = f"{base_url.rstrip('/')}{target_path}"

    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)
    headers.pop("accept-encoding", None)
    headers["accept-encoding"] = "identity"

    body = await request.body()

    async with httpx.AsyncClient(timeout=40.0) as client:
        try:
            upstream_resp = await _fetch_with_retry(
                client, request, target_url, headers, body
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Upstream request failed after retries: {exc}"
            )

    excluded_headers = {"content-encoding", "transfer-encoding", "connection"}
    response_headers = {
        key: value
        for key, value in upstream_resp.headers.items()
        if key.lower() not in excluded_headers
    }

    return Response(
        content=upstream_resp.content,
        status_code=upstream_resp.status_code,
        headers=response_headers,
        media_type=upstream_resp.headers.get("content-type"),
    )


def _register_proxy(
    prefix: str,
    env_var: str,
    *,
    strip_prefix: bool,
    demo_name: Optional[str] = None,
) -> None:
    async def handler(request: Request, path: str = "") -> Response:
        if demo_name:
            _require_demo_enabled(demo_name)
        base_url = _get_service_url(env_var)
        return await _proxy_request(request, base_url, prefix, path, strip_prefix)

    app.api_route(prefix, methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])(handler)
    app.api_route(f"{prefix}/{{path:path}}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])(handler)


_register_proxy("/api/projects", "PROJECTS_API_URL", strip_prefix=False)
_register_proxy("/api/test-images-sudoku", "PROJECTS_API_URL", strip_prefix=False)
_register_proxy("/chatbot", "CHATBOT_API_URL", strip_prefix=True, demo_name="chatbot")
_register_proxy("/sudoku", "SUDOKU_API_URL", strip_prefix=True, demo_name="sudoku")
_register_proxy("/mushroom", "MUSHROOM_API_URL", strip_prefix=True, demo_name="mushroom")
_register_proxy("/ocr-sudoku", "OCR_SUDOKU_API_URL", strip_prefix=True, demo_name="ocr-sudoku")
_register_proxy("/stock", "STOCK_API_URL", strip_prefix=True, demo_name="stock")
