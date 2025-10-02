import React from 'react';
import { Link } from '@inertiajs/react';
import Layout from '../../components/Layout/Layout';
import {
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
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
  tarea: {
    titulo: string;
    contenido: {
      curso: {
        nombre: string;
      };
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
    <Layout>
      <div className="py-12">

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido, Profesor
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Aquí está un resumen de tus actividades y cursos
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Mis Cursos
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {estadisticas.total_cursos}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 px-5 py-3">
                <Link
                  href="/cursos"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Ver todos →
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Estudiantes
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {estadisticas.total_estudiantes}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 px-5 py-3">
                <span className="text-sm text-gray-600">
                  En todos tus cursos
                </span>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Por Revisar
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {estadisticas.tareas_pendientes_revision}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 px-5 py-3">
                <Link
                  href="/trabajos"
                  className="text-sm font-medium text-orange-600 hover:text-orange-800"
                >
                  Revisar trabajos →
                </Link>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Evaluaciones Activas
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {estadisticas.evaluaciones_activas}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 px-5 py-3">
                <Link
                  href="/evaluaciones"
                  className="text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  Ver evaluaciones →
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mis Cursos */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Mis Cursos
                </h2>
                <Link
                  href="/cursos"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ver todos
                </Link>
              </div>

              {cursos.length > 0 ? (
                <div className="space-y-3">
                  {cursos.map((curso) => (
                    <div
                      key={curso.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {curso.nombre}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {curso.estudiantes_count} estudiante(s)
                        </p>
                      </div>
                      <div>
                        {curso.activo ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactivo
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No tienes cursos asignados aún
                  </p>
                  <Link
                    href="/cursos/create"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Crear curso
                  </Link>
                </div>
              )}
            </div>

            {/* Trabajos Pendientes de Revisión */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Pendientes de Revisión
                </h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {estadisticas.tareas_pendientes_revision}
                </span>
              </div>

              {trabajosPendientes.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {trabajosPendientes.map((trabajo) => (
                    <div
                      key={trabajo.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">
                            {trabajo.tarea.titulo}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {trabajo.tarea.contenido.curso.nombre}
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
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Revisar →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    ¡No hay trabajos pendientes de revisión!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Actividad de los últimos 7 días
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {actividadReciente.tareas_creadas}
                  </p>
                  <p className="text-sm text-gray-600">Tareas creadas</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {actividadReciente.trabajos_calificados}
                  </p>
                  <p className="text-sm text-gray-600">Trabajos calificados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/tareas/create"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition"
              >
                <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Crear Tarea
                </span>
              </Link>
              <Link
                href="/evaluaciones/create"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition"
              >
                <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Crear Evaluación
                </span>
              </Link>
              <Link
                href="/contenido/create"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition"
              >
                <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Crear Contenido
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
