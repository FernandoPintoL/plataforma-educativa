// Service Layer: Profesores data access
import { router } from '@inertiajs/react'
import type { ProfesorFilters } from '@/domain/profesores'
import toast from 'react-hot-toast'

export class ProfesoresService {
    private readonly baseUrl = '/profesores'

    /**
     * Navega al listado de profesores con filtros
     */
    index(filters?: ProfesorFilters) {
        const queryParams = filters ? this.buildQueryParams(filters) : {}

        router.get(this.baseUrl, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                toast.error('Error al cargar los profesores')
            }
        })
    }

    /**
     * Navega a la página de crear profesor
     */
    create() {
        router.get(`${this.baseUrl}/create`)
    }

    /**
     * Navega a la página de editar profesor
     */
    edit(id: number) {
        router.get(`${this.baseUrl}/${id}/edit`)
    }

    /**
     * Navega a la página de ver profesor
     */
    show(id: number) {
        router.get(`${this.baseUrl}/${id}`)
    }

    /**
     * Elimina un profesor
     */
    destroy(id: number, onSuccess?: () => void) {
        if (!confirm('¿Estás seguro de que quieres eliminar este profesor?')) {
            return
        }

        const loadingToast = toast.loading('Eliminando profesor...')

        router.delete(`${this.baseUrl}/${id}`, {
            preserveState: true,
            onSuccess: () => {
                toast.dismiss(loadingToast)
                toast.success('Profesor eliminado exitosamente')
                onSuccess?.()
            },
            onError: () => {
                toast.dismiss(loadingToast)
                toast.error('Error al eliminar el profesor')
            }
        })
    }

    /**
     * Alterna el estado activo/inactivo de un profesor
     */
    toggleStatus(id: number, currentStatus: boolean) {
        const action = currentStatus ? 'desactivar' : 'activar'

        if (!confirm(`¿Estás seguro de que quieres ${action} este profesor?`)) {
            return
        }

        router.patch(`${this.baseUrl}/${id}/toggle-status`, {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Profesor ${currentStatus ? 'desactivado' : 'activado'} exitosamente`)
            },
            onError: () => {
                toast.error(`Error al ${action} el profesor`)
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
    private buildQueryParams(filters: ProfesorFilters): Record<string, any> {
        const params: Record<string, any> = {}

        if (filters.search) params.search = filters.search
        if (filters.curso) params.curso = filters.curso
        if (filters.activo !== undefined && filters.activo !== '') params.activo = filters.activo
        if (filters.page) params.page = filters.page

        return params
    }
}

// Export singleton instance
export const profesoresService = new ProfesoresService()
