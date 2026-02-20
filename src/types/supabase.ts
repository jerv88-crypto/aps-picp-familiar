export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: 'USUARIO' | 'ADMIN'
          welcome_popup_seen: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: 'USUARIO' | 'ADMIN'
          welcome_popup_seen?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: 'USUARIO' | 'ADMIN'
          welcome_popup_seen?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          user_id: string
          form_data: Json
          analisis: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          form_data: Json
          analisis?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          form_data?: Json
          analisis?: Json | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          planes_count: number
          method: 'transferencia' | 'PSE' | 'tarjeta' | null
          status: 'pendiente' | 'confirmado'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          planes_count: number
          method?: 'transferencia' | 'PSE' | 'tarjeta' | null
          status?: 'pendiente' | 'confirmado'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          planes_count?: number
          method?: 'transferencia' | 'PSE' | 'tarjeta' | null
          status?: 'pendiente' | 'confirmado'
          created_at?: string
        }
      }
      admin_config: {
        Row: { key: string; value: string; updated_at: string }
        Insert: { key: string; value: string; updated_at?: string }
        Update: { key?: string; value?: string; updated_at?: string }
      }
    }
  }
}

export interface CuentaPago {
  banco: string
  numero: string
  tipo: string
  titular: string
  instrucciones: string
}
