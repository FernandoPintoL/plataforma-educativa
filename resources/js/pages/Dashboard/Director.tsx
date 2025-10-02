import React from 'react';
import { Link } from '@inertiajs/react';
import Layout from '../../components/Layout/Layout';
import {
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  ChartBarIcon,
  TrendingUpIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface Props {
  estadisticas: any;
  cursosConEstudiantes: any[];
  profesoresActivos: any[];
  actividadReciente: any;
  usuariosRecientes: any[];
  rendimientoGeneral: any;
  crecimientoMensual: any[];
}

export default function DashboardDirector({
  estadisticas,
  cursosConEstudiantes,
  profesoresActivos,
  actividadReciente,
  usuariosRecientes,
  rendimientoGeneral,
}: Props) {
  return (
    <Layout>
      <div className="py-12">

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Dirección</h1>
            <p className="mt-2 text-sm text-gray-600">Vista general del sistema educativo</p>
          </div>

          {/* Estadísticas Principales */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <UserIcon className="h-10 w-10 text-white opacity-80" />
                  <div className="ml-5 text-white">
                    <dt className="text-sm font-medium opacity-90">Estudiantes</dt>
                    <dd className="text-3xl font-bold">{estadisticas.total_estudiantes}</dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-10 w-10 text-white opacity-80" />
                  <div className="ml-5 text-white">
                    <dt className="text-sm font-medium opacity-90">Profesores</dt>
                    <dd className="text-3xl font-bold">{estadisticas.total_profesores}</dd>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <UsersIcon className="h-10 w-10 text-white opacity-80" />
                  <div className="ml-5 text-white">
                    <dt className="text-sm font-medium opacity-90">Padres</dt>
                    <dd className="text-3xl font-bold">{estadisticas.total_padres}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Gestión Administrativa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Link
                href="/admin/usuarios/create"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50"
              >
                <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Crear Usuario</span>
              </Link>
              <Link
                href="/admin/usuarios"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50"
              >
                <UsersIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Gestionar Usuarios</span>
              </Link>
              <Link
                href="/cursos"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50"
              >
                <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Ver Cursos</span>
              </Link>
              <Link
                href="/reportes"
                className="flex items-center justify-center px-4 py-3 bg-white rounded-lg hover:bg-gray-50"
              >
                <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium">Reportes</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}
