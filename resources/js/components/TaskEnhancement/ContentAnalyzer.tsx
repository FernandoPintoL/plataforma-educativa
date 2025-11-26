/**
 * ContentAnalyzer Component
 *
 * Analiza claridad y calidad pedagógica del contenido de una tarea/evaluación
 * usando LLM Groq a través del agente inteligente
 */

import React, { useState, useCallback } from 'react'
import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Lightbulb,
  Zap,
  BookOpen,
  Clock
} from 'lucide-react'
import axios from 'axios'

interface Issue {
  type: string
  severity: 'critical' | 'warning' | 'info'
  text: string
  explanation: string
  suggestion: string
}

interface ContentAnalysisResponse {
  clarity_score: number
  is_clear: boolean
  issues: Issue[]
  bloom_level: string
  estimated_difficulty: number
  estimated_time_minutes: number
  prerequisites: string[]
  strengths: string[]
  recommendations: string[]
}

interface ContentAnalyzerProps {
  content: string
  taskType: 'tarea' | 'evaluacion' | 'pregunta'
  courseContext: {
    nombre: string
    nivel: string
    tema: string
  }
  onAnalysisComplete?: (analysis: ContentAnalysisResponse) => void
  studentData?: {
    count: number
    avg_score: number
    std_dev: number
  }
}

const BLOOM_LABELS: Record<string, string> = {
  'remember': 'Recordar (Básico)',
  'understand': 'Comprender',
  'apply': 'Aplicar',
  'analyze': 'Analizar',
  'evaluate': 'Evaluar',
  'create': 'Crear (Avanzado)'
}

const BLOOM_COLORS: Record<string, string> = {
  'remember': 'bg-blue-100 text-blue-800',
  'understand': 'bg-cyan-100 text-cyan-800',
  'apply': 'bg-green-100 text-green-800',
  'analyze': 'bg-yellow-100 text-yellow-800',
  'evaluate': 'bg-orange-100 text-orange-800',
  'create': 'bg-purple-100 text-purple-800'
}

export default function ContentAnalyzer({
  content,
  taskType,
  courseContext,
  onAnalysisComplete,
  studentData
}: ContentAnalyzerProps) {
  const [analysis, setAnalysis] = useState<ContentAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoAnalyze, setAutoAnalyze] = useState(true)

  const analyzeContent = useCallback(async () => {
    if (!content || content.length < 10) {
      setError('Por favor ingresa al menos 10 caracteres de contenido')
      return
    }

    setLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const response = await axios.post(
        'http://localhost:8003/api/analysis/content-check',
        {
          content,
          task_type: taskType,
          course_context: courseContext,
          student_data: studentData
        },
        {
          timeout: 30000 // 30 segundos
        }
      )

      if (response.data) {
        setAnalysis(response.data)
        onAnalysisComplete?.(response.data)
      } else {
        setError('No se recibió respuesta del servidor')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail ||
        err.message ||
        'Error desconocido al analizar contenido'
      setError(errorMessage)
      console.error('Error en análisis:', err)
    } finally {
      setLoading(false)
    }
  }, [content, taskType, courseContext, studentData, onAnalysisComplete])

  // Auto-analizar cuando el contenido cambia (debounced)
  React.useEffect(() => {
    if (!autoAnalyze || !content || content.length < 10) return

    const timer = setTimeout(() => {
      analyzeContent()
    }, 2000) // 2 segundos de debounce

    return () => clearTimeout(timer)
  }, [content, autoAnalyze, analyzeContent])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="space-y-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            🔍 Análisis de Contenido
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            IA evalúa claridad y calidad pedagógica
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoAnalyze}
              onChange={(e) => setAutoAnalyze(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-600">Auto-analizar</span>
          </label>
          {!autoAnalyze && (
            <button
              onClick={analyzeContent}
              disabled={loading || !content}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Analizando...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analizar Ahora
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error en el análisis</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <p className="text-blue-700">Analizando con IA...</p>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="space-y-4">
          {/* Clarity Score */}
          <div className="p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Claridad</h4>
              <span className="text-2xl font-bold text-blue-600">
                {(analysis.clarity_score * 100).toFixed(0)}%
              </span>
            </div>

            {/* Clarity Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all ${
                  analysis.clarity_score > 0.75
                    ? 'bg-green-500'
                    : analysis.clarity_score > 0.5
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${analysis.clarity_score * 100}%` }}
              />
            </div>

            {/* Clear/Unclear Message */}
            <div className="mt-3 flex items-center gap-2">
              {analysis.is_clear ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Contenido claro y comprensible
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">
                    Se recomienda mejorar la claridad
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Bloom Level */}
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Nivel Cognitivo</p>
              <div className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                BLOOM_COLORS[analysis.bloom_level] || 'bg-gray-100 text-gray-800'
              }`}>
                {BLOOM_LABELS[analysis.bloom_level] || analysis.bloom_level}
              </div>
            </div>

            {/* Difficulty */}
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Dificultad</p>
              <div className="flex items-end gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 w-2 rounded ${
                      i < Math.round(analysis.estimated_difficulty * 3)
                        ? 'bg-orange-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-700 mt-1">
                {(analysis.estimated_difficulty * 100).toFixed(0)}%
              </p>
            </div>

            {/* Time */}
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Tiempo Estimado</p>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-semibold text-gray-900">
                  {analysis.estimated_time_minutes} min
                </p>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Prerequisitos</p>
              <p className="text-sm font-semibold text-gray-900">
                {analysis.prerequisites.length} concepto{analysis.prerequisites.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Issues */}
          {analysis.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Problemas Identificados ({analysis.issues.length})
              </h4>

              {analysis.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <em>"{issue.text}"</em>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {issue.explanation}
                      </p>
                      <div className="mt-2 p-2 bg-white bg-opacity-60 rounded border-l-2 border-green-500">
                        <p className="text-sm text-green-700">
                          <strong>💡 Sugerencia:</strong> {issue.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strengths */}
          {analysis.strengths.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5" />
                Puntos Fuertes
              </h4>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-green-800">
                    ✓ {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {analysis.prerequisites.length > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold text-purple-900 flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5" />
                Conceptos Prerequisitos
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.prerequisites.map((prereq, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded"
                  >
                    {prereq}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5" />
                Recomendaciones de Mejora
              </h4>
              <ol className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-blue-800">
                    <span className="font-semibold">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!analysis && !loading && !error && (
        <div className="p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {autoAnalyze
              ? 'Escribe contenido para que se analice automáticamente'
              : 'Ingresa contenido y haz clic en "Analizar Ahora"'}
          </p>
        </div>
      )}
    </div>
  )
}
