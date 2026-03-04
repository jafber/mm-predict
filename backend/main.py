from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from core.artifacts import PatientFeatures, CoxBootstrapBundle
from pathlib import Path

LOCAL_VITE_APP = "http://localhost:5173"
MODEL_ROOT_PATH = Path("../ml/models")

app = FastAPI()
mm_nopgs = CoxBootstrapBundle.load(MODEL_ROOT_PATH / "mm_nopgs.pkl")
mm_pgs = CoxBootstrapBundle.load(MODEL_ROOT_PATH / "mm_pgs_bin.pkl")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[LOCAL_VITE_APP],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def main():
    return {"message": "Hello World"}

@app.get("/healthz")
async def health_check():
    return "OK"

@app.post("/mm_predict")
async def mm_predict(request: Request):
    body = await request.json()

    try:
        user_data = PatientFeatures(**body)
        if body.get("pgs_bin") is not None:
            prediction_df = mm_pgs.predict_cumulative_incidence(user_data)
        else:
            prediction_df = mm_nopgs.predict_cumulative_incidence(user_data)
    except Exception as e:
        print(f'got error {e} on input {body}')
        return 400

    return {
        "time": prediction_df.index.tolist(),
        "risk": prediction_df["risk"].tolist(),
        "ci_lower": prediction_df["ci_lower"].tolist(),
        "ci_upper": prediction_df["ci_upper"].tolist(),
    }