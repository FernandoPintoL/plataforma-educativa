// Domain Layer: Profesores types and interfaces

export interface Profesor {
    id: number
    name: string
    apellido?: string
    usernick: string
    email: string
    fecha_nacimiento?: string
    telefono?: string
    direccion?: string
    activo: boolean
    tipo_usuario: 'profesor'
    created_at: string
    updated_at: string
    roles: Rol[]
    permissions: Permiso[]
    cursosComoProfesor?: Curso[]
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
    estudiantes_count?: number
    estudiantes?: Array<{
        id: number
        name: string
        apellido?: string
    }>
}

export interface ProfesorFormData {
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

export interface ProfesorFilters {
    search?: string
    curso?: string
    activo?: string | boolean
    page?: number
}

export interface ProfesoresPaginated {
    data: Profesor[]
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

export interface ProfesorCreatePageProps {
    roles: Rol[]
    permissions: Record<string, Permiso[]>
}

export interface ProfesorEditPageProps {
    profesor: Profesor
    roles: Rol[]
    permissions: Record<string, Permiso[]>
    userPermissions: number[]
}

export interface ProfesorShowPageProps {
    profesor: Profesor
    allPermissions?: Permiso[]
}

export interface ProfesorIndexPageProps {
    profesores: ProfesoresPaginated
    filters: ProfesorFilters
}
