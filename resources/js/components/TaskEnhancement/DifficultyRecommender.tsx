/**
 * DifficultyRecommender Component
 *
 * Recomienda dificultad y puntuación basada en datos históricos del curso
 * y características de la tarea usando ML
 */

import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Zap,
  Clock
} from 'lucide-react'
import axios from 'axios'

interface DifficultyRecommendation {
  recommended_points: number
  points_range: [number, number]
  estimated_time_minutes: number
  expected_pass_rate: number
  difficulty_level: 'easy' | 'medium' | 'hard'
  reasoning: string
}

interface DifficultyRecommenderProps {
  courseId: number | null
  taskType: string
  complexity: number // 0-1
  onRecommendation?: (rec: DifficultyRecommendation) => void
  studentStats?: {
    avg_score: number
    std_dev: number
    count: number
  }
  title?: string
}

const DIFFICULTY_COLORS: Record<string, string> = {
  'easy': 'bg-green-100 text-green-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'hard': 'bg-red-100 text-red-800'
}

const DIFFICULTY_LABELS: Record<string, string> = {
  'easy': 'Fácil',
  'medium': 'Medio',
  'hard': 'Difícil'
}

export default function DifficultyRecommender({
  courseId,
  taskType,
  complexity,
  onRecommendation,
  studentStats,
  title
}: DifficultyRecommenderProps) {
  const [recommendation, setRecommendation] = useState<DifficultyRecommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId || complexity <= 0) return

    fetchRecommendation()
  }, [complexity, taskType, courseId])

  const fetchRecommendation = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        'http://localhost:8003/api/recommendation/difficulty',
        {
          course_id: courseId,
          task_context: {
            type: taskType,
            complexity,
            title: title || 'Sin título'
          },
          student_stats: studentStats || {
            avg_score: 75,
            std_dev: 15,
            count: 0
          }
        },
        {
          timeout: 30000 // 30 segundos
        }
      )

      if (response.data.success && response.data.data) {
        const rec = response.data.data
        setRecommendation(rec)
        onRecommendation?.(rec)
      } else {
        setError('No se recibió recomendación del servidor')
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail ||
        err.message ||
        'Error al obtener recomendación'
      setError(errorMessage)
      console.error('Error en recomendación:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!courseId) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Selecciona un curso para ver recomendaciones de dificultad
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          <p className="text-blue-700 font-medium">
            Calculando recomendación con IA...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Error en recomendación</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!recommendation) {
    return null
  }

  const passRatePercent = Math.round(recommendation.expected_pass_rate * 100)
  const [minPoints, maxPoints] = recommendation.points_range

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg border border-blue-200 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Recomendación de Dificultad
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Basada en datos históricos del curso y complejidad estimada
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          DIFFICULTY_COLORS[recommendation.difficulty_level]
        }`}>
          {DIFFICULTY_LABELS[recommendation.difficulty_level]}
        </div>
      </div>

      {/* Main Recommendation Box */}
      <div className="bg-white rounded-lg p-4 border border-blue-100 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recommended Points */}
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Puntos Recomendados
            </p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {recommendation.recommended_points}
            </p>
            <p className="text-xs text-gray-700 mt-2">
              Rango: {minPoints}-{maxPoints}
            </p>
          </div>

          {/* Pass Rate */}
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tasa de Éxito
            </p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {passRatePercent}%
            </p>
            <p className="text-xs text-gray-700 mt-2">
              Estudiantes que pasarán
            </p>
          </div>

          {/* Time Estimate */}
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tiempo Estimado
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <p className="text-3xl font-bold text-orange-600">
                {recommendation.estimated_time_minutes}
              </p>
            </div>
            <p className="text-xs text-gray-700 mt-2">minutos</p>
          </div>

          {/* Difficulty Indicator */}
          <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Distribución
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">Fácil (A)</span>
                <div className="w-20 bg-gray-200 rounded h-2">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: `${Math.max(15, recommendation.difficulty_level === 'easy' ? 40 : 20)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">Normal (B-C)</span>
                <div className="w-20 bg-gray-200 rounded h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded"
                    style={{ width: `${recommendation.difficulty_level === 'medium' ? 50 : 35}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-700">Difícil (F)</span>
                <div className="w-20 bg-gray-200 rounded h-2">
                  <div
                    className="bg-red-500 h-2 rounded"
                    style={{ width: `${recommendation.difficulty_level === 'hard' ? 30 : 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="bg-white bg-opacity-60 rounded-lg p-3 border-l-4 border-blue-500 mb-4">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-gray-900">💡 Razonamiento: </span>
          {recommendation.reasoning}
        </p>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Insight 1: Pass Rate */}
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-900">Distribución Esperada</p>
            <p className="text-xs text-green-700 mt-1">
              Aproximadamente el {passRatePercent}% de estudiantes deberían aprobar,
              manteniendo una distribución normal de calificaciones.
            </p>
          </div>
        </div>

        {/* Insight 2: Complexity */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Basado en Complejidad</p>
            <p className="text-xs text-blue-700 mt-1">
              Esta recomendación toma en cuenta la complejidad estimada
              ({Math.round(complexity * 100)}%) y el nivel del curso.
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Nota:</strong> Esta es una recomendación basada en datos históricos.
          Siempre puedes ajustar manualmente según tu criterio pedagógico.
        </p>
      </div>
    </div>
  )
}
