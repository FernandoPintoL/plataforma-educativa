// Business Logic Layer: Estudiantes hook for list page
import { useState, useCallback } from 'react'
import { usePage } from '@inertiajs/react'
import type { EstudianteIndexPageProps, EstudianteFilters, Estudiante } from '@/domain/estudiantes'
import { estudiantesService } from '@/services/estudiantes.service'

export function useEstudiantes() {
    const { estudiantes, filters: initialFilters } = usePage<EstudianteIndexPageProps>().props

    // Estado local para los filtros
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '')
    const [activoFilter, setActivoFilter] = useState(initialFilters.activo || '')

    /**
     * Maneja la búsqueda con los filtros actuales
     */
    const handleSearch = useCallback((e?: React.FormEvent) => {
        e?.preventDefault()

        const filters: EstudianteFilters = {
            search: searchTerm,
            activo: activoFilter,
        }

        estudiantesService.index(filters)
    }, [searchTerm, activoFilter])

    /**
     * Limpia todos los filtros
     */
    const clearFilters = useCallback(() => {
        setSearchTerm('')
        setActivoFilter('')
        estudiantesService.clearFilters()
    }, [])

    /**
     * Navega a la página de crear estudiante
     */
    const goToCreate = useCallback(() => {
        estudiantesService.create()
    }, [])

    /**
     * Navega a la página de editar estudiante
     */
    const goToEdit = useCallback((id: number) => {
        estudiantesService.edit(id)
    }, [])

    /**
     * Navega a la página de ver estudiante
     */
    const goToShow = useCallback((id: number) => {
        estudiantesService.show(id)
    }, [])

    /**
     * Elimina un estudiante
     */
    const handleDelete = useCallback((estudiante: Estudiante) => {
        estudiantesService.destroy(estudiante.id)
    }, [])

    /**
     * Alterna el estado activo/inactivo de un estudiante
     */
    const handleToggleStatus = useCallback((estudiante: Estudiante) => {
        estudiantesService.toggleStatus(estudiante.id, estudiante.activo)
    }, [])

    /**
     * Navega a una página específica
     */
    const goToPage = useCallback((url: string | null) => {
        if (url) {
            window.location.href = url
        }
    }, [])

    return {
        // Data
        estudiantes,

        // Filters state
        searchTerm,
        setSearchTerm,
        activoFilter,
        setActivoFilter,

        // Actions
        handleSearch,
        clearFilters,
        goToCreate,
        goToEdit,
        goToShow,
        handleDelete,
        handleToggleStatus,
        goToPage,

        // Computed
        hasFilters: !!searchTerm || !!activoFilter,
    }
}
