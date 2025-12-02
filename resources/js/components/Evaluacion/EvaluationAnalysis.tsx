import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Zap,
  Loader2,
} from 'lucide-react';

interface AnalysisData {
  analisis: string;
  recomendaciones: string[];
  areas_mejora: string[];
  proximos_pasos: string[];
  fecha_analisis: string;
}

interface EvaluationAnalysisProps {
  intentoId: number;
  asignatura: string;
  puntaje: number;
  porcentajeAcierto: number;
}

export default function EvaluationAnalysis({
  intentoId,
  asignatura,
  puntaje,
  porcentajeAcierto,
}: EvaluationAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/api/evaluaciones-intentos/intentos/${intentoId}/analisis-ia`
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          setAnalysis(data.data);
        } else {
          throw new Error(data.message || 'Error al obtener análisis');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error desconocido'
        );
      } finally {
        setLoading(false);
      }
    };

    if (intentoId) {
      fetchAnalysis();
    }
  }, [intentoId]);

  // Determinar color basado en porcentaje
  const getPerformanceColor = () => {
    if (porcentajeAcierto >= 80) return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800';
    if (porcentajeAcierto >= 60) return 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800';
    return 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800';
  };

  const getPerformanceIconColor = () => {
    if (porcentajeAcierto >= 80) return 'text-green-600 dark:text-green-400';
    if (porcentajeAcierto >= 60) return 'text-blue-600 dark:text-blue-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="space-y-6">
      {/* Header con información de desempeño */}
      <Card className={`border ${getPerformanceColor()}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className={`h-6 w-6 ${getPerformanceIconColor()}`} />
                Análisis de Tu Evaluación: {asignatura}
              </CardTitle>
              <CardDescription>
                Evaluación completada - Análisis impulsado por IA
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {puntaje}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Puntaje Obtenido
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getPerformanceIconColor()}`}>
                {porcentajeAcierto.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Porcentaje de Acierto
              </div>
            </div>
            <div className="text-center">
              <Badge
                variant={
                  porcentajeAcierto >= 80
                    ? 'default'
                    : porcentajeAcierto >= 60
                    ? 'secondary'
                    : 'destructive'
                }
                className="px-3 py-1 text-xs uppercase"
              >
                {porcentajeAcierto >= 80
                  ? 'Excelente'
                  : porcentajeAcierto >= 60
                  ? 'Bueno'
                  : 'Necesita Mejora'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loading && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generando análisis personalizado...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No pudimos generar el análisis. Por favor, intenta más tarde.
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis content */}
      {analysis && !loading && (
        <>
          {/* Análisis General */}
          <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Análisis de tu Desempeño
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.analisis.split('\n').filter((p) => p.trim()).map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          {analysis.recomendaciones && analysis.recomendaciones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Recomendaciones para Mejorar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {analysis.recomendaciones.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border-l-4 border-l-yellow-400 bg-yellow-50 p-3 dark:bg-yellow-950 dark:border-l-yellow-600"
                    >
                      <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-yellow-200 text-xs font-bold text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Áreas de Mejora */}
          {analysis.areas_mejora && analysis.areas_mejora.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Áreas Identificadas para Desarrollar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {analysis.areas_mejora.map((area, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border-l-4 border-l-orange-400 bg-orange-50 p-3 dark:bg-orange-950 dark:border-l-orange-600"
                    >
                      <Target className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{area}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Próximos Pasos */}
          {analysis.proximos_pasos && analysis.proximos_pasos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-purple-500" />
                  Próximos Pasos Recomendados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.proximos_pasos.map((paso, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold shadow-lg">
                          {idx + 1}
                        </div>
                        {idx < analysis.proximos_pasos.length - 1 && (
                          <div className="mt-2 h-12 w-1 bg-gradient-to-b from-purple-300 to-transparent dark:from-purple-700" />
                        )}
                      </div>
                      <div className="flex-1 pt-1 pb-4">
                        <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-3 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
                          <p className="text-sm font-medium text-purple-900 dark:text-purple-100 leading-relaxed">
                            {paso}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer con información adicional */}
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Análisis generado: {new Date(analysis.fecha_analisis).toLocaleDateString()}
                </span>
                <Button variant="outline" size="sm">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Volver a Evaluaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty state */}
      {!loading && !error && !analysis && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <Brain className="mx-auto mb-2 h-8 w-8 opacity-50" />
              <p>No hay análisis disponible para esta evaluación</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
