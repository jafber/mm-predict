export default function FieldLabel({name, title, unitTitle}: {name: string, title: string, unitTitle?: string}) {
  return (
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {title}
      {unitTitle && <span className="text-gray-400 font-normal"> ({unitTitle})</span>}
    </label>
  )
}
