/**
 * Toast - Notificación flotante
 *
 * Muestra notificaciones en la esquina superior derecha
 * Desaparece automáticamente después de 5 segundos
 */

import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react'

interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
  onClose?: () => void
}

const Toast: React.FC<ToastProps> = ({
  type = 'info',
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-300',
      icon: 'text-green-600',
      text: 'text-green-800',
      progress: 'bg-green-400',
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-300',
      icon: 'text-red-600',
      text: 'text-red-800',
      progress: 'bg-red-400',
    },
    warning: {
      bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
      border: 'border-yellow-300',
      icon: 'text-yellow-600',
      text: 'text-yellow-800',
      progress: 'bg-yellow-400',
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      border: 'border-blue-300',
      icon: 'text-blue-600',
      text: 'text-blue-800',
      progress: 'bg-blue-400',
    },
  }

  const style = styles[type]

  const icons = {
    success: <CheckCircle2 className={`w-5 h-5 ${style.icon}`} />,
    error: <XCircle className={`w-5 h-5 ${style.icon}`} />,
    warning: <AlertCircle className={`w-5 h-5 ${style.icon}`} />,
    info: <Info className={`w-5 h-5 ${style.icon}`} />,
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
      <div className={`${style.bg} border-2 ${style.border} rounded-lg p-4 shadow-lg max-w-sm`}>
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0 mt-0.5">
            {icons[type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${style.text} font-medium text-sm`}>
              {message}
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className={`flex-shrink-0 ${style.icon} hover:opacity-70 transition-opacity`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${style.progress} rounded-full animate-pulse`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}

export default Toast
