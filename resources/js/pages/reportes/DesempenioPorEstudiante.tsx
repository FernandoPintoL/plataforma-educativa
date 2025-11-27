import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  ChartBarIcon,
  FunnelIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface Reporte {
  id: number;
  nombre: string;
  email: string;
  promedio: number;
  cursos_inscritos: number;
  total_trabajos: number;
  trabajos_calificados: number;
  tasa_entrega: number;
  fortalezas: string[];
  debilidades: string[];
  tendencia: string;
  estado: string;
  ultima_actualizacion: string;
  // Nuevos campos de ML
  riesgo_predicho?: number;
  riesgo_nivel?: string;
  riesgo_confianza?: number;
  anomalias_detectadas?: any[];
  tiene_anomalias?: boolean;
  agent_synthesis?: {
    key_insights?: string[];
    recommendations?: string[];
    intervention_actions?: string[];
    confidence?: number;
    method?: string;
  };
}

interface Estadisticas {
  total_estudiantes: number;
  promedio_general: number;
  promedio_maximo: number;
  promedio_minimo: number;
  tasa_entrega_promedio: number;
  estudiantes_excelentes: number;
  estudiantes_buenos: number;
  estudiantes_regulares: number;
  estudiantes_bajos: number;
}

interface Props {
  reportes: Reporte[];
  estadisticas: Estadisticas;
  modulosSidebar: any[];
}

export default function DesempenioPorEstudiante({ reportes, estadisticas, modulosSidebar }: Props) {
  const [filtro, setFiltro] = useState<'todos' | 'excelente' | 'bueno' | 'regular' | 'bajo'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState<Reporte | null>(null);
  const [cargandoSintesis, setCargandoSintesis] = useState(false);
  const [sinasisCargada, setSinasisCargada] = useState<Record<number, any>>({});

  const reportesFiltrados = reportes
    .filter((r) => {
      if (filtro === 'todos') return true;
      return r.estado === filtro;
    })
    .filter((r) => r.nombre.toLowerCase().includes(busqueda.toLowerCase()) || r.email.toLowerCase().includes(busqueda.toLowerCase()));

  const normalizePromedio = (promedio: any): number => {
    const num = parseFloat(promedio);
    return isNaN(num) ? 0 : num;
  };

  const getColorPorPromedio = (promedio: any) => {
    const num = normalizePromedio(promedio);
    if (num >= 90) return 'bg-green-50 border-green-200';
    if (num >= 80) return 'bg-blue-50 border-blue-200';
    if (num >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTextColorPorPromedio = (promedio: any) => {
    const num = normalizePromedio(promedio);
    if (num >= 90) return 'text-green-600';
    if (num >= 80) return 'text-blue-600';
    if (num >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEmojiPorEstado = (estado: string) => {
    switch (estado) {
      case 'excelente': return '🌟';
      case 'bueno': return '⭐';
      case 'regular': return '📈';
      case 'bajo': return '⚠️';
      default: return '📊';
    }
  };

  const getColorPorRiesgo = (riesgo_nivel?: string) => {
    switch (riesgo_nivel) {
      case 'alto': return 'bg-red-100 text-red-800 border-red-300';
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'bajo': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getIconoPorRiesgo = (riesgo_nivel?: string) => {
    switch (riesgo_nivel) {
      case 'alto': return '🔴';
      case 'medio': return '🟡';
      case 'bajo': return '🟢';
      default: return '⚪';
    }
  };

  const abrirModalAnalisis = async (reporte: Reporte) => {
    setReporteSeleccionado(reporte);
    setModalAbierto(true);

    // Si ya cargamos la síntesis para este estudiante, no la cargamos de nuevo
    if (sinasisCargada[reporte.id]) {
      return;
    }

    // Cargar síntesis bajo demanda
    setCargandoSintesis(true);
    try {
      const response = await fetch(`/api/reportes/student/${reporte.id}/synthesis`);
      const data = await response.json();

      if (data.success) {
        setSinasisCargada((prev) => ({
          ...prev,
          [reporte.id]: data.synthesis,
        }));

        // Actualizar el reporte con la síntesis cargada
        setReporteSeleccionado((prev) =>
          prev ? { ...prev, agent_synthesis: data.synthesis } : null
        );
      }
    } catch (error) {
      console.error('Error cargando síntesis:', error);
    } finally {
      setCargandoSintesis(false);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setReporteSeleccionado(null);
  };

  return (
    <AppLayout>
      <Head title="Desempeño por Estudiante - Reportes" />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-full py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ChartBarIcon className="h-10 w-10 text-blue-600" />
              Desempeño Académico por Estudiante
            </h1>
            <p className="mt-2 text-gray-600">
              Análisis detallado del desempeño de cada estudiante
            </p>
          </div>

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-10">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Estudiantes</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticas.total_estudiantes}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Promedio General</p>
              <p className={`text-3xl font-bold ${getTextColorPorPromedio(estadisticas.promedio_general)}`}>
                {estadisticas.promedio_general.toFixed(1)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Máximo Promedio</p>
              <p className="text-3xl font-bold text-green-600">{estadisticas.promedio_maximo.toFixed(1)}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Mínimo Promedio</p>
              <p className="text-3xl font-bold text-red-600">{estadisticas.promedio_minimo.toFixed(1)}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Tasa Entrega Prom.</p>
              <p className="text-3xl font-bold text-blue-600">{estadisticas.tasa_entrega_promedio.toFixed(1)}%</p>
            </div>
          </div>

          {/* Filtros y Búsqueda */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 items-center">
                <FunnelIcon className="h-5 w-5 text-gray-500" />
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value as any)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="todos">Todos ({reportes.length})</option>
                  <option value="excelente">Excelente ({estadisticas.estudiantes_excelentes})</option>
                  <option value="bueno">Bueno ({estadisticas.estudiantes_buenos})</option>
                  <option value="regular">Regular ({estadisticas.estudiantes_regulares})</option>
                  <option value="bajo">Bajo ({estadisticas.estudiantes_bajos})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de Reportes */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Estudiante</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Promedio</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900" title="Riesgo predicho por ML">Riesgo</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Anomalías</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Trabajos</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Tasa Entrega</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Tendencia</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Análisis IA</th>
                  </tr>
                </thead>
                <tbody>
                  {reportesFiltrados.map((reporte) => (
                    <tr key={reporte.id} className={`border-b border-gray-100 hover:bg-gray-50 transition ${getColorPorPromedio(reporte.promedio)}`}>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{reporte.nombre}</p>
                          <p className="text-sm text-gray-600">{reporte.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-2xl font-bold ${getTextColorPorPromedio(reporte.promedio)}`}>
                          {normalizePromedio(reporte.promedio).toFixed(1)}
                        </span>
                      </td>

                      {/* Columna de Riesgo */}
                      <td className="px-6 py-4 text-center">
                        {reporte.riesgo_predicho !== undefined ? (
                          <div className="flex flex-col items-center gap-1">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold border ${getColorPorRiesgo(reporte.riesgo_nivel)}`}>
                              <span>{getIconoPorRiesgo(reporte.riesgo_nivel)}</span>
                              <span className="text-xs uppercase">{reporte.riesgo_nivel || 'N/A'}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              ({(reporte.riesgo_confianza || 0).toFixed(1)}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Sin datos</span>
                        )}
                      </td>

                      {/* Columna de Anomalías */}
                      <td className="px-6 py-4 text-center">
                        {reporte.tiene_anomalias ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-2xl">⚠️</span>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-semibold">
                              {reporte.anomalias_detectadas?.length || 0} detectada(s)
                            </span>
                          </div>
                        ) : (
                          <span className="text-green-600 font-semibold">✓ Normal</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        <p className="font-semibold">{reporte.trabajos_calificados}/{reporte.total_trabajos}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                              style={{ width: `${reporte.tasa_entrega}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{reporte.tasa_entrega.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {reporte.tendencia === 'mejorando' ? (
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                            <ArrowTrendingUpIcon className="h-4 w-4" />
                            <span className="text-sm font-semibold">Mejorando</span>
                          </div>
                        ) : reporte.tendencia === 'decayendo' ? (
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                            <ArrowTrendingDownIcon className="h-4 w-4" />
                            <span className="text-sm font-semibold">Decayendo</span>
                          </div>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                            Estable
                          </span>
                        )}
                      </td>
                      {/* Columna de Análisis IA */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => abrirModalAnalisis(reporte)}
                          disabled={cargandoSintesis}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
                        >
                          <span>{cargandoSintesis ? '⏳' : '🤖'}</span>
                          <span className="text-sm">{cargandoSintesis ? 'Cargando...' : 'Ver IA'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {reportesFiltrados.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No se encontraron estudiantes con los filtros seleccionados</p>
              </div>
            )}
          </div>

          {/* Pie de página */}
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              Mostrando {reportesFiltrados.length} de {reportes.length} estudiantes
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Análisis IA */}
      {modalAbierto && reporteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 border-b border-blue-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Análisis IA - {reporteSeleccionado.nombre}</h2>
                <p className="text-blue-100 text-sm">{reporteSeleccionado.email}</p>
              </div>
              <button
                onClick={cerrarModal}
                className="text-white hover:bg-blue-600 p-2 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8 space-y-8">
              {/* Indicador de Carga */}
              {cargandoSintesis && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin">
                      <span className="text-4xl">⏳</span>
                    </div>
                    <p className="mt-4 text-gray-600 font-semibold">Cargando análisis de IA...</p>
                  </div>
                </div>
              )}

              {/* Síntesis General */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>💡</span> Síntesis del Análisis
                </h3>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  {reporteSeleccionado.agent_synthesis?.key_insights?.length ? (
                    <ul className="list-disc list-inside space-y-2">
                      {reporteSeleccionado.agent_synthesis.key_insights.map((insight, idx) => (
                        <li key={idx} className="text-gray-800">{insight}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-600">No hay insights disponibles</span>
                  )}
                </div>
              </div>

              {/* Recomendaciones */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span> Recomendaciones
                </h3>
                <div className="space-y-3">
                  {reporteSeleccionado.agent_synthesis?.recommendations?.length ? (
                    reporteSeleccionado.agent_synthesis.recommendations.map((rec, idx) => (
                      <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-gray-800">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No hay recomendaciones disponibles</p>
                  )}
                </div>
              </div>

              {/* Acciones de Intervención */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>✅</span> Acciones de Intervención
                </h3>
                <div className="space-y-3">
                  {reporteSeleccionado.agent_synthesis?.intervention_actions?.length ? (
                    reporteSeleccionado.agent_synthesis.intervention_actions.map((action, idx) => (
                      <div key={idx} className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                        <p className="font-semibold text-green-900 mb-1">Acción {idx + 1}</p>
                        <p className="text-gray-800">{action}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No hay acciones disponibles</p>
                  )}
                </div>
              </div>

              {/* Confianza y Método */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-semibold">Confianza</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {((reporteSeleccionado.agent_synthesis?.confidence || 0) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-semibold">Método</p>
                  <p className="text-lg font-bold text-gray-800">
                    {reporteSeleccionado.agent_synthesis?.method === 'integrated_agent'
                      ? '🤖 Agent Groq'
                      : reporteSeleccionado.agent_synthesis?.method === 'fallback'
                      ? '⚙️ Fallback'
                      : 'Desconocido'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-4">
              <button
                onClick={cerrarModal}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg font-semibold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
