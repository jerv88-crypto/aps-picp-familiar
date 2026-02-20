import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { loadFormData, saveFormData } from '../lib/storage'
import { getInitialFormData } from '../lib/initialData'
import type { FormData } from '../types'
import DatosGeneralesForm from '../components/forms/DatosGeneralesForm'
import CaracteristicasViviendaForm from '../components/forms/CaracteristicasViviendaForm'
import AguaSaneamientoForm from '../components/forms/AguaSaneamientoForm'
import ComposicionFamiliarForm from '../components/forms/ComposicionFamiliarForm'
import GruposPrioritariosForm from '../components/forms/GruposPrioritariosForm'
import PracticasRecursosForm from '../components/forms/PracticasRecursosForm'
import CicloVidaIntegrantesForm from '../components/forms/CicloVidaIntegrantesForm'

export default function Formulario() {
  const [data, setData] = useState<FormData>(() => {
    const loaded = loadFormData()
    return loaded ?? getInitialFormData()
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      saveFormData(data)
    }, 500)
    return () => clearTimeout(timer)
  }, [data])

  const guardar = () => {
    saveFormData(data)
    alert('Información guardada correctamente.')
  }

  return (
    <div className="formulario-page">
      <div className="page-header">
        <h2>Formato Integral de Plan de Cuidado Primario en Salud (APS) Familiar</h2>
        <p>Diligenciar la información según la ficha de caracterización familiar</p>
        <button type="button" className="btn btn-primary" onClick={guardar}>
          <Save size={18} />
          Guardar
        </button>
      </div>

      <DatosGeneralesForm data={data.datosGenerales} onChange={(d) => setData({ ...data, datosGenerales: d })} />
      <CaracteristicasViviendaForm data={data.caracteristicasVivienda} onChange={(d) => setData({ ...data, caracteristicasVivienda: d })} />
      <AguaSaneamientoForm data={data.aguaSaneamientoResiduos} onChange={(d) => setData({ ...data, aguaSaneamientoResiduos: d })} />
      <ComposicionFamiliarForm data={data.composicionFamiliar} onChange={(d) => setData({ ...data, composicionFamiliar: d })} />
      <GruposPrioritariosForm data={data.gruposPrioritarios} onChange={(d) => setData({ ...data, gruposPrioritarios: d })} />
      <PracticasRecursosForm data={data.practicasRecursos} onChange={(d) => setData({ ...data, practicasRecursos: d })} />
      <CicloVidaIntegrantesForm integrantes={data.integrantes} onChange={(int) => setData({ ...data, integrantes: int })} />
    </div>
  )
}
