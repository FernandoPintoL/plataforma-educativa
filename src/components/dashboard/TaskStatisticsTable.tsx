/**
 * TaskStatisticsTable.tsx
 * ========================
 * Tabla de estadísticas por tarea
 */

import React from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';

interface Task {
  task_id: number;
  total_analyses: number;
  unique_students: number;
}

interface TaskStatisticsTableProps {
  tasks: Task[];
}

const TaskStatisticsTable: React.FC<TaskStatisticsTableProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">No hay datos de tareas</p>
      </div>
    );
  }

  const totalAnalyses = tasks.reduce((sum, t) => sum + t.total_analyses, 0);
  const totalStudents = new Set(tasks.map((t) => t.unique_students)).size;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total de Tareas</p>
          <p className="text-3xl font-bold text-gray-900">{tasks.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Análisis</p>
          <p className="text-3xl font-bold text-gray-900">{totalAnalyses}</p>
          <p className="text-xs text-gray-600 mt-1">
            {(totalAnalyses / tasks.length).toFixed(1)} por tarea
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Popularidad Promedio</p>
          <p className="text-3xl font-bold text-gray-900">
            {tasks.length > 0
              ? (
                  tasks.reduce((sum, t) => sum + t.unique_students, 0) / tasks.length
                ).toFixed(1)
              : '0'}
          </p>
          <p className="text-xs text-gray-600 mt-1">estudiantes por tarea</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tarea
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Análisis
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Estudiantes
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Promedio
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Trending
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map((task, index) => {
                const avgAnalyses = task.unique_students > 0
                  ? (task.total_analyses / task.unique_students).toFixed(1)
                  : '0';

                const isPopular = task.total_analyses > totalAnalyses / tasks.length * 1.2;
                const isBelowAverage = task.total_analyses < totalAnalyses / tasks.length * 0.8;

                return (
                  <tr
                    key={task.task_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-600 font-bold text-sm mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Tarea {task.task_id}
                          </p>
                          <p className="text-xs text-gray-600">ID: {task.task_id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-6 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{
                              width: `${(task.total_analyses / Math.max(...tasks.map(t => t.total_analyses))) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {task.total_analyses}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {task.unique_students}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-gray-900">
                        {avgAnalyses}
                      </span>
                      <p className="text-xs text-gray-600">por estudiante</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isPopular && (
                          <div className="flex items-center text-green-600 font-medium">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm">Trending</span>
                          </div>
                        )}
                        {isBelowAverage && (
                          <span className="text-yellow-600 text-sm font-medium">
                            ⚠️ Bajo uso
                          </span>
                        )}
                        {!isPopular && !isBelowAverage && (
                          <span className="text-gray-600 text-sm">Normal</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">📊 Insights</h3>
        <ul className="space-y-2 text-sm text-blue-900">
          {tasks.length > 0 && (
            <>
              <li>
                • La tarea más popular es <strong>Tarea {tasks[0].task_id}</strong> con{' '}
                <strong>{tasks[0].total_analyses}</strong> análisis
              </li>
              <li>
                • El promedio de análisis por tarea es{' '}
                <strong>{(totalAnalyses / tasks.length).toFixed(1)}</strong>
              </li>
              <li>
                • Los estudiantes realizan en promedio{' '}
                <strong>{avgAnalyses}</strong> análisis por tarea
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TaskStatisticsTable;
