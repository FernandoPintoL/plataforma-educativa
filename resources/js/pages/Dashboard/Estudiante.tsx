import React from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { RiskWidget } from '@/components/dashboard/RiskWidget';
import { TrendWidget } from '@/components/dashboard/TrendWidget';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon as AlertCircleIcon,
} from '@heroicons/react/24/outline';

interface TareaPendiente {
  id: number;
  titulo: string;
  fecha_limite: string;
  contenido: {
    curso: {
      nombre: string;
    };
  };
}

interface ProgresoCurso {
  curso: {
    nombre: string;
  };
  porcentaje: number;
  tareas_completadas: number;
  total_tareas: number;
}

interface Props {
  estadisticas: {
    total_cursos: number;
    tareas_pendientes: number;
    evaluaciones_proximas: number;
    promedio_general: number | null;
  };
  tareasPendientes: TareaPendiente[];
  progresoCursos: ProgresoCurso[];
}

export default function DashboardEstudiante({
  estadisticas,
  tareasPendientes,
  progresoCursos,
}: Props) {
  return (
    <AppLayout>
      <Head title="Inicio - Estudiante" />
      <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 min-h-full">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Mi Panel de Estudiante
              </h1>
              <p className="mt-3 text-base text-gray-600">
                Bienvenido, aquí puedes ver tu progreso y tareas pendientes
              </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
              <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <AcademicCapIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Mis Cursos
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900">
                    {estadisticas.total_cursos}
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
                    {estadisticas.tareas_pendientes}
                  </dd>
                </div>
              </div>

              <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                      <ClockIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Evaluaciones Próximas
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900">
                    {estadisticas.evaluaciones_proximas}
                  </dd>
                </div>
              </div>

              <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
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

            {/* Risk and Trend Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <RiskWidget />
              <TrendWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tareas Pendientes */}
              <div className="bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Próximas Tareas
                </h2>
                {tareasPendientes.length > 0 ? (
                  <div className="space-y-3">
                    {tareasPendientes.slice(0, 5).map((tarea) => (
                      <div
                        key={tarea.id}
                        className="group p-5 border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300"
                      >
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-700 transition-colors">
                          {tarea.titulo}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {tarea.contenido.curso.nombre}
                        </p>
                        <p className="text-xs text-orange-600 font-semibold mt-2">
                          Vence:{' '}
                          {new Date(tarea.fecha_limite).toLocaleDateString(
                            'es-ES'
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                      <CheckCircleIcon className="h-12 w-12 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-500">
                      ¡No tienes tareas pendientes!
                    </p>
                  </div>
                )}
              </div>

              {/* Progreso por Curso */}
              <div className="bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Mi Progreso
                </h2>
                {progresoCursos.length > 0 ? (
                  <div className="space-y-4">
                    {progresoCursos.map((item, index: number) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-gray-700">
                            {item.curso.nombre}
                          </span>
                          <span className="font-bold text-blue-600">
                            {item.porcentaje}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${item.porcentaje}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {item.tareas_completadas} de {item.total_tareas} tareas
                          completadas
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                      <AcademicCapIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      No estás inscrito en cursos aún
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="mt-8 bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <h2 className="text-xl font-bold text-white">
                  Acciones Rápidas
                </h2>
                <p className="text-indigo-100 text-sm mt-1">
                  Accede rápidamente a tus recursos
                </p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    href="/cursos"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-blue-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <AcademicCapIcon className="h-7 w-7 text-white group-hover:text-blue-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Mis Cursos
                    </span>
                  </Link>
                  <Link
                    href="/tareas"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-orange-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <DocumentTextIcon className="h-7 w-7 text-white group-hover:text-orange-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Mis Tareas
                    </span>
                  </Link>
                  <Link
                    href="/calificaciones"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-green-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <ChartBarIcon className="h-7 w-7 text-white group-hover:text-green-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Calificaciones
                    </span>
                  </Link>
                  <Link
                    href="/mi-perfil/carreras"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-purple-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <AcademicCapIcon className="h-7 w-7 text-white group-hover:text-purple-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Carreras
                    </span>
                  </Link>
                  <Link
                    href="/mi-perfil/riesgo"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-red-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <AlertCircleIcon className="h-7 w-7 text-white group-hover:text-red-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Mi Riesgo
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
