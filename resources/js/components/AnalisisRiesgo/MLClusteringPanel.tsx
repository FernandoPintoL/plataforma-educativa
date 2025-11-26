/**
 * MLClusteringPanel Component
 *
 * Muestra información de clustering no supervisado
 * (asignación de cluster, descripción del grupo, similitud)
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClusterAssignment {
  student_id: number;
  cluster_id: number;
  cluster_name: string;
  cluster_description: string;
  confidence: number;
}

interface ClusterAnalysis {
  total_clusters: number;
  model_metrics?: {
    silhouette?: number;
    davies_bouldin?: number;
    calinski_harabasz?: number;
  };
  cluster_distributions?: Array<{
    count: number;
    percentage: number;
    name: string;
    description: string;
  }>;
}

interface MLClusteringPanelProps {
  discoveries?: {
    cluster_assignment?: ClusterAssignment;
    cluster_analysis?: ClusterAnalysis;
  };
  loading?: boolean;
}

const getRiskColor = (clusterName: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
  if (clusterName.includes('Bajo') && clusterName.includes('Inconsistente')) {
    return 'destructive'; // Rojo - riesgo alto
  }
  if (clusterName.includes('Bajo')) {
    return 'outline'; // Gris - riesgo medio
  }
  return 'secondary'; // Verde - bajo riesgo
};

export const MLClusteringPanel: React.FC<MLClusteringPanelProps> = ({
  discoveries,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clustering No Supervisado</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-40"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const clusterAssignment = discoveries?.cluster_assignment;
  const clusterAnalysis = discoveries?.cluster_analysis;

  if (!clusterAssignment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clustering No Supervisado</CardTitle>
          <CardDescription>No hay datos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No se encontraron datos de clustering para este estudiante
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Asignación de Cluster */}
      <Card>
        <CardHeader>
          <CardTitle>Asignación de Cluster</CardTitle>
          <CardDescription>Grupo identificado según patrones de aprendizaje</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cluster #{clusterAssignment.cluster_id}</span>
              <Badge variant={getRiskColor(clusterAssignment.cluster_name)}>
                {clusterAssignment.cluster_name}
              </Badge>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-sm text-gray-700">
                {clusterAssignment.cluster_description}
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600">Confianza</p>
                <p className="text-lg font-bold">
                  {(clusterAssignment.confidence * 100).toFixed(0)}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600">Total de Clusters</p>
                <p className="text-lg font-bold">
                  {clusterAnalysis?.total_clusters || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis del Modelo */}
      {clusterAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Análisis del Modelo</CardTitle>
            <CardDescription>Métricas de calidad del clustering</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {clusterAnalysis.model_metrics && (
              <div className="grid grid-cols-3 gap-4">
                {clusterAnalysis.model_metrics.silhouette !== undefined && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">Silhouette</p>
                    <p className="text-lg font-bold">
                      {clusterAnalysis.model_metrics.silhouette.toFixed(3)}
                    </p>
                    <p className="text-xs text-gray-500">[-1, 1] Mejor: 1</p>
                  </div>
                )}
                {clusterAnalysis.model_metrics.davies_bouldin !== undefined && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">Davies-Bouldin</p>
                    <p className="text-lg font-bold">
                      {clusterAnalysis.model_metrics.davies_bouldin.toFixed(3)}
                    </p>
                    <p className="text-xs text-gray-500">Mejor: 0</p>
                  </div>
                )}
                {clusterAnalysis.model_metrics.calinski_harabasz !== undefined && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">Calinski-Harabasz</p>
                    <p className="text-lg font-bold">
                      {clusterAnalysis.model_metrics.calinski_harabasz.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-500">Mejor: Mayor</p>
                  </div>
                )}
              </div>
            )}

            {/* Distribución de Clusters */}
            {clusterAnalysis.cluster_distributions && (
              <div className="space-y-3 pt-4 border-t">
                <p className="font-medium text-sm">Distribución de Clusters</p>
                <div className="space-y-2">
                  {clusterAnalysis.cluster_distributions.map((cluster, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{cluster.name}</span>
                        <span className="text-gray-600">
                          {cluster.count} estudiantes ({cluster.percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            cluster.name.includes('Inconsistente')
                              ? 'bg-red-500'
                              : cluster.name.includes('Alto')
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${cluster.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MLClusteringPanel;
