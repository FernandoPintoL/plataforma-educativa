import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AnalisisIAWidget from '@/components/Tareas/AnalisisIAWidget';
import FormularioEntrega from '@/components/Tareas/FormularioEntrega';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  PaperClipIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { BreadcrumbItem } from '@/types';

interface Tarea {
  id: number;
  contenido: {
    id: number;
    titulo: string;
    descripcion: string;
    curso: {
      id: number;
      nombre: string;
      codigo: string;
    };
  };
  instrucciones: string;
  puntuacion: number;
  fecha_limite: string;
}

interface Trabajo {
  id: number;
  estado: string;
  fecha_entrega?: string;
  comentarios?: string;
  respuestas?: {
    archivos?: Array<{
      nombre: string;
      path: string;
      tamaño: number;
    }>;
  };
  calificacion?: {
    id: number;
    puntaje: number;
    comentario: string;
    analisisIA?: {
      id: number;
      porcentaje_ia: number;
      estado: string;
      fecha_analisis?: string;
      detalles_analisis?: Record<string, any>;
      mensaje_error?: string;
    };
  };
}

interface Props {
  tarea: Tarea;
  trabajo?: Trabajo | null;
  ml_insights?: Record<string, any>;
}

export default function ViewEstudiante({ tarea, trabajo, ml_insights }: Props) {
  const [showResubmissionForm, setShowResubmissionForm] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tareas', href: '/tareas' },
    { title: tarea.contenido.titulo, href: `/tareas/${tarea.id}` },
  ];

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
    } catch {
      return fecha;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isOverdue = new Date() > new Date(tarea.fecha_limite);
  const isDelivered = trabajo?.estado === 'entregado' || trabajo?.estado === 'calificado';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{tarea.contenido.titulo}</h1>
              <p className="text-muted-foreground mt-1">
                {tarea.contenido.curso.nombre} ({tarea.contenido.curso.codigo})
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Puntuación máxima</p>
              <p className="text-2xl font-bold">{tarea.puntuacion} pts</p>
            </div>
          </div>

          {/* Alerta de fecha límite */}
          {isOverdue && !isDelivered && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <ExclamationCircleIcon className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                La fecha límite de entrega fue el {formatFecha(tarea.fecha_limite)}.
                Esta tarea está fuera de plazo.
              </AlertDescription>
            </Alert>
          )}

          {isDelivered && !isOverdue && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Ya entregaste esta tarea
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-6">
          {/* Instrucciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Instrucciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Descripción:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {tarea.contenido.descripcion}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">¿Qué debes hacer?</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {tarea.instrucciones}
                </p>
              </div>

              <div className="border-t pt-4 flex items-center justify-between bg-muted p-3 rounded">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fecha límite de entrega</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFecha(tarea.fecha_limite)}
                    </p>
                  </div>
                </div>
                {!isDelivered && (
                  <Badge variant={isOverdue ? 'destructive' : 'default'}>
                    {isOverdue ? 'Fuera de plazo' : 'Pendiente'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tu Entrega */}
          {trabajo ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PaperClipIcon className="h-5 w-5" />
                    Tu Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Estado */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm font-medium">Estado</span>
                    {trabajo.estado === 'calificado' && (
                      <Badge className="bg-green-500">Calificado</Badge>
                    )}
                    {trabajo.estado === 'entregado' && (
                      <Badge className="bg-blue-500">Entregado - Pendiente de calificación</Badge>
                    )}
                  </div>

                  {/* Fecha de entrega */}
                  {trabajo.fecha_entrega && (
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <span className="text-sm font-medium">Entregado</span>
                      <span className="text-sm">{formatFecha(trabajo.fecha_entrega)}</span>
                    </div>
                  )}

                  {/* Comentarios del estudiante */}
                  {trabajo.comentarios && (
                    <div>
                      <p className="text-sm font-medium mb-2">Tu comentario:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded">
                        {trabajo.comentarios}
                      </p>
                    </div>
                  )}

                  {/* Archivos */}
                  {trabajo.respuestas?.archivos && trabajo.respuestas.archivos.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Archivos entregados:</p>
                      <div className="space-y-2">
                        {trabajo.respuestas.archivos.map((archivo, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded hover:bg-muted/80"
                          >
                            <div className="flex items-center gap-3">
                              <PaperClipIcon className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{archivo.nombre}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatBytes(archivo.tamaño)}
                                </p>
                              </div>
                            </div>
                            <a
                              href={`/trabajos/${trabajo.id}/archivo/${index}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="outline">
                                Descargar
                              </Button>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Opción para entregar de nuevo */}
                  {isDelivered && !isOverdue && !showResubmissionForm && (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setShowResubmissionForm(true)}
                    >
                      📤 Entregar nuevamente
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Formulario de reentrega */}
              {showResubmissionForm && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Reentrega</h2>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowResubmissionForm(false)}
                    >
                      ✕
                    </Button>
                  </div>
                  <FormularioEntrega
                    tareaId={tarea.id}
                    trabajoId={trabajo.id}
                    onSuccess={() => {
                      setShowResubmissionForm(false);
                      window.location.reload();
                    }}
                  />
                </div>
              )}

              {/* Análisis de IA */}
              {!showResubmissionForm && trabajo.respuestas?.archivos?.some(a => a.nombre.toLowerCase().endsWith('.pdf')) && (
                <AnalisisIAWidget analisisIA={trabajo.calificacion?.analisisIA} />
              )}

              {/* Calificación y Feedback */}
              {!showResubmissionForm && trabajo.calificacion && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-900">
                      <CheckCircleIcon className="h-5 w-5" />
                      Tu Calificación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded border border-green-300">
                      <div>
                        <p className="text-sm font-medium text-green-900">Calificación obtenida</p>
                        <p className="text-3xl font-bold text-green-600">
                          {trabajo.calificacion.puntaje}/{tarea.puntuacion}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-900">Porcentaje</p>
                        <p className="text-2xl font-bold text-green-600">
                          {((trabajo.calificacion.puntaje / tarea.puntuacion) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    {trabajo.calificacion.comentario && (
                      <div>
                        <p className="text-sm font-medium mb-2 text-green-900">Retroalimentación del profesor:</p>
                        <p className="text-sm text-green-800 whitespace-pre-wrap bg-white p-3 rounded border border-green-200">
                          {trabajo.calificacion.comentario}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            // Formulario de entrega
            <FormularioEntrega
              tareaId={tarea.id}
              onSuccess={() => {
                window.location.reload();
              }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
