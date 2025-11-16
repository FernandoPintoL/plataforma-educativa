import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Award, TrendingUp } from 'lucide-react';
import type { PrediccionCarrera } from '@/types/analisis-riesgo';

interface CareerRecommendationCardProps {
  career: PrediccionCarrera;
  showRanking?: boolean;
  compact?: boolean;
}

export function CareerRecommendationCard({
  career,
  showRanking = true,
  compact = false,
}: CareerRecommendationCardProps) {
  const percentage = Math.round(career.compatibilidad * 100);

  const getColorBadge = () => {
    if (career.compatibilidad >= 0.8) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    if (career.compatibilidad >= 0.6) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
    if (career.compatibilidad >= 0.4) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getColorBar = () => {
    if (career.compatibilidad >= 0.8) return 'bg-green-500';
    if (career.compatibilidad >= 0.6) return 'bg-blue-500';
    if (career.compatibilidad >= 0.4) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getRankingBadge = (ranking: number) => {
    switch (ranking) {
      case 1:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            🥇 Top 1
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            🥈 Top 2
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            🥉 Top 3
          </Badge>
        );
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div className="p-3 border rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {career.carrera_nombre}
            </h4>
          </div>
          <Badge className={getColorBadge()}>{percentage}%</Badge>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${getColorBar()} transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {career.descripcion && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {career.descripcion}
          </p>
        )}
      </div>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-blue-500" />
              {career.carrera_nombre}
            </CardTitle>
          </div>

          {showRanking && getRankingBadge(career.ranking)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Compatibilidad */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Compatibilidad
            </span>
            <span className="text-2xl font-bold">{percentage}%</span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getColorBar()} transition-all`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Descripción */}
        {career.descripcion && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {career.descripcion}
            </p>
          </div>
        )}

        {/* Interpretación */}
        <div className="pt-2 border-t bg-gray-50 dark:bg-gray-950 p-3 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span>
              {percentage >= 80
                ? 'Excelente compatibilidad - Opción altamente recomendada'
                : percentage >= 60
                ? 'Buena compatibilidad - Opción recomendada'
                : percentage >= 40
                ? 'Compatibilidad moderada - Opción a considerar'
                : 'Compatibilidad baja - Recomendamos explorar otras opciones'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CareerRecommendationsProps {
  carreras: PrediccionCarrera[];
  isLoading?: boolean;
  emptyMessage?: string;
  compact?: boolean;
}

export function CareerRecommendations({
  carreras,
  isLoading = false,
  emptyMessage = 'No hay recomendaciones de carrera disponibles',
  compact = false,
}: CareerRecommendationsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-10">
          <div className="text-center text-gray-500">
            Cargando recomendaciones...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!carreras || carreras.length === 0) {
    return (
      <Card>
        <CardContent className="pt-10">
          <div className="text-center text-gray-500">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" />
            Carreras Recomendadas
          </CardTitle>
          <CardDescription>
            Top {carreras.length} opciones de carrera sugeridas
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {carreras.map((carrera) => (
            <CareerRecommendationCard
              key={carrera.id}
              career={carrera}
              showRanking={true}
              compact={true}
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
          <Award className="w-6 h-6 text-blue-500" />
          Recomendaciones de Carrera
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Basado en el análisis de aptitud y desempeño académico
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carreras.map((carrera) => (
          <CareerRecommendationCard
            key={carrera.id}
            career={carrera}
            showRanking={true}
            compact={false}
          />
        ))}
      </div>
    </div>
  );
}

export default CareerRecommendationCard;
