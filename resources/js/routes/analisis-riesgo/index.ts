/**
 * Rutas API para Análisis de Riesgo
 * Auto-generadas basadas en api.php
 */

export const ANALISIS_RIESGO_ROUTES = {
  // Dashboard
  dashboard: '/api/analisis-riesgo/dashboard',

  // Listado
  index: '/api/analisis-riesgo',

  // Análisis por estudiante
  porEstudiante: (id: number) => `/api/analisis-riesgo/estudiante/${id}`,

  // Análisis por curso
  porCurso: (id: number) => `/api/analisis-riesgo/curso/${id}`,

  // Tendencias
  tendencias: '/api/analisis-riesgo/tendencias',

  // Recomendaciones de carrera
  recomendacionesCarrera: (id: number) => `/api/analisis-riesgo/carrera/${id}`,

  // Actualizar predicción
  update: (id: number) => `/api/analisis-riesgo/${id}`,

  // Generar predicciones
  generarPredicciones: (estudianteId: number) => `/api/analisis-riesgo/generar/${estudianteId}`,
};

export default ANALISIS_RIESGO_ROUTES;
