/**
 * IntegratedMLAnalysis Component
 *
 * Componente integrador que muestra:
 * - Predicciones supervisadas
 * - Clustering no supervisado
 * - Síntesis inteligente del agente
 * - Estrategia de intervención personalizada
 *
 * Reutilizable en múltiples páginas (estudiante, dashboard, etc.)
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { MLPredictionsPanel } from './MLPredictionsPanel';
import { MLClusteringPanel } from './MLClusteringPanel';
import { MLAgentInsights } from './MLAgentInsights';
import { AlertCircle } from 'lucide-react';

interface IntegratedMLAnalysisProps {
  studentId: number;
  studentName?: string;
  data?: {
    ml_data?: {
      predictions?: Record<string, any>;
      discoveries?: any;
    };
    synthesis?: any;
    intervention_strategy?: any;
  };
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export const IntegratedMLAnalysis: React.FC<IntegratedMLAnalysisProps> = ({
  studentId,
  studentName,
  data,
  loading = false,
  error = null,
  onRetry,
}) => {
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Error al cargar análisis ML</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-300 bg-white">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error.message || 'No se pudo cargar el análisis integrado'}
            </AlertDescription>
          </Alert>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Reintentar
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis Integrado ML</CardTitle>
          <CardDescription>Cargando datos de análisis...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Spinner className="mr-2" />
            <span className="text-sm text-gray-600">Procesando análisis integrado...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis Integrado ML</CardTitle>
          <CardDescription>No hay datos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No se encontraron datos de análisis para este estudiante
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Análisis Integrado ML</CardTitle>
            <CardDescription>
              {studentName && `Estudiante: ${studentName}`}
              {studentName && ` (ID: ${studentId})`}
              {!studentName && `ID Estudiante: ${studentId}`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="clustering">Clustering</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Predicciones Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Predicciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.ml_data?.predictions
                      ? Object.keys(data.ml_data.predictions).length
                      : 0}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">modelos entrenados</p>
                </CardContent>
              </Card>

              {/* Clustering Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Clustering</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.ml_data?.discoveries?.cluster_assignment?.cluster_id ?? 'N/A'}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">cluster asignado</p>
                </CardContent>
              </Card>

              {/* Agent Synthesis Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Síntesis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.synthesis?.success ? '✓' : '✗'}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">análisis disponible</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions">
            <MLPredictionsPanel predictions={data.ml_data?.predictions} loading={false} />
          </TabsContent>

          {/* Clustering Tab */}
          <TabsContent value="clustering">
            <MLClusteringPanel discoveries={data.ml_data?.discoveries} loading={false} />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <MLAgentInsights
              synthesis={data.synthesis}
              interventionStrategy={data.intervention_strategy}
              loading={false}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegratedMLAnalysis;
