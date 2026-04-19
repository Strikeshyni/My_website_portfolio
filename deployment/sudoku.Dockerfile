FROM python:3.9-slim

WORKDIR /app

# Install system dependencies (if any)
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY server/sudoku/requirements.txt .
# If requirements.txt doesn't exist, we install manually based on known deps
RUN pip install flask flask-cors numpy

# Copy source code
COPY server/sudoku/ .

EXPOSE 5000

CMD ["python", "sudoku_api.py"]