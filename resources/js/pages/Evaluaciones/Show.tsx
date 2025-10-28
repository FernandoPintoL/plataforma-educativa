import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import {
  PencilIcon,
  TrashIcon,
  PlayIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface Pregunta {
  id: number;
  enunciado: string;
  tipo: string;
  opciones: string[] | null;
  respuesta_correcta: string | null;
  puntos: number;
  orden: number;
}

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Evaluacion {
  id: number;
  tipo_evaluacion: string;
  puntuacion_total: number;
  tiempo_limite: number | null;
  permitir_reintentos: boolean;
  numero_intentos: number | null;
  mostrar_respuestas: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  contenido: {
    id: number;
    titulo: string;
    descripcion: string;
    curso: Curso;
  };
  preguntas: Pregunta[];
}

interface Trabajo {
  id: number;
  calificacion: number;
  estado: string;
  fecha_entrega: string;
}

interface Props {
  evaluacion: Evaluacion;
  trabajo_existente: Trabajo | null;
  num_intentos: number;
  puede_editar: boolean;
  puede_tomar: boolean;
}

export default function Show({
  evaluacion,
  trabajo_existente,
  num_intentos,
  puede_editar,
  puede_tomar,
}: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Evaluaciones',
      href: '/evaluaciones',
    },
    {
      title: evaluacion.contenido.titulo,
      href: `/evaluaciones/${evaluacion.id}`,
    },
  ];

  const handleDelete = () => {
    if (!confirm('¿Estás seguro de eliminar esta evaluación? Esta acción no se puede deshacer.')) {
      return;
    }

    router.delete(`/evaluaciones/${evaluacion.id}`, {
      onSuccess: () => {
        router.visit('/evaluaciones');
      },
    });
  };

  // Verificar si está disponible
  const esDisponible = () => {
    const ahora = new Date();
    const inicio = evaluacion.fecha_inicio ? new Date(evaluacion.fecha_inicio) : null;
    const fin = evaluacion.fecha_fin ? new Date(evaluacion.fecha_fin) : null;

    if (inicio && ahora < inicio) return false;
    if (fin && ahora > fin) return false;
    return true;
  };

  const disponible = esDisponible();

  // Verificar si puede hacer más intentos
  const puedeReintentar = () => {
    if (!evaluacion.permitir_reintentos) return false;
    if (!evaluacion.numero_intentos) return true; // Intentos ilimitados
    return num_intentos < evaluacion.numero_intentos;
  };

  const permitirIntentos = puedeReintentar();

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{evaluacion.contenido.titulo}</h1>
            <p className="text-muted-foreground mb-4">{evaluacion.contenido.descripcion}</p>
            <div className="flex gap-2">
              <Badge>{evaluacion.tipo_evaluacion}</Badge>
              <Badge variant="outline">{evaluacion.contenido.curso.nombre}</Badge>
              {!disponible && <Badge variant="destructive">No disponible</Badge>}
            </div>
          </div>
          {puede_editar && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/evaluaciones/${evaluacion.id}/edit`}>
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          )}
        </div>

        {/* Información General */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información de la Evaluación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Puntuación Total</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <AcademicCapIcon className="h-5 w-5" />
                  {evaluacion.puntuacion_total} puntos
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Número de Preguntas</p>
                <p className="text-lg font-semibold">{evaluacion.preguntas.length} preguntas</p>
              </div>
              {evaluacion.tiempo_limite && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tiempo Límite</p>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <ClockIcon className="h-5 w-5" />
                    {evaluacion.tiempo_limite} minutos
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Reintentos</p>
                <p className="text-lg font-semibold">
                  {evaluacion.permitir_reintentos
                    ? evaluacion.numero_intentos
                      ? `${evaluacion.numero_intentos} intentos`
                      : 'Ilimitados'
                    : 'No permitidos'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Mostrar Respuestas</p>
                <p className="text-lg font-semibold">
                  {evaluacion.mostrar_respuestas ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                </p>
              </div>
            </div>

            {/* Fechas de disponibilidad */}
            {(evaluacion.fecha_inicio || evaluacion.fecha_fin) && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Disponibilidad</p>
                <div className="grid grid-cols-2 gap-4">
                  {evaluacion.fecha_inicio && (
                    <div>
                      <p className="text-sm text-muted-foreground">Inicio</p>
                      <p className="text-sm">
                        {new Date(evaluacion.fecha_inicio).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {evaluacion.fecha_fin && (
                    <div>
                      <p className="text-sm text-muted-foreground">Fin</p>
                      <p className="text-sm">{new Date(evaluacion.fecha_fin).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estado del estudiante */}
        {puede_tomar && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tu Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              {trabajo_existente ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Calificación</p>
                      <p className="text-2xl font-bold">
                        {trabajo_existente.calificacion.toFixed(1)} / {evaluacion.puntuacion_total}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <Badge>{trabajo_existente.estado}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Intentos</p>
                      <p className="text-lg font-semibold">
                        {num_intentos}
                        {evaluacion.numero_intentos ? ` / ${evaluacion.numero_intentos}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" asChild>
                      <Link href={`/evaluaciones/${evaluacion.id}/results`}>
                        Ver Resultados
                      </Link>
                    </Button>
                    {permitirIntentos && disponible && (
                      <Button asChild>
                        <Link href={`/evaluaciones/${evaluacion.id}/take`}>
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Reintentar
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {disponible ? (
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Aún no has tomado esta evaluación.
                      </p>
                      <Button asChild>
                        <Link href={`/evaluaciones/${evaluacion.id}/take`}>
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Iniciar Evaluación
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        Esta evaluación no está disponible en este momento.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Preguntas (solo para profesores) */}
        {puede_editar && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Preguntas</CardTitle>
              <CardDescription>
                {evaluacion.preguntas.length} pregunta(s) configuradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {evaluacion.preguntas.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Esta evaluación no tiene preguntas configuradas. Edita la evaluación para
                    agregar preguntas.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {evaluacion.preguntas.map((pregunta, index) => (
                    <Card key={pregunta.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            Pregunta {index + 1} - {pregunta.tipo.replace('_', ' ')}
                          </CardTitle>
                          <Badge variant="outline">{pregunta.puntos} pts</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2 whitespace-pre-wrap">{pregunta.enunciado}</p>

                        {pregunta.tipo === 'opcion_multiple' && pregunta.opciones && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                              Opciones:
                            </p>
                            <ul className="space-y-1">
                              {pregunta.opciones.map((opcion, i) => (
                                <li
                                  key={i}
                                  className={`text-sm p-2 rounded ${
                                    opcion === pregunta.respuesta_correcta
                                      ? 'bg-green-50 text-green-900'
                                      : ''
                                  }`}
                                >
                                  {String.fromCharCode(65 + i)}. {opcion}
                                  {opcion === pregunta.respuesta_correcta && (
                                    <CheckCircleIcon className="inline h-4 w-4 ml-2" />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {pregunta.tipo === 'verdadero_falso' && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                              Respuesta correcta:
                            </p>
                            <Badge>{pregunta.respuesta_correcta}</Badge>
                          </div>
                        )}

                        {(pregunta.tipo === 'respuesta_corta' ||
                          pregunta.tipo === 'respuesta_larga') && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                              Respuesta sugerida:
                            </p>
                            <p className="text-sm text-muted-foreground italic">
                              {pregunta.respuesta_correcta || 'No especificada'}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Botón de volver */}
        <Button variant="outline" asChild>
          <Link href="/evaluaciones">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver a Evaluaciones
          </Link>
        </Button>
      </div>
    </AppLayout>
  );
}
