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

  const reportesFiltrados = reportes
    .filter((r) => {
      if (filtro === 'todos') return true;
      return r.estado === filtro;
    })
    .filter((r) => r.nombre.toLowerCase().includes(busqueda.toLowerCase()) || r.email.toLowerCase().includes(busqueda.toLowerCase()));

  const getColorPorPromedio = (promedio: number) => {
    if (promedio >= 90) return 'bg-green-50 border-green-200';
    if (promedio >= 80) return 'bg-blue-50 border-blue-200';
    if (promedio >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTextColorPorPromedio = (promedio: number) => {
    if (promedio >= 90) return 'text-green-600';
    if (promedio >= 80) return 'text-blue-600';
    if (promedio >= 70) return 'text-yellow-600';
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
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Cursos</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Trabajos</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Tasa Entrega</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Tendencia</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">Estado</th>
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
                          {reporte.promedio.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                          {reporte.cursos_inscritos}
                        </span>
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
                      <td className="px-6 py-4 text-center">
                        <span className="text-2xl">{getEmojiPorEstado(reporte.estado)}</span>
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
    </AppLayout>
  );
}
