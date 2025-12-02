import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AnalisisIAConBoton from '@/components/Tareas/AnalisisIAConBoton';
import { type BreadcrumbItem } from '@/types';
import {
  ArrowLeftIcon,
  UserIcon,
  DocumentTextIcon,
  PaperClipIcon,
  CheckCircleIcon,
  CalendarIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Estudiante {
  id: number;
  name: string;
  apellido?: string;
}

interface Trabajo {
  id: number;
  estado: string;
  fecha_entrega: string;
  comentarios: string;
  estudiante: Estudiante;
  respuestas: {
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
  };
  contenido: {
    id: number;
    titulo: string;
    descripcion: string;
    curso: {
      id: number;
      nombre: string;
      codigo: string;
    };
    tarea: {
      id: number;
      puntuacion: number;
      instrucciones: string;
    };
  };
}

interface AnalisisIA {
  id: number;
  porcentaje_ia: number;
  estado: string;
  fecha_analisis?: string;
  detalles_analisis?: Record<string, any>;
  mensaje_error?: string;
}

interface Props {
  trabajo: Trabajo;
  analisisIA?: AnalisisIA | null;
}

interface Criterio {
  criterio: string;
  puntaje: number;
  comentario: string;
}

export default function Calificar({ trabajo, analisisIA }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Trabajos',
      href: '/trabajos',
    },
    {
      title: 'Calificar',
      href: `/trabajos/${trabajo.id}/calificar`,
    },
  ];
  const { data, setData, post, processing, errors } = useForm({
    puntaje: trabajo.calificacion?.puntaje || 0,
    comentario: trabajo.calificacion?.comentario || '',
    criterios_evaluacion: [] as Criterio[],
  });

  const [criterios, setCriterios] = useState<Criterio[]>([]);

  const handleAddCriterio = () => {
    const nuevoCriterio: Criterio = {
      criterio: '',
      puntaje: 0,
      comentario: '',
    };
    const nuevosCriterios = [...criterios, nuevoCriterio];
    setCriterios(nuevosCriterios);
    setData('criterios_evaluacion', nuevosCriterios);
  };

  const handleRemoveCriterio = (index: number) => {
    const nuevosCriterios = criterios.filter((_, i) => i !== index);
    setCriterios(nuevosCriterios);
    setData('criterios_evaluacion', nuevosCriterios);
  };

  const handleCriterioChange = (index: number, field: keyof Criterio, value: string | number) => {
    const nuevosCriterios = [...criterios];
    nuevosCriterios[index] = {
      ...nuevosCriterios[index],
      [field]: value,
    };
    setCriterios(nuevosCriterios);
    setData('criterios_evaluacion', nuevosCriterios);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('═══════════════════════════════════════');
    console.log('🔵 INICIANDO ENVÍO DE CALIFICACIÓN');
    console.log('═══════════════════════════════════════');
    console.log('Datos a enviar:', {
      trabajo_id: trabajo.id,
      puntaje: data.puntaje,
      comentario: data.comentario?.substring(0, 50) + '...',
      criterios: data.criterios_evaluacion.length,
      timestamp: new Date().toISOString(),
    });

    const loadingToastId = toast.loading('Guardando calificación...');

    post(`/trabajos/${trabajo.id}/calificar`, {
      onSuccess: () => {
        console.log('═══════════════════════════════════════');
        console.log('✅ RESPUESTA EXITOSA DEL SERVIDOR');
        console.log('═══════════════════════════════════════');
        console.log('Calificación guardada correctamente');
        console.log('Puntaje guardado:', data.puntaje);

        toast.dismiss(loadingToastId);
        toast.success('✓ Calificación guardada exitosamente');

        console.log('⏳ Recargando página en 1.5 segundos...');

        // Recargar la página de forma simple para obtener datos frescos
        setTimeout(() => {
          console.log('🔄 RECARGANDO con window.location.reload()');
          window.location.reload();
        }, 1500);
      },
      onError: (errors: any) => {
        console.log('═══════════════════════════════════════');
        console.log('❌ ERROR EN LA RESPUESTA');
        console.log('═══════════════════════════════════════');
        console.log('Errores recibidos:', errors);
        console.log('Tipo de error:', typeof errors);

        toast.dismiss(loadingToastId);
        const errorMessage = errors.error || 'Error al guardar la calificación';
        console.log('Mensaje de error a mostrar:', errorMessage);
        toast.error(errorMessage);
      },
    });
  };

  // Mostrar toast cuando hay cambios en los errores
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error: any) => {
        if (typeof error === 'string') {
          toast.error(error);
        }
      });
    }
  }, [errors]);

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

  const porcentaje = trabajo.contenido.tarea.puntuacion > 0
    ? (data.puntaje / trabajo.contenido.tarea.puntuacion) * 100
    : 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Calificar Trabajo</h1>
              <p className="text-muted-foreground">
                {trabajo.estudiante.name} {trabajo.estudiante.apellido || ''}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del Trabajo */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles de la Tarea */}
            <Card>
              <CardHeader>
                <CardTitle>{trabajo.contenido.titulo}</CardTitle>
                <CardDescription>
                  {trabajo.contenido.curso.nombre} ({trabajo.contenido.curso.codigo})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Instrucciones:</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                      {trabajo.contenido.tarea.instrucciones}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Entregado el {formatFecha(trabajo.fecha_entrega)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entrega del Estudiante */}
            <Card>
              <CardHeader>
                <CardTitle>Entrega del Estudiante</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comentarios */}
                {trabajo.comentarios && (
                  <div>
                    <span className="text-sm font-medium">Comentarios:</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                      {trabajo.comentarios}
                    </p>
                  </div>
                )}

                {/* Archivos Entregados */}
                {trabajo.respuestas?.archivos && trabajo.respuestas.archivos.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Archivos entregados:</span>
                    <div className="space-y-2 mt-2">
                      {trabajo.respuestas.archivos.map((archivo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded hover:bg-muted/80"
                        >
                          <div className="flex items-center gap-3">
                            <PaperClipIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{archivo.nombre}</p>
                              <p className="text-xs text-muted-foreground">{formatBytes(archivo.tamaño)}</p>
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

                {!trabajo.comentarios && (!trabajo.respuestas?.archivos || trabajo.respuestas.archivos.length === 0) && (
                  <p className="text-sm text-muted-foreground">El estudiante no agregó comentarios ni archivos.</p>
                )}
              </CardContent>
            </Card>

            {/* Análisis de IA */}
            {trabajo.respuestas?.archivos && trabajo.respuestas.archivos.some(a => a.nombre.toLowerCase().endsWith('.pdf')) && (
              <AnalisisIAConBoton
                trabajo={trabajo}
                analisisIA={analisisIA}
                onAnalisisCompleto={(resultado) => {
                  console.log('✅ Análisis completado:', resultado);
                }}
              />
            )}

            {/* Formulario de Calificación */}
            <Card>
              <CardHeader>
                <CardTitle>Calificación</CardTitle>
                <CardDescription>
                  Asigna un puntaje y proporciona retroalimentación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Puntaje */}
                  <div>
                    <Label htmlFor="puntaje">
                      Puntaje <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="puntaje"
                        type="number"
                        value={data.puntaje}
                        onChange={(e) => setData('puntaje', Number(e.target.value))}
                        min={0}
                        max={trabajo.contenido.tarea.puntuacion}
                        step={0.5}
                        className="max-w-[150px]"
                      />
                      <span className="text-sm text-muted-foreground">
                        / {trabajo.contenido.tarea.puntuacion}
                      </span>
                      <Badge variant={porcentaje >= 60 ? 'default' : 'destructive'}>
                        {porcentaje.toFixed(1)}%
                      </Badge>
                    </div>
                    {errors.puntaje && (
                      <p className="text-sm text-red-500 mt-1">{errors.puntaje}</p>
                    )}
                  </div>

                  {/* Comentario */}
                  <div>
                    <Label htmlFor="comentario">Retroalimentación</Label>
                    <Textarea
                      id="comentario"
                      value={data.comentario}
                      onChange={(e) => setData('comentario', e.target.value)}
                      placeholder="Proporciona retroalimentación al estudiante..."
                      rows={6}
                      className="mt-1"
                    />
                    {errors.comentario && (
                      <p className="text-sm text-red-500 mt-1">{errors.comentario}</p>
                    )}
                  </div>

                  {/* Criterios de Evaluación (Opcional) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Criterios de Evaluación (Opcional)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCriterio}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Agregar Criterio
                      </Button>
                    </div>

                    {criterios.length > 0 && (
                      <div className="space-y-3 mt-3">
                        {criterios.map((criterio, index) => (
                          <div key={index} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Criterio {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveCriterio(index)}
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </Button>
                            </div>

                            <Input
                              placeholder="Nombre del criterio"
                              value={criterio.criterio}
                              onChange={(e) => handleCriterioChange(index, 'criterio', e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="Puntaje"
                                value={criterio.puntaje}
                                onChange={(e) => handleCriterioChange(index, 'puntaje', Number(e.target.value))}
                                min={0}
                                step={0.5}
                              />
                              <Input
                                placeholder="Comentario (opcional)"
                                value={criterio.comentario}
                                onChange={(e) => handleCriterioChange(index, 'comentario', e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

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

                  {/* Botones */}
                  <div className="flex gap-4">
                    <Button type="submit" disabled={processing}>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      {processing ? 'Guardando...' : 'Guardar Calificación'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                      disabled={processing}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Información Lateral */}
          <div className="space-y-6">
            {/* Información del Estudiante */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Estudiante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Nombre:</p>
                    <p className="text-sm text-muted-foreground">
                      {trabajo.estudiante.name} {trabajo.estudiante.apellido || ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Estado:</p>
                    <Badge variant="default" className="mt-1">
                      {trabajo.estado}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guía de Calificación */}
            <Card>
              <CardHeader>
                <CardTitle>Guía de Calificación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>90-100%:</span>
                    <Badge variant="default">Excelente</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>80-89%:</span>
                    <Badge variant="secondary">Muy Bueno</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>70-79%:</span>
                    <Badge variant="secondary">Bueno</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>60-69%:</span>
                    <Badge variant="outline">Suficiente</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>&lt; 60%:</span>
                    <Badge variant="destructive">Insuficiente</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Tarea</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Puntuación máxima:</span>
                  <span className="font-medium">{trabajo.contenido.tarea.puntuacion}</span>
                </div>
                <div className="flex justify-between">
                  <span>Curso:</span>
                  <span className="font-medium">{trabajo.contenido.curso.codigo}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
