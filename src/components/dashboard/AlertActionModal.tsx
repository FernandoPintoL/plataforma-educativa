/**
 * AlertActionModal.tsx
 * =====================
 * Modal para que el profesor tome acciones sobre una alerta
 */

import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';

interface Alert {
  id: number;
  student_id: number;
  pattern_type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  created_at: string;
  resolved: boolean;
}

interface AlertActionModalProps {
  alert: Alert;
  courseId: number;
  onClose: () => void;
  onActionComplete: () => void;
}

type ActionType = 'reviewed' | 'blocked' | 'notified' | 'resolved';

const AlertActionModal: React.FC<AlertActionModalProps> = ({
  alert,
  courseId,
  onClose,
  onActionComplete,
}) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>('reviewed');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/audit/student/${alert.student_id}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alert_id: alert.id,
          action: selectedAction,
          resolution_notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error desconocido');
      }

      setSuccess(true);
      setTimeout(() => {
        onActionComplete();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la acción');
    } finally {
      setLoading(false);
    }
  };

  const actionDescriptions: Record<ActionType, string> = {
    reviewed: 'Marcar como revisada (sin tomar acción)',
    blocked: 'Bloquear al estudiante de realizar análisis',
    notified: 'Notificar al estudiante sobre el comportamiento',
    resolved: 'Resolver la alerta (se considera completada)',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Acción sobre Alerta</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          // Success State
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Éxito</h3>
            <p className="text-gray-600">
              La acción ha sido registrada correctamente
            </p>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Alert Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Alerta ID:</p>
                <p className="font-semibold text-gray-900">{alert.id}</p>

                <p className="text-sm text-gray-600 mt-3 mb-1">Estudiante:</p>
                <p className="font-semibold text-gray-900">#{alert.student_id}</p>

                <p className="text-sm text-gray-600 mt-3 mb-1">Patrón:</p>
                <p className="font-semibold text-gray-900">
                  {alert.pattern_type === 'spam_24h'
                    ? '🔴 Spam (50+ en 24h)'
                    : '🟡 Sobre-uso (10+ en tarea)'}
                </p>

                <p className="text-sm text-gray-600 mt-3 mb-1">Mensaje:</p>
                <p className="text-gray-900">{alert.message}</p>
              </div>

              {/* Action Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Seleccionar acción:
                </label>
                <div className="space-y-2">
                  {((['reviewed', 'blocked', 'notified', 'resolved'] as const).map((action) => (
                    <label key={action} className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="action"
                        value={action}
                        checked={selectedAction === action}
                        onChange={() => setSelectedAction(action)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="ml-3">
                        <span className="text-sm font-medium text-gray-900">
                          {action === 'reviewed' && '✓ Revisada'}
                          {action === 'blocked' && '🚫 Bloquear'}
                          {action === 'notified' && '📧 Notificar'}
                          {action === 'resolved' && '✅ Resolver'}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">
                          {actionDescriptions[action]}
                        </p>
                      </span>
                    </label>
                  )))}
                </div>
              </div>

              {/* Notes (for resolved action) */}
              {selectedAction === 'resolved' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Notas de resolución (opcional):
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Estudiante proporcionó justificación válida..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm font-medium">Error: {error}</p>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-900 text-xs">
                  <strong>Nota:</strong> Esta acción será registrada en la auditoría del sistema.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AlertActionModal;
