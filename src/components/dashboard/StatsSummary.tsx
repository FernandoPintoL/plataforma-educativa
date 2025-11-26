/**
 * StatsSummary.tsx
 * =================
 * Resumen de estadísticas del curso
 */

import React from 'react';
import { BarChart3, Users, TrendingUp } from 'lucide-react';

interface StatsSummaryProps {
  data: {
    total_analyses: number;
    total_students: number;
    successful_rate: number;
  };
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {trend && <p className="text-green-600 text-sm mt-1">{trend}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        {icon}
      </div>
    </div>
  </div>
);

const StatsSummary: React.FC<StatsSummaryProps> = ({ data }) => {
  const successColor = data.successful_rate >= 80 ? 'text-green-600' : 'text-yellow-600';

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Análisis Totales"
          value={data.total_analyses}
          icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
          color="border-blue-500"
          trend={`${Math.round(data.total_analyses / Math.max(data.total_students, 1))} por estudiante`}
        />

        <StatCard
          title="Estudiantes Activos"
          value={data.total_students}
          icon={<Users className="w-6 h-6 text-purple-600" />}
          color="border-purple-500"
          trend={`${((data.total_analyses / Math.max(data.total_students, 1))).toFixed(1)} análisis promedio`}
        />

        <StatCard
          title="Tasa de Éxito"
          value={`${data.successful_rate.toFixed(1)}%`}
          icon={<TrendingUp className={`w-6 h-6 ${successColor}`} />}
          color={`border-${data.successful_rate >= 80 ? 'green' : 'yellow'}-500`}
          trend={data.successful_rate >= 80 ? '✅ Excelente' : '⚠️ Revisar'}
        />
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Análisis por Estudiante</span>
            <span className="font-bold text-gray-900">
              {(data.total_analyses / Math.max(data.total_students, 1)).toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Análisis Exitosos</span>
            <span className="font-bold text-gray-900">
              {Math.round(data.total_analyses * (data.successful_rate / 100))}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Análisis Fallidos</span>
            <span className="font-bold text-gray-900">
              {Math.round(data.total_analyses * ((100 - data.successful_rate) / 100))}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Tasa de Participación</span>
            <span className="font-bold text-gray-900">
              {data.total_students > 0 ? '100%' : '0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 text-sm">
          <strong>ℹ️ Información:</strong> Estos datos se actualizan en tiempo real conforme los estudiantes crean análisis.
        </p>
      </div>
    </div>
  );
};

export default StatsSummary;
