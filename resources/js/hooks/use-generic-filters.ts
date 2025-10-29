// Business Logic Layer: Generic hook for managing filters
import { useState, useCallback, useMemo } from 'react'
import { router } from '@inertiajs/react'
import type { Filters } from '@/domain/shared'
import type { FilterField } from '@/domain/generic'

interface UseGenericFiltersOptions {
    initialFilters?: Filters
    filterFields?: FilterField[]
    onFilterChange?: (filters: Filters) => void
}

export function useGenericFilters({
    initialFilters = {},
    filterFields = [],
    onFilterChange
}: UseGenericFiltersOptions = {}) {
    // Estado local de los filtros
    const [filters, setFilters] = useState<Filters>(initialFilters)

    /**
     * Actualiza un filtro específico
     */
    const updateFilter = useCallback((key: string, value: unknown) => {
        setFilters(prev => {
            const newFilters = { ...prev }

            // Si el valor es null, undefined o string vacío, eliminamos el filtro
            if (value === null || value === undefined || value === '') {
                delete newFilters[key]
            } else {
                newFilters[key] = value
            }

            return newFilters
        })
    }, [])

    /**
     * Actualiza múltiples filtros a la vez
     */
    const updateFilters = useCallback((newFilters: Filters) => {
        setFilters(prev => ({ ...prev, ...newFilters }))
    }, [])

    /**
     * Limpia todos los filtros
     */
    const clearFilters = useCallback(() => {
        setFilters({})
        if (onFilterChange) {
            onFilterChange({})
        }
    }, [onFilterChange])

    /**
     * Aplica los filtros (navega con los filtros actuales)
     */
    const applyFilters = useCallback(() => {
        // Construir query params limpiando valores vacíos
        const queryParams: Record<string, string | number> = {}

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                queryParams[key] = typeof value === 'number' ? value : String(value)
            }
        })

        // Navegar con los filtros
        router.get(window.location.pathname, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                if (onFilterChange) {
                    onFilterChange(filters)
                }
            }
        })
    }, [filters, onFilterChange])

    /**
     * Resetea los filtros y recarga la página
     */
    const resetFilters = useCallback(() => {
        setFilters({})
        router.get(window.location.pathname, {}, {
            preserveState: false,
            preserveScroll: false,
            onSuccess: () => {
                if (onFilterChange) {
                    onFilterChange({})
                }
            }
        })
    }, [onFilterChange])

    /**
     * Verifica si hay filtros activos
     */
    const hasActiveFilters = useMemo(() => {
        return Object.keys(filters).length > 0
    }, [filters])

    /**
     * Cuenta cuántos filtros están activos
     */
    const activeFiltersCount = useMemo(() => {
        return Object.keys(filters).filter(key => {
            const value = filters[key]
            return value !== null && value !== undefined && value !== ''
        }).length
    }, [filters])

    /**
     * Obtiene el valor de un filtro específico
     */
    const getFilterValue = useCallback((key: string): unknown => {
        return filters[key]
    }, [filters])

    /**
     * Obtiene los valores por defecto de los filtros definidos
     */
    const getDefaultFilters = useCallback((): Filters => {
        const defaults: Filters = {}
        filterFields.forEach(field => {
            if (field.defaultValue !== undefined) {
                defaults[field.key] = field.defaultValue
            }
        })
        return defaults
    }, [filterFields])

    return {
        // Estado
        filters,
        hasActiveFilters,
        activeFiltersCount,

        // Acciones
        updateFilter,
        updateFilters,
        clearFilters,
        applyFilters,
        resetFilters,

        // Utilidades
        getFilterValue,
        getDefaultFilters,
    }
}
