# Build context must be the project root (not ./backend) so core/ is accessible.
# docker build -t jafber/myeloma-predict-backend -f backend/Dockerfile .

FROM python:3.13-slim

WORKDIR /app

# build-essential for scikit-survival C++ compilation, curl for health check
RUN apt-get update && apt-get install -y build-essential curl && \
    pip install uv

# Install core package (shared dependency)
COPY pyproject.toml .
COPY core/ core/

# Install backend dependencies
COPY backend/pyproject.toml backend/
RUN cd backend && uv sync --no-dev

# Copy backend source
COPY backend/*.py backend/

WORKDIR /app/backend

ENV PYTHONUNBUFFERED=1

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
