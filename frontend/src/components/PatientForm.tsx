import {
  Formik,
  Form,
  useFormikContext,
} from "formik";
import { useEffect } from "react";
import type { PatientFeatures } from "../types";
import SelectField from "./SelectField";
import NumberField from "./NumberField";

interface FormValues {
  age: number;
  m_spike: number;
  sflc_ratio: number;
  creatinine: number;
  pgs_bin: string; // "" | "0" | "1" | "2"
}

interface Props {
  initialValues: PatientFeatures;
  onChange: (features: PatientFeatures | null) => void;
}

function FormObserver({ onChange }: { onChange: (features: PatientFeatures | null) => void }) {
  // https://javascript.plainenglish.io/how-to-listen-to-formik-onchange-event-in-react-df00c4d09be
  // also see https://github.com/jaredpalmer/formik/issues/271
  const { values, isValid } = useFormikContext<FormValues>();
  useEffect(() => {
    if (isValid) {
      onChange({
        ...values,
        pgs_bin: values.pgs_bin === "" ? null : Number(values.pgs_bin),
      });
    } else {
      onChange(null);
    }
  }, [values, isValid]);
  return null;
}

export default function PatientForm({ initialValues, onChange }: Props) {
  const formValues: FormValues = {
    ...initialValues,
    pgs_bin: initialValues.pgs_bin === null ? "" : String(initialValues.pgs_bin),
  };

  return (
    <Formik initialValues={formValues} onSubmit={() => {}}>
      <Form className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-gray-900">Biomarker Information</h2>
        <FormObserver onChange={onChange} />
        <NumberField name="sflc_ratio" title="Serum Free Light Chain Ratio" unitTitle="Involved / Uninvolved" min={0.1} max={165.6} step={0.1} />
        <NumberField name="m_spike" title="M-Spike" unitTitle="g/dL" min={0.1} max={6.3} step={0.1} />
        <NumberField name="creatinine" title="Creatinine" unitTitle="mg/dL" min={0.4} max={1.9} step={0.1} />
        <NumberField name="age" title="Age" unitTitle="years" min={40} max={106} step={1} />
        <SelectField name="pgs_bin" title="Genetic Risk" optional>
          <option value="">Not set</option>
          <option value="0">Low</option>
          <option value="1">Medium</option>
          <option value="2">High</option>
        </SelectField>
      </Form>
    </Formik>
  );
}
