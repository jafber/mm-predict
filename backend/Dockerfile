# cd backend
# docker build -t jafber/myeloma-predict-backend .
# docker run --rm -p 8000:8000 jafber/myeloma-predict-backend

FROM python:3.13-slim

WORKDIR /app

# build-essential for ?, curl for health check
RUN apt-get update && apt-get install -y build-essential curl

COPY requirements.txt requirements-prod.txt .
RUN pip install --no-cache-dir -r requirements.txt && pip install --no-cache-dir -r requirements-prod.txt

COPY *.py .

ENV PYTHONUNBUFFERED=1

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
