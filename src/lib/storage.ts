import type { FormData, AnalisisPICP } from '../types';

const STORAGE_KEYS = {
  FORM_DATA: 'picp_form_data',
  ANALISIS: 'picp_analisis',
  USER_ROLE: 'picp_user_role',
  PROMPT_PICP: 'picp_prompt_picp',
} as const;

export function saveFormData(data: FormData): void {
  localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(data));
}

export function loadFormData(): FormData | null {
  const stored = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as FormData;
  } catch {
    return null;
  }
}

export function saveAnalisis(analisis: AnalisisPICP): void {
  localStorage.setItem(STORAGE_KEYS.ANALISIS, JSON.stringify(analisis));
}

export function loadAnalisis(): AnalisisPICP | null {
  const stored = localStorage.getItem(STORAGE_KEYS.ANALISIS);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AnalisisPICP;
  } catch {
    return null;
  }
}

export function getUsuarioRol(): 'ADMIN' | 'USUARIO' {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  return (stored === 'ADMIN' ? 'ADMIN' : 'USUARIO') as 'ADMIN' | 'USUARIO';
}

export function setUsuarioRol(rol: 'ADMIN' | 'USUARIO'): void {
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, rol);
}

export function getPromptPICP(): string {
  return localStorage.getItem(STORAGE_KEYS.PROMPT_PICP) ?? '';
}

export function savePromptPICP(prompt: string): void {
  localStorage.setItem(STORAGE_KEYS.PROMPT_PICP, prompt);
}
