import Section from '../Section'
import FormField from '../FormField'
import type { DatosGenerales } from '../../types'

interface Props {
  data: DatosGenerales
  onChange: (data: DatosGenerales) => void
}

export default function DatosGeneralesForm({ data, onChange }: Props) {
  const update = (key: keyof DatosGenerales, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <Section title="1. DATOS GENERALES" defaultOpen={true}>
      <div className="form-grid">
        <FormField label="Código ID de familia" name="codigoIdFamilia" value={data.codigoIdFamilia} onChange={(v) => update('codigoIdFamilia', v)} required />
        <FormField label="Código Territorio" name="codigoTerritorio" value={data.codigoTerritorio} onChange={(v) => update('codigoTerritorio', v)} required />
        <FormField label="Código Microterritorio" name="codigoMicroterritorio" value={data.codigoMicroterritorio} onChange={(v) => update('codigoMicroterritorio', v)} />
        <FormField label="Corregimiento" name="corregimiento" value={data.corregimiento} onChange={(v) => update('corregimiento', v)} />
        <FormField label="Dirección" name="direccion" value={data.direccion} onChange={(v) => update('direccion', v)} />
        <FormField label="Número Identificación Hogar" name="numeroIdentificacionHogar" value={data.numeroIdentificacionHogar} onChange={(v) => update('numeroIdentificacionHogar', v)} />
        <FormField label="Número Identificación Familia" name="numeroIdentificacionFamilia" value={data.numeroIdentificacionFamilia} onChange={(v) => update('numeroIdentificacionFamilia', v)} />
        <FormField label="Estrato Vivienda" name="estratoVivienda" value={data.estratoVivienda} onChange={(v) => update('estratoVivienda', v)} options={[
          { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' },
          { value: '4', label: '4' }, { value: '5', label: '5' }, { value: '6', label: '6' },
        ]} />
        <FormField label="Número Hogares Vivienda" name="numeroHogaresVivienda" value={data.numeroHogaresVivienda} onChange={(v) => update('numeroHogaresVivienda', v)} type="number" />
        <FormField label="Número Familias Vivienda" name="numeroFamiliasVivienda" value={data.numeroFamiliasVivienda} onChange={(v) => update('numeroFamiliasVivienda', v)} type="number" />
        <FormField label="Número Personas Vivienda" name="numeroPersonasVivienda" value={data.numeroPersonasVivienda} onChange={(v) => update('numeroPersonasVivienda', v)} type="number" />
        <FormField label="Código Ficha" name="codigoFicha" value={data.codigoFicha} onChange={(v) => update('codigoFicha', v)} />
        <FormField label="Fecha Diligenciamiento Ficha" name="fechaDiligenciamientoFicha" value={data.fechaDiligenciamientoFicha} onChange={(v) => update('fechaDiligenciamientoFicha', v)} type="date" required />
        <FormField label="Teléfono de contacto" name="telefonoContacto" value={data.telefonoContacto} onChange={(v) => update('telefonoContacto', v)} />
        <FormField label="Código Tipo Vivienda" name="codigoTipoVivienda" value={data.codigoTipoVivienda} onChange={(v) => update('codigoTipoVivienda', v)} />
      </div>
    </Section>
  )
}
