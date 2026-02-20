import type { FormData, AnalisisPICP, TablaEvaluacionItem, TablaSeguimientoItem, TablaTamizajeItem } from '../types'
import { obtenerTamizajeInfo } from '../lib/ley3280'
import { getPromptPICP } from '../lib/storage'

/** Si se pasa promptOverride se usa en lugar del almacenado (ej. desde admin_config en servidor). */
export type PromptOverride = string | null | undefined

const OBJETIVO_DEFAULT = 'Contribuir al mejoramiento del estado de salud y calidad de vida de la familia mediante la implementación de intervenciones integrales de promoción, prevención y atención primaria, en el marco de las RIAS y la Ley 3280 de 2018.'
const TIPO_INTERVENCION_DEFAULT = 'Intervención integral e intersectorial que articula acciones de promoción de la salud, prevención de la enfermedad, valoración según ciclo de vida y tamizajes RIAS, con enfoque familiar y comunitario.'

export async function generarAnalisisPICP(data: FormData, promptOverride?: PromptOverride): Promise<AnalisisPICP> {
  const integrantesTexto = data.integrantes.length > 0
    ? data.integrantes.map((i) => `${i.nombres} ${i.apellidos} (${i.edad} años)`).join(', ')
    : 'No hay integrantes registrados'

  const descripcionCaso = `La familia está conformada por ${integrantesTexto}. Reside en ${data.datosGenerales.direccion}, corregimiento de ${data.datosGenerales.corregimiento}. La vivienda presenta condiciones de ${data.caracteristicasVivienda.materialPredominanteParedes || 'no especificadas'} en paredes y ${data.caracteristicasVivienda.materialPredominantePiso || 'no especificadas'} en piso. El tipo de familia es ${data.composicionFamiliar.tipoFamilia || 'no especificado'} con ${data.composicionFamiliar.numeroPersonasFamilia || 'N/A'} personas. Resultado APGAR: ${data.composicionFamiliar.codigoResultadoAPGAR || 'no aplicado'}. La familia cuenta con acceso a agua mediante ${data.aguaSaneamientoResiduos.principalFuenteAguaConsumoHumano || 'fuente no especificada'} y disposición de excretas por ${data.aguaSaneamientoResiduos.disposicionExcretas || 'no especificada'}.`

  const tablaEvaluacion: TablaEvaluacionItem[] = [
    {
      aspectoEvaluado: 'Características de la vivienda',
      informacionFicha: `Material paredes: ${data.caracteristicasVivienda.materialPredominanteParedes || 'N/A'}, piso: ${data.caracteristicasVivienda.materialPredominantePiso || 'N/A'}, techo: ${data.caracteristicasVivienda.materialPredominanteTecho || 'N/A'}. Hacinamiento: ${data.caracteristicasVivienda.hacinamiento || 'N/A'}.`,
      conclusionesIntervencion: 'Se recomienda valoración del entorno habitacional para identificar riesgos de accidentes y condiciones que puedan afectar la salud familiar. Intervención interdisciplinaria con saneamiento básico según hallazgos.',
      profesionalRecomendado: 'Enfermería, Bacteriólogo, Trabajador Social.',
    },
    {
      aspectoEvaluado: 'Agua, saneamiento y residuos',
      informacionFicha: `Fuente agua: ${data.aguaSaneamientoResiduos.principalFuenteAguaConsumoHumano || 'N/A'}. Disposición excretas: ${data.aguaSaneamientoResiduos.disposicionExcretas || 'N/A'}. Residuos sólidos: ${data.aguaSaneamientoResiduos.disposicionResiduosSolidos || 'N/A'}.`,
      conclusionesIntervencion: 'Evaluar calidad del agua de consumo y promover prácticas seguras. Fortalecer educación en disposición adecuada de excretas y residuos sólidos.',
      profesionalRecomendado: 'Bacteriólogo, Ingeniería Sanitaria, Auxiliar de Salud Ambiental.',
    },
    {
      aspectoEvaluado: 'Composición y dinámica familiar',
      informacionFicha: `Tipo familia: ${data.composicionFamiliar.tipoFamilia || 'N/A'}. APGAR: ${data.composicionFamiliar.codigoResultadoAPGAR || 'N/A'}. Escala ZARIT: ${data.composicionFamiliar.escalaZARIT || 'N/A'}. Cuidador: ${data.composicionFamiliar.cuidador || 'N/A'}.`,
      conclusionesIntervencion: 'Valorar funcionamiento familiar y red de apoyo. Atención especial al cuidador según escala ZARIT. Trabajo en fortalecimiento de vínculos y pautas de crianza.',
      profesionalRecomendado: 'Psicología, Trabajador Social, Enfermería.',
    },
    {
      aspectoEvaluado: 'Grupos prioritarios',
      informacionFicha: `NNA: ${data.gruposPrioritarios.ninosNinasAdolescentes || 'N/A'}, Gestantes: ${data.gruposPrioritarios.gestantes || 'N/A'}, Adultos mayores: ${data.gruposPrioritarios.adultosMayores || 'N/A'}, Víctimas conflicto: ${data.gruposPrioritarios.victimasConflicto || 'N/A'}, Discapacidad: ${data.gruposPrioritarios.personasDiscapacidad || 'N/A'}.`,
      conclusionesIntervencion: 'Priorizar tamizajes según ciclo de vida y condiciones especiales. Articular con programas de promoción y prevención. Seguimiento a gestantes y menores según RIAS.',
      profesionalRecomendado: 'Médico, Enfermería, Odontología, Psicología según grupo.',
    },
    {
      aspectoEvaluado: 'Prácticas y recursos',
      informacionFicha: `Fuente alimentos: ${data.practicasRecursos.fuenteAlimentos || 'N/A'}. Antecedentes: ${data.practicasRecursos.conAntecedentesEnfermedades || 'N/A'}. Hábitos saludables: ${data.practicasRecursos.habitosVidaSaludable || 'N/A'}.`,
      conclusionesIntervencion: 'Promover estilos de vida saludable. Fortalecer prácticas de autocuidado. Identificar redes comunitarias de apoyo y exigibilidad de derechos.',
      profesionalRecomendado: 'Nutrición, Trabajador Social, Promotor de Salud.',
    },
  ]

  const tablaSeguimiento: TablaSeguimientoItem[] = [
    { fechaSeguimiento: '', intervencionesRealizar: 'Visita domiciliaria de seguimiento', sugerenciasIntervencionRiesgo: 'Valorar condiciones de vivienda y entorno', conclusionesIntervencion: 'Evaluar cumplimiento de recomendaciones', profesionalResponsable: 'Enfermería' },
    { fechaSeguimiento: '', intervencionesRealizar: 'Tamizajes según ciclo de vida', sugerenciasIntervencionRiesgo: 'Coordinar citas según edad de integrantes', conclusionesIntervencion: 'Completar esquema de tamizajes RIAS', profesionalResponsable: 'Médico / Enfermería' },
    { fechaSeguimiento: '', intervencionesRealizar: 'Seguimiento a cuidador familiar', sugerenciasIntervencionRiesgo: 'Valorar sobrecarga según ZARIT', conclusionesIntervencion: 'Fortalecer red de apoyo', profesionalResponsable: 'Psicología' },
    { fechaSeguimiento: '', intervencionesRealizar: 'Educación en saneamiento básico', sugerenciasIntervencionRiesgo: 'Priorizar según hallazgos', conclusionesIntervencion: 'Promover prácticas saludables', profesionalResponsable: 'Auxiliar Salud Ambiental' },
  ]

  const tablaTamizajes: TablaTamizajeItem[] = data.integrantes.map((int) => {
    const info = obtenerTamizajeInfo(int)
    return {
      integrante: `${int.nombres} ${int.apellidos}`,
      edad: int.edad,
      cicloVida: info.cicloVida,
      tamizajesLey3280: info.tamizajes.join('; '),
      recomendacionProfesional: info.recomendacion,
    }
  })

  const promptCustom = (promptOverride !== undefined && promptOverride !== null ? promptOverride : getPromptPICP()) ?? ''
  const objetivoGeneral = promptCustom.trim() ? promptCustom : OBJETIVO_DEFAULT
  const tipoIntervencion = TIPO_INTERVENCION_DEFAULT

  const metas = [
    'Completar tamizajes según ciclo de vida de cada integrante en el plazo establecido.',
    'Reducir factores de riesgo identificados en vivienda y entorno.',
    'Fortalecer prácticas de autocuidado y estilos de vida saludable.',
    'Garantizar seguimiento a grupos prioritarios según normativa.',
    'Articular red de apoyo familiar y comunitaria.',
  ]

  return {
    descripcionCaso,
    tablaEvaluacion,
    tablaSeguimiento,
    objetivoGeneral,
    metas,
    tipoIntervencion,
    tablaTamizajes,
  }
}
