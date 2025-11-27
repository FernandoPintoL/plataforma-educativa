import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

interface Pregunta {
  id?: number | string
  enunciado: string
  tipo: string
  opciones?: string[] | null
  puntos: number
  orden?: number
}

interface EvaluacionPreviewProps {
  data: {
    titulo?: string
    descripcion?: string
    tipo_evaluacion?: string
    tiempo_limite?: number | null
    puntuacion_total?: number
    preguntas?: Pregunta[]
  }
  showTimer?: boolean
  theme?: 'light' | 'dark'
  className?: string
}

export default function EvaluacionPreview({
  data,
  showTimer = false,
  className = '',
}: EvaluacionPreviewProps) {
  const {
    titulo = 'Título de la Evaluación',
    descripcion = 'Descripción de la evaluación',
    tipo_evaluacion = 'Tipo',
    tiempo_limite = null,
    puntuacion_total = 0,
    preguntas = [],
  } = data

  const totalPreguntas = preguntas.length
  const tiempoTotal = tiempo_limite ? tiempo_limite : null

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{titulo || 'Sin título'}</CardTitle>
          <CardDescription>{descripcion || 'Sin descripción'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Información Básica */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tipo</p>
              <Badge variant="outline" className="mt-1">
                {tipo_evaluacion}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Preguntas</p>
              <p className="text-sm font-semibold mt-1">{totalPreguntas}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Puntuación Total</p>
              <p className="text-sm font-semibold mt-1">{puntuacion_total} pts</p>
            </div>
            {tiempoTotal && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Tiempo Límite</p>
                <p className="text-sm font-semibold mt-1 flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {tiempoTotal} min
                </p>
              </div>
            )}
          </div>

          {/* Advertencia */}
          <Alert className="mt-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Esto es una vista previa de cómo verán los estudiantes esta evaluación.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Preguntas Preview */}
      {totalPreguntas > 0 ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            Vista Previa de Preguntas ({totalPreguntas})
          </p>
          {preguntas.map((pregunta, index) => (
            <Card key={pregunta.id || index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    Pregunta {index + 1} · {getTipoBadge(pregunta.tipo)}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {pregunta.puntos} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Enunciado */}
                <p className="text-sm whitespace-pre-wrap text-foreground">
                  {pregunta.enunciado || '(Sin enunciado)'}
                </p>

                {/* Opciones Preview */}
                {pregunta.tipo === 'opcion_multiple' && pregunta.opciones && (
                  <div className="space-y-2">
                    {pregunta.opciones.map((opcion, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="font-medium text-muted-foreground min-w-fit">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opcion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {pregunta.tipo === 'verdadero_falso' && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">A.</span>
                      <span>Verdadero</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-muted-foreground">B.</span>
                      <span>Falso</span>
                    </div>
                  </div>
                )}

                {(pregunta.tipo === 'respuesta_corta' ||
                  pregunta.tipo === 'respuesta_larga') && (
                  <div className="bg-muted rounded p-2 text-xs text-muted-foreground italic">
                    {pregunta.tipo === 'respuesta_corta'
                      ? 'Campo de respuesta corta'
                      : 'Campo de respuesta extendida'}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Aún no hay preguntas agregadas. Agrega preguntas para ver la vista previa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getTipoBadge(tipo: string): string {
  const tipos: Record<string, string> = {
    opcion_multiple: 'Opción Múltiple',
    verdadero_falso: 'V/F',
    respuesta_corta: 'Respuesta Corta',
    respuesta_larga: 'Respuesta Larga',
  }
  return tipos[tipo] || tipo
}
