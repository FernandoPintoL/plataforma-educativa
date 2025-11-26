/**
 * WebSocket Logger
 *
 * Captura y registra todos los eventos de WebSocket:
 * - Conexión / Desconexión
 * - Eventos enviados y recibidos
 * - Errores de conexión
 */

import logger from './logger'

export class WebSocketLogger {
    private connectionTime?: Date
    private eventCount = 0
    private isConnected = false

    /**
     * Log cuando WebSocket se conecta
     */
    onConnect(url: string) {
        this.connectionTime = new Date()
        this.isConnected = true
        logger.logSuccess('WEBSOCKET', `Conectado a ${url}`, {
            timestamp: this.connectionTime.toISOString(),
        })
    }

    /**
     * Log cuando WebSocket se desconecta
     */
    onDisconnect(code?: number, reason?: string) {
        this.isConnected = false
        const duration = this.connectionTime
            ? Date.now() - this.connectionTime.getTime()
            : undefined

        logger.logWarn('WEBSOCKET', `Desconectado (código: ${code})`, {
            reason,
            duration: duration ? `${duration}ms` : 'N/A',
            totalEvents: this.eventCount,
        })

        this.eventCount = 0
    }

    /**
     * Log de evento recibido
     */
    onMessage(event: string, data?: any) {
        this.eventCount++
        logger.logWebSocket(event, data, 'RECEIVE')
    }

    /**
     * Log de evento enviado
     */
    onSend(event: string, data?: any) {
        logger.logWebSocket(event, data, 'SEND')
    }

    /**
     * Log de error de WebSocket
     */
    onError(error: any) {
        logger.logError('WEBSOCKET', 'Error de conexión', {
            message: error.message,
            code: error.code,
            reason: error.reason,
        })
    }

    /**
     * Log de reconexión
     */
    onReconnect(attempt: number, maxAttempts: number) {
        logger.logWarn('WEBSOCKET', `Reintentando conexión`, {
            attempt: `${attempt}/${maxAttempts}`,
        })
    }

    /**
     * Obtener estado actual
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            connectedSince: this.connectionTime?.toISOString(),
            totalEvents: this.eventCount,
            connectionDuration: this.connectionTime
                ? `${Date.now() - this.connectionTime.getTime()}ms`
                : 'N/A',
        }
    }
}

// Crear instancia global
export const wsLogger = new WebSocketLogger()

// Hacer disponible en window para acceso desde consola
if (typeof window !== 'undefined') {
    ;(window as any).wsLogger = wsLogger
}

export default wsLogger
