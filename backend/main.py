from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from pydantic import BaseModel
from typing import Optional
from datetime import date, timedelta
from random import random
from model import init_model, predict_risk_function
import pandas as pd
from artifacts import PatientFeatures, CoxBootstrapBundle

LOCAL_VITE_APP = "http://localhost:5173"
MODEL_PATH = "../predictions/model/cox_bootstrap_bundle.pkl"

app = FastAPI()
cox_bootstrap = CoxBootstrapBundle(MODEL_PATH)

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
        cox_bootstrap.predict_cumulative_incidence(user_data)
    except Exception as e:
        print(f'got error {e} on input {body}')

    return {
        "risk": risk_assessements,
        "riskScore": sum([r["probability"] for r in risk_assessements]) / len(risk_assessements),
        "overallVerdict": "Low Risk",
        "detailedDescription": "Based on the provided parameters, the risk of progression is low",
    }