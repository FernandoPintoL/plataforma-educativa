/**
 * Interfaces y tipos para FileUploadModal
 * Compartidos entre componentes del modal de carga de archivos
 */

/**
 * Props del componente FileUploadModal
 */
export interface FileUploadModalProps {
  // Estados
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Callbacks
  onSubmit: (files: File[]) => void;
  onError?: (error: string) => void;

  // Configuración de archivos
  maxFiles?: number;
  maxFileSize?: number; // en bytes
  acceptedFileTypes?: string[]; // MIME types o extensiones (ej: ['.pdf', 'image/*'])

  // Configuración visual
  title?: string;
  description?: string;
  submitButtonText?: string;

  // Estados de carga
  isLoading?: boolean;
}

/**
 * Props del hook useFileUpload
 */
export interface UseFileUploadOptions {
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
}

/**
 * Estado retornado por useFileUpload
 */
export interface UseFileUploadState {
  selectedFiles: File[];
  errors: string[];
  isValid: boolean;
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  validate: () => boolean;
}

/**
 * Resultado de validación de archivo individual
 */
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Error de validación específico
 */
export interface ValidationError {
  type: 'size' | 'type' | 'quantity' | 'other';
  message: string;
  fileIndex?: number;
}
