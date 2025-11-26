/**
 * MLAgentInsights Component
 *
 * Muestra síntesis inteligente del agente LLM e intervención personalizada
 * Incluye insights, recomendaciones, acciones y recursos
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Lightbulb, Target, BookOpen } from 'lucide-react';

interface MLSynthesis {
  success: boolean;
  synthesis?: {
    method?: string;
    key_insights?: string[];
    recommendations?: string[];
    reasoning_process?: string[];
  };
  reasoning?: string[];
  confidence?: number;
  timestamp?: string;
  method?: string;
}

interface InterventionStrategy {
  success: boolean;
  strategy?: {
    type?: string;
    frequency?: string;
    focus_areas?: string[];
    success_criteria?: string[];
  };
  actions?: string[];
  resources?: Array<{
    type: string;
    priority: string;
    topic: string;
  }>;
  confidence?: number;
  timestamp?: string;
}

interface MLAgentInsightsProps {
  synthesis?: MLSynthesis;
  interventionStrategy?: InterventionStrategy;
  loading?: boolean;
}

const getPriorityColor = (
  priority: string
): 'destructive' | 'default' | 'secondary' | 'outline' => {
  if (priority === 'high') return 'destructive';
  if (priority === 'medium') return 'outline';
  return 'secondary';
};

const getPriorityLabel = (priority: string): string => {
  if (priority === 'high') return 'Alta';
  if (priority === 'medium') return 'Media';
  return 'Baja';
};

export const MLAgentInsights: React.FC<MLAgentInsightsProps> = ({
  synthesis,
  interventionStrategy,
  loading = false,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    synthesis: true,
    intervention: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis del Agente Inteligente</CardTitle>
          <CardDescription>Cargando síntesis e intervención...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (
    !synthesis?.success &&
    !interventionStrategy?.success
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análisis del Agente Inteligente</CardTitle>
          <CardDescription>No hay datos disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            No se pudo generar síntesis e intervención para este estudiante
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="synthesis" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="synthesis">Síntesis</TabsTrigger>
        <TabsTrigger value="intervention">Intervención</TabsTrigger>
      </TabsList>

      {/* Tab: Síntesis */}
      <TabsContent value="synthesis" className="space-y-4">
        {synthesis?.success ? (
          <>
            {/* Confianza */}
            {synthesis.confidence !== undefined && (
              <Alert className="border-blue-200 bg-blue-50">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <span className="text-sm font-medium">Confianza del análisis:</span>
                  <span className="ml-2 text-sm">
                    {(synthesis.confidence * 100).toFixed(0)}%
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {/* Key Insights */}
            {synthesis.synthesis?.key_insights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Insights Clave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {synthesis.synthesis.key_insights.map((insight, idx) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recomendaciones */}
            {synthesis.synthesis?.recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-blue-500" />
                    Recomendaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {synthesis.synthesis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3">
                        <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Proceso de Razonamiento */}
            {synthesis.synthesis?.reasoning_process && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Proceso de Análisis</CardTitle>
                  <CardDescription>Pasos seguidos en la síntesis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {synthesis.synthesis.reasoning_process.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-medium flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Alert>
            <AlertDescription>
              No se pudo generar síntesis inteligente para este estudiante
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>

      {/* Tab: Intervención */}
      <TabsContent value="intervention" className="space-y-4">
        {interventionStrategy?.success ? (
          <>
            {/* Confianza */}
            {interventionStrategy.confidence !== undefined && (
              <Alert className="border-green-200 bg-green-50">
                <Target className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <span className="text-sm font-medium">Confianza de la estrategia:</span>
                  <span className="ml-2 text-sm">
                    {(interventionStrategy.confidence * 100).toFixed(0)}%
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {/* Estrategia General */}
            {interventionStrategy.strategy && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estrategia Personalizada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {interventionStrategy.strategy.type && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tipo</p>
                      <p className="text-sm capitalize">{interventionStrategy.strategy.type}</p>
                    </div>
                  )}
                  {interventionStrategy.strategy.frequency && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Frecuencia</p>
                      <p className="text-sm capitalize">{interventionStrategy.strategy.frequency}</p>
                    </div>
                  )}
                  {interventionStrategy.strategy.focus_areas &&
                    interventionStrategy.strategy.focus_areas.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Áreas de Enfoque</p>
                        <div className="flex flex-wrap gap-2">
                          {interventionStrategy.strategy.focus_areas.map((area, idx) => (
                            <Badge key={idx} variant="outline">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Acciones */}
            {interventionStrategy.actions && interventionStrategy.actions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-orange-500" />
                    Acciones Recomendadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {interventionStrategy.actions.map((action, idx) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recursos */}
            {interventionStrategy.resources && interventionStrategy.resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    Recursos Recomendados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {interventionStrategy.resources.map((resource, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{resource.type}</p>
                          <p className="text-xs text-gray-600">{resource.topic}</p>
                        </div>
                        <Badge variant={getPriorityColor(resource.priority)}>
                          {getPriorityLabel(resource.priority)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Criterios de Éxito */}
            {interventionStrategy.strategy?.success_criteria &&
              interventionStrategy.strategy.success_criteria.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Criterios de Éxito</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {interventionStrategy.strategy.success_criteria.map((criteria, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
          </>
        ) : (
          <Alert>
            <AlertDescription>
              No se pudo generar estrategia de intervención para este estudiante
            </AlertDescription>
          </Alert>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MLAgentInsights;
