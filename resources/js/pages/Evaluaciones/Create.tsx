import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import {
  DocumentTextIcon,
  PlusIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Props {
  cursos: Curso[];
}

interface Pregunta {
  enunciado: string;
  tipo: string;
  opciones: string[];
  respuesta_correcta: string;
  puntos: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Evaluaciones',
    href: '/evaluaciones',
  },
  {
    title: 'Crear',
    href: '/evaluaciones/create',
  },
];

export default function Create({ cursos }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    titulo: '',
    descripcion: '',
    curso_id: '',
    fecha_limite: '',
    tipo_evaluacion: 'examen',
    puntuacion_total: 100,
    tiempo_limite: 60,
    calificacion_automatica: true,
    mostrar_respuestas: true,
    permite_reintento: false,
    max_reintentos: 1,
    estado: 'borrador',
    preguntas: [] as Pregunta[],
  });

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  const handleAddPregunta = () => {
    const nuevaPregunta: Pregunta = {
      enunciado: '',
      tipo: 'opcion_multiple',
      opciones: ['', '', '', ''],
      respuesta_correcta: '',
      puntos: 0,
    };
    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const handleRemovePregunta = (index: number) => {
    setPreguntas(preguntas.filter((_, i) => i !== index));
  };

  const handlePreguntaChange = (index: number, field: string, value: any) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index] = {
      ...nuevasPreguntas[index],
      [field]: value,
    };
    setPreguntas(nuevasPreguntas);
  };

  const handleOpcionChange = (preguntaIndex: number, opcionIndex: number, value: string) => {
    const nuevasPreguntas = [...preguntas];
    const nuevasOpciones = [...nuevasPreguntas[preguntaIndex].opciones];
    nuevasOpciones[opcionIndex] = value;
    nuevasPreguntas[preguntaIndex].opciones = nuevasOpciones;
    setPreguntas(nuevasPreguntas);
  };

  const handleAddOpcion = (preguntaIndex: number) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones.push('');
    setPreguntas(nuevasPreguntas);
  };

  const handleRemoveOpcion = (preguntaIndex: number, opcionIndex: number) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[preguntaIndex].opciones = nuevasPreguntas[preguntaIndex].opciones.filter(
      (_, i) => i !== opcionIndex
    );
    setPreguntas(nuevasPreguntas);
  };

  const handleSubmit = (e: React.FormEvent, estado: string) => {
    e.preventDefault();

    // Calcular puntuación total basada en las preguntas
    const puntuacionCalculada = preguntas.reduce((sum, p) => sum + Number(p.puntos), 0);

    post('/evaluaciones', {
      data: {
        ...data,
        estado,
        puntuacion_total: puntuacionCalculada || data.puntuacion_total,
        preguntas,
      },
    });
  };

  const puntuacionTotal = preguntas.reduce((sum, p) => sum + Number(p.puntos || 0), 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Crear Evaluación</h1>
              <p className="text-muted-foreground">
                Crea una nueva evaluación para tus estudiantes
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'borrador')} className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Datos básicos de la evaluación
              </CardDescription>
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
                />
              </div>

              {/* Curso */}
              <div>
                <Label htmlFor="curso_id">
                  Curso <span className="text-red-500">*</span>
                </Label>
                <Select value={data.curso_id.toString()} onValueChange={(value) => setData('curso_id', value)}>
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
                  <Select value={data.tipo_evaluacion} onValueChange={(value) => setData('tipo_evaluacion', value)}>
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
                  />
                </div>
              </div>

              {/* Tiempo Límite */}
              <div>
                <Label htmlFor="tiempo_limite">
                  Tiempo Límite (minutos) <ClockIcon className="inline h-4 w-4" />
                </Label>
                <Input
                  id="tiempo_limite"
                  type="number"
                  value={data.tiempo_limite}
                  onChange={(e) => setData('tiempo_limite', Number(e.target.value))}
                  min={1}
                  max={480}
                  className="mt-1"
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
              <CardDescription>
                Opciones de calificación y reintentos
              </CardDescription>
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
                  <CardDescription>
                    Agrega las preguntas de la evaluación
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium">Puntuación Total:</span>{' '}
                    <span className="text-primary">{puntuacionTotal} pts</span>
                  </div>
                  <Button type="button" onClick={handleAddPregunta} size="sm">
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
                    No has agregado preguntas aún. Haz clic en &quot;Agregar Pregunta&quot; para comenzar.
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
                          />
                        </div>

                        {/* Tipo y Puntos */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label>Tipo</Label>
                            <Select
                              value={pregunta.tipo}
                              onValueChange={(value) => handlePreguntaChange(index, 'tipo', value)}
                            >
                              <SelectTrigger>
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
                            <Label>Puntos</Label>
                            <Input
                              type="number"
                              value={pregunta.puntos}
                              onChange={(e) => handlePreguntaChange(index, 'puntos', Number(e.target.value))}
                              min={0}
                            />
                          </div>
                        </div>

                        {/* Opciones (solo para opción múltiple o verdadero/falso) */}
                        {(pregunta.tipo === 'opcion_multiple' || pregunta.tipo === 'verdadero_falso') && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Opciones</Label>
                              {pregunta.tipo === 'opcion_multiple' && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddOpcion(index)}
                                >
                                  <PlusIcon className="h-3 w-3 mr-1" />
                                  Opción
                                </Button>
                              )}
                            </div>

                            <div className="space-y-2">
                              {pregunta.tipo === 'verdadero_falso' ? (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Input value="Verdadero" disabled />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Input value="Falso" disabled />
                                  </div>
                                </>
                              ) : (
                                pregunta.opciones.map((opcion, opcionIndex) => (
                                  <div key={opcionIndex} className="flex items-center gap-2">
                                    <span className="text-sm font-medium w-6">
                                      {String.fromCharCode(65 + opcionIndex)}.
                                    </span>
                                    <Input
                                      value={opcion}
                                      onChange={(e) => handleOpcionChange(index, opcionIndex, e.target.value)}
                                      placeholder={`Opción ${String.fromCharCode(65 + opcionIndex)}`}
                                    />
                                    {pregunta.opciones.length > 2 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveOpcion(index, opcionIndex)}
                                      >
                                        <XMarkIcon className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}

                        {/* Respuesta Correcta */}
                        <div>
                          <Label>Respuesta Correcta</Label>
                          {pregunta.tipo === 'opcion_multiple' ? (
                            <Select
                              value={pregunta.respuesta_correcta}
                              onValueChange={(value) => handlePreguntaChange(index, 'respuesta_correcta', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la respuesta correcta" />
                              </SelectTrigger>
                              <SelectContent>
                                {pregunta.opciones.map((opcion, i) => (
                                  <SelectItem key={i} value={opcion}>
                                    {String.fromCharCode(65 + i)}. {opcion}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : pregunta.tipo === 'verdadero_falso' ? (
                            <Select
                              value={pregunta.respuesta_correcta}
                              onValueChange={(value) => handlePreguntaChange(index, 'respuesta_correcta', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona verdadero o falso" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Verdadero">Verdadero</SelectItem>
                                <SelectItem value="Falso">Falso</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={pregunta.respuesta_correcta}
                              onChange={(e) => handlePreguntaChange(index, 'respuesta_correcta', e.target.value)}
                              placeholder="Escribe la respuesta correcta..."
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

          {/* Errores Generales */}
          {errors && Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                {Object.values(errors).map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <Button
              type="submit"
              onClick={(e) => handleSubmit(e, 'borrador')}
              disabled={processing}
              variant="outline"
            >
              Guardar como Borrador
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, 'publicado')}
              disabled={processing || preguntas.length === 0}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              {processing ? 'Publicando...' : 'Publicar Evaluación'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => window.history.back()}
              disabled={processing}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
