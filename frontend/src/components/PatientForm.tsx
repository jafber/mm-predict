import { useState } from "react";
import type { FormEvent } from "react";
import type { PatientFeatures } from "../types";

interface Props {
  onSubmit: (features: PatientFeatures) => void;
  loading: boolean;
}

export default function PatientForm({ onSubmit, loading }: Props) {
  const [ancestry, setAncestry] = useState("1");
  const [age, setAge] = useState("");
  const [mSpike, setMSpike] = useState("");
  const [sflcRatio, setSflcRatio] = useState("");
  const [creatinine, setCreatinine] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      Ancestry: Number(ancestry),
      Age: Number(age),
      M_Spike: Number(mSpike),
      sFLC_Ratio: Number(sflcRatio),
      Creatinine: Number(creatinine),
    });
  }

  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Biomarker Information
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ancestry
        </label>
        <select
          value={ancestry}
          onChange={(e) => setAncestry(e.target.value)}
          className={inputClass}
        >
          <option value="1">European</option>
          <option value="0">Black / African American</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Serum Free Light Chain Ratio
          <span className="text-gray-400 font-normal">
            {" "}
            (Involved / Uninvolved)
          </span>
        </label>
        <input
          type="number"
          step="any"
          min="0"
          required
          placeholder="e.g. 1.5"
          value={sflcRatio}
          onChange={(e) => setSflcRatio(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          M-Spike <span className="text-gray-400 font-normal">(g/dL)</span>
        </label>
        <input
          type="number"
          step="any"
          min="0"
          required
          placeholder="e.g. 3.2"
          value={mSpike}
          onChange={(e) => setMSpike(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Creatinine{" "}
          <span className="text-gray-400 font-normal">(mg/dL)</span>
        </label>
        <input
          type="number"
          step="any"
          min="0"
          required
          placeholder="e.g. 1.2"
          value={creatinine}
          onChange={(e) => setCreatinine(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age <span className="text-gray-400 font-normal">(years)</span>
        </label>
        <input
          type="number"
          step="1"
          min="0"
          max="120"
          required
          placeholder="e.g. 65"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-600 text-white font-medium py-2.5 rounded-md hover:bg-teal-700 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? "Calculating..." : "Calculate Risk"}
      </button>
    </form>
  );
}
