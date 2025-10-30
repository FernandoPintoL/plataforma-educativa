// Service Layer: Lecciones data access
import { router } from '@inertiajs/react'
import type { Leccion, LeccionFormData } from '@/domain/modulos'
import type { BaseService, Filters } from '@/domain/generic'
import type { Id } from '@/domain/shared'
import NotificationService from '@/services/notification.service'

export class LeccionesService implements BaseService<Leccion, LeccionFormData> {
    private readonly baseUrl = '/lecciones'

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
                NotificationService.error('Error al cargar las lecciones')
            }
        })
    }

    validateData(data: LeccionFormData): string[] {
        const errors: string[] = []
        if (!data.titulo || data.titulo.trim().length === 0) {
            errors.push('El título es requerido')
        }
        if (!data.modulo_educativo_id) {
            errors.push('Debes seleccionar un módulo educativo')
        }
        if (!data.tipo) {
            errors.push('Debes seleccionar un tipo de lección')
        }
        return errors
    }

    /**
     * Navega al listado de lecciones con filtros
     */
    index(filters?: Filters) {
        const queryParams = filters ? this.buildQueryParams(filters) : {}

        router.get(this.baseUrl, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                NotificationService.error('Error al cargar las lecciones')
            }
        })
    }

    /**
     * Navega a la página de crear lección
     */
    create(moduloId?: number) {
        const url = moduloId
            ? `${this.baseUrl}/create?modulo_id=${moduloId}`
            : `${this.baseUrl}/create`

        router.get(url)
    }

    /**
     * Navega a la página de editar lección
     */
    edit(id: Id) {
        router.get(`${this.baseUrl}/${id}/edit`)
    }

    /**
     * Navega a la página de ver lección
     */
    show(id: Id) {
        router.get(`${this.baseUrl}/${id}`)
    }

    /**
     * Elimina una lección
     */
    destroy(id: Id, onSuccess?: () => void) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta lección?')) {
            return
        }

        const loadingToast = NotificationService.loading('Eliminando lección...')

        router.delete(`${this.baseUrl}/${id}`, {
            preserveState: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Lección eliminada exitosamente')
                onSuccess?.()
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al eliminar la lección')
            }
        })
    }

    /**
     * Publica una lección
     */
    publicar(id: Id) {
        if (!confirm('¿Estás seguro de que quieres publicar esta lección?')) {
            return
        }

        const loadingToast = NotificationService.loading('Publicando lección...')

        router.patch(`${this.baseUrl}/${id}/publicar`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Lección publicada exitosamente')
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al publicar la lección')
            }
        })
    }

    /**
     * Archiva una lección
     */
    archivar(id: Id) {
        if (!confirm('¿Estás seguro de que quieres archivar esta lección?')) {
            return
        }

        const loadingToast = NotificationService.loading('Archivando lección...')

        router.patch(`${this.baseUrl}/${id}/archivar`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Lección archivada exitosamente')
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al archivar la lección')
            }
        })
    }

    /**
     * Duplica una lección
     */
    duplicar(id: Id) {
        if (!confirm('¿Deseas duplicar esta lección?')) {
            return
        }

        const loadingToast = NotificationService.loading('Duplicando lección...')

        router.post(`${this.baseUrl}/${id}/duplicar`, {}, {
            preserveState: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Lección duplicada exitosamente')
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al duplicar la lección')
            }
        })
    }

    /**
     * Reordena las lecciones
     */
    reordenar(orden: number[]) {
        router.post(`${this.baseUrl}/reordenar`, { orden }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                NotificationService.success('Lecciones reordenadas exitosamente')
            },
            onError: () => {
                NotificationService.error('Error al reordenar las lecciones')
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
        if (filters.modulo_id) params.modulo_id = filters.modulo_id
        if (filters.tipo) params.tipo = filters.tipo
        if (filters.estado) params.estado = filters.estado
        if (filters.sort) params.sort = filters.sort
        if (filters.direction) params.direction = filters.direction
        if (filters.page) params.page = filters.page

        return params
    }
}

// Export singleton instance
export const leccionesService = new LeccionesService()
