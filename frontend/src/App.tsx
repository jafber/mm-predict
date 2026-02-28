import { useState, useEffect, useRef, useCallback } from "react";
import PatientForm from "./components/PatientForm";
import PredictionResult from "./components/PredictionResult";
import { requestPrediction } from "./api";
import type { PatientFeatures, PredictionResponse } from "./types";

const DEFAULT_FEATURES: PatientFeatures = {
  Ancestry: 1,
  Age: 65,
  M_Spike: 0.5,
  sFLC_Ratio: 1.5,
  Creatinine: 1.0,
};

const DEBOUNCE_MS = 400;

export default function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function fetchPrediction(features: PatientFeatures) {
    setLoading(true);
    setError(null);
    try {
      const result = await requestPrediction(features);
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  }

  // Initial prediction on mount — PatientForm skips its first onChange call
  useEffect(() => {
    fetchPrediction(DEFAULT_FEATURES);
  }, []);

  const handleChange = useCallback((features: PatientFeatures | null) => {
    if (!features) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPrediction(features), DEBOUNCE_MS);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-700 text-white py-4 px-6 shadow">
        <h1 className="text-2xl font-bold">Myeloma Predict</h1>
        <p className="text-sm text-teal-100 mt-0.5">
          Risk calculator for progression to multiple myeloma
        </p>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <PatientForm onChange={handleChange} initialValues={DEFAULT_FEATURES} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 min-h-[400px] relative">
            {loading && (
              <div className="absolute top-4 right-4">
                <svg
                  className="animate-spin h-5 w-5 text-teal-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 mb-4 text-sm">
                {error}
              </div>
            )}
            {prediction && <PredictionResult prediction={prediction} />}
          </div>
        </div>
      </main>
    </div>
  );
}
