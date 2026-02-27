import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { FileText, BarChart3, Download, Settings, LogOut, FileStack } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePlanSummary } from '../hooks/usePlanSummary'
import WelcomePopup from './WelcomePopup'

const LOGO_URL = `${import.meta.env.BASE_URL}logo-aps.png`

export default function Layout() {
  const { user, isAdmin, signOut } = useAuth()
  const { summary } = usePlanSummary()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <img src={LOGO_URL} alt="APS" className="logo-img" />
            <div>
              <h1>PICP APS Familiar</h1>
              <p>Plan Integral de Cuidado Primario en Salud - Ley 3280/2018</p>
            </div>
          </div>
          <nav className="nav">
            {user && (
              <>
                <NavLink to="/formulario" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <FileText size={18} />
                  Formulario
                </NavLink>
                <NavLink to="/analisis" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <BarChart3 size={18} />
                  Análisis PICP
                </NavLink>
                <NavLink to="/exportar" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Download size={18} />
                  Exportar
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Settings size={18} />
                    Admin
                  </NavLink>
                )}
                {summary !== null && (
                  <span className="nav-plan-count" title="Planes de cuidado primario creados">
                    <FileStack size={16} />
                    {summary.totalPlanes}
                  </span>
                )}
                <button type="button" className="btn btn-header-logout" onClick={handleSignOut} title="Cerrar sesión">
                  <LogOut size={16} />
                  <span>Salir</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>
      <WelcomePopup />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© APS Familiar - RIAS - Minsalud Colombia</p>
      </footer>
    </div>
  )
}
