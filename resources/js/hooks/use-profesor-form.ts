// Business Logic Layer: Profesor form hook
import { useForm } from '@inertiajs/react'
import { useCallback } from 'react'
import type { ProfesorFormData } from '@/domain/profesores'
import toast from 'react-hot-toast'

interface UseProfesorFormProps {
    initialData?: Partial<ProfesorFormData>
    profesorId?: number
    mode: 'create' | 'edit'
}

export function useProfesorForm({ initialData, profesorId, mode }: UseProfesorFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm<ProfesorFormData>({
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

        const url = mode === 'create' ? '/profesores' : `/profesores/${profesorId}`
        const method = mode === 'create' ? post : put

        method(url, {
            onSuccess: () => {
                if (mode === 'create') {
                    reset()
                }
                toast.success(
                    mode === 'create'
                        ? 'Profesor creado exitosamente'
                        : 'Profesor actualizado exitosamente'
                )
            },
            onError: () => {
                toast.error(
                    mode === 'create'
                        ? 'Error al crear el profesor'
                        : 'Error al actualizar el profesor'
                )
            }
        })
    }, [mode, profesorId, post, put, reset])

    /**
     * Cancela el formulario y vuelve al listado
     */
    const handleCancel = useCallback(() => {
        window.location.href = '/profesores'
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
