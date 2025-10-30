import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import {
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface Notificacion {
  tipo: 'danger' | 'warning' | 'success';
  mensaje: string;
}

interface RendimientoHijo {
  nombre: string;
  promedio: number | null;
  cursos: number;
  tareas_pendientes: number;
  asistencia: number;
}

interface Props {
  estadisticas: {
    total_hijos: number;
    total_cursos: number;
    tareas_pendientes: number;
    promedio_general: number | null;
  };
  notificaciones: Notificacion[];
  rendimientoPorHijo: RendimientoHijo[];
}

export default function DashboardPadre({
  estadisticas,
  notificaciones,
  rendimientoPorHijo,
}: Props) {
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

            {/* Rendimiento por Hijo */}
            <div className="bg-white shadow-xl rounded-2xl p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Rendimiento por Hijo
              </h2>
              {rendimientoPorHijo.length > 0 ? (
                <div className="space-y-4">
                  {rendimientoPorHijo.map((hijo, index) => (
                    <div key={index} className="p-6 border-2 border-gray-100 rounded-xl hover:border-rose-300 hover:bg-rose-50/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">{hijo.nombre}</h3>
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-full shadow-md">
                          Promedio: {hijo.promedio?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <p className="text-gray-500 font-medium mb-1">Cursos</p>
                          <p className="text-2xl font-bold text-blue-600">{hijo.cursos}</p>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-xl">
                          <p className="text-gray-500 font-medium mb-1">Tareas Pendientes</p>
                          <p className="text-2xl font-bold text-orange-600">{hijo.tareas_pendientes}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                          <p className="text-gray-500 font-medium mb-1">Asistencia</p>
                          <p className="text-2xl font-bold text-green-600">{hijo.asistencia}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
