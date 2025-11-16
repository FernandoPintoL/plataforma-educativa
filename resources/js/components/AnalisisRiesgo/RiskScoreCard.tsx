import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import type { NivelRiesgo } from '@/types/analisis-riesgo';

interface RiskScoreCardProps {
  studentName: string;
  studentEmail?: string;
  scoreRiesgo: number; // 0-1
  nivelRiesgo: NivelRiesgo;
  confianza?: number;
  descripcion?: string;
  showWarning?: boolean;
}

export function RiskScoreCard({
  studentName,
  studentEmail,
  scoreRiesgo,
  nivelRiesgo,
  confianza,
  descripcion,
  showWarning = true,
}: RiskScoreCardProps) {
  const percentage = Math.round(scoreRiesgo * 100);

  const getColor = (nivel: NivelRiesgo): string => {
    switch (nivel) {
      case 'alto':
        return 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200';
      case 'medio':
        return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200';
      case 'bajo':
        return 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  const getIcon = (nivel: NivelRiesgo) => {
    switch (nivel) {
      case 'alto':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medio':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'bajo':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getNivelLabel = (nivel: NivelRiesgo): string => {
    switch (nivel) {
      case 'alto':
        return 'Riesgo Alto';
      case 'medio':
        return 'Riesgo Medio';
      case 'bajo':
        return 'Riesgo Bajo';
      default:
        return 'Desconocido';
    }
  };

  const getProgressBarColor = (nivel: NivelRiesgo): string => {
    switch (nivel) {
      case 'alto':
        return 'bg-red-500';
      case 'medio':
        return 'bg-yellow-500';
      case 'bajo':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className={`${getColor(nivelRiesgo)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getIcon(nivelRiesgo)}
              {studentName}
            </CardTitle>
            {studentEmail && (
              <CardDescription className="mt-1 text-sm">
                {studentEmail}
              </CardDescription>
            )}
          </div>
          <Badge variant="outline">
            {getNivelLabel(nivelRiesgo)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Puntuación de riesgo */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-medium">Puntuación de Riesgo</span>
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>

          {/* Barra de progreso circular aproximado */}
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getProgressBarColor(nivelRiesgo)} transition-all`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Escala */}
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
            <span>Seguro (0%)</span>
            <span>Medio (50%)</span>
            <span>Crítico (100%)</span>
          </div>
        </div>

        {/* Confianza */}
        {confianza !== undefined && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Confianza de Predicción</span>
              <span className="text-sm font-bold">
                {Math.round(confianza * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Alerta si es riesgo alto */}
        {showWarning && nivelRiesgo === 'alto' && (
          <Alert className="border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              Este estudiante requiere intervención inmediata. Se recomienda contacto con padres/tutores.
            </AlertDescription>
          </Alert>
        )}

        {/* Descripción */}
        {descripcion && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {descripcion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RiskScoreCard;
