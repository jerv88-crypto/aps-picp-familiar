import Section from '../Section'
import FormField from '../FormField'
import type { AguaSaneamientoResiduos } from '../../types'

interface Props {
  data: AguaSaneamientoResiduos
  onChange: (data: AguaSaneamientoResiduos) => void
}

const fuentesAgua = [
  { value: 'acueducto', label: 'Acueducto' }, { value: 'pozo', label: 'Pozo' },
  { value: 'rio', label: 'Río/Quebrada' }, { value: 'lluvia', label: 'Agua lluvia' },
  { value: 'carro_tanque', label: 'Carro tanque' }, { value: 'otro', label: 'Otro' },
]
const disposicionOpciones = [
  { value: 'alcantarillado', label: 'Alcantarillado' }, { value: 'pozo_septico', label: 'Pozo séptico' },
  { value: 'letrina', label: 'Letrina' }, { value: 'aire_libre', label: 'Aire libre' },
  { value: 'otro', label: 'Otro' },
]
const residuosOpciones = [
  { value: 'recoleccion', label: 'Recolección' }, { value: 'quema', label: 'Quema' },
  { value: 'entierro', label: 'Entierro' }, { value: 'botadero', label: 'Botadero' },
  { value: 'rio', label: 'Río/Quebrada' }, { value: 'otro', label: 'Otro' },
]

export default function AguaSaneamientoForm({ data, onChange }: Props) {
  const update = (key: keyof AguaSaneamientoResiduos, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <Section title="3. AGUA, SANEAMIENTO Y RESIDUOS">
      <div className="form-grid">
        <FormField label="Principal Fuente Agua Consumo Humano" name="fuenteAgua" value={data.principalFuenteAguaConsumoHumano} onChange={(v) => update('principalFuenteAguaConsumoHumano', v)} options={fuentesAgua} />
        <FormField label="Descripción Otra Fuente Agua Consumo Humano" name="otraFuenteAgua" value={data.descripcionOtraFuenteAguaConsumo} onChange={(v) => update('descripcionOtraFuenteAguaConsumo', v)} />
        <FormField label="Disposición Excretas" name="disposicionExcretas" value={data.disposicionExcretas} onChange={(v) => update('disposicionExcretas', v)} options={disposicionOpciones} />
        <FormField label="Otra Disposición Excretas" name="otraExcretas" value={data.otraDisposicionExcretas} onChange={(v) => update('otraDisposicionExcretas', v)} />
        <FormField label="Disposición Agua Residual" name="disposicionResidual" value={data.disposicionAguaResidual} onChange={(v) => update('disposicionAguaResidual', v)} options={disposicionOpciones} />
        <FormField label="Otra Disposición Agua Residual" name="otraResidual" value={data.otraDisposicionAguaResidual} onChange={(v) => update('otraDisposicionAguaResidual', v)} />
        <FormField label="Disposición Residuos Sólidos" name="disposicionResiduos" value={data.disposicionResiduosSolidos} onChange={(v) => update('disposicionResiduosSolidos', v)} options={residuosOpciones} />
        <FormField label="Otra Disposición Residuos Sólidos" name="otraResiduos" value={data.otraDisposicionResiduosSolidos} onChange={(v) => update('otraDisposicionResiduosSolidos', v)} />
      </div>
    </Section>
  )
}
