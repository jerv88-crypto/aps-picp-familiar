import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Formulario from './pages/Formulario'
import Analisis from './pages/Analisis'
import Exportar from './pages/Exportar'
import Admin from './pages/Admin'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/formulario" replace />} />
        <Route path="login" element={<Login />} />
        <Route path="formulario" element={<ProtectedRoute><Formulario /></ProtectedRoute>} />
        <Route path="analisis" element={<ProtectedRoute><Analisis /></ProtectedRoute>} />
        <Route path="exportar" element={<ProtectedRoute><Exportar /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/formulario" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
