import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import type { PatientFeatures } from "../types";

interface Props {
  onChange: (features: PatientFeatures | null) => void;
  initialValues: PatientFeatures;
}

const RANGES = {
  Age: { min: 40, max: 106 },
  M_Spike: { min: 0.1, max: 6.3 },
  sFLC_Ratio: { min: 0, max: 165.6 },
  Creatinine: { min: 0.4, max: 1.9 },
} as const;

type RangeField = keyof typeof RANGES;

function validate(values: PatientFeatures): Partial<Record<RangeField, string>> {
  const errors: Partial<Record<RangeField, string>> = {};
  for (const [field, { min, max }] of Object.entries(RANGES) as [RangeField, { min: number; max: number }][]) {
    const v = values[field];
    if (isNaN(v) || v < min || v > max)
      errors[field] = `Must be between ${min} and ${max}`;
  }
  return errors;
}

const base = "w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2";
const normal = `${base} border-gray-300 focus:ring-teal-500 focus:border-teal-500`;
const errored = `${base} border-red-400 focus:ring-red-400 focus:border-red-400`;

export default function PatientForm({ onChange, initialValues }: Props) {
  const firstRender = useRef(true);

  const formik = useFormik<PatientFeatures>({
    initialValues,
    validate,
    onSubmit: () => {},
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const errors = validate(formik.values);
    onChange(Object.keys(errors).length === 0 ? formik.values : null);
  }, [formik.values, onChange]);

  function numField(field: RangeField, step: string = "any") {
    return {
      type: "number" as const,
      step,
      name: field,
      value: formik.values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        formik.setFieldValue(field, e.target.valueAsNumber),
      onBlur: formik.handleBlur,
      className: formik.errors[field] ? errored : normal,
    };
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Biomarker Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ancestry</label>
        <select
          name="Ancestry"
          value={formik.values.Ancestry}
          onChange={(e) => formik.setFieldValue("Ancestry", Number(e.target.value))}
          onBlur={formik.handleBlur}
          className={normal}
        >
          <option value={1}>European</option>
          <option value={0}>Black / African American</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Serum Free Light Chain Ratio
          <span className="text-gray-400 font-normal"> (Involved / Uninvolved)</span>
        </label>
        <input {...numField("sFLC_Ratio", "0.1")} />
        {formik.errors.sFLC_Ratio && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.sFLC_Ratio}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          M-Spike <span className="text-gray-400 font-normal">(g/dL)</span>
        </label>
        <input {...numField("M_Spike", "0.1")} />
        {formik.errors.M_Spike && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.M_Spike}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Creatinine <span className="text-gray-400 font-normal">(mg/dL)</span>
        </label>
        <input {...numField("Creatinine", "0.1")} />
        {formik.errors.Creatinine && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.Creatinine}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age <span className="text-gray-400 font-normal">(years)</span>
        </label>
        <input {...numField("Age", "1")} />
        {formik.errors.Age && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.Age}</p>
        )}
      </div>
    </div>
  );
}
