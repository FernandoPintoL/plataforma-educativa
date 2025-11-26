/**
 * HTTP Interceptor con Logging
 *
 * Captura todas las peticiones HTTP (GET, POST, PUT, DELETE, etc.)
 * y registra método, URL, datos, respuesta y duración
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import logger from './logger'

interface RequestMetadata {
    startTime: number
    method: string
    url: string
}

// Almacenar metadatos de peticiones
const requestMetadata = new Map<string, RequestMetadata>()

/**
 * Interceptor de Petición
 */
export function setupRequestInterceptor(axiosInstance: any) {
    axiosInstance.interceptors.request.use(
        (config: AxiosRequestConfig) => {
            const requestId = `${config.method?.toUpperCase()}-${config.url}-${Date.now()}`

            // Almacenar metadatos
            requestMetadata.set(requestId, {
                startTime: Date.now(),
                method: config.method?.toUpperCase() || 'GET',
                url: config.url || '',
            })

            // Log de petición
            logger.logRequest(
                config.method?.toUpperCase() || 'GET',
                config.url || '',
                config.data || config.params
            )

            // Agregar header con ID de petición para debugging
            if (!config.headers) {
                config.headers = {}
            }
            config.headers['X-Request-ID'] = requestId

            return config
        },
        (error: AxiosError) => {
            logger.logError('HTTP_REQUEST', 'Error al preparar petición', error)
            return Promise.reject(error)
        }
    )
}

/**
 * Interceptor de Respuesta
 */
export function setupResponseInterceptor(axiosInstance: any) {
    axiosInstance.interceptors.response.use(
        (response: AxiosResponse) => {
            const requestId = response.config.headers?.['X-Request-ID'] as string
            const metadata = requestMetadata.get(requestId)
            const duration = metadata ? Date.now() - metadata.startTime : undefined

            // Log de respuesta exitosa
            logger.logResponse(
                metadata?.method || 'GET',
                metadata?.url || response.config.url || '',
                response.status,
                response.data,
                duration
            )

            // Log de performance si es lenta
            if (duration && duration > 1000) {
                logger.logPerformance('HTTP', `${metadata?.method} request`, duration)
            }

            // Limpiar metadatos
            if (requestId) {
                requestMetadata.delete(requestId)
            }

            return response
        },
        (error: AxiosError) => {
            const requestId = error.config?.headers?.['X-Request-ID'] as string
            const metadata = requestMetadata.get(requestId)
            const duration = metadata ? Date.now() - metadata.startTime : undefined

            // Log de error
            const status = error.response?.status || 'N/A'
            const statusText = error.response?.statusText || 'Error desconocido'

            logger.logError(
                'HTTP_ERROR',
                `${metadata?.method || 'REQUEST'} ${metadata?.url || ''} - ${status} ${statusText}`,
                {
                    status,
                    statusText,
                    data: error.response?.data,
                    duration,
                }
            )

            // Log de performance si es lenta
            if (duration && duration > 1000) {
                logger.logPerformance('HTTP', `${metadata?.method} request (FAILED)`, duration)
            }

            // Limpiar metadatos
            if (requestId) {
                requestMetadata.delete(requestId)
            }

            return Promise.reject(error)
        }
    )
}

/**
 * Configurar todos los interceptores
 */
export function setupHttpInterceptors(axiosInstance: any) {
    setupRequestInterceptor(axiosInstance)
    setupResponseInterceptor(axiosInstance)

    logger.logSuccess('HTTP_INTERCEPTOR', 'Interceptores HTTP configurados')
}

export default { setupHttpInterceptors, setupRequestInterceptor, setupResponseInterceptor }
