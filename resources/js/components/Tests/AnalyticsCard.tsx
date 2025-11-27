import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Estadisticas {
  total_respuestas: number;
  total_estudiantes: number;
  completadas: number;
  pendientes: number;
  tasa_completacion: number;
  tiempo_promedio_minutos: number;
  carrera_mas_predicha: string | null;
  carrera_predicciones: Record<string, number>;
  cluster_distribution: {
    bajo_desempen: number;
    medio_desempen: number;
    alto_desempen: number;
  };
  confidence_stats: {
    promedio: number;
    minimo: number;
    maximo: number;
  };
  por_categoria: Array<{
    categoria_id: number;
    categoria_nombre: string;
    num_preguntas: number;
    num_respuestas: number;
  }>;
}

interface AnalyticsCardProps {
  testId: number;
}

const CLUSTER_COLORS = {
  bajo_desempen: '#EF4444',
  medio_desempen: '#F59E0B',
  alto_desempen: '#10B981',
};

export default function AnalyticsCard({ testId }: AnalyticsCardProps) {
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEstadisticas();
  }, [testId]);

  const loadEstadisticas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/tests-vocacionales/${testId}/respuestas/estadisticas`
      );
      setStats(response.data.estadisticas);
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error || 'No hay datos para mostrar'}
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const clusterData = [
    { name: 'Bajo Desempeño', value: stats.cluster_distribution.bajo_desempen, color: CLUSTER_COLORS.bajo_desempen },
    { name: 'Desempeño Medio', value: stats.cluster_distribution.medio_desempen, color: CLUSTER_COLORS.medio_desempen },
    { name: 'Alto Desempeño', value: stats.cluster_distribution.alto_desempen, color: CLUSTER_COLORS.alto_desempen },
  ].filter(d => d.value > 0);

  const carrerasData = Object.entries(stats.carrera_predicciones)
    .map(([carrera, count]) => ({ name: carrera, respuestas: count as number }))
    .sort((a, b) => b.respuestas - a.respuestas)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total de Respuestas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.total_respuestas}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {stats.total_estudiantes} estudiante(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Tasa de Completación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.tasa_completacion.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {stats.completadas} completadas, {stats.pendientes} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Tiempo Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.tiempo_promedio_minutos.toFixed(0)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              minutos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Carrera Más Predicha
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.carrera_mas_predicha ? (
              <>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {stats.carrera_mas_predicha}
                </Badge>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {stats.carrera_predicciones[stats.carrera_mas_predicha] || 0} predicciones
                </p>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">-</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confidence Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estadísticas de Confianza</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Confianza Promedio</p>
              <p className="text-2xl font-bold mt-2">
                {stats.confidence_stats.promedio.toFixed(1)}%
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Confianza Mínima</p>
              <p className="text-2xl font-bold mt-2">
                {stats.confidence_stats.minimo.toFixed(1)}%
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Confianza Máxima</p>
              <p className="text-2xl font-bold mt-2">
                {stats.confidence_stats.maximo.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cluster Distribution */}
        {clusterData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribución por Cluster</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clusterData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {clusterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Top Careers */}
        {carrerasData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top 5 Carreras Predichas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={carrerasData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="respuestas" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* By Category */}
      {stats.por_categoria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Respuestas por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.por_categoria.map((cat) => (
                <div key={cat.categoria_id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {cat.categoria_nombre}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {cat.num_preguntas} preguntas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {cat.num_respuestas}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        respuestas
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
