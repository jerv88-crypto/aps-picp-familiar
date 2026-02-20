import { useState } from 'react'
import { X, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const TEXTO_BIENVENIDA = `Bienvenido a PICP APS Familiar.

Esta aplicación le permite crear y gestionar Planes Integrales de Cuidado Primario en Salud según la Ley 3280 de 2018 y las RIAS.

El registro y el uso de la aplicación son gratuitos. El pago aplica únicamente cuando usted genera y guarda un Plan de Cuidado Primario (PICP). Cada plan creado y guardado tiene un costo de $10.000 pesos colombianos.

En el momento en que pulse "Generar Análisis PICP" y se guarde el plan, se desplegará la pantalla de pago para que pueda realizar el pago por la cantidad de planes creados (transferencia, PSE o tarjeta débito, según la cuenta configurada por el administrador).`

export default function WelcomePopup() {
  const { profile, setWelcomePopupSeen } = useAuth()
  const [cerrado, setCerrado] = useState(false)

  const mostrar = profile && !profile.welcome_popup_seen && !cerrado

  const handleCerrar = () => {
    setCerrado(true)
    setWelcomePopupSeen()
  }

  if (!mostrar) return null

  return (
    <div className="modal-overlay welcome-popup-overlay" onClick={handleCerrar}>
      <div className="modal-content welcome-popup" onClick={(e) => e.stopPropagation()}>
        <div className="welcome-popup-header">
          <Info size={28} className="welcome-popup-icon" />
          <h3>Conozca la aplicación</h3>
          <button type="button" className="btn-close-icon" onClick={handleCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="welcome-popup-body">
          {TEXTO_BIENVENIDA.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="welcome-popup-footer">
          <button type="button" className="btn btn-primary" onClick={handleCerrar}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
