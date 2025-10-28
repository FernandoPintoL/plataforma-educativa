import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { DocumentTextIcon, ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { type BreadcrumbItem } from '@/types';

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Props {
  cursos: Curso[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tareas',
    href: '/tareas',
  },
  {
    title: 'Crear Tarea',
    href: '/tareas/create',
  },
];

export default function Create({ cursos }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    titulo: '',
    descripcion: '',
    instrucciones: '',
    curso_id: '',
    puntuacion: 100,
    fecha_limite: '',
    permite_archivos: true,
    max_archivos: 5,
    tipo_archivo_permitido: '',
    estado: 'borrador',
    recursos: [] as File[],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...files]);
      setData('recursos', [...selectedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setData('recursos', newFiles);
  };

  const handleSubmit = (e: React.FormEvent, publicar = false) => {
    e.preventDefault();
    setData('estado', publicar ? 'publicado' : 'borrador');
    post('/tareas');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
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
              <h1 className="text-3xl font-bold">Crear Nueva Tarea</h1>
              <p className="text-muted-foreground">
                Completa los datos para crear una nueva tarea
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)}>
          {/* Información General */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Datos básicos de la tarea
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
                  placeholder="Ej: Ensayo sobre la Revolución Francesa"
                  className="mt-1"
                />
                {errors.titulo && (
                  <p className="text-sm text-red-500 mt-1">{errors.titulo}</p>
                )}
              </div>

              {/* Curso */}
              <div>
                <Label htmlFor="curso_id">
                  Curso <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.curso_id.toString()}
                  onValueChange={(value) => setData('curso_id', value)}
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
                {errors.curso_id && (
                  <p className="text-sm text-red-500 mt-1">{errors.curso_id}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  placeholder="Breve descripción de la tarea..."
                  rows={2}
                  className="mt-1"
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>
                )}
              </div>

              {/* Instrucciones */}
              <div>
                <Label htmlFor="instrucciones">
                  Instrucciones <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="instrucciones"
                  value={data.instrucciones}
                  onChange={(e) => setData('instrucciones', e.target.value)}
                  placeholder="Instrucciones detalladas para completar la tarea..."
                  rows={6}
                  className="mt-1"
                />
                {errors.instrucciones && (
                  <p className="text-sm text-red-500 mt-1">{errors.instrucciones}</p>
                )}
              </div>

              {/* Puntuación y Fecha Límite */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="puntuacion">
                    Puntuación Máxima <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="puntuacion"
                    type="number"
                    value={data.puntuacion}
                    onChange={(e) => setData('puntuacion', Number(e.target.value))}
                    min={1}
                    max={1000}
                    className="mt-1"
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
                  />
                  {errors.fecha_limite && (
                    <p className="text-sm text-red-500 mt-1">{errors.fecha_limite}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Archivos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Configuración de Entregas</CardTitle>
              <CardDescription>
                Configura cómo los estudiantes pueden entregar la tarea
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Permite Archivos */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir subida de archivos</Label>
                  <p className="text-sm text-muted-foreground">
                    Los estudiantes podrán adjuntar archivos en su entrega
                  </p>
                </div>
                <Switch
                  checked={data.permite_archivos}
                  onCheckedChange={(checked) => setData('permite_archivos', checked)}
                />
              </div>

              {data.permite_archivos && (
                <>
                  {/* Máximo de Archivos */}
                  <div>
                    <Label htmlFor="max_archivos">Número máximo de archivos</Label>
                    <Input
                      id="max_archivos"
                      type="number"
                      value={data.max_archivos}
                      onChange={(e) => setData('max_archivos', Number(e.target.value))}
                      min={1}
                      max={20}
                      className="mt-1"
                    />
                    {errors.max_archivos && (
                      <p className="text-sm text-red-500 mt-1">{errors.max_archivos}</p>
                    )}
                  </div>

                  {/* Tipos de Archivo */}
                  <div>
                    <Label htmlFor="tipo_archivo_permitido">
                      Tipos de archivo permitidos (opcional)
                    </Label>
                    <Input
                      id="tipo_archivo_permitido"
                      value={data.tipo_archivo_permitido}
                      onChange={(e) => setData('tipo_archivo_permitido', e.target.value)}
                      placeholder="Ej: pdf,docx,xlsx"
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Separar por comas. Deja vacío para permitir todos los tipos.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recursos Adjuntos */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recursos y Material de Apoyo</CardTitle>
              <CardDescription>
                Adjunta archivos que los estudiantes puedan descargar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recursos">Subir archivos</Label>
                <Input
                  id="recursos"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Máximo 50MB por archivo
                </p>
              </div>

              {/* Lista de archivos seleccionados */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label>Archivos seleccionados:</Label>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <span className="text-xs text-muted-foreground mx-2">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={processing}
              variant="outline"
            >
              Guardar como Borrador
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={processing}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Publicar Tarea
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
