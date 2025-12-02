import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
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
  trabajos: Array<{
    id: number;
    estudiante: {
      id: number;
      name: string;
      apellido?: string;
    };
    estado: string;
    fecha_entrega?: string;
    calificacion?: {
      id: number;
      puntaje: number;
      comentario: string;
      analisisIA?: {
        porcentaje_ia: number;
        estado: string;
      };
    };
  }>;
}

interface Props {
  tarea: Tarea;
  estadisticas?: {
    total_estudiantes: number;
    entregados: number;
    calificados: number;
    no_entregados: number;
    promedio_calificacion: number;
  };
  ml_analysis?: Record<string, any>;
}

export default function ViewProfesor({ tarea, estadisticas, ml_analysis }: Props) {
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

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'entregado':
        return <Badge variant="default" className="bg-blue-500">Entregado</Badge>;
      case 'calificado':
        return <Badge variant="default" className="bg-green-500">Calificado</Badge>;
      case 'no_entregado':
        return <Badge variant="destructive">No entregado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-start justify-between">
            <div>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Tarjetas de Estadísticas */}
          {estadisticas && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{estadisticas.total_estudiantes ?? 0}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Entregados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">
                    {estadisticas.entregados ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {estadisticas.total_estudiantes && estadisticas.total_estudiantes > 0
                      ? Math.round(((estadisticas.entregados ?? 0) / estadisticas.total_estudiantes) * 100)
                      : 0}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Calificados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">
                    {estadisticas.calificados ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(estadisticas.entregados ?? 0) > 0
                      ? Math.round(((estadisticas.calificados ?? 0) / (estadisticas.entregados ?? 0)) * 100)
                      : 0}% de entregados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {(estadisticas.promedio_calificacion ?? 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">de {tarea.puntuacion}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel Izquierdo: Información de la Tarea */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalles de la Tarea</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Descripción:</span>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                    {tarea.contenido.descripcion}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <span className="text-sm font-medium">Instrucciones:</span>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                    {tarea.instrucciones}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <span className="text-sm font-medium">Fecha Límite:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{formatFecha(tarea.fecha_limite)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Descargar Listado
                </Button>
                <Button className="w-full" variant="outline">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  Análisis Masivo de IA
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Panel Derecho: Listado de Entregas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5" />
                  Entregas de Estudiantes
                </CardTitle>
                <CardDescription>
                  Haz clic en una entrega para calificar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="entregados" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="entregados">
                      Entregados ({tarea.trabajos?.filter(t => t.estado === 'entregado' || t.estado === 'calificado').length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="calificados">
                      Calificados ({tarea.trabajos?.filter(t => t.estado === 'calificado').length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="no_entregados">
                      No Entregados ({tarea.trabajos?.filter(t => t.estado === 'no_entregado').length || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="entregados" className="space-y-3 mt-4">
                    {tarea.trabajos
                      ?.filter(t => t.estado === 'entregado' || t.estado === 'calificado')
                      .map((trabajo) => (
                        <div
                          key={trabajo.id}
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => (window.location.href = `/trabajos/${trabajo.id}/calificar`)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {trabajo.estudiante.name} {trabajo.estudiante.apellido || ''}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Entregado: {trabajo.fecha_entrega ? formatFecha(trabajo.fecha_entrega) : 'Sin fecha'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {trabajo.calificacion?.analisisIA && (
                                <Badge
                                  variant="outline"
                                  className={
                                    trabajo.calificacion.analisisIA.porcentaje_ia >= 50
                                      ? 'bg-orange-50 border-orange-300'
                                      : 'bg-green-50 border-green-300'
                                  }
                                >
                                  🤖 {trabajo.calificacion.analisisIA.porcentaje_ia}% IA
                                </Badge>
                              )}
                              {getEstadoBadge(trabajo.estado)}
                            </div>
                          </div>
                          {trabajo.calificacion && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Calificación: </span>
                              <span className="text-lg font-bold">{trabajo.calificacion.puntaje}/{tarea.puntuacion}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    {tarea.trabajos?.filter(t => t.estado === 'entregado' || t.estado === 'calificado').length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay entregas aún
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="calificados" className="space-y-3 mt-4">
                    {tarea.trabajos
                      ?.filter(t => t.estado === 'calificado')
                      .map((trabajo) => (
                        <div key={trabajo.id} className="border rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
                             onClick={() => (window.location.href = `/trabajos/${trabajo.id}`)}>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {trabajo.estudiante.name} {trabajo.estudiante.apellido || ''}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {trabajo.calificacion?.puntaje}/{tarea.puntuacion} puntos
                              </p>
                            </div>
                            {getEstadoBadge('calificado')}
                          </div>
                        </div>
                      ))}
                    {tarea.trabajos?.filter(t => t.estado === 'calificado').length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No hay trabajos calificados aún
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="no_entregados" className="space-y-3 mt-4">
                    {tarea.trabajos
                      ?.filter(t => t.estado === 'no_entregado')
                      .map((trabajo) => (
                        <div key={trabajo.id} className="border border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">
                                {trabajo.estudiante.name} {trabajo.estudiante.apellido || ''}
                              </p>
                              <p className="text-sm text-red-600">No entregó</p>
                            </div>
                            {getEstadoBadge('no_entregado')}
                          </div>
                        </div>
                      ))}
                    {tarea.trabajos?.filter(t => t.estado === 'no_entregado').length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Todos los estudiantes entregaron
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
