import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getPlanSummary, type PlanSummary } from '../lib/plansApi'

export function usePlanSummary(): { summary: PlanSummary | null; refresh: () => Promise<void> } {
  const { user } = useAuth()
  const [summary, setSummary] = useState<PlanSummary | null>(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setSummary(null)
      return
    }
    const s = await getPlanSummary(user.id)
    setSummary(s)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { summary, refresh }
}
