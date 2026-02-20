import Section from '../Section'
import FormField from '../FormField'
import FormFieldTextarea from '../FormFieldTextarea'
import type { PracticasRecursos } from '../../types'

interface Props {
  data: PracticasRecursos
  onChange: (data: PracticasRecursos) => void
}

const siNo = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export default function PracticasRecursosForm({ data, onChange }: Props) {
  const update = (key: keyof PracticasRecursos, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <Section title="6. PRÁCTICAS Y RECURSOS">
      <div className="form-grid">
        <FormField label="Prácticas Cuidado Salud Críticas" name="practicasCriticas" value={data.practicasCuidadoSaludCriticas} onChange={(v) => update('practicasCuidadoSaludCriticas', v)} />
        <FormField label="Con Antecedentes de Enfermedades" name="antecedentes" value={data.conAntecedentesEnfermedades} onChange={(v) => update('conAntecedentesEnfermedades', v)} options={siNo} />
        <FormField label="Fuente Alimentos" name="fuenteAlimentos" value={data.fuenteAlimentos} onChange={(v) => update('fuenteAlimentos', v)} />
        <FormField label="Otras fuentes de alimentos" name="otrasFuentesAlimentos" value={data.otrasFuentesAlimentos} onChange={(v) => update('otrasFuentesAlimentos', v)} />
        <FormField label="Hábitos Vida Saludable" name="habitos" value={data.habitosVidaSaludable} onChange={(v) => update('habitosVidaSaludable', v)} />
        <FormField label="Recursos Socioemocionales Cuidado Salud" name="recursosSocio" value={data.recursosSocioemocionalesCuidadoSalud} onChange={(v) => update('recursosSocioemocionalesCuidadoSalud', v)} />
        <FormField label="Prácticas Cuidado Entorno" name="cuidadoEntorno" value={data.practicasCuidadoEntorno} onChange={(v) => update('practicasCuidadoEntorno', v)} />
        <FormField label="Prácticas Relaciones Sanas Constructivas" name="relacionesSanas" value={data.practicasRelacionesSanasConstructivas} onChange={(v) => update('practicasRelacionesSanasConstructivas', v)} />
        <FormField label="Recursos Socio Comunitarios Promoción Salud" name="recursosComunitarios" value={data.recursosSocioComunitariosPromocionSalud} onChange={(v) => update('recursosSocioComunitariosPromocionSalud', v)} />
        <FormField label="Prácticas Autonomía Capacidad Funcional Adulto Mayor" name="autonomiaAM" value={data.practicasAutonomiaCapacidadFuncionalAdultoMayor} onChange={(v) => update('practicasAutonomiaCapacidadFuncionalAdultoMayor', v)} />
        <FormField label="Prácticas Prevención Enfermedades Para Todos" name="prevencion" value={data.practicasPrevencionEnfermedadesParaTodos} onChange={(v) => update('practicasPrevencionEnfermedadesParaTodos', v)} />
        <FormField label="Prácticas Saberes Ancestrales" name="saberesAncestrales" value={data.practicasSaberesAncestrales} onChange={(v) => update('practicasSaberesAncestrales', v)} />
        <FormField label="Exigibilidad Derecho Salud" name="exigibilidad" value={data.exigibilidadDerechoSalud} onChange={(v) => update('exigibilidadDerechoSalud', v)} />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <FormFieldTextarea label="Descripción Antecedentes" name="descripcionAntecedentes" value={data.descripcionAntecedentes} onChange={(v) => update('descripcionAntecedentes', v)} rows={4} />
      </div>
    </Section>
  )
}
