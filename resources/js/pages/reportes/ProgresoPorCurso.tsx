import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  AcademicCapIcon,
  FunnelIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Reporte {
  id: number;
  nombre: string;
  codigo: string;
  profesor: string;
  total_estudiantes: number;
  promedio_curso: number;
  promedio_maximo: number;
  promedio_minimo: number;
  tasa_entrega: number;
  total_trabajos_asignados: number;
  total_trabajos_entregados: number;
  estado: string;
  ultima_actualizacion: string;
}

interface Estadisticas {
  total_cursos: number;
  promedio_general: number;
  promedio_maximo: number;
  promedio_minimo: number;
  tasa_entrega_promedio: number;
  total_estudiantes: number;
  total_trabajos: number;
}

interface Props {
  reportes: Reporte[];
  estadisticas: Estadisticas;
  modulosSidebar: any[];
}

export default function ProgresoPorCurso({ reportes, estadisticas, modulosSidebar }: Props) {
  const [busqueda, setBusqueda] = useState('');
  const [ordenar, setOrdenar] = useState<'promedio' | 'estudiantes' | 'entrega'>('promedio');

  const reportesOrdenados = [...reportes]
    .filter((r) => r.nombre.toLowerCase().includes(busqueda.toLowerCase()) || r.codigo.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      if (ordenar === 'promedio') return b.promedio_curso - a.promedio_curso;
      if (ordenar === 'estudiantes') return b.total_estudiantes - a.total_estudiantes;
      return b.tasa_entrega - a.tasa_entrega;
    });

  const getColorPorEstado = (estado: string) => {
    switch (estado) {
      case 'excelente': return 'from-green-500 to-green-600';
      case 'bueno': return 'from-blue-500 to-blue-600';
      case 'regular': return 'from-yellow-500 to-yellow-600';
      case 'bajo': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      excelente: 'Excelente',
      bueno: 'Bueno',
      regular: 'Regular',
      bajo: 'Bajo',
      sin_estudiantes: 'Sin estudiantes',
    };
    return labels[estado] || estado;
  };

  return (
    <AppLayout>
      <Head title="Progreso por Curso - Reportes" />
      <div className="bg-gradient-to-br from-slate-50 via-green-50 to-slate-50 min-h-full py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <AcademicCapIcon className="h-10 w-10 text-green-600" />
              Progreso Académico por Curso
            </h1>
            <p className="mt-2 text-gray-600">
              Estadísticas de rendimiento y avance de cada curso
            </p>
          </div>

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Cursos</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticas.total_cursos}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Promedio General</p>
              <p className="text-3xl font-bold text-blue-600">{estadisticas.promedio_general.toFixed(1)}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Estudiantes</p>
              <p className="text-3xl font-bold text-green-600">{estadisticas.total_estudiantes}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Tasa Entrega</p>
              <p className="text-3xl font-bold text-purple-600">{estadisticas.tasa_entrega_promedio.toFixed(1)}%</p>
            </div>
          </div>

          {/* Controles */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex gap-2 items-center">
                <FunnelIcon className="h-5 w-5 text-gray-500" />
                <select
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value as any)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="promedio">Ordenar por Promedio</option>
                  <option value="estudiantes">Ordenar por Estudiantes</option>
                  <option value="entrega">Ordenar por Tasa Entrega</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid de Cursos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reportesOrdenados.map((reporte) => (
              <div key={reporte.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                {/* Encabezado del curso */}
                <div className={`bg-gradient-to-r ${getColorPorEstado(reporte.estado)} p-6 text-white`}>
                  <h3 className="text-xl font-bold mb-1">{reporte.nombre}</h3>
                  <p className="text-sm opacity-90">Código: {reporte.codigo}</p>
                </div>

                {/* Contenido */}
                <div className="p-6 space-y-4">
                  {/* Profesor */}
                  <div className="pb-4 border-b border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Profesor</p>
                    <p className="text-gray-900 font-semibold">{reporte.profesor}</p>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Promedio Curso</p>
                      <p className="text-2xl font-bold text-blue-600">{reporte.promedio_curso.toFixed(1)}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Max: {reporte.promedio_maximo.toFixed(1)} | Min: {reporte.promedio_minimo.toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Estudiantes</p>
                      <div className="flex items-center gap-1">
                        <UserGroupIcon className="h-5 w-5 text-green-600" />
                        <p className="text-2xl font-bold text-green-600">{reporte.total_estudiantes}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tasa de Entrega */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Tasa de Entrega</p>
                      <span className="text-sm font-bold text-gray-900">{reporte.tasa_entrega.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
                        style={{ width: `${reporte.tasa_entrega}%` }}
                      />
                    </div>
                  </div>

                  {/* Trabajos */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {reporte.total_trabajos_entregados}/{reporte.total_trabajos_asignados} Entregados
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className={`bg-gradient-to-r ${getColorPorEstado(reporte.estado)} bg-opacity-10 rounded-lg p-3`}>
                    <p className={`text-xs font-bold uppercase bg-gradient-to-r ${getColorPorEstado(reporte.estado)} bg-clip-text text-transparent`}>
                      {getEstadoLabel(reporte.estado)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {reportesOrdenados.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-600 text-lg">No se encontraron cursos con los filtros seleccionados</p>
            </div>
          )}

          {/* Pie de página */}
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">Mostrando {reportesOrdenados.length} de {reportes.length} cursos</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
