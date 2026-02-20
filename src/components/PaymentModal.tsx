import { useState, useEffect } from 'react'
import { X, CreditCard, Building, Landmark } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getPlanSummary, createPayment } from '../lib/plansApi'
import { getCuentaPagoFromServer } from '../lib/adminConfigApi'
import type { CuentaPago } from '../types/supabase'

interface PaymentModalProps {
  onClose: () => void
  onPaymentRegistered?: () => void
}

type MetodoPago = 'transferencia' | 'PSE' | 'tarjeta'

export default function PaymentModal({ onClose, onPaymentRegistered }: PaymentModalProps) {
  const { user } = useAuth()
  const [summary, setSummary] = useState<{ totalPlanes: number; planesPendientesPago: number; totalAPagar: number } | null>(null)
  const [cuenta, setCuenta] = useState<CuentaPago | null>(null)
  const [metodo, setMetodo] = useState<MetodoPago | null>(null)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    if (!user) return
    getPlanSummary(user.id).then((s) => setSummary(s))
    getCuentaPagoFromServer().then(setCuenta)
  }, [user])

  const handleRegistrarPago = async () => {
    if (!user || !summary || summary.planesPendientesPago <= 0 || !metodo) return
    setLoading(true)
    setMensaje('')
    const result = await createPayment(user.id, summary.totalAPagar, summary.planesPendientesPago, metodo)
    setLoading(false)
    if ('error' in result) {
      setMensaje(result.error)
      return
    }
    setMensaje('Pago registrado. El administrador verificará y confirmará el pago.')
    onPaymentRegistered?.()
    setTimeout(() => onClose(), 2000)
  }

  if (!user || !summary) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  const totalAPagar = summary.totalAPagar

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h3>Pago por planes de cuidado primario</h3>
          <button type="button" className="btn-close-icon" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="payment-modal-body">
          <div className="payment-summary">
            <p><strong>Planes creados y guardados:</strong> {summary.totalPlanes}</p>
            <p><strong>Planes pendientes de pago:</strong> {summary.planesPendientesPago}</p>
            <p className="payment-total">Total a pagar: <span>${totalAPagar.toLocaleString('es-CO')} COP</span></p>
            <p className="payment-note">Costo por plan: $10.000 COP</p>
          </div>

          <p className="payment-method-label">Seleccione el método de pago:</p>
          <div className="payment-methods">
            <button
              type="button"
              className={`btn payment-method-btn ${metodo === 'transferencia' ? 'active' : ''}`}
              onClick={() => setMetodo('transferencia')}
            >
              <Landmark size={20} />
              Transferencia bancaria
            </button>
            <button
              type="button"
              className={`btn payment-method-btn ${metodo === 'PSE' ? 'active' : ''}`}
              onClick={() => setMetodo('PSE')}
            >
              <Building size={20} />
              PSE
            </button>
            <button
              type="button"
              className={`btn payment-method-btn ${metodo === 'tarjeta' ? 'active' : ''}`}
              onClick={() => setMetodo('tarjeta')}
            >
              <CreditCard size={20} />
              Tarjeta débito
            </button>
          </div>

          {metodo === 'transferencia' && cuenta && (
            <div className="payment-cuenta-info">
              <h4>Datos para transferencia</h4>
              {cuenta.titular && <p><strong>Titular:</strong> {cuenta.titular}</p>}
              {cuenta.banco && <p><strong>Banco:</strong> {cuenta.banco}</p>}
              {cuenta.tipo && <p><strong>Tipo de cuenta:</strong> {cuenta.tipo}</p>}
              {cuenta.numero && <p><strong>Número de cuenta:</strong> {cuenta.numero}</p>}
              {cuenta.instrucciones && <p className="payment-instrucciones">{cuenta.instrucciones}</p>}
              {!cuenta.numero && !cuenta.titular && <p className="payment-sin-cuenta">El administrador aún no ha configurado la cuenta. Contacte al administrador.</p>}
            </div>
          )}

          {(metodo === 'PSE' || metodo === 'tarjeta') && (
            <p className="payment-pse-note">Al confirmar se registrará su intención de pago. El administrador podrá habilitar en el futuro pagos en línea (PSE / tarjeta) o indicarle los pasos a seguir.</p>
          )}

          {mensaje && <p className={`payment-mensaje ${mensaje.includes('registrado') ? 'success' : 'error'}`}>{mensaje}</p>}
        </div>

        <div className="payment-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRegistrarPago}
            disabled={!metodo || totalAPagar <= 0 || loading}
          >
            {loading ? 'Registrando...' : 'Registrar pago / Continuar'}
          </button>
        </div>
      </div>
    </div>
  )
}
