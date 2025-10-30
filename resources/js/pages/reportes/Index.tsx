import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import {
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface Props {
  modulosSidebar: any[];
}

export default function ReportesIndex({ modulosSidebar }: Props) {
  const reportes = [
    {
      id: 'desempeno',
      titulo: 'Desempeño por Estudiante',
      descripcion: 'Análisis detallado del desempeño académico de cada estudiante',
      icono: UserGroupIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      ruta: route('reportes.desempeno'),
      estadisticas: ['Promedio', 'Tasa de entrega', 'Tendencia'],
    },
    {
      id: 'cursos',
      titulo: 'Progreso por Curso',
      descripcion: 'Estadísticas de rendimiento y avance de cada curso',
      icono: ChartBarIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      ruta: route('reportes.cursos'),
      estadisticas: ['Promedio', 'Estudiantes', 'Entrega'],
    },
    {
      id: 'analisis',
      titulo: 'Análisis Comparativo',
      descripcion: 'Rankings y comparativas de desempeño entre estudiantes',
      icono: ArrowTrendingUpIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      ruta: route('reportes.analisis'),
      estadisticas: ['Top 10', 'Bottom 10', 'Distribución'],
    },
    {
      id: 'metricas',
      titulo: 'Métricas Institucionales',
      descripcion: 'Estadísticas generales y métricas de la institución',
      icono: SparklesIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      ruta: route('reportes.metricas'),
      estadisticas: ['Total usuarios', 'Actividad', 'Crecimiento'],
    },
  ];

  return (
    <AppLayout>
      <Head title="Reportes - Administración" />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 min-h-full">
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sistema de Reportes
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Accede a análisis completos del desempeño académico institucional
              </p>
            </div>

            {/* Tarjetas de Reportes */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
              {reportes.map((reporte) => {
                const IconComponent = reporte.icono;
                return (
                  <button
                    key={reporte.id}
                    onClick={() => router.visit(reporte.ruta)}
                    className="group relative text-left overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    {/* Fondo con gradiente */}
                    <div
                      className={`absolute inset-0 ${reporte.bgColor} opacity-30 group-hover:opacity-50 transition-opacity`}
                    />

                    {/* Contenido */}
                    <div className="relative bg-white p-8 h-full flex flex-col">
                      {/* Icono */}
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${reporte.color} mb-6 w-fit`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>

                      {/* Título y descripción */}
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">{reporte.titulo}</h2>
                      <p className="text-gray-600 mb-6 flex-grow">{reporte.descripcion}</p>

                      {/* Estadísticas incluidas */}
                      <div className="mb-6 flex flex-wrap gap-2">
                        {reporte.estadisticas.map((stat, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"
                          >
                            {stat}
                          </span>
                        ))}
                      </div>

                      {/* Botón de acceso */}
                      <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                        Acceder
                        <ArrowRightIcon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Decoración */}
                    <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${reporte.color} opacity-10 rounded-full -mr-16 -mb-16 group-hover:opacity-20 transition-opacity`} />
                  </button>
                );
              })}
            </div>

            {/* Información adicional */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Reportes Dinámicos</h3>
                <p className="text-gray-600 text-sm">
                  Los reportes se generan en tiempo real con los datos más actualizados de la plataforma
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📈 Análisis Detallados</h3>
                <p className="text-gray-600 text-sm">
                  Obtén insights profundos sobre desempeño, tendencias y patrones académicos
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Exportación</h3>
                <p className="text-gray-600 text-sm">
                  Descarga reportes en Excel/PDF para presentaciones y análisis externos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
