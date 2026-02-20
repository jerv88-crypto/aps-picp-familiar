import { useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { UserPlus, LogIn, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { hasSupabase } from '../lib/supabase'

const DEV_USER_KEY = 'picp_dev_user'

export default function Login() {
  const { user, loading, signInWithEmail, signUpWithEmail, signInWithOAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/formulario'

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-loading">
            <Loader2 size={32} className="spin" />
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setAuthLoading(true)
    try {
      if (isRegister) {
        const { error: err } = await signUpWithEmail(email, password, confirmPassword, fullName)
        if (err) {
          setError(err.message)
          return
        }
        setError('')
        setPassword('')
        setConfirmPassword('')
        alert('Revise su correo para confirmar la cuenta (si está habilitada la confirmación en Supabase).')
        setIsRegister(false)
      } else {
        const { error: err } = await signInWithEmail(email, password)
        if (err) {
          setError(err.message)
          return
        }
        navigate(from, { replace: true })
      }
    } finally {
      setAuthLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    setError('')
    setAuthLoading(true)
    const { error: err } = await signInWithOAuth(provider)
    setAuthLoading(false)
    if (err) setError(err.message)
  }

  const handleDevLogin = () => {
    localStorage.setItem(DEV_USER_KEY, JSON.stringify({ id: 'dev-' + Date.now(), email: 'dev@local' }))
    window.location.href = from
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="logo-icon">🏥</span>
          <h1>PICP APS Familiar</h1>
          <p>Inicie sesión o regístrese para continuar</p>
        </div>

        {!hasSupabase && (
          <div className="login-dev-banner">
            <p>Supabase no configurado. Use el botón inferior para probar la app en modo desarrollo.</p>
            <button type="button" className="btn btn-secondary" onClick={handleDevLogin}>
              Entrar como desarrollo
            </button>
          </div>
        )}

        {hasSupabase && (
          <>
            <div className="login-oauth">
              <button
                type="button"
                className="btn btn-oauth btn-google"
                onClick={() => handleOAuth('google')}
                disabled={authLoading}
              >
                Continuar con Google
              </button>
              <button
                type="button"
                className="btn btn-oauth btn-facebook"
                onClick={() => handleOAuth('facebook')}
                disabled={authLoading}
              >
                Continuar con Facebook
              </button>
              <button
                type="button"
                className="btn btn-oauth btn-apple"
                onClick={() => handleOAuth('apple')}
                disabled={authLoading}
              >
                Continuar con Apple (iCloud)
              </button>
            </div>

            <div className="login-divider">
              <span>o</span>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {isRegister && (
                <div className="form-group">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {isRegister && (
                <div className="form-group">
                  <label className="form-label">Confirmar contraseña</label>
                  <input
                    type="password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              )}
              {error && <p className="error-text login-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-login-submit" disabled={authLoading}>
                {authLoading ? <Loader2 size={18} className="spin" /> : isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                {authLoading ? 'Espere...' : isRegister ? 'Registrarse' : 'Iniciar sesión'}
              </button>
            </form>

            <p className="login-toggle">
              {isRegister ? '¿Ya tiene cuenta?' : '¿No tiene cuenta?'}
              <button type="button" className="btn-link" onClick={() => { setIsRegister(!isRegister); setError('') }}>
                {isRegister ? 'Iniciar sesión' : 'Registrarse (gratis)'}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
