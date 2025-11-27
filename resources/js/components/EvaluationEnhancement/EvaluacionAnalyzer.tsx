import React, { useState, useEffect } from 'react'
import { usePage } from '@inertiajs/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface Pregunta {
  enunciado: string
  tipo: string
  opciones?: string[] | null
  puntos: number
}

interface EvaluacionAnalyzerProps {
  evaluacionData: {
    titulo: string
    tipo_evaluacion: string
    curso_id: number
    preguntas: Pregunta[]
  }
  onAnalysisComplete?: (analysis: any) => void
  autoAnalyze?: boolean
  className?: string
}

interface Analysis {
  overall_score: number
  clarity_score: number
  difficulty_balance: {
    easy: number
    medium: number
    hard: number
  }
  estimated_time_minutes: number
  questions_analysis: Array<{
    question_index: number
    clarity_score: number
    bloom_level: string
    difficulty: number
    issues: string[]
    suggestions: string[]
  }>
  strengths: string[]
  warnings: string[]
  recommendations: string[]
}

export default function EvaluacionAnalyzer({
  evaluacionData,
  onAnalysisComplete,
  autoAnalyze = true,
  className = '',
}: EvaluacionAnalyzerProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())

  // Auto-analyze con debounce
  useEffect(() => {
    if (!autoAnalyze || !evaluacionData.preguntas.length) return

    const timer = setTimeout(() => {
      analyzeEvaluation()
    }, 2000)

    return () => clearTimeout(timer)
  }, [evaluacionData, autoAnalyze])

  const analyzeEvaluation = async () => {
    if (!evaluacionData.preguntas.length) {
      setAnalysis(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { csrf_token } = usePage().props

      const response = await fetch('/api/content/analyze-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token as string,
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(evaluacionData),
      })

      if (!response.ok) {
        throw new Error('Error al analizar la evaluación')
      }

      const data = await response.json()

      if (data.analysis) {
        setAnalysis(data.analysis)
        onAnalysisComplete?.(data.analysis)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(message)
      console.error('Error analyzing evaluation:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestionExpanded = (index: number) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedQuestions(newExpanded)
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty < 0.4) return 'bg-green-100 text-green-800'
    if (difficulty < 0.7) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getBloomBadgeColor = (level: string): string => {
    const levels: Record<string, string> = {
      remember: 'bg-blue-100 text-blue-800',
      understand: 'bg-purple-100 text-purple-800',
      apply: 'bg-indigo-100 text-indigo-800',
      analyze: 'bg-pink-100 text-pink-800',
      evaluate: 'bg-orange-100 text-orange-800',
      create: 'bg-red-100 text-red-800',
    }
    return levels[level] || 'bg-gray-100 text-gray-800'
  }

  // Cargar estado
  if (loading && !analysis) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Analizando evaluación con IA...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" onClick={analyzeEvaluation} className="ml-4">
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  // Sin análisis aún
  if (!analysis) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Agrega al menos una pregunta para ver el análisis
          </p>
          <Button onClick={analyzeEvaluation} size="sm">
            <ZapIcon className="h-4 w-4 mr-2" />
            Analizar Ahora
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Overall Quality Score */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-blue-600" />
            Puntuación de Calidad
          </CardTitle>
          <CardDescription>Análisis automático de tu evaluación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Puntuación General</span>
              <span className={cn('text-2xl font-bold', getScoreColor(analysis.overall_score))}>
                {analysis.overall_score}/100
              </span>
            </div>
            <Progress value={analysis.overall_score} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white p-3 border">
              <p className="text-xs text-muted-foreground">Claridad</p>
              <p className={cn('text-lg font-bold mt-1', getScoreColor(Math.round(analysis.clarity_score * 100)))}>
                {Math.round(analysis.clarity_score * 100)}%
              </p>
            </div>
            <div className="rounded-lg bg-white p-3 border">
              <p className="text-xs text-muted-foreground">Tiempo Estimado</p>
              <p className="text-lg font-bold mt-1">{analysis.estimated_time_minutes} min</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Balance de Dificultad</CardTitle>
          <CardDescription>Distribución de preguntas por nivel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Fácil (0-40%)</span>
                <Badge variant="outline">{Math.round(analysis.difficulty_balance.easy * 100)}%</Badge>
              </div>
              <Progress value={analysis.difficulty_balance.easy * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Media (40-70%)</span>
                <Badge variant="outline">{Math.round(analysis.difficulty_balance.medium * 100)}%</Badge>
              </div>
              <Progress value={analysis.difficulty_balance.medium * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Difícil (70-100%)</span>
                <Badge variant="outline">{Math.round(analysis.difficulty_balance.hard * 100)}%</Badge>
              </div>
              <Progress value={analysis.difficulty_balance.hard * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              Fortalezas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              Advertencias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.warnings.map((warning, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-600 font-bold mt-0.5">⚠</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-blue-600" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-600 font-bold mt-0.5">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Per-Question Analysis */}
      {analysis.questions_analysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Análisis por Pregunta</CardTitle>
            <CardDescription>{analysis.questions_analysis.length} preguntas analizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.questions_analysis.map((q, idx) => (
              <div key={idx} className="border rounded-lg">
                <button
                  onClick={() => toggleQuestionExpanded(q.question_index)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <span className="text-sm font-medium">Pregunta {q.question_index + 1}</span>
                    <Badge className={getDifficultyColor(q.difficulty)}>
                      {q.difficulty < 0.4 ? 'Fácil' : q.difficulty < 0.7 ? 'Media' : 'Difícil'}
                    </Badge>
                    <Badge className={getBloomBadgeColor(q.bloom_level)}>
                      {q.bloom_level}
                    </Badge>
                    <span className={cn('text-sm font-bold ml-auto', getScoreColor(q.clarity_score * 100))}>
                      {Math.round(q.clarity_score * 100)}%
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedQuestions.has(q.question_index) && 'rotate-180'
                    )}
                  />
                </button>

                {expandedQuestions.has(q.question_index) && (
                  <div className="border-t px-3 py-3 bg-gray-50 space-y-3">
                    {q.issues.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-red-700 mb-2">Problemas Identificados:</p>
                        <ul className="space-y-1">
                          {q.issues.map((issue, i) => (
                            <li key={i} className="text-xs text-red-600 flex gap-2">
                              <span>•</span> {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {q.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-blue-700 mb-2">Sugerencias de Mejora:</p>
                        <ul className="space-y-1">
                          {q.suggestions.map((suggestion, i) => (
                            <li key={i} className="text-xs text-blue-600 flex gap-2">
                              <span>→</span> {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Refresh Button */}
      <Button onClick={analyzeEvaluation} variant="outline" className="w-full" disabled={loading}>
        <SparklesIcon className="h-4 w-4 mr-2" />
        {loading ? 'Analizando...' : 'Reanálizar'}
      </Button>
    </div>
  )
}
