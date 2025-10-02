import React from 'react';
import { Link } from '@inertiajs/react';
import Layout from '../../components/Layout/Layout';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Props {
  estadisticas: {
    total_cursos: number;
    tareas_pendientes: number;
    evaluaciones_proximas: number;
    promedio_general: number | null;
  };
  tareasPendientes: any[];
  evaluacionesProximas: any[];
  calificacionesRecientes: any[];
  progresoCursos: any[];
}

export default function DashboardEstudiante({
  estadisticas,
  tareasPendientes,
  evaluacionesProximas,
  calificacionesRecientes,
  progresoCursos,
}: Props) {
  return (
    <Layout>
      <div className="py-12">

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Mi Panel de Estudiante
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenido, aquí puedes ver tu progreso y tareas pendientes
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">
                      Mis Cursos
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {estadisticas.total_cursos}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-orange-600" />
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">
                      Tareas Pendientes
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {estadisticas.tareas_pendientes}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">
                      Evaluaciones Próximas
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {estadisticas.evaluaciones_proximas}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">
                      Promedio General
                    </dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {estadisticas.promedio_general?.toFixed(1) || 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tareas Pendientes */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Próximas Tareas
              </h2>
              {tareasPendientes.length > 0 ? (
                <div className="space-y-3">
                  {tareasPendientes.slice(0, 5).map((tarea) => (
                    <div
                      key={tarea.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <h3 className="font-medium text-gray-900 text-sm">
                        {tarea.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {tarea.contenido.curso.nombre}
                      </p>
                      <p className="text-xs text-orange-600 mt-2">
                        Vence:{' '}
                        {new Date(tarea.fecha_limite).toLocaleDateString(
                          'es-ES'
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    ¡No tienes tareas pendientes!
                  </p>
                </div>
              )}
            </div>

            {/* Progreso por Curso */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Mi Progreso
              </h2>
              {progresoCursos.length > 0 ? (
                <div className="space-y-4">
                  {progresoCursos.map((item: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">
                          {item.curso.nombre}
                        </span>
                        <span className="text-gray-500">
                          {item.porcentaje}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.porcentaje}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.tareas_completadas} de {item.total_tareas} tareas
                        completadas
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  No estás inscrito en cursos aún
                </p>
              )}
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/cursos"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50"
              >
                <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Mis Cursos</span>
              </Link>
              <Link
                href="/tareas"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50"
              >
                <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Mis Tareas</span>
              </Link>
              <Link
                href="/calificaciones"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50"
              >
                <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Calificaciones</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
