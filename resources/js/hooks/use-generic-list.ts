// Business Logic Layer: Generic hook for CRUD list pages
import { useState, useCallback } from 'react'
import { router } from '@inertiajs/react'
import NotificationService from '@/services/notification.service'
import type { BaseEntity, BaseService, CrudConfig } from '@/domain/generic'
import type { Pagination, Filters } from '@/domain/shared'
import { useGenericFilters } from './use-generic-filters'

interface UseGenericListOptions<T extends BaseEntity, F> {
    data: Pagination<T>
    config: CrudConfig<T>
    service: BaseService<T, F>
    initialFilters?: Filters
}

export function useGenericList<T extends BaseEntity, F>({
    data,
    config,
    service,
    initialFilters = {}
}: UseGenericListOptions<T, F>) {
    // Estado local
    const [searchTerm, setSearchTerm] = useState(initialFilters.search?.toString() || '')
    const [isLoading, setIsLoading] = useState(false)
    const [sortBy, setSortBy] = useState<string | undefined>(initialFilters.order_by?.toString())
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
        (initialFilters.order_dir as 'asc' | 'desc') || 'asc'
    )

    // Hook de filtros
    const {
        filters,
        updateFilter,
        applyFilters,
        clearFilters: clearAllFilters,
        hasActiveFilters
    } = useGenericFilters({
        initialFilters,
        filterFields: config.filters
    })

    /**
     * Maneja la búsqueda
     */
    const handleSearch = useCallback((e?: React.FormEvent) => {
        e?.preventDefault()

        const searchFilters: Filters = {
            ...filters,
            search: searchTerm || undefined
        }

        // Limpiar valores vacíos
        Object.keys(searchFilters).forEach(key => {
            if (searchFilters[key] === '' || searchFilters[key] === null || searchFilters[key] === undefined) {
                delete searchFilters[key]
            }
        })

        setIsLoading(true)
        service.search(searchFilters)

        // Reset loading después de un tiempo
        setTimeout(() => setIsLoading(false), 500)
    }, [searchTerm, filters, service])

    /**
     * Limpia todos los filtros incluyendo búsqueda
     */
    const clearFilters = useCallback(() => {
        setSearchTerm('')
        clearAllFilters()
    }, [clearAllFilters])

    /**
     * Navega a la página de crear
     */
    const goToCreate = useCallback(() => {
        const url = config.urls?.create || `/${config.pluralName}/create`
        router.get(url)
    }, [config])

    /**
     * Navega a la página de editar
     */
    const goToEdit = useCallback((entity: T) => {
        const url = config.urls?.edit
            ? config.urls.edit(entity.id)
            : `/${config.pluralName}/${entity.id}/edit`
        router.get(url)
    }, [config])

    /**
     * Navega a la página de ver detalles
     */
    const goToShow = useCallback((entity: T) => {
        const url = config.urls?.show
            ? config.urls.show(entity.id)
            : `/${config.pluralName}/${entity.id}`
        router.get(url)
    }, [config])

    /**
     * Elimina una entidad
     */
    const handleDelete = useCallback((entity: T) => {
        const entityName = 'nombre' in entity ? String(entity.nombre) : `${config.name} #${entity.id}`

        if (!confirm(`¿Estás seguro de que quieres eliminar ${entityName}?`)) {
            return
        }

        const loadingToast = NotificationService.loading(`Eliminando ${config.name}...`)

        try {
            service.destroy(entity.id)
            NotificationService.dismiss(loadingToast)
            NotificationService.success(`${config.name} eliminado exitosamente`)
        } catch (error) {
            NotificationService.dismiss(loadingToast)
            NotificationService.error(`Error al eliminar ${config.name}`)
            
        }
    }, [config, service])

    /**
     * Maneja el ordenamiento de columnas
     */
    const handleSort = useCallback((columnKey: string) => {
        const newDirection: 'asc' | 'desc' = sortBy === columnKey && sortDirection === 'asc' ? 'desc' : 'asc'

        setSortBy(columnKey)
        setSortDirection(newDirection)

        const sortFilters: Filters = {
            ...filters,
            search: searchTerm || undefined,
            order_by: columnKey,
            order_dir: newDirection
        }

        setIsLoading(true)
        service.search(sortFilters)
        setTimeout(() => setIsLoading(false), 500)
    }, [sortBy, sortDirection, filters, searchTerm, service])

    /**
     * Navega a una página específica
     */
    const goToPage = useCallback((url: string | null) => {
        if (!url) return

        setIsLoading(true)
        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        })
    }, [])

    /**
     * Actualiza un filtro y aplica automáticamente (opcional)
     */
    const handleFilterChange = useCallback((key: string, value: unknown, applyImmediately = false) => {
        updateFilter(key, value)

        if (applyImmediately) {
            const newFilters = { ...filters, [key]: value }
            setIsLoading(true)
            service.search(newFilters)
            setTimeout(() => setIsLoading(false), 500)
        }
    }, [filters, updateFilter, service])

    return {
        // Data
        data,
        entities: data.data,
        pagination: data,

        // Search state
        searchTerm,
        setSearchTerm,

        // Filters state
        filters,
        hasActiveFilters,

        // Sort state
        sortBy,
        sortDirection,

        // Loading state
        isLoading,

        // Search actions
        handleSearch,
        clearFilters,

        // Navigation actions
        goToCreate,
        goToEdit,
        goToShow,
        goToPage,

        // CRUD actions
        handleDelete,

        // Sort actions
        handleSort,

        // Filter actions
        handleFilterChange,
        applyFilters,
        updateFilter,
    }
}
