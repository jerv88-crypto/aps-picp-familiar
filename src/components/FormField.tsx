interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'date'
  placeholder?: string
  error?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  required,
  options,
}: FormFieldProps) {
  if (options && options.length > 0) {
    return (
      <div className="form-group">
        <label htmlFor={name} className="form-label">
          {label} {required && '*'}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`form-input ${error ? 'error' : ''}`}
        >
          <option value="">Seleccione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <span className="error-text">{error}</span>}
      </div>
    )
  }

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label} {required && '*'}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}
