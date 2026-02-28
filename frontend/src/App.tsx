import { useState } from "react";
import PatientForm from "./components/PatientForm";
import PredictionResult from "./components/PredictionResult";
import { requestPrediction } from "./api";
import type { PatientFeatures, PredictionResponse } from "./types";

export default function App() {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(features: PatientFeatures) {
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
            <PatientForm onSubmit={handleSubmit} loading={loading} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 min-h-[400px]">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-3 mb-4 text-sm">
                {error}
              </div>
            )}
            {prediction ? (
              <PredictionResult prediction={prediction} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Enter patient biomarkers and click &quot;Calculate Risk&quot; to
                see results.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
