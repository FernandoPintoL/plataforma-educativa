// Service Layer: Módulos Educativos data access
import { router } from '@inertiajs/react'
import type { ModuloEducativo, ModuloEducativoFormData } from '@/domain/modulos'
import type { BaseService, Filters } from '@/domain/generic'
import type { Id } from '@/domain/shared'
import NotificationService from '@/services/notification.service'

export class ModulosEducativosService implements BaseService<ModuloEducativo, ModuloEducativoFormData> {
    private readonly baseUrl = '/modulos'

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
                NotificationService.error('Error al cargar los módulos')
            }
        })
    }

    validateData(data: ModuloEducativoFormData): string[] {
        const errors: string[] = []
        if (!data.titulo || data.titulo.trim().length === 0) {
            errors.push('El título es requerido')
        }
        if (!data.curso_id) {
            errors.push('Debes seleccionar un curso')
        }
        return errors
    }

    /**
     * Navega al listado de módulos con filtros
     */
    index(filters?: Filters) {
        const queryParams = filters ? this.buildQueryParams(filters) : {}

        router.get(this.baseUrl, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                NotificationService.error('Error al cargar los módulos')
            }
        })
    }

    /**
     * Navega a la página de crear módulo
     */
    create() {
        router.get(`${this.baseUrl}/create`)
    }

    /**
     * Navega a la página de editar módulo
     */
    edit(id: Id) {
        router.get(`${this.baseUrl}/${id}/edit`)
    }

    /**
     * Navega a la página de ver módulo
     */
    show(id: Id) {
        router.get(`${this.baseUrl}/${id}`)
    }

    /**
     * Elimina un módulo
     */
    destroy(id: Id, onSuccess?: () => void) {
        if (!confirm('¿Estás seguro de que quieres eliminar este módulo? Se eliminarán todas sus lecciones.')) {
            return
        }

        const loadingToast = NotificationService.loading('Eliminando módulo...')

        router.delete(`${this.baseUrl}/${id}`, {
            preserveState: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Módulo eliminado exitosamente')
                onSuccess?.()
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al eliminar el módulo')
            }
        })
    }

    /**
     * Publica un módulo
     */
    publicar(id: Id) {
        if (!confirm('¿Estás seguro de que quieres publicar este módulo? Los estudiantes podrán verlo.')) {
            return
        }

        const loadingToast = NotificationService.loading('Publicando módulo...')

        router.patch(`${this.baseUrl}/${id}/publicar`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Módulo publicado exitosamente')
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al publicar el módulo')
            }
        })
    }

    /**
     * Archiva un módulo
     */
    archivar(id: Id) {
        if (!confirm('¿Estás seguro de que quieres archivar este módulo? Los estudiantes no podrán verlo.')) {
            return
        }

        const loadingToast = NotificationService.loading('Archivando módulo...')

        router.patch(`${this.baseUrl}/${id}/archivar`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Módulo archivado exitosamente')
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al archivar el módulo')
            }
        })
    }

    /**
     * Duplica un módulo
     */
    duplicar(id: Id) {
        if (!confirm('¿Deseas duplicar este módulo con todas sus lecciones?')) {
            return
        }

        const loadingToast = NotificationService.loading('Duplicando módulo...')

        router.post(`${this.baseUrl}/${id}/duplicar`, {}, {
            preserveState: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Módulo duplicado exitosamente')
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al duplicar el módulo')
            }
        })
    }

    /**
     * Reordena los módulos
     */
    reordenar(orden: number[]) {
        router.post(`${this.baseUrl}/reordenar`, { orden }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                NotificationService.success('Módulos reordenados exitosamente')
            },
            onError: () => {
                NotificationService.error('Error al reordenar los módulos')
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
        if (filters.curso_id) params.curso_id = filters.curso_id
        if (filters.estado) params.estado = filters.estado
        if (filters.sort) params.sort = filters.sort
        if (filters.direction) params.direction = filters.direction
        if (filters.page) params.page = filters.page

        return params
    }
}

// Export singleton instance
export const modulosEducativosService = new ModulosEducativosService()
