import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/dashboard/metric-card';
import { StudentRiskList } from '@/components/AnalisisRiesgo/StudentRiskList';
import {
  Plus,
  AlertTriangle,
  TrendingUp,
  Users,
  RefreshCw,
  Filter,
  Download,
} from 'lucide-react';
import analisisRiesgoService from '@/services/analisis-riesgo.service';
import type {
  Dashboard,
  PrediccionRiesgo,
  DashboardMetricas,
  FiltrosDashboard,
} from '@/types/analisis-riesgo';

interface IndexProps {
  initialCursos?: Array<{ id: number; nombre: string }>;
}

export default function Index({ initialCursos = [] }: IndexProps) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [predicciones, setPredicciones] = useState<PrediccionRiesgo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCurso, setSelectedCurso] = useState<number | undefined>();
  const [dias, setDias] = useState(30);

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Análisis de Riesgo' },
  ];

  // Cargar datos
  useEffect(() => {
    loadData();
  }, [selectedCurso, dias]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      const filters: FiltrosDashboard = { dias };
      if (selectedCurso) filters.curso_id = selectedCurso;

      // Cargar dashboard
      const dashboardData = await analisisRiesgoService.dashboard(filters);
      setDashboard(dashboardData);

      // Cargar predicciones
      const { data: prediccionesData } = await analisisRiesgoService.listarPredicciones({
        per_page: 50,
        ...filters,
      });
      setPredicciones(prediccionesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!dashboard) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Análisis de Riesgo" />
        <div className="flex items-center justify-center h-screen">
          <p>Cargando...</p>
        </div>
      </AppLayout>
    );
  }

  const { metricas, distribucion, estudiantes_criticos } = dashboard;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Análisis de Riesgo Académico" />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Análisis de Riesgo Académico
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Monitoreo y predicción de desempeño estudiantil
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              {initialCursos.length > 0 && (
                <div>
                  <label className="text-sm font-medium">Curso:</label>
                  <select
                    value={selectedCurso || ''}
                    onChange={(e) =>
                      setSelectedCurso(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                    className="mt-1 px-3 py-2 border rounded-md"
                  >
                    <option value="">Todos los cursos</option>
                    {initialCursos.map((curso) => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Período:</label>
                <select
                  value={dias}
                  onChange={(e) => setDias(parseInt(e.target.value))}
                  className="mt-1 px-3 py-2 border rounded-md"
                >
                  <option value={7}>Últimos 7 días</option>
                  <option value={30}>Últimos 30 días</option>
                  <option value={90}>Últimos 90 días</option>
                  <option value={180}>Últimos 180 días</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total Estudiantes"
            value={metricas.total_estudiantes}
            icon={Users}
            trend={0}
          />

          <MetricCard
            title="Riesgo Alto"
            value={metricas.riesgo_alto}
            icon={AlertTriangle}
            variant="destructive"
            trend={metricas.porcentaje_alto_riesgo}
          />

          <MetricCard
            title="Riesgo Medio"
            value={metricas.riesgo_medio}
            icon={TrendingUp}
            variant="warning"
          />

          <MetricCard
            title="Riesgo Bajo"
            value={metricas.riesgo_bajo}
            icon={TrendingUp}
            variant="success"
          />

          <MetricCard
            title="Score Promedio"
            value={`${(metricas.score_promedio * 100).toFixed(1)}%`}
            description="De riesgo"
          />
        </div>

        {/* Distribución de riesgo */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Riesgo</CardTitle>
            <CardDescription>Desglose de estudiantes por nivel de riesgo</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Riesgo Alto */}
              <div className="text-center p-4 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-900">
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Riesgo Alto
                </Badge>
                <p className="text-4xl font-bold text-red-600 mt-3">{distribucion.alto}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {metricas.total_estudiantes > 0
                    ? (
                        ((distribucion.alto / metricas.total_estudiantes) * 100).toFixed(1)
                      ) + '%'
                    : '0%'}
                </p>
              </div>

              {/* Riesgo Medio */}
              <div className="text-center p-4 border rounded-lg border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-900">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Riesgo Medio
                </Badge>
                <p className="text-4xl font-bold text-yellow-600 mt-3">{distribucion.medio}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {metricas.total_estudiantes > 0
                    ? (
                        ((distribucion.medio / metricas.total_estudiantes) * 100).toFixed(1)
                      ) + '%'
                    : '0%'}
                </p>
              </div>

              {/* Riesgo Bajo */}
              <div className="text-center p-4 border rounded-lg border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-900">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Riesgo Bajo
                </Badge>
                <p className="text-4xl font-bold text-green-600 mt-3">{distribucion.bajo}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {metricas.total_estudiantes > 0
                    ? (
                        ((distribucion.bajo / metricas.total_estudiantes) * 100).toFixed(1)
                      ) + '%'
                    : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estudiantes críticos */}
        {estudiantes_criticos.length > 0 && (
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-200">
                <AlertTriangle className="w-5 h-5" />
                Estudiantes en Riesgo Crítico
              </CardTitle>
              <CardDescription className="text-red-700 dark:text-red-400">
                Top {estudiantes_criticos.length} estudiantes que requieren atención inmediata
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {estudiantes_criticos.map((est, idx) => (
                  <Link
                    key={est.id}
                    href={`/analisis-riesgo/estudiante/${est.estudiante_id}`}
                  >
                    <div className="flex items-center justify-between p-3 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          #{idx + 1} - {est.estudiante_nombre}
                        </p>
                      </div>
                      <Badge className="bg-red-600 text-white">
                        {Math.round(est.score_riesgo * 100)}%
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de predicciones */}
        <StudentRiskList
          predicciones={predicciones}
          onViewDetail={(estudianteId) => {
            window.location.href = `/analisis-riesgo/estudiante/${estudianteId}`;
          }}
          isLoading={isLoading}
          emptyMessage="No hay predicciones disponibles. Ejecute el modelo de ML para generar análisis."
        />

        {/* Link a páginas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/analisis-riesgo/cursos">
            <Button variant="outline" className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Análisis por Cursos
            </Button>
          </Link>

          <Link href="/analisis-riesgo/tendencias">
            <Button variant="outline" className="w-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Tendencias Históricas
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
