import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.warn('Supabase: faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. La app usará modo sin backend.')
}

export const supabase = url && anonKey
  ? createClient(url, anonKey)
  : null

export const hasSupabase = Boolean(url && anonKey)
