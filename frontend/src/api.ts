import type { PatientFeatures, PredictionResponse } from "./types";

export async function requestPrediction(
  features: PatientFeatures
): Promise<PredictionResponse> {
  const res = await fetch("/api/mm_predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });
  if (!res.ok) {
    throw new Error(`Prediction failed (${res.status})`);
  }
  return res.json();
}
