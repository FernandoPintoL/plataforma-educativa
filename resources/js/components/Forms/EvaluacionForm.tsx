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

import React, { useState } from 'react'
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
import { PlusIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline'
import type { Course } from '@/components/ContentAssistant'

interface Pregunta {
  enunciado: string
  tipo: string
  opciones: string[]
  respuesta_correcta: string
  puntos: number
}

interface EvaluacionFormProps {
  data: {
    titulo: string
    descripcion: string
    curso_id: string | number
    fecha_limite: string
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
}

export default function EvaluacionForm({
  data,
  setData,
  errors,
  processing,
  cursos,
  onSubmit,
}: EvaluacionFormProps) {
  const [preguntas, setPreguntas] = useState<Pregunta[]>(data.preguntas || [])

  const handleAddPregunta = () => {
    const nuevaPregunta: Pregunta = {
      enunciado: '',
      tipo: 'opcion_multiple',
      opciones: ['', '', '', ''],
      respuesta_correcta: '',
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

  const handleFormSubmit = (e: React.FormEvent, estado: string) => {
    e.preventDefault()
    setData('preguntas', preguntas)
    setData('puntuacion_total', puntuacionTotal || data.puntuacion_total)

    // Llamar al callback onSubmit (que será manejado por la página)
    const event = new Event('submit', { bubbles: true })
    Object.defineProperty(event, 'target', { value: e.target, enumerable: true })
    onSubmit(event as any, estado)
  }

  return (
    <form onSubmit={(e) => handleFormSubmit(e, 'borrador')} className="space-y-6">
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

          {/* Tipo de Evaluación y Fecha Límite */}
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="fecha_limite">Fecha Límite</Label>
              <Input
                id="fecha_limite"
                type="datetime-local"
                value={data.fecha_limite}
                onChange={(e) => setData('fecha_limite', e.target.value)}
                className="mt-1"
                disabled={processing}
              />
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

      {/* Preguntas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Preguntas</CardTitle>
              <CardDescription>Agrega las preguntas de la evaluación</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">Puntuación Total:</span>{' '}
                <span className="text-primary">{puntuacionTotal} pts</span>
              </div>
              <Button type="button" onClick={handleAddPregunta} size="sm" disabled={processing}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Agregar Pregunta
              </Button>
            </div>
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
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Pregunta {index + 1}</CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePregunta(index)}
                        disabled={processing}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Enunciado */}
                    <div>
                      <Label>Enunciado</Label>
                      <Textarea
                        value={pregunta.enunciado}
                        onChange={(e) => handlePreguntaChange(index, 'enunciado', e.target.value)}
                        placeholder="Escribe la pregunta..."
                        rows={2}
                        disabled={processing}
                      />
                    </div>

                    {/* Tipo y Puntos */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Tipo</Label>
                        <Select
                          value={pregunta.tipo}
                          onValueChange={(value) =>
                            handlePreguntaChange(index, 'tipo', value)
                          }
                          disabled={processing}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="opcion_multiple">Opción Múltiple</SelectItem>
                            <SelectItem value="verdadero_falso">Verdadero/Falso</SelectItem>
                            <SelectItem value="corta_respuesta">Respuesta Corta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Puntos</Label>
                        <Input
                          type="number"
                          value={pregunta.puntos}
                          onChange={(e) =>
                            handlePreguntaChange(index, 'puntos', Number(e.target.value))
                          }
                          min={0}
                          className="mt-1"
                          disabled={processing}
                        />
                      </div>
                    </div>

                    {/* Opciones (solo para opción múltiple) */}
                    {pregunta.tipo === 'opcion_multiple' && (
                      <div>
                        <Label>Opciones</Label>
                        <div className="space-y-2 mt-2">
                          {pregunta.opciones.map((opcion, opcionIdx) => (
                            <div key={opcionIdx} className="flex gap-2">
                              <Input
                                value={opcion}
                                onChange={(e) =>
                                  handleOpcionChange(index, opcionIdx, e.target.value)
                                }
                                placeholder={`Opción ${opcionIdx + 1}`}
                                disabled={processing}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveOpcion(index, opcionIdx)}
                                disabled={processing || pregunta.opciones.length <= 2}
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
                          className="mt-2"
                          disabled={processing}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Agregar Opción
                        </Button>
                      </div>
                    )}

                    {/* Respuesta Correcta */}
                    <div>
                      <Label>Respuesta Correcta</Label>
                      {pregunta.tipo === 'opcion_multiple' ? (
                        <Select
                          value={pregunta.respuesta_correcta}
                          onValueChange={(value) =>
                            handlePreguntaChange(index, 'respuesta_correcta', value)
                          }
                          disabled={processing}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {pregunta.opciones.map((opcion, opcionIdx) => (
                              <SelectItem key={opcionIdx} value={opcion}>
                                {opcion || `Opción ${opcionIdx + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={pregunta.respuesta_correcta}
                          onChange={(e) =>
                            handlePreguntaChange(index, 'respuesta_correcta', e.target.value)
                          }
                          placeholder="Escribe la respuesta correcta..."
                          className="mt-1"
                          disabled={processing}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones de Acción */}
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
    </form>
  )
}
