/**
 * Tipos para el módulo de Análisis de Riesgo
 */

export type NivelRiesgo = 'alto' | 'medio' | 'bajo';
export type Tendencia = 'mejorando' | 'estable' | 'declinando' | 'fluctuando';

export interface PrediccionRiesgo {
  id: number;
  estudiante_id: number;
  fk_curso_id?: number | null;
  score_riesgo: number;
  nivel_riesgo: NivelRiesgo;
  nivel_riesgo_label?: string;
  confianza?: number;
  fecha_prediccion: string;
  descripcion?: string;
  color?: string;
  factores_influyentes?: Record<string, any>;
  observaciones?: string;
}

export interface PrediccionCarrera {
  id: number;
  estudiante_id: number;
  carrera_nombre: string;
  compatibilidad: number;
  ranking: number;
  descripcion?: string;
  color?: string;
  fecha_prediccion: string;
}

export interface PrediccionTendencia {
  id: number;
  estudiante_id: number;
  fk_curso_id?: number | null;
  tendencia: Tendencia;
  tendencia_label?: string;
  confianza?: number;
  color?: string;
  icono?: string;
  fecha_prediccion: string;
}

export interface EstudiantePerfil {
  id: number;
  nombre: string;
  email: string;
  avatar?: string;
  tipo_usuario?: string;
}

export interface AnalisEstudiante {
  estudiante: EstudiantePerfil;
  prediccion_riesgo: PrediccionRiesgo;
  historico_riesgo: HistoricoRiesgo[];
  recomendaciones_carrera: PrediccionCarrera[];
  tendencia: PrediccionTendencia | null;
  calificaciones_recientes: CalificacionReciente[];
}

export interface HistoricoRiesgo {
  fecha_prediccion: string;
  score_riesgo: number;
  nivel_riesgo: NivelRiesgo;
}

export interface CalificacionReciente {
  id: number;
  puntaje: number;
  fecha: string;
  trabajo_id: number;
  created_at: string;
}

export interface MetricasRiesgo {
  total_estudiantes: number;
  riesgo_alto: number;
  riesgo_medio: number;
  riesgo_bajo: number;
  score_promedio: number;
  porcentaje_alto_riesgo: number;
}

export interface Dashboard {
  metricas: MetricasRiesgo;
  distribucion: {
    alto: number;
    medio: number;
    bajo: number;
  };
  estudiantes_criticos: EstudianteCritico[];
}

export interface EstudianteCritico {
  id: number;
  estudiante_id: number;
  estudiante_nombre: string;
  score_riesgo: number;
  nivel_riesgo: NivelRiesgo;
}

export interface CursoAnalisis {
  id: number;
  nombre: string;
  codigo?: string;
}

export interface AnalisPorCurso {
  curso: CursoAnalisis;
  metricas: {
    total_estudiantes: number;
    score_promedio: number;
    distribucion: {
      alto: number;
      medio: number;
      bajo: number;
    };
    porcentaje_alto_riesgo: number;
  };
  estudiantes_por_nivel: {
    alto: EstudianteListaItem[];
    medio: EstudianteListaItem[];
  };
  lista_completa: EstudianteListaItem[];
}

export interface EstudianteListaItem {
  id?: number;
  estudiante_id: number;
  nombre: string;
  score: number;
  score_riesgo?: number;
  nivel_riesgo?: NivelRiesgo;
  fecha_prediccion?: string;
}

export interface DatoTendencia {
  fecha: string;
  score_promedio: number;
  total: number;
}

export interface TendenciasGraficas {
  grafico_tendencia: DatoTendencia[];
  distribucion_tendencia: {
    mejorando: number;
    estable: number;
    declinando: number;
    fluctuando: number;
  };
}

export interface FiltroPaginacion {
  page?: number;
  per_page?: number;
  curso_id?: number;
  nivel_riesgo?: NivelRiesgo;
  search?: string;
  order_by?: string;
  direction?: 'asc' | 'desc';
}

export interface FiltrosDashboard {
  curso_id?: number;
  dias?: number;
}

export interface FiltroEstudiante {
  dias?: number;
}

export interface FiltrosCurso {
  dias?: number;
}

export interface FiltrosTendencias {
  curso_id?: number;
  dias?: number;
}
