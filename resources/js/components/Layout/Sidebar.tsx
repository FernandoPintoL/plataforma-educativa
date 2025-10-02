import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  BookOpenIcon, 
  DocumentTextIcon, 
  PencilIcon, 
  ClipboardDocumentListIcon,
  FolderIcon,
  AcademicCapIcon,
  ChartBarIcon,
  MapIcon,
  ChartPieIcon,
  CogIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, hasPermission } = useAuth();
  const { url } = usePage();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      permission: null,
    },
    {
      name: 'Cursos',
      href: '/cursos',
      icon: BookOpenIcon,
      permission: 'cursos.ver',
    },
    {
      name: 'Contenido',
      href: '/contenido',
      icon: DocumentTextIcon,
      permission: 'contenido.ver',
    },
    {
      name: 'Tareas',
      href: '/tareas',
      icon: PencilIcon,
      permission: 'tareas.ver',
    },
    {
      name: 'Evaluaciones',
      href: '/evaluaciones',
      icon: ClipboardDocumentListIcon,
      permission: 'evaluaciones.ver',
    },
    {
      name: 'Trabajos',
      href: '/trabajos',
      icon: FolderIcon,
      permission: 'trabajos.ver',
    },
    {
      name: 'Calificaciones',
      href: '/calificaciones',
      icon: AcademicCapIcon,
      permission: 'calificaciones.ver',
    },
    {
      name: 'Análisis Inteligente',
      href: '/analisis',
      icon: ChartBarIcon,
      permission: 'analisis.ver',
    },
    {
      name: 'Orientación Vocacional',
      href: '/vocacional',
      icon: MapIcon,
      permission: 'vocacional.ver_tests',
    },
    {
      name: 'Reportes',
      href: '/reportes',
      icon: ChartPieIcon,
      permission: 'reportes.ver',
    },
    {
      name: 'Administración',
      href: '/admin',
      icon: CogIcon,
      permission: 'admin.usuarios',
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PE</span>
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">
                  Plataforma Educativa
                </h1>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const isActive = url === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          {user && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name} {user.apellido}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.tipo_usuario}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
