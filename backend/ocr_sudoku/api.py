import base64
import mimetypes
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="OCR Sudoku API")

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "data"
OUTPUT_IMAGE = BASE_DIR / "output_api.png"
SOLVER_BINARY = BASE_DIR / "build" / "sudoku_solver"
CNN_WEIGHTS = BASE_DIR / "models" / "cnn_weights.bin"
DEBUG_IMAGES = [
    "debug_1_gray.png",
    "debug_2_blurred.png",
    "debug_3_binary.png",
    "debug_4_grid_detected.png",
    "debug_5_rectified.png",
    "debug_6_cells.png"
]

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ocr-sudoku"}

@app.post("/solve")
async def solve_sudoku(file: UploadFile = File(...)):
    if not SOLVER_BINARY.exists():
        raise HTTPException(status_code=500, detail="Solver binary not found at ./build/sudoku_solver")
    if not CNN_WEIGHTS.exists():
        raise HTTPException(status_code=500, detail="CNN weights not found at ./models/cnn_weights.bin")

    # Each request gets its own temp workspace to avoid collisions between users.
    with tempfile.TemporaryDirectory(prefix="ocr_sudoku_") as temp_dir:
        temp_path = Path(temp_dir)
        input_image = temp_path / "input_upload.png"
        output_image = temp_path / "output_api.png"

        # The C solver loads weights from relative path models/cnn_weights.bin.
        # Mirror that structure in the request-scoped temp workspace.
        temp_models_dir = temp_path / "models"
        temp_models_dir.mkdir(parents=True, exist_ok=True)
        shutil.copy2(CNN_WEIGHTS, temp_models_dir / "cnn_weights.bin")

        with open(input_image, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        command = [str(SOLVER_BINARY), str(input_image), str(output_image)]

        try:
            # Run in request-specific cwd so debug_*.png files stay isolated.
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=30,
                cwd=temp_dir,
            )
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=504, detail="Solver timed out")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error running solver: {str(e)}")

        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Solver failed: {result.stderr}")

        def to_data_url(path: Path) -> str | None:
            if not path.exists():
                return None
            mime_type, _ = mimetypes.guess_type(path.name)
            if not mime_type:
                mime_type = "image/png"
            with open(path, "rb") as img_file:
                b64 = base64.b64encode(img_file.read()).decode("ascii")
            return f"data:{mime_type};base64,{b64}"

        output_data_url = to_data_url(output_image)
        debug_payload = []
        for name in DEBUG_IMAGES:
            debug_path = temp_path / name
            data_url = to_data_url(debug_path)
            if data_url:
                debug_payload.append({"name": name, "dataUrl": data_url})

        return {
            "message": "Sudoku processed successfully",
            "stdout": result.stdout,
            "stderr": result.stderr,
            "outputImageDataUrl": output_data_url,
            "debugImages": debug_payload,
        }

@app.get("/debug-images")
def list_debug_images():
    return {
        "message": "Debug images are now request-scoped and returned by POST /solve.",
        "images": [],
    }
