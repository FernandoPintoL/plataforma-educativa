/**
 * Hook para manejar la pausa/reanudación de SSE durante navegación
 *
 * Pausa las notificaciones mientras se navega entre páginas para evitar
 * interferencias con la transición de Inertia.js
 */

import { useEffect } from 'react'
import { router } from '@inertiajs/react'
import notificacionesApi from '@/services/notificacionesApi'

export function useSSENavigation() {
    useEffect(() => {
        // Pausar SSE al comenzar navegación
        const pausarEnNavegacion = () => {
            console.debug('[SSE] Navegación detectada - pausando notificaciones')
            notificacionesApi.pausar()
        }

        // Reanudar SSE después de que la navegación complete
        const reanudarDespuesNavegacion = () => {
            // Esperar un poco para asegurar que la página se ha renderizado
            setTimeout(() => {
                console.debug('[SSE] Navegación completada - reanudando notificaciones')
                notificacionesApi.reanudar()
            }, 100)
        }

        // Escuchar eventos de navegación de Inertia.js
        // router.on() retorna una función de desinscripción
        const unsubscribeBefore = router.on('before', pausarEnNavegacion)
        const unsubscribeFinish = router.on('finish', reanudarDespuesNavegacion)

        // Cleanup: ejecutar las funciones retornadas para desinscribirse
        return () => {
            unsubscribeBefore?.()
            unsubscribeFinish?.()
        }
    }, [])
}
