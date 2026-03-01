import {
  Formik,
  Form,
  useFormikContext,
} from "formik";
import { useEffect } from "react";
import type { PatientFeatures } from "../types";
import SelectField from "./SelectField";
import NumberField from "./NumberField";

interface Props {
  initialValues: PatientFeatures;
  onChange: (features: PatientFeatures | null) => void;
}

function FormObserver({ onChange }: {onChange: (features: PatientFeatures | null) => void}) {
  // https://javascript.plainenglish.io/how-to-listen-to-formik-onchange-event-in-react-df00c4d09be
  // also see https://github.com/jaredpalmer/formik/issues/271
  const { values, isValid } = useFormikContext();
  useEffect(() => {
    if (isValid) {
      onChange(values as PatientFeatures);
    } else {
      onChange(null);
    }
  }, [values, isValid]);
  return null;
};

export default function PatientForm({ initialValues, onChange }: Props) {
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <Form className="flex flex-col gap-6">
        <h2 className="text-lg font-semibold text-gray-900">Biomarker Information</h2>
        <FormObserver onChange={ onChange } />
        <SelectField name="Ancestry" title="Ancestry">
          <option value={0}>European</option>
          <option value={1}>African American</option>
        </SelectField>
        <NumberField name="sFLC_Ratio" title="Serum Free Light Chain Ratio" unitTitle="Involved / Uninvolved" min={0.1} max={165.6} step={0.1} />
        <NumberField name="M_Spike" title="M-Spike" unitTitle="g/dL" min={0.1} max={6.3} step={0.1} />
        <NumberField name="Creatinine" title="Creatinine" unitTitle="mg/dL" min={0.4} max={1.9} step={0.1} />
        <NumberField name="Age" title="Age" unitTitle="years" min={40} max={106} step={1} />
      </Form>
    </Formik>
  );
}
