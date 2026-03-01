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

- **`frontend/`** — React + TypeScript + Vite SPA. Single-page calculator with no routing. Sends patient biomarkers to the backend and renders a survival curve with confidence intervals.

**Reverse proxy:** Caddy routes `/api/*` to the backend and everything else to the frontend, both exposed on port 5173 in local dev.

## Frontend Details

### Stack
- **React 19** + **TypeScript 5** (strict mode), bundled with **Vite 7**
- **Tailwind CSS 4** for styling (via `@tailwindcss/vite` plugin)
- **Formik 2** for form state and validation
- **Recharts 3** for the survival curve chart
- TanStack React Query is installed but not currently used

### Commands
```bash
cd frontend
npm install
npm run dev    # dev server on http://localhost:5173 (proxies /api/* to :8000)
npm run build  # outputs to dist/
```

### Component Tree
```
App.tsx                      — layout, state, API calls
├── PatientForm.tsx           — Formik wrapper; fires onChange when valid/invalid
│   ├── FormObserver          — internal component; reads Formik context to notify parent
│   ├── SelectField.tsx       — Ancestry dropdown
│   └── NumberField.tsx       — reused for Age, M_Spike, sFLC_Ratio, Creatinine
└── PredictionResult.tsx      — Recharts ComposedChart + risk table
PredictionSkeleton.tsx        — animate-pulse placeholder while awaiting response
```

### Data Flow
1. User edits form → Formik validates → `FormObserver` calls `App.onChange`
2. App sets `features` state (or `null` if form is invalid)
3. `useEffect` on `features`: aborts the previous in-flight request via `AbortController`, fires `POST /api/mm_predict`
4. Response updates `predictionResult`; skeleton shown while pending

### API (`src/api.ts`)
- `requestPrediction(features, signal)` — `POST /api/mm_predict`, returns `PredictionResponse`
- `AbortError` is swallowed (returns `null`); other errors are re-thrown
- Vite dev proxy rewrites `/api/*` → `http://localhost:8000/*`

### Key Types
```typescript
// Mirrors core/artifacts.py PatientFeatures
PatientFeatures { Ancestry: 0|1; Age: number; M_Spike: number; sFLC_Ratio: number; Creatinine: number }

// Backend response
PredictionResponse { time: number[]; risk: number[]; ci_lower: number[]; ci_upper: number[] }
```

### Validation Ranges
| Field | Min | Max |
|---|---|---|
| Age | 40 | 106 |
| sFLC_Ratio | 0.1 | 165.6 |
| M_Spike | 0.1 | 6.3 |
| Creatinine | 0.4 | 1.9 |

### Notable Patterns
- **FormObserver** — a component placed inside `<Formik>` that uses `useFormikContext()` to surface validity/values to the parent without prop drilling
- **AbortController ref** — `useRef<AbortController>` cancels stale requests on each new submission, preventing race conditions
- **Discriminated union props** — `PredictionResult` accepts `{ prediction } | { error }` for type-safe error/success rendering
- **Risk colour coding** — 2-year risk: green < 10 %, yellow 10–20 %, red ≥ 20 %
- Recharts bundle is split into a separate Vite chunk for better caching

## Key Technical Details

- **Package manager:** [uv](https://docs.astral.sh/uv/). Each subproject (`backend/`, `ml/`) has its own `pyproject.toml` and `.venv`. Both declare `myeloma-predict-core` as an editable local dependency via `[tool.uv.sources]`.
- **scikit-survival** requires a C++ compiler (Visual C++ on Windows, build-essential on Linux). The backend Dockerfile installs build-essential for this.
- Python version: 3.13 (per Dockerfile)
- Core package defined in root `pyproject.toml`: pydantic, numpy, pandas, lifelines
- Training data maps ancestry: 'European' → 1, 'African American' → 0; time converted from months to years
- **Docker build context** for the backend is the project root (`.`), not `./backend`, so the Dockerfile can access `core/`. The Dockerfile is at `backend/Dockerfile`.
