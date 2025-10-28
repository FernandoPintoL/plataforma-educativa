import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface Respuesta {
  id: number;
  pregunta_id: number;
  respuesta: string;
  es_correcta: boolean;
  puntos_obtenidos: number;
}

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
  tiempo_usado: number;
  estado: string;
  fecha_entrega: string;
  respuestas: Respuesta[];
}

interface Props {
  evaluacion: Evaluacion;
  trabajo: Trabajo;
}

export default function Results({ evaluacion, trabajo }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Evaluaciones',
      href: '/evaluaciones',
    },
    {
      title: evaluacion.contenido.titulo,
      href: `/evaluaciones/${evaluacion.id}`,
    },
    {
      title: 'Resultados',
      href: `/evaluaciones/${evaluacion.id}/results`,
    },
  ];

  // Calcular estadísticas
  const totalPreguntas = evaluacion.preguntas.length;
  const respuestasCorrectas = trabajo.respuestas.filter((r) => r.es_correcta).length;
  const porcentajeAciertos = (respuestasCorrectas / totalPreguntas) * 100;

  // Obtener badge de calificación
  const getCalificacionBadge = () => {
    const porcentaje = (trabajo.calificacion / evaluacion.puntuacion_total) * 100;
    if (porcentaje >= 90) return { variant: 'default' as const, label: 'Excelente' };
    if (porcentaje >= 70) return { variant: 'default' as const, label: 'Aprobado' };
    return { variant: 'destructive' as const, label: 'Reprobado' };
  };

  const badge = getCalificacionBadge();

  // Mapear respuestas por pregunta ID
  const respuestasPorPregunta = trabajo.respuestas.reduce((acc, resp) => {
    acc[resp.pregunta_id] = resp;
    return acc;
  }, {} as Record<number, Respuesta>);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Resumen de Resultados */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Resultados de Evaluación</CardTitle>
                <CardDescription>{evaluacion.contenido.titulo}</CardDescription>
              </div>
              <Badge variant={badge.variant} className="text-lg px-4 py-2">
                {badge.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Estadísticas principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Calificación</p>
                <p className="text-2xl font-bold">
                  {trabajo.calificacion.toFixed(1)} / {evaluacion.puntuacion_total}
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Porcentaje</p>
                <p className="text-2xl font-bold">
                  {((trabajo.calificacion / evaluacion.puntuacion_total) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Aciertos</p>
                <p className="text-2xl font-bold">
                  {respuestasCorrectas} / {totalPreguntas}
                </p>
              </div>
              {evaluacion.tiempo_limite && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Tiempo</p>
                  <p className="text-2xl font-bold flex items-center justify-center gap-1">
                    <ClockIcon className="h-5 w-5" />
                    {trabajo.tiempo_usado} min
                  </p>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Fecha de entrega</p>
                <p>{new Date(trabajo.fecha_entrega).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipo de evaluación</p>
                <Badge>{evaluacion.tipo_evaluacion}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalle de Respuestas */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-bold">Detalle de Respuestas</h2>

          {evaluacion.preguntas.map((pregunta, index) => {
            const respuesta = respuestasPorPregunta[pregunta.id];

            return (
              <Card
                key={pregunta.id}
                className={respuesta?.es_correcta ? 'border-green-500' : 'border-red-500'}
              >
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {respuesta?.es_correcta ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                      Pregunta {index + 1}
                    </span>
                    <Badge variant="outline">
                      {respuesta?.puntos_obtenidos} / {pregunta.puntos} pts
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Enunciado */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Pregunta:</p>
                    <p className="text-sm whitespace-pre-wrap">{pregunta.enunciado}</p>
                  </div>

                  {/* Tu respuesta */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Tu respuesta:</p>
                    <div
                      className={`p-3 rounded-md ${
                        respuesta?.es_correcta
                          ? 'bg-green-50 text-green-900 border border-green-200'
                          : 'bg-red-50 text-red-900 border border-red-200'
                      }`}
                    >
                      <p className="text-sm">{respuesta?.respuesta || 'Sin respuesta'}</p>
                    </div>
                  </div>

                  {/* Respuesta correcta (si no acertó y no es pregunta abierta) */}
                  {!respuesta?.es_correcta &&
                    pregunta.respuesta_correcta &&
                    (pregunta.tipo === 'opcion_multiple' || pregunta.tipo === 'verdadero_falso') && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Respuesta correcta:
                        </p>
                        <div className="p-3 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                          <p className="text-sm">{pregunta.respuesta_correcta}</p>
                        </div>
                      </div>
                    )}

                  {/* Opciones (para opción múltiple) */}
                  {pregunta.tipo === 'opcion_multiple' && pregunta.opciones && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Opciones:</p>
                      <ul className="space-y-1">
                        {pregunta.opciones.map((opcion, i) => (
                          <li
                            key={i}
                            className={`text-sm p-2 rounded ${
                              opcion === pregunta.respuesta_correcta
                                ? 'bg-green-50 text-green-900'
                                : opcion === respuesta?.respuesta && !respuesta.es_correcta
                                ? 'bg-red-50 text-red-900'
                                : ''
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opcion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Retroalimentación */}
        {trabajo.estado === 'calificado' && (
          <Alert className="mb-8">
            <AlertDescription>
              Tu evaluación ha sido calificada. Si tienes alguna duda sobre los resultados, puedes
              contactar a tu profesor.
            </AlertDescription>
          </Alert>
        )}

        {/* Botones de navegación */}
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/evaluaciones">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver a Evaluaciones
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/cursos/${evaluacion.contenido.curso.id}`}>
              Ver Curso
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
