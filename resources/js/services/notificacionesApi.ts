/**
 * API Service para Notificaciones en Tiempo Real
 *
 * Proporciona métodos para:
 * - Obtener notificaciones
 * - Conectar al stream SSE
 * - Marcar como leído/no leído
 * - Obtener estadísticas
 */

import axiosInstance, { getApiToken } from '../config/axiosConfig'

interface Notificacion {
    id: number
    titulo: string
    contenido: string
    tipo: string
    icono: string
    color: string
    leido: boolean
    fecha: string
    tiempo_transcurrido: string
    es_reciente: boolean
    datos_adicionales?: any
}

interface EstadisticasNotificaciones {
    total: number
    no_leidas: number
    leidas: number
    recientes_24h: number
    porcentaje_leidas: number
}

class NotificacionesApiService {
    private baseUrl = '/api/notificaciones'
    private eventSource: EventSource | null = null
    private onNotificacionCallback: ((notificacion: Notificacion) => void) | null = null
    private onErrorCallback: ((error: Error) => void) | null = null

    /**
     * Obtener valor de una cookie por nombre
     */
    private getCookie(name: string): string | null {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`)
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null
        }
        return null
    }

    /**
     * Obtener todas las notificaciones del usuario
     */
    async obtenerNotificaciones(
        limite: number = 50,
        tipo?: string
    ): Promise<{ success: boolean; data: Notificacion[]; count: number }> {
        try {
            const params = new URLSearchParams()
            params.append('limit', limite.toString())
            if (tipo) params.append('tipo', tipo)

            const response = await axiosInstance.get<any>(`${this.baseUrl}?${params}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo notificaciones:', error)
            throw error
        }
    }

    /**
     * Obtener notificaciones no leídas
     */
    async obtenerNoLeidas(): Promise<{ success: boolean; data: Notificacion[]; count: number }> {
        try {
            const response = await axiosInstance.get<any>(`${this.baseUrl}/no-leidas`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo notificaciones no leídas:', error)
            throw error
        }
    }

    /**
     * Obtener estadísticas de notificaciones
     */
    async obtenerEstadisticas(): Promise<{ success: boolean; data: EstadisticasNotificaciones }> {
        try {
            const response = await axiosInstance.get<any>(`${this.baseUrl}/estadisticas`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error)
            throw error
        }
    }

    /**
     * Marcar notificación como leída
     */
    async marcarLeido(notificacionId: number): Promise<{ success: boolean; data: Notificacion }> {
        try {
            const response = await axiosInstance.put<any>(`${this.baseUrl}/${notificacionId}/leido`)
            return response.data
        } catch (error) {
            console.error('Error marcando notificación como leída:', error)
            throw error
        }
    }

    /**
     * Marcar notificación como no leída
     */
    async marcarNoLeido(notificacionId: number): Promise<{ success: boolean; data: Notificacion }> {
        try {
            const response = await axiosInstance.put<any>(`${this.baseUrl}/${notificacionId}/no-leido`)
            return response.data
        } catch (error) {
            console.error('Error marcando notificación como no leída:', error)
            throw error
        }
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    async marcarTodasLeidas(): Promise<{ success: boolean; data: { cantidad: number } }> {
        try {
            const response = await axiosInstance.put<any>(`${this.baseUrl}/marcar/todas-leidas`)
            return response.data
        } catch (error) {
            console.error('Error marcando todas como leídas:', error)
            throw error
        }
    }

    /**
     * Eliminar una notificación
     */
    async eliminar(notificacionId: number): Promise<{ success: boolean }> {
        try {
            const response = await axiosInstance.delete<any>(`${this.baseUrl}/${notificacionId}`)
            return response.data
        } catch (error) {
            console.error('Error eliminando notificación:', error)
            throw error
        }
    }

    /**
     * Conectar al stream SSE para notificaciones en tiempo real
     *
     * @param onNotificacion - Callback cuando llega una notificación
     * @param onError - Callback cuando hay un error
     */
    async conectarSSE(
        onNotificacion: (notificacion: Notificacion) => void,
        onError?: (error: Error) => void
    ): Promise<void> {
        if (this.eventSource) {
            this.desconectarSSE()
        }

        this.onNotificacionCallback = onNotificacion
        this.onErrorCallback = onError || (() => {})

        try {
            // Get Sanctum Bearer token for EventSource (passed as query parameter)
            const token = await getApiToken()
            if (!token) {
                console.error('[SSE] No API token available')
                if (this.onErrorCallback) {
                    this.onErrorCallback(new Error('No API token available'))
                }
                return
            }

            // EventSource doesn't support custom headers, so we pass the token as a query parameter
            const streamUrl = `${this.baseUrl}/stream?token=${encodeURIComponent(token)}`

            this.eventSource = new EventSource(streamUrl, { withCredentials: true })

            // Evento de notificación
            this.eventSource.addEventListener('notificacion', (event: Event) => {
                try {
                    const notificacion = JSON.parse((event as MessageEvent).data) as Notificacion
                    if (this.onNotificacionCallback) {
                        this.onNotificacionCallback(notificacion)
                    }
                } catch (error) {
                    console.error('Error parseando notificación:', error)
                    if (this.onErrorCallback) {
                        this.onErrorCallback(error as Error)
                    }
                }
            })

            // Evento de heartbeat (para verificar que la conexión está viva)
            this.eventSource.addEventListener('heartbeat', () => {
                // Silenciosamente ignorar el heartbeat
                // Solo es para mantener la conexión abierta
                console.debug('[SSE] Heartbeat recibido')
            })

            // Evento de reconexión (enviado por el servidor después de 50 segundos)
            this.eventSource.addEventListener('reconnect', (event: Event) => {
                console.log('[SSE] Server requesting reconnection')
                // Cerrar esta conexión y crear una nueva automáticamente
                this.desconectarSSE()
                // Reconectar después de 1 segundo
                setTimeout(() => {
                    if (this.onNotificacionCallback) {
                        this.conectarSSE(this.onNotificacionCallback, this.onErrorCallback || undefined)
                    }
                }, 1000)
            })

            // Manejo de errores
            this.eventSource.onerror = (event: Event) => {
                console.error('Error en SSE:', event)
                this.desconectarSSE()
                if (this.onErrorCallback) {
                    this.onErrorCallback(new Error('Conexión SSE perdida'))
                }
                // Intentar reconectar automáticamente después de 3 segundos
                setTimeout(() => {
                    if (this.onNotificacionCallback) {
                        console.log('[SSE] Intentando reconectar...')
                        this.conectarSSE(this.onNotificacionCallback, this.onErrorCallback || undefined)
                    }
                }, 3000)
            }

            console.log('[SSE] Conexión SSE establecida')
        } catch (error) {
            console.error('[SSE] Error conectando SSE:', error)
            if (this.onErrorCallback) {
                this.onErrorCallback(error as Error)
            }
        }
    }

    /**
     * Desconectar del stream SSE
     */
    desconectarSSE(): void {
        if (this.eventSource) {
            this.eventSource.close()
            this.eventSource = null
            console.log('Conexión SSE cerrada')
        }
    }

    /**
     * Verificar si está conectado al SSE
     */
    estaConectado(): boolean {
        return this.eventSource !== null && this.eventSource.readyState === EventSource.OPEN
    }

    /**
     * Obtener estado de la conexión SSE
     */
    obtenerEstadoConexion(): 'desconectado' | 'conectando' | 'conectado' {
        if (!this.eventSource) {
            return 'desconectado'
        }

        switch (this.eventSource.readyState) {
            case EventSource.CONNECTING:
                return 'conectando'
            case EventSource.OPEN:
                return 'conectado'
            case EventSource.CLOSED:
            default:
                return 'desconectado'
        }
    }

    /**
     * Reconectar automáticamente (útil después de desconexiones)
     */
    reconectar(
        onNotificacion: (notificacion: Notificacion) => void,
        onError?: (error: Error) => void,
        reintentos: number = 3
    ): void {
        let intento = 0

        const intentarConectar = () => {
            intento++
            console.log(`Intento de reconexión ${intento}/${reintentos}`)

            this.conectarSSE(onNotificacion, (error) => {
                if (intento < reintentos) {
                    // Esperar 5 segundos antes de reintentar
                    setTimeout(intentarConectar, 5000)
                } else {
                    console.error('No se pudo reconectar después de varios intentos')
                    if (onError) {
                        onError(error)
                    }
                }
            })
        }

        intentarConectar()
    }
}

// Exportar instancia singleton
export default new NotificacionesApiService()
