import React, { useState, useEffect } from 'react'
import { useForm, usePage, router } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'
import { type BreadcrumbItem } from '@/types'
import EvaluacionForm from '@/components/Forms/EvaluacionForm'

interface Curso {
  id: number
  nombre: string
  codigo: string
}

interface Pregunta {
  enunciado: string
  tipo: string
  opciones: string[]
  respuesta_correcta: string
  puntos: number
}

interface ValidationResult {
  pregunta_id: number | string
  enunciado: string
  coherence_score: number
  is_coherent: boolean
  feedback: string
}

interface Props {
  cursos: Curso[]
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Evaluaciones', href: '/evaluaciones' },
  { title: 'Wizard', href: '/evaluaciones/wizard' },
]

type WizardMode = 'ia' | 'manual' | null
type WizardStep = 1 | 2 | 3 | 4

/**
 * Generar fechas por defecto coherentes
 * - Inicio: Mañana a las 8:00 AM
 * - Fin: Mismo día a las 9:00 AM (60 minutos después)
 */
const generateDefaultDates = () => {
  const now = new Date()

  // Fecha de inicio: Mañana a las 8:00 AM
  const inicio = new Date(now)
  inicio.setDate(inicio.getDate() + 1)
  inicio.setHours(8, 0, 0, 0)

  // Fecha de fin: Mismo día a las 9:00 AM (60 minutos después)
  const fin = new Date(inicio)
  fin.setHours(9, 0, 0, 0)

  // Formato: YYYY-MM-DDTHH:mm (compatible con input datetime-local)
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  return {
    fecha_inicio: formatDateTime(inicio),
    fecha_fin: formatDateTime(fin),
  }
}

export default function EvaluacionWizard({ cursos }: Props) {
  const { csrf_token } = usePage().props

  const defaultDates = generateDefaultDates()

  const { data, setData, post, processing, errors } = useForm({
    titulo: '',
    descripcion: '',
    curso_id: '',
    fecha_inicio: defaultDates.fecha_inicio,
    fecha_fin: defaultDates.fecha_fin,
    tipo_evaluacion: 'examen',
    puntuacion_total: 100,
    tiempo_limite: 60,
    calificacion_automatica: true,
    mostrar_respuestas: true,
    permite_reintento: true,
    max_reintentos: 3,
    estado: 'borrador',
    preguntas: [] as Pregunta[],
  })

  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [mode, setMode] = useState<WizardMode>(null)
  const [generatingEvaluation, setGeneratingEvaluation] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState<{ step: number; total: number; message: string }>({ step: 0, total: 0, message: '' })
  const [dificultadDistribucion, setDificultadDistribucion] = useState({
    facil: 2,
    medio: 3,
    dificil: 0,
  })
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [temasSeleccionados, setTemasSeleccionados] = useState<string[]>([])
  const [nuevoTema, setNuevoTema] = useState('')

  // Aplicar presets automáticamente cuando cambia el tipo de evaluación
  useEffect(() => {
    const presets = getRetryPresetsByType(data.tipo_evaluacion)
    setData('permite_reintento', presets.permite_reintento)
    setData('max_reintentos', presets.max_reintentos)
  }, [data.tipo_evaluacion, setData])

  const getRetryPresetsByType = (tipo: string): { permite_reintento: boolean; max_reintentos: number } => {
    switch (tipo) {
      case 'quiz':
        return { permite_reintento: true, max_reintentos: 3 }
      case 'practica':
        return { permite_reintento: true, max_reintentos: 5 }
      case 'parcial':
        return { permite_reintento: false, max_reintentos: 1 }
      case 'final':
        return { permite_reintento: false, max_reintentos: 1 }
      case 'examen':
        return { permite_reintento: true, max_reintentos: 2 }
      default:
        return { permite_reintento: true, max_reintentos: 3 }
    }
  }

  const canProceedStep2 = data.titulo.trim().length >= 5 && data.curso_id

  const handleModeSelect = (selectedMode: WizardMode) => {
    setMode(selectedMode)
    setCurrentStep(2)
  }

  const handleGenerateEvaluation = async () => {
    setGeneratingEvaluation(true)
    setGenerationError(null)

    try {
      const response = await fetch('/api/content/generate-evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token as string,
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          titulo: data.titulo,
          tipo_evaluacion: data.tipo_evaluacion,
          curso_id: parseInt(data.curso_id.toString()),
        }),
      })

      if (!response.ok) {
        throw new Error('Error generando evaluación')
      }

      const result = await response.json()

      // Pre-fill all evaluation data from AI generation
      setData({
        ...data,
        descripcion: result.descripcion || data.descripcion,
        preguntas: result.preguntas || [],
        puntuacion_total: result.puntuacion_total || 100,
        tiempo_limite: result.tiempo_limite || 60,
      })

      setCurrentStep(3)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setGenerationError(message)
    } finally {
      setGeneratingEvaluation(false)
    }
  }

  const handleProceedFromStep2 = () => {
    if (!canProceedStep2) return

    if (mode === 'ia') {
      handleGenerateEvaluation()
    } else {
      setCurrentStep(3)
    }
  }

  const handleAddManualQuestion = () => {
    const newQuestion: Pregunta = {
      enunciado: '',
      tipo: 'opcion_multiple',
      opciones: ['', '', '', ''],
      respuesta_correcta: '',
      puntos: 10,
    }
    const updatedQuestions = [...data.preguntas, newQuestion]
    setData('preguntas', updatedQuestions)
  }

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = data.preguntas.filter((_, i) => i !== index)
    setData('preguntas', updatedQuestions)
  }

  const totalPreguntas = dificultadDistribucion.facil + dificultadDistribucion.medio + dificultadDistribucion.dificil

  const handleGenerateQuestions = async () => {
    setGeneratingEvaluation(true)
    setGenerationError(null)
    setGenerationProgress({ step: 0, total: 0, message: '' })

    try {
      const todasLasPreguntas: Pregunta[] = []
      const dificultades = [
        { nivel: 'facil', cantidad: dificultadDistribucion.facil, numero: 1, label: 'Fácil' },
        { nivel: 'intermedia', cantidad: dificultadDistribucion.medio, numero: 2, label: 'Medio' },
        { nivel: 'dificil', cantidad: dificultadDistribucion.dificil, numero: 3, label: 'Difícil' },
      ]

      for (const { nivel, cantidad, numero, label } of dificultades) {
        if (cantidad === 0) continue

        setGenerationProgress({
          step: numero,
          total: 3,
          message: `Generando preguntas de nivel ${label} (${cantidad} preguntas)...`,
        })

        const requestBody: any = {
          titulo: data.titulo,
          tipo_evaluacion: data.tipo_evaluacion,
          curso_id: parseInt(data.curso_id.toString()),
          cantidad_preguntas: cantidad,
          dificultad_deseada: nivel,
        }

        // Solo incluir temas si hay alguno seleccionado
        if (temasSeleccionados.length > 0) {
          requestBody.temas = temasSeleccionados
        }

        console.log('📤 Request a generar preguntas:', requestBody)

        const response = await fetch('/api/content/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf_token as string,
            'Accept': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('❌ Error en respuesta:', errorData)
          throw new Error(
            errorData.message ||
              errorData.errors ||
              `Error generando preguntas de nivel ${nivel}`
          )
        }

        const result = await response.json()
        console.log('✅ Preguntas generadas:', result.preguntas?.length || 0)
        const newQuestions = result.preguntas || []
        todasLasPreguntas.push(...newQuestions)
      }

      // Add all generated questions to existing ones
      const preguntasActualizadas = [...data.preguntas, ...todasLasPreguntas]
      setData('preguntas', preguntasActualizadas)
      setGenerationProgress({ step: 3, total: 3, message: '✅ Preguntas generadas exitosamente' })

      // Validar coherencia después de generar
      await validateCoherence(data.titulo, preguntasActualizadas)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setGenerationError(message)
      setGenerationProgress({ step: 0, total: 0, message: '' })
    } finally {
      setGeneratingEvaluation(false)
      setTimeout(() => setGenerationProgress({ step: 0, total: 0, message: '' }), 2000)
    }
  }

  const validateCoherence = async (titulo: string, preguntas: Pregunta[]) => {
    if (preguntas.length === 0) return

    setIsValidating(true)
    try {
      const response = await fetch('/api/content/validate-questions-coherence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token as string,
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          titulo: titulo,
          preguntas: preguntas.map((p, idx) => ({
            id: idx,
            enunciado: p.enunciado,
          })),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setValidationResults(result.validaciones || [])
        console.log('✅ Validación de coherencia completada', result.resumen)
      }
    } catch (err) {
      console.error('Error validando coherencia:', err)
      // No mostrar error, continuar sin validación
    } finally {
      setIsValidating(false)
    }
  }

  const agregarTema = () => {
    if (nuevoTema.trim() && !temasSeleccionados.includes(nuevoTema.trim())) {
      setTemasSeleccionados([...temasSeleccionados, nuevoTema.trim()])
      setNuevoTema('')
    }
  }

  const removerTema = (tema: string) => {
    setTemasSeleccionados(temasSeleccionados.filter((t) => t !== tema))
  }

  const handleFinish = (estado: string) => {
    console.log('📡 Guardando evaluación con estado:', estado)

    // Crear objeto con TODOS los datos incluyendo el estado
    const datosCompletos = {
      ...data,
      estado: estado, // FORZAR el estado aquí
    }

    console.log('✅ Datos a guardar - Estado:', datosCompletos.estado)

    // Usar router.post() para tener control total sobre los datos
    router.post('/evaluaciones', datosCompletos, {
      onSuccess: () => {
        console.log('✅ Evaluación guardada')
        // Redirigir después de 500ms para asegurar
        setTimeout(() => {
          window.location.href = '/evaluaciones'
        }, 500)
      },
      onError: (errors: any) => {
        console.error('❌ Error:', errors)
      },
    })
  }

  const handleSubmit = (e: React.FormEvent, estado: string) => {
    e.preventDefault()
    console.log('🔵 [EvaluacionWizard] handleSubmit llamado con estado:', estado)
    handleFinish(estado)
  }

  const getProgressPercentage = () => {
    return (currentStep / 4) * 100
  }

  const isStepCompleted = (step: WizardStep): boolean => {
    switch (step) {
      case 1:
        return mode !== null
      case 2:
        return canProceedStep2
      case 3:
        return data.preguntas.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <SparklesIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Crear Evaluación</h1>
              <p className="text-muted-foreground">
                Guía paso a paso para crear evaluaciones profesionales
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <Progress value={getProgressPercentage()} className="mb-4" />
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-colors ${
                  step === currentStep
                    ? 'bg-blue-600 text-white'
                    : step < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step < currentStep ? <CheckCircleIcon className="h-5 w-5" /> : step}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Paso {currentStep} de 4
          </div>
        </div>

        {/* STEP 1: Mode Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Paso 1: Selecciona el Modo</CardTitle>
              <CardDescription>
                ¿Cómo prefieres crear tu evaluación?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IA Mode */}
                <button
                  onClick={() => handleModeSelect('ia')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <SparklesIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Con Asistencia IA</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        La IA genera una evaluación completa y lista para usar.
                        Solo proporciona el título y curso.
                      </p>
                      <div className="mt-4 space-y-1">
                        <p className="text-xs font-medium text-green-700">✓ Evaluación completa generada</p>
                        <p className="text-xs font-medium text-green-700">✓ Preguntas equilibradas</p>
                        <p className="text-xs font-medium text-green-700">✓ Tiempo y puntuación automáticos</p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Manual Mode */}
                <button
                  onClick={() => handleModeSelect('manual')}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <CheckCircleIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Modo Manual</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Creas todas las preguntas manualmente. Tienes control total sobre
                        cada aspecto de la evaluación.
                      </p>
                      <div className="mt-4 space-y-1">
                        <p className="text-xs font-medium text-green-700">✓ Control total</p>
                        <p className="text-xs font-medium text-green-700">✓ Preguntas personalizadas</p>
                        <p className="text-xs font-medium text-green-700">✓ Tu experiencia</p>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: Basic Information */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Paso 2: Información Básica</CardTitle>
              <CardDescription>
                {mode === 'ia'
                  ? 'Escribe el título y selecciona el curso. La IA generará el resto.'
                  : 'Completa los detalles de tu evaluación'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campos siempre visibles */}
              <div>
                <Label htmlFor="titulo">
                  Título <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titulo"
                  value={data.titulo}
                  onChange={(e) => setData('titulo', e.target.value)}
                  placeholder="Ej: Examen Parcial de Biología"
                  className="mt-1"
                  minLength={5}
                />
                {errors.titulo && <p className="text-sm text-red-500 mt-1">{errors.titulo}</p>}
              </div>

              <div>
                <Label htmlFor="curso_id">
                  Curso <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.curso_id.toString()}
                  onValueChange={(value) => setData('curso_id', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {cursos.map((curso) => (
                      <SelectItem key={curso.id} value={curso.id.toString()}>
                        {curso.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.curso_id && <p className="text-sm text-red-500 mt-1">{errors.curso_id}</p>}
              </div>

              {/* Campos solo para modo IA - Seleccionar temas/conceptos */}
              {mode === 'ia' && (
                <div className="space-y-3 pt-4 border-t bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-blue-600" />
                      Temas/Conceptos (Opcional)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">
                      Especifica los temas que deseas evaluar. Las preguntas serán más coherentes y específicas.
                    </p>

                    {/* Input para agregar nuevos temas */}
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Ej: Derivadas, Integrales, Funciones..."
                        value={nuevoTema}
                        onChange={(e) => setNuevoTema(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            agregarTema()
                          }
                        }}
                        className="text-sm"
                      />
                      <Button
                        type="button"
                        onClick={agregarTema}
                        variant="outline"
                        className="whitespace-nowrap"
                        disabled={!nuevoTema.trim()}
                      >
                        + Agregar
                      </Button>
                    </div>

                    {/* Temas seleccionados */}
                    {temasSeleccionados.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {temasSeleccionados.map((tema, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="px-3 py-1.5 flex items-center gap-2 bg-blue-200 text-blue-900 hover:bg-blue-300 cursor-pointer"
                            onClick={() => removerTema(tema)}
                          >
                            {tema}
                            <span className="ml-1 text-xs">✕</span>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {temasSeleccionados.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">
                        Sin temas específicos - La IA generará preguntas generales del curso
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Campos solo para modo manual - aparecer con animación suave */}
              {mode === 'manual' && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={data.descripcion}
                      onChange={(e) => setData('descripcion', e.target.value)}
                      placeholder="Describe brevemente qué temas cubre la evaluación..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipo_evaluacion">Tipo de Evaluación</Label>
                    <Select
                      value={data.tipo_evaluacion}
                      onValueChange={(value) => setData('tipo_evaluacion', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="examen">Examen</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="parcial">Parcial</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                        <SelectItem value="practica">Práctica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  disabled={processing || generatingEvaluation}
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleProceedFromStep2}
                  disabled={!canProceedStep2 || processing || generatingEvaluation}
                  className="flex-1"
                >
                  {generatingEvaluation ? 'Generando...' : 'Continuar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: Review & Edit Questions */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {mode === 'ia' ? 'Paso 3: Generar y Revisar Preguntas' : 'Paso 3: Agregar Preguntas'}
              </CardTitle>
              <CardDescription>
                {mode === 'ia'
                  ? 'Configura los niveles de dificultad y genera preguntas coherentes con el título'
                  : 'Agrega y personaliza las preguntas de tu evaluación'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error Alert */}
              {generationError && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>
                    {generationError}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGenerationError(null)}
                      className="ml-4"
                    >
                      Descartar
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {/* IA Mode: Difficulty Distribution Selector */}
              {mode === 'ia' && !generatingEvaluation && (
                <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <SparklesIcon className="h-4 w-4 text-blue-600" />
                    Distribución de Dificultad
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Especifica cuántas preguntas deseas de cada nivel. Total: <strong>{totalPreguntas}</strong>
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Fácil */}
                    <div>
                      <Label htmlFor="dif-facil" className="text-xs font-medium text-green-700 block mb-2">
                        Fácil
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              facil: Math.max(0, d.facil - 1),
                            }))
                          }
                          className="h-8 w-8 p-0"
                        >
                          −
                        </Button>
                        <input
                          id="dif-facil"
                          type="number"
                          min="0"
                          value={dificultadDistribucion.facil}
                          onChange={(e) =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              facil: Math.max(0, parseInt(e.target.value) || 0),
                            }))
                          }
                          className="w-12 text-center border rounded py-1 text-sm font-medium"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              facil: d.facil + 1,
                            }))
                          }
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Medio */}
                    <div>
                      <Label htmlFor="dif-medio" className="text-xs font-medium text-yellow-700 block mb-2">
                        Medio
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              medio: Math.max(0, d.medio - 1),
                            }))
                          }
                          className="h-8 w-8 p-0"
                        >
                          −
                        </Button>
                        <input
                          id="dif-medio"
                          type="number"
                          min="0"
                          value={dificultadDistribucion.medio}
                          onChange={(e) =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              medio: Math.max(0, parseInt(e.target.value) || 0),
                            }))
                          }
                          className="w-12 text-center border rounded py-1 text-sm font-medium"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              medio: d.medio + 1,
                            }))
                          }
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>

                    {/* Difícil */}
                    <div>
                      <Label htmlFor="dif-dificil" className="text-xs font-medium text-red-700 block mb-2">
                        Difícil
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              dificil: Math.max(0, d.dificil - 1),
                            }))
                          }
                          className="h-8 w-8 p-0"
                        >
                          −
                        </Button>
                        <input
                          id="dif-dificil"
                          type="number"
                          min="0"
                          value={dificultadDistribucion.dificil}
                          onChange={(e) =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              dificil: Math.max(0, parseInt(e.target.value) || 0),
                            }))
                          }
                          className="w-12 text-center border rounded py-1 text-sm font-medium"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setDificultadDistribucion((d) => ({
                              ...d,
                              dificil: d.dificil + 1,
                            }))
                          }
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Feedback */}
              {generatingEvaluation && generationProgress.total > 0 && (
                <div className="space-y-3 p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                    <p className="text-sm font-medium">{generationProgress.message}</p>
                  </div>
                  <Progress
                    value={(generationProgress.step / generationProgress.total) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    Paso {generationProgress.step} de {generationProgress.total}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {generationProgress.message === '✅ Preguntas generadas exitosamente' && !generatingEvaluation && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {generationProgress.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Questions List */}
              {data.preguntas.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200 flex items-center justify-between">
                    <p className="text-sm">
                      <strong>{data.preguntas.length}</strong> preguntas
                      {mode === 'ia' && ' generadas'}
                    </p>
                    {mode === 'ia' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateQuestions}
                        disabled={generatingEvaluation || totalPreguntas === 0}
                        className="text-xs"
                      >
                        <SparklesIcon className="h-3 w-3 mr-1" />
                        Generar más
                      </Button>
                    )}
                  </div>

                  {data.preguntas.map((pregunta, idx) => {
                    const validation = validationResults[idx]
                    const coherenceColor =
                      validation && validation.is_coherent
                        ? validation.coherence_score >= 0.8
                          ? 'bg-green-50 border-green-200'
                          : 'bg-blue-50 border-blue-200'
                        : 'bg-yellow-50 border-yellow-200'

                    return (
                      <div key={idx} className={`p-4 rounded border flex items-start justify-between hover:shadow-md transition ${coherenceColor}`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium">Pregunta {idx + 1}</p>
                            <Badge variant="secondary" className="text-xs">
                              {pregunta.tipo}
                            </Badge>

                            {/* Coherence Badge */}
                            {validation && (
                              <Badge
                                className={`text-xs ml-auto ${
                                  validation.is_coherent
                                    ? validation.coherence_score >= 0.8
                                      ? 'bg-green-600 hover:bg-green-700'
                                      : 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-yellow-600 hover:bg-yellow-700'
                                }`}
                                title={validation.feedback}
                              >
                                {validation.coherence_score >= 0.8 && '✓ Muy coherente'}
                                {validation.coherence_score >= 0.6 && validation.coherence_score < 0.8 && '✓ Coherente'}
                                {validation.coherence_score < 0.6 && '⚠️ Revisar coherencia'}
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {pregunta.enunciado}
                          </p>

                          <div className="flex gap-2 mt-2 items-center">
                            <Badge>{pregunta.puntos} pts</Badge>
                            {validation && (
                              <span className="text-xs text-muted-foreground">
                                Coherencia: {(validation.coherence_score * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>

                          {validation && !validation.is_coherent && (
                            <p className="text-xs text-yellow-700 mt-2 italic">
                              💡 {validation.feedback}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar pregunta"
                        >
                          ✕
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      {generatingEvaluation
                        ? 'Generando preguntas con IA...'
                        : 'No hay preguntas. ' + (mode === 'ia' ? 'Configura la dificultad y genera preguntas.' : 'Agrega al menos una para continuar.')}
                    </AlertDescription>
                  </Alert>

                  {mode === 'ia' && !generatingEvaluation && totalPreguntas > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={handleGenerateQuestions}
                        disabled={generatingEvaluation}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Generar {totalPreguntas} Preguntas
                      </Button>
                      <Button
                        onClick={handleAddManualQuestion}
                        variant="outline"
                        disabled={generatingEvaluation}
                        className="w-full"
                      >
                        + Agregar Manualmente
                      </Button>
                    </div>
                  )}

                  {mode === 'manual' && (
                    <Button onClick={handleAddManualQuestion} variant="outline" className="w-full">
                      + Agregar Pregunta
                    </Button>
                  )}
                </div>
              )}

              {mode === 'manual' && data.preguntas.length > 0 && (
                <Button onClick={handleAddManualQuestion} variant="outline" className="w-full">
                  + Agregar Otra Pregunta
                </Button>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  disabled={generatingEvaluation}
                >
                  Atrás
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  disabled={data.preguntas.length === 0 || generatingEvaluation}
                  className="flex-1"
                >
                  Continuar al Paso 4
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: Final Configuration */}
        {currentStep === 4 && (
          <div>
            <EvaluacionForm
              data={data}
              setData={setData}
              errors={errors}
              processing={processing}
              cursos={cursos}
              onSubmit={handleSubmit}
              hideButtons={true}
            />

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(3)}
                disabled={processing}
                className="flex-1"
              >
                Atrás
              </Button>
              <Button
                onClick={(e) => handleSubmit(e, 'borrador')}
                disabled={processing}
                variant="outline"
              >
                Guardar Borrador
              </Button>
              <Button
                onClick={(e) => handleSubmit(e, 'publicado')}
                disabled={processing}
                className="flex-1"
              >
                {processing ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
