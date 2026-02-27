import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, hasSupabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  isAdmin: boolean
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password: string, confirmPassword: string, fullName?: string) => Promise<{ error: Error | null }>
  signInWithOAuth: (provider: 'google') => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  setWelcomePopupSeen: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEV_USER_KEY = 'picp_dev_user'

function getDevUser(): User | null {
  if (!hasSupabase) {
    try {
      const raw = localStorage.getItem(DEV_USER_KEY)
      if (raw) {
        const { id, email } = JSON.parse(raw)
        return { id, email, app_metadata: {}, user_metadata: {}, aud: '', created_at: '' } as User
      }
    } catch {}
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    if (!hasSupabase || !supabase) return null
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    return data as Profile | null
  }, [])

  useEffect(() => {
    if (!hasSupabase || !supabase) {
      const devUser = getDevUser()
      if (devUser) {
        setUser(devUser)
        setProfile({
          id: devUser.id,
          email: devUser.email ?? null,
          full_name: 'Usuario desarrollo',
          role: 'USUARIO',
          welcome_popup_seen: true,
          created_at: '',
          updated_at: '',
        })
      }
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        fetchProfile(s.user.id).then(setProfile)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        const p = await fetchProfile(s.user.id)
        setProfile(p)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!hasSupabase || !supabase) return { error: new Error('Supabase no configurado') }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  const signUpWithEmail = useCallback(async (
    email: string,
    password: string,
    confirmPassword: string,
    fullName?: string
  ) => {
    if (!hasSupabase || !supabase) return { error: new Error('Supabase no configurado') }
    if (password !== confirmPassword) return { error: new Error('Las contraseñas no coinciden') }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || '' } },
    })
    return { error }
  }, [])

  const signInWithOAuth = useCallback(async (provider: 'google') => {
    if (!hasSupabase || !supabase) return { error: new Error('Supabase no configurado') }
    const { error } = await supabase.auth.signInWithOAuth({ provider })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    if (hasSupabase && supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setSession(null)
    setProfile(null)
  }, [])

  const setWelcomePopupSeen = useCallback(async () => {
    if (!user) return
    if (hasSupabase && supabase) {
      await supabase.from('profiles').update({ welcome_popup_seen: true, updated_at: new Date().toISOString() }).eq('id', user.id)
      setProfile((p) => p ? { ...p, welcome_popup_seen: true } : null)
    } else {
      setProfile((p) => p ? { ...p, welcome_popup_seen: true } : null)
    }
  }, [user])

  const isAdmin = profile?.role === 'ADMIN'

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        signOut,
        setWelcomePopupSeen,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
