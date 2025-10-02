// Tipos de usuario
export interface User {
  id: number;
  name: string;
  apellido?: string;
  email: string;
  tipo_usuario: 'profesor' | 'estudiante' | 'director' | 'padre' | 'admin';
  roles: string[];
  permissions: string[];
  is_profesor: boolean;
  is_estudiante: boolean;
  is_director: boolean;
  is_padre: boolean;
  is_admin: boolean;
}

// Tipos de curso
export interface Curso {
  id: number;
  nombre: string;
  descripcion?: string;
  codigo: string;
  estado: 'activo' | 'inactivo' | 'finalizado';
  fecha_inicio?: string;
  fecha_fin?: string;
  capacidad_maxima?: number;
  profesor: User;
  estudiantes?: User[];
  created_at: string;
  updated_at: string;
}

// Tipos de contenido
export interface Contenido {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha_creacion: string;
  fecha_limite?: string;
  tipo: 'tarea' | 'evaluacion';
  estado: 'borrador' | 'publicado' | 'finalizado';
  creador: User;
  curso: Curso;
  created_at: string;
  updated_at: string;
}

// Tipos de tarea
export interface Tarea {
  id: number;
  contenido_id: number;
  instrucciones: string;
  puntuacion: number;
  permite_archivos: boolean;
  max_archivos: number;
  tipo_archivo_permitido?: string;
  created_at: string;
  updated_at: string;
}

// Tipos de evaluación
export interface Evaluacion {
  id: number;
  contenido_id: number;
  tipo_evaluacion: string;
  puntuacion_total: number;
  tiempo_limite?: number;
  calificacion_automatica: boolean;
  mostrar_respuestas: boolean;
  permite_reintento: boolean;
  max_reintentos: number;
  created_at: string;
  updated_at: string;
}

// Tipos de pregunta
export interface Pregunta {
  id: number;
  evaluacion_id: number;
  enunciado: string;
  tipo: 'opcion_multiple' | 'verdadero_falso' | 'respuesta_corta' | 'respuesta_larga';
  opciones?: string[];
  respuesta_correcta?: string;
  puntos: number;
  orden: number;
  created_at: string;
  updated_at: string;
}

// Tipos de trabajo
export interface Trabajo {
  id: number;
  contenido_id: number;
  estudiante_id: number;
  respuestas?: Record<string, any>;
  comentarios?: string;
  estado: 'en_progreso' | 'entregado' | 'calificado' | 'devuelto';
  fecha_entrega?: string;
  fecha_inicio?: string;
  tiempo_total?: number;
  intentos: number;
  consultas_material: number;
  estudiante: User;
  contenido: Contenido;
  calificacion?: Calificacion;
  created_at: string;
  updated_at: string;
}

// Tipos de calificación
export interface Calificacion {
  id: number;
  trabajo_id: number;
  puntaje: number;
  comentario?: string;
  fecha_calificacion: string;
  evaluador: User;
  criterios_evaluacion?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Tipos de recurso
export interface Recurso {
  id: number;
  nombre: string;
  tipo: string;
  url?: string;
  descripcion?: string;
  archivo_path?: string;
  tamaño?: number;
  mime_type?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos de análisis
export interface ResultadoAnalisis {
  id: number;
  trabajo_id: number;
  sistema_analisis_id: number;
  areas_fortaleza: string[];
  areas_debilidad: string[];
  confianza_predictiva: number;
  recomendaciones: string[];
  metadatos?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Tipos de material de apoyo
export interface MaterialApoyo {
  id: number;
  titulo: string;
  tipo: string;
  url?: string;
  descripcion: string;
  nivel_dificultad: number;
  conceptos_relacionados: string[];
  activo: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos de orientación vocacional
export interface TestVocacional {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_estimada?: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface PerfilVocacional {
  id: number;
  estudiante_id: number;
  intereses: Record<string, number>;
  habilidades: Record<string, number>;
  personalidad: Record<string, number>;
  aptitudes: Record<string, number>;
  fecha_creacion: string;
  fecha_actualizacion: string;
  created_at: string;
  updated_at: string;
}

export interface Carrera {
  id: number;
  nombre: string;
  descripcion: string;
  nivel_educativo: string;
  duracion_anos: number;
  areas_conocimiento: string[];
  perfil_ideal: Record<string, number>;
  oportunidades_laborales: string[];
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecomendacionCarrera {
  id: number;
  estudiante_id: number;
  carrera_id: number;
  compatibilidad: number;
  justificacion: string;
  fecha: string;
  fuente: string;
  carrera: Carrera;
  created_at: string;
  updated_at: string;
}

// Tipos de notificación
export interface Notificacion {
  id: number;
  titulo: string;
  contenido: string;
  fecha: string;
  destinatario_id: number;
  leido: boolean;
  tipo: string;
  datos_adicionales?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Tipos de reporte
export interface Reporte {
  id: number;
  tipo: string;
  datos: Record<string, any>;
  fecha_generacion: string;
  destinatarios: number[];
  created_at: string;
  updated_at: string;
}

// Tipos de respuesta de API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Tipos de paginación
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
}

// Tipos de formularios
export interface FormErrors {
  [key: string]: string[];
}

// Tipos de navegación
// Esta definición está obsoleta - usar la definición más abajo para elementos del menú lateral

// Tipos de estadísticas
export interface Estadisticas {
  total_cursos?: number;
  total_estudiantes?: number;
  total_profesores?: number;
  total_tareas?: number;
  total_evaluaciones?: number;
  promedio_calificaciones?: number;
  tareas_pendientes?: number;
  evaluaciones_pendientes?: number;
}

// Tipos de filtros
export interface Filtros {
  search?: string;
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  curso_id?: number;
  estudiante_id?: number;
  profesor_id?: number;
}

// Tipos de ordenamiento
export interface Ordenamiento {
  campo: string;
  direccion: 'asc' | 'desc';
}

// Tipos para elementos del menú lateral
export interface MenuItem {
  title: string;
  href: string;
  icon: string;
  children?: MenuItem[];
}

// Tipos para breadcrumb
export interface BreadcrumbItem {
  title: string;
  href?: string;
}
