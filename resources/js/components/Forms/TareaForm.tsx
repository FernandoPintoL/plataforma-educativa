/**
 * TareaForm - Formulario de Tareas Reutilizable
 *
 * Este componente contiene toda la lógica y UI para crear/editar tareas.
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
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ContentAnalyzer from '@/components/TaskEnhancement/ContentAnalyzer'
import DifficultyRecommender from '@/components/TaskEnhancement/DifficultyRecommender'
import type { Course } from '@/components/ContentAssistant'

interface TareaFormProps {
  data: {
    titulo: string
    descripcion: string
    instrucciones: string
    curso_id: string | number
    puntuacion: number
    fecha_limite: string
    permite_archivos: boolean
    max_archivos: number
    tipo_archivo_permitido: string
    estado: string
    recursos: File[]
  }
  setData: (key: string, value: any) => void
  errors: Record<string, string>
  processing: boolean
  cursos: Course[]
  onSubmit: (e: React.FormEvent, publicar: boolean) => void
}

export default function TareaForm({
  data,
  setData,
  errors,
  processing,
  cursos,
  onSubmit,
}: TareaFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Estimador simple de complejidad basado en instrucciones
  const estimateComplexity = (text: string): number => {
    if (!text) return 0

    const wordCount = text.split(/\s+/).length
    const complexityKeywords = [
      'análisis',
      'research',
      'proyecto',
      'crear',
      'diseñar',
      'implementar',
      'algoritmo',
      'código',
      'programar',
      'recursión',
      'estructura',
    ]
    const keywordMatches = complexityKeywords.filter((kw) => text.toLowerCase().includes(kw))
      .length

    let complexity = wordCount / 200 + (keywordMatches / complexityKeywords.length) * 0.3
    complexity = Math.min(complexity, 1)

    return Math.max(0.1, complexity)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newFiles = [...selectedFiles, ...files]
      setSelectedFiles(newFiles)
      setData('recursos', newFiles)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    setData('recursos', newFiles)
  }

  const currentCourse = cursos.find((c) => c.id.toString() === data.curso_id.toString())

  return (
    <form onSubmit={(e) => onSubmit(e, false)}>
      {/* Información General */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Datos básicos de la tarea</CardDescription>
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
              placeholder="Ej: Ensayo sobre la Revolución Francesa"
              className="mt-1"
              disabled={processing}
            />
            {errors.titulo && <p className="text-sm text-red-500 mt-1">{errors.titulo}</p>}
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

          {/* Descripción */}
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={data.descripcion}
              onChange={(e) => setData('descripcion', e.target.value)}
              placeholder="Breve descripción de la tarea..."
              rows={2}
              className="mt-1"
              disabled={processing}
            />
            {errors.descripcion && <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>}
          </div>

          {/* Instrucciones */}
          <div>
            <Label htmlFor="instrucciones">
              Instrucciones <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="instrucciones"
              value={data.instrucciones}
              onChange={(e) => setData('instrucciones', e.target.value)}
              placeholder="Instrucciones detalladas para completar la tarea..."
              rows={6}
              className="mt-1"
              disabled={processing}
            />
            {errors.instrucciones && (
              <p className="text-sm text-red-500 mt-1">{errors.instrucciones}</p>
            )}
          </div>

          {/* AI Content Analysis */}
          {data.instrucciones.length >= 10 && (
            <div className="mt-6 pt-6 border-t">
              <ContentAnalyzer
                content={data.instrucciones}
                taskType="tarea"
                courseContext={{
                  nombre: currentCourse?.nombre || 'Sin especificar',
                  nivel: 'intermedio',
                  tema: 'General',
                }}
                onAnalysisComplete={(analysis) => {
                  console.log('Análisis completado:', analysis)
                }}
              />
            </div>
          )}

          {/* Puntuación y Fecha Límite */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="puntuacion">
                Puntuación Máxima <span className="text-red-500">*</span>
              </Label>
              <Input
                id="puntuacion"
                type="number"
                value={data.puntuacion}
                onChange={(e) => setData('puntuacion', Number(e.target.value))}
                min={1}
                max={1000}
                className="mt-1"
                disabled={processing}
              />
              {errors.puntuacion && (
                <p className="text-sm text-red-500 mt-1">{errors.puntuacion}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fecha_limite">
                Fecha Límite <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fecha_limite"
                type="datetime-local"
                value={data.fecha_limite}
                onChange={(e) => setData('fecha_limite', e.target.value)}
                className="mt-1"
                disabled={processing}
              />
              {errors.fecha_limite && (
                <p className="text-sm text-red-500 mt-1">{errors.fecha_limite}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendador de Dificultad (IA) */}
      {data.curso_id && data.instrucciones.length >= 10 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>🤖 Recomendación de Dificultad con IA</CardTitle>
            <CardDescription>
              Basada en análisis de tu contenido y datos históricos del curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DifficultyRecommender
              courseId={data.curso_id ? Number(data.curso_id) : null}
              taskType="tarea"
              complexity={estimateComplexity(data.instrucciones)}
              title={data.titulo}
              studentStats={{
                avg_score: 75,
                std_dev: 15,
                count: 25,
              }}
              onRecommendation={(rec) => {
                setData('puntuacion', rec.recommended_points)
                console.log('Recomendación aceptada:', rec)
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Configuración de Archivos */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuración de Entregas</CardTitle>
          <CardDescription>Configura cómo los estudiantes pueden entregar la tarea</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Permite Archivos */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Permitir subida de archivos</Label>
              <p className="text-sm text-muted-foreground">
                Los estudiantes podrán adjuntar archivos en su entrega
              </p>
            </div>
            <Switch
              checked={data.permite_archivos}
              onCheckedChange={(checked) => setData('permite_archivos', checked)}
              disabled={processing}
            />
          </div>

          {data.permite_archivos && (
            <>
              {/* Máximo de Archivos */}
              <div>
                <Label htmlFor="max_archivos">Número máximo de archivos</Label>
                <Input
                  id="max_archivos"
                  type="number"
                  value={data.max_archivos}
                  onChange={(e) => setData('max_archivos', Number(e.target.value))}
                  min={1}
                  max={20}
                  className="mt-1"
                  disabled={processing}
                />
                {errors.max_archivos && (
                  <p className="text-sm text-red-500 mt-1">{errors.max_archivos}</p>
                )}
              </div>

              {/* Tipos de Archivo */}
              <div>
                <Label htmlFor="tipo_archivo_permitido">
                  Tipos de archivo permitidos (opcional)
                </Label>
                <Input
                  id="tipo_archivo_permitido"
                  value={data.tipo_archivo_permitido}
                  onChange={(e) => setData('tipo_archivo_permitido', e.target.value)}
                  placeholder="Ej: pdf,docx,xlsx"
                  className="mt-1"
                  disabled={processing}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separar por comas. Deja vacío para permitir todos los tipos.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recursos Adjuntos */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recursos y Material de Apoyo</CardTitle>
          <CardDescription>Adjunta archivos que los estudiantes puedan descargar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="recursos">Subir archivos</Label>
            <Input
              id="recursos"
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1"
              disabled={processing}
            />
            <p className="text-xs text-muted-foreground mt-1">Máximo 50MB por archivo</p>
          </div>

          {/* Lista de archivos seleccionados */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Archivos seleccionados:</Label>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground mx-2">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={processing}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex gap-4">
        <Button type="submit" disabled={processing} variant="outline">
          Guardar como Borrador
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            console.log('[TareaForm] Publicar Tarea clicked');
            // Crear un evento FormEvent simulado para mantener la interfaz
            const event = new Event('submit', { bubbles: true, cancelable: true }) as any;
            event.preventDefault = () => {};
            onSubmit(event, true);
          }}
          disabled={processing}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Publicar Tarea
        </Button>
      </div>
    </form>
  )
}
