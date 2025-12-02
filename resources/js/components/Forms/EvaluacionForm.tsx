/**
 * EvaluacionForm - Formulario de Evaluaciones Reutilizable
 *
 * Este componente contiene toda la lógica y UI para crear/editar evaluaciones.
 * Se utiliza tanto en modo manual como con asistencia IA.
 *
 * Props:
 * - data: Datos del formulario
 * - setData: Función para actualizar datos
 * - errors: Errores de validación
 * - processing: Estado de envío
 * - cursos: Lista de cursos disponibles
 * - onSubmit: Callback para el submit
 */

import React, { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PlusIcon, XMarkIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { Course } from '@/components/ContentAssistant'

interface Pregunta {
  enunciado: string
  tipo: string
  opciones: string[]
  respuesta_correcta: string
  tema?: string
  puntos: number
}

interface EvaluacionFormProps {
  data: {
    titulo: string
    descripcion: string
    curso_id: string | number
    fecha_inicio: string
    fecha_fin: string
    tipo_evaluacion: string
    puntuacion_total: number
    tiempo_limite: number
    calificacion_automatica: boolean
    mostrar_respuestas: boolean
    permite_reintento: boolean
    max_reintentos: number
    estado: string
    preguntas: Pregunta[]
  }
  setData: (key: string, value: any) => void
  errors: Record<string, string>
  processing: boolean
  cursos: Course[]
  onSubmit: (e: React.FormEvent, estado: string) => void
  onPreviewDataChange?: (previewData: any) => void
  hideButtons?: boolean  // Si true, no renderiza botones (el Wizard los maneja)
}

export default function EvaluacionForm({
  data,
  setData,
  errors,
  processing,
  cursos,
  onSubmit,
  onPreviewDataChange,
  hideButtons = false,
}: EvaluacionFormProps) {
  const [preguntas, setPreguntas] = useState<Pregunta[]>(data.preguntas || [])
  const [puntuacionMaxima, setPuntuacionMaxima] = useState<number>(100)
  const [puntuacionEditada, setPuntuacionEditada] = useState<number>(data.puntuacion_total || 0)

  // Debounce para notificar cambios al preview y actualizar puntuación total
  useEffect(() => {
    const timer = setTimeout(() => {
      const nuevaPuntuacion = preguntas.reduce((sum, p) => sum + Number(p.puntos || 0), 0)

      // Actualizar puntuación total automáticamente
      if (nuevaPuntuacion !== data.puntuacion_total) {
        setData('puntuacion_total', nuevaPuntuacion)
      }

      if (onPreviewDataChange) {
        onPreviewDataChange({
          titulo: data.titulo,
          descripcion: data.descripcion,
          tipo_evaluacion: data.tipo_evaluacion,
          tiempo_limite: data.tiempo_limite,
          puntuacion_total: nuevaPuntuacion,
          preguntas: preguntas,
        })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [data.titulo, data.descripcion, data.tipo_evaluacion, data.tiempo_limite, preguntas, onPreviewDataChange, data.puntuacion_total, setData])

  const handleAddPregunta = () => {
    const nuevaPregunta: Pregunta = {
      enunciado: '',
      tipo: 'opcion_multiple',
      opciones: ['', '', '', ''],
      respuesta_correcta: '',
      tema: '',
      puntos: 0,
    }
    setPreguntas([...preguntas, nuevaPregunta])
  }

  const handleRemovePregunta = (index: number) => {
    setPreguntas(preguntas.filter((_, i) => i !== index))
  }

  const handlePreguntaChange = (index: number, field: string, value: any) => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[index] = {
      ...nuevasPreguntas[index],
      [field]: value,
    }
    setPreguntas(nuevasPreguntas)
  }

  const handleOpcionChange = (preguntaIndex: number, opcionIndex: number, value: string) => {
    const nuevasPreguntas = [...preguntas]
    const nuevasOpciones = [...nuevasPreguntas[preguntaIndex].opciones]
    nuevasOpciones[opcionIndex] = value
    nuevasPreguntas[preguntaIndex].opciones = nuevasOpciones
    setPreguntas(nuevasPreguntas)
  }

  const handleAddOpcion = (preguntaIndex: number) => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[preguntaIndex].opciones.push('')
    setPreguntas(nuevasPreguntas)
  }

  const handleRemoveOpcion = (preguntaIndex: number, opcionIndex: number) => {
    const nuevasPreguntas = [...preguntas]
    nuevasPreguntas[preguntaIndex].opciones = nuevasPreguntas[preguntaIndex].opciones.filter(
      (_, i) => i !== opcionIndex
    )
    setPreguntas(nuevasPreguntas)
  }

  const puntuacionTotal = preguntas.reduce((sum, p) => sum + Number(p.puntos || 0), 0)
  const excedePuntuacion = puntuacionTotal > puntuacionMaxima
  const porcentajeUtilizado = puntuacionMaxima > 0 ? (puntuacionTotal / puntuacionMaxima) * 100 : 0

  /**
   * Normalizar/redistribuir puntos para que quepan dentro de la puntuación máxima
   */
  const normalizarPuntos = () => {
    if (preguntas.length === 0 || puntuacionTotal === 0) return

    const factor = puntuacionMaxima / puntuacionTotal
    const preguntasNormalizadas = preguntas.map((p) => ({
      ...p,
      puntos: Math.round(p.puntos * factor),
    }))

    // Ajustar diferencias de redondeo
    const nuevaSuma = preguntasNormalizadas.reduce((sum, p) => sum + p.puntos, 0)
    const diferencia = puntuacionMaxima - nuevaSuma

    if (diferencia !== 0 && preguntasNormalizadas.length > 0) {
      preguntasNormalizadas[0].puntos += diferencia
    }

    setPreguntas(preguntasNormalizadas)
  }

  /**
   * Distribuir puntos equitativamente según la puntuación máxima
   */
  const distribuirEquitativamente = () => {
    if (preguntas.length === 0) return

    const puntosPorPregunta = Math.floor(puntuacionMaxima / preguntas.length)
    const resto = puntuacionMaxima % preguntas.length

    const preguntasDistribuidas = preguntas.map((p, idx) => ({
      ...p,
      puntos: puntosPorPregunta + (idx < resto ? 1 : 0),
    }))

    setPreguntas(preguntasDistribuidas)
  }

  const handleFormSubmit = (e: React.FormEvent, estado: string) => {
    e.preventDefault()

    // Validar que no se exceda la puntuación
    if (excedePuntuacion) {
      console.error('❌ Error: La puntuación total excede el máximo permitido')
      alert(`⚠️ Error de validación: La suma de puntos (${puntuacionTotal}) excede la puntuación máxima (${puntuacionMaxima}).\n\nUsa "Normalizar Puntos" o "Distribuir Equitativamente" para corregir.`)
      return
    }

    console.log('🔵 [EvaluacionForm] handleFormSubmit llamado con estado:', estado)
    console.log('📋 [EvaluacionForm] Datos del formulario:', {
      titulo: data.titulo,
      tipo_evaluacion: data.tipo_evaluacion,
      preguntas: preguntas.length,
      puntuacion_total: puntuacionTotal,
      puntuacion_maxima: puntuacionMaxima,
      estado: estado,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      tiempo_limite: data.tiempo_limite,
    })

    setData('preguntas', preguntas)
    // Usar la puntuación máxima como la puntuación total si se configura
    setData('puntuacion_total', puntuacionTotal || puntuacionMaxima)

    console.log('📤 [EvaluacionForm] Enviando datos con estado:', estado)

    // Llamar al callback onSubmit (que será manejado por la página)
    const event = new Event('submit', { bubbles: true })
    Object.defineProperty(event, 'target', { value: e.target, enumerable: true })
    onSubmit(event as any, estado)
  }

  return (
    <form id="evaluacion-form" className="space-y-6">
      {/* Input hidden para el estado - asegurar que se envíe */}
      <input type="hidden" name="estado" value={data.estado} onChange={() => {}} />
      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Datos básicos de la evaluación</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Título */}
          <div>
            <Label htmlFor="titulo">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titulo"
              value={data.titulo}
              onChange={(e) => setData('titulo', e.target.value)}
              placeholder="Ej: Examen Parcial 1"
              className="mt-1"
              disabled={processing}
            />
            {errors.titulo && <p className="text-sm text-red-500 mt-1">{errors.titulo}</p>}
          </div>

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={data.descripcion}
              onChange={(e) => setData('descripcion', e.target.value)}
              placeholder="Describe el contenido de la evaluación..."
              rows={3}
              className="mt-1"
              disabled={processing}
            />
          </div>

          {/* Curso */}
          <div>
            <Label htmlFor="curso_id">
              Curso <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.curso_id.toString()}
              onValueChange={(value) => setData('curso_id', value)}
              disabled={processing}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona un curso" />
              </SelectTrigger>
              <SelectContent>
                {cursos.map((curso) => (
                  <SelectItem key={curso.id} value={curso.id.toString()}>
                    {curso.nombre} ({curso.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.curso_id && <p className="text-sm text-red-500 mt-1">{errors.curso_id}</p>}
          </div>

          {/* Tipo de Evaluación */}
          <div>
            <Label htmlFor="tipo_evaluacion">Tipo de Evaluación</Label>
            <Select
              value={data.tipo_evaluacion}
              onValueChange={(value) => setData('tipo_evaluacion', value)}
              disabled={processing}
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

          {/* Fechas de Disponibilidad */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="datetime-local"
                value={data.fecha_inicio}
                onChange={(e) => setData('fecha_inicio', e.target.value)}
                className="mt-1"
                disabled={processing}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Cuándo estará disponible la evaluación
              </p>
            </div>

            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="datetime-local"
                value={data.fecha_fin}
                onChange={(e) => setData('fecha_fin', e.target.value)}
                className="mt-1"
                disabled={processing}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Hasta cuándo se puede presentar
              </p>
            </div>
          </div>

          {/* Tiempo Límite */}
          <div>
            <Label htmlFor="tiempo_limite" className="flex items-center gap-2">
              Tiempo Límite (minutos) <ClockIcon className="h-4 w-4" />
            </Label>
            <Input
              id="tiempo_limite"
              type="number"
              value={data.tiempo_limite}
              onChange={(e) => setData('tiempo_limite', Number(e.target.value))}
              min={1}
              max={480}
              className="mt-1"
              disabled={processing}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Tiempo que tendrán los estudiantes para completar la evaluación
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>Opciones de calificación y reintentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calificación Automática */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Calificación Automática</Label>
              <p className="text-sm text-muted-foreground">
                Calificar automáticamente las respuestas correctas
              </p>
            </div>
            <Switch
              checked={data.calificacion_automatica}
              onCheckedChange={(checked) => setData('calificacion_automatica', checked)}
              disabled={processing}
            />
          </div>

          {/* Mostrar Respuestas */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mostrar Respuestas Correctas</Label>
              <p className="text-sm text-muted-foreground">
                Los estudiantes podrán ver las respuestas correctas después de completar
              </p>
            </div>
            <Switch
              checked={data.mostrar_respuestas}
              onCheckedChange={(checked) => setData('mostrar_respuestas', checked)}
              disabled={processing}
            />
          </div>

          {/* Permite Reintento */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Permitir Reintentos</Label>
              <p className="text-sm text-muted-foreground">
                Los estudiantes pueden volver a tomar la evaluación
              </p>
            </div>
            <Switch
              checked={data.permite_reintento}
              onCheckedChange={(checked) => setData('permite_reintento', checked)}
              disabled={processing}
            />
          </div>

          {/* Máximo de Reintentos */}
          {data.permite_reintento && (
            <div>
              <Label htmlFor="max_reintentos">Máximo de Reintentos</Label>
              <Input
                id="max_reintentos"
                type="number"
                value={data.max_reintentos}
                onChange={(e) => setData('max_reintentos', Number(e.target.value))}
                min={1}
                max={10}
                className="mt-1"
                disabled={processing}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas y Validación */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Resumen de Evaluación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-muted-foreground">Total de Preguntas</div>
              <div className="text-3xl font-bold text-primary">{preguntas.length}</div>
            </div>
            <div className={`bg-white rounded-lg p-4 border ${excedePuntuacion ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
              <div className="text-sm text-muted-foreground mb-2">Puntuación Total</div>
              <div className={`text-3xl font-bold ${excedePuntuacion ? 'text-red-600' : 'text-green-600'}`}>
                {puntuacionTotal} <span className="text-lg">/</span> {puntuacionMaxima} pts
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${excedePuntuacion ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(porcentajeUtilizado, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{porcentajeUtilizado.toFixed(0)}% utilizado</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-muted-foreground">Tiempo Estimado</div>
              <div className="text-3xl font-bold text-orange-600">{data.tiempo_limite} min</div>
            </div>
          </div>

          {/* Control de Puntuación Máxima */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Label htmlFor="puntuacion_maxima" className="text-sm font-semibold">
                  Puntuación Máxima (Total)
                </Label>
                <Input
                  id="puntuacion_maxima"
                  type="number"
                  min="1"
                  max="500"
                  value={puntuacionMaxima}
                  onChange={(e) => setPuntuacionMaxima(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Define el máximo de puntos posibles en esta evaluación
                </p>
              </div>
            </div>

            {/* Advertencia y opciones si se excede */}
            {excedePuntuacion && (
              <Alert className="border-red-300 bg-red-50">
                <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  ⚠️ La suma de puntos ({puntuacionTotal}) excede la puntuación máxima ({puntuacionMaxima}).
                  Elige una opción para corregir:
                </AlertDescription>
              </Alert>
            )}

            {/* Botones de acción */}
            {preguntas.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {excedePuntuacion && (
                  <>
                    <Button
                      type="button"
                      onClick={normalizarPuntos}
                      variant="outline"
                      size="sm"
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      📊 Normalizar Puntos
                    </Button>
                    <Button
                      type="button"
                      onClick={distribuirEquitativamente}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      ⚖️ Distribuir Equitativamente
                    </Button>
                  </>
                )}
                {!excedePuntuacion && preguntas.length > 0 && (
                  <Button
                    type="button"
                    onClick={distribuirEquitativamente}
                    variant="outline"
                    size="sm"
                  >
                    ⚖️ Distribuir Equitativamente
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Validación */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center gap-2">
              {preguntas.length > 0 ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              )}
              <span className="text-sm">
                {preguntas.length > 0
                  ? `${preguntas.length} pregunta${preguntas.length !== 1 ? 's' : ''} agregada${preguntas.length !== 1 ? 's' : ''}`
                  : 'Sin preguntas (mínimo 1 requerida)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {data.titulo.length > 0 ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              )}
              <span className="text-sm">Título {data.titulo.length > 0 ? 'completado' : 'requerido'}</span>
            </div>
            <div className="flex items-center gap-2">
              {!excedePuntuacion ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-sm ${excedePuntuacion ? 'text-red-600' : ''}`}>
                Puntuación dentro de límites {!excedePuntuacion ? '✓' : `(${puntuacionTotal}/${puntuacionMaxima})`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preguntas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Preguntas</CardTitle>
              <CardDescription>Agrega las preguntas de la evaluación (mínimo 1)</CardDescription>
            </div>
            <Button type="button" onClick={handleAddPregunta} size="sm" disabled={processing}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Agregar Pregunta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {preguntas.length === 0 ? (
            <Alert>
              <AlertDescription>
                No has agregado preguntas aún. Haz clic en &quot;Agregar Pregunta&quot; para
                comenzar.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {preguntas.map((pregunta, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">Pregunta {index + 1}</Badge>
                          <Badge variant="secondary" className="text-xs">
                            {pregunta.tipo === 'opcion_multiple'
                              ? 'Opción Múltiple'
                              : pregunta.tipo === 'verdadero_falso'
                                ? 'V/F'
                                : 'Respuesta Corta'}
                          </Badge>
                          <Badge className="ml-auto text-xs bg-green-100 text-green-800">
                            {pregunta.puntos} pts
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePregunta(index)}
                        disabled={processing}
                        className="ml-2"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Enunciado */}
                    <div>
                      <Label className="text-sm font-semibold">Enunciado</Label>
                      <Textarea
                        value={pregunta.enunciado}
                        onChange={(e) => handlePreguntaChange(index, 'enunciado', e.target.value)}
                        placeholder="Escribe la pregunta de manera clara..."
                        rows={2}
                        disabled={processing}
                        className="mt-2"
                      />
                      {!pregunta.enunciado && (
                        <p className="text-xs text-red-500 mt-1">El enunciado es requerido</p>
                      )}
                    </div>

                    {/* Tipo y Puntos */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-semibold">Tipo</Label>
                        <Select
                          value={pregunta.tipo}
                          onValueChange={(value) =>
                            handlePreguntaChange(index, 'tipo', value)
                          }
                          disabled={processing}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="opcion_multiple">Opción Múltiple</SelectItem>
                            <SelectItem value="verdadero_falso">Verdadero/Falso</SelectItem>
                            <SelectItem value="respuesta_corta">Respuesta Corta</SelectItem>
                            <SelectItem value="respuesta_larga">Respuesta Larga</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">Puntos</Label>
                        <Input
                          type="number"
                          value={pregunta.puntos}
                          onChange={(e) =>
                            handlePreguntaChange(index, 'puntos', Number(e.target.value))
                          }
                          min={1}
                          max={100}
                          className="mt-2"
                          disabled={processing}
                        />
                      </div>
                    </div>

                    {/* Tema/Concepto */}
                    <div>
                      <Label className="text-sm font-semibold">
                        Tema o Concepto <span className="text-muted-foreground text-xs">(opcional)</span>
                      </Label>
                      <Input
                        value={pregunta.tema || ''}
                        onChange={(e) => handlePreguntaChange(index, 'tema', e.target.value)}
                        placeholder="Ej: Álgebra Lineal, Verbos Irregulares, Ciclo del Agua..."
                        disabled={processing}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Ayuda al sistema a generar recomendaciones precisas si el estudiante falla esta pregunta
                      </p>
                    </div>

                    {/* Opciones (solo para opción múltiple) */}
                    {pregunta.tipo === 'opcion_multiple' && (
                      <div>
                        <Label className="text-sm font-semibold">Opciones de Respuesta</Label>
                        <div className="space-y-2 mt-2">
                          {pregunta.opciones.map((opcion, opcionIdx) => (
                            <div key={opcionIdx} className="flex gap-2 items-center">
                              <span className="text-xs text-muted-foreground w-6 text-center font-medium">
                                {String.fromCharCode(65 + opcionIdx)}.
                              </span>
                              <Input
                                value={opcion}
                                onChange={(e) =>
                                  handleOpcionChange(index, opcionIdx, e.target.value)
                                }
                                placeholder={`Opción ${opcionIdx + 1}`}
                                disabled={processing}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveOpcion(index, opcionIdx)}
                                disabled={processing || pregunta.opciones.length <= 2}
                                className="text-red-600 hover:text-red-700"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddOpcion(index)}
                          className="mt-3"
                          disabled={processing}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Agregar Opción
                        </Button>
                      </div>
                    )}

                    {/* Respuesta Correcta */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <Label className="text-sm font-semibold">✓ Respuesta Correcta</Label>
                      {pregunta.tipo === 'opcion_multiple' ? (
                        <Select
                          value={pregunta.respuesta_correcta ? pregunta.opciones.indexOf(pregunta.respuesta_correcta).toString() : ''}
                          onValueChange={(value) => {
                            const selectedOption = pregunta.opciones[parseInt(value)]
                            handlePreguntaChange(index, 'respuesta_correcta', selectedOption)
                          }}
                          disabled={processing}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Selecciona la respuesta correcta" />
                          </SelectTrigger>
                          <SelectContent>
                            {pregunta.opciones.map((opcion, opcionIdx) => (
                              <SelectItem key={opcionIdx} value={String(opcionIdx)}>
                                {opcion || `Opción ${opcionIdx + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : pregunta.tipo === 'verdadero_falso' ? (
                        <Select
                          value={pregunta.respuesta_correcta}
                          onValueChange={(value) =>
                            handlePreguntaChange(index, 'respuesta_correcta', value)
                          }
                          disabled={processing}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Verdadero">Verdadero</SelectItem>
                            <SelectItem value="Falso">Falso</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={pregunta.respuesta_correcta}
                          onChange={(e) =>
                            handlePreguntaChange(index, 'respuesta_correcta', e.target.value)
                          }
                          placeholder="Escribe la respuesta correcta..."
                          className="mt-2"
                          disabled={processing}
                        />
                      )}
                      {!pregunta.respuesta_correcta && (
                        <p className="text-xs text-red-500 mt-1">La respuesta correcta es requerida</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones de Acción - Solo si no están ocultos */}
      {!hideButtons && (
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={processing || preguntas.length === 0}
            variant="outline"
          >
            Guardar como Borrador
          </Button>
          <Button
            type="button"
            onClick={(e) => handleFormSubmit(e, 'publicado')}
            disabled={processing || preguntas.length === 0}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Publicar Evaluación
          </Button>
        </div>
      )}
    </form>
  )
}
