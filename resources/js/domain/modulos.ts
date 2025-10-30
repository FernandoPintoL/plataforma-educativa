// Domain Layer: Módulos Educativos types and interfaces
import type { BaseEntity, BaseFormData } from './generic'
import type { Pagination, Filters } from './shared'

export interface Curso {
    id: number
    nombre: string
    codigo: string
    descripcion?: string
    activo: boolean
}

export interface Usuario {
    id: number
    name: string
    apellido?: string
    email: string
    tipo_usuario: string
}

export interface Leccion {
    id: number
    modulo_educativo_id: number
    titulo: string
    contenido?: string
    slug: string
    tipo: 'video' | 'lectura' | 'actividad' | 'quiz' | 'recurso' | 'enlace'
    orden: number
    duracion_estimada?: number
    video_url?: string
    video_proveedor?: 'youtube' | 'vimeo' | 'local'
    es_obligatoria: boolean
    permite_descarga: boolean
    estado: 'borrador' | 'publicado' | 'archivado'
    created_at: string
    updated_at: string
    recursos?: Recurso[]
}

export interface Recurso {
    id: number
    nombre: string
    tipo: string
    url?: string
    descripcion?: string
    archivo_path?: string
    tamaño?: number
    mime_type?: string
    activo: boolean
    pivot?: {
        orden: number
    }
}

export interface ModuloEducativo extends BaseEntity {
    id: number
    titulo: string
    descripcion?: string
    slug: string
    curso_id: number
    orden: number
    imagen_portada?: string
    estado: 'borrador' | 'publicado' | 'archivado'
    duracion_estimada?: number
    creador_id: number
    created_at: string
    updated_at: string

    // Relaciones
    curso?: Curso
    creador?: Usuario
    lecciones?: Leccion[]

    // Campos calculados
    total_lecciones?: number
    duracion_total?: number
    progreso?: {
        total: number
        completadas: number
        porcentaje: number
    }
}

export interface ModuloEducativoFormData extends BaseFormData {
    titulo: string
    descripcion?: string
    slug?: string
    curso_id: number | string
    orden?: number
    imagen_portada?: File | string | null
    estado?: 'borrador' | 'publicado' | 'archivado'
    duracion_estimada?: number
}

export interface LeccionFormData extends BaseFormData {
    modulo_educativo_id: number | string
    titulo: string
    contenido?: string
    slug?: string
    tipo: 'video' | 'lectura' | 'actividad' | 'quiz' | 'recurso' | 'enlace'
    orden?: number
    duracion_estimada?: number
    video_url?: string
    video_proveedor?: 'youtube' | 'vimeo' | 'local'
    es_obligatoria?: boolean
    permite_descarga?: boolean
    estado?: 'borrador' | 'publicado' | 'archivado'
    recursos?: number[]
}

export interface ModuloEducativoIndexPageProps {
    modulos: Pagination<ModuloEducativo>
    cursos: Curso[]
    filters: Filters
}

export interface ModuloEducativoCreatePageProps {
    cursos: Curso[]
}

export interface ModuloEducativoEditPageProps {
    modulo: ModuloEducativo
    cursos: Curso[]
}

export interface ModuloEducativoShowPageProps {
    modulo: ModuloEducativo
}

export interface LeccionIndexPageProps {
    lecciones: Pagination<Leccion>
    modulos: ModuloEducativo[]
    filters: Filters
}

export interface LeccionCreatePageProps {
    modulos: ModuloEducativo[]
    modulo_id?: number
    recursos: Recurso[]
}

export interface LeccionEditPageProps {
    leccion: Leccion
    modulos: ModuloEducativo[]
    recursos: Recurso[]
    recursos_asociados: number[]
}

export interface LeccionShowPageProps {
    leccion: Leccion
    leccion_anterior?: Leccion | null
    leccion_siguiente?: Leccion | null
}
