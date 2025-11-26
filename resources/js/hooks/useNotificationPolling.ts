/**
 * Hook para polling de notificaciones por HTTP
 *
 * Obtiene notificaciones cada X segundos de forma simple y eficiente.
 * Evita los problemas de timeout de SSE en Railway.
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import notificacionesApi from '@/services/notificacionesApi'

interface UseNotificationPollingOptions {
    intervalMs?: number // Intervalo de polling en milisegundos (default: 3000ms)
    onNotificacionesChange?: (notificaciones: any[]) => void
    onError?: (error: Error) => void
    enabled?: boolean // Controlar si el polling está habilitado
}

export function useNotificationPolling({
    intervalMs = 3000,
    onNotificacionesChange,
    onError,
    enabled = true,
}: UseNotificationPollingOptions = {}) {
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const lastNotificationCountRef = useRef<number>(0)
    const [isEnabled, setIsEnabled] = useState(enabled)
    const enabledRef = useRef(enabled)

    // Función para obtener notificaciones
    const fetchNotificaciones = useCallback(async () => {
        try {
            const response = await notificacionesApi.obtenerNotificaciones(20)

            if (onNotificacionesChange) {
                onNotificacionesChange(response.data)
            }

            // Detectar notificaciones nuevas
            const noLeidasCount = response.data.filter((n: any) => !n.leido).length

            if (noLeidasCount > lastNotificationCountRef.current) {
                console.debug(
                    `[Polling] Nueva notificación detectada. Total no leídas: ${noLeidasCount}`
                )
            }

            lastNotificationCountRef.current = noLeidasCount
        } catch (error) {
            console.error('[Polling] Error obteniendo notificaciones:', error)
            if (onError) {
                onError(error as Error)
            }
        }
    }, [onNotificacionesChange, onError])

    // Iniciar polling cuando monta el componente
    useEffect(() => {
        enabledRef.current = isEnabled

        if (!isEnabled) {
            // Si está deshabilitado, limpiar cualquier intervalo existente
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
                pollingIntervalRef.current = null
            }
            console.debug('[Polling] Deshabilitado')
            return
        }

        // Hacer fetch inmediato
        fetchNotificaciones()

        // Configurar polling
        pollingIntervalRef.current = setInterval(fetchNotificaciones, intervalMs)

        console.debug(`[Polling] Iniciado - Intervalo: ${intervalMs}ms`)

        // Cleanup: detener polling cuando desmonta
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
                console.debug('[Polling] Detenido')
            }
        }
    }, [fetchNotificaciones, intervalMs, isEnabled])

    // Funciones públicas
    return {
        // Hacer un fetch manual si es necesario
        refetch: fetchNotificaciones,

        // Cambiar intervalo de polling
        setInterval: (newIntervalMs: number) => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current)
            }
            pollingIntervalRef.current = setInterval(fetchNotificaciones, newIntervalMs)
            console.debug(`[Polling] Intervalo cambiado a: ${newIntervalMs}ms`)
        },

        // Toggle para habilitar/deshabilitar polling
        togglePolling: (enabled?: boolean) => {
            const newState = enabled !== undefined ? enabled : !isEnabled
            setIsEnabled(newState)
            console.debug(`[Polling] ${newState ? 'Habilitado' : 'Deshabilitado'}`)
            return newState
        },

        // Obtener estado actual
        isPollingEnabled: () => isEnabled,
    }
}
