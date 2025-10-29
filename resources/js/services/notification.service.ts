// Service Layer: Notification service using Sonner
import { toast } from 'sonner'

/**
 * Servicio centralizado de notificaciones usando Sonner
 * Arquitectura de 3 capas - Capa de Servicio
 *
 * Sonner es la librería oficial de notificaciones de shadcn/ui
 * - Moderna y ligera
 * - Animaciones suaves
 * - Mejor UX
 */
class NotificationService {
    /**
     * Muestra una notificación de éxito
     * @param message - Mensaje a mostrar
     * @param options - Opciones adicionales (duration, description, action, etc)
     */
    success(message: string, options?: {
        description?: string
        duration?: number
        action?: { label: string; onClick: () => void }
    }): string | number {
        return toast.success(message, options)
    }

    /**
     * Muestra una notificación de error
     * @param message - Mensaje a mostrar
     * @param options - Opciones adicionales
     */
    error(message: string, options?: {
        description?: string
        duration?: number
        action?: { label: string; onClick: () => void }
    }): string | number {
        return toast.error(message, options)
    }

    /**
     * Muestra una notificación informativa
     * @param message - Mensaje a mostrar
     * @param options - Opciones adicionales
     */
    info(message: string, options?: {
        description?: string
        duration?: number
        action?: { label: string; onClick: () => void }
    }): string | number {
        return toast.info(message, options)
    }

    /**
     * Muestra una notificación de advertencia
     * @param message - Mensaje a mostrar
     * @param options - Opciones adicionales
     */
    warning(message: string, options?: {
        description?: string
        duration?: number
        action?: { label: string; onClick: () => void }
    }): string | number {
        return toast.warning(message, options)
    }

    /**
     * Muestra una notificación de carga
     * @param message - Mensaje a mostrar
     * @param options - Opciones adicionales
     */
    loading(message: string, options?: {
        description?: string
    }): string | number {
        return toast.loading(message, options)
    }

    /**
     * Muestra una notificación con promesa (loading -> success/error automático)
     * @param promise - Promesa a ejecutar
     * @param messages - Mensajes para cada estado
     */
    promise<T>(
        promise: Promise<T>,
        messages: {
            loading: string
            success: string | ((data: T) => string)
            error: string | ((error: any) => string)
        },
        options?: {
            description?: string
            duration?: number
        }
    ): Promise<T> {
        return toast.promise(promise, messages, options)
    }

    /**
     * Muestra una notificación personalizada
     * @param message - Mensaje a mostrar
     * @param options - Opciones adicionales
     */
    message(message: string, options?: {
        description?: string
        duration?: number
        action?: { label: string; onClick: () => void }
    }): string | number {
        return toast(message, options)
    }

    /**
     * Cierra una notificación específica
     * @param toastId - ID de la notificación a cerrar
     */
    dismiss(toastId?: string | number): void {
        if (toastId !== undefined) {
            toast.dismiss(toastId)
        } else {
            toast.dismiss()
        }
    }

    /**
     * Cierra todas las notificaciones
     */
    dismissAll(): void {
        toast.dismiss()
    }
}

// Exportar singleton
export default new NotificationService()
