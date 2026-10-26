import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useMonthlyTotals, useTransactions } from '../hooks/useBudget'
import './RealTimeAlerts.css'

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000`

export default function RealTimeAlerts({ token }) {
  const { refreshData } = useTransactions()
  const totals = useMonthlyTotals()
  const [toasts, setToasts] = useState([])
  const previousLevel = useRef(0)

  useEffect(() => {
    const socket = io(SOCKET_URL, { autoConnect: false, auth: { token } })
    socket.on('data:changed', refreshData)
    socket.connect()

    return () => socket.disconnect()
  }, [refreshData, token])

  useEffect(() => {
    const usage = totals.income > 0 ? (totals.expense / totals.income) * 100 : 0
    const level = usage >= 90 ? 2 : usage >= 80 ? 1 : 0

    if (level > previousLevel.current) {
      setToasts((currentToasts) => [
        {
          id: `income-usage-${level}-${Date.now()}`,
          percentage: Math.round(usage),
          level: level === 2 ? 'danger' : 'warning',
        },
        ...currentToasts,
      ].slice(0, 3))
    }
    previousLevel.current = level
  }, [totals.expense, totals.income])

  useEffect(() => {
    if (toasts.length === 0) return undefined

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((currentToast) => currentToast.id !== toast.id)
        )
      }, 8000)
    )

    return () => timers.forEach(window.clearTimeout)
  }, [toasts])

  const dismissToast = (id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }

  return (
    <div className="budget-toast-region" aria-live="assertive" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          className={`budget-toast ${toast.level}`}
          key={toast.id}
          role="alert"
        >
          <span className="budget-toast-icon" aria-hidden="true">
            {toast.level === 'danger' ? '!' : '⚠'}
          </span>
          <p>
            <strong>Monthly spending alert</strong>
            Your expenses are {toast.percentage}% of your income this month.
          </p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss monthly spending alert"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
