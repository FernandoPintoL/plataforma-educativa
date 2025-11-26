/**
 * ProfessorDashboard.tsx
 * ========================
 * Dashboard principal para profesores
 *
 * Incluye:
 * - Resumen de estadísticas
 * - Alertas de abuso activas
 * - Estudiantes problemáticos
 * - Estadísticas por tarea
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, TrendingUp, Users, BookOpen } from 'lucide-react';
import StatsSummary from './dashboard/StatsSummary';
import ActiveAlertsPanel from './dashboard/ActiveAlertsPanel';
import TopStudentsChart from './dashboard/TopStudentsChart';
import TaskStatisticsTable from './dashboard/TaskStatisticsTable';
import AlertActionModal from './dashboard/AlertActionModal';

interface DashboardData {
  summary: {
    total_analyses: number;
    total_students: number;
    successful_rate: number;
  };
  active_alerts: Array<{
    id: number;
    student_id: number;
    pattern_type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    created_at: string;
    resolved: boolean;
  }>;
  top_students: Array<{
    student_id: number;
    analysis_count: number;
  }>;
  task_statistics: Array<{
    task_id: number;
    total_analyses: number;
    unique_students: number;
  }>;
}

interface ProfessorDashboardProps {
  courseId: number;
}

type TabType = 'summary' | 'alerts' | 'students' | 'tasks';

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ courseId }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [selectedAlert, setSelectedAlert] = useState<DashboardData['active_alerts'][0] | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/audit/professor/dashboard/${courseId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError('No se pudieron cargar los datos del dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Load data on mount
  useEffect(() => {
    fetchDashboardData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  // Handle alert selection
  const handleAlertClick = (alert: DashboardData['active_alerts'][0]) => {
    setSelectedAlert(alert);
    setShowActionModal(true);
  };

  // Handle alert action complete
  const handleAlertActionComplete = () => {
    setShowActionModal(false);
    setSelectedAlert(null);
    // Refresh data after action
    handleRefresh();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No hay datos disponibles</p>
      </div>
    );
  }

  // Tab definitions
  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: number }> = [
    { id: 'summary', label: 'Resumen', icon: <TrendingUp className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: 'Alertas',
      icon: <AlertCircle className="w-4 h-4" />,
      badge: dashboardData.active_alerts.filter(a => !a.resolved).length,
    },
    { id: 'students', label: 'Estudiantes', icon: <Users className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tareas', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard del Profesor
            </h1>
            <p className="text-gray-600 mt-1">Curso #{courseId}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {refreshing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            Actualizar
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-2 px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'summary' && (
            <StatsSummary data={dashboardData.summary} />
          )}

          {activeTab === 'alerts' && (
            <ActiveAlertsPanel
              alerts={dashboardData.active_alerts}
              onAlertClick={handleAlertClick}
            />
          )}

          {activeTab === 'students' && (
            <TopStudentsChart students={dashboardData.top_students} />
          )}

          {activeTab === 'tasks' && (
            <TaskStatisticsTable tasks={dashboardData.task_statistics} />
          )}
        </div>

        {/* Alert Action Modal */}
        {showActionModal && selectedAlert && (
          <AlertActionModal
            alert={selectedAlert}
            courseId={courseId}
            onClose={() => setShowActionModal(false)}
            onActionComplete={handleAlertActionComplete}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Última actualización: {new Date().toLocaleString()}</p>
          <p>Los datos se actualizan automáticamente cada 30 segundos</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
