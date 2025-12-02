FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY server/ocr_sudoku/requirements.txt .
RUN pip install -r requirements.txt

# Copy source code
COPY server/ocr_sudoku/ .

EXPOSE 8003

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8003"]