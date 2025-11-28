import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import RespuestaReviewCard from './RespuestaReviewCard';

interface Estudiante {
  id: number;
  nombre_completo: string;
  email: string;
}

interface Evaluacion {
  id: number;
  titulo: string;
}

interface Respuesta {
  id: number;
  pregunta_id: number;
  enunciado: string;
  tipo_pregunta: string;
  respuesta_estudiante: string;
  es_correcta: boolean;
  puntos_obtenidos: number;
  puntos_totales: number;
  confianza: number;
  analisis_llm: {
    conceptos_correctos: string[];
    errores_encontrados: string[];
    nivel_bloom: string | null;
    calidad_respuesta: number | null;
  };
  respuesta_anomala: boolean;
  recomendacion: string;
  necesita_revision: boolean;
  tiempo_respuesta: number;
  numero_cambios: number;
}

interface Intento {
  id: number;
  estudiante: Estudiante;
  evaluacion: Evaluacion;
  puntaje_obtenido: number;
  porcentaje_acierto: number;
  nivel_confianza: number;
  tiene_anomalias: boolean;
  prioridad: 'urgente' | 'media' | 'baja';
  patrones_identificados: string[];
  areas_debilidad: string[];
  areas_fortaleza: string[];
  recomendaciones_ia: string[];
  fecha_entrega: string;
  tiempo_total: number;
  numero_intento: number;
  estado: string;
}

interface DetalleRevision {
  intento: Intento;
  respuestas: Respuesta[];
}

interface Ajuste {
  respuesta_id: number;
  puntos_obtenidos: number;
  recomendacion: string;
}

interface Props {
  intentoId: number;
  evaluacionId: number;
  isOpen: boolean;
  onClose: (recargar: boolean) => void;
}

/**
 * IntentoReviewModal
 *
 * Modal para revisión detallada de un intento por parte del profesor
 * Permite ver análisis LLM, confirmar calificación o ajustar puntos individuales
 *
 * Props:
 * - intentoId: ID del intento a revisar
 * - evaluacionId: ID de la evaluación (para contexto)
 * - isOpen: Si el modal está abierto
 * - onClose: Callback al cerrar, recibe true si se guardaron cambios (para recargar)
 */
export default function IntentoReviewModal({
  intentoId,
  evaluacionId,
  isOpen,
  onClose,
}: Props) {
  const [detalle, setDetalle] = useState<DetalleRevision | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ajustes, setAjustes] = useState<Ajuste[]>([]);
  const [comentarioGeneral, setComentarioGeneral] = useState('');
  const [comentarioConfirmacion, setComentarioConfirmacion] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar detalle del intento al abrir el modal
   */
  useEffect(() => {
    if (isOpen && intentoId) {
      cargarDetalle();
    }
  }, [isOpen, intentoId]);

  /**
   * Cargar detalle completo del intento
   */
  const cargarDetalle = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/profesor/intentos/${intentoId}/revision`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar detalle de revisión');
      }

      const data = await response.json();
      setDetalle(data.data);
      setAjustes([]);
      setComentarioGeneral('');
      setComentarioConfirmacion('');
      setHasChanges(false);
    } catch (err) {
      console.error('Error cargando detalle:', err);
      setError('No se pudo cargar el detalle de revisión');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar cambios en puntos de una respuesta
   */
  const handleAjustarPuntos = (respuestaId: number, nuevosPuntos: number, recomendacion: string) => {
    // Buscar si ya existe ajuste para esta respuesta
    const existingAjusteIndex = ajustes.findIndex((a) => a.respuesta_id === respuestaId);

    if (existingAjusteIndex >= 0) {
      // Actualizar ajuste existente
      const nuevosAjustes = [...ajustes];
      nuevosAjustes[existingAjusteIndex] = {
        respuesta_id: respuestaId,
        puntos_obtenidos: nuevosPuntos,
        recomendacion,
      };
      setAjustes(nuevosAjustes);
    } else {
      // Agregar nuevo ajuste
      setAjustes([
        ...ajustes,
        {
          respuesta_id: respuestaId,
          puntos_obtenidos: nuevosPuntos,
          recomendacion,
        },
      ]);
    }

    setHasChanges(true);
  };

  /**
   * Confirmar calificación (sin ajustes)
   */
  const handleConfirmar = async () => {
    if (!detalle) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        `/api/profesor/intentos/${intentoId}/confirmar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({
            comentario: comentarioConfirmacion || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al confirmar calificación');
      }

      onClose(true);
    } catch (err) {
      console.error('Error confirmando:', err);
      setError(err instanceof Error ? err.message : 'Error al confirmar calificación');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Ajustar calificación (con cambios en puntos)
   */
  const handleAjustar = async () => {
    if (!detalle || ajustes.length === 0) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(
        `/api/profesor/intentos/${intentoId}/ajustar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
          body: JSON.stringify({
            ajustes,
            comentario_general: comentarioGeneral || null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al ajustar calificación');
      }

      onClose(true);
    } catch (err) {
      console.error('Error ajustando:', err);
      setError(err instanceof Error ? err.message : 'Error al ajustar calificación');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center pt-4">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">Revisión de Intento</h2>
            {detalle && (
              <p className="text-sm text-gray-500 mt-1">
                {detalle.intento.estudiante.nombre_completo} • Intento {detalle.intento.numero_intento}
              </p>
            )}
          </div>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando detalle de revisión...</p>
            </div>
          ) : error ? (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          ) : detalle ? (
            <div className="space-y-6">
              {/* Resumen del Intento */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen del Intento</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Puntaje</p>
                    <p className="text-xl font-bold text-gray-900">
                      {detalle.intento.puntaje_obtenido.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Porcentaje</p>
                    <p className="text-xl font-bold text-gray-900">
                      {detalle.intento.porcentaje_acierto.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Confianza</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(detalle.intento.nivel_confianza * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Total</p>
                    <p className="text-xl font-bold text-gray-900">
                      {Math.round(detalle.intento.tiempo_total / 60)} min
                    </p>
                  </div>
                </div>

                {/* Anomalías y Patrones */}
                {detalle.intento.tiene_anomalias && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md flex items-start gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Anomalías Detectadas</p>
                      <p className="text-sm text-red-700 mt-1">
                        Este intento tiene patrones sospechosos que requieren revisión cuidadosa.
                      </p>
                    </div>
                  </div>
                )}

                {/* Áreas de Debilidad y Fortaleza */}
                {(detalle.intento.areas_debilidad.length > 0 ||
                  detalle.intento.areas_fortaleza.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {detalle.intento.areas_debilidad.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Áreas de Debilidad</p>
                        <ul className="space-y-1">
                          {detalle.intento.areas_debilidad.map((area, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="text-red-500">•</span>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {detalle.intento.areas_fortaleza.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Áreas de Fortaleza</p>
                        <ul className="space-y-1">
                          {detalle.intento.areas_fortaleza.map((area, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <CheckIcon className="h-4 w-4 text-green-500" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Respuestas Detalladas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Respuestas Detalladas</h3>
                <div className="space-y-4">
                  {detalle.respuestas.map((respuesta, idx) => (
                    <RespuestaReviewCard
                      key={respuesta.id}
                      respuesta={respuesta}
                      numero={idx + 1}
                      onAjustar={handleAjustarPuntos}
                    />
                  ))}
                </div>
              </div>

              {/* Comentario General (si hay ajustes) */}
              {hasChanges && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario General (Opcional)
                  </label>
                  <textarea
                    value={comentarioGeneral}
                    onChange={(e) => setComentarioGeneral(e.target.value)}
                    placeholder="Explicar los ajustes realizados..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Comentario de Confirmación (si NO hay ajustes) */}
              {!hasChanges && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentario de Confirmación (Opcional)
                  </label>
                  <textarea
                    value={comentarioConfirmacion}
                    onChange={(e) => setComentarioConfirmacion(e.target.value)}
                    placeholder="Agregar comentario antes de confirmar..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer con Botones de Acción */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-end gap-3 rounded-b-lg">
          <button
            onClick={() => onClose(false)}
            disabled={saving}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>

          {hasChanges ? (
            <button
              onClick={handleAjustar}
              disabled={saving || ajustes.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? 'Guardando...' : 'Guardar Ajustes'}
            </button>
          ) : (
            <button
              onClick={handleConfirmar}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {saving ? 'Confirmando...' : 'Confirmar Calificación'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
