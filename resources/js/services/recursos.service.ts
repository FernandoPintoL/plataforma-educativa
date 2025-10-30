// Service Layer: Recursos data access
import { router } from '@inertiajs/react'
import type { Recurso, RecursoFormData } from '@/domain/recursos'
import type { BaseService, Filters } from '@/domain/generic'
import type { Id } from '@/domain/shared'
import NotificationService from '@/services/notification.service'

export class RecursosService implements BaseService<Recurso, RecursoFormData> {
    private readonly baseUrl = '/recursos'

    // Métodos requeridos por BaseService
    indexUrl(params?: { query?: Filters }): string {
        return this.baseUrl
    }

    createUrl(): string {
        return `${this.baseUrl}/create`
    }

    editUrl(id: Id): string {
        return `${this.baseUrl}/${id}/edit`
    }

    storeUrl(): string {
        return this.baseUrl
    }

    updateUrl(id: Id): string {
        return `${this.baseUrl}/${id}`
    }

    destroyUrl(id: Id): string {
        return `${this.baseUrl}/${id}`
    }

    search(filters: Filters): void {
        const queryParams = filters ? this.buildQueryParams(filters) : {}
        router.get(this.baseUrl, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                NotificationService.error('Error al cargar los recursos')
            }
        })
    }

    validateData(data: RecursoFormData): string[] {
        const errors: string[] = []
        if (!data.nombre || data.nombre.trim().length === 0) {
            errors.push('El nombre es requerido')
        }
        if (!data.tipo) {
            errors.push('Debes seleccionar un tipo de recurso')
        }
        // Validar que haya URL o archivo
        if (!data.url && !data.archivo) {
            errors.push('Debes proporcionar una URL o subir un archivo')
        }
        return errors
    }

    /**
     * Navega al listado de recursos con filtros
     */
    index(filters?: Filters) {
        const queryParams = filters ? this.buildQueryParams(filters) : {}

        router.get(this.baseUrl, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                NotificationService.error('Error al cargar los recursos')
            }
        })
    }

    /**
     * Navega a la página de crear recurso
     */
    create() {
        router.get(`${this.baseUrl}/create`)
    }

    /**
     * Navega a la página de editar recurso
     */
    edit(id: Id) {
        router.get(`${this.baseUrl}/${id}/edit`)
    }

    /**
     * Navega a la página de ver recurso
     */
    show(id: Id) {
        router.get(`${this.baseUrl}/${id}`)
    }

    /**
     * Elimina un recurso
     */
    destroy(id: Id, onSuccess?: () => void) {
        if (!confirm('¿Estás seguro de que quieres eliminar este recurso?')) {
            return
        }

        const loadingToast = NotificationService.loading('Eliminando recurso...')

        router.delete(`${this.baseUrl}/${id}`, {
            preserveState: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Recurso eliminado exitosamente')
                onSuccess?.()
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al eliminar el recurso')
            }
        })
    }

    /**
     * Descarga un recurso
     */
    descargar(id: Id) {
        window.location.href = `${this.baseUrl}/${id}/descargar`
    }

    /**
     * Ver un recurso (stream)
     */
    ver(id: Id) {
        window.open(`${this.baseUrl}/${id}/ver`, '_blank')
    }

    /**
     * Alterna el estado activo de un recurso
     */
    toggleActivo(id: Id, activo: boolean) {
        const loadingToast = NotificationService.loading('Actualizando estado...')

        router.patch(`${this.baseUrl}/${id}`, { activo }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success(
                    activo ? 'Recurso activado' : 'Recurso desactivado'
                )
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al actualizar el estado')
            }
        })
    }

    /**
     * Limpia los filtros
     */
    clearFilters() {
        router.get(this.baseUrl, {}, {
            preserveState: false,
            preserveScroll: false
        })
    }

    /**
     * Construye los query params desde los filtros
     */
    private buildQueryParams(filters: Filters): Record<string, any> {
        const params: Record<string, any> = {}

        if (filters.search) params.search = filters.search
        if (filters.tipo) params.tipo = filters.tipo
        if (filters.activo !== undefined) params.activo = filters.activo
        if (filters.sort) params.sort = filters.sort
        if (filters.direction) params.direction = filters.direction
        if (filters.page) params.page = filters.page

        return params
    }
}

// Export singleton instance
export const recursosService = new RecursosService()
