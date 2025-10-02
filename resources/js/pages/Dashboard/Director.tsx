import React from 'react';
import { Link } from '@inertiajs/react';
import Layout from '../../components/Layout/Layout';
import {
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface Estadisticas {
  total_estudiantes: number;
  total_profesores: number;
  total_padres: number;
}

interface Props {
  estadisticas: Estadisticas;
}

export default function DashboardDirector({ estadisticas }: Props) {
  return (
    <Layout>
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-full">
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Panel de Dirección
              </h1>
              <p className="mt-3 text-base text-gray-600">
                Vista general del sistema educativo
              </p>
            </div>

            {/* Estadísticas Principales */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              <div className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <dt className="text-sm font-semibold text-blue-100 uppercase tracking-wide mb-2">
                        Estudiantes
                      </dt>
                      <dd className="text-4xl font-bold text-white">
                        {estadisticas.total_estudiantes}
                      </dd>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                        <UserIcon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <dt className="text-sm font-semibold text-green-100 uppercase tracking-wide mb-2">
                        Profesores
                      </dt>
                      <dd className="text-4xl font-bold text-white">
                        {estadisticas.total_profesores}
                      </dd>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                        <AcademicCapIcon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <dt className="text-sm font-semibold text-purple-100 uppercase tracking-wide mb-2">
                        Padres
                      </dt>
                      <dd className="text-4xl font-bold text-white">
                        {estadisticas.total_padres}
                      </dd>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                        <UsersIcon className="h-12 w-12 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h2 className="text-xl font-bold text-white">
                  Gestión Administrativa
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Accede rápidamente a las funciones principales
                </p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link
                    href="/admin/usuarios/create"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-blue-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <UserGroupIcon className="h-7 w-7 text-white group-hover:text-blue-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Crear Usuario
                    </span>
                  </Link>
                  <Link
                    href="/admin/usuarios"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-green-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <UsersIcon className="h-7 w-7 text-white group-hover:text-green-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Gestionar Usuarios
                    </span>
                  </Link>
                  <Link
                    href="/cursos"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-purple-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <AcademicCapIcon className="h-7 w-7 text-white group-hover:text-purple-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Ver Cursos
                    </span>
                  </Link>
                  <Link
                    href="/reportes"
                    className="group flex flex-col items-center justify-center px-6 py-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105"
                  >
                    <div className="p-3 bg-orange-500 group-hover:bg-white rounded-xl mb-3 transition-colors duration-300">
                      <ChartBarIcon className="h-7 w-7 text-white group-hover:text-orange-600 transition-colors duration-300" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors duration-300 text-center">
                      Reportes
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
