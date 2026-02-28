# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Myeloma-Predict is an interactive calculator that visualizes the risk of developing multiple myeloma based on biomarkers and genetic predisposition. It uses Cox Proportional Hazards survival analysis with bootstrap confidence intervals.

Live demo: https://myeloma-predict.jan-berndt.de

## Common Commands

### Local Development (Docker)
```bash
docker compose up --build
# Frontend: http://localhost:5173, Backend API: http://localhost:8000
```

### Backend Only
```bash
cd backend
uv sync
uv run fastapi dev main.py
```

### ML Model Training
```bash
cd ml
uv sync
uv run python train.py
# Outputs: models/cox_bootstrap_bundle.pkl
```

### Jupyter Notebooks
```bash
cd ml
uv run jupyter lab
```

### Production Deployment
Uses `docker-compose-coolify.yml` via Coolify platform.

## Architecture

Three main modules share a common `core/` package:

- **`backend/`** — FastAPI server. Loads the pre-trained Cox model bundle at startup and exposes `POST /mm_predict` for survival predictions. CORS configured for localhost:5173. Health check at `GET /healthz`.

- **`ml/`** — Training pipeline and notebooks. `train.py` fits a main Cox PH model plus 100 bootstrap resamples on `data/myeloma_data.csv`, serialized to `models/cox_bootstrap_bundle.pkl` (~18MB pickle). Jupyter notebooks (`cox_model.ipynb`, `model.ipynb`, `presentation_charts.ipynb`) contain exploratory analysis.

- **`core/`** — Shared data models. `artifacts.py` defines `PatientFeatures` (Pydantic model with Ancestry, Age, M_Spike, sFLC_Ratio, Creatinine) and `CoxBootstrapBundle` (holds main model + bootstrap models, produces point estimates with 95% CI).

**Reverse proxy:** Caddy routes `/api/*` to the backend and everything else to the frontend, both exposed on port 5173 in local dev.

## Key Technical Details

- **Package manager:** [uv](https://docs.astral.sh/uv/). Each subproject (`backend/`, `ml/`) has its own `pyproject.toml` and `.venv`. Both declare `myeloma-predict-core` as an editable local dependency via `[tool.uv.sources]`.
- **scikit-survival** requires a C++ compiler (Visual C++ on Windows, build-essential on Linux). The backend Dockerfile installs build-essential for this.
- Python version: 3.13 (per Dockerfile)
- Core package defined in root `pyproject.toml`: pydantic, numpy, pandas, lifelines
- Training data maps ancestry: 'European' → 1, 'African American' → 0; time converted from months to years
- **Docker build context** for the backend is the project root (`.`), not `./backend`, so the Dockerfile can access `core/`. The Dockerfile is at `backend/Dockerfile`.
- The frontend (React + TypeScript + Vite) has been removed from the working directory but exists in git history
