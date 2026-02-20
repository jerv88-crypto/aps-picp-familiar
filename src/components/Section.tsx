import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <section className="form-section">
      <button
        type="button"
        className="section-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>{title}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && <div className="section-content">{children}</div>}
    </section>
  )
}
