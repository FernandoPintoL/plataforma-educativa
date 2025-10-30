import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

interface Estudiante {
  id: number;
  nombre: string;
  promedio: number;
  cursos: number;
  trabajos_entregados: number;
  tendencia: string;
}

interface Props {
  topEstudiantes: Estudiante[];
  bottomEstudiantes: Estudiante[];
  distribucion: Record<string, number>;
  tendencia: Record<string, number>;
  totalEstudiantes: number;
  promedioGeneral: number;
  modulosSidebar: any[];
}

export default function AnalisisComparativo({
  topEstudiantes,
  bottomEstudiantes,
  distribucion,
  tendencia,
  totalEstudiantes,
  promedioGeneral,
  modulosSidebar,
}: Props) {
  // Datos para gráfico de distribución
  const distribucionChartData = {
    labels: ['Excelente (90+)', 'Bueno (80-89)', 'Regular (70-79)', 'Bajo (<70)'],
    datasets: [
      {
        label: 'Cantidad de Estudiantes',
        data: [distribucion.excelente, distribucion.bueno, distribucion.regular, distribucion.bajo],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',    // Green
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(251, 191, 36, 0.8)',   // Yellow
          'rgba(239, 68, 68, 0.8)',    // Red
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

  // Datos para gráfico de tendencia
  const tendenciaChartData = {
    labels: ['Mejorando', 'Estable', 'Decayendo'],
    datasets: [
      {
        label: 'Cantidad de Estudiantes',
        data: [tendencia.mejorando, tendencia.estable, tendencia.decayendo],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(107, 114, 128, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(107, 114, 128)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Datos para gráfico de top estudiantes
  const topChartData = {
    labels: topEstudiantes.map((e) => e.nombre.split(' ')[0]),
    datasets: [
      {
        label: 'Promedio',
        data: topEstudiantes.map((e) => e.promedio),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
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
  };

  return (
    <AppLayout>
      <Head title="Análisis Comparativo - Reportes" />
      <div className="bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 min-h-full py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <ChartBarIcon className="h-10 w-10 text-purple-600" />
              Análisis Comparativo
            </h1>
            <p className="mt-2 text-gray-600">
              Rankings y comparativas detalladas de desempeño académico
            </p>
          </div>

          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
              <p className="text-sm opacity-90 mb-2">Total de Estudiantes Analizados</p>
              <p className="text-5xl font-bold mb-4">{totalEstudiantes}</p>
              <p className="text-sm opacity-75">Estudiantes con registros de desempeño</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
              <p className="text-sm opacity-90 mb-2">Promedio General Institucional</p>
              <p className="text-5xl font-bold mb-4">{promedioGeneral.toFixed(1)}</p>
              <p className="text-sm opacity-75">Promedio de todos los estudiantes</p>
            </div>
          </div>

          {/* Gráficos de distribución */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Distribución por rango */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Distribución por Desempeño</h2>
              <Doughnut
                data={distribucionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        padding: 15,
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }}
                height={300}
              />
            </div>

            {/* Distribución por tendencia */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tendencia de Estudiantes</h2>
              <Doughnut
                data={tendenciaChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        padding: 15,
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }}
                height={300}
              />
            </div>
          </div>

          {/* Top 10 estudiantes */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-green-600" />
              Top 10 Mejores Estudiantes
            </h2>
            <div className="mb-8">
              <Bar
                data={topChartData}
                options={chartOptions}
                height={300}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Posición</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Estudiante</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-900">Promedio</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-900">Cursos</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-900">Trabajos</th>
                  </tr>
                </thead>
                <tbody>
                  {topEstudiantes.map((estudiante, idx) => (
                    <tr key={estudiante.id} className="border-b border-gray-100 hover:bg-green-50">
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{estudiante.nombre}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-2xl font-bold text-green-600">{estudiante.promedio.toFixed(1)}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">{estudiante.cursos}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{estudiante.trabajos_entregados}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom 10 estudiantes */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">⚠️ Estudiantes Que Necesitan Apoyo</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Posición</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Estudiante</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-900">Promedio</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-900">Cursos</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-900">Trabajos</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-900">Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {bottomEstudiantes.map((estudiante, idx) => (
                    <tr key={estudiante.id} className="border-b border-gray-100 hover:bg-red-50">
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{estudiante.nombre}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-2xl font-bold text-red-600">{estudiante.promedio.toFixed(1)}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-700">{estudiante.cursos}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{estudiante.trabajos_entregados}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          estudiante.tendencia === 'mejorando' ? 'bg-green-100 text-green-800' :
                          estudiante.tendencia === 'decayendo' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {estudiante.tendencia === 'mejorando' ? '📈' : estudiante.tendencia === 'decayendo' ? '📉' : '➡️'} {
                            estudiante.tendencia === 'mejorando' ? 'Mejorando' :
                            estudiante.tendencia === 'decayendo' ? 'Decayendo' :
                            'Estable'
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="mt-10 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Recomendaciones</h3>
            <ul className="space-y-3 text-gray-800">
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Los estudiantes con promedio bajo necesitan atención personalizada y seguimiento académico</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Implementar programas de tutoría para los estudiantes en riesgo académico</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Reconocer y destacar el desempeño de los mejores estudiantes como modelo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl">✓</span>
                <span>Analizar tendencias decrecientes para intervenir a tiempo</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
