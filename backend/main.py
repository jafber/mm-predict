from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from core.artifacts import PatientFeatures, CoxBootstrapBundle

LOCAL_VITE_APP = "http://localhost:5173"
MODEL_PATH = "../ml/models/cox_bootstrap_bundle.pkl"

app = FastAPI()
cox_bootstrap = CoxBootstrapBundle.load(MODEL_PATH)

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
        prediction_df = cox_bootstrap.predict_cumulative_incidence(user_data)
    except Exception as e:
        print(f'got error {e} on input {body}')
        return 400

    return {
        "time": prediction_df.index.tolist(),
        "risk": prediction_df["risk"].tolist(),
        "ci_lower": prediction_df["ci_lower"].tolist(),
        "ci_upper": prediction_df["ci_upper"].tolist(),
    }