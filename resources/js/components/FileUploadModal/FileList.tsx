/**
 * Componente FileList
 * Muestra lista de archivos seleccionados con opción de remover
 */

import React from 'react';
import { X, FileIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { formatBytes } from './fileValidators';

interface FileListProps {
  files: File[];
  errors?: string[];
  onRemoveFile: (index: number) => void;
  disabled?: boolean;
}

/**
 * Obtiene el icono según el tipo de archivo
 */
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  // Mapeo de extensiones a clases de color
  const colorMap: Record<string, string> = {
    pdf: 'text-red-600 dark:text-red-400',
    doc: 'text-blue-600 dark:text-blue-400',
    docx: 'text-blue-600 dark:text-blue-400',
    xls: 'text-green-600 dark:text-green-400',
    xlsx: 'text-green-600 dark:text-green-400',
    ppt: 'text-orange-600 dark:text-orange-400',
    pptx: 'text-orange-600 dark:text-orange-400',
    txt: 'text-gray-600 dark:text-gray-400',
    jpg: 'text-purple-600 dark:text-purple-400',
    jpeg: 'text-purple-600 dark:text-purple-400',
    png: 'text-purple-600 dark:text-purple-400',
    gif: 'text-purple-600 dark:text-purple-400',
    webp: 'text-purple-600 dark:text-purple-400',
    mp4: 'text-pink-600 dark:text-pink-400',
    avi: 'text-pink-600 dark:text-pink-400',
    mp3: 'text-indigo-600 dark:text-indigo-400',
    wav: 'text-indigo-600 dark:text-indigo-400',
    zip: 'text-yellow-600 dark:text-yellow-400',
    rar: 'text-yellow-600 dark:text-yellow-400',
  };

  return colorMap[extension || ''] || 'text-gray-600 dark:text-gray-400';
};

/**
 * Lista de archivos seleccionados
 * Muestra nombre, tamaño y botón para remover
 * También muestra errores de validación si los hay
 */
export const FileList: React.FC<FileListProps> = ({
  files,
  errors = [],
  onRemoveFile,
  disabled = false,
}) => {
  if (files.length === 0 && errors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Encabezado */}
      {files.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <label className="text-sm font-semibold">
              Archivos seleccionados ({files.length})
            </label>
          </div>
        </div>
      )}

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border transition-colors',
                'bg-muted/50 border-muted-foreground/20',
                'hover:bg-muted hover:border-muted-foreground/40',
                'dark:bg-muted/30 dark:hover:bg-muted/50'
              )}
            >
              {/* Información del archivo */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Icono */}
                <div className="flex-shrink-0">
                  <FileIcon
                    className={cn('h-4 w-4', getFileIcon(file.name))}
                  />
                </div>

                {/* Nombre y tamaño */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              {/* Botón para remover */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                disabled={disabled}
                className="flex-shrink-0 ml-2"
                aria-label={`Remover ${file.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Errores de validación */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">Errores en los archivos:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Resumen cuando hay archivos */}
      {files.length > 0 && errors.length === 0 && (
        <div className="flex items-center justify-between p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-700 dark:text-green-400 font-medium">
            ✓ Todos los archivos son válidos
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            Tamaño total: <strong>{formatBytes(
              files.reduce((sum, f) => sum + f.size, 0)
            )}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default FileList;
