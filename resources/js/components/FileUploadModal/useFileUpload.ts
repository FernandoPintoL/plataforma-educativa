/**
 * Hook personalizado para manejar lógica de carga de archivos
 * Gestiona selección, validación, y estado de archivos
 */

import { useState, useCallback } from 'react';
import type {
  UseFileUploadOptions,
  UseFileUploadState,
  ValidationError,
} from './types';
import {
  validateFiles,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
} from './fileValidators';

/**
 * Hook useFileUpload
 * Proporciona toda la lógica para manejar carga de archivos con validación
 *
 * @param options Opciones de configuración (maxFiles, maxFileSize, acceptedFileTypes)
 * @returns Estado y métodos para manejar archivos
 *
 * @example
 * const { selectedFiles, errors, isValid, addFiles, removeFile } = useFileUpload({
 *   maxFiles: 5,
 *   maxFileSize: 50 * 1024 * 1024,
 *   acceptedFileTypes: ['application/pdf', 'image/*']
 * });
 */
export function useFileUpload(
  options?: UseFileUploadOptions
): UseFileUploadState {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Configuración con defaults
  const maxFiles = options?.maxFiles ?? DEFAULT_MAX_FILES;
  const maxFileSize = options?.maxFileSize ?? DEFAULT_MAX_FILE_SIZE;
  const acceptedFileTypes = options?.acceptedFileTypes;

  /**
   * Agrega archivos a la selección
   * Valida antes de agregar
   */
  const addFiles = useCallback(
    (newFiles: File[]) => {
      // Combina los archivos nuevos con los existentes
      const allFiles = [...selectedFiles, ...newFiles];

      // Valida todos los archivos
      const validationErrors = validateFiles(allFiles, {
        acceptedFileTypes,
        maxSize: maxFileSize,
        maxFiles,
      });

      // Actualiza errores
      const errorMessages = validationErrors.map((e) => e.message);
      setErrors(errorMessages);

      // Si no hay errores, actualiza el estado
      if (errorMessages.length === 0) {
        setSelectedFiles(allFiles);
      } else {
        // Si hay errores, mantiene los archivos previos (no agrega los nuevos)
        setSelectedFiles(selectedFiles);
      }
    },
    [selectedFiles, maxFiles, maxFileSize, acceptedFileTypes]
  );

  /**
   * Remueve un archivo por índice
   */
  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      // Limpia errores cuando el usuario remueve archivos
      setErrors([]);
      return newFiles;
    });
  }, []);

  /**
   * Limpia todos los archivos seleccionados y errores
   */
  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setErrors([]);
  }, []);

  /**
   * Valida los archivos actuales
   * Retorna true si todos son válidos
   */
  const validate = useCallback((): boolean => {
    if (selectedFiles.length === 0) {
      setErrors(['Debes seleccionar al menos un archivo']);
      return false;
    }

    const validationErrors = validateFiles(selectedFiles, {
      acceptedFileTypes,
      maxSize: maxFileSize,
      maxFiles,
    });

    const errorMessages = validationErrors.map((e) => e.message);
    setErrors(errorMessages);

    return errorMessages.length === 0;
  }, [selectedFiles, maxFiles, maxFileSize, acceptedFileTypes]);

  /**
   * Determina si todos los archivos son válidos
   */
  const isValid = errors.length === 0 && selectedFiles.length > 0;

  return {
    selectedFiles,
    errors,
    isValid,
    addFiles,
    removeFile,
    clearFiles,
    validate,
  };
}

/**
 * Hook para manejar la selección de archivos desde un input
 * Útil para integrar con <input type="file">
 *
 * @param onFilesSelected Callback cuando se seleccionan archivos
 * @returns Handler para el evento onChange del input
 *
 * @example
 * const handleFileInputChange = useFileInputHandler((files) => {
 *   fileUploadState.addFiles(files);
 * });
 *
 * <input
 *   type="file"
 *   multiple
 *   onChange={handleFileInputChange}
 * />
 */
export function useFileInputHandler(
  onFilesSelected: (files: File[]) => void
) {
  return useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesSelected(files);
      // Limpia el input para permitir seleccionar los mismos archivos otra vez
      e.target.value = '';
    }
  }, [onFilesSelected]);
}

/**
 * Hook para manejar drag and drop de archivos
 * Retorna handlers para los eventos drag/drop
 *
 * @param onFilesDrop Callback cuando se sueltan archivos
 * @returns Objeto con handlers para ondragover, ondragleave, ondrop
 *
 * @example
 * const dragDropHandlers = useFileDragDrop((files) => {
 *   fileUploadState.addFiles(files);
 * });
 *
 * <div {...dragDropHandlers} className="drop-zone">
 *   Drop files here
 * </div>
 */
export function useFileDragDrop(onFilesDrop: (files: File[]) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files) {
        const files = Array.from(e.dataTransfer.files);
        onFilesDrop(files);
      }
    },
    [onFilesDrop]
  );

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
