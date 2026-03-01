import { Field } from "formik";
import FieldLabel from "./FieldLabel";

export default function SelectField({name, title, children}: {name: string, title: string, children: React.ReactNode}) {
  return (
    <div>
      <FieldLabel name={name} title={title} />
      <Field id={name} name={name} as="select" className="input-normal">
        {children}
      </Field>
    </div>
  )
}
