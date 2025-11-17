/**
 * Página de Notificaciones
 *
 * Vista completa de todas las notificaciones del usuario con:
 * - Filtrado por tipo
 * - Búsqueda
 * - Paginación
 * - Acciones masivas
 */

import React, { useEffect, useState } from 'react'
import { Head } from '@inertiajs/react'
import AuthLayout from '@/layouts/auth-layout'
import {
    Bell,
    Search,
    Filter,
    Trash2,
    CheckCheck,
    Clock,
    AlertCircle,
} from 'lucide-react'
import notificacionesApi from '@/services/notificacionesApi'
import notificationService from '@/services/notification.service'

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

export default function NotificacionesIndex() {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
    const [notificacionesFiltradas, setNotificacionesFiltradas] = useState<Notificacion[]>([])
    const [cargando, setCargando] = useState(true)
    const [busqueda, setBusqueda] = useState('')
    const [tipoFiltro, setTipoFiltro] = useState('todos')
    const [seleccionadas, setSeleccionadas] = useState<number[]>([])
    const [estadisticas, setEstadisticas] = useState({
        total: 0,
        no_leidas: 0,
        leidas: 0,
        recientes_24h: 0,
        porcentaje_leidas: 0,
    })

    const tipos = [
        { value: 'todos', label: 'Todas' },
        { value: 'general', label: 'General' },
        { value: 'tarea', label: 'Tarea' },
        { value: 'evaluacion', label: 'Evaluación' },
        { value: 'calificacion', label: 'Calificación' },
        { value: 'recomendacion', label: 'Recomendación' },
        { value: 'recordatorio', label: 'Recordatorio' },
        { value: 'alerta', label: 'Alerta' },
        { value: 'exito', label: 'Éxito' },
        { value: 'error', label: 'Error' },
        { value: 'info', label: 'Información' },
    ]

    // Cargar notificaciones
    useEffect(() => {
        cargarNotificaciones()
        cargarEstadisticas()
    }, [])

    // Filtrar notificaciones cuando cambian los filtros
    useEffect(() => {
        let filtradas = [...notificaciones]

        // Filtro por tipo
        if (tipoFiltro !== 'todos') {
            filtradas = filtradas.filter((n) => n.tipo === tipoFiltro)
        }

        // Filtro por búsqueda
        if (busqueda.trim()) {
            const search = busqueda.toLowerCase()
            filtradas = filtradas.filter(
                (n) =>
                    n.titulo.toLowerCase().includes(search) ||
                    n.contenido.toLowerCase().includes(search)
            )
        }

        setNotificacionesFiltradas(filtradas)
    }, [notificaciones, tipoFiltro, busqueda])

    /**
     * Cargar notificaciones
     */
    const cargarNotificaciones = async () => {
        try {
            setCargando(true)
            const response = await notificacionesApi.obtenerNotificaciones(1000)
            setNotificaciones(response.data)
        } catch (error) {
            console.error('Error cargando notificaciones:', error)
            notificationService.error('Error al cargar notificaciones')
        } finally {
            setCargando(false)
        }
    }

    /**
     * Cargar estadísticas
     */
    const cargarEstadisticas = async () => {
        try {
            const response = await notificacionesApi.obtenerEstadisticas()
            setEstadisticas(response.data)
        } catch (error) {
            console.error('Error cargando estadísticas:', error)
        }
    }

    /**
     * Marcar como leído
     */
    const marcarLeido = async (id: number) => {
        try {
            await notificacionesApi.marcarLeido(id)
            setNotificaciones((prev) =>
                prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
            )
        } catch (error) {
            notificationService.error('Error al actualizar notificación')
        }
    }

    /**
     * Marcar como no leído
     */
    const marcarNoLeido = async (id: number) => {
        try {
            await notificacionesApi.marcarNoLeido(id)
            setNotificaciones((prev) =>
                prev.map((n) => (n.id === id ? { ...n, leido: false } : n))
            )
        } catch (error) {
            notificationService.error('Error al actualizar notificación')
        }
    }

    /**
     * Eliminar notificación
     */
    const eliminarNotificacion = async (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
            try {
                await notificacionesApi.eliminar(id)
                setNotificaciones((prev) => prev.filter((n) => n.id !== id))
                notificationService.success('Notificación eliminada')
            } catch (error) {
                notificationService.error('Error al eliminar notificación')
            }
        }
    }

    /**
     * Marcar todas como leídas
     */
    const marcarTodasLeidas = async () => {
        try {
            await notificacionesApi.marcarTodasLeidas()
            setNotificaciones((prev) => prev.map((n) => ({ ...n, leido: true })))
            notificationService.success('Todas las notificaciones marcadas como leídas')
            await cargarEstadisticas()
        } catch (error) {
            notificationService.error('Error al actualizar notificaciones')
        }
    }

    /**
     * Seleccionar/deseleccionar notificación
     */
    const toggleSeleccion = (id: number) => {
        setSeleccionadas((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        )
    }

    /**
     * Seleccionar todas las notificaciones filtradas
     */
    const toggleSeleccionarTodas = () => {
        if (seleccionadas.length === notificacionesFiltradas.length) {
            setSeleccionadas([])
        } else {
            setSeleccionadas(notificacionesFiltradas.map((n) => n.id))
        }
    }

    /**
     * Eliminar notificaciones seleccionadas
     */
    const eliminarSeleccionadas = async () => {
        if (seleccionadas.length === 0) {
            notificationService.warning('Selecciona notificaciones para eliminar')
            return
        }

        if (confirm(`¿Eliminar ${seleccionadas.length} notificación(es)?`)) {
            try {
                for (const id of seleccionadas) {
                    await notificacionesApi.eliminar(id)
                }
                setNotificaciones((prev) =>
                    prev.filter((n) => !seleccionadas.includes(n.id))
                )
                setSeleccionadas([])
                notificationService.success('Notificaciones eliminadas')
            } catch (error) {
                notificationService.error('Error al eliminar notificaciones')
            }
        }
    }

    const getColorClase = (color: string): string => {
        const colores: Record<string, string> = {
            red: 'bg-red-100 text-red-800',
            orange: 'bg-orange-100 text-orange-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            green: 'bg-green-100 text-green-800',
            blue: 'bg-blue-100 text-blue-800',
            purple: 'bg-purple-100 text-purple-800',
            gray: 'bg-gray-100 text-gray-800',
        }
        return colores[color] || 'bg-gray-100 text-gray-800'
    }

    return (
        <AuthLayout>
            <Head title="Notificaciones" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Bell className="w-8 h-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
                        </div>

                        {/* Estadísticas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-600 font-medium">Total</p>
                                <p className="text-2xl font-bold text-blue-900">
                                    {estadisticas.total}
                                </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-sm text-red-600 font-medium">No Leídas</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {estadisticas.no_leidas}
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <p className="text-sm text-green-600 font-medium">Leídas</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {estadisticas.leidas}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <p className="text-sm text-purple-600 font-medium">
                                    Últimas 24h
                                </p>
                                <p className="text-2xl font-bold text-purple-900">
                                    {estadisticas.recientes_24h}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Filtros y búsqueda */}
                    <div className="mb-6 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Búsqueda */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar notificaciones..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Filtro por tipo */}
                            <div className="relative flex-1">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    value={tipoFiltro}
                                    onChange={(e) => setTipoFiltro(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {tipos.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Botones de acción */}
                            {estadisticas.no_leidas > 0 && (
                                <button
                                    onClick={marcarTodasLeidas}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Marcar todas
                                </button>
                            )}
                        </div>

                        {/* Acciones seleccionadas */}
                        {seleccionadas.length > 0 && (
                            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <span className="text-sm text-blue-900">
                                    {seleccionadas.length} notificación(es) seleccionada(s)
                                </span>
                                <button
                                    onClick={eliminarSeleccionadas}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Lista de notificaciones */}
                    {cargando ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : notificacionesFiltradas.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">
                                No hay notificaciones
                            </h3>
                            <p className="text-gray-500 mt-2">
                                {busqueda || tipoFiltro !== 'todos'
                                    ? 'Intenta con otros filtros'
                                    : 'Aquí aparecerán tus notificaciones'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Checkbox de seleccionar todas */}
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={
                                        seleccionadas.length === notificacionesFiltradas.length &&
                                        notificacionesFiltradas.length > 0
                                    }
                                    onChange={toggleSeleccionarTodas}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-sm text-gray-700">
                                    Seleccionar todas en esta página
                                </span>
                            </div>

                            {/* Notificaciones */}
                            {notificacionesFiltradas.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 rounded-lg border transition-colors ${
                                        !notif.leido
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={seleccionadas.includes(notif.id)}
                                            onChange={() => toggleSeleccion(notif.id)}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 flex-shrink-0 mt-1"
                                        />

                                        {/* Icono */}
                                        <div className="text-2xl flex-shrink-0">
                                            {notif.icono}
                                        </div>

                                        {/* Contenido */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3
                                                        className={`text-base font-semibold ${
                                                            !notif.leido
                                                                ? 'text-gray-900'
                                                                : 'text-gray-700'
                                                        }`}
                                                    >
                                                        {notif.titulo}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notif.contenido}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getColorClase(
                                                                notif.color
                                                            )}`}
                                                        >
                                                            {notif.tipo}
                                                        </span>
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {notif.tiempo_transcurrido}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Indicador de no leído */}
                                                {!notif.leido && (
                                                    <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                                                )}
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex gap-3 mt-3 flex-wrap">
                                                <button
                                                    onClick={() =>
                                                        notif.leido
                                                            ? marcarNoLeido(notif.id)
                                                            : marcarLeido(notif.id)
                                                    }
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    {notif.leido
                                                        ? 'Marcar no leído'
                                                        : 'Marcar leído'}
                                                </button>
                                                <button
                                                    onClick={() => eliminarNotificacion(notif.id)}
                                                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthLayout>
    )
}
