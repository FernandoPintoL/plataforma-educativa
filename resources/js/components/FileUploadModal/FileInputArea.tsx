/**
 * Componente FileInputArea
 * Área de selección de archivos con soporte para drag-drop
 */

import React, { useRef } from 'react';
import { Upload, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useFileInputHandler,
  useFileDragDrop,
} from './useFileUpload';
import {
  formatBytes,
  getAcceptedTypesDescription,
  generateAcceptAttribute,
} from './fileValidators';

interface FileInputAreaProps {
  onFileSelected: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  isLoading?: boolean;
}

/**
 * Área de selección de archivos
 * Soporta:
 * - Click para seleccionar archivo
 * - Drag and drop
 * - Múltiples archivos
 * - Información sobre tipos y tamaño permitido
 */
export const FileInputArea: React.FC<FileInputAreaProps> = ({
  onFileSelected,
  acceptedFileTypes,
  maxFileSize,
  maxFiles = 5,
  disabled = false,
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handler para selección de archivo
  const handleFileInputChange = useFileInputHandler(onFileSelected);

  // Handler para drag and drop
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useFileDragDrop(onFileSelected);

  // Handler personalizado para drop que combina con el handler del hook
  const handleDropWrapper = (e: React.DragEvent<HTMLDivElement>) => {
    handleDrop(e);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      onFileSelected(files);
    }
  };

  // Click en el área abre el input de archivo
  const handleAreaClick = () => {
    if (!disabled && !isLoading) {
      inputRef.current?.click();
    }
  };

  // Información sobre tipos aceptados
  const acceptedTypesDescription =
    getAcceptedTypesDescription(acceptedFileTypes);
  const maxSizeDescription = maxFileSize
    ? `Máximo ${formatBytes(maxFileSize)}`
    : 'Sin límite de tamaño';

  // Atributo accept para el input
  const acceptAttribute = generateAcceptAttribute(acceptedFileTypes);

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 border-dashed transition-all duration-200',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50',
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropWrapper}
      onClick={handleAreaClick}
      role="button"
      tabIndex={disabled || isLoading ? -1 : 0}
      onKeyDown={(e) => {
        if (
          (e.key === 'Enter' || e.key === ' ') &&
          !disabled &&
          !isLoading
        ) {
          e.preventDefault();
          handleAreaClick();
        }
      }}
      aria-label="Área de carga de archivos"
      aria-disabled={disabled || isLoading}
    >
      {/* Input file oculto */}
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        accept={acceptAttribute}
        disabled={disabled || isLoading}
        className="hidden"
        aria-hidden="true"
      />

      {/* Contenido del área */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center gap-3">
        {/* Icono */}
        <div
          className={cn(
            'rounded-full p-3 transition-all duration-200',
            isDragging
              ? 'bg-primary/20 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {isDragging ? (
            <Cloud className="h-8 w-8" />
          ) : (
            <Upload className="h-8 w-8" />
          )}
        </div>

        {/* Texto principal */}
        <div>
          <p className="text-lg font-semibold text-foreground">
            {isDragging
              ? 'Suelta los archivos aquí'
              : 'Arrastra archivos aquí o haz clic para seleccionar'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? (
              'Cargando archivos...'
            ) : (
              <>
                Puedes seleccionar hasta{' '}
                <strong>
                  {maxFiles} archivo{maxFiles > 1 ? 's' : ''}
                </strong>
              </>
            )}
          </p>
        </div>

        {/* Información sobre restricciones */}
        <div className="flex flex-col sm:flex-row gap-2 text-xs text-muted-foreground justify-center flex-wrap">
          <span className="inline-flex items-center gap-1">
            📁 Tipos: <strong>{acceptedTypesDescription}</strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1">
            💾 {maxSizeDescription}
          </span>
        </div>

        {/* Hint para accesibilidad */}
        {!disabled && !isLoading && (
          <div className="text-xs text-muted-foreground/60 mt-2">
            Presiona Enter o Espacio para seleccionar archivos
          </div>
        )}
      </div>

      {/* Indicador de estado cargando */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Cargando...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInputArea;
