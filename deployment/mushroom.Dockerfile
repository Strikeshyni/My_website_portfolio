FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for OpenCV/PyTorch
# Fix for apt-get update failure: use a more robust mirror or retry logic if needed, 
# but often just ensuring clean state helps. Also added --no-install-recommends to reduce size.
RUN apt-get update --fix-missing && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY server/prediction_conform/requirements.txt .
RUN pip install -r requirements.txt

# Copy source code
COPY server/prediction_conform/ .

# Generate calibration scores if needed during build or startup
# RUN python generate_calibration.py

EXPOSE 8001

CMD ["python", "mushroom_api.py"]