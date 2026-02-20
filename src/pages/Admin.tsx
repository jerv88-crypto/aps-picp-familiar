import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Save, Settings, Users, CreditCard, Loader2, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getPromptPICPFromServer,
  getCuentaPagoFromServer,
  setPromptPICPServer,
  setCuentaPagoServer,
  DEFAULT_PROMPT,
  DEFAULT_CUENTA,
} from '../lib/adminConfigApi'
import {
  getUsersDashboard,
  getPendingPayments,
  confirmPayment,
  type UserDashboardRow,
} from '../lib/adminDashboardApi'
import type { CuentaPago } from '../types/supabase'

type Tab = 'prompt' | 'cuenta' | 'dashboard'

export default function Admin() {
  const { isAdmin } = useAuth()
  const [tab, setTab] = useState<Tab>('prompt')
  const [prompt, setPrompt] = useState('')
  const [cuenta, setCuenta] = useState<CuentaPago>(DEFAULT_CUENTA)
  const [guardado, setGuardado] = useState(false)
  const [users, setUsers] = useState<UserDashboardRow[]>([])
  const [pendingPayments, setPendingPayments] = useState<{ id: string; user_id: string; amount: number; planes_count: number; method: string | null; created_at: string }[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const p = await getPromptPICPFromServer()
      setPrompt(p || DEFAULT_PROMPT)
    }
    load()
  }, [])

  useEffect(() => {
    const load = async () => {
      const c = await getCuentaPagoFromServer()
      setCuenta(c)
    }
    load()
  }, [])

  useEffect(() => {
    if (tab === 'dashboard') {
      setLoading(true)
      Promise.all([getUsersDashboard(), getPendingPayments()]).then(([u, p]) => {
        setUsers(u)
        setPendingPayments(p)
        setLoading(false)
      })
    }
  }, [tab])

  const handleGuardarPrompt = async () => {
    const { error } = await setPromptPICPServer(prompt || DEFAULT_PROMPT)
    if (error) {
      alert('Error al guardar: ' + error)
      return
    }
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  const handleGuardarCuenta = async () => {
    const { error } = await setCuentaPagoServer(cuenta)
    if (error) {
      alert('Error al guardar: ' + error)
      return
    }
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2500)
  }

  const handleConfirmarPago = async (paymentId: string) => {
    const { error } = await confirmPayment(paymentId)
    if (error) {
      alert('Error: ' + error)
      return
    }
    setPendingPayments((prev) => prev.filter((p) => p.id !== paymentId))
    setUsers((prev) => {
      const pay = pendingPayments.find((p) => p.id === paymentId)
      if (!pay) return prev
      return prev.map((u) =>
        u.id === pay.user_id ? { ...u, planesPagados: u.planesPagados + pay.planes_count, pagado: u.planCount <= u.planesPagados + pay.planes_count } : u
      )
    })
  }

  if (!isAdmin) {
    return <Navigate to="/formulario" replace />
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2>
            <Settings size={24} />
            Panel de administración
          </h2>
          <p>Configuración del sistema y visualización de usuarios</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button type="button" className={`admin-tab ${tab === 'prompt' ? 'active' : ''}`} onClick={() => setTab('prompt')}>
          Prompt PICP
        </button>
        <button type="button" className={`admin-tab ${tab === 'cuenta' ? 'active' : ''}`} onClick={() => setTab('cuenta')}>
          Cuenta de pago
        </button>
        <button type="button" className={`admin-tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>
          Dashboard usuarios
        </button>
      </div>

      {tab === 'prompt' && (
        <div className="admin-card">
          <h3>Prompt para generación del PICP</h3>
          <p className="admin-description">
            Este texto se utiliza como instrucciones base para el análisis del Plan Integral de Cuidado Primario.
          </p>
          <textarea
            className="admin-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={DEFAULT_PROMPT}
            rows={12}
            spellCheck={false}
          />
          <div className="admin-actions">
            <button type="button" className="btn btn-primary" onClick={handleGuardarPrompt}>
              <Save size={18} />
              {guardado ? 'Guardado' : 'Guardar prompt'}
            </button>
          </div>
        </div>
      )}

      {tab === 'cuenta' && (
        <div className="admin-card">
          <h3><CreditCard size={20} /> Cuenta para recibir pagos</h3>
          <p className="admin-description">
            Datos que verán los usuarios al elegir transferencia bancaria. Puede completar también instrucciones para PSE o tarjeta.
          </p>
          <div className="admin-form-grid">
            <div className="form-group">
              <label className="form-label">Titular</label>
              <input type="text" className="form-input" value={cuenta.titular} onChange={(e) => setCuenta({ ...cuenta, titular: e.target.value })} placeholder="Nombre del titular" />
            </div>
            <div className="form-group">
              <label className="form-label">Banco</label>
              <input type="text" className="form-input" value={cuenta.banco} onChange={(e) => setCuenta({ ...cuenta, banco: e.target.value })} placeholder="Nombre del banco" />
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de cuenta</label>
              <input type="text" className="form-input" value={cuenta.tipo} onChange={(e) => setCuenta({ ...cuenta, tipo: e.target.value })} placeholder="Ahorros / Corriente" />
            </div>
            <div className="form-group">
              <label className="form-label">Número de cuenta</label>
              <input type="text" className="form-input" value={cuenta.numero} onChange={(e) => setCuenta({ ...cuenta, numero: e.target.value })} placeholder="Número de cuenta" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Instrucciones adicionales (opcional)</label>
            <textarea
              className="form-input"
              rows={3}
              value={cuenta.instrucciones}
              onChange={(e) => setCuenta({ ...cuenta, instrucciones: e.target.value })}
              placeholder="Ej: Enviar comprobante a correo@..."
            />
          </div>
          <div className="admin-actions">
            <button type="button" className="btn btn-primary" onClick={handleGuardarCuenta}>
              <Save size={18} />
              {guardado ? 'Guardado' : 'Guardar cuenta'}
            </button>
          </div>
        </div>
      )}

      {tab === 'dashboard' && (
        <div className="admin-dashboard">
          <div className="admin-card">
            <h3><Users size={20} /> Usuarios y planes</h3>
            {loading ? (
              <div className="admin-loading"><Loader2 size={24} className="spin" /> Cargando...</div>
            ) : (
              <div className="dashboard-table-wrapper">
                <table className="data-table dashboard-table">
                  <thead>
                    <tr>
                      <th>Usuario / Correo</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Planes creados</th>
                      <th>Planes pagados</th>
                      <th>Estado pago</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.email ?? u.id.slice(0, 8)}</td>
                        <td>{u.full_name ?? '—'}</td>
                        <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                        <td>{u.planCount}</td>
                        <td>{u.planesPagados}</td>
                        <td>
                          {u.pagado ? (
                            <span className="status-badge status-ok"><Check size={14} /> Al día</span>
                          ) : (
                            <span className="status-badge status-pending"><X size={14} /> Pendiente</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {pendingPayments.length > 0 && (
            <div className="admin-card">
              <h3>Pagos pendientes de confirmar</h3>
              <div className="dashboard-table-wrapper">
                <table className="data-table dashboard-table">
                  <thead>
                    <tr>
                      <th>Usuario ID</th>
                      <th>Monto</th>
                      <th>Planes</th>
                      <th>Método</th>
                      <th>Fecha</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPayments.map((p) => (
                      <tr key={p.id}>
                        <td><code>{p.user_id.slice(0, 8)}...</code></td>
                        <td>${p.amount.toLocaleString('es-CO')}</td>
                        <td>{p.planes_count}</td>
                        <td>{p.method ?? '—'}</td>
                        <td>{new Date(p.created_at).toLocaleDateString('es-CO')}</td>
                        <td>
                          <button type="button" className="btn btn-success btn-sm" onClick={() => handleConfirmarPago(p.id)}>
                            Confirmar pago
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
