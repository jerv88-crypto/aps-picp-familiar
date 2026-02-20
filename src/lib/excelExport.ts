import * as XLSX from 'xlsx'
import type { FormData, AnalisisPICP } from '../types'
import { obtenerTamizajeInfo } from './ley3280'

function normalizar(texto: string): string {
  return (texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,\s]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toUpperCase() || 'SIN_DATO'
}

export function generarNombreArchivo(data: FormData): string {
  const d = data.datosGenerales
  const integrantes = data.integrantes.length > 0
    ? data.integrantes.map((i) => `${i.nombres}_${i.apellidos}`).join('_')
    : 'SIN_INTEGRANTES'
  const partes = [
    normalizar(d.codigoIdFamilia),
    normalizar(d.codigoTerritorio),
    normalizar(d.codigoMicroterritorio),
    normalizar(d.corregimiento),
    normalizar(d.direccion),
    normalizar(d.numeroIdentificacionHogar),
    normalizar(d.codigoFicha),
    normalizar(integrantes),
  ]
  return partes.filter(Boolean).join('_') + '.xlsx'
}

export function exportarAExcel(data: FormData, analisis: AnalisisPICP | null): Blob {
  const dg = data.datosGenerales
  const filas: (string | number)[][] = []

  filas.push(['PICP — Plan Integral de Cuidado Primario en Salud (Ley 3280/2018)'])
  filas.push(['Documento generado desde APS Familiar'])
  filas.push([])

  /* 1. Datos Generales Familia */
  filas.push(['1. DATOS GENERALES DE LA FAMILIA'])
  filas.push([])
  filas.push(['Campo', 'Valor'])
  filas.push(['Código ID Familia', dg.codigoIdFamilia])
  filas.push(['Código Territorio', dg.codigoTerritorio])
  filas.push(['Código Microterritorio', dg.codigoMicroterritorio])
  filas.push(['Corregimiento', dg.corregimiento])
  filas.push(['Dirección', dg.direccion])
  filas.push(['Nº Identificación Hogar', dg.numeroIdentificacionHogar])
  filas.push(['Nº Identificación Familia', dg.numeroIdentificacionFamilia])
  filas.push(['Estrato Vivienda', dg.estratoVivienda])
  filas.push(['Nº Hogares Vivienda', dg.numeroHogaresVivienda])
  filas.push(['Nº Familias Vivienda', dg.numeroFamiliasVivienda])
  filas.push(['Nº Personas Vivienda', dg.numeroPersonasVivienda])
  filas.push(['Código Ficha', dg.codigoFicha])
  filas.push(['Fecha Diligenciamiento', dg.fechaDiligenciamientoFicha])
  filas.push(['Teléfono', dg.telefonoContacto])
  filas.push(['Código Tipo Vivienda', dg.codigoTipoVivienda])
  filas.push([])
  filas.push([])

  /* 2. Integrantes y Ciclo de Vida */
  filas.push(['2. INTEGRANTES Y CICLO DE VIDA'])
  filas.push([])
  filas.push(['Nombres', 'Apellidos', 'Cédula', 'Edad', 'Ciclo de Vida', 'Tamizajes'])
  for (const i of data.integrantes) {
    const info = obtenerTamizajeInfo(i)
    filas.push([i.nombres, i.apellidos, i.cedula, i.edad, info.cicloVida, info.tamizajes.join('; ')])
  }
  filas.push([])
  filas.push([])

  /* 3. Análisis PICP */
  if (analisis) {
    filas.push(['3. ANÁLISIS PICP'])
    filas.push([])
    filas.push(['3.1 Descripción del caso'])
    filas.push([analisis.descripcionCaso])
    filas.push([])
    filas.push(['3.2 Objetivo general'])
    filas.push([analisis.objetivoGeneral])
    filas.push([])
    filas.push(['3.3 Metas'])
    for (const m of analisis.metas) filas.push([m])
    filas.push([])
    filas.push(['3.4 Tipo de intervención'])
    filas.push([analisis.tipoIntervencion])
    filas.push([])
    filas.push(['3.5 Tabla de evaluación'])
    filas.push(['Aspecto evaluado', 'Información ficha', 'Conclusiones', 'Profesional recomendado'])
    for (const r of analisis.tablaEvaluacion) {
      filas.push([r.aspectoEvaluado, r.informacionFicha, r.conclusionesIntervencion, r.profesionalRecomendado])
    }
    filas.push([])
    filas.push(['3.6 Seguimiento'])
    filas.push(['Fecha seguimiento', 'Intervenciones a realizar', 'Sugerencias según riesgo', 'Conclusiones', 'Profesional responsable'])
    for (const r of analisis.tablaSeguimiento) {
      filas.push([r.fechaSeguimiento, r.intervencionesRealizar, r.sugerenciasIntervencionRiesgo, r.conclusionesIntervencion, r.profesionalResponsable])
    }
    filas.push([])
    filas.push(['3.7 Tamizajes por integrante (Ley 3280)'])
    filas.push(['Integrante', 'Edad', 'Ciclo de vida', 'Tamizajes Ley 3280', 'Recomendación profesional'])
    for (const r of analisis.tablaTamizajes) {
      filas.push([r.integrante, r.edad, r.cicloVida, r.tamizajesLey3280, r.recomendacionProfesional])
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(filas)
  ws['!cols'] = [
    { wch: 28 },
    { wch: 50 },
    { wch: 40 },
    { wch: 35 },
    { wch: 28 },
    { wch: 45 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'PICP Completo')

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}
