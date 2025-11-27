import React, { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentTextIcon, ArrowLeftIcon, ChevronDownIcon, Sparkles, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type BreadcrumbItem } from '@/types';
import { ContentAssistant, type ContentSuggestions } from '@/components/ContentAssistant';

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface TareaData {
  id: number;
  contenido: {
    titulo: string;
    descripcion: string;
    fecha_limite: string;
    curso: Curso;
  };
  instrucciones: string;
  puntuacion: number;
  permite_archivos: boolean;
  max_archivos: number;
  tipo_archivo_permitido: string;
}

interface Props {
  tarea: TareaData;
  cursos: Curso[];
}

// Función para formatear fecha ISO a datetime-local format
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  // Remover timezone y microsegundos: "2025-11-26T00:00:00.000000Z" -> "2025-11-26T00:00:00"
  const cleanDate = dateString.replace('Z', '').split('.')[0];
  // Retornar en formato yyyy-MM-ddThh:mm
  return cleanDate.substring(0, 16);
};

const EditTarea = ({ tarea, cursos }: Props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [previousData, setPreviousData] = useState<any>(null);
  const shouldSubmitRef = useRef(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Tareas',
      href: '/tareas',
    },
    {
      title: tarea.contenido.titulo,
      href: `/tareas/${tarea.id}`,
    },
    {
      title: 'Editar',
      href: `/tareas/${tarea.id}/edit`,
    },
  ];

  const { data, setData, put, processing, errors } = useForm({
    titulo: tarea.contenido.titulo || '',
    descripcion: tarea.contenido.descripcion || '',
    instrucciones: tarea.instrucciones || '',
    curso_id: tarea.contenido.curso.id || '',
    puntuacion: tarea.puntuacion || 100,
    fecha_limite: formatDateForInput(tarea.contenido.fecha_limite) || '',
    permite_archivos: tarea.permite_archivos ?? true,
    max_archivos: tarea.max_archivos || 5,
    tipo_archivo_permitido: tarea.tipo_archivo_permitido || '',
    estado: 'borrador',
    recursos: [] as File[],
  });

  /**
   * Aplica sugerencias del agente con animación visual
   */
  const handleApplySuggestions = (suggestions: ContentSuggestions) => {
    const changedFields: string[] = [];

    // Guardar estado anterior para deshacer
    setPreviousData({ ...data });

    if (suggestions.descripcion && suggestions.descripcion !== data.descripcion) {
      setData('descripcion', suggestions.descripcion);
      changedFields.push('descripcion');
    }

    if (suggestions.instrucciones_plantilla && suggestions.instrucciones_plantilla !== data.instrucciones) {
      setData('instrucciones', suggestions.instrucciones_plantilla);
      changedFields.push('instrucciones');
    }

    if (suggestions.puntuacion_sugerida && suggestions.puntuacion_sugerida !== data.puntuacion) {
      setData('puntuacion', suggestions.puntuacion_sugerida);
      changedFields.push('puntuacion');
    }

    // Mostrar animación y notificación si hay cambios
    if (changedFields.length > 0) {
      setUpdatedFields(changedFields);
      setShowNotification(true);

      // Ocultar notificación después de 4 segundos
      setTimeout(() => {
        setShowNotification(false);
        // Remover resalte después de 6 segundos
        setTimeout(() => {
          setUpdatedFields([]);
        }, 2000);
      }, 4000);
    }
  };

  /**
   * Deshacer los cambios aplicados
   */
  const handleUndoChanges = () => {
    if (previousData) {
      setData(previousData);
      setUpdatedFields([]);
      setShowNotification(false);
      setPreviousData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent, publicar = false) => {
    e.preventDefault();
    const estado = publicar ? 'publicado' : 'borrador';

    setData('estado', estado);
    shouldSubmitRef.current = true;

    setTimeout(() => {
      if (shouldSubmitRef.current && data.titulo && data.instrucciones && data.curso_id) {
        put(`/tareas/${tarea.id}`, {
          onSuccess: () => {
            shouldSubmitRef.current = false;
            window.location.href = `/tareas/${tarea.id}`;
          },
          onError: () => {
            shouldSubmitRef.current = false;
          },
        });
      }
    }, 150);
  };

  // Función auxiliar para saber si un campo fue actualizado
  const isFieldUpdated = (fieldName: string): boolean => {
    return updatedFields.includes(fieldName);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <style>{`
        @keyframes fieldPulse {
          0% {
            background-color: rgb(34, 197, 94, 0.1);
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
          }
          50% {
            background-color: rgb(34, 197, 94, 0.05);
          }
          100% {
            background-color: transparent;
          }
        }

        .field-updated {
          animation: fieldPulse 2.5s ease-out forwards;
          border-color: rgb(34, 197, 94) !important;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .notification-enter {
          animation: slideIn 0.4s ease-out forwards;
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .notification-exit {
          animation: fadeOut 0.3s ease-out forwards;
        }
      `}</style>

      <div className="container mx-auto py-8 px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Editar Tarea</h1>
              <p className="text-muted-foreground text-sm">{tarea.contenido.titulo}</p>
            </div>
          </div>
        </div>

        {/* Notificación de Cambios */}
        {showNotification && (
          <Alert className={`mb-6 bg-green-50 border-green-200 notification-enter`}>
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 ml-2">
              <div className="flex justify-between items-start">
                <div>
                  <strong>✨ {updatedFields.length} campo(s) actualizado(s) con IA:</strong>
                  <div className="mt-1 text-sm">
                    {updatedFields.map((field) => (
                      <div key={field} className="capitalize">
                        • {field === 'instrucciones' ? 'Instrucciones' : field === 'descripcion' ? 'Descripción' : 'Puntuación'}
                      </div>
                    ))}
                  </div>
                </div>
                {previousData && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUndoChanges}
                    className="ml-4"
                  >
                    ↩️ Deshacer
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* ContentAssistant - Sugerencias con IA */}
        <ContentAssistant
          contentType="tarea"
          courseId={parseInt(data.curso_id.toString()) || null}
          courses={cursos}
          onSuggestionsApplied={handleApplySuggestions}
          title="Mejorar con IA"
        />

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">

          {/* ============================================ */}
          {/* MODO RÁPIDO - Campos Principales            */}
          {/* ============================================ */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>Cambios rápidos de la tarea</CardDescription>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="descripcion">Descripción</Label>
                  {isFieldUpdated('descripcion') && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✨ Actualizado
                    </span>
                  )}
                </div>
                <Textarea
                  id="descripcion"
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  placeholder="Breve descripción de la tarea..."
                  rows={2}
                  className={`mt-1 transition-all ${isFieldUpdated('descripcion') ? 'field-updated' : ''}`}
                  disabled={processing}
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>
                )}
              </div>

              {/* Instrucciones */}
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="instrucciones">
                    Instrucciones <span className="text-red-500">*</span>
                  </Label>
                  {isFieldUpdated('instrucciones') && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✨ Actualizado
                    </span>
                  )}
                </div>
                <Textarea
                  id="instrucciones"
                  value={data.instrucciones}
                  onChange={(e) => setData('instrucciones', e.target.value)}
                  placeholder="Instrucciones detalladas..."
                  rows={5}
                  className={`mt-1 transition-all ${isFieldUpdated('instrucciones') ? 'field-updated' : ''}`}
                  disabled={processing}
                />
                {errors.instrucciones && (
                  <p className="text-sm text-red-500 mt-1">{errors.instrucciones}</p>
                )}
              </div>

              {/* Puntuación y Fecha - Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="puntuacion">
                      Puntuación <span className="text-red-500">*</span>
                    </Label>
                    {isFieldUpdated('puntuacion') && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ✨ Actualizado
                      </span>
                    )}
                  </div>
                  <Input
                    id="puntuacion"
                    type="number"
                    value={data.puntuacion}
                    onChange={(e) => setData('puntuacion', Number(e.target.value))}
                    min={1}
                    max={1000}
                    className={`mt-1 transition-all ${isFieldUpdated('puntuacion') ? 'field-updated' : ''}`}
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

          {/* ============================================ */}
          {/* MODO AVANZADO - Expandible                  */}
          {/* ============================================ */}
          <Card className={showAdvanced ? '' : 'border-dashed'}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">Opciones Avanzadas</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {showAdvanced ? 'Ocultar' : 'Mostrar'}
                </span>
              </div>
              <ChevronDownIcon
                className={`h-5 w-5 text-muted-foreground transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </button>

            {showAdvanced && (
              <>
                <div className="border-t"></div>
                <CardContent className="space-y-6 pt-6">

                  {/* Configuración de Entregas */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <span>Configuración de Entregas</span>
                    </h3>

                    <div className="space-y-4">
                      {/* Permite Archivos */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Permitir subida de archivos</Label>
                          <p className="text-sm text-muted-foreground">
                            Los estudiantes pueden adjuntar archivos
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
                          <div className="pl-4 border-l-2 border-muted space-y-4">
                            <div>
                              <Label htmlFor="max_archivos">Máximo de archivos por entrega</Label>
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
                              <Label htmlFor="tipo_archivo_permitido">Tipos permitidos</Label>
                              <Input
                                id="tipo_archivo_permitido"
                                value={data.tipo_archivo_permitido}
                                onChange={(e) => setData('tipo_archivo_permitido', e.target.value)}
                                placeholder="pdf,docx,xlsx (deja vacío para todos)"
                                className="mt-1"
                                disabled={processing}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Separar por comas
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-3 justify-end sticky bottom-4 bg-background/95 backdrop-blur p-4 rounded-lg border">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={processing}
            >
              {processing ? 'Guardando...' : 'Guardar Borrador'}
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e, true);
              }}
              disabled={processing}
            >
              {processing ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default EditTarea;
