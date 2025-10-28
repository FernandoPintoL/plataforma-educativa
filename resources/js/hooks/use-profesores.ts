// Business Logic Layer: Profesores hook for list page
import { useState, useCallback } from 'react'
import { usePage } from '@inertiajs/react'
import type { ProfesorIndexPageProps, ProfesorFilters, Profesor } from '@/domain/profesores'
import { profesoresService } from '@/services/profesores.service'

export function useProfesores() {
    const { profesores, filters: initialFilters } = usePage<ProfesorIndexPageProps>().props

    // Estado local para los filtros
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '')
    const [activoFilter, setActivoFilter] = useState(initialFilters.activo || '')

    /**
     * Maneja la búsqueda con los filtros actuales
     */
    const handleSearch = useCallback((e?: React.FormEvent) => {
        e?.preventDefault()

        const filters: ProfesorFilters = {
            search: searchTerm,
            activo: activoFilter,
        }

        profesoresService.index(filters)
    }, [searchTerm, activoFilter])

    /**
     * Limpia todos los filtros
     */
    const clearFilters = useCallback(() => {
        setSearchTerm('')
        setActivoFilter('')
        profesoresService.clearFilters()
    }, [])

    /**
     * Navega a la página de crear profesor
     */
    const goToCreate = useCallback(() => {
        profesoresService.create()
    }, [])

    /**
     * Navega a la página de editar profesor
     */
    const goToEdit = useCallback((id: number) => {
        profesoresService.edit(id)
    }, [])

    /**
     * Navega a la página de ver profesor
     */
    const goToShow = useCallback((id: number) => {
        profesoresService.show(id)
    }, [])

    /**
     * Elimina un profesor
     */
    const handleDelete = useCallback((profesor: Profesor) => {
        profesoresService.destroy(profesor.id)
    }, [])

    /**
     * Alterna el estado activo/inactivo de un profesor
     */
    const handleToggleStatus = useCallback((profesor: Profesor) => {
        profesoresService.toggleStatus(profesor.id, profesor.activo)
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
        profesores,

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
