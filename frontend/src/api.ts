import type { PatientFeatures, PredictionResponse } from "./types";

export async function requestPrediction(
  features: PatientFeatures,
  signal: AbortSignal
): Promise<PredictionResponse | null> {
  try {
    const res = await fetch("/api/mm_predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
      signal,
    });
    if (!res.ok) {
      throw new Error(`Prediction failed (${res.status})`);
    }
    const prediction = await res.json() as PredictionResponse;
    return prediction;
  } catch(error) {
    const wasAborted = (error instanceof DOMException && error.name == 'AbortError');
    if (wasAborted) {
      return null;
    } else {
      throw error;
    }
  }
}
