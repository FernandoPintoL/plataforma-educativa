/**
 * MLPredictionsPanel Component
 *
 * Muestra las predicciones de modelos supervisados
 * (performance, career, trend, progress)
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Prediction {
  student_id: number;
  prediction: number;
  confidence: number;
  model_used: string;
}

interface MLPredictionsPanelProps {
  predictions?: Record<string, Prediction>;
  loading?: boolean;
}

export const MLPredictionsPanel: React.FC<MLPredictionsPanelProps> = ({
  predictions,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Predicciones Supervisadas</CardTitle>
          <CardDescription>Cargando datos...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-2 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictions || Object.keys(predictions).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Predicciones Supervisadas</CardTitle>
          <CardDescription>No hay datos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No se encontraron predicciones para este estudiante
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predicciones Supervisadas</CardTitle>
        <CardDescription>Modelos entrenados de predicción de desempeño</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(predictions).map(([key, prediction]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium capitalize">
                    {key === 'performance' && 'Desempeño'}
                    {key === 'career' && 'Carrera'}
                    {key === 'trend' && 'Tendencia'}
                    {key === 'progress' && 'Progreso'}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {prediction.model_used}
                  </Badge>
                </div>
                <span className="text-sm font-semibold">
                  {typeof prediction.prediction === 'number'
                    ? prediction.prediction.toFixed(2)
                    : prediction.prediction}
                </span>
              </div>

              <div className="space-y-1">
                <Progress
                  value={
                    typeof prediction.prediction === 'number'
                      ? Math.min(prediction.prediction, 100)
                      : 0
                  }
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Confianza: {(prediction.confidence * 100).toFixed(0)}%</span>
                  {key === 'performance' && <span>Escala: 0-100</span>}
                  {key === 'progress' && <span>Escala: 0-100</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MLPredictionsPanel;
