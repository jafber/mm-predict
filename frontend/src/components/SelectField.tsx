import { Field } from "formik";
import FieldLabel from "./FieldLabel";

export default function SelectField({name, title, optional, children}: {name: string, title: string, optional?: boolean, children: React.ReactNode}) {
  return (
    <div>
      <FieldLabel name={name} title={title} unitTitle={optional ? "optional" : undefined} />
      <Field id={name} name={name} as="select" className="input-normal">
        {children}
      </Field>
    </div>
  )
}
