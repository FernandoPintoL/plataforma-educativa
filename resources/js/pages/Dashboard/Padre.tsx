import React from 'react';
import Layout from '../../components/Layout/Layout';
import {
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Props {
  estadisticas: any;
  hijos: any[];
  notificaciones: any[];
  proximasEvaluaciones: any[];
  rendimientoPorHijo: any[];
}

export default function DashboardPadre({
  estadisticas,
  hijos,
  notificaciones,
  proximasEvaluaciones,
  rendimientoPorHijo,
}: Props) {
  return (
    <Layout>
      <div className="py-12">

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Padre/Tutor</h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitorea el progreso académico de tus hijos
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">Hijos Registrados</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {estadisticas.total_hijos || 0}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">Cursos Totales</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {estadisticas.total_cursos || 0}
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
                    <dt className="text-sm font-medium text-gray-500">Tareas Pendientes</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {estadisticas.tareas_pendientes || 0}
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <ChartBarIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-5">
                    <dt className="text-sm font-medium text-gray-500">Promedio General</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {estadisticas.promedio_general?.toFixed(1) || 'N/A'}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notificaciones Importantes */}
          {notificaciones.length > 0 && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notificaciones Importantes
              </h2>
              <div className="space-y-3">
                {notificaciones.map((notif, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      notif.tipo === 'danger'
                        ? 'bg-red-50 border-red-200'
                        : notif.tipo === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start">
                      {notif.tipo === 'danger' ? (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                      ) : notif.tipo === 'warning' ? (
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                      ) : (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
                      )}
                      <p className="ml-3 text-sm text-gray-700">{notif.mensaje}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rendimiento por Hijo */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Rendimiento por Hijo
            </h2>
            {rendimientoPorHijo.length > 0 ? (
              <div className="space-y-4">
                {rendimientoPorHijo.map((hijo, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{hijo.nombre}</h3>
                      <span className="text-sm text-gray-500">
                        Promedio: {hijo.promedio?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Cursos</p>
                        <p className="font-medium">{hijo.cursos}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tareas Pendientes</p>
                        <p className="font-medium">{hijo.tareas_pendientes}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Asistencia</p>
                        <p className="font-medium">{hijo.asistencia}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  No hay hijos registrados en tu cuenta
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Contacta con la administración para vincular cuentas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
