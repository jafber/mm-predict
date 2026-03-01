import { useState, useEffect, useRef } from "react";
import PatientForm from "./components/PatientForm";
import PredictionResult from "./components/PredictionResult";
import PredictionError from "./components/PredictionError";
import PredictionSkeleton from "./components/PredictionSkeleton";
import type { PatientFeatures, PredictionResponse } from "./types";
import { requestPrediction } from "./api";

const DEFAULT_FEATURES: PatientFeatures = {
  Ancestry: 1,
  Age: 65,
  M_Spike: 0.5,
  sFLC_Ratio: 1.5,
  Creatinine: 1.0,
};

export default function App() {
  const [features, setFeatures] = useState<PatientFeatures | null>(DEFAULT_FEATURES);
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const abortControllerRef = useRef(new AbortController())

  useEffect(() => {
    abortControllerRef.current.abort();
    setPredictionResult(null);
    if (features) {
      abortControllerRef.current = new AbortController();
      requestPrediction(features, abortControllerRef.current.signal)
        .then(prediction => {
          if (prediction) {
            setPredictionResult(prediction);
          }
        })
    }
  }, [features]);

  let resultContent;
  if (predictionResult) {
    resultContent = <PredictionResult prediction={predictionResult} />;
  } else if (features) {
    resultContent = <PredictionSkeleton />;
  } else {
    resultContent = <PredictionError error="Please fix the form errors before a prediction can be calculated." />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-teal-700 text-white py-4 px-6 shadow shrink-0">
        <h1 className="text-2xl font-bold">Myeloma Predict</h1>
        <p className="text-teal-100 mt-0.5">
          Risk calculator for progression from MGUS / SMM to multiple myeloma
        </p>
      </header>

      <main className="lg:flex-1 lg:overflow-hidden max-w-6xl w-full mx-auto p-4 sm:p-6 lg:py-6 lg:flex lg:flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] lg:flex-1 lg:overflow-hidden gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 lg:overflow-y-auto">
            <PatientForm initialValues={DEFAULT_FEATURES} onChange={setFeatures} />
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 lg:overflow-y-auto">
            {resultContent}
          </div>
        </div>
      </main>
    </div>
  );
}
