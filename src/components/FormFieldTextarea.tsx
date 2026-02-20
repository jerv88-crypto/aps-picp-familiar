interface FormFieldTextareaProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export default function FormFieldTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
}: FormFieldTextareaProps) {
  return (
    <div className="form-group form-group-vertical">
      <label htmlFor={name} className="form-label">{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="form-input"
        style={{ resize: 'vertical' }}
      />
    </div>
  )
}
