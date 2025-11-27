import React, { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  PaperClipIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileUploadModal, formatBytes } from '@/components/FileUploadModal';
import NotificationService from '@/services/notification.service';

interface Recurso {
  id: number;
  nombre: string;
  tipo: string;
  archivo_path: string;
  tamaño: number;
}

interface Tarea {
  id: number;
  instrucciones: string;
  puntuacion: number;
  permite_archivos: boolean;
  max_archivos: number;
  tipo_archivo_permitido: string | null;
  fecha_limite: string;
  contenido: {
    id: number;
    titulo: string;
    descripcion: string;
    estado: string;
    curso: {
      id: number;
      nombre: string;
      codigo: string;
    };
    creador: {
      id: number;
      name: string;
    };
    recursos: Recurso[];
  };
}

interface Trabajo {
  id: number;
  comentarios: string;
  estado: 'en_progreso' | 'entregado' | 'calificado' | 'devuelto';
  fecha_entrega: string | null;
  respuestas: {
    archivos?: Array<{
      nombre: string;
      path: string;
      tamaño: number;
      fecha_subida: string;
    }>;
  };
  calificacion?: {
    id: number;
    puntaje: number;
    comentario: string;
    fecha_calificacion: string;
  };
}

interface Estadisticas {
  total_estudiantes: number;
  total_entregas: number;
  total_calificados: number;
  promedio_calificacion: number;
  tasa_entrega: number;
}

interface Props {
  tarea: Tarea;
  trabajo: Trabajo | null;
  estadisticas: Estadisticas | null;
}

export default function Show({ tarea, trabajo, estadisticas }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Tareas',
      href: '/tareas',
    },
    {
      title: tarea.contenido.titulo,
      href: `/tareas/${tarea.id}`,
    },
  ];
  const esEstudiante = !estadisticas;
  const esProfesor = !!estadisticas;

  // Estado del modal de upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSubmittingFiles, setIsSubmittingFiles] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    comentarios: trabajo?.comentarios || '',
    archivos: [] as File[],
  });

  /**
   * Maneja el envío de archivos desde el modal
   */
  const handleFileSubmit = async (files: File[]) => {
    try {
      setIsSubmittingFiles(true);

      // Crea un nuevo formulario con comentarios y archivos
      const formData = new FormData();
      formData.append('comentarios', data.comentarios);

      // Agrega los nuevos archivos
      files.forEach((file) => {
        formData.append('archivos[]', file);
      });

      // Agrega archivos existentes si los hay
      if (trabajo?.respuestas?.archivos) {
        trabajo.respuestas.archivos.forEach((archivo) => {
          formData.append('existing_archivos[]', JSON.stringify(archivo));
        });
      }

      // Realiza el POST con Inertia.js
      router.post(`/tareas/${tarea.id}/entregar`, formData, {
        onSuccess: () => {
          NotificationService.success('Archivos subidos correctamente');
          setShowUploadModal(false);
          setData('archivos', []);
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          NotificationService.error(
            `Error al subir archivos: ${errorMessages}`
          );
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      NotificationService.error(`Error: ${message}`);
    } finally {
      setIsSubmittingFiles(false);
    }
  };

  const handleEntregar = () => {
    if (
      confirm(
        '¿Estás seguro de entregar este trabajo? No podrás modificarlo después.'
      )
    ) {
      post(`/tareas/${tarea.id}/entregar`, {
        onSuccess: () => {
          NotificationService.success('Trabajo entregado correctamente');
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).join(', ');
          NotificationService.error(
            `Error al entregar: ${errorMessages}`
          );
        },
      });
    }
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
    } catch {
      return fecha;
    }
  };

  const estaVencida = () => {
    return new Date(tarea.fecha_limite) < new Date();
  };

  const puedeEntregar = () => {
    return esEstudiante && (!trabajo || trabajo.estado === 'en_progreso') && !estaVencida();
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      en_progreso: { variant: 'secondary', label: 'En Progreso', icon: ClockIcon },
      entregado: { variant: 'default', label: 'Entregado', icon: CheckCircleIcon },
      calificado: { variant: 'outline', label: 'Calificado', icon: CheckCircleIcon },
      devuelto: { variant: 'destructive', label: 'Devuelto', icon: XCircleIcon },
    };

    const config = variants[estado] || variants.en_progreso;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">{tarea.contenido.titulo}</h1>
                <p className="text-muted-foreground">
                  {tarea.contenido.curso.nombre} ({tarea.contenido.curso.codigo})
                </p>
              </div>
            </div>
            {esProfesor && (
              <Link href={`/tareas/${tarea.id}/edit`}>
                <Button variant="outline">Editar Tarea</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Información de Fecha Límite */}
        <Alert className={estaVencida() ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'}>
          <CalendarIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Fecha límite:</strong> {formatFecha(tarea.fecha_limite)}
            {estaVencida() && <span className="ml-2 text-red-600 font-semibold">(Vencida)</span>}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Columna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción e Instrucciones */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {tarea.contenido.descripcion || 'Sin descripción'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instrucciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{tarea.instrucciones}</p>
              </CardContent>
            </Card>

            {/* Recursos Adjuntos */}
            {tarea.contenido.recursos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Material de Apoyo</CardTitle>
                  <CardDescription>Descarga los recursos necesarios para la tarea</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tarea.contenido.recursos.map((recurso) => (
                      <div
                        key={recurso.id}
                        className="flex items-center justify-between p-3 bg-muted rounded hover:bg-muted/80"
                      >
                        <div className="flex items-center gap-3">
                          <PaperClipIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{recurso.nombre}</p>
                            <p className="text-xs text-muted-foreground">{formatBytes(recurso.tamaño)}</p>
                          </div>
                        </div>
                        <Link href={`/recursos/${recurso.id}/descargar`}>
                          <Button size="sm" variant="outline">
                            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Formulario de Entrega (Solo Estudiantes) */}
            {esEstudiante && puedeEntregar() && (
              <Card>
                <CardHeader>
                  <CardTitle>Entregar Trabajo</CardTitle>
                  <CardDescription>Completa los campos y envía tu trabajo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Comentarios */}
                  <div>
                    <Label htmlFor="comentarios">Comentarios (opcional)</Label>
                    <Textarea
                      id="comentarios"
                      value={data.comentarios}
                      onChange={(e) => setData('comentarios', e.target.value)}
                      placeholder="Agrega comentarios sobre tu trabajo..."
                      rows={4}
                      className="mt-1"
                      disabled={processing}
                    />
                  </div>

                  {/* Subir Archivos */}
                  {tarea.permite_archivos && (
                    <>
                      <div>
                        <Label>
                          Archivos (Máximo {tarea.max_archivos})
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1 mb-3">
                          {tarea.tipo_archivo_permitido && (
                            <>Tipos permitidos: <strong>{tarea.tipo_archivo_permitido}</strong></>
                          )}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowUploadModal(true)}
                          disabled={processing || isSubmittingFiles}
                          className="w-full"
                        >
                          <PaperClipIcon className="h-4 w-4 mr-2" />
                          Seleccionar Archivos
                        </Button>
                      </div>

                      {/* Archivos ya subidos en esta entrega */}
                      {data.archivos && data.archivos.length > 0 && (
                        <div className="space-y-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                          <Label className="text-green-900 dark:text-green-400">
                            ✓ Archivos listos para entregar ({data.archivos.length})
                          </Label>
                          <div className="space-y-2">
                            {data.archivos.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-white dark:bg-green-900/30 rounded text-sm"
                              >
                                <span className="truncate flex-1">{file.name}</span>
                                <span className="text-xs text-muted-foreground mx-2">
                                  {formatBytes(file.size)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Errores de validación */}
                  {errors && Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {Object.values(errors).map((error, i) => (
                          <div key={i}>{error}</div>
                        ))}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Botón de entrega final */}
                  <Button
                    onClick={handleEntregar}
                    disabled={processing || isSubmittingFiles}
                    className="w-full"
                  >
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    {processing ? 'Entregando...' : 'Entregar Trabajo'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Modal de Upload */}
            <FileUploadModal
              open={showUploadModal}
              onOpenChange={setShowUploadModal}
              maxFiles={tarea.max_archivos}
              maxFileSize={50 * 1024 * 1024} // 50MB
              acceptedFileTypes={
                tarea.tipo_archivo_permitido
                  ? tarea.tipo_archivo_permitido.split(',').map((t) => t.trim())
                  : undefined
              }
              onSubmit={handleFileSubmit}
              onError={(error) => {
                NotificationService.error(error);
              }}
              title="Subir Archivos"
              description="Selecciona los archivos que deseas entregar"
              submitButtonText="Agregar Archivos"
              isLoading={isSubmittingFiles}
            />


            {/* Estado del Trabajo (Estudiante) */}
            {esEstudiante && trabajo && trabajo.estaEntregado && (
              <Card>
                <CardHeader>
                  <CardTitle>Tu Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    {getEstadoBadge(trabajo.estado)}
                  </div>

                  {trabajo.fecha_entrega && (
                    <div>
                      <span className="text-sm font-medium">Fecha de entrega:</span>
                      <p className="text-sm text-muted-foreground">{formatFecha(trabajo.fecha_entrega)}</p>
                    </div>
                  )}

                  {trabajo.comentarios && (
                    <div>
                      <span className="text-sm font-medium">Tus comentarios:</span>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                        {trabajo.comentarios}
                      </p>
                    </div>
                  )}

                  {trabajo.respuestas?.archivos && trabajo.respuestas.archivos.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Archivos entregados:</span>
                      <div className="space-y-2 mt-2">
                        {trabajo.respuestas.archivos.map((archivo, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                          >
                            <div className="flex items-center gap-2">
                              <PaperClipIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{archivo.nombre}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatBytes(archivo.tamaño)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Calificación */}
                  {trabajo.calificacion && (
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div>
                            <strong>Calificación:</strong>{' '}
                            <span className="text-lg font-bold text-green-600">
                              {trabajo.calificacion.puntaje} / {tarea.puntuacion}
                            </span>
                          </div>
                          {trabajo.calificacion.comentario && (
                            <div>
                              <strong>Retroalimentación:</strong>
                              <p className="mt-1 whitespace-pre-wrap">{trabajo.calificacion.comentario}</p>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Calificado el {formatFecha(trabajo.calificacion.fecha_calificacion)}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Columna Lateral */}
          <div className="space-y-6">
            {/* Información de la Tarea */}
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Puntuación máxima</p>
                  <Badge variant="outline" className="mt-1">
                    {tarea.puntuacion} puntos
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Profesor</p>
                  <p className="text-sm text-muted-foreground">{tarea.contenido.creador.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Permite archivos</p>
                  <p className="text-sm text-muted-foreground">
                    {tarea.permite_archivos ? `Sí (máx. ${tarea.max_archivos})` : 'No'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas (Solo Profesor) */}
            {esProfesor && estadisticas && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5" />
                    Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total estudiantes:</span>
                    <span className="font-medium">{estadisticas.total_estudiantes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Entregas:</span>
                    <span className="font-medium">{estadisticas.trabajos_entregados}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Calificados:</span>
                    <span className="font-medium">{estadisticas.trabajos_calificados}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tasa de entrega:</span>
                    <span className="font-medium">{estadisticas.porcentaje_entrega.toFixed(1)}%</span>
                  </div>
                  {estadisticas.promedio_puntaje > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Promedio:</span>
                      <span className="font-medium">{estadisticas.promedio_puntaje.toFixed(1)}</span>
                    </div>
                  )}

                  <Link href={`/trabajos?curso_id=${tarea.contenido.curso.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <UserGroupIcon className="h-4 w-4 mr-2" />
                      Ver Entregas
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
