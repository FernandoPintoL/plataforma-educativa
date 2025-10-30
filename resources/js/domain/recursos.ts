// Domain Layer: Recursos types and interfaces
import type { BaseEntity, BaseFormData } from './generic'
import type { Pagination, Filters } from './shared'

export interface Recurso extends BaseEntity {
    id: number
    nombre: string
    tipo: 'video' | 'documento' | 'imagen' | 'audio' | 'enlace' | 'presentacion'
    url?: string
    descripcion?: string
    archivo_path?: string
    tamaño?: number // en bytes
    mime_type?: string
    activo: boolean
    created_at: string
    updated_at: string
}

export interface RecursoFormData extends BaseFormData {
    nombre: string
    tipo: 'video' | 'documento' | 'imagen' | 'audio' | 'enlace' | 'presentacion'
    descripcion?: string
    url?: string
    archivo?: File | null
    activo?: boolean
}

export interface RecursoIndexPageProps {
    recursos: Pagination<Recurso>
    filters: Filters
}

export interface RecursoCreatePageProps {
    // No necesita datos adicionales
}

export interface RecursoEditPageProps {
    recurso: Recurso
}

export interface RecursoShowPageProps {
    recurso: Recurso
}
