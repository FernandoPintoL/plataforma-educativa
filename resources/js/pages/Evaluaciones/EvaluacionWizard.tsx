import React, { useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
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

interface Props {
  cursos: Curso[]
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Evaluaciones', href: '/evaluaciones' },
  { title: 'Wizard', href: '/evaluaciones/wizard' },
]

type WizardMode = 'ia' | 'manual' | null
type WizardStep = 1 | 2 | 3 | 4

export default function EvaluacionWizard({ cursos }: Props) {
  const { csrf_token } = usePage().props

  const { data, setData, post, processing, errors } = useForm({
    titulo: '',
    descripcion: '',
    curso_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    tipo_evaluacion: 'examen',
    puntuacion_total: 100,
    tiempo_limite: 60,
    calificacion_automatica: true,
    mostrar_respuestas: true,
    permite_reintento: false,
    max_reintentos: 1,
    estado: 'borrador',
    preguntas: [] as Pregunta[],
  })

  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [mode, setMode] = useState<WizardMode>(null)
  const [generatingEvaluation, setGeneratingEvaluation] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

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

  const handleGenerateQuestions = async () => {
    setGeneratingEvaluation(true)
    setGenerationError(null)

    try {
      const response = await fetch('/api/content/generate-questions', {
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
          cantidad_preguntas: 5,
          dificultad_deseada: 'intermedia',
        }),
      })

      if (!response.ok) {
        throw new Error('Error generando preguntas')
      }

      const result = await response.json()

      // Add generated questions to existing ones
      const newQuestions = result.preguntas || []
      setData('preguntas', [...data.preguntas, ...newQuestions])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setGenerationError(message)
    } finally {
      setGeneratingEvaluation(false)
    }
  }

  const handleFinish = (estado: string) => {
    setData('estado', estado)
    post('/evaluaciones')
  }

  const handleSubmit = (e: React.FormEvent, estado: string) => {
    e.preventDefault()
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
                {mode === 'ia' ? 'Paso 3: Revisar y Editar' : 'Paso 3: Agregar Preguntas'}
              </CardTitle>
              <CardDescription>
                {mode === 'ia'
                  ? 'Revisa las preguntas generadas y edita si es necesario'
                  : 'Agrega y personaliza las preguntas de tu evaluación'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {generationError && (
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertDescription>
                    {generationError}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateEvaluation}
                      className="ml-4"
                    >
                      Reintentar
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {data.preguntas.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm">
                      <strong>{data.preguntas.length}</strong> preguntas
                      {mode === 'ia' && ' generadas'}
                    </p>
                  </div>

                  {data.preguntas.map((pregunta, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded border flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Pregunta {idx + 1} ({pregunta.tipo})
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {pregunta.enunciado}
                        </p>
                        <Badge className="mt-2">{pregunta.puntos} pts</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(idx)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      {generatingEvaluation
                        ? 'Generando preguntas con IA...'
                        : 'No hay preguntas. Agrega al menos una para continuar.'}
                    </AlertDescription>
                  </Alert>

                  {mode === 'ia' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={handleGenerateQuestions}
                        disabled={generatingEvaluation}
                        className="w-full"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        {generatingEvaluation ? 'Generando...' : 'Generar Preguntas con IA'}
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

              {mode === 'manual' && (
                <Button onClick={handleAddManualQuestion} variant="outline" className="w-full">
                  + Agregar Pregunta
                </Button>
              )}

              <div className="flex gap-2 pt-4">
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
                  Continuar
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
