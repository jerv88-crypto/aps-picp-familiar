import { useCallback } from 'react'
import Section from '../Section'
import FormField from '../FormField'
import { Plus, Trash2 } from 'lucide-react'
import { obtenerTamizajeInfo } from '../../lib/ley3280'
import type { Integrante } from '../../types'

interface Props {
  integrantes: Integrante[]
  onChange: (integrantes: Integrante[]) => void
}

function generarId() {
  return `int-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function CicloVidaIntegrantesForm({ integrantes, onChange }: Props) {
  const agregarIntegrante = useCallback(() => {
    const nuevo: Integrante = {
      id: generarId(),
      nombres: '',
      apellidos: '',
      cedula: '',
      edad: 0,
    }
    onChange([...integrantes, nuevo])
  }, [integrantes, onChange])

  const actualizarIntegrante = useCallback((id: string, campos: Partial<Integrante>) => {
    onChange(integrantes.map((i) => (i.id === id ? { ...i, ...campos } : i)))
  }, [integrantes, onChange])

  const eliminarIntegrante = useCallback((id: string) => {
    onChange(integrantes.filter((i) => i.id !== id))
  }, [integrantes, onChange])

  return (
    <Section title="7. CICLO DE VIDA – INTEGRANTES" defaultOpen={true}>
      <button type="button" className="btn btn-primary agregar-integrante-btn" onClick={agregarIntegrante}>
        <Plus size={20} />
        AGREGAR INTEGRANTE
      </button>

      <div className="integrantes-list">
        {integrantes.map((int) => {
          const info = obtenerTamizajeInfo(int)
          return (
            <div key={int.id} className="integrante-card">
              <div className="integrante-header">
                <span className="integrante-num">Integrante {integrantes.indexOf(int) + 1}</span>
                <button type="button" className="btn-eliminar" onClick={() => eliminarIntegrante(int.id)} title="Eliminar integrante">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="form-grid integrante-grid">
                <FormField label="Nombres" name={`nombres-${int.id}`} value={int.nombres} onChange={(v) => actualizarIntegrante(int.id, { nombres: v })} />
                <FormField label="Apellidos" name={`apellidos-${int.id}`} value={int.apellidos} onChange={(v) => actualizarIntegrante(int.id, { apellidos: v })} />
                <FormField label="Número de cédula" name={`cedula-${int.id}`} value={int.cedula} onChange={(v) => actualizarIntegrante(int.id, { cedula: v })} />
                <FormField label="Edad" name={`edad-${int.id}`} value={int.edad ? String(int.edad) : ''} onChange={(v) => actualizarIntegrante(int.id, { edad: parseInt(v, 10) || 0 })} type="number" />
                <div className="form-group tamizajes-auto">
                  <label className="form-label">Tamizajes (automático por sistema)</label>
                  <div className="tamizajes-content">
                    <p className="ciclo-vida"><strong>Ciclo de vida:</strong> {info.cicloVida}</p>
                    <ul>
                      {info.tamizajes.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
