import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useAuth } from '../../contexts/AuthContext';
import { MenuItem } from '../../types';
import {
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PencilIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ChartPieIcon,
  CogIcon,
  XMarkIcon,
  UsersIcon,
  UserIcon,
  CalendarIcon,
  DocumentIcon,
  BellIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  PlusCircleIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ShoppingCartIcon,
  TagIcon,
  CubeIcon,
  TruckIcon,
  MapPinIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  CreditCardIcon,
  WalletIcon,
  KeyIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Función para obtener el componente de icono correspondiente
function getIcon(iconName?: string): React.ComponentType<{ className?: string }> {
  if (!iconName) return HomeIcon;

  switch (iconName) {
    case 'Home': return HomeIcon;
    case 'Users': return UsersIcon;
    case 'User': return UserIcon;
    case 'UserCheck': return CheckCircleIcon;
    case 'UserPlus': return PlusCircleIcon;
    case 'BookOpen': return BookOpenIcon;
    case 'GraduationCap': return AcademicCapIcon;
    case 'Shield': return ShieldCheckIcon;
    case 'Calendar': return CalendarIcon;
    case 'CheckSquare': return ClipboardIcon;
    case 'FileText': return DocumentIcon;
    case 'ListChecks': return ClipboardDocumentListIcon;
    case 'Settings': return CogIcon;
    case 'Bell': return BellIcon;
    case 'Activity': return ChartBarIcon;
    case 'BarChart2': return ChartBarIcon;
    case 'BarChart3': return ChartBarIcon;
    case 'BarChart4': return ChartBarIcon;
    case 'Folder': return FolderIcon;
    case 'FolderTree': return FolderIcon;
    case 'MessageSquare': return DocumentTextIcon;
    case 'Clock': return ClockIcon;
    case 'HelpCircle': return QuestionMarkCircleIcon;
    case 'Award': return AcademicCapIcon;
    case 'PlusCircle': return PlusCircleIcon;
    case 'Plus': return PlusIcon;
    case 'Archive': return ArchiveBoxIcon;
    case 'Clipboard': return ClipboardDocumentListIcon;
    case 'Layout': return DocumentTextIcon;
    case 'DollarSign': return CurrencyDollarIcon;
    case 'List': return ClipboardDocumentListIcon;
    case 'Document': return DocumentTextIcon;
    case 'Pencil': return PencilIcon;
    case 'Chart': return ChartPieIcon;
    case 'ShoppingCart': return ShoppingCartIcon;
    case 'Tags': return TagIcon;
    case 'Package': return CubeIcon;
    case 'Package2': return CubeIcon;
    case 'Boxes': return CubeIcon;
    case 'Truck': return TruckIcon;
    case 'MapPin': return MapPinIcon;
    case 'ArrowRightLeft': return ArrowsRightLeftIcon;
    case 'ArrowUpDown': return ArrowsUpDownIcon;
    case 'AlertTriangle': return ExclamationTriangleIcon;
    case 'Building2': return BuildingOffice2Icon;
    case 'CreditCard': return CreditCardIcon;
    case 'Wallet': return WalletIcon;
    case 'Key': return KeyIcon;
    case 'RotateCcw': return ArrowPathIcon;
    case 'Ruler': return DocumentIcon;
    case 'TrendingDown': return ChartBarIcon;
    case 'TrendingUp': return ChartBarIcon;
    default: return HomeIcon;
  }
}

// Componente para renderizar un elemento del menú
const MenuItemComponent = ({ item, currentUrl }: { item: MenuItem; currentUrl: string }) => {
  // Obtener el componente de icono correspondiente
  const IconComponent = getIcon(item.icon);

  // Verificar si la ruta actual coincide con este ítem
  const isActive = currentUrl === item.href;

  // Si el ítem tiene hijos/submenús
  if (item.children && item.children.length > 0) {
    return (
      <div className="mb-2">
        <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-600">
          <IconComponent className="mr-3 h-5 w-5 text-gray-400" />
          <span>{item.title}</span>
        </div>
        <div className="ml-4 pl-3 border-l border-gray-200">
          {item.children.map((child, index) => (
            <MenuItemComponent key={`${child.title}-${index}`} item={child} currentUrl={currentUrl} />
          ))}
        </div>
      </div>
    );
  }

  // Si es un ítem sin hijos
  return (
    <Link
      href={item.href}
      className={`
        group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
        ${isActive
          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      <IconComponent
        className={`
          mr-3 h-5 w-5 flex-shrink-0
          ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}
        `}
      />
      {item.title}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { url, props } = usePage();

  // Obtener los módulos del sidebar desde la página actual
  const modulosSidebar = React.useMemo(() => {
    return (props.modulosSidebar as MenuItem[]) || [];
  }, [props.modulosSidebar]);

  // Verificar que los módulos estén disponibles
  React.useEffect(() => {
    // Este efecto se usa para reaccionar a cambios en los módulos
    // pero no es necesario loguear en desarrollo después de completar la depuración
  }, [modulosSidebar, props, user]);

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
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
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
            {modulosSidebar && modulosSidebar.length > 0 ? (
              // Usar los datos dinámicos del servidor
              modulosSidebar.map((item, index) => (
                <MenuItemComponent key={`${item.title}-${index}`} item={item} currentUrl={url} />
              ))
            ) : (
              // Si no hay datos, mostrar un mensaje
              <div className="text-gray-500 text-sm px-3 py-2">
                No hay elementos de menú disponibles
              </div>
            )}
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
