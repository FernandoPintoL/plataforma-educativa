import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

interface AnalisisLLM {
  conceptos_correctos: string[];
  errores_encontrados: string[];
  nivel_bloom: string | null;
  calidad_respuesta: number | null;
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
  analisis_llm: AnalisisLLM;
  respuesta_anomala: boolean;
  recomendacion: string;
  necesita_revision: boolean;
  tiempo_respuesta: number;
  numero_cambios: number;
}

interface Props {
  respuesta: Respuesta;
  numero: number;
  onAjustar: (respuestaId: number, puntos: number, recomendacion: string) => void;
}

/**
 * RespuestaReviewCard
 *
 * Tarjeta para visualizar y editar una respuesta individual dentro del modal de revisión
 * Muestra:
 * - Pregunta original
 * - Respuesta del estudiante
 * - Análisis LLM
 * - Campos editables para puntos y recomendación
 * - Indicadores de confianza y anomalías
 *
 * Props:
 * - respuesta: Datos completos de la respuesta
 * - numero: Número de pregunta (para display)
 * - onAjustar: Callback cuando se editan puntos o recomendación
 */
export default function RespuestaReviewCard({ respuesta, numero, onAjustar }: Props) {
  const [expandido, setExpandido] = useState(false);
  const [puntosEditados, setPuntosEditados] = useState(respuesta.puntos_obtenidos);
  const [recomendacionEditada, setRecomendacionEditada] = useState(respuesta.recomendacion || '');
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  /**
   * Sincronizar cambios con el padre
   */
  useEffect(() => {
    if (
      puntosEditados !== respuesta.puntos_obtenidos ||
      recomendacionEditada !== (respuesta.recomendacion || '')
    ) {
      onAjustar(respuesta.id, puntosEditados, recomendacionEditada);
      setHasLocalChanges(true);
    } else {
      setHasLocalChanges(false);
    }
  }, [puntosEditados, recomendacionEditada, respuesta]);

  /**
   * Obtener color para badge de confianza
   */
  const getConfianzaBadgeColor = (confianza: number): string => {
    if (confianza >= 0.8) return 'bg-green-100 text-green-800';
    if (confianza >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  /**
   * Obtener color para badge de corrección
   */
  const getCorrecionBadgeColor = (esCorrecta: boolean): string => {
    return esCorrecta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  /**
   * Obtener etiqueta de nivel Bloom
   */
  const getNivelBloomLabel = (nivel: string | null): string => {
    if (!nivel) return 'No determinado';
    const labels: Record<string, string> = {
      remember: 'Recordar',
      understand: 'Comprender',
      apply: 'Aplicar',
      analyze: 'Analizar',
      evaluate: 'Evaluar',
      create: 'Crear',
    };
    return labels[nivel] || nivel;
  };

  /**
   * Formatear tiempo en minutos y segundos
   */
  const formatearTiempo = (segundos: number): string => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    if (minutos === 0) return `${segs}s`;
    return `${minutos}m ${segs}s`;
  };

  /**
   * Validar rango de puntos
   */
  const handlePuntosChange = (valor: string) => {
    const numeral = parseFloat(valor) || 0;
    const limitado = Math.max(0, Math.min(numeral, respuesta.puntos_totales));
    setPuntosEditados(limitado);
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        hasLocalChanges ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
      }`}
    >
      {/* Header Colapsable */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full text-left flex items-start justify-between gap-4 group"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg text-gray-700">Pregunta {numero}</span>

            {/* Badges de estado */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Corrección */}
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getCorrecionBadgeColor(respuesta.es_correcta)}`}>
                {respuesta.es_correcta ? (
                  <>
                    <CheckCircleIcon className="h-3 w-3" />
                    Correcta
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-3 w-3" />
                    Incorrecta
                  </>
                )}
              </div>

              {/* Confianza */}
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getConfianzaBadgeColor(respuesta.confianza)}`}>
                {(respuesta.confianza * 100).toFixed(0)}% conf.
              </div>

              {/* Anomalía */}
              {respuesta.respuesta_anomala && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                  <ExclamationTriangleIcon className="h-3 w-3" />
                  Anómala
                </div>
              )}

              {/* Necesita Revisión */}
              {respuesta.necesita_revision && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Requiere revisión
                </div>
              )}
            </div>
          </div>

          {/* Pregunta */}
          <p className="text-sm text-gray-700 font-medium line-clamp-2">
            {respuesta.enunciado}
          </p>
        </div>

        {/* Botón expandir */}
        <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600">
          {expandido ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Contenido Expandido */}
      {expandido && (
        <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
          {/* Respuesta del Estudiante */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Respuesta del Estudiante</h4>
            <div className="bg-gray-50 rounded p-3 border border-gray-200">
              <p className="text-sm text-gray-800 whitespace-pre-wrap">
                {respuesta.respuesta_estudiante || '(Sin respuesta)'}
              </p>
            </div>
          </div>

          {/* Análisis LLM */}
          <div className="bg-indigo-50 rounded p-3 border border-indigo-200">
            <h4 className="font-medium text-indigo-900 mb-2 flex items-center gap-2">
              <span>Análisis Inteligente</span>
            </h4>

            <div className="space-y-3">
              {/* Conceptos Correctos */}
              {respuesta.analisis_llm.conceptos_correctos.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-indigo-700 mb-1">Conceptos Correctos:</p>
                  <div className="flex flex-wrap gap-1">
                    {respuesta.analisis_llm.conceptos_correctos.map((concepto, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                      >
                        {concepto}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Errores */}
              {respuesta.analisis_llm.errores_encontrados.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-indigo-700 mb-1">Errores Encontrados:</p>
                  <div className="flex flex-wrap gap-1">
                    {respuesta.analisis_llm.errores_encontrados.map((error, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        {error}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nivel Bloom y Calidad */}
              <div className="grid grid-cols-2 gap-2">
                {respuesta.analisis_llm.nivel_bloom && (
                  <div>
                    <p className="text-xs text-indigo-600 font-semibold">Nivel Bloom:</p>
                    <p className="text-xs text-indigo-900">
                      {getNivelBloomLabel(respuesta.analisis_llm.nivel_bloom)}
                    </p>
                  </div>
                )}
                {respuesta.analisis_llm.calidad_respuesta !== null && (
                  <div>
                    <p className="text-xs text-indigo-600 font-semibold">Calidad:</p>
                    <p className="text-xs text-indigo-900">
                      {(respuesta.analisis_llm.calidad_respuesta * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-gray-600">Tipo de Pregunta</p>
              <p className="font-medium text-gray-900 capitalize">
                {respuesta.tipo_pregunta.replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Tiempo de Respuesta</p>
              <p className="font-medium text-gray-900">{formatearTiempo(respuesta.tiempo_respuesta)}</p>
            </div>
            <div>
              <p className="text-gray-600">Cambios Realizados</p>
              <p className="font-medium text-gray-900">{respuesta.numero_cambios}</p>
            </div>
          </div>

          {/* Edición de Puntos */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Puntos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos Obtenidos
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={respuesta.puntos_totales}
                    value={puntosEditados}
                    onChange={(e) => handlePuntosChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-600">/ {respuesta.puntos_totales}</span>
                </div>
              </div>

              {/* Porcentaje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm">
                  {respuesta.puntos_totales > 0
                    ? ((puntosEditados / respuesta.puntos_totales) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Recomendación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recomendación / Retroalimentación
            </label>
            <textarea
              value={recomendacionEditada}
              onChange={(e) => setRecomendacionEditada(e.target.value)}
              placeholder="Proporcionar retroalimentación al estudiante..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Indicador de cambios locales */}
          {hasLocalChanges && (
            <div className="p-3 bg-blue-100 border border-blue-300 rounded-md flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600"></div>
              <p className="text-xs font-medium text-blue-700">Cambios pendientes de guardar</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
