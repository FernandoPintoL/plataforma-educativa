import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '../../contexts/AuthContext';
import { Curso } from '../../types';
import { type BreadcrumbItem } from '@/types';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  CalendarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Cursos',
    href: '/cursos',
  },
];

const CursosIndex: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Datos de ejemplo - en una aplicación real vendrían de la API
  const cursos: Curso[] = [
    {
      id: 1,
      nombre: 'Matemáticas Avanzadas',
      descripcion: 'Curso de matemáticas para estudiantes de nivel avanzado',
      codigo: 'MAT-101',
      estado: 'activo',
      fecha_inicio: '2024-01-15',
      fecha_fin: '2024-06-15',
      capacidad_maxima: 30,
      profesor: {
        id: 1,
        name: 'Prof. García',
        apellido: 'López',
        email: 'garcia@example.com',
        tipo_usuario: 'profesor',
        roles: ['profesor'],
        permissions: [],
        is_profesor: true,
        is_estudiante: false,
        is_director: false,
        is_padre: false,
        is_admin: false,
      },
      estudiantes: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      nombre: 'Física General',
      descripcion: 'Fundamentos de física para estudiantes de ciencias',
      codigo: 'FIS-201',
      estado: 'activo',
      fecha_inicio: '2024-01-20',
      fecha_fin: '2024-06-20',
      capacidad_maxima: 25,
      profesor: {
        id: 2,
        name: 'Prof. Martínez',
        apellido: 'Ruiz',
        email: 'martinez@example.com',
        tipo_usuario: 'profesor',
        roles: ['profesor'],
        permissions: [],
        is_profesor: true,
        is_estudiante: false,
        is_director: false,
        is_padre: false,
        is_admin: false,
      },
      estudiantes: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curso.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || curso.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800';
      case 'finalizado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'inactivo':
        return 'Inactivo';
      case 'finalizado':
        return 'Finalizado';
      default:
        return estado;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cursos</h1>
            <p className="text-gray-600">Gestiona tus cursos y contenido educativo</p>
          </div>
          {hasPermission('cursos.crear') && (
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Curso
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCursos.map((curso) => (
            <div key={curso.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {curso.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {curso.descripcion}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="font-medium">Código:</span>
                      <span className="ml-1">{curso.codigo}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>Prof. {curso.profesor.name} {curso.profesor.apellido}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {curso.fecha_inicio && new Date(curso.fecha_inicio).toLocaleDateString()} - 
                        {curso.fecha_fin && new Date(curso.fecha_fin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(curso.estado)}`}>
                    {getStatusText(curso.estado)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {curso.capacidad_maxima && (
                      <span>Capacidad: {curso.capacidad_maxima} estudiantes</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {hasPermission('cursos.ver') && (
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    )}
                    {hasPermission('cursos.editar') && (
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                    {hasPermission('cursos.eliminar') && (
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredCursos.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <BookOpenIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No se encontraron cursos que coincidan con tu búsqueda.' : 'Comienza creando tu primer curso.'}
            </p>
            {hasPermission('cursos.crear') && (
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Nuevo Curso
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CursosIndex;
