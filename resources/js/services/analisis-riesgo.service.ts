import axios, { AxiosInstance } from 'axios';

/**
 * Tipos para el módulo de Análisis de Riesgo
 */

export interface PrediccionRiesgo {
  id: number;
  estudiante_id: number;
  score_riesgo: number;
  nivel_riesgo: 'alto' | 'medio' | 'bajo';
  nivel_riesgo_label: string;
  confianza: number;
  fecha_prediccion: string;
  descripcion: string;
  color: string;
  factores_influyentes?: Record<string, unknown>;
}

export interface PrediccionCarrera {
  id: number;
  carrera_nombre: string;
  compatibilidad: number;
  ranking: number;
  descripcion?: string;
  color: string;
}

export interface PrediccionTendencia {
  id: number;
  tendencia: 'mejorando' | 'estable' | 'declinando' | 'fluctuando';
  tendencia_label: string;
  confianza: number;
  color: string;
  icono: string;
  fecha_prediccion: string;
}

export interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  avatar?: string;
}

export interface AnalisEstudianteResponse {
  estudiante: Estudiante;
  prediccion_riesgo: PrediccionRiesgo;
  historico_riesgo: Array<{
    fecha_prediccion: string;
    score_riesgo: number;
    nivel_riesgo: string;
  }>;
  recomendaciones_carrera: PrediccionCarrera[];
  tendencia: PrediccionTendencia | null;
  calificaciones_recientes: Array<{
    id: number;
    puntaje: number;
    fecha: string;
    trabajo_id: number;
    created_at: string;
  }>;
}

export interface DashboardMetricas {
  total_estudiantes: number;
  riesgo_alto: number;
  riesgo_medio: number;
  riesgo_bajo: number;
  score_promedio: number;
  porcentaje_alto_riesgo: number;
}

export interface DashboardResponse {
  metricas: DashboardMetricas;
  distribucion: {
    alto: number;
    medio: number;
    bajo: number;
  };
  estudiantes_criticos: Array<{
    id: number;
    estudiante_id: number;
    estudiante_nombre: string;
    score_riesgo: number;
    nivel_riesgo: string;
  }>;
}

export interface ListarPrediccionesResponse {
  data: PrediccionRiesgo[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  message: string;
}

export interface AnalisPorCursoResponse {
  curso: {
    id: number;
    nombre: string;
    codigo?: string;
  };
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
    alto: Array<{
      estudiante_id: number;
      nombre: string;
      score: number;
    }>;
    medio: Array<{
      estudiante_id: number;
      nombre: string;
      score: number;
    }>;
  };
  lista_completa: Array<{
    id: number;
    estudiante_id: number;
    nombre: string;
    score_riesgo: number;
    nivel_riesgo: string;
    fecha_prediccion: string;
  }>;
}

export interface TendenciasResponse {
  grafico_tendencia: Array<{
    fecha: string;
    score_promedio: number;
    total: number;
  }>;
  distribucion_tendencia: {
    mejorando: number;
    estable: number;
    declinando: number;
    fluctuando: number;
  };
}

/**
 * Servicio para Análisis de Riesgo
 * Maneja todas las operaciones con la API de análisis de riesgo
 */
class AnalisisRiesgoService {
  private api: AxiosInstance;
  private baseUrl = '/api/analisis-riesgo';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Obtener dashboard con métricas generales
   */
  async dashboard(filters?: {
    curso_id?: number;
    dias?: number;
  }): Promise<DashboardResponse> {
    try {
      const response = await this.api.get('/dashboard', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      throw error;
    }
  }

  /**
   * Listar predicciones con filtros y paginación
   */
  async listarPredicciones(options?: {
    page?: number;
    per_page?: number;
    curso_id?: number;
    nivel_riesgo?: string;
    search?: string;
    order_by?: string;
    direction?: 'asc' | 'desc';
  }): Promise<ListarPrediccionesResponse> {
    try {
      const response = await this.api.get('/', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error al listar predicciones:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis detallado de un estudiante
   */
  async analisEstudiante(
    estudianteId: number,
    dias?: number
  ): Promise<AnalisEstudianteResponse> {
    try {
      const response = await this.api.get(`/estudiante/${estudianteId}`, {
        params: dias ? { dias } : {},
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener análisis de estudiante:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis por curso
   */
  async analisPorCurso(
    cursoId: number,
    dias?: number
  ): Promise<AnalisPorCursoResponse> {
    try {
      const response = await this.api.get(`/curso/${cursoId}`, {
        params: dias ? { dias } : {},
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener análisis por curso:', error);
      throw error;
    }
  }

  /**
   * Obtener análisis de tendencias
   */
  async obtenerTendencias(filters?: {
    curso_id?: number;
    dias?: number;
  }): Promise<TendenciasResponse> {
    try {
      const response = await this.api.get('/tendencias', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener tendencias:', error);
      throw error;
    }
  }

  /**
   * Obtener recomendaciones de carrera para un estudiante
   */
  async recomendacionesCarrera(estudianteId: number): Promise<PrediccionCarrera[]> {
    try {
      const response = await this.api.get(`/carrera/${estudianteId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      throw error;
    }
  }

  /**
   * Actualizar observaciones o nivel de riesgo de una predicción
   */
  async actualizar(
    prediccionId: number,
    data: {
      observaciones?: string;
      nivel_riesgo?: 'alto' | 'medio' | 'bajo';
    }
  ): Promise<PrediccionRiesgo> {
    try {
      const response = await this.api.put(`/${prediccionId}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar predicción:', error);
      throw error;
    }
  }

  /**
   * Generar nuevas predicciones para un estudiante
   */
  async generarPredicciones(estudianteId: number): Promise<any> {
    try {
      const response = await this.api.post(`/generar/${estudianteId}`);
      return response.data;
    } catch (error) {
      console.error('Error al generar predicciones:', error);
      throw error;
    }
  }

  /**
   * Obtener color para un nivel de riesgo
   */
  getColorNivelRiesgo(nivel: 'alto' | 'medio' | 'bajo'): string {
    const colores: Record<string, string> = {
      alto: '#ef4444',
      medio: '#eab308',
      bajo: '#22c55e',
    };
    return colores[nivel] || '#6b7280';
  }

  /**
   * Obtener ícono para un nivel de riesgo
   */
  getIconoNivelRiesgo(nivel: 'alto' | 'medio' | 'bajo'): string {
    const iconos: Record<string, string> = {
      alto: 'AlertTriangle',
      medio: 'AlertCircle',
      bajo: 'CheckCircle',
    };
    return iconos[nivel] || 'Help';
  }

  /**
   * Obtener descripción de un nivel de riesgo
   */
  getDescripcionNivelRiesgo(nivel: 'alto' | 'medio' | 'bajo'): string {
    const descripciones: Record<string, string> = {
      alto: 'Requiere intervención inmediata. Probabilidad alta de bajo rendimiento.',
      medio: 'Monitoreo cercano recomendado. Apoyo académico sugerido.',
      bajo: 'Desempeño académico estable. Continuar con apoyo regular.',
    };
    return descripciones[nivel] || 'Estado indeterminado.';
  }

  /**
   * Formatear porcentaje para mostrar
   */
  formatearPorcentaje(valor: number): string {
    return `${(valor * 100).toFixed(1)}%`;
  }

  /**
   * Ordenar estudiantes por riesgo (descendente)
   */
  ordenarPorRiesgo(estudiantes: any[]): any[] {
    return [...estudiantes].sort((a, b) => b.score_riesgo - a.score_riesgo);
  }
}

export default new AnalisisRiesgoService();
