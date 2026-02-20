import { useState } from 'react'
import { BarChart3, Loader2 } from 'lucide-react'
import { loadFormData, loadAnalisis, saveAnalisis } from '../lib/storage'
import { getInitialFormData } from '../lib/initialData'
import { generarAnalisisPICP } from '../services/analisis'
import { getPromptPICPFromServer } from '../lib/adminConfigApi'
import { savePlan, getPlanSummary } from '../lib/plansApi'
import { useAuth } from '../context/AuthContext'
import PaymentModal from '../components/PaymentModal'

export default function Analisis() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [analisis, setAnalisis] = useState(loadAnalisis())
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const ejecutarAnalisis = async () => {
    const data = loadFormData() ?? getInitialFormData()
    if (!data.datosGenerales.codigoIdFamilia && data.integrantes.length === 0) {
      alert('Complete al menos los datos generales o agregue integrantes antes de ejecutar el análisis.')
      return
    }
    setLoading(true)
    try {
      const promptServer = await getPromptPICPFromServer()
      const resultado = await generarAnalisisPICP(data, promptServer || undefined)
      saveAnalisis(resultado)

      if (user) {
        const saveResult = await savePlan(user.id, data, resultado)
        if ('error' in saveResult) {
          console.warn('No se pudo guardar el plan en el servidor:', saveResult.error)
        }
        const summary = await getPlanSummary(user.id)
        if (summary.planesPendientesPago > 0) {
          setShowPaymentModal(true)
        }
      }

      setAnalisis(resultado)
    } catch (err) {
      console.error(err)
      alert('Error al generar el análisis. Intente de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="analisis-page">
      <div className="page-header">
        <h2>Análisis PICP</h2>
        <p>Plan Integral de Cuidado Primario generado a partir de la información diligenciada</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={ejecutarAnalisis}
          disabled={loading}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <BarChart3 size={18} />}
          {loading ? 'Generando análisis...' : 'Generar Análisis PICP'}
        </button>
      </div>

      {analisis && !loading && (
        <div className="analisis-content">
          <section className="analisis-section">
            <h3>Descripción del caso</h3>
            <p className="descripcion">{analisis.descripcionCaso}</p>
          </section>

          <section className="analisis-section">
            <h3>Tabla de evaluación</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Aspecto evaluado</th>
                    <th>Información de la ficha</th>
                    <th>Conclusiones de la intervención</th>
                    <th>Profesional recomendado</th>
                  </tr>
                </thead>
                <tbody>
                  {analisis.tablaEvaluacion.map((row, i) => (
                    <tr key={i}>
                      <td>{row.aspectoEvaluado}</td>
                      <td>{row.informacionFicha}</td>
                      <td>{row.conclusionesIntervencion}</td>
                      <td>{row.profesionalRecomendado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="analisis-section">
            <h3>Tabla de seguimiento</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha de seguimiento</th>
                    <th>Intervenciones a realizar</th>
                    <th>Sugerencias para la intervención según riesgo</th>
                    <th>Conclusiones para la intervención</th>
                    <th>Profesional responsable</th>
                  </tr>
                </thead>
                <tbody>
                  {analisis.tablaSeguimiento.map((row, i) => (
                    <tr key={i}>
                      <td>{row.fechaSeguimiento}</td>
                      <td>{row.intervencionesRealizar}</td>
                      <td>{row.sugerenciasIntervencionRiesgo}</td>
                      <td>{row.conclusionesIntervencion}</td>
                      <td>{row.profesionalResponsable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="analisis-section">
            <h3>Tamizajes por integrante (Ley 3280)</h3>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Integrante</th>
                    <th>Edad</th>
                    <th>Ciclo de vida</th>
                    <th>Tamizajes según Ley 3280</th>
                    <th>Recomendación profesional</th>
                  </tr>
                </thead>
                <tbody>
                  {analisis.tablaTamizajes.map((row, i) => (
                    <tr key={i}>
                      <td>{row.integrante}</td>
                      <td>{row.edad}</td>
                      <td>{row.cicloVida}</td>
                      <td>{row.tamizajesLey3280}</td>
                      <td>{row.recomendacionProfesional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="analisis-section">
            <h3>Objetivo general del PICP</h3>
            <p>{analisis.objetivoGeneral}</p>
          </section>

          <section className="analisis-section">
            <h3>Metas a cumplir</h3>
            <ul>
              {analisis.metas.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </section>

          <section className="analisis-section">
            <h3>Tipo de intervención</h3>
            <p>{analisis.tipoIntervencion}</p>
          </section>
        </div>
      )}

      {!analisis && !loading && (
        <div className="analisis-empty">
          <p>No hay análisis generado. Presione el botón "Generar Análisis PICP" para crear el plan.</p>
        </div>
      )}

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPaymentRegistered={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  )
}
