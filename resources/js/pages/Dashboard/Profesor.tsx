import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Estadisticas {
  total_cursos: number;
  total_estudiantes: number;
  tareas_pendientes_revision: number;
  evaluaciones_activas: number;
}

interface Curso {
  id: number;
  nombre: string;
  estudiantes_count: number;
  activo: boolean;
}

interface TrabajoPendiente {
  id: number;
  fecha_entrega: string;
  estudiante: {
    name: string;
    apellido: string;
  };
  contenido: {
    titulo: string;
    curso: {
      nombre: string;
    };
  };
}

interface Props {
  estadisticas: Estadisticas;
  cursos: Curso[];
  trabajosPendientes: TrabajoPendiente[];
  actividadReciente: {
    tareas_creadas: number;
    trabajos_calificados: number;
  };
}

export default function DashboardProfesor({
  estadisticas,
  cursos,
  trabajosPendientes,
  actividadReciente,
}: Props) {
  return (
    <AppLayout>
      <Head title="Inicio - Profesor" />
      <div className="bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50 min-h-full">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Bienvenido, Profesor
              </h1>
              <p className="mt-3 text-base text-gray-600">
                Aquí está un resumen de tus actividades y cursos
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
                  <dd className="text-3xl font-bold text-gray-900 mb-4">
                    {estadisticas.total_cursos}
                  </dd>
                  <Link
                    href="/cursos"
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group-hover:underline"
                  >
                    Ver todos
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>

              <div className="group relative bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                      <UserGroupIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <dt className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Total Estudiantes
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900 mb-4">
                    {estadisticas.total_estudiantes}
                  </dd>
                  <span className="text-sm text-gray-500">
                    En todos tus cursos
                  </span>
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
                    Por Revisar
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900 mb-4">
                    {estadisticas.tareas_pendientes_revision}
                  </dd>
                  <Link
                    href="/trabajos"
                    className="inline-flex items-center text-sm font-semibold text-orange-600 hover:text-orange-700 group-hover:underline"
                  >
                    Revisar trabajos
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
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
                    Evaluaciones Activas
                  </dt>
                  <dd className="text-3xl font-bold text-gray-900 mb-4">
                    {estadisticas.evaluaciones_activas}
                  </dd>
                  <Link
                    href="/evaluaciones"
                    className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700 group-hover:underline"
                  >
                    Ver evaluaciones
                    <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mis Cursos */}
              <div className="bg-white shadow-xl rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Mis Cursos
                  </h2>
                  <Link
                    href="/cursos"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Ver todos
                  </Link>
                </div>
                {cursos.length > 0 ? (
                  <div className="space-y-3">
                    {cursos.slice(0, 5).map((curso) => (
                      <div
                        key={curso.id}
                        className="group flex items-center justify-between p-5 border-2 border-gray-100 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {curso.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {curso.estudiantes_count} estudiante(s)
                          </p>
                        </div>
                        <div>
                          {curso.activo ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md">
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                              Inactivo
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                      <AcademicCapIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      No tienes cursos asignados aún
                    </p>
                    <Link
                      href="/cursos/create"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Crear curso
                    </Link>
                  </div>
                )}
              </div>

              {/* Trabajos Pendientes de Revisión */}
              <div className="bg-white shadow-xl rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Pendientes de Revisión
                  </h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
                    {estadisticas.tareas_pendientes_revision}
                  </span>
                </div>

                {trabajosPendientes.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {trabajosPendientes.map((trabajo) => (
                      <div
                        key={trabajo.id}
                        className="group p-5 border-2 border-gray-100 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-orange-700 transition-colors">
                              {trabajo.contenido.titulo}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {trabajo.contenido.curso.nombre}
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                              Estudiante: {trabajo.estudiante.name}{' '}
                              {trabajo.estudiante.apellido}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <p className="text-xs text-gray-500">
                              {new Date(
                                trabajo.fecha_entrega
                              ).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Link
                            href={`/trabajos/${trabajo.id}`}
                            className="inline-flex items-center text-sm text-orange-600 hover:text-orange-700 font-semibold group-hover:underline"
                          >
                            Revisar
                            <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                      <CheckCircleIcon className="h-12 w-12 text-green-500" />
                    </div>
                    <p className="text-sm text-gray-500">
                      ¡No hay trabajos pendientes de revisión!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actividad Reciente */}
            <div className="mt-8 bg-white shadow-xl rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Actividad de los últimos 7 días
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md">
                  <div className="p-3 bg-blue-500 rounded-xl mr-4">
                    <DocumentTextIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {actividadReciente.tareas_creadas}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Tareas creadas</p>
                  </div>
                </div>
                <div className="flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md">
                  <div className="p-3 bg-green-500 rounded-xl mr-4">
                    <CheckCircleIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      {actividadReciente.trabajos_calificados}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Trabajos calificados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="mt-8 bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
                <h2 className="text-xl font-bold text-white">
                  Acciones Rápidas
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  Crea nuevo contenido educativo
                </p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link
                    href="/tareas/create"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-blue-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <DocumentTextIcon className="h-7 w-7 text-white group-hover:text-blue-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Crear Tarea
                    </span>
                  </Link>
                  <Link
                    href="/evaluaciones/create"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-purple-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <ClockIcon className="h-7 w-7 text-white group-hover:text-purple-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Crear Evaluación
                    </span>
                  </Link>
                  <Link
                    href="/contenido/create"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-green-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <AcademicCapIcon className="h-7 w-7 text-white group-hover:text-green-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Crear Contenido
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
