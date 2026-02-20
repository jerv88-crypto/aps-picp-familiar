import type { Integrante } from '../types';

export interface TamizajeInfo {
  cicloVida: string;
  tamizajes: string[];
  recomendacion: string;
}

export function determinarCicloVida(edad: number): string {
  if (edad < 0) return 'No definido';
  if (edad <= 0.07) return 'Recién nacido (0-28 días)';
  if (edad < 1) return 'Lactante (1-11 meses)';
  if (edad < 6) return 'Preescolar (1-5 años)';
  if (edad < 12) return 'Escolar (6-11 años)';
  if (edad < 18) return 'Adolescente (12-17 años)';
  if (edad < 29) return 'Adulto joven (18-28 años)';
  if (edad < 60) return 'Adulto (29-59 años)';
  return 'Adulto mayor (60 años y más)';
}

export function obtenerTamizajesLey3280(edad: number): string[] {
  const tamizajes: string[] = [];

  if (edad <= 0.07) {
    tamizajes.push('Tamizaje auditivo neonatal');
    tamizajes.push('Tamizaje metabólico neonatal');
    tamizajes.push('Tamizaje visual neonatal');
  } else if (edad < 1) {
    tamizajes.push('Valoración del desarrollo psicomotor');
    tamizajes.push('Vacunación según esquema PAI');
    tamizajes.push('Evaluación nutricional');
  } else if (edad < 6) {
    tamizajes.push('Valoración integral del desarrollo');
    tamizajes.push('Tamizaje visual');
    tamizajes.push('Tamizaje de anemia');
    tamizajes.push('Vacunación según PAI');
  } else if (edad < 12) {
    tamizajes.push('Valoración integral del desarrollo');
    tamizajes.push('Tamizaje visual');
    tamizajes.push('Tamizaje odontológico');
    tamizajes.push('Evaluación de salud mental');
  } else if (edad < 18) {
    tamizajes.push('Valoración de riesgos en salud sexual y reproductiva');
    tamizajes.push('Tamizaje de salud mental y consumo de SPA');
    tamizajes.push('Tamizaje visual');
    tamizajes.push('Tamizaje odontológico');
    tamizajes.push('Evaluación nutricional');
  } else if (edad < 29) {
    tamizajes.push('Valoración de riesgos cardiovasculares');
    tamizajes.push('Tamizaje de salud mental');
    tamizajes.push('Evaluación de salud sexual y reproductiva');
    tamizajes.push('Vacunación de refuerzo');
  } else if (edad < 60) {
    tamizajes.push('Tamizaje de hipertensión arterial');
    tamizajes.push('Tamizaje de diabetes');
    tamizajes.push('Tamizaje de cáncer de cuello uterino (mujeres)');
    tamizajes.push('Tamizaje de salud mental');
    tamizajes.push('Evaluación de factores de riesgo cardiovascular');
  } else {
    tamizajes.push('Valoración integral del adulto mayor');
    tamizajes.push('Tamizaje de deterioro cognitivo');
    tamizajes.push('Tamizaje de depresión');
    tamizajes.push('Evaluación de capacidad funcional');
    tamizajes.push('Tamizaje de caídas');
    tamizajes.push('Evaluación nutricional');
  }

  return tamizajes;
}

export function obtenerTamizajeInfo(integrante: Integrante): TamizajeInfo {
  const edad = integrante.edad;
  const cicloVida = determinarCicloVida(edad);
  const tamizajes = obtenerTamizajesLey3280(edad);

  let recomendacion = '';
  if (edad < 6) {
    recomendacion = 'Priorizar valoración del desarrollo y esquema de vacunación. Acompañamiento familiar en pautas de crianza.';
  } else if (edad < 18) {
    recomendacion = 'Fortalecer tamizaje de salud mental y riesgos en adolescentes. Espacios de participación y autocuidado.';
  } else if (edad >= 60) {
    recomendacion = 'Valoración integral con enfoque geriátrico. Evaluar red de apoyo y cuidador. Prevención de caídas y deterioro funcional.';
  } else {
    recomendacion = 'Continuar con tamizajes preventivos según ciclo de vida. Promover estilos de vida saludable.';
  }

  return { cicloVida, tamizajes, recomendacion };
}
