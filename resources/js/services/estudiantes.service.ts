// Service Layer: Estudiantes data access
import { router } from '@inertiajs/react'
import type { EstudianteFilters } from '@/domain/estudiantes'
import toast from 'react-hot-toast'

export class EstudiantesService {
    private readonly baseUrl = '/estudiantes'

    /**
     * Navega al listado de estudiantes con filtros
     */
    index(filters?: EstudianteFilters) {
        const queryParams = filters ? this.buildQueryParams(filters) : {}

        router.get(this.baseUrl, queryParams, {
            preserveState: true,
            preserveScroll: true,
            onError: () => {
                toast.error('Error al cargar los estudiantes')
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
    edit(id: number) {
        router.get(`${this.baseUrl}/${id}/edit`)
    }

    /**
     * Navega a la página de ver estudiante
     */
    show(id: number) {
        router.get(`${this.baseUrl}/${id}`)
    }

    /**
     * Elimina un estudiante
     */
    destroy(id: number, onSuccess?: () => void) {
        if (!confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
            return
        }

        const loadingToast = toast.loading('Eliminando estudiante...')

        router.delete(`${this.baseUrl}/${id}`, {
            preserveState: true,
            onSuccess: () => {
                toast.dismiss(loadingToast)
                toast.success('Estudiante eliminado exitosamente')
                onSuccess?.()
            },
            onError: () => {
                toast.dismiss(loadingToast)
                toast.error('Error al eliminar el estudiante')
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
                toast.success(`Estudiante ${currentStatus ? 'desactivado' : 'activado'} exitosamente`)
            },
            onError: () => {
                toast.error(`Error al ${action} el estudiante`)
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
