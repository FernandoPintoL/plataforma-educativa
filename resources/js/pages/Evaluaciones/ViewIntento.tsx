import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem } from '@/types';
import EvaluationAnalysis from '@/components/Evaluacion/EvaluationAnalysis';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

interface IntentosEvaluacion {
  id: number;
  evaluacion_id: number;
  estudiante_id: number;
  estado: string;
  respuestas: any;
  fecha_inicio: string;
  fecha_entrega: string;
  tiempo_total: number;
  numero_intento: number;
  puntaje_obtenido: number;
  porcentaje_acierto: number;
  dificultad_detectada: number;
  areas_debilidad: string[];
  areas_fortaleza: string[];
  recomendaciones_ia: any;
  ultimo_analisis_ml: any;
  created_at: string;
  updated_at: string;
}

interface Props {
  intento: IntentosEvaluacion;
  evaluacion: Evaluacion;
  respuestas: Respuesta[];
}

export default function ViewIntento({ intento, evaluacion, respuestas }: Props) {
  const [activeTab, setActiveTab] = useState('analisis');

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
      title: `Intento #${intento.numero_intento}`,
      href: '#',
    },
  ];

  // Calcular estadísticas
  const totalPreguntas = evaluacion.preguntas.length;
  const respuestasCorrectas = respuestas.filter((r) => r.es_correcta).length;
  const porcentajeAciertos = (respuestasCorrectas / totalPreguntas) * 100;

  // Obtener badge de calificación
  const getCalificacionBadge = () => {
    const porcentaje = (intento.puntaje_obtenido / evaluacion.puntuacion_total) * 100;
    if (porcentaje >= 90) return { variant: 'default' as const, label: 'Excelente' };
    if (porcentaje >= 70) return { variant: 'default' as const, label: 'Aprobado' };
    return { variant: 'destructive' as const, label: 'Reprobado' };
  };

  const badge = getCalificacionBadge();

  const getDificultadLabel = (valor: number) => {
    if (valor >= 0.7) return 'Alta dificultad';
    if (valor >= 0.4) return 'Dificultad media';
    return 'Baja dificultad';
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {evaluacion.contenido.titulo}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Intento #{intento.numero_intento} • {evaluacion.contenido.curso.nombre}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.visit(`/evaluaciones/${evaluacion.id}`)}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        {/* Resumen de desempeño */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Intento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Puntaje
                </div>
                <div className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {intento.puntaje_obtenido}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  de {evaluacion.puntuacion_total}
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Aciertos
                </div>
                <div className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                  {intento.porcentaje_acierto.toFixed(0)}%
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {respuestasCorrectas}/{totalPreguntas} preguntas
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Calificación
                </div>
                <div className="mt-2">
                  <Badge variant={badge.variant} className="text-xs uppercase">
                    {badge.label}
                  </Badge>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Dificultad
                </div>
                <div className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {getDificultadLabel(intento.dificultad_detectada)}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  {format(new Date(intento.fecha_entrega), 'PPP', { locale: es })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="analisis" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analisis">Análisis IA</TabsTrigger>
            <TabsTrigger value="respuestas">Respuestas</TabsTrigger>
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
          </TabsList>

          {/* Tab: Análisis IA */}
          <TabsContent value="analisis" className="space-y-4">
            <EvaluationAnalysis
              intentoId={intento.id}
              asignatura={evaluacion.contenido.titulo}
              puntaje={intento.puntaje_obtenido}
              porcentajeAcierto={intento.porcentaje_acierto}
            />
          </TabsContent>

          {/* Tab: Respuestas */}
          <TabsContent value="respuestas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Respuestas Detalladas</CardTitle>
                <CardDescription>
                  Revisa tus respuestas y compáralas con las correctas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {respuestas.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No hay respuestas registradas para este intento
                    </AlertDescription>
                  </Alert>
                ) : (
                  respuestas.map((respuesta) => {
                    const pregunta = evaluacion.preguntas.find(
                      (p) => p.id === respuesta.pregunta_id
                    );
                    return (
                      <Card key={respuesta.id} className="border-l-4 border-l-gray-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base">
                                Pregunta {pregunta?.orden || respuesta.pregunta_id}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {pregunta?.enunciado}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={respuesta.es_correcta ? 'default' : 'destructive'}
                              className="ml-2"
                            >
                              {respuesta.es_correcta ? (
                                <>
                                  <CheckCircleIcon className="mr-1 h-3 w-3" />
                                  Correcta
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="mr-1 h-3 w-3" />
                                  Incorrecta
                                </>
                              )}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid gap-2 md:grid-cols-2">
                            <div>
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Tu respuesta
                              </div>
                              <div className="mt-1 rounded bg-blue-50 p-2 text-sm dark:bg-blue-950">
                                {respuesta.respuesta}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Respuesta correcta
                              </div>
                              <div className="mt-1 rounded bg-green-50 p-2 text-sm dark:bg-green-950">
                                {pregunta?.respuesta_correcta || 'N/A'}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">
                              Puntos: {respuesta.puntos_obtenidos} de {pregunta?.puntos}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Detalles */}
          <TabsContent value="detalles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Intento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Estado
                    </h4>
                    <p className="mt-2 text-sm capitalize">{intento.estado}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Número de intento
                    </h4>
                    <p className="mt-2 text-sm">#{intento.numero_intento}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Fecha de inicio
                    </h4>
                    <p className="mt-2 text-sm">
                      {format(new Date(intento.fecha_inicio), 'PPPpp', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Fecha de entrega
                    </h4>
                    <p className="mt-2 text-sm">
                      {format(new Date(intento.fecha_entrega), 'PPPpp', { locale: es })}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      <ClockIcon className="mr-1 inline h-4 w-4" />
                      Tiempo empleado
                    </h4>
                    <p className="mt-2 text-sm">{intento.tiempo_total} minutos</p>
                  </div>
                  {evaluacion.tiempo_limite && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Tiempo límite
                      </h4>
                      <p className="mt-2 text-sm">{evaluacion.tiempo_limite} minutos</p>
                    </div>
                  )}
                </div>

                {intento.areas_debilidad && intento.areas_debilidad.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Áreas identificadas con debilidad
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {intento.areas_debilidad.map((area, idx) => (
                        <Badge key={idx} variant="outline" className="bg-red-50 dark:bg-red-950">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {intento.areas_fortaleza && intento.areas_fortaleza.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Áreas de fortaleza
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {intento.areas_fortaleza.map((area, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-green-50 dark:bg-green-950"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
