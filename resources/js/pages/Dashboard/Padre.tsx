import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  RadarChart,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadarController,
  Filler,
  Tooltip,
  Legend
);

interface Notificacion {
  tipo: 'danger' | 'warning' | 'success';
  mensaje: string;
}

interface CalificacionReciente {
  tarea_titulo: string;
  puntaje: number;
  fecha: string;
  comentario?: string;
}

interface HijoInfo {
  id: number;
  nombre: string;
  email: string;
  promedio: number;
  cursos: number;
  tareas_pendientes: number;
  calificaciones_recientes: CalificacionReciente[];
  fortalezas: string[];
  debilidades: string[];
  tendencia: string;
  total_cursos: number;
}

interface RendimientoHijo {
  id: number;
  nombre: string;
  promedio: number | null;
  cursos: number;
  tareas_pendientes: number;
}

interface Props {
  estadisticas: {
    total_hijos: number;
    total_cursos: number;
    tareas_pendientes: number;
    promedio_general: number | null;
  };
  notificaciones: Notificacion[];
  hijos: RendimientoHijo[];
  hijosInfo: HijoInfo[];
}

// Función para obtener datos del gráfico de calificaciones
const getCalificacionesChartData = (calificaciones: CalificacionReciente[]) => {
  if (calificaciones.length === 0) {
    return null;
  }

  const sortedCalificaciones = [...calificaciones].reverse();

  return {
    labels: sortedCalificaciones.map((_, i) => `Cal. ${i + 1}`),
    datasets: [
      {
        label: 'Puntajes',
        data: sortedCalificaciones.map((c) => c.puntaje),
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#ec4899',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };
};

// Función para obtener datos del gráfico de fortalezas y debilidades
const getFortalezasDebilidades = (fortalezas: string[], debilidades: string[]) => {
  if (fortalezas.length === 0 && debilidades.length === 0) {
    return null;
  }

  const maxItems = Math.max(fortalezas.length, debilidades.length);
  const labels = Array.from({ length: maxItems }, (_, i) => `Área ${i + 1}`);

  return {
    labels,
    datasets: [
      {
        label: 'Fortalezas',
        data: fortalezas.map(() => 1),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Áreas de mejora',
        data: debilidades.map(() => 1),
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
      },
    ],
  };
};

export default function DashboardPadre({
  estadisticas,
  notificaciones,
  hijos,
  hijosInfo,
}: Props) {
  const [selectedHijoId, setSelectedHijoId] = useState<number | null>(
    hijos.length > 0 ? hijos[0].id : null
  );

  const selectedHijo = hijosInfo.find((h) => h.id === selectedHijoId);
  const rendimientoPorHijo = hijos;

  // Función para obtener clase de color según promedio
  const getPromedioColor = (promedio: number) => {
    if (promedio >= 90) return 'text-green-600';
    if (promedio >= 80) return 'text-blue-600';
    if (promedio >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Función para obtener clase de fondo según promedio
  const getPromedioBackgroundColor = (promedio: number) => {
    if (promedio >= 90) return 'bg-green-50';
    if (promedio >= 80) return 'bg-blue-50';
    if (promedio >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
  };
  return (
    <AppLayout>
      <Head title="Inicio - Padre" />
      <div className="bg-gradient-to-br from-slate-50 via-rose-50 to-slate-50 min-h-full">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Panel de Padre/Tutor
              </h1>
              <p className="mt-3 text-base text-gray-600">
                Monitorea el progreso académico de tus hijos
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
              <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <UserIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Hijos Registrados
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900">
                    {estadisticas.total_hijos || 0}
                  </dd>
                </div>
              </div>

              <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <AcademicCapIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Cursos Totales
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900">
                    {estadisticas.total_cursos || 0}
                  </dd>
                </div>
              </div>

              <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                      <DocumentTextIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Tareas Pendientes
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900">
                    {estadisticas.tareas_pendientes || 0}
                  </dd>
                </div>
              </div>

              <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                      <ChartBarIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Promedio General
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900">
                    {estadisticas.promedio_general?.toFixed(1) || 'N/A'}
                  </dd>
                </div>
              </div>
            </div>

            {/* Notificaciones Importantes */}
            {notificaciones.length > 0 && (
              <div className="mb-8 bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Notificaciones Importantes
                </h2>
                <div className="space-y-3">
                  {notificaciones.map((notif, index) => (
                    <div
                      key={index}
                      className={`p-5 rounded-xl border-2 ${notif.tipo === 'danger'
                        ? 'bg-red-50 border-red-200'
                        : notif.tipo === 'warning'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-green-50 border-green-200'
                        }`}
                    >
                      <div className="flex items-start">
                        {notif.tipo === 'danger' ? (
                          <div className="p-2 bg-red-500 rounded-lg">
                            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                          </div>
                        ) : notif.tipo === 'warning' ? (
                          <div className="p-2 bg-yellow-500 rounded-lg">
                            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
                          </div>
                        ) : (
                          <div className="p-2 bg-green-500 rounded-lg">
                            <CheckCircleIcon className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <p className="ml-4 text-sm text-gray-700 font-medium">{notif.mensaje}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de Hijo */}
            {rendimientoPorHijo.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Selecciona un hijo:</h2>
                <div className="flex flex-wrap gap-3">
                  {rendimientoPorHijo.map((hijo) => (
                    <button
                      key={hijo.id}
                      onClick={() => setSelectedHijoId(hijo.id)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        selectedHijoId === hijo.id
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-rose-300'
                      }`}
                    >
                      {hijo.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Información Detallada del Hijo Seleccionado */}
            {selectedHijo && (
              <div className="space-y-8">
                {/* Tarjeta de Resumen */}
                <div className={`shadow-xl rounded-2xl p-8 ${getPromedioBackgroundColor(selectedHijo.promedio)} border-2 ${
                  selectedHijo.promedio >= 90 ? 'border-green-200' :
                  selectedHijo.promedio >= 80 ? 'border-blue-200' :
                  selectedHijo.promedio >= 70 ? 'border-yellow-200' :
                  'border-red-200'
                }`}>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">{selectedHijo.nombre}</h2>
                      <p className="text-gray-600 text-sm mt-1">{selectedHijo.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Promedio General</p>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={`text-5xl font-black ${getPromedioColor(selectedHijo.promedio)}`}>
                            {selectedHijo.promedio.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">de 100</p>
                        </div>
                        <div className="text-3xl">
                          {selectedHijo.promedio >= 90 ? '🌟' : selectedHijo.promedio >= 80 ? '⭐' : selectedHijo.promedio >= 70 ? '📈' : '⚠️'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso del promedio */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Progreso del Promedio</span>
                      <span className="text-sm text-gray-600">{Math.min(selectedHijo.promedio, 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          selectedHijo.promedio >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          selectedHijo.promedio >= 80 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          selectedHijo.promedio >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${Math.min(selectedHijo.promedio, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="p-5 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                        <p className="text-xs font-semibold text-gray-500 uppercase">Cursos</p>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">{selectedHijo.cursos}</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <DocumentTextIcon className="h-5 w-5 text-orange-600" />
                        <p className="text-xs font-semibold text-gray-500 uppercase">Pendientes</p>
                      </div>
                      <p className="text-3xl font-bold text-orange-600">{selectedHijo.tareas_pendientes}</p>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        {selectedHijo.tendencia === 'mejorando' ? (
                          <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                        ) : selectedHijo.tendencia === 'decayendo' ? (
                          <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
                        ) : (
                          <SparklesIcon className="h-5 w-5 text-gray-600" />
                        )}
                        <p className="text-xs font-semibold text-gray-500 uppercase">Tendencia</p>
                      </div>
                      <p className={`text-lg font-bold capitalize ${
                        selectedHijo.tendencia === 'mejorando' ? 'text-green-600' :
                        selectedHijo.tendencia === 'decayendo' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {selectedHijo.tendencia === 'mejorando' ? '📈 Mejorando' : selectedHijo.tendencia === 'decayendo' ? '📉 Decayendo' : '➡️ Estable'}
                      </p>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                        <p className="text-xs font-semibold text-gray-500 uppercase">Estado</p>
                      </div>
                      <p className="text-lg font-bold text-purple-600">
                        {selectedHijo.promedio >= 90 ? '✓ Excelente' : selectedHijo.promedio >= 80 ? '✓ Bueno' : selectedHijo.promedio >= 70 ? 'Regular' : '⚠️ Bajo'}
                      </p>
                    </div>
                    <div className="p-5 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarIcon className="h-5 w-5 text-indigo-600" />
                        <p className="text-xs font-semibold text-gray-500 uppercase">Califs</p>
                      </div>
                      <p className="text-3xl font-bold text-indigo-600">{selectedHijo.calificaciones_recientes.length}</p>
                    </div>
                  </div>
                </div>

                {/* Calificaciones Recientes */}
                {selectedHijo.calificaciones_recientes.length > 0 && (
                  <div className="bg-white shadow-xl rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                      <ChartBarIcon className="h-6 w-6 text-rose-600" />
                      Calificaciones Recientes
                    </h3>

                    {/* Gráfico de calificaciones */}
                    <div className="mb-8 p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl">
                      {getCalificacionesChartData(selectedHijo.calificaciones_recientes) && (
                        <Line
                          data={getCalificacionesChartData(selectedHijo.calificaciones_recientes)!}
                          options={{
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
                          }}
                          height={300}
                        />
                      )}
                    </div>

                    {/* Listado detallado */}
                    <div className="space-y-3">
                      {selectedHijo.calificaciones_recientes.map((cal, index) => (
                        <div key={index} className="p-5 border-2 border-gray-100 rounded-xl hover:border-rose-300 hover:bg-rose-50/30 transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{cal.tarea_titulo}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(cal.fecha).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="inline-block">
                                <span className={`inline-block px-4 py-2 rounded-full font-bold text-sm w-20 text-center ${
                                  cal.puntaje >= 90
                                    ? 'bg-green-100 text-green-800'
                                    : cal.puntaje >= 80
                                      ? 'bg-blue-100 text-blue-800'
                                      : cal.puntaje >= 70
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                  {cal.puntaje}
                                </span>
                              </div>
                            </div>
                          </div>
                          {cal.comentario && (
                            <p className="text-sm text-gray-600 italic border-l-4 border-rose-300 pl-4 py-2 bg-gray-50 rounded">
                              💬 {cal.comentario}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fortalezas y Debilidades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedHijo.fortalezas.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl rounded-2xl p-8 border-2 border-green-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <StarIcon className="h-6 w-6 text-white" />
                        </div>
                        Fortalezas
                      </h3>
                      <ul className="space-y-3">
                        {selectedHijo.fortalezas.map((fortaleza, index) => (
                          <li key={index} className="flex items-start gap-4 p-3 bg-white rounded-lg border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-green-600 font-bold text-lg mt-0.5">✓</span>
                            <span className="text-gray-700 font-medium">{fortaleza}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedHijo.debilidades.length > 0 && (
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 shadow-xl rounded-2xl p-8 border-2 border-orange-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <ExclamationTriangleIcon className="h-6 w-6 text-white" />
                        </div>
                        Áreas de Mejora
                      </h3>
                      <ul className="space-y-3">
                        {selectedHijo.debilidades.map((debilidad, index) => (
                          <li key={index} className="flex items-start gap-4 p-3 bg-white rounded-lg border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
                            <span className="text-orange-600 font-bold text-lg mt-0.5">!</span>
                            <span className="text-gray-700 font-medium">{debilidad}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-600 mt-6 p-4 bg-white rounded-lg border-l-4 border-orange-300">
                        💡 Estas áreas representan oportunidades para mejorar el desempeño académico
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rendimiento por Hijo (Vista General) */}
            {rendimientoPorHijo.length > 0 && !selectedHijo && (
              <div className="bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Rendimiento por Hijo
                </h2>
                <div className="space-y-4">
                  {rendimientoPorHijo.map((hijo) => (
                    <div
                      key={hijo.id}
                      className="p-6 border-2 border-gray-100 rounded-xl hover:border-rose-300 hover:bg-rose-50/50 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedHijoId(hijo.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{hijo.nombre}</h3>
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-full shadow-md">
                          Promedio: {hijo.promedio?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <p className="text-gray-500 font-medium mb-1">Cursos</p>
                          <p className="text-2xl font-bold text-blue-600">{hijo.cursos}</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-xl">
                          <p className="text-gray-500 font-medium mb-1">Tareas Pendientes</p>
                          <p className="text-2xl font-bold text-orange-600">{hijo.tareas_pendientes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sin hijos */}
            {rendimientoPorHijo.length === 0 && (
              <div className="bg-white shadow-xl rounded-2xl p-8">
                <div className="text-center py-16">
                  <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    No hay hijos registrados en tu cuenta
                  </p>
                  <p className="text-xs text-gray-400">
                    Contacta con la administración para vincular cuentas
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
