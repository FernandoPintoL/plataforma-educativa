// Domain Layer: Estudiantes types and interfaces
import type { BaseEntity, BaseFormData } from './generic'
import type { Pagination, Filters } from './shared'

export interface Estudiante extends BaseEntity {
    id: number
    name: string
    apellido?: string
    usernick: string
    email: string
    fecha_nacimiento?: string
    telefono?: string
    direccion?: string
    activo: boolean
    tipo_usuario: 'estudiante'
    created_at: string
    updated_at: string
    roles: Rol[]
    permissions: Permiso[]
    cursosComoEstudiante?: Curso[]
    trabajos?: Trabajo[]
    perfilVocacional?: PerfilVocacional
    rendimientoAcademico?: RendimientoAcademico
}

export interface Rol {
    id: number
    name: string
    permissions?: Permiso[]
}

export interface Permiso {
    id: number
    name: string
    description?: string
}

export interface Curso {
    id: number
    nombre: string
    codigo?: string
    profesor: {
        id: number
        name: string
        apellido?: string
    }
    estudiantes_count?: number
}

export interface Trabajo {
    id: number
    tarea: {
        id: number
        titulo: string
    }
    calificacion?: number
    estado: string
}

export interface PerfilVocacional {
    id: number
    intereses: string[]
    habilidades: string[]
}

export interface RendimientoAcademico {
    id: number
    promedio_general: number
    asistencia: number
}

export interface EstudianteFormData extends BaseFormData {
    name: string
    apellido: string
    usernick: string
    email: string
    password?: string
    password_confirmation?: string
    fecha_nacimiento: string
    telefono: string
    direccion: string
    activo?: boolean
    permissions: number[]
}

export interface EstudianteFilters {
    search?: string
    curso?: string
    activo?: string | boolean
    page?: number
}

export interface EstudiantesPaginated {
    data: Estudiante[]
    links: PaginationLink[]
    meta: PaginationMeta
}

export interface PaginationLink {
    url: string | null
    label: string
    active: boolean
}

export interface PaginationMeta {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
}

export interface EstudianteCreatePageProps {
    roles: Rol[]
    permissions: Record<string, Permiso[]>
}

export interface EstudianteEditPageProps {
    estudiante: Estudiante
    roles: Rol[]
    permissions: Record<string, Permiso[]>
    userPermissions: number[]
}

export interface EstudianteShowPageProps {
    estudiante: Estudiante
    allPermissions?: Permiso[]
}

export interface EstudianteIndexPageProps {
    estudiantes: Pagination<Estudiante>
    filters: Filters
}
