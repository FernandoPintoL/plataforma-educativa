/**
 * SuggestionsPanel - Panel que muestra las sugerencias del agente IA
 *
 * Displays:
 * - Análisis del título
 * - Sugerencias para descripción, instrucciones, dificultad, puntuación
 * - Observaciones pedagógicas
 * - Botones para aplicar, descartar o reanalizar
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, X, Sparkles, AlertCircle, Clock, Gauge, Trophy } from 'lucide-react'
import type { SuggestionsPanelProps, ContentSuggestions } from './types'

export default function SuggestionsPanel({
  analysis,
  contentType,
  onApplySuggestions,
  onDiscard
}: SuggestionsPanelProps) {
  // Determinar color de confianza
  const confidenceColor =
    analysis.confidence > 0.8
      ? 'bg-green-100 text-green-800 border-green-300'
      : analysis.confidence > 0.6
        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
        : 'bg-red-100 text-red-800 border-red-300'

  const difficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const difficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '🟢 Fácil'
      case 'medium':
        return '🟡 Media'
      case 'hard':
        return '🔴 Difícil'
      default:
        return difficulty
    }
  }

  // Preparar sugerencias para enviar
  const suggestions: ContentSuggestions = {
    descripcion: analysis.descripcion,
    instrucciones_plantilla: analysis.instrucciones_plantilla,
    dificultad: analysis.dificultad,
    tiempo_estimado: analysis.tiempo_limite,
    puntuacion_sugerida: analysis.puntuacion_sugerida,
    puntuacion_total: analysis.puntuacion_sugerida,
    tiempo_limite: analysis.tiempo_limite,
    bloom_level: analysis.nivel_bloom,
    observaciones: analysis.observaciones_pedagogicas,
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-blue-50 shadow-sm border-2">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                Análisis del Agente IA
                <Badge className={`${confidenceColor} border`}>
                  {Math.round(analysis.confidence * 100)}% confianza
                </Badge>
              </CardTitle>
              <CardDescription>
                {contentType === 'tarea'
                  ? 'Sugerencias inteligentes para tu tarea'
                  : contentType === 'evaluacion'
                    ? 'Sugerencias inteligentes para tu evaluación'
                    : 'Sugerencias inteligentes para tu contenido'}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descripción Sugerida */}
        <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-2">📝 Descripción Sugerida</p>
          <p className="text-sm text-gray-700 leading-relaxed">{analysis.descripcion}</p>
        </div>

        {/* Instrucciones Sugeridas (solo para tareas) */}
        {contentType === 'tarea' && analysis.instrucciones_plantilla && (
          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-2">📋 Instrucciones (Plantilla)</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs leading-relaxed bg-gray-50 p-3 rounded border border-gray-200">
              {analysis.instrucciones_plantilla}
            </p>
          </div>
        )}

        {/* Métricas Principales - Diseño Mejorado */}
        <div className="grid grid-cols-3 gap-3">
          {/* Dificultad */}
          <div className={`rounded-xl p-4 border-2 text-center transition-all hover:shadow-lg ${
            analysis.dificultad === 'easy'
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
              : analysis.dificultad === 'medium'
                ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
          }`}>
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${
              analysis.dificultad === 'easy'
                ? 'bg-green-200'
                : analysis.dificultad === 'medium'
                  ? 'bg-yellow-200'
                  : 'bg-red-200'
            }`}>
              <Gauge className={`w-5 h-5 ${
                analysis.dificultad === 'easy'
                  ? 'text-green-700'
                  : analysis.dificultad === 'medium'
                    ? 'text-yellow-700'
                    : 'text-red-700'
              }`} />
            </div>
            <p className={`text-xs font-bold mb-1 ${
              analysis.dificultad === 'easy'
                ? 'text-green-700'
                : analysis.dificultad === 'medium'
                  ? 'text-yellow-700'
                  : 'text-red-700'
            }`}>DIFICULTAD</p>
            <p className={`text-lg font-bold ${
              analysis.dificultad === 'easy'
                ? 'text-green-900'
                : analysis.dificultad === 'medium'
                  ? 'text-yellow-900'
                  : 'text-red-900'
            }`}>
              {difficultyLabel(analysis.dificultad)}
            </p>
            {/* Indicador visual de dificultad */}
            <div className="flex gap-1 mt-2 justify-center">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full ${
                    (analysis.dificultad === 'easy' && i === 1) ||
                    (analysis.dificultad === 'medium' && i <= 2) ||
                    (analysis.dificultad === 'hard' && i <= 3)
                      ? analysis.dificultad === 'easy'
                        ? 'bg-green-500'
                        : analysis.dificultad === 'medium'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      : 'bg-gray-300'
                  }`}
                  style={{ width: '8px' }}
                />
              ))}
            </div>
          </div>

          {/* Tiempo */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-300 text-center transition-all hover:shadow-lg">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 bg-blue-200">
              <Clock className="w-5 h-5 text-blue-700" />
            </div>
            <p className="text-xs font-bold text-blue-700 mb-1">TIEMPO</p>
            <p className="text-2xl font-bold text-blue-900">{analysis.tiempo_limite}</p>
            <p className="text-xs text-blue-600 mt-0.5">minutos</p>
            {/* Indicador de tiempo */}
            <div className="mt-2">
              <p className={`text-xs font-medium ${
                analysis.tiempo_limite <= 30
                  ? 'text-green-600'
                  : analysis.tiempo_limite <= 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}>
                {analysis.tiempo_limite <= 30
                  ? '⚡ Rápido'
                  : analysis.tiempo_limite <= 60
                    ? '⏱️ Medio'
                    : '⏳ Extenso'}
              </p>
            </div>
          </div>

          {/* Puntos */}
          {analysis.puntuacion_sugerida && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-300 text-center transition-all hover:shadow-lg">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-2 bg-purple-200">
                <Trophy className="w-5 h-5 text-purple-700" />
              </div>
              <p className="text-xs font-bold text-purple-700 mb-1">PUNTOS</p>
              <p className="text-2xl font-bold text-purple-900">
                {analysis.puntuacion_sugerida}
              </p>
              <p className="text-xs text-purple-600 mt-0.5">puntos</p>
              {/* Texto informativo */}
              <div className="mt-2">
                <p className="text-xs text-purple-600">
                  Puntuación sugerida
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Nivel de Bloom */}
        {analysis.nivel_bloom && (
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-700 mb-1">🧠 Nivel Cognitivo (Bloom)</p>
            <p className="text-sm text-indigo-900 font-medium capitalize">
              {analysis.nivel_bloom.replace(/_/g, ' ')}
            </p>
          </div>
        )}

        {/* Conceptos (si los hay) */}
        {analysis.conceptos && analysis.conceptos.length > 0 && (
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">🎯 Conceptos Detectados</p>
            <div className="flex flex-wrap gap-2">
              {analysis.conceptos.map((concepto, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {concepto}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Observaciones Pedagógicas */}
        {analysis.observaciones_pedagogicas && analysis.observaciones_pedagogicas.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
            <p className="text-sm font-semibold text-blue-900 mb-3">💡 Observaciones Pedagógicas</p>
            <ul className="space-y-2">
              {analysis.observaciones_pedagogicas.map((obs, idx) => (
                <li key={idx} className="text-sm text-blue-800 flex gap-2">
                  <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nota informativa */}
        <div className="flex gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Puedes editar todos estos valores en el formulario. Las sugerencias son recomendaciones
            basadas en análisis IA.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={() => onApplySuggestions(suggestions)}
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <ChevronRight className="w-4 h-4" />
            Aplicar Sugerencias
          </Button>
          <Button
            variant="outline"
            onClick={onDiscard}
            className="gap-2 border-gray-300"
            size="lg"
          >
            <X className="w-4 h-4" />
            Descartar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
