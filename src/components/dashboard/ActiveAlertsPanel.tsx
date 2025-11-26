/**
 * ActiveAlertsPanel.tsx
 * ======================
 * Panel de alertas activas con filtros y acciones
 */

import React, { useState, useMemo } from 'react';
import { AlertCircle, Filter, X } from 'lucide-react';

interface Alert {
  id: number;
  student_id: number;
  pattern_type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  created_at: string;
  resolved: boolean;
}

interface ActiveAlertsPanelProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
}

type SeverityFilter = 'all' | 'low' | 'medium' | 'high';

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const colors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[severity as keyof typeof colors]}`}>
      {severity.toUpperCase()}
    </span>
  );
};

const PatternBadge: React.FC<{ pattern: string }> = ({ pattern }) => {
  const labels = {
    spam_24h: '🔴 Spam 24h',
    overuse_single_task: '🟡 Sobre-uso',
    unusual_timing: '🔵 Hora Inusual',
  };

  return (
    <span className="text-sm font-medium text-gray-700">
      {labels[pattern as keyof typeof labels] || pattern}
    </span>
  );
};

const ActiveAlertsPanel: React.FC<ActiveAlertsPanelProps> = ({ alerts, onAlertClick }) => {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const severityMatch = severityFilter === 'all' || alert.severity === severityFilter;
      const searchMatch =
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.student_id.toString().includes(searchTerm);
      return severityMatch && searchMatch && !alert.resolved;
    });
  }, [alerts, severityFilter, searchTerm]);

  const activeCount = filteredAlerts.length;
  const criticalCount = alerts.filter((a) => a.severity === 'high' && !a.resolved).length;

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="text-red-900 font-semibold">
                {criticalCount} alerta{criticalCount > 1 ? 's' : ''} crítica{criticalCount > 1 ? 's' : ''}
              </p>
              <p className="text-red-700 text-sm">Requieren atención inmediata</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Buscar por ID estudiante o mensaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Severity Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            {(['all', 'low', 'medium', 'high'] as const).map((severity) => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  severityFilter === severity
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {severity === 'all' ? 'Todas' : severity.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-3">
          Mostrando <strong>{activeCount}</strong> alerta{activeCount !== 1 ? 's' : ''} activa{activeCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-1">No hay alertas</p>
          <p className="text-gray-500 text-sm">
            {severityFilter !== 'all'
              ? `No hay alertas con severidad ${severityFilter}`
              : 'Felicidades, no hay comportamiento sospechoso'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-gray-300 hover:border-blue-500 cursor-pointer"
              onClick={() => onAlertClick(alert)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <SeverityBadge severity={alert.severity} />
                      <PatternBadge pattern={alert.pattern_type} />
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">{alert.message}</p>
                    <p className="text-sm text-gray-600">
                      Estudiante #{alert.student_id} · {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAlertClick(alert);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    ID: {alert.id}
                  </span>
                  <span className="text-xs text-gray-500">
                    {alert.pattern_type === 'spam_24h'
                      ? '50+ análisis en 24 horas'
                      : alert.pattern_type === 'overuse_single_task'
                      ? '10+ análisis en una tarea'
                      : 'Análisis a hora inusual'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Stats */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Estadísticas de Alertas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {alerts.filter((a) => !a.resolved).length}
              </p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-gray-600 text-sm">Crítica</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-gray-600 text-sm">Media</p>
              <p className="text-2xl font-bold text-yellow-600">
                {alerts.filter((a) => a.severity === 'medium' && !a.resolved).length}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-gray-600 text-sm">Baja</p>
              <p className="text-2xl font-bold text-blue-600">
                {alerts.filter((a) => a.severity === 'low' && !a.resolved).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveAlertsPanel;
