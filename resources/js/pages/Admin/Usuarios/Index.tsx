import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import Layout from '../../../components/Layout/Layout';
import {
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  UserIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
  apellido: string;
  email: string;
  usernick: string;
  tipo_usuario: 'profesor' | 'estudiante' | 'padre';
  activo: boolean;
  created_at: string;
  roles: Array<{ name: string }>;
}

interface Estadisticas {
  total: number;
  profesores: number;
  estudiantes: number;
  padres: number;
  activos: number;
}

interface Props {
  usuarios: {
    data: User[];
    links: any[];
    current_page: number;
    last_page: number;
  };
  estadisticas: Estadisticas;
  filtros: {
    tipo?: string;
    search?: string;
    activo?: boolean;
  };
}

export default function Index({ usuarios, estadisticas, filtros }: Props) {
  const [search, setSearch] = useState(filtros.search || '');
  const [tipoFiltro, setTipoFiltro] = useState(filtros.tipo || 'todos');
  const [activoFiltro, setActivoFiltro] = useState<string>(
    filtros.activo !== undefined ? String(filtros.activo) : 'todos'
  );

  const aplicarFiltros = () => {
    router.get(
      route('admin.usuarios.index'),
      {
        search,
        tipo: tipoFiltro !== 'todos' ? tipoFiltro : undefined,
        activo: activoFiltro !== 'todos' ? activoFiltro === 'true' : undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const limpiarFiltros = () => {
    setSearch('');
    setTipoFiltro('todos');
    setActivoFiltro('todos');
    router.get(route('admin.usuarios.index'));
  };

  const getTipoUsuarioColor = (tipo: string) => {
    const colores = {
      profesor: 'bg-blue-100 text-blue-800',
      estudiante: 'bg-green-100 text-green-800',
      padre: 'bg-purple-100 text-purple-800',
    };
    return colores[tipo as keyof typeof colores] || 'bg-gray-100 text-gray-800';
  };

  const getTipoUsuarioIcon = (tipo: string) => {
    const iconos = {
      profesor: AcademicCapIcon,
      estudiante: UserIcon,
      padre: UsersIcon,
    };
    const Icon = iconos[tipo as keyof typeof iconos] || UserIcon;
    return <Icon className="h-4 w-4 mr-1" />;
  };

  return (
    <Layout>
      <div className="py-12">
      <Head title="Gestión de Usuarios" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Gestión de Usuarios
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Administra profesores, estudiantes y padres del sistema
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href={route('admin.usuarios.create')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nuevo Usuario
              </Link>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                      <dd className="text-lg font-semibold text-gray-900">{estadisticas.total}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AcademicCapIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Profesores</dt>
                      <dd className="text-lg font-semibold text-gray-900">{estadisticas.profesores}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Estudiantes</dt>
                      <dd className="text-lg font-semibold text-gray-900">{estadisticas.estudiantes}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Padres</dt>
                      <dd className="text-lg font-semibold text-gray-900">{estadisticas.padres}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Activos</dt>
                      <dd className="text-lg font-semibold text-gray-900">{estadisticas.activos}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && aplicarFiltros()}
                    placeholder="Nombre, email, usuario..."
                    className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuario
                </label>
                <select
                  id="tipo"
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="profesor">Profesor</option>
                  <option value="estudiante">Estudiante</option>
                  <option value="padre">Padre/Tutor</option>
                </select>
              </div>

              <div>
                <label htmlFor="activo" className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  id="activo"
                  value={activoFiltro}
                  onChange={(e) => setActivoFiltro(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="true">Activos</option>
                  <option value="false">Inactivos</option>
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={aplicarFiltros}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FunnelIcon className="h-4 w-4 mr-1" />
                  Filtrar
                </button>
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.data.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {usuario.name.charAt(0)}
                              {usuario.apellido.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {usuario.name} {usuario.apellido}
                          </div>
                          <div className="text-sm text-gray-500">@{usuario.usernick}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTipoUsuarioColor(
                          usuario.tipo_usuario
                        )}`}
                      >
                        {getTipoUsuarioIcon(usuario.tipo_usuario)}
                        {usuario.tipo_usuario.charAt(0).toUpperCase() + usuario.tipo_usuario.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {usuario.activo ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(usuario.created_at).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={route('admin.usuarios.show', usuario.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Ver
                      </Link>
                      <Link
                        href={route('admin.usuarios.edit', usuario.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}

                {usuarios.data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium">No se encontraron usuarios</p>
                      <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            {usuarios.data.length > 0 && usuarios.last_page > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  {usuarios.links[0].url && (
                    <Link
                      href={usuarios.links[0].url}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Anterior
                    </Link>
                  )}
                  {usuarios.links[usuarios.links.length - 1].url && (
                    <Link
                      href={usuarios.links[usuarios.links.length - 1].url}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Siguiente
                    </Link>
                  )}
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando página <span className="font-medium">{usuarios.current_page}</span> de{' '}
                      <span className="font-medium">{usuarios.last_page}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {usuarios.links.map((link, index) => (
                        <Link
                          key={index}
                          href={link.url || '#'}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            link.active
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                          dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}
