import Section from '../Section'
import FormField from '../FormField'
import type { GruposPrioritarios } from '../../types'

interface Props {
  data: GruposPrioritarios
  onChange: (data: GruposPrioritarios) => void
}

const siNo = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export default function GruposPrioritariosForm({ data, onChange }: Props) {
  const update = (key: keyof GruposPrioritarios, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <Section title="5. GRUPOS PRIORITARIOS">
      <div className="form-grid">
        <FormField label="Niños Niñas Adolescentes" name="nna" value={data.ninosNinasAdolescentes} onChange={(v) => update('ninosNinasAdolescentes', v)} options={siNo} />
        <FormField label="Gestantes" name="gestantes" value={data.gestantes} onChange={(v) => update('gestantes', v)} options={siNo} />
        <FormField label="Adultos Mayores" name="adultosMayores" value={data.adultosMayores} onChange={(v) => update('adultosMayores', v)} options={siNo} />
        <FormField label="Víctimas Conflicto" name="victimasConflicto" value={data.victimasConflicto} onChange={(v) => update('victimasConflicto', v)} options={siNo} />
        <FormField label="Personas Discapacidad" name="discapacidad" value={data.personasDiscapacidad} onChange={(v) => update('personasDiscapacidad', v)} options={siNo} />
        <FormField label="Enfermedades Huérfanas" name="huerfanas" value={data.enfermedadesHuerfanas} onChange={(v) => update('enfermedadesHuerfanas', v)} options={siNo} />
        <FormField label="Enfermedades Transmisibles" name="transmisibles" value={data.enfermedadesTransmisibles} onChange={(v) => update('enfermedadesTransmisibles', v)} options={siNo} />
        <FormField label="Otras Enfermedades Transmisibles" name="otrasTransmisibles" value={data.otrasEnfermedadesTransmisibles} onChange={(v) => update('otrasEnfermedadesTransmisibles', v)} />
        <FormField label="Sucesos Vitales Normativos" name="sucesosVitales" value={data.sucesosVitalesNormativos} onChange={(v) => update('sucesosVitalesNormativos', v)} options={siNo} />
        <FormField label="En Situación Vulnerabilidad" name="vulnerabilidad" value={data.enSituacionVulnerabilidad} onChange={(v) => update('enSituacionVulnerabilidad', v)} options={siNo} />
      </div>
    </Section>
  )
}
