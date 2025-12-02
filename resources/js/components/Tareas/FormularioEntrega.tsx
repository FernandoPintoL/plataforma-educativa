import React, { useState, useRef } from 'react';
import { useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  File,
  X,
  Paperclip,
} from 'lucide-react';

interface Props {
  tareaId: number;
  trabajoId?: number;
  onSuccess?: () => void;
}

interface ArchivoSeleccionado {
  file: File;
  nombre: string;
  tamaño: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf'];

export default function FormularioEntrega({ tareaId, trabajoId, onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<ArchivoSeleccionado[]>([]);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    comentarios: '',
    archivos: [] as File[],
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validarArchivo = (file: File): string | null => {
    // Verificar tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `"${file.name}" no es un PDF. Solo se permiten archivos PDF.`;
    }

    // Verificar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" es demasiado grande. Máximo: ${formatBytes(MAX_FILE_SIZE)}`;
    }

    return null;
  };

  const agregarArchivos = (files: FileList) => {
    setError('');
    const nuevosArchivos: ArchivoSeleccionado[] = [];

    Array.from(files).forEach((file) => {
      const validacionError = validarArchivo(file);

      if (validacionError) {
        setError(validacionError);
        return;
      }

      // No agregar duplicados
      if (archivosSeleccionados.some((a) => a.file.name === file.name)) {
        setError(`"${file.name}" ya ha sido agregado.`);
        return;
      }

      nuevosArchivos.push({
        file,
        nombre: file.name,
        tamaño: file.size,
      });
    });

    if (nuevosArchivos.length > 0) {
      const todosLosArchivos = [...archivosSeleccionados, ...nuevosArchivos];
      setArchivosSeleccionados(todosLosArchivos);

      // Actualizar form data
      setData('archivos', todosLosArchivos.map((a) => a.file));
    }
  };

  const eliminarArchivo = (index: number) => {
    const nuevosArchivos = archivosSeleccionados.filter((_, i) => i !== index);
    setArchivosSeleccionados(nuevosArchivos);
    setData('archivos', nuevosArchivos.map((a) => a.file));
    setError('');
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      agregarArchivos(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (archivosSeleccionados.length === 0) {
      toast.error('Debes agregar al menos un archivo PDF.');
      return;
    }

    // Crear FormData para envío de archivos
    const formData = new FormData();
    formData.append('comentarios', data.comentarios);

    // Agregar cada archivo
    data.archivos.forEach((file) => {
      formData.append('archivos[]', file);
    });

    // Mostrar toast de carga
    const loadingToastId = toast.loading('Entregando tu trabajo...');

    // Usar router.post con FormData
    router.post(`/tareas/${tareaId}/entregar`, formData, {
      onSuccess: () => {
        toast.dismiss(loadingToastId);
        toast.success('¡Trabajo entregado exitosamente!');

        setArchivosSeleccionados([]);
        setData('comentarios', '');
        setError('');

        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.reload();
          }
        }, 1500);
      },
      onError: (errors: any) => {
        toast.dismiss(loadingToastId);
        console.error('Errores:', errors);
        const errorMessage = errors.error || errors.message || 'Error al entregar la tarea';
        toast.error(errorMessage);
        setError(errorMessage);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudUpload className="h-5 w-5" />
          Entregar Tarea
        </CardTitle>
        <CardDescription>
          Sube tus archivos PDF y escribe tus comentarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mensajes de error - del cliente y del servidor */}
          {(error || errors.error) && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error || errors.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Área de carga de archivos */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,application/pdf"
              onChange={(e) => {
                if (e.target.files) {
                  agregarArchivos(e.target.files);
                }
              }}
              className="hidden"
              disabled={processing}
            />

            <CloudUpload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="font-medium text-gray-700">Arrastra archivos aquí o haz clic</p>
            <p className="text-sm text-gray-500">
              Solo se permiten archivos PDF (máximo {formatBytes(MAX_FILE_SIZE)})
            </p>
          </div>

          {/* Lista de archivos agregados */}
          {archivosSeleccionados.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Archivos a entregar:</p>
              <div className="space-y-2">
                {archivosSeleccionados.map((archivo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <File className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">{archivo.nombre}</p>
                        <p className="text-xs text-green-700">{formatBytes(archivo.tamaño)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarArchivo(index)}
                      disabled={processing}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <Badge className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {archivosSeleccionados.length} archivo(s) listo(s)
              </Badge>
            </div>
          )}

          {/* Comentarios */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Comentarios (opcional)
            </label>
            <Textarea
              placeholder="Escribe aquí cualquier comentario o nota sobre tu entrega..."
              value={data.comentarios}
              onChange={(e) => setData('comentarios', e.target.value)}
              disabled={processing}
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Ej: "Tuve problemas con la sección 3, revisar comentarios en el documento"
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setArchivosSeleccionados([]);
                setData('comentarios', '');
                setError('');
              }}
              disabled={processing}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              disabled={processing || archivosSeleccionados.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {processing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Entregando...
                </>
              ) : (
                <>
                  <CloudUpload className="h-4 w-4 mr-2" />
                  Entregar Ahora
                </>
              )}
            </Button>
          </div>

          {/* Información de ayuda */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 text-sm">
              ✓ Solo se aceptan archivos PDF • ✓ Máximo 10 MB por archivo •
              ✓ Puedes actualizar tu entrega antes de la fecha límite
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
    </Card>
  );
}
