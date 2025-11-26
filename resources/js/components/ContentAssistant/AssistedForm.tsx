/**
 * AssistedForm - Formulario con asistencia de IA
 *
 * Permite al usuario:
 * 1. Ingresar título y seleccionar curso
 * 2. Hacer clic en "Consultar con IA"
 * 3. Recibir sugerencias del agente
 * 4. Aplicar, descartar o reanalizar las sugerencias
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Sparkles, RotateCw, AlertCircle, AlertTriangle } from 'lucide-react'
import axios from 'axios'
import SuggestionsPanel from './SuggestionsPanel'
import type { AssistedFormProps, ContentAnalysis, ContentSuggestions } from './types'

export default function AssistedForm({
  contentType,
  courseId: initialCourseId,
  onSuggestionsApplied,
  courses = []
}: AssistedFormProps) {
  const [titulo, setTitulo] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId?.toString() || ''
  )
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localCourses, setLocalCourses] = useState(courses)

  // Cargar cursos si no se proporcionan
  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses()
    }
  }, [courses])

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/cursos')
      setLocalCourses(response.data)
    } catch (err) {
      console.error('Error cargando cursos:', err)
    }
  }

  const handleConsult = async () => {
    // Validación
    if (!titulo.trim()) {
      setError('Por favor escribe el título de la ' + (contentType === 'tarea' ? 'tarea' : 'evaluación'))
      return
    }

    if (titulo.trim().length < 5) {
      setError('El título debe tener al menos 5 caracteres')
      return
    }

    if (!selectedCourseId) {
      setError('Por favor selecciona un curso')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Obtener CSRF token de la meta tag
      const csrfTokenElement = document.querySelector('meta[name="csrf-token"]')
      const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute('content') : ''

      const response = await axios.post(
        '/api/content/analyze',
        {
          titulo: titulo.trim(),
          curso_id: parseInt(selectedCourseId),
          content_type: contentType,
        },
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.data.success) {
        setAnalysis(response.data.analysis)
      } else {
        setError(response.data.message || 'No se pudo obtener el análisis')
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al consultar el agente. Por favor intenta de nuevo.'

      setError(errorMessage)
      console.error('Error en análisis:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReanalyze = () => {
    setAnalysis(null)
    setTimeout(() => handleConsult(), 100)
  }

  const handleDiscard = () => {
    setAnalysis(null)
    setError(null)
  }

  const handleApplySuggestions = (suggestions: ContentSuggestions) => {
    onSuggestionsApplied(suggestions)
    // Limpiar el panel de sugerencias
    handleDiscard()
  }

  return (
    <div className="space-y-4">
      {/* Card de Entrada de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Información Básica
          </CardTitle>
          <CardDescription>
            Completa estos campos para que el agente analice tu{' '}
            {contentType === 'tarea' ? 'tarea' : contentType === 'evaluacion' ? 'evaluación' : 'contenido'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Campo: Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo" className="font-semibold">
              Título *
            </Label>
            <Input
              id="titulo"
              placeholder={
                contentType === 'tarea'
                  ? 'Ej: Ensayo sobre la Revolución Francesa'
                  : 'Ej: Evaluación de Álgebra - Unidad 3'
              }
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value)
                if (error) setError(null)
              }}
              disabled={loading}
              className="text-base"
            />
            <p className="text-xs text-gray-500">
              Mínimo 5 caracteres • {titulo.length} caracteres
            </p>
          </div>

          {/* Campo: Curso */}
          <div className="space-y-2">
            <Label htmlFor="curso" className="font-semibold">
              Curso *
            </Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId} disabled={loading}>
              <SelectTrigger id="curso" className="text-base">
                <SelectValue placeholder="Selecciona un curso" />
              </SelectTrigger>
              <SelectContent>
                {localCourses.length > 0 ? (
                  localCourses.map((curso) => (
                    <SelectItem key={curso.id} value={curso.id.toString()}>
                      {curso.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No hay cursos disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Alerta de Error */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleConsult}
              disabled={
                !titulo.trim() || titulo.trim().length < 5 || !selectedCourseId || loading
              }
              className="gap-2 flex-1 text-base py-5"
              size="lg"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {!loading && <Sparkles className="w-4 h-4" />}
              {loading ? 'Consultando con IA...' : 'Consultar con IA'}
            </Button>

            {analysis && !loading && (
              <Button
                variant="outline"
                onClick={handleReanalyze}
                disabled={loading}
                className="gap-2"
              >
                <RotateCw className="w-4 h-4" />
                Reanalizar
              </Button>
            )}
          </div>

          {/* Texto informativo */}
          <div className="flex gap-2 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              El agente analizará el título y te sugerirá contenido. Podrás revisar, ajustar o descartar
              las sugerencias.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Panel de Sugerencias (cuando hay análisis) */}
      {analysis && !loading && (
        <SuggestionsPanel
          analysis={analysis}
          contentType={contentType}
          onApplySuggestions={handleApplySuggestions}
          onDiscard={handleDiscard}
        />
      )}

      {/* Estado de carga */}
      {loading && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex gap-3 items-center">
              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              <div>
                <p className="font-semibold text-purple-900">Analizando con IA...</p>
                <p className="text-sm text-purple-700">Esto puede tomar 2-3 segundos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
