/**
 * NotificacionCenter Component
 *
 * Centro de notificaciones en tiempo real con:
 * - Dropdown de notificaciones
 * - Conexión SSE automática
 * - Conteo de no leídas
 * - Marcado de leído/no leído
 * - Eliminación de notificaciones
 */

import React, { useEffect, useState, useCallback } from 'react'
import { Bell, X, CheckCheck, ChevronDown } from 'lucide-react'
import notificacionesApi from '@/services/notificacionesApi'
import notificationService from '@/services/notification.service'
import { useNotificationPolling } from '@/hooks/useNotificationPolling'

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

export default function NotificacionCenter() {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
    const [noLeidas, setNoLeidas] = useState<number>(0)
    const [abierto, setAbierto] = useState(false)
    const [cargando, setCargando] = useState(true)
    const [conectado, setConectado] = useState(true) // Siempre conectado con polling
    const previousNoLeidasRef = React.useRef<number>(0)

    // Usar hook de polling para notificaciones
    useNotificationPolling({
        intervalMs: 3000, // Poll cada 3 segundos
        onNotificacionesChange: (notificaciones) => {
            setNotificaciones(notificaciones)

            // Detectar notificaciones nuevas y mostrar toast
            const noLeidasCount = notificaciones.filter((n: any) => !n.leido).length

            if (noLeidasCount > previousNoLeidasRef.current) {
                // Hay una notificación nueva
                const nuevasNotificaciones = notificaciones.slice(
                    0,
                    noLeidasCount - previousNoLeidasRef.current
                )
                nuevasNotificaciones.forEach((notif: Notificacion) => {
                    notificationService.info(notif.titulo, {
                        description: notif.contenido,
                    })
                })
            }

            previousNoLeidasRef.current = noLeidasCount
            setNoLeidas(noLeidasCount)
            setCargando(false)
        },
        onError: (error) => {
            console.error('Error en polling:', error)
            setConectado(false)
        },
    })

    // Con polling, no necesitamos conexión SSE - el hook maneja todo


    /**
     * Marcar notificación como leída
     */
    const marcarLeido = useCallback(async (id: number, estaLeida: boolean) => {
        try {
            const fn = estaLeida ? notificacionesApi.marcarNoLeido : notificacionesApi.marcarLeido
            await fn(id)

            // Actualizar estado local
            setNotificaciones((prev) =>
                prev.map((n) => (n.id === id ? { ...n, leido: !estaLeida } : n))
            )

            // Actualizar contador
            if (!estaLeida) {
                setNoLeidas((prev) => Math.max(0, prev - 1))
            } else {
                setNoLeidas((prev) => prev + 1)
            }
        } catch (error) {
            console.error('Error marcando notificación:', error)
            notificationService.error('Error al actualizar notificación')
        }
    }, [])

    /**
     * Eliminar notificación
     */
    const eliminarNotificacion = useCallback(async (id: number, estaLeida: boolean) => {
        try {
            await notificacionesApi.eliminar(id)

            // Actualizar estado local
            setNotificaciones((prev) => prev.filter((n) => n.id !== id))

            // Actualizar contador
            if (!estaLeida) {
                setNoLeidas((prev) => Math.max(0, prev - 1))
            }

            notificationService.success('Notificación eliminada')
        } catch (error) {
            console.error('Error eliminando notificación:', error)
            notificationService.error('Error al eliminar notificación')
        }
    }, [])

    /**
     * Marcar todas como leídas
     */
    const marcarTodasLeidas = useCallback(async () => {
        try {
            await notificacionesApi.marcarTodasLeidas()

            // Actualizar estado
            setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })))
            setNoLeidas(0)

            notificationService.success('Todas las notificaciones marcadas como leídas')
        } catch (error) {
            console.error('Error marcando todas como leídas:', error)
            notificationService.error('Error al actualizar notificaciones')
        }
    }, [])

    const getColorClase = (color: string): string => {
        const colores: Record<string, string> = {
            red: 'bg-red-50 border-red-200',
            orange: 'bg-orange-50 border-orange-200',
            yellow: 'bg-yellow-50 border-yellow-200',
            green: 'bg-green-50 border-green-200',
            blue: 'bg-blue-50 border-blue-200',
            purple: 'bg-purple-50 border-purple-200',
            gray: 'bg-gray-50 border-gray-200',
        }
        return colores[color] || 'bg-gray-50 border-gray-200'
    }

    const getIconColor = (color: string): string => {
        const colores: Record<string, string> = {
            red: 'text-red-600',
            orange: 'text-orange-600',
            yellow: 'text-yellow-600',
            green: 'text-green-600',
            blue: 'text-blue-600',
            purple: 'text-purple-600',
            gray: 'text-gray-600',
        }
        return colores[color] || 'text-gray-600'
    }

    return (
        <div className="relative">
            {/* Botón del centro de notificaciones */}
            <button
                onClick={() => setAbierto(!abierto)}
                className="relative inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title={`${noLeidas} notificaciones no leídas`}
            >
                <Bell className="w-5 h-5 text-gray-700" />

                {/* Badge con contador */}
                {noLeidas > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {noLeidas > 99 ? '99+' : noLeidas}
                    </span>
                )}

                {/* Indicador de conexión */}
                <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white transition-colors duration-200 ${
                        conectado ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    title={conectado ? 'Conectado' : 'Desconectado'}
                />
            </button>

            {/* Dropdown */}
            {abierto && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                        <div className="flex items-center gap-2">
                            {noLeidas > 0 && (
                                <button
                                    onClick={marcarTodasLeidas}
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    title="Marcar todas como leídas"
                                >
                                    <CheckCheck className="w-4 h-4 text-gray-600" />
                                </button>
                            )}
                            <button
                                onClick={() => setAbierto(false)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="max-h-96 overflow-y-auto">
                        {cargando ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : notificaciones.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                                <Bell className="w-8 h-8 mb-2" />
                                <p>No hay notificaciones</p>
                            </div>
                        ) : (
                            notificaciones.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50 ${
                                        !notif.leido ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        {/* Icono */}
                                        <div
                                            className={`flex-shrink-0 text-2xl ${
                                                !notif.leido ? 'opacity-100' : 'opacity-70'
                                            }`}
                                        >
                                            {notif.icono}
                                        </div>

                                        {/* Contenido */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h4
                                                    className={`text-sm font-semibold ${
                                                        !notif.leido
                                                            ? 'text-gray-900'
                                                            : 'text-gray-700'
                                                    }`}
                                                >
                                                    {notif.titulo}
                                                </h4>
                                                <span className="text-xs text-gray-500 flex-shrink-0">
                                                    {notif.tiempo_transcurrido}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {notif.contenido}
                                            </p>

                                            {/* Acciones */}
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() =>
                                                        marcarLeido(notif.id, notif.leido)
                                                    }
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    {notif.leido
                                                        ? 'Marcar no leído'
                                                        : 'Marcar leído'}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        eliminarNotificacion(
                                                            notif.id,
                                                            notif.leido
                                                        )
                                                    }
                                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>

                                        {/* Indicador de leído */}
                                        <div className="flex-shrink-0">
                                            {!notif.leido && (
                                                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notificaciones.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <a
                                href="/notificaciones"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Ver todas las notificaciones
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
