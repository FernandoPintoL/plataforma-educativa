import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  SparklesIcon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  estadisticas: Record<string, number>;
  desempeno: Record<string, number>;
  distribucion: Record<string, number>;
  actividad_reciente: Record<string, number>;
  crecimiento_mensual: Array<{
    mes: string;
    estudiantes: number;
    calificaciones: number;
  }>;
  modulosSidebar: any[];
}

export default function MetricasInstitucionales({
  estadisticas,
  desempeno,
  distribucion,
  actividad_reciente,
  crecimiento_mensual,
  modulosSidebar,
}: Props) {
  // Datos para gráfico de crecimiento mensual
  const crecimientoChartData = {
    labels: crecimiento_mensual.map((m) => m.mes),
    datasets: [
      {
        label: 'Nuevos Estudiantes',
        data: crecimiento_mensual.map((m) => m.estudiantes),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        yAxisID: 'y',
      },
      {
        label: 'Calificaciones Registradas',
        data: crecimiento_mensual.map((m) => m.calificaciones),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ef4444',
        yAxisID: 'y1',
      },
    ],
  };

  // Datos para gráfico de distribución
  const distribucionChartData = {
    labels: ['Excelente\n(90+)', 'Bueno\n(80-89)', 'Regular\n(70-79)', 'Bajo\n(<70)'],
    datasets: [
      {
        label: 'Estudiantes',
        data: [distribucion.excelente, distribucion.bueno, distribucion.regular, distribucion.bajo],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <AppLayout>
      <Head title="Métricas Institucionales - Reportes" />
      <div className="bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 min-h-full py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <SparklesIcon className="h-10 w-10 text-orange-600" />
              Métricas Institucionales
            </h1>
            <p className="mt-2 text-gray-600">
              Estadísticas generales y métricas de desempeño de la institución
            </p>
          </div>

          {/* Estadísticas Principales */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">Total Estudiantes</p>
                  <p className="text-4xl font-bold">{estadisticas.total_estudiantes}</p>
                </div>
                <AcademicCapIcon className="h-12 w-12 opacity-30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">Total Profesores</p>
                  <p className="text-4xl font-bold">{estadisticas.total_profesores}</p>
                </div>
                <UserGroupIcon className="h-12 w-12 opacity-30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">Total Padres</p>
                  <p className="text-4xl font-bold">{estadisticas.total_padres}</p>
                </div>
                <UserGroupIcon className="h-12 w-12 opacity-30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">Total Cursos</p>
                  <p className="text-4xl font-bold">{estadisticas.total_cursos}</p>
                </div>
                <DocumentTextIcon className="h-12 w-12 opacity-30" />
              </div>
            </div>
          </div>

          {/* Desempeño */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Resumen de Desempeño */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen de Desempeño</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-700 font-semibold">Promedio General</p>
                    <span className="text-3xl font-bold text-blue-600">{desempeno.promedio_general.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${Math.min(desempeno.promedio_general, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Trabajos Entregados</p>
                    <p className="text-3xl font-bold text-green-600">{desempeno.trabajos_entregados}</p>
                    <p className="text-xs text-gray-600 mt-1">De {desempeno.trabajos_totales}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Tasa Entrega</p>
                    <p className="text-3xl font-bold text-orange-600">{desempeno.tasa_entrega.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Trabajos Pendientes</p>
                  <p className="text-3xl font-bold text-red-600">{desempeno.trabajos_pendientes}</p>
                </div>
              </div>
            </div>

            {/* Distribución de Desempeño */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Distribución por Desempeño</h2>
              <Bar
                data={distribucionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  indexAxis: 'x' as const,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: '#6b7280',
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    x: {
                      ticks: {
                        color: '#6b7280',
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                  },
                }}
                height={300}
              />
            </div>
          </div>

          {/* Crecimiento Mensual */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              Crecimiento en Últimos 6 Meses
            </h2>
            <Line
              data={crecimientoChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                  mode: 'index' as const,
                  intersect: false,
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                    },
                  },
                },
                scales: {
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    ticks: {
                      color: '#6b7280',
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                    title: {
                      display: true,
                      text: 'Estudiantes',
                    },
                  },
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    ticks: {
                      color: '#6b7280',
                    },
                    grid: {
                      drawOnChartArea: false,
                    },
                    title: {
                      display: true,
                      text: 'Calificaciones',
                    },
                  },
                  x: {
                    ticks: {
                      color: '#6b7280',
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                },
              }}
              height={300}
            />
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Actividad Reciente (Última Semana)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-6 border-2 border-green-200">
                <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Trabajos Entregados</p>
                <p className="text-4xl font-bold text-green-600">{actividad_reciente.trabajos_entregados_semana}</p>
                <p className="text-xs text-gray-600 mt-2">En los últimos 7 días</p>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Calificaciones Registradas</p>
                <p className="text-4xl font-bold text-blue-600">{actividad_reciente.calificaciones_semana}</p>
                <p className="text-xs text-gray-600 mt-2">En los últimos 7 días</p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-6 border-2 border-purple-200">
                <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Usuarios Nuevos</p>
                <p className="text-4xl font-bold text-purple-600">{actividad_reciente.usuarios_nuevos_semana}</p>
                <p className="text-xs text-gray-600 mt-2">En los últimos 7 días</p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-8 border-2 border-orange-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Insights Principales</h3>
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <span>
                  El promedio institucional es de <strong>{desempeno.promedio_general.toFixed(2)}</strong>,
                  indicando que hay espacio para mejora en el desempeño académico
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">📈</span>
                <span>
                  La tasa de entrega de trabajos es del <strong>{desempeno.tasa_entrega.toFixed(1)}%</strong>,
                  refleja la consistencia en la entrega de tareas
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">👥</span>
                <span>
                  Con <strong>{estadisticas.total_estudiantes}</strong> estudiantes y <strong>{estadisticas.total_profesores}</strong> profesores,
                  la relación es de aproximadamente 1:{Math.round(estadisticas.total_estudiantes / estadisticas.total_profesores)} estudiante por profesor
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <span>
                  Hay <strong>{distribucion.bajo}</strong> estudiantes con bajo desempeño que requieren atención inmediata
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
