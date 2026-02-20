import Section from '../Section'
import FormField from '../FormField'
import type { CaracteristicasVivienda } from '../../types'

interface Props {
  data: CaracteristicasVivienda
  onChange: (data: CaracteristicasVivienda) => void
}

const materialesParedes = [
  { value: 'ladrillo', label: 'Ladrillo' }, { value: 'block', label: 'Block' },
  { value: 'madera', label: 'Madera' }, { value: 'bahareque', label: 'Bahareque' },
  { value: 'otro', label: 'Otro' },
]
const materialesPiso = [
  { value: 'cemento', label: 'Cemento' }, { value: 'baldosa', label: 'Baldosa' },
  { value: 'madera', label: 'Madera' }, { value: 'tierra', label: 'Tierra' },
  { value: 'otro', label: 'Otro' },
]
const materialesTecho = [
  { value: 'concreto', label: 'Concreto' }, { value: 'teja', label: 'Teja' },
  { value: 'zinc', label: 'Zinc' }, { value: 'paja', label: 'Paja' },
  { value: 'otro', label: 'Otro' },
]
const siNo = [{ value: 'si', label: 'Sí' }, { value: 'no', label: 'No' }]

export default function CaracteristicasViviendaForm({ data, onChange }: Props) {
  const update = (key: keyof CaracteristicasVivienda, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <Section title="2. CARACTERÍSTICAS DE LA VIVIENDA">
      <div className="form-grid">
        <FormField label="Material Predominante Paredes" name="materialParedes" value={data.materialPredominanteParedes} onChange={(v) => update('materialPredominanteParedes', v)} options={materialesParedes} />
        <FormField label="Descripción Otro Material Paredes" name="otroParedes" value={data.descripcionOtroMaterialParedes} onChange={(v) => update('descripcionOtroMaterialParedes', v)} />
        <FormField label="Material Predominante Piso" name="materialPiso" value={data.materialPredominantePiso} onChange={(v) => update('materialPredominantePiso', v)} options={materialesPiso} />
        <FormField label="Descripción Otro Material Piso" name="otroPiso" value={data.descripcionOtroMaterialPiso} onChange={(v) => update('descripcionOtroMaterialPiso', v)} />
        <FormField label="Material Predominante Techo" name="materialTecho" value={data.materialPredominanteTecho} onChange={(v) => update('materialPredominanteTecho', v)} options={materialesTecho} />
        <FormField label="Descripción Otro Material Techo" name="otroTecho" value={data.descripcionOtroMaterialTecho} onChange={(v) => update('descripcionOtroMaterialTecho', v)} />
        <FormField label="Hacinamiento" name="hacinamiento" value={data.hacinamiento} onChange={(v) => update('hacinamiento', v)} options={siNo} />
        <FormField label="Código Riesgo Accidente Vivienda" name="riesgoAccidente" value={data.codigoRiesgoAccidenteVivienda} onChange={(v) => update('codigoRiesgoAccidenteVivienda', v)} />
        <FormField label="Sitios Interés Fácil Acceso Vivienda" name="sitiosInteres" value={data.sitiosInteresFacilAccesoVivienda} onChange={(v) => update('sitiosInteresFacilAccesoVivienda', v)} />
        <FormField label="Fuentes Energía Combustible Cocinar" name="fuentesEnergia" value={data.fuentesEnergiaCombustibleCocinar} onChange={(v) => update('fuentesEnergiaCombustibleCocinar', v)} />
        <FormField label="Observa Criaderos Vectores" name="criaderosVectores" value={data.observaCriaderosVectores} onChange={(v) => update('observaCriaderosVectores', v)} options={siNo} />
        <FormField label="Observa Criaderos Vectores Cerca a la Vivienda" name="criaderosCerca" value={data.observaCriaderosVectoresCercaVivienda} onChange={(v) => update('observaCriaderosVectoresCercaVivienda', v)} options={siNo} />
        <FormField label="Actividad Económica en Vivienda" name="actividadEconomica" value={data.actividadEconomicaVivienda} onChange={(v) => update('actividadEconomicaVivienda', v)} options={siNo} />
        <FormField label="Animales en Vivienda Entorno Inmediato" name="animales" value={data.animalesViviendaEntornoInmediato} onChange={(v) => update('animalesViviendaEntornoInmediato', v)} options={siNo} />
        <FormField label="Descripción Tipo Animal" name="tipoAnimal" value={data.descripcionTipoAnimal} onChange={(v) => update('descripcionTipoAnimal', v)} />
        <FormField label="Número Animales" name="numeroAnimales" value={data.numeroAnimales} onChange={(v) => update('numeroAnimales', v)} type="number" />
      </div>
    </Section>
  )
}
