/**
 * Servicio para análisis de IA de documentos PDF
 * Se comunica con el gateway microservice
 */

interface AnalisisResponse {
  success: boolean;
  porcentaje_ia: number;
  detalles: {
    total_palabras: number;
    porcentaje_por_seccion?: Record<string, number>;
    confianza: number;
    [key: string]: any;
  };
  mensaje?: string;
  error?: string;
}

interface GatewayUploadResponse {
  documento_id: number;
  proyecto_id: number;
  nombre_archivo: string;
  storage_key: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  score_plagio: number | null;
  cluster_id: number | null;
  page_count: number | null;
  word_count: number | null;
  line_count: number | null;
  char_count: number | null;
  analysis_duration_ms: number | null;
}

interface UploadProgress {
  cargado: number;
  total: number;
  porcentaje: number;
}

export class AnalisisIAService {
  // URL del gateway - se carga desde .env (VITE_GATEWAY_IA_URL)
  private static readonly GATEWAY_URL =
    import.meta.env.VITE_GATEWAY_IA_URL ||
    'https://gateway-microservice-d5ccehh0ajaqgcd0.canadacentral-01.azurewebsites.net/upload-documento';

  /**
   * Verificar si el gateway está disponible
   */
  static async verificarGateway(): Promise<boolean> {
    try {
      const response = await fetch(this.GATEWAY_URL, {
        method: 'OPTIONS',
        headers: {
          'Accept': '*/*',
        },
      });
      console.log('✅ Gateway disponible (status:', response.status, ')');
      return true;
    } catch (error) {
      console.error('❌ Gateway NO disponible:', error);
      return false;
    }
  }

  /**
   * Subir PDF y analizar con IA
   * @param archivo Archivo PDF a analizar
   * @param onProgress Callback para reportar progreso
   * @returns Promesa con resultado del análisis
   */
  static async analizarPDF(
    archivo: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<AnalisisResponse> {
    return new Promise((resolve, reject) => {
      // Validar que sea PDF
      if (archivo.type !== 'application/pdf') {
        reject(new Error('El archivo debe ser un PDF'));
        return;
      }

      // Validar tamaño (máximo 50MB)
      const MAX_SIZE = 50 * 1024 * 1024;
      if (archivo.size > MAX_SIZE) {
        reject(new Error('El archivo es demasiado grande (máximo 50MB)'));
        return;
      }

      const formData = new FormData();
      formData.append('proyecto_id', '19');
      formData.append('documento', archivo);

      // Logging detallado - mostrar exactamente qué se envía
      console.log('📤 [Análisis IA] Enviando a gateway:');
      console.log('   URL:', this.GATEWAY_URL);
      console.log('   FormData campos:');
      console.log('      - proyecto_id: "19"');
      console.log('      - documento:', archivo.name, `(${(archivo.size / 1024 / 1024).toFixed(2)}MB)`);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', this.GATEWAY_URL, true);

      // Manejar progreso de carga
      if (xhr.upload && onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const porcentaje = Math.round((event.loaded / event.total) * 100);
            onProgress({
              cargado: event.loaded,
              total: event.total,
              porcentaje,
            });
          }
        });
      }

      // Manejar respuesta
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const respuesta: GatewayUploadResponse = xhr.responseText
              ? JSON.parse(xhr.responseText)
              : null;

            console.log('📥 [Análisis IA] Respuesta del gateway (HTTP ' + xhr.status + '):');
            console.log(respuesta);

            if (respuesta && respuesta.documento_id) {
              // El gateway devolvió un registro de documento
              console.log(`✅ [Análisis IA] Documento registrado`, {
                documento_id: respuesta.documento_id,
                nombre: respuesta.nombre_archivo,
                estado: respuesta.estado,
              });

              if (respuesta.estado === 'PENDIENTE') {
                console.log(`⏳ [Análisis IA] Esperando análisis en el servidor...`);
                resolve({
                  success: true,
                  porcentaje_ia: respuesta.score_plagio ?? 0,
                  detalles: {
                    total_palabras: respuesta.word_count ?? 0,
                    confianza: 0,
                    documento_id: respuesta.documento_id,
                    storage_key: respuesta.storage_key,
                    estado: respuesta.estado,
                    mensaje_estado: 'Análisis en progreso. Los resultados estarán disponibles pronto.',
                  },
                });
              } else if (respuesta.score_plagio !== null) {
                // Análisis completado
                console.log(`✅ [Análisis IA] Análisis completado`, {
                  porcentaje_plagio: respuesta.score_plagio,
                  palabras: respuesta.word_count,
                });
                resolve({
                  success: true,
                  porcentaje_ia: respuesta.score_plagio,
                  detalles: {
                    total_palabras: respuesta.word_count ?? 0,
                    confianza: 0,
                    documento_id: respuesta.documento_id,
                    storage_key: respuesta.storage_key,
                    estado: respuesta.estado,
                  },
                });
              } else {
                // Documento registrado pero análisis aún no disponible
                console.log(`⏳ [Análisis IA] Documento registrado, análisis pendiente...`);
                resolve({
                  success: true,
                  porcentaje_ia: 0,
                  detalles: {
                    total_palabras: respuesta.word_count ?? 0,
                    confianza: 0,
                    documento_id: respuesta.documento_id,
                    storage_key: respuesta.storage_key,
                    estado: respuesta.estado,
                    mensaje_estado: 'Documento registrado. El análisis se procesará en el servidor.',
                  },
                });
              }
            } else {
              reject(new Error('Respuesta inválida del gateway'));
            }
          } catch (error) {
            console.error('❌ [Análisis IA] Error parseando respuesta:', error);
            reject(new Error('Error al procesar respuesta del servidor'));
          }
        } else {
          console.error('❌ [Análisis IA] Error del servidor:', {
            status: xhr.status,
            statusText: xhr.statusText,
          });
          reject(
            new Error(
              `Error del servidor (${xhr.status}): ${xhr.statusText}`
            )
          );
        }
      });

      // Manejar errores
      xhr.addEventListener('error', () => {
        reject(new Error('Error de conexión al gateway'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Análisis cancelado'));
      });

      xhr.send(formData);
    });
  }

  /**
   * Obtener descripción del porcentaje de IA
   */
  static getDescripcion(porcentaje: number): {
    texto: string;
    color: string;
    bg: string;
    icon: string;
  } {
    if (porcentaje >= 80) {
      return {
        texto: 'Muy probable que sea generado por IA',
        color: 'text-red-700',
        bg: 'bg-red-50 border-red-300',
        icon: '🚨',
      };
    } else if (porcentaje >= 50) {
      return {
        texto: 'Probable contenido generado por IA',
        color: 'text-orange-700',
        bg: 'bg-orange-50 border-orange-300',
        icon: '⚠️',
      };
    } else if (porcentaje >= 20) {
      return {
        texto: 'Posible contenido generado por IA',
        color: 'text-yellow-700',
        bg: 'bg-yellow-50 border-yellow-300',
        icon: '⚡',
      };
    } else {
      return {
        texto: 'Contenido aparentemente original',
        color: 'text-green-700',
        bg: 'bg-green-50 border-green-300',
        icon: '✓',
      };
    }
  }
}

export type { AnalisisResponse, UploadProgress, GatewayUploadResponse };
