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
  ArrowPathIcon,
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
  calificacion: { puntaje: number; comentario: string } | number;
  tiempo_usado: number;
  estado: string;
  fecha_entrega: string;
  respuestas: Respuesta[] | any;
}

interface Props {
  evaluacion: Evaluacion;
  trabajo: Trabajo;
  recommendations?: any;
  tipo_recomendacion?: 'avanzado' | 'refuerzo'; // 'avanzado' para notas altas, 'refuerzo' para bajas
  intento_actual?: number;
  max_intentos?: number;
  puede_reintentar?: boolean;
}

export default function Results({
  evaluacion,
  trabajo,
  recommendations,
  tipo_recomendacion,
  intento_actual = 1,
  max_intentos = 1,
  puede_reintentar = false,
}: Props) {
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

  // Manejar respuestas que podrían ser array o cualquier otro tipo
  let respuestasArray: Respuesta[] = [];
  if (Array.isArray(trabajo.respuestas)) {
    respuestasArray = trabajo.respuestas as Respuesta[];
  }

  // Obtener el puntaje de calificación
  const puntajeCalificacion = typeof trabajo.calificacion === 'number'
    ? trabajo.calificacion
    : trabajo.calificacion?.puntaje ?? 0;

  const respuestasCorrectas = respuestasArray.filter((r) => r.es_correcta).length;
  const porcentajeAciertos = (respuestasCorrectas / totalPreguntas) * 100;

  // Obtener badge de calificación
  const getCalificacionBadge = () => {
    const puntaje = typeof trabajo.calificacion === 'number'
      ? trabajo.calificacion
      : trabajo.calificacion?.puntaje ?? 0;
    const porcentaje = (puntaje / evaluacion.puntuacion_total) * 100;
    if (porcentaje >= 90) return { variant: 'default' as const, label: 'Excelente' };
    if (porcentaje >= 70) return { variant: 'default' as const, label: 'Aprobado' };
    return { variant: 'destructive' as const, label: 'Reprobado' };
  };

  const badge = getCalificacionBadge();

  // Mapear respuestas por pregunta ID
  const respuestasPorPregunta = respuestasArray.reduce((acc, resp) => {
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
                  {puntajeCalificacion.toFixed(1)} / {evaluacion.puntuacion_total}
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Porcentaje</p>
                <p className="text-2xl font-bold">
                  {((puntajeCalificacion / evaluacion.puntuacion_total) * 100).toFixed(0)}%
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

        {/* Información de Intentos */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Intento</p>
                <p className="text-xl font-bold">
                  {intento_actual} de {max_intentos}
                </p>
              </div>
              <div className="text-right">
                {puede_reintentar ? (
                  <div className="text-green-700">
                    <p className="text-sm font-medium">✓ Puedes intentar de nuevo</p>
                    <p className="text-xs text-green-600 mt-1">
                      Te quedan {max_intentos - intento_actual} intento(s)
                    </p>
                  </div>
                ) : (
                  <div className="text-red-700">
                    <p className="text-sm font-medium">✗ No hay más intentos disponibles</p>
                    <p className="text-xs text-red-600 mt-1">
                      Haz alcanzado el máximo de {max_intentos} intento(s)
                    </p>
                  </div>
                )}
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

        {/* Recomendaciones personalizadas del Agente - SOLO SI NO HAY MAS INTENTOS */}
        {!puede_reintentar && (
          <Card className={`mb-8 border-2 ${
            tipo_recomendacion === 'avanzado'
              ? 'border-green-200 bg-green-50'
              : 'border-blue-200 bg-blue-50'
          }`}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {tipo_recomendacion === 'avanzado' ? (
                  <>
                    <span className="text-2xl">🚀</span>
                    Recursos Avanzados - Próximos Pasos
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className={`h-5 w-5 ${tipo_recomendacion === 'refuerzo' ? 'text-blue-600' : 'text-green-600'}`} />
                    Análisis Personalizado - Recursos para Reforzar
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {tipo_recomendacion === 'avanzado'
                  ? '¡Excelente desempeño! Aquí tienes recursos para profundizar en estos temas'
                  : 'Basado en tu desempeño, aquí te mostramos recursos para mejorar'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations ? (
              <>
                {/* Áreas de mejora identificadas (solo si es refuerzo) o temas cubiertos (si es avanzado) */}
                {recommendations.evaluation_analysis?.areas_debiles && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">
                      {tipo_recomendacion === 'avanzado' ? '📚 Temas Cubiertos:' : '📊 Áreas de Mejora Identificadas:'}
                    </h3>
                    <div className="grid gap-2">
                      {Object.values(recommendations.evaluation_analysis.areas_debiles as any).map((area: any, idx: number) => {
                        const porcentajeError = area.total > 0 ? ((area.incorrectas / area.total) * 100).toFixed(0) : '0';
                        return (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded border border-blue-100">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{area.nombre}</p>
                              <p className="text-xs text-gray-600">
                                {area.incorrectas} errores de {area.total} preguntas ({porcentajeError}%)
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
                                <span className="text-xs font-bold text-red-700">{porcentajeError}%</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recomendaciones del agente */}
                {recommendations.recommendations && recommendations.recommendations.length > 0 && (
                  <div className="space-y-3 border-t border-blue-200 pt-4">
                    <h3 className="font-semibold text-sm">💡 Recomendaciones Personalizadas:</h3>
                    <div className="space-y-2">
                      {recommendations.recommendations.map((rec: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded border border-blue-100">
                          <div className="text-2xl mt-1">
                            {rec.tipo === 'study' ? '📚' : rec.tipo === 'practice' ? '🎯' : '✨'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{rec.title || rec.titulo}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {rec.description || rec.descripcion}
                            </p>
                            {rec.suggested_resources && rec.suggested_resources.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <p className="text-xs font-semibold text-blue-700">Recursos Sugeridos:</p>
                                <ul className="text-xs text-gray-600 list-disc list-inside">
                                  {rec.suggested_resources.map((resource: string, ridx: number) => (
                                    <li key={ridx}>{resource}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 p-4 text-sm text-blue-700">
                <div className="animate-spin h-5 w-5 border-2 border-blue-400 border-t-blue-700 rounded-full"></div>
                <span>El agente está analizando tu evaluación y generando recomendaciones personalizadas...</span>
              </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mensaje si aún hay intentos disponibles */}
        {puede_reintentar && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Aún tienes intentos disponibles</p>
                  <p className="text-sm text-green-700 mt-1">
                    Las recomendaciones del agente aparecerán aquí cuando hayas agotado todos tus intentos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
        <div className="flex gap-4 flex-wrap">
          {puede_reintentar && (
            <Button asChild>
              <Link href={`/evaluaciones/${evaluacion.id}/take`}>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Reintentar Evaluación
              </Link>
            </Button>
          )}
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
