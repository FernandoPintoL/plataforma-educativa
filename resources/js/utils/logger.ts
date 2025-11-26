/**
 * Sistema Centralizado de Logging para Consola Web
 *
 * Proporciona logging con colores y niveles para:
 * - Peticiones HTTP
 * - Respuestas HTTP
 * - Eventos de WebSocket
 * - Errores
 * - Debug general
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'

interface LogEntry {
    timestamp: string
    level: LogLevel
    category: string
    message: string
    data?: any
    duration?: number
}

class Logger {
    private logs: LogEntry[] = []
    private isDevelopment = process.env.NODE_ENV === 'development'

    /**
     * Colores para consola
     */
    private colors = {
        DEBUG: 'color: #888; font-weight: bold',
        INFO: 'color: #0066cc; font-weight: bold',
        WARN: 'color: #ff9900; font-weight: bold',
        ERROR: 'color: #cc0000; font-weight: bold',
        SUCCESS: 'color: #00aa00; font-weight: bold',
    }

    private bgColors = {
        DEBUG: 'background: #f0f0f0; color: #666',
        INFO: 'background: #e6f2ff; color: #0066cc',
        WARN: 'background: #fff3e6; color: #ff9900',
        ERROR: 'background: #ffe6e6; color: #cc0000',
        SUCCESS: 'background: #e6ffe6; color: #00aa00',
    }

    /**
     * Log HTTP Request
     */
    logRequest(method: string, url: string, data?: any) {
        const cleanUrl = this.cleanUrl(url)
        const message = `🔵 [${method}] ${cleanUrl}`

        if (this.isDevelopment) {
            console.log(`%c[REQUEST]`, this.colors.INFO, message, data || '')
        }

        this.addLog('INFO', 'HTTP_REQUEST', message, data)
    }

    /**
     * Log HTTP Response
     */
    logResponse(
        method: string,
        url: string,
        status: number,
        data?: any,
        duration?: number
    ) {
        const cleanUrl = this.cleanUrl(url)
        const statusColor = status >= 200 && status < 300 ? '#00aa00' : '#cc0000'
        const statusEmoji = status >= 200 && status < 300 ? '✅' : '❌'
        const durationStr = duration ? ` (${duration}ms)` : ''

        const message = `${statusEmoji} [${method}] ${cleanUrl} → ${status}${durationStr}`

        if (this.isDevelopment) {
            console.log(
                `%c[RESPONSE]`,
                `color: ${statusColor}; font-weight: bold`,
                message,
                data || ''
            )
        }

        this.addLog('INFO', 'HTTP_RESPONSE', message, data)
    }

    /**
     * Log WebSocket Event
     */
    logWebSocket(event: string, data?: any, direction: 'SEND' | 'RECEIVE' = 'RECEIVE') {
        const emoji = direction === 'SEND' ? '📤' : '📥'
        const message = `${emoji} [WS] ${event}`

        if (this.isDevelopment) {
            const color = direction === 'SEND' ? '#ff6600' : '#0099ff'
            console.log(
                `%c[${direction}]`,
                `color: ${color}; font-weight: bold`,
                message,
                data || ''
            )
        }

        this.addLog('INFO', 'WEBSOCKET', message, data)
    }

    /**
     * Log Error
     */
    logError(category: string, message: string, error?: any) {
        const fullMessage = `❌ ${category}: ${message}`

        if (this.isDevelopment) {
            console.error(`%c[ERROR]`, this.colors.ERROR, fullMessage, error || '')
        }

        this.addLog('ERROR', category, fullMessage, error)
    }

    /**
     * Log Success
     */
    logSuccess(category: string, message: string, data?: any) {
        const fullMessage = `✅ ${category}: ${message}`

        if (this.isDevelopment) {
            console.log(`%c[SUCCESS]`, this.colors.SUCCESS, fullMessage, data || '')
        }

        this.addLog('SUCCESS', category, fullMessage, data)
    }

    /**
     * Log Info
     */
    logInfo(category: string, message: string, data?: any) {
        const fullMessage = `ℹ️ ${category}: ${message}`

        if (this.isDevelopment) {
            console.log(`%c[INFO]`, this.colors.INFO, fullMessage, data || '')
        }

        this.addLog('INFO', category, fullMessage, data)
    }

    /**
     * Log Warning
     */
    logWarn(category: string, message: string, data?: any) {
        const fullMessage = `⚠️ ${category}: ${message}`

        if (this.isDevelopment) {
            console.warn(`%c[WARN]`, this.colors.WARN, fullMessage, data || '')
        }

        this.addLog('WARN', category, fullMessage, data)
    }

    /**
     * Log Debug
     */
    logDebug(category: string, message: string, data?: any) {
        const fullMessage = `🔍 ${category}: ${message}`

        if (this.isDevelopment) {
            console.debug(`%c[DEBUG]`, this.colors.DEBUG, fullMessage, data || '')
        }

        this.addLog('DEBUG', category, fullMessage, data)
    }

    /**
     * Log con Performance Timing
     */
    logPerformance(category: string, operation: string, duration: number) {
        const emoji = duration > 1000 ? '🐢' : duration > 500 ? '⏱️' : '⚡'
        const message = `${emoji} ${operation}: ${duration}ms`

        if (this.isDevelopment) {
            const color = duration > 1000 ? '#ff6600' : duration > 500 ? '#ffaa00' : '#00aa00'
            console.log(
                `%c[PERFORMANCE]`,
                `color: ${color}; font-weight: bold`,
                message
            )
        }

        this.addLog('INFO', category, message, { duration })
    }

    /**
     * Limpiar logs más antiguos (mantener últimos 500)
     */
    private addLog(level: LogLevel, category: string, message: string, data?: any) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data,
        }

        this.logs.push(entry)

        // Mantener solo los últimos 500 logs para no llenar memoria
        if (this.logs.length > 500) {
            this.logs = this.logs.slice(-500)
        }
    }

    /**
     * Obtener todos los logs
     */
    getLogs(): LogEntry[] {
        return this.logs
    }

    /**
     * Obtener logs por nivel
     */
    getLogsByLevel(level: LogLevel): LogEntry[] {
        return this.logs.filter(log => log.level === level)
    }

    /**
     * Obtener logs por categoría
     */
    getLogsByCategory(category: string): LogEntry[] {
        return this.logs.filter(log => log.category === category)
    }

    /**
     * Limpiar todos los logs
     */
    clear() {
        this.logs = []
        console.clear()
        console.log('%c🗑️ Logs limpios', 'color: #666; font-weight: bold')
    }

    /**
     * Exportar logs como JSON
     */
    export(): string {
        return JSON.stringify(this.logs, null, 2)
    }

    /**
     * Descargar logs como archivo
     */
    download() {
        const logsJson = this.export()
        const blob = new Blob([logsJson], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `logs-${new Date().toISOString()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    /**
     * Mostrar resumen de logs en consola
     */
    printSummary() {
        const summary = {
            total: this.logs.length,
            byLevel: {
                DEBUG: this.getLogsByLevel('DEBUG').length,
                INFO: this.getLogsByLevel('INFO').length,
                WARN: this.getLogsByLevel('WARN').length,
                ERROR: this.getLogsByLevel('ERROR').length,
                SUCCESS: this.getLogsByLevel('SUCCESS').length,
            },
            byCategory: this.logs.reduce(
                (acc, log) => {
                    acc[log.category] = (acc[log.category] || 0) + 1
                    return acc
                },
                {} as Record<string, number>
            ),
        }

        console.table(summary)
        return summary
    }

    /**
     * Limpiar URL para mejor lectura
     */
    private cleanUrl(url: string): string {
        const cleaned = url.replace(window.location.origin, '')
        return cleaned || '/'
    }
}

// Crear instancia global
export const logger = new Logger()

// Hacer disponible en window para acceso desde consola
if (typeof window !== 'undefined') {
    ;(window as any).logger = logger
}

export default logger
