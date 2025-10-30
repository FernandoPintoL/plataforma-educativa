/**
 * Archivo de exportación para FileUploadModal
 * Facilita la importación de componentes, hooks y utilidades
 */

// Componentes
export { FileUploadModal } from './FileUploadModal';
export { FileInputArea } from './FileInputArea';
export { FileList } from './FileList';

// Hooks
export {
  useFileUpload,
  useFileInputHandler,
  useFileDragDrop,
} from './useFileUpload';

// Validadores y utilidades
export {
  validateFile,
  validateFiles,
  validateFileType,
  validateFileSize,
  formatBytes,
  getFileExtension,
  getMimeTypeFromExtension,
  mimeTypeMatches,
  getAcceptedTypesDescription,
  generateAcceptAttribute,
  DEFAULT_MAX_FILE_SIZE,
  DEFAULT_MAX_FILES,
  COMMON_MIME_TYPES,
} from './fileValidators';

// Tipos
export type {
  FileUploadModalProps,
  UseFileUploadOptions,
  UseFileUploadState,
  FileValidationResult,
  ValidationError,
} from './types';
