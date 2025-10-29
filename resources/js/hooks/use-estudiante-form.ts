// Business Logic Layer: Estudiante form hook
import { useForm } from '@inertiajs/react'
import { useCallback } from 'react'
import type { EstudianteFormData } from '@/domain/estudiantes'
import NotificationService from '@/services/notification.service'

interface UseEstudianteFormProps {
    initialData?: Partial<EstudianteFormData>
    estudianteId?: number
    mode: 'create' | 'edit'
}

export function useEstudianteForm({ initialData, estudianteId, mode }: UseEstudianteFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<EstudianteFormData>({
        name: initialData?.name || '',
        apellido: initialData?.apellido || '',
        usernick: initialData?.usernick || '',
        email: initialData?.email || '',
        password: '',
        password_confirmation: '',
        fecha_nacimiento: initialData?.fecha_nacimiento || '',
        telefono: initialData?.telefono || '',
        direccion: initialData?.direccion || '',
        activo: initialData?.activo ?? true,
        permissions: initialData?.permissions || [],
    })

    /**
     * Maneja el cambio de permisos
     */
    const handlePermissionChange = useCallback((permissionId: number) => {
        setData('permissions', data.permissions.includes(permissionId)
            ? data.permissions.filter(p => p !== permissionId)
            : [...data.permissions, permissionId]
        )
    }, [data.permissions, setData])

    /**
     * Maneja el submit del formulario
     */
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()

        const url = mode === 'create' ? '/estudiantes' : `/estudiantes/${estudianteId}`
        const method = mode === 'create' ? post : put

        method(url, {
            onSuccess: () => {
                if (mode === 'create') {
                    reset()
                }
                NotificationService.success(
                    mode === 'create'
                        ? 'Estudiante creado exitosamente'
                        : 'Estudiante actualizado exitosamente'
                )
            },
            onError: () => {
                NotificationService.error(
                    mode === 'create'
                        ? 'Error al crear el estudiante'
                        : 'Error al actualizar el estudiante'
                )
            }
        })
    }, [mode, estudianteId, post, put, reset])

    /**
     * Cancela el formulario y vuelve al listado
     */
    const handleCancel = useCallback(() => {
        window.location.href = '/estudiantes'
    }, [])

    return {
        // Form data
        data,
        setData,
        processing,
        errors,

        // Actions
        handleSubmit,
        handleCancel,
        handlePermissionChange,

        // Computed
        isCreating: mode === 'create',
        isEditing: mode === 'edit',
    }
}
