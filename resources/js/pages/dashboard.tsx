import React from 'react';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import {
  BookOpenIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user, isProfesor, isEstudiante, isDirector, isPadre } = useAuth();

  const stats = [
    {
      name: 'Cursos',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: BookOpenIcon,
    },
    {
      name: 'Estudiantes',
      value: '156',
      change: '+8',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
    {
      name: 'Tareas Pendientes',
      value: '5',
      change: '-2',
      changeType: 'negative',
      icon: ClockIcon,
    },
    {
      name: 'Calificaciones',
      value: '98%',
      change: '+3%',
      changeType: 'positive',
      icon: CheckCircleIcon,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'tarea',
      title: 'Nueva tarea: Matemáticas Avanzadas',
      time: 'Hace 2 horas',
      user: 'Prof. García',
    },
    {
      id: 2,
      type: 'calificacion',
      title: 'Calificación disponible: Física',
      time: 'Hace 4 horas',
      user: 'Sistema',
    },
    {
      id: 3,
      type: 'curso',
      title: 'Te has inscrito en: Programación Web',
      time: 'Hace 1 día',
      user: 'Sistema',
    },
    {
      id: 4,
      type: 'evaluacion',
      title: 'Nueva evaluación: Química Orgánica',
      time: 'Hace 2 días',
      user: 'Prof. Martínez',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getRoleSpecificContent = () => {
    if (isProfesor()) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Cursos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Matemáticas Avanzadas</p>
                  <p className="text-sm text-gray-500">25 estudiantes</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Activo
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Física General</p>
                  <p className="text-sm text-gray-500">18 estudiantes</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Activo
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tareas por Calificar</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                  <p className="font-medium text-gray-900">Ejercicios de Álgebra</p>
                  <p className="text-sm text-gray-500">15 trabajos pendientes</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Pendiente
                </span>
                    </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Problemas de Física</p>
                  <p className="text-sm text-gray-500">8 trabajos pendientes</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Pendiente
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isEstudiante()) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mis Cursos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Matemáticas Avanzadas</p>
                  <p className="text-sm text-gray-500">Prof. García</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  En progreso
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Física General</p>
                  <p className="text-sm text-gray-500">Prof. Martínez</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  En progreso
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tareas Pendientes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Ejercicios de Álgebra</p>
                  <p className="text-sm text-gray-500">Vence en 2 días</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Urgente
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Problemas de Física</p>
                  <p className="text-sm text-gray-500">Vence en 5 días</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Pendiente
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isDirector()) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas Generales</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Estudiantes</span>
                <span className="font-semibold">1,245</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Profesores</span>
                <span className="font-semibold">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cursos Activos</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Promedio General</span>
                <span className="font-semibold text-green-600">87.5%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Alertas del Sistema</h3>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>3 profesores</strong> tienen tareas pendientes de calificar
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>12 estudiantes</strong> tienen calificaciones bajas
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>5 nuevos estudiantes</strong> se registraron esta semana
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isPadre()) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Hijos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">María García</p>
                  <p className="text-sm text-gray-500">Grado 10 - Promedio: 92%</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Excelente
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Carlos García</p>
                  <p className="text-sm text-gray-500">Grado 8 - Promedio: 85%</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Bueno
                </span>
              </div>
            </div>
                </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  María completó la tarea de Matemáticas
                </p>
                <p className="text-xs text-green-600">Hace 2 horas</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Carlos recibió una nueva calificación
                </p>
                <p className="text-xs text-blue-600">Hace 1 día</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido a la plataforma educativa inteligente. Aquí tienes un resumen de tu actividad.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} desde la semana pasada
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Role-specific content */}
        {getRoleSpecificContent()}

        {/* Recent activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {activity.type.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;