import type { FormData } from '../types'
import type { AnalisisPICP } from '../types'
import { supabase, hasSupabase } from './supabase'

const PRECIO_POR_PLAN = 10000

export const PRECIO_PLAN = PRECIO_POR_PLAN

export interface PlanSummary {
  totalPlanes: number
  planesPagados: number
  planesPendientesPago: number
  totalAPagar: number
}

export async function getPlanSummary(userId: string): Promise<PlanSummary> {
  if (!hasSupabase || !supabase) {
    return { totalPlanes: 0, planesPagados: 0, planesPendientesPago: 0, totalAPagar: 0 }
  }
  const { count, error: e1 } = await supabase.from('plans').select('*', { count: 'exact', head: true }).eq('user_id', userId)
  if (e1) return { totalPlanes: 0, planesPagados: 0, planesPendientesPago: 0, totalAPagar: 0 }
  const totalPlanes = count ?? 0

  const { data: paymentsData } = await supabase
    .from('payments')
    .select('planes_count')
    .eq('user_id', userId)
    .eq('status', 'confirmado')
  const payments = (paymentsData ?? []) as { planes_count: number }[]
  const planesPagados = payments.reduce((s, p) => s + p.planes_count, 0)
  const planesPendientesPago = Math.max(0, totalPlanes - planesPagados)
  const totalAPagar = planesPendientesPago * PRECIO_POR_PLAN

  return { totalPlanes, planesPagados, planesPendientesPago, totalAPagar }
}

export async function savePlan(userId: string, formData: FormData, analisis: AnalisisPICP | null): Promise<{ id: string } | { error: string }> {
  if (!hasSupabase || !supabase) {
    return { id: 'local' }
  }
  const row = { user_id: userId, form_data: formData as unknown as object, analisis: (analisis ?? null) as unknown as object }
  const { data, error } = await supabase.from('plans').insert(row).select('id').single()
  if (error) return { error: error.message }
  return { id: (data as { id: string }).id }
}

export async function createPayment(
  userId: string,
  amount: number,
  planesCount: number,
  method: 'transferencia' | 'PSE' | 'tarjeta'
): Promise<{ id: string } | { error: string }> {
  if (!hasSupabase || !supabase) return { error: 'Supabase no configurado' }
  const row = { user_id: userId, amount, planes_count: planesCount, method, status: 'pendiente' }
  const { data, error } = await supabase.from('payments').insert(row).select('id').single()
  if (error) return { error: error.message }
  return { id: (data as { id: string }).id }
}
