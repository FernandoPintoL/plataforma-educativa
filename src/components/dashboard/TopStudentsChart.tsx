/**
 * TopStudentsChart.tsx
 * =====================
 * Gráfico y tabla de estudiantes con más análisis
 */

import React from 'react';
import { BarChart3 } from 'lucide-react';

interface Student {
  student_id: number;
  analysis_count: number;
}

interface TopStudentsChartProps {
  students: Student[];
}

const TopStudentsChart: React.FC<TopStudentsChartProps> = ({ students }) => {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">No hay datos de estudiantes</p>
      </div>
    );
  }

  const maxCount = Math.max(...students.map((s) => s.analysis_count));

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Estudiantes por Uso</h3>

        <div className="space-y-4">
          {students.map((student, index) => (
            <div key={student.student_id} className="flex items-center gap-4">
              {/* Rank */}
              <div className="text-center w-8">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                  {index + 1}
                </div>
              </div>

              {/* Student ID */}
              <div className="w-20">
                <p className="font-semibold text-gray-900">
                  Estudiante {student.student_id}
                </p>
              </div>

              {/* Bar */}
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                    style={{
                      width: `${(student.analysis_count / maxCount) * 100}%`,
                    }}
                  >
                    {student.analysis_count > 5 && (
                      <span className="text-xs font-bold text-white">
                        {student.analysis_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Count */}
              <div className="text-right w-16">
                <p className="font-bold text-gray-900">{student.analysis_count}</p>
                <p className="text-xs text-gray-600">análisis</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Estudiantes</p>
          <p className="text-3xl font-bold text-gray-900">{students.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Promedio de Análisis</p>
          <p className="text-3xl font-bold text-gray-900">
            {(
              students.reduce((sum, s) => sum + s.analysis_count, 0) / students.length
            ).toFixed(1)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Máximo</p>
          <p className="text-3xl font-bold text-gray-900">{maxCount}</p>
          <p className="text-xs text-gray-600 mt-1">
            Estudiante #{students[0].student_id}
          </p>
        </div>
      </div>

      {/* Activity Level */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Nivel de Actividad</h3>

        <div className="space-y-3">
          {students.map((student) => {
            const activity =
              student.analysis_count > 20 ? '🔥 Muy Activo' :
              student.analysis_count > 10 ? '✅ Activo' :
              student.analysis_count > 5 ? '⚠️ Moderado' :
              '❓ Bajo';

            return (
              <div key={student.student_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Estudiante {student.student_id}</span>
                <span className="text-sm font-medium">{activity}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopStudentsChart;
