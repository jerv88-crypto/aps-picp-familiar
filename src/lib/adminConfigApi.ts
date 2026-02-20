import { supabase, hasSupabase } from './supabase'
import type { CuentaPago } from '../types/supabase'

const DEFAULT_PROMPT = `Eres experto en el sector salud, coordinador de APS, conocedor de la Ley 3280 de 2018, RIAS y MINSALUD.
Debes crear el Plan Integral de Cuidado Primario (PICP) familiar basado en los datos de la ficha.
El análisis debe ser estructurado, integral e intersectorial, articulando acciones de promoción de la salud, prevención de la enfermedad, valoración según ciclo de vida y tamizajes RIAS, con enfoque familiar y comunitario.`

const DEFAULT_CUENTA: CuentaPago = {
  banco: '',
  numero: '',
  tipo: '',
  titular: '',
  instrucciones: '',
}

export async function getPromptPICPFromServer(): Promise<string> {
  if (!hasSupabase || !supabase) return ''
  const { data } = await supabase.from('admin_config').select('value').eq('key', 'prompt_picp').single() as { data: { value: string } | null }
  return data?.value ?? ''
}

export async function getCuentaPagoFromServer(): Promise<CuentaPago> {
  if (!hasSupabase || !supabase) return DEFAULT_CUENTA
  const { data } = await supabase.from('admin_config').select('value').eq('key', 'cuenta_pago').single() as { data: { value: string } | null }
  if (!data?.value) return DEFAULT_CUENTA
  try {
    return { ...DEFAULT_CUENTA, ...JSON.parse(data.value) } as CuentaPago
  } catch {
    return DEFAULT_CUENTA
  }
}

export async function setPromptPICPServer(prompt: string): Promise<{ error: string | null }> {
  if (!hasSupabase || !supabase) return { error: 'Supabase no configurado' }
  const row = { key: 'prompt_picp', value: prompt, updated_at: new Date().toISOString() }
  const { error } = await supabase.from('admin_config').upsert(row, { onConflict: 'key' })
  return { error: error?.message ?? null }
}

export async function setCuentaPagoServer(cuenta: CuentaPago): Promise<{ error: string | null }> {
  if (!hasSupabase || !supabase) return { error: 'Supabase no configurado' }
  const value = JSON.stringify(cuenta)
  const row = { key: 'cuenta_pago', value, updated_at: new Date().toISOString() }
  const { error } = await supabase.from('admin_config').upsert(row, { onConflict: 'key' })
  return { error: error?.message ?? null }
}

export { DEFAULT_PROMPT, DEFAULT_CUENTA }
