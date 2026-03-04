import { useState, useEffect, useRef } from "react";
import PatientForm from "./components/PatientForm";
import PredictionResult from "./components/PredictionResult";
import PredictionError from "./components/PredictionError";
import PredictionSkeleton from "./components/PredictionSkeleton";
import AboutSection from "./components/AboutSection";
import GitHubIcon from "./icons/github.svg?react";
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
    <>
      <header className="bg-teal-700 text-white shadow shrink-0 flex justify-center">
        <div className="max-w-6xl w-full py-4 px-6 gap-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MM-Predict</h1>
            <p className="text-teal-100 mt-0.5">
              Risk calculator for progression from MGUS / SMM to multiple myeloma
            </p>
          </div>
          <a
            href="https://github.com/jafber/mm-predict"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-teal-100 hover:text-white"
          >
            <GitHubIcon className="size-8 lg:size-6 flex-none" />
            <span className="hidden lg:inline">View on GitHub</span>
          </a>
        </div>
      </header>
      <div className="bg-gray-50 flex justify-center">
        <main className="max-w-6xl w-full p-4 grid gap-4 lg:py-6 lg:grid-cols-[340px_1fr] lg:grid-rows-[48rem_auto]">
          <div className="tile lg:overflow-y-auto">
            <PatientForm initialValues={DEFAULT_FEATURES} onChange={setFeatures} />
          </div>

          <div className="tile lg:overflow-y-auto">
            {resultContent}
          </div>

          <div className="tile lg:col-span-2">
            <AboutSection />
          </div>
        </main>
      </div>
      <footer className="bg-teal-700 text-white shadow shrink-0 flex justify-center">
        <div className="max-w-6xl w-full py-4 px-6 text-teal-100 flex flex-col gap-2">
          <a className="hover:text-white" href="https://jan-berndt.de/pages/impressum/">Impressum</a>
          <a className="hover:text-white" href="https://jan-berndt.de/pages/datenschutz/">Datenschutz</a>
          <p className="text-white">This is a demo for research purposes only and does not consitute medical advice.</p>
        </div>
      </footer>
    </>
  );
}
