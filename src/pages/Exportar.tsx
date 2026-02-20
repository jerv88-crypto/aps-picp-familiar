import { useState } from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { loadFormData, loadAnalisis } from '../lib/storage'
import { getInitialFormData } from '../lib/initialData'
import { exportarAExcel, generarNombreArchivo } from '../lib/excelExport'

export default function Exportar() {
  const [confirmando, setConfirmando] = useState(false)

  const descargarExcel = () => {
    const data = loadFormData() ?? getInitialFormData()
    const analisis = loadAnalisis()

    const blob = exportarAExcel(data, analisis)
    const nombre = generarNombreArchivo(data)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nombre
    a.click()
    URL.revokeObjectURL(url)
    setConfirmando(false)
  }

  const handleExportar = () => {
    setConfirmando(true)
  }

  const handleConfirmar = () => {
    descargarExcel()
  }

  const handleCancelar = () => {
    setConfirmando(false)
  }

  const data = loadFormData() ?? getInitialFormData()
  const analisis = loadAnalisis()
  const nombreArchivo = generarNombreArchivo(data)

  return (
    <div className="exportar-page">
      <div className="page-header">
        <h2>Exportar a Excel</h2>
        <p>Genera el archivo Excel con toda la información del PICP en una sola hoja</p>
      </div>

      <div className="exportar-card">
        <div className="exportar-info">
          <FileSpreadsheet size={48} className="exportar-icon" />
          <h3>Exportación del Plan Integral de Cuidado Primario</h3>
          <p>El archivo incluirá toda la información en una sola hoja:</p>
          <ul>
            <li>Datos generales familia</li>
            <li>Integrantes y ciclo de vida</li>
            <li>Análisis PICP</li>
            <li>Seguimiento</li>
            <li>Tamizajes por integrante</li>
          </ul>
          <p className="nombre-preview">
            <strong>Nombre del archivo:</strong><br />
            <code>{nombreArchivo}</code>
          </p>
        </div>

        {!confirmando ? (
          <button type="button" className="btn btn-success btn-exportar" onClick={handleExportar}>
            <Download size={20} />
            Exportar a Excel
          </button>
        ) : (
          <div className="confirmacion">
            <p>¿Confirmar la exportación del archivo Excel?</p>
            <div className="confirmacion-buttons">
              <button type="button" className="btn btn-primary" onClick={handleConfirmar}>
                Sí, exportar
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {!analisis && (
        <div className="exportar-aviso">
          <p>No se ha generado el análisis PICP. Las secciones de Análisis, Seguimiento y Tamizajes pueden quedar vacías o incompletas. Se recomienda ejecutar el análisis en la pestaña correspondiente antes de exportar.</p>
        </div>
      )}
    </div>
  )
}
