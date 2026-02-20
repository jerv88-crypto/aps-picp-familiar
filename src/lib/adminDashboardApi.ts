import { supabase, hasSupabase } from './supabase'
import type { Database } from '../types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface UserDashboardRow {
  id: string
  email: string | null
  full_name: string | null
  role: string
  planCount: number
  planesPagados: number
  pagado: boolean
  createdAt: string
}

export async function getUsersDashboard(): Promise<UserDashboardRow[]> {
  if (!hasSupabase || !supabase) return []
  const { data: profiles, error: e1 } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  if (e1 || !profiles) return []
  const { data: plansData } = await supabase.from('plans').select('user_id')
  const { data: paymentsData } = await supabase.from('payments').select('user_id, planes_count, status')
  const plans = (plansData ?? []) as { user_id: string }[]
  const payments = (paymentsData ?? []) as { user_id: string; planes_count: number; status: string }[]
  const planCountByUser: Record<string, number> = {}
  const paidByUser: Record<string, number> = {}
  for (const p of plans) {
    planCountByUser[p.user_id] = (planCountByUser[p.user_id] ?? 0) + 1
  }
  for (const p of payments) {
    if (p.status === 'confirmado') {
      paidByUser[p.user_id] = (paidByUser[p.user_id] ?? 0) + p.planes_count
    }
  }
  return (profiles as Profile[]).map((pr) => {
    const planCount = planCountByUser[pr.id] ?? 0
    const planesPagados = paidByUser[pr.id] ?? 0
    return {
      id: pr.id,
      email: pr.email,
      full_name: pr.full_name,
      role: pr.role,
      planCount,
      planesPagados,
      pagado: planCount <= planesPagados,
      createdAt: pr.created_at,
    }
  })
}

export async function confirmPayment(paymentId: string): Promise<{ error: string | null }> {
  if (!hasSupabase || !supabase) return { error: 'Supabase no configurado' }
  const { error } = await supabase.from('payments').update({ status: 'confirmado' }).eq('id', paymentId)
  return { error: error?.message ?? null }
}

export async function getPendingPayments(): Promise<{ id: string; user_id: string; amount: number; planes_count: number; method: string | null; created_at: string }[]> {
  if (!hasSupabase || !supabase) return []
  const { data } = await supabase.from('payments').select('id, user_id, amount, planes_count, method, created_at').eq('status', 'pendiente').order('created_at', { ascending: false })
  return (data ?? []) as { id: string; user_id: string; amount: number; planes_count: number; method: string | null; created_at: string }[]
}
