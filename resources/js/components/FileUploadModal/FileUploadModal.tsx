/**
 * Componente FileUploadModal
 * Modal completo para carga de archivos con validación
 * Reutilizable en toda la aplicación
 */

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileInputArea } from './FileInputArea';
import { FileList } from './FileList';
import { useFileUpload } from './useFileUpload';
import type { FileUploadModalProps } from './types';

/**
 * Modal para carga de archivos
 *
 * @example
 * const [open, setOpen] = useState(false);
 *
 * <FileUploadModal
 *   open={open}
 *   onOpenChange={setOpen}
 *   maxFiles={5}
 *   maxFileSize={50 * 1024 * 1024}
 *   acceptedFileTypes={['application/pdf', 'image/*']}
 *   onSubmit={(files) => {
 *     // Maneja los archivos
 *     
 *     setOpen(false);
 *   }}
 *   title="Subir Trabajo"
 *   description="Selecciona los archivos para entregar"
 *   submitButtonText="Entregar"
 * />
 */
export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onError,
  maxFiles = 5,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  acceptedFileTypes,
  title = 'Subir Archivos',
  description = 'Selecciona los archivos que deseas cargar',
  submitButtonText = 'Subir Archivos',
  isLoading = false,
}) => {
  // Estado del upload
  const fileUpload = useFileUpload({
    maxFiles,
    maxFileSize,
    acceptedFileTypes,
  });

  // Limpia los archivos cuando el modal se cierra
  useEffect(() => {
    if (!open) {
      fileUpload.clearFiles();
    }
  }, [open]);

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida los archivos
    if (!fileUpload.validate()) {
      if (onError) {
        onError('Por favor corrige los errores en los archivos');
      }
      return;
    }

    try {
      // Llama al callback con los archivos
      await onSubmit(fileUpload.selectedFiles);

      // Limpia el estado y cierra el modal
      fileUpload.clearFiles();
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al procesar los archivos';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Área de selección de archivos */}
          <FileInputArea
            onFileSelected={fileUpload.addFiles}
            acceptedFileTypes={acceptedFileTypes}
            maxFileSize={maxFileSize}
            maxFiles={maxFiles}
            disabled={isLoading}
            isLoading={isLoading}
          />

          {/* Lista de archivos seleccionados */}
          <FileList
            files={fileUpload.selectedFiles}
            errors={fileUpload.errors}
            onRemoveFile={fileUpload.removeFile}
            disabled={isLoading}
          />

          {/* Alerta general de error */}
          {fileUpload.errors.length > 0 && fileUpload.selectedFiles.length === 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Debes seleccionar al menos un archivo válido para continuar
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de acción */}
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                fileUpload.selectedFiles.length === 0 ||
                fileUpload.errors.length > 0
              }
            >
              {isLoading ? 'Cargando...' : submitButtonText}
            </Button>
          </DialogFooter>
        </form>

        {/* Información de ayuda */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Los archivos se enviarán inmediatamente después de hacer clic en
            &quot;{submitButtonText}&quot;
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
