## Myeloma-Predict

Myeloma-predict is an interactive calculator to visualize the risk of developing multiple myeloma (a type of blood cancer) based on key biomarkers and individual genetic predisposition. See it in action at [myeloma-predict.jan-berndt.de](https://myeloma-predict.jan-berndt.de)!

### Quick Start

1. Run `docker compose up --build`.
2. Run `docker compose ps`. The containers for backend and frontend should show "healthy" status.
3. That's it! You are now running the production-ready app under [http://localhost:5173](http://localhost:5173).

## Local Development Setup

First, install [uv](https://docs.astral.sh/uv/getting-started/installation/) and NodeJS (we recommend [fnm](https://github.com/Schniz/fnm) for managing node installs). To check that you have the right version:

```bash
uv --version # uv 0.10.7 (08ab1a344 2026-02-27)
node --version # v22.21.1
```

> **Note:** The `/core` package defines a set of common Python classes used both in the backend and for model training. `/core` is specified as a dependency in [ml/pyproject.toml](ml/pyproject.toml) and [backend/pyproject.toml](backend/pyproject.toml) respectively. Using uv is highly recommended since it automatically resolves this dependency by looking at the `pyproject.toml` files. 

### ML / Jupyter Notebooks

The prediction model is trained here using the `lifelines` Python library and exported to `ml/models/cox_bootstrap_bundle.pkl`.

```
cd ml
uv run python train.py
```

We wrote a [notebook](ml/model.ipynb) going into more detail on the machine learning process. To run it, execute:

```
cd ml
uv sync
uv run jupyter lab
```

### Backend

FastAPI Python server. Loads the multiple myeloma prediction model from `ml/models/cox_boostrap_bundle.pkl`. Exposes a JSON REST API to run the model.

To run the API on [http://localhost:8000](http://localhost:8000):

```
cd backend
uv sync
uv run fastapi dev main.py
```

### Frontend

React + Typescript web app. Is built into a simple static HTML page using Vite.

To run the website on [http://localhost:5173](http://localhost:5173):

```
cd frontend
npm install
npm run dev
```

## Deployment to Coolify

This app is deployed to https://myeloma-predict.jan-berndt.de/ using [Coolify](https://coolify.io/), a self-hosted platform for serving web applications.
To deploy, simply:

- Create a new application from https://github.com/jafber/myeloma-predict
- Choose `docker-compose-coolify.yml` for the deployment
- Assign `https://myeloma-predict.jan-berndt.de` to the frontend container and `https://myeloma-predict.jan-berndt.de:8000/api` to the backend

---

Developed in 2025 by [Jan Berndt](https://jan-berndt.de) and [Daniel Cermann](https://dcermann.de) for the course _Biomedical Data Types and Analyses_ led by Prof. Bernard Renard at HPI. Inspired by the [PANGEA-SMM Calculator](https://www.pangeamodels.org/). This project uses the [MIT License](LICENSE).
