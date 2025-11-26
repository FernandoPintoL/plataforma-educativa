/**
 * SolutionFeedbackPanel Component
 *
 * Panel seguro para estudiantes analizar su solución
 * - Máximo 5 análisis por tarea
 * - Cooldown de 5 minutos entre análisis
 * - Feedback sin resolver (método socrático)
 * - Logging exhaustivo de auditoría
 */

import React, { useState, useCallback, useEffect } from 'react'
import {
  Zap,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Clock,
  Loader,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import axios from 'axios'

// ============================================================================
// TIPOS Y INTERFACES
// ============================================================================

interface ConceptoCorreto {
  concepto: string
  evidencia: string
  nivel?: 'básico' | 'intermedio' | 'avanzado'
}

interface ConceptoIncompleto {
  concepto: string
  que_falta: string
  pregunta_reflexiva: string
}

interface ErrorDetectado {
  tipo: 'lógica' | 'rendimiento' | 'estilo' | 'seguridad'
  donde: string
  problema_descripcion: string
  pregunta_guia: string
  pista: string
}

interface AspectoPorValidar {
  aspecto: string
  pregunta: string
  caso_especial?: string
}

interface FeedbackData {
  id: string
  analysis_count: number
  max_analyses: number
  feedback: {
    conceptos_correctos: ConceptoCorreto[]
    conceptos_incompletos: ConceptoIncompleto[]
    errores_detectados: ErrorDetectado[]
    aspectos_a_validar: AspectoPorValidar[]
    pistas_progresivas: string[]
    cosas_bien_hechas: string[]
    siguiente_paso: string
  }
  metadata: {
    analysis_duration_ms: number
    timestamp: string
  }
}

interface SolutionFeedbackPanelProps {
  taskId: number
  studentId: number
  studentCode: string
  taskType: 'tarea' | 'evaluacion' | 'examen'
  maxAnalyses?: number
  cooldownSeconds?: number
  onAnalysisComplete?: (feedback: FeedbackData) => void
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function SolutionFeedbackPanel({
  taskId,
  studentId,
  studentCode,
  taskType,
  maxAnalyses = 5,
  cooldownSeconds = 300,
  onAnalysisComplete,
}: SolutionFeedbackPanelProps) {
  // Estados principales
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisCount, setAnalysisCount] = useState(0)
  const [lastAnalysisTime, setLastAnalysisTime] = useState<number | null>(null)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)

  // Estados de UI
  const [expandedSection, setExpandedSection] = useState<string | null>('conceptos_correctos')

  // Calcular si puede hacer análisis
  const canAnalyze = useCallback(() => {
    if (analysisCount >= maxAnalyses) return false
    if (!lastAnalysisTime) return true
    const elapsed = Math.floor((Date.now() - lastAnalysisTime) / 1000)
    return elapsed >= cooldownSeconds
  }, [analysisCount, maxAnalyses, lastAnalysisTime, cooldownSeconds])

  // Actualizar cooldown timer
  useEffect(() => {
    if (!lastAnalysisTime || canAnalyze()) {
      setCooldownRemaining(0)
      return
    }

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastAnalysisTime) / 1000)
      const remaining = Math.max(0, cooldownSeconds - elapsed)
      setCooldownRemaining(remaining)
    }, 100)

    return () => clearInterval(timer)
  }, [lastAnalysisTime, canAnalyze, cooldownSeconds])

  // Función principal: Analizar solución
  const analyzeSolution = useCallback(async () => {
    // Validaciones
    if (!studentCode || studentCode.trim().length < 10) {
      setError('Por favor ingresa al menos 10 caracteres de código')
      return
    }

    if (!canAnalyze()) {
      if (analysisCount >= maxAnalyses) {
        setError(`Ya usaste los ${maxAnalyses} análisis permitidos para esta tarea`)
      } else {
        setError(`Espera ${cooldownRemaining}s antes del próximo análisis`)
      }
      return
    }

    // Bloquear exámenes
    if (taskType === 'examen') {
      setError('El análisis no está disponible para exámenes')
      return
    }

    setLoading(true)
    setError(null)
    setFeedback(null)

    try {
      const response = await axios.post(
        'http://localhost:8003/api/analysis/student-solution',
        {
          task_id: taskId,
          student_id: studentId,
          solution_code: studentCode,
          task_type: taskType,
          language: 'auto', // Auto-detect language
        },
        {
          timeout: 30000,
        }
      )

      if (response.data.success && response.data.data) {
        const feedbackData = response.data.data
        setFeedback(feedbackData)
        setAnalysisCount(feedbackData.analysis_count)
        setLastAnalysisTime(Date.now())
        setExpandedSection('conceptos_correctos')

        // Callback
        onAnalysisComplete?.(feedbackData)

        // Toast de éxito
        console.log('✅ Análisis completado exitosamente')
      } else {
        setError('No se recibió feedback del servidor')
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        'Error desconocido al analizar solución'
      setError(errorMessage)
      console.error('[SolutionFeedback] Error:', err)
    } finally {
      setLoading(false)
    }
  }, [studentCode, taskId, studentId, taskType, canAnalyze, analysisCount, maxAnalyses, cooldownRemaining, onAnalysisComplete])

  // Renderizar sección colapsable
  const renderSection = (
    title: string,
    icon: React.ReactNode,
    sectionKey: string,
    content: React.ReactNode,
    bgColor: string
  ) => {
    const isExpanded = expandedSection === sectionKey

    return (
      <div className={`rounded-lg border ${bgColor} mb-3`}>
        <button
          onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
          className="w-full flex items-center justify-between p-4 hover:opacity-80 transition"
        >
          <div className="flex items-center gap-3">
            {icon}
            <h4 className="font-semibold text-gray-900">{title}</h4>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {isExpanded && <div className="px-4 pb-4 border-t pt-4">{content}</div>}
      </div>
    )
  }

  // ========================================================================
  // RENDER PRINCIPAL
  // ========================================================================

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Análisis de Tu Solución</h3>
        </div>
        <p className="text-sm text-gray-600">
          Obtén feedback de IA sobre tu código (sin respuestas directas)
        </p>
      </div>

      {/* CONTADOR DE ANÁLISIS */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Análisis disponibles:</span>
          <span className="text-sm font-bold text-blue-600">
            {maxAnalyses - analysisCount} / {maxAnalyses}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 transition-all duration-300"
            style={{ width: `${((maxAnalyses - analysisCount) / maxAnalyses) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {analysisCount >= maxAnalyses
            ? '✅ Has alcanzado el límite de análisis'
            : `Tienes ${maxAnalyses - analysisCount} análisis disponibles`}
        </p>
      </div>

      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={analyzeSolution}
        disabled={loading || !canAnalyze()}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 mb-6 transition-all ${
          canAnalyze() && !loading
            ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Analizando tu código...
          </>
        ) : canAnalyze() ? (
          <>
            <Zap className="w-5 h-5" />
            Analizar Mi Solución
          </>
        ) : analysisCount >= maxAnalyses ? (
          <>
            <AlertCircle className="w-5 h-5" />
            Límite de análisis alcanzado
          </>
        ) : (
          <>
            <Clock className="w-5 h-5" />
            Espera {cooldownRemaining}s
          </>
        )}
      </button>

      {/* ESTADO DE COOLDOWN */}
      {cooldownRemaining > 0 && !canAnalyze() && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-900">Cooldown activo</p>
              <p className="text-sm text-yellow-700 mt-1">
                Espera {cooldownRemaining} segundos antes de tu próximo análisis
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">Error en el análisis</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK RESULTS */}
      {feedback && !loading && (
        <div className="space-y-3">
          {/* Conceptos Correctos */}
          {feedback.feedback.conceptos_correctos.length > 0 &&
            renderSection(
              `✅ Conceptos Correctos (${feedback.feedback.conceptos_correctos.length})`,
              <CheckCircle className="w-5 h-5 text-green-600" />,
              'conceptos_correctos',
              <div className="space-y-3">
                {feedback.feedback.conceptos_correctos.map((concepto, idx) => (
                  <div key={idx} className="p-3 bg-green-50 rounded border border-green-200">
                    <p className="font-medium text-green-900">{concepto.concepto}</p>
                    <p className="text-sm text-green-700 mt-1">{concepto.evidencia}</p>
                    {concepto.nivel && (
                      <p className="text-xs text-green-600 mt-2 capitalize">
                        Nivel: {concepto.nivel}
                      </p>
                    )}
                  </div>
                ))}
              </div>,
              'bg-green-50 border-green-200'
            )}

          {/* Conceptos Incompletos */}
          {feedback.feedback.conceptos_incompletos.length > 0 &&
            renderSection(
              `⚠️ Conceptos Incompletos (${feedback.feedback.conceptos_incompletos.length})`,
              <AlertTriangle className="w-5 h-5 text-yellow-600" />,
              'conceptos_incompletos',
              <div className="space-y-3">
                {feedback.feedback.conceptos_incompletos.map((concepto, idx) => (
                  <div key={idx} className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="font-medium text-yellow-900">{concepto.concepto}</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      <strong>Falta:</strong> {concepto.que_falta}
                    </p>
                    <div className="mt-2 p-2 bg-white rounded border-l-4 border-yellow-500">
                      <p className="text-sm text-yellow-800">
                        💭 {concepto.pregunta_reflexiva}
                      </p>
                    </div>
                  </div>
                ))}
              </div>,
              'bg-yellow-50 border-yellow-200'
            )}

          {/* Errores Detectados */}
          {feedback.feedback.errores_detectados.length > 0 &&
            renderSection(
              `🚨 Errores Detectados (${feedback.feedback.errores_detectados.length})`,
              <AlertCircle className="w-5 h-5 text-red-600" />,
              'errores',
              <div className="space-y-3">
                {feedback.feedback.errores_detectados.map((error, idx) => (
                  <div key={idx} className="p-3 bg-red-50 rounded border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-red-900">{error.tipo}</p>
                      <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                        {error.donde}
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mb-2">{error.problema_descripcion}</p>
                    <div className="p-2 bg-white rounded border-l-4 border-red-500 space-y-1">
                      <p className="text-sm text-red-800">
                        💡 <strong>Pregunta:</strong> {error.pregunta_guia}
                      </p>
                      <p className="text-sm text-red-800">
                        💡 <strong>Pista:</strong> {error.pista}
                      </p>
                    </div>
                  </div>
                ))}
              </div>,
              'bg-red-50 border-red-200'
            )}

          {/* Aspectos a Validar */}
          {feedback.feedback.aspectos_a_validar.length > 0 &&
            renderSection(
              `📋 Aspectos a Validar (${feedback.feedback.aspectos_a_validar.length})`,
              <AlertTriangle className="w-5 h-5 text-orange-600" />,
              'aspectos',
              <div className="space-y-3">
                {feedback.feedback.aspectos_a_validar.map((aspecto, idx) => (
                  <div key={idx} className="p-3 bg-orange-50 rounded border border-orange-200">
                    <p className="font-medium text-orange-900">{aspecto.aspecto}</p>
                    <div className="mt-2 p-2 bg-white rounded border-l-4 border-orange-500">
                      <p className="text-sm text-orange-800 mb-1">
                        💭 {aspecto.pregunta}
                      </p>
                      {aspecto.caso_especial && (
                        <p className="text-xs text-orange-700 mt-1">
                          <strong>Caso especial:</strong> {aspecto.caso_especial}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>,
              'bg-orange-50 border-orange-200'
            )}

          {/* Pistas Progresivas */}
          {feedback.feedback.pistas_progresivas.length > 0 &&
            renderSection(
              '💡 Pistas Progresivas',
              <Lightbulb className="w-5 h-5 text-blue-600" />,
              'pistas',
              <div className="space-y-2">
                {feedback.feedback.pistas_progresivas.map((pista, idx) => (
                  <div key={idx} className="p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-800">{pista}</p>
                  </div>
                ))}
              </div>,
              'bg-blue-50 border-blue-200'
            )}

          {/* Cosas Bien Hechas */}
          {feedback.feedback.cosas_bien_hechas.length > 0 &&
            renderSection(
              '✨ Lo Que Hiciste Bien',
              <CheckCircle className="w-5 h-5 text-green-600" />,
              'bien_hecho',
              <ul className="space-y-2">
                {feedback.feedback.cosas_bien_hechas.map((cosa, idx) => (
                  <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>{cosa}</span>
                  </li>
                ))}
              </ul>,
              'bg-green-50 border-green-200'
            )}

          {/* Siguiente Paso */}
          {feedback.feedback.siguiente_paso &&
            renderSection(
              '🎯 Próximo Paso',
              <Zap className="w-5 h-5 text-blue-600" />,
              'proximo_paso',
              <div className="p-4 bg-blue-50 rounded border border-blue-300">
                <p className="text-blue-900 font-medium">
                  {feedback.feedback.siguiente_paso}
                </p>
              </div>,
              'bg-blue-50 border-blue-200'
            )}

          {/* Metadata */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-600">
            <p>
              ⏱️ Análisis completado en {feedback.metadata.analysis_duration_ms}ms
            </p>
            <p>{new Date(feedback.metadata.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* ESTADO INICIAL */}
      {!feedback && !loading && !error && (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            Haz clic en "Analizar Mi Solución" para obtener feedback de IA
          </p>
        </div>
      )}

      {/* INFO BOX */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>ℹ️ Nota:</strong> Este análisis usa método socrático. Recibirás preguntas y
          pistas que te harán PENSAR, no respuestas directas. Máximo 5 análisis por tarea
          con 5 minutos de espera entre ellos.
        </p>
      </div>
    </div>
  )
}
