FROM python:3.10.15-slim-bullseye

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY main.py .
COPY models ./models
COPY schema ./schema
COPY routes ./routes
COPY service ./service

# FastAPI 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]