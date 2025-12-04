import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  AlertTriangleIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BarChartIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

interface EstadisticasRiesgo {
  total_predicciones: number;
  riesgo_alto: number;
  riesgo_medio: number;
  riesgo_bajo: number;
  score_promedio: number;
}

interface EstudianteMayorRiesgo {
  id: number;
  nombre: string;
  score_riesgo: number;
  confianza: number;
  fecha_prediccion: string;
  razon?: string;
  descripcion_riesgo?: string;
  tipo_riesgo?: string;
  icono_riesgo?: string;
  color_riesgo?: string;
  text_color_riesgo?: string;
}

interface CarreraRecomendada {
  nombre: string;
  cantidad: number;
  compatibilidad_promedio: number;
}

interface Props {
  estadisticas_riesgo: EstadisticasRiesgo;
  estudiantes_mayor_riesgo: EstudianteMayorRiesgo[];
  distribucion_riesgo: Record<string, number>;
  tendencias: Record<string, number>;
  carreras_recomendadas: CarreraRecomendada[];
  modulosSidebar: any[];
}

export default function ReportesRiesgo({
  estadisticas_riesgo,
  estudiantes_mayor_riesgo,
  distribucion_riesgo,
  tendencias,
  carreras_recomendadas,
  modulosSidebar,
}: Props) {
  const [filtroNivel, setFiltroNivel] = useState<'todos' | 'alto' | 'medio' | 'bajo'>('todos');

  // Gráfico de distribución de riesgo (Doughnut)
  const riesgoChartData = {
    labels: ['Riesgo Alto', 'Riesgo Medio', 'Riesgo Bajo'],
    datasets: [
      {
        data: [distribucion_riesgo.alto, distribucion_riesgo.medio, distribucion_riesgo.bajo],
        backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(251, 146, 60, 0.8)', 'rgba(34, 197, 94, 0.8)'],
        borderColor: ['rgb(239, 68, 68)', 'rgb(251, 146, 60)', 'rgb(34, 197, 94)'],
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de tendencias
  const tendenciasChartData = {
    labels: ['Mejorando', 'Estable', 'Declinando', 'Fluctuando'],
    datasets: [
      {
        label: 'Estudiantes',
        data: [
          tendencias.mejorando || 0,
          tendencias.estable || 0,
          tendencias.declinando || 0,
          tendencias.fluctuando || 0,
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)',
        ],
        borderColor: ['rgb(34, 197, 94)', 'rgb(59, 130, 246)', 'rgb(239, 68, 68)', 'rgb(251, 146, 60)'],
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de carreras recomendadas
  const carrerasChartData = {
    labels: carreras_recomendadas.map((c) => c.nombre),
    datasets: [
      {
        label: 'Cantidad de Recomendaciones',
        data: carreras_recomendadas.map((c) => c.cantidad),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
    ],
  };

  const getRiesgoColor = (nivel: string) => {
    switch (nivel) {
      case 'alto':
        return 'bg-red-50 border-red-200';
      case 'medio':
        return 'bg-orange-50 border-orange-200';
      case 'bajo':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiesgoTextColor = (nivel: string) => {
    switch (nivel) {
      case 'alto':
        return 'text-red-600';
      case 'medio':
        return 'text-orange-600';
      case 'bajo':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRiesgoIcon = (nivel: string) => {
    switch (nivel) {
      case 'alto':
        return <AlertTriangleIcon className="h-5 w-5 text-red-600" />;
      case 'medio':
        return <AlertCircleIcon className="h-5 w-5 text-orange-600" />;
      case 'bajo':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <Head title="Reportes de Análisis de Riesgo - Reportes" />
      <div className="bg-gradient-to-br from-slate-50 via-red-50 to-slate-50 min-h-full py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <AlertTriangleIcon className="h-10 w-10 text-red-600" />
              Reportes de Análisis de Riesgo
            </h1>
            <p className="mt-2 text-gray-600">
              Análisis completo de predicciones de riesgo académico y recomendaciones de carreras
            </p>
          </div>

          {/* Estadísticas Principales */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-10">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Total Predicciones</p>
              <p className="text-3xl font-bold text-gray-900">{estadisticas_riesgo.total_predicciones}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-600">
              <p className="text-gray-600 text-sm font-semibold mb-1">Riesgo Alto</p>
              <p className="text-3xl font-bold text-red-600">{estadisticas_riesgo.riesgo_alto}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-orange-600">
              <p className="text-gray-600 text-sm font-semibold mb-1">Riesgo Medio</p>
              <p className="text-3xl font-bold text-orange-600">{estadisticas_riesgo.riesgo_medio}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">
              <p className="text-gray-600 text-sm font-semibold mb-1">Riesgo Bajo</p>
              <p className="text-3xl font-bold text-green-600">{estadisticas_riesgo.riesgo_bajo}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-600 text-sm font-semibold mb-1">Score Promedio</p>
              <p className="text-3xl font-bold text-blue-600">{estadisticas_riesgo.score_promedio.toFixed(3)}</p>
            </div>
          </div>

          {/* Gráficos Principales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Distribución de Riesgo */}
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Distribución de Riesgo</h2>
              <Doughnut
                data={riesgoChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                      },
                    },
                  },
                }}
                height={300}
              />
            </div>

            {/* Tendencias */}
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tendencias de Desempeño</h2>
              <Bar
                data={tendenciasChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  indexAxis: 'y' as const,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        color: '#6b7280',
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    y: {
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

            {/* Carreras Recomendadas */}
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Carreras Top Recomendadas</h2>
              <Bar
                data={carrerasChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  indexAxis: 'y' as const,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        color: '#6b7280',
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                    y: {
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

          {/* Estudiantes con Mayor Riesgo */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                Estudiantes con Mayor Riesgo (Top 10)
              </h2>
            </div>

            {estudiantes_mayor_riesgo.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Estudiante
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Score de Riesgo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Tipo de Riesgo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Razón del Riesgo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Confianza
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Fecha Predicción
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {estudiantes_mayor_riesgo.map((est, idx) => (
                      <tr key={`${est.id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                              <AlertTriangleIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <span className="font-semibold text-gray-900">{est.nombre}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-red-600"
                                  style={{ width: `${Math.min(est.score_riesgo * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-red-600">
                              {(est.score_riesgo * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${est.color_riesgo || 'bg-red-50 border-red-200'}`}>
                            <span className="text-lg">{est.icono_riesgo || '🔴'}</span>
                            <span className={`text-xs font-semibold ${est.text_color_riesgo || 'text-red-700'}`}>
                              {est.tipo_riesgo || 'Riesgo'}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-normal max-w-xs">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {est.razon || 'Riesgo detectado por modelo ML'}
                            </p>
                            <p className="text-xs text-gray-500 italic">
                              {est.descripcion_riesgo || 'Riesgo alto - Intervención recomendada'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-blue-600">
                            {(est.confianza * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {est.fecha_prediccion
                            ? new Date(est.fecha_prediccion + 'T00:00:00').toLocaleDateString('es-ES')
                            : 'N/A'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-600 text-lg">No hay estudiantes con riesgo alto registrados</p>
              </div>
            )}
          </div>

          {/* Detalles de Carreras Recomendadas */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Análisis Detallado de Carreras</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {carreras_recomendadas.map((carrera) => (
                <div
                  key={carrera.nombre}
                  className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{carrera.nombre}</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Recomendaciones</span>
                        <span className="text-lg font-bold text-blue-600">{carrera.cantidad}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{
                            width: `${Math.min(
                              (carrera.cantidad / Math.max(...carreras_recomendadas.map((c) => c.cantidad))) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Compatibilidad Promedio</span>
                        <span className="text-lg font-bold text-green-600">
                          {(carrera.compatibilidad_promedio * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-600"
                          style={{ width: `${Math.min(carrera.compatibilidad_promedio * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
