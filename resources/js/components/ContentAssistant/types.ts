/**
 * Tipos compartidos para el sistema ContentAssistant
 * Reutilizable para tareas, evaluaciones y otros contenidos
 */

export type ContentType = 'tarea' | 'evaluacion' | 'recurso'

export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface Course {
  id: number
  nombre: string
  codigo: string
  nivel?: string
}

/**
 * Respuesta del análisis del agente
 */
export interface AnalysisResponse {
  success: boolean
  analysis: ContentAnalysis
}

export interface ContentAnalysis {
  titulo_analizado: string
  tema_detectado?: string
  conceptos?: string[]
  descripcion_sugerida: string
  instrucciones_plantilla?: string
  complejidad_estimada: number
  dificultad: DifficultyLevel
  tiempo_estimado_minutos: number
  bloom_level: string
  puntuacion_rango?: {
    minimo: number
    sugerido: number
    maximo: number
  }
  observaciones_pedagogicas: string[]
  confidence: number
  metadata?: {
    timestamp: string
    llm_model_used: string
  }
}

/**
 * Sugerencias a aplicar al formulario
 */
export interface ContentSuggestions {
  descripcion: string
  instrucciones_plantilla?: string
  dificultad: DifficultyLevel
  tiempo_estimado: number
  puntuacion_sugerida?: number
  puntuacion_total?: number
  tiempo_limite?: number
  bloom_level?: string
  observaciones?: string[]
}

/**
 * Estados del análisis
 */
export type AnalysisState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Props para ContentAssistant
 */
export interface ContentAssistantProps {
  contentType: ContentType
  courseId: number | null
  onSuggestionsApplied: (suggestions: ContentSuggestions) => void
  initialData?: Record<string, any>
  children?: React.ReactNode
  title?: string
  courses?: Course[]
}

/**
 * Props para AssistedForm
 */
export interface AssistedFormProps {
  contentType: ContentType
  courseId: number | null
  onSuggestionsApplied: (suggestions: ContentSuggestions) => void
  courses?: Course[]
}

/**
 * Props para SuggestionsPanel
 */
export interface SuggestionsPanelProps {
  analysis: ContentAnalysis
  contentType: ContentType
  onApplySuggestions: (suggestions: ContentSuggestions) => void
  onDiscard: () => void
}
