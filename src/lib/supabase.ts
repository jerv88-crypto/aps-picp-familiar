import { createClient } from '@supabase/supabase-js'

const url = import.meta.env1.VITE_SUPABASE_https://aps-picp-familiar.supabase.co
const anonKey = import.meta.env1.VITE_SUPABASE_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZHVwZXF5d2poenRvcmxzeGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjM1MDksImV4cCI6MjA4NzE5OTUwOX0.UvfktY9v6mxMOamvg_cj_M9aQdY-q_ElmU_RHfVmjZs

if (!url || !anonKey) {
  console.warn('Supabase: faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. La app usará modo sin backend.')
}

export const supabase = url && anonKey
  ? createClient(url, anonKey)
  : null

export const hasSupabase = Boolean(url && anonKey)
