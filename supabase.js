import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_https://aps-picp-familiar.supabase.co
const supabaseKey = import.meta.env.VITE_SUPABASE_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmZHVwZXF5d2poenRvcmxzeGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjM1MDksImV4cCI6MjA4NzE5OTUwOX0.UvfktY9v6mxMOamvg_cj_M9aQdY-q_ElmU_RHfVmjZs

export const supabase = createClient(supabaseUrl, supabaseKey)