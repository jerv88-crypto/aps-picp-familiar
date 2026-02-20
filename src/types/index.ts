export type Rol = 'ADMIN' | 'USUARIO';

export interface Integrante {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  edad: number;
  tamizajes?: string[];
  cicloVida?: string;
}

export interface FormData {
  datosGenerales: DatosGenerales;
  caracteristicasVivienda: CaracteristicasVivienda;
  aguaSaneamientoResiduos: AguaSaneamientoResiduos;
  composicionFamiliar: ComposicionFamiliar;
  gruposPrioritarios: GruposPrioritarios;
  practicasRecursos: PracticasRecursos;
  integrantes: Integrante[];
}

export interface DatosGenerales {
  codigoIdFamilia: string;
  codigoTerritorio: string;
  codigoMicroterritorio: string;
  corregimiento: string;
  direccion: string;
  numeroIdentificacionHogar: string;
  numeroIdentificacionFamilia: string;
  estratoVivienda: string;
  numeroHogaresVivienda: string;
  numeroFamiliasVivienda: string;
  numeroPersonasVivienda: string;
  codigoFicha: string;
  fechaDiligenciamientoFicha: string;
  telefonoContacto: string;
  codigoTipoVivienda: string;
}

export interface CaracteristicasVivienda {
  materialPredominanteParedes: string;
  descripcionOtroMaterialParedes: string;
  materialPredominantePiso: string;
  descripcionOtroMaterialPiso: string;
  materialPredominanteTecho: string;
  descripcionOtroMaterialTecho: string;
  hacinamiento: string;
  codigoRiesgoAccidenteVivienda: string;
  sitiosInteresFacilAccesoVivienda: string;
  fuentesEnergiaCombustibleCocinar: string;
  observaCriaderosVectores: string;
  observaCriaderosVectoresCercaVivienda: string;
  actividadEconomicaVivienda: string;
  animalesViviendaEntornoInmediato: string;
  descripcionTipoAnimal: string;
  numeroAnimales: string;
}

export interface AguaSaneamientoResiduos {
  principalFuenteAguaConsumoHumano: string;
  descripcionOtraFuenteAguaConsumo: string;
  disposicionExcretas: string;
  otraDisposicionExcretas: string;
  disposicionAguaResidual: string;
  otraDisposicionAguaResidual: string;
  disposicionResiduosSolidos: string;
  otraDisposicionResiduosSolidos: string;
}

export interface ComposicionFamiliar {
  tipoFamilia: string;
  numeroPersonasFamilia: string;
  familiograma: string;
  codigoResultadoAPGAR: string;
  cuidador: string;
  escalaZARIT: string;
  ecomapa: string;
}

export interface GruposPrioritarios {
  ninosNinasAdolescentes: string;
  gestantes: string;
  adultosMayores: string;
  victimasConflicto: string;
  personasDiscapacidad: string;
  enfermedadesHuerfanas: string;
  enfermedadesTransmisibles: string;
  otrasEnfermedadesTransmisibles: string;
  sucesosVitalesNormativos: string;
  enSituacionVulnerabilidad: string;
}

export interface PracticasRecursos {
  practicasCuidadoSaludCriticas: string;
  conAntecedentesEnfermedades: string;
  fuenteAlimentos: string;
  otrasFuentesAlimentos: string;
  habitosVidaSaludable: string;
  recursosSocioemocionalesCuidadoSalud: string;
  practicasCuidadoEntorno: string;
  practicasRelacionesSanasConstructivas: string;
  recursosSocioComunitariosPromocionSalud: string;
  practicasAutonomiaCapacidadFuncionalAdultoMayor: string;
  practicasPrevencionEnfermedadesParaTodos: string;
  practicasSaberesAncestrales: string;
  exigibilidadDerechoSalud: string;
  descripcionAntecedentes: string;
}

export interface AnalisisPICP {
  descripcionCaso: string;
  tablaEvaluacion: TablaEvaluacionItem[];
  tablaSeguimiento: TablaSeguimientoItem[];
  objetivoGeneral: string;
  metas: string[];
  tipoIntervencion: string;
  tablaTamizajes: TablaTamizajeItem[];
}

export interface TablaEvaluacionItem {
  aspectoEvaluado: string;
  informacionFicha: string;
  conclusionesIntervencion: string;
  profesionalRecomendado: string;
}

export interface TablaSeguimientoItem {
  fechaSeguimiento: string;
  intervencionesRealizar: string;
  sugerenciasIntervencionRiesgo: string;
  conclusionesIntervencion: string;
  profesionalResponsable: string;
}

export interface TablaTamizajeItem {
  integrante: string;
  edad: number;
  cicloVida: string;
  tamizajesLey3280: string;
  recomendacionProfesional: string;
}
