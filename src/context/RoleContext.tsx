import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getUsuarioRol, setUsuarioRol } from '../lib/storage'
import type { Rol } from '../types'

interface RoleContextType {
  rol: Rol
  setRol: (rol: Rol) => void
  isAdmin: boolean
}

const RoleContext = createContext<RoleContextType | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [rol, setRolState] = useState<Rol>(() => getUsuarioRol())

  useEffect(() => {
    setUsuarioRol(rol)
  }, [rol])

  const setRol = (newRol: Rol) => {
    setRolState(newRol)
  }

  return (
    <RoleContext.Provider value={{ rol, setRol, isAdmin: rol === 'ADMIN' }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole debe usarse dentro de RoleProvider')
  return ctx
}
