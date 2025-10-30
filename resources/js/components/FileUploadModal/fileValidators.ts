/**
 * Funciones de validación para archivos
 * Validaciones de tipo MIME, tamaño, cantidad, etc.
 */

import type { FileValidationResult, ValidationError } from './types';

/**
 * Valor por defecto de tamaño máximo: 50MB
 */
export const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en bytes

/**
 * Valor por defecto de máximo de archivos
 */
export const DEFAULT_MAX_FILES = 5;

/**
 * Tipos MIME comunes permitidos
 */
export const COMMON_MIME_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  image_jpeg: 'image/jpeg',
  image_png: 'image/png',
  image_gif: 'image/gif',
  image_webp: 'image/webp',
  video_mp4: 'video/mp4',
  video_avi: 'video/x-msvideo',
  audio_mp3: 'audio/mpeg',
  audio_wav: 'audio/wav',
};

/**
 * Mapeo de extensiones a MIME types
 */
const EXTENSION_TO_MIME: Record<string, string> = {
  '.pdf': COMMON_MIME_TYPES.pdf,
  '.doc': COMMON_MIME_TYPES.doc,
  '.docx': COMMON_MIME_TYPES.docx,
  '.xls': COMMON_MIME_TYPES.xls,
  '.xlsx': COMMON_MIME_TYPES.xlsx,
  '.ppt': COMMON_MIME_TYPES.ppt,
  '.pptx': COMMON_MIME_TYPES.pptx,
  '.txt': COMMON_MIME_TYPES.txt,
  '.zip': COMMON_MIME_TYPES.zip,
  '.rar': COMMON_MIME_TYPES.rar,
  '.jpg': COMMON_MIME_TYPES.image_jpeg,
  '.jpeg': COMMON_MIME_TYPES.image_jpeg,
  '.png': COMMON_MIME_TYPES.image_png,
  '.gif': COMMON_MIME_TYPES.image_gif,
  '.webp': COMMON_MIME_TYPES.image_webp,
  '.mp4': COMMON_MIME_TYPES.video_mp4,
  '.avi': COMMON_MIME_TYPES.video_avi,
  '.mp3': COMMON_MIME_TYPES.audio_mp3,
  '.wav': COMMON_MIME_TYPES.audio_wav,
};

/**
 * Obtiene la extensión de un nombre de archivo
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.substring(lastDot).toLowerCase();
}

/**
 * Obtiene el MIME type de una extensión
 */
export function getMimeTypeFromExtension(extension: string): string | undefined {
  return EXTENSION_TO_MIME[extension.toLowerCase()];
}

/**
 * Verifica si un MIME type coincide con un patrón
 * Soporta patrones como "image/*", "video/*", "application/pdf"
 */
export function mimeTypeMatches(mimeType: string, pattern: string): boolean {
  if (pattern === '*/*') return true;

  // Exacta
  if (mimeType === pattern) return true;

  // Wildcard (ej: image/*)
  if (pattern.endsWith('/*')) {
    const baseType = pattern.replace('/*', '');
    return mimeType.startsWith(baseType + '/');
  }

  return false;
}

/**
 * Valida el tipo MIME de un archivo
 * @param file Archivo a validar
 * @param acceptedTypes Array de tipos MIME aceptados (ej: ['application/pdf', 'image/*'])
 * @returns Resultado de validación
 */
export function validateFileType(
  file: File,
  acceptedTypes?: string[]
): FileValidationResult {
  // Si no hay tipos restrictos, todo está permitido
  if (!acceptedTypes || acceptedTypes.length === 0) {
    return { isValid: true };
  }

  const fileMime = file.type;
  const fileExtension = getFileExtension(file.name);
  const mimeFromExtension = getMimeTypeFromExtension(fileExtension);

  // Busca coincidencias en los tipos aceptados
  for (const acceptedType of acceptedTypes) {
    // Si es una extensión (ej: .pdf)
    if (acceptedType.startsWith('.')) {
      if (fileExtension.toLowerCase() === acceptedType.toLowerCase()) {
        return { isValid: true };
      }
    } else {
      // Es un MIME type
      // Intenta con MIME type del archivo
      if (fileMime && mimeTypeMatches(fileMime, acceptedType)) {
        return { isValid: true };
      }
      // Intenta con MIME type deducido de la extensión
      if (mimeFromExtension && mimeTypeMatches(mimeFromExtension, acceptedType)) {
        return { isValid: true };
      }
    }
  }

  const typesList = acceptedTypes.join(', ');
  return {
    isValid: false,
    error: `El tipo de archivo "${file.name}" no está permitido. Tipos aceptados: ${typesList}`,
  };
}

/**
 * Valida el tamaño de un archivo
 * @param file Archivo a validar
 * @param maxSize Tamaño máximo en bytes
 * @returns Resultado de validación
 */
export function validateFileSize(
  file: File,
  maxSize?: number
): FileValidationResult {
  if (!maxSize) {
    return { isValid: true };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `El archivo "${file.name}" excede el tamaño máximo permitido de ${maxSizeMB} MB (pesa ${fileSizeMB} MB)`,
    };
  }

  return { isValid: true };
}

/**
 * Valida un archivo individual
 * Chequea tipo, tamaño y otros
 */
export function validateFile(
  file: File,
  options?: {
    acceptedTypes?: string[];
    maxSize?: number;
  }
): FileValidationResult {
  // Validar tipo
  const typeValidation = validateFileType(file, options?.acceptedTypes);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Validar tamaño
  const sizeValidation = validateFileSize(file, options?.maxSize);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return { isValid: true };
}

/**
 * Valida múltiples archivos
 * Retorna todos los errores encontrados
 */
export function validateFiles(
  files: File[],
  options?: {
    acceptedTypes?: string[];
    maxSize?: number;
    maxFiles?: number;
  }
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validar cantidad máxima
  if (options?.maxFiles && files.length > options.maxFiles) {
    errors.push({
      type: 'quantity',
      message: `Has seleccionado ${files.length} archivos pero el máximo permitido es ${options.maxFiles}`,
    });
  }

  // Validar cada archivo
  files.forEach((file, index) => {
    const result = validateFile(file, {
      acceptedTypes: options?.acceptedTypes,
      maxSize: options?.maxSize,
    });

    if (!result.isValid && result.error) {
      errors.push({
        type: result.error.includes('tipo') ? 'type' : 'size',
        message: result.error,
        fileIndex: index,
      });
    }
  });

  return errors;
}

/**
 * Formatea el tamaño de archivo en unidades legibles
 * @param bytes Tamaño en bytes
 * @returns String formateado (ej: "2.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Obtiene una descripción legible de los tipos aceptados
 * @param types Array de tipos aceptados
 * @returns String formateado (ej: "PDF, Imágenes, Videos")
 */
export function getAcceptedTypesDescription(types?: string[]): string {
  if (!types || types.length === 0) return 'Todos los tipos de archivo';

  const descriptions: string[] = [];

  for (const type of types) {
    if (type === '*/*') return 'Todos los tipos de archivo';
    if (type === 'image/*') descriptions.push('Imágenes');
    else if (type === 'video/*') descriptions.push('Videos');
    else if (type === 'audio/*') descriptions.push('Audios');
    else if (type === 'application/pdf') descriptions.push('PDF');
    else if (type.endsWith('/*')) {
      const baseType = type.replace('/*', '');
      descriptions.push(baseType.charAt(0).toUpperCase() + baseType.slice(1));
    } else {
      descriptions.push(type);
    }
  }

  return descriptions.join(', ');
}

/**
 * Genera una cadena accept para el atributo accept de input file
 * @param types Array de tipos aceptados
 * @returns String para usar en accept="" (ej: "image/*,.pdf")
 */
export function generateAcceptAttribute(types?: string[]): string {
  if (!types || types.length === 0) return '';

  return types
    .map((type) => {
      if (type.startsWith('.')) return type;
      return type;
    })
    .join(',');
}
