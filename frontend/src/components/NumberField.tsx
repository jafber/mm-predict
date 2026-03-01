import FieldLabel from "./FieldLabel";
import { useField } from "formik";

export default function NumberField({name, title, unitTitle, min, max, step}: {name: string, title: string, unitTitle: string, min: number, max: number, step: number}) {
  const [field, meta] = useField({name: name, validate: isInRange});
  
  function isInRange(value: number) {
    if (value < min) {
      return "Value too low";
    }
    if (value > max) {
      return "Value too high";
    }
  }

  return (
    <div>
      <FieldLabel name={name} title={title} unitTitle={unitTitle} />
      <input type="number" id={name} step={step} className={meta.error ? "input-errored" : "input-normal"} {...field} />
      {meta.error && 
        <p className="text-red-500 mt-1">{meta.error}</p>
      }
    </div>
  )
}