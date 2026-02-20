import Section from '../Section'
import FormField from '../FormField'
import FormFieldTextarea from '../FormFieldTextarea'
import type { ComposicionFamiliar } from '../../types'

interface Props {
  data: ComposicionFamiliar
  onChange: (data: ComposicionFamiliar) => void
}

const tipoFamilia = [
  { value: 'nuclear', label: 'Nuclear' }, { value: 'extensa', label: 'Extensa' },
  { value: 'monoparental', label: 'Monoparental' }, { value: 'compuesta', label: 'Compuesta' },
  { value: 'unipersonal', label: 'Unipersonal' }, { value: 'otro', label: 'Otro' },
]
const apgarOpciones = [
  { value: '0-3', label: '0-3 Funcionalmente apgar grave' },
  { value: '4-6', label: '4-6 Funcionalmente apgar moderado' },
  { value: '7-10', label: '7-10 Funcionalmente apgar normal' },
]
const zaritOpciones = [
  { value: '0-20', label: '0-20 Sin sobrecarga' },
  { value: '21-40', label: '21-40 Sobrecarga leve' },
  { value: '41-60', label: '41-60 Sobrecarga intensa' },
  { value: '61-88', label: '61-88 Sobrecarga muy intensa' },
]

export default function ComposicionFamiliarForm({ data, onChange }: Props) {
  const update = (key: keyof ComposicionFamiliar, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <Section title="4. COMPOSICIÓN FAMILIAR">
      <div className="form-grid">
        <FormField label="Tipo Familia" name="tipoFamilia" value={data.tipoFamilia} onChange={(v) => update('tipoFamilia', v)} options={tipoFamilia} />
        <FormField label="Número de personas en la familia" name="numeroPersonasFamilia" value={data.numeroPersonasFamilia} onChange={(v) => update('numeroPersonasFamilia', v)} type="number" />
        <FormField label="Código Resultado APGAR" name="apgar" value={data.codigoResultadoAPGAR} onChange={(v) => update('codigoResultadoAPGAR', v)} options={apgarOpciones} />
        <FormField label="Cuidador" name="cuidador" value={data.cuidador} onChange={(v) => update('cuidador', v)} />
        <FormField label="Escala ZARIT" name="zarit" value={data.escalaZARIT} onChange={(v) => update('escalaZARIT', v)} options={zaritOpciones} />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <FormFieldTextarea label="Familograma" name="familiograma" value={data.familiograma} onChange={(v) => update('familiograma', v)} rows={4} placeholder="Describa o pegue el familiograma" />
        <FormFieldTextarea label="Ecomapa" name="ecomapa" value={data.ecomapa} onChange={(v) => update('ecomapa', v)} rows={4} placeholder="Describa o pegue el ecomapa" />
      </div>
    </Section>
  )
}
