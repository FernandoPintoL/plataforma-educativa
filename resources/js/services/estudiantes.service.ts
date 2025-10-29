// Service Layer: Estudiantes data access
import { router } from '@inertiajs/react'
import type { Estudiante, EstudianteFilters, EstudianteFormData } from '@/domain/estudiantes'
import type { BaseService, Filters } from '@/domain/generic'
import type { Id } from '@/domain/shared'
import NotificationService from '@/services/notification.service'

export class EstudiantesService implements BaseService<Estudiante, EstudianteFormData> {
    private readonly baseUrl = '/estudiantes'

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
        const queryParams = filters ? this.buildQueryParams(filters as EstudianteFilters) : {}
        router.get(this.baseUrl, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                NotificationService.error('Error al cargar los estudiantes')
            }
        })
    }

    validateData(data: EstudianteFormData): string[] {
        const errors: string[] = []
        if (!data.name || data.name.trim().length === 0) {
            errors.push('El nombre es requerido')
        }
        if (!data.email || data.email.trim().length === 0) {
            errors.push('El email es requerido')
        }
        if (!data.usernick || data.usernick.trim().length === 0) {
            errors.push('El nombre de usuario es requerido')
        }
        return errors
    }

    /**
     * Navega al listado de estudiantes con filtros
     */
    index(filters?: EstudianteFilters) {
        const queryParams = filters ? this.buildQueryParams(filters) : {}

        router.get(this.baseUrl, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                NotificationService.error('Error al cargar los estudiantes')
            }
        })
    }

    /**
     * Navega a la página de crear estudiante
     */
    create() {
        router.get(`${this.baseUrl}/create`)
    }

    /**
     * Navega a la página de editar estudiante
     */
    edit(id: Id) {
        router.get(`${this.baseUrl}/${id}/edit`)
    }

    /**
     * Navega a la página de ver estudiante
     */
    show(id: Id) {
        router.get(`${this.baseUrl}/${id}`)
    }

    /**
     * Elimina un estudiante
     */
    destroy(id: Id, onSuccess?: () => void) {
        if (!confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
            return
        }

        const loadingToast = NotificationService.loading('Eliminando estudiante...')

        router.delete(`${this.baseUrl}/${id}`, {
            preserveState: true,
            onSuccess: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.success('Estudiante eliminado exitosamente')
                onSuccess?.()
            },
            onError: () => {
                NotificationService.dismiss(loadingToast)
                NotificationService.error('Error al eliminar el estudiante')
            }
        })
    }

    /**
     * Alterna el estado activo/inactivo de un estudiante
     */
    toggleStatus(id: number, currentStatus: boolean) {
        const action = currentStatus ? 'desactivar' : 'activar'

        if (!confirm(`¿Estás seguro de que quieres ${action} este estudiante?`)) {
            return
        }

        router.patch(`${this.baseUrl}/${id}/toggle-status`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                NotificationService.success(`Estudiante ${currentStatus ? 'desactivado' : 'activado'} exitosamente`)
            },
            onError: () => {
                NotificationService.error(`Error al ${action} el estudiante`)
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
    private buildQueryParams(filters: EstudianteFilters): Record<string, any> {
        const params: Record<string, any> = {}

        if (filters.search) params.search = filters.search
        if (filters.curso) params.curso = filters.curso
        if (filters.activo !== undefined && filters.activo !== '') params.activo = filters.activo
        if (filters.page) params.page = filters.page

        return params
    }
}

// Export singleton instance
export const estudiantesService = new EstudiantesService()
