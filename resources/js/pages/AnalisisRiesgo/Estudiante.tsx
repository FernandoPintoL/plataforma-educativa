import React, { useEffect, useState } from 'react';
import { Head, Link, useRoute } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RiskScoreCard } from '@/components/AnalisisRiesgo/RiskScoreCard';
import { RiskTrendChart } from '@/components/AnalisisRiesgo/RiskTrendChart';
import { CareerRecommendations } from '@/components/AnalisisRiesgo/CareerRecommendationCard';
import {
  ChevronLeft,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Award,
  BookOpen,
} from 'lucide-react';
import analisisRiesgoService from '@/services/analisis-riesgo.service';
import type { AnalisEstudiante, DatoTendencia } from '@/types/analisis-riesgo';

interface EstudianteProps {
  estudianteId: number;
}

export default function Estudiante({ estudianteId }: EstudianteProps) {
  const [analisis, setAnalisis] = useState<AnalisEstudiante | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Monitoreo de Desempeño', href: '/analisis-riesgo' },
    { label: 'Estudiante' },
  ];

  useEffect(() => {
    loadAnalisis();
  }, [estudianteId]);

  const loadAnalisis = async () => {
    try {
      setIsLoading(true);
      const data = await analisisRiesgoService.analisEstudiante(estudianteId, 12);
      setAnalisis(data);
      setError(null);
    } catch (err) {
      console.error('Error cargando análisis:', err);
      setError('No se pudo cargar el análisis del estudiante');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Análisis de Estudiante" />
        <div className="flex items-center justify-center h-screen">
          <p>Cargando análisis...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !analisis) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Análisis de Estudiante" />
        <div className="space-y-4 p-4">
          <Link href="/analisis-riesgo">
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>

          <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              {error || 'No se encontró análisis para este estudiante'}
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  const {
    estudiante,
    prediccion_riesgo,
    historico_riesgo,
    recomendaciones_carrera,
    tendencia,
    calificaciones_recientes,
  } = analisis;

  // Preparar datos para gráfico de tendencia
  const datosGrafico: DatoTendencia[] = historico_riesgo.map((h) => ({
    fecha: h.fecha_prediccion,
    score_promedio: h.score_riesgo,
    total: 1, // Placeholder
  }));

  const getTendenciaIcon = () => {
    if (!tendencia) return null;

    switch (tendencia.tendencia) {
      case 'mejorando':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declinando':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'estable':
        return <Minus className="w-5 h-5 text-blue-600" />;
      case 'fluctuando':
        return <Zap className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Análisis: ${estudiante.nombre}`} />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/analisis-riesgo">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {estudiante.nombre}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{estudiante.email}</p>
          </div>

          <Button onClick={loadAnalisis} variant="outline" size="sm">
            Actualizar
          </Button>
        </div>

        {/* Tarjeta de riesgo principal */}
        <RiskScoreCard
          studentName={estudiante.nombre}
          studentEmail={estudiante.email}
          scoreRiesgo={prediccion_riesgo.score_riesgo}
          nivelRiesgo={prediccion_riesgo.nivel_riesgo}
          confianza={prediccion_riesgo.confianza}
          descripcion={prediccion_riesgo.descripcion}
          showWarning={true}
        />

        {/* Tendencia y información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tendencia */}
          {tendencia && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTendenciaIcon()}
                  Tendencia Académica
                </CardTitle>
                <CardDescription>Dirección del desempeño reciente</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                  <p className="text-lg font-bold">
                    {tendencia.tendencia.charAt(0).toUpperCase() + tendencia.tendencia.slice(1)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Confianza</p>
                  <p className="text-lg font-bold">
                    {tendencia.confianza ? Math.round(tendencia.confianza * 100) : 0}%
                  </p>
                </div>

                <div className="pt-2 border-t">
                  {tendencia.tendencia === 'mejorando' && (
                    <p className="text-sm text-green-700 dark:text-green-300">
                      El estudiante muestra mejoría consistente en su desempeño.
                    </p>
                  )}
                  {tendencia.tendencia === 'declinando' && (
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Se detecta un declive en el desempeño. Intervención recomendada.
                    </p>
                  )}
                  {tendencia.tendencia === 'estable' && (
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      El desempeño se mantiene consistente.
                    </p>
                  )}
                  {tendencia.tendencia === 'fluctuando' && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      El desempeño presenta variabilidad. Requiere seguimiento cercano.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información de calificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Calificaciones Recientes
              </CardTitle>
              <CardDescription>Últimas {calificaciones_recientes.length} calificaciones</CardDescription>
            </CardHeader>

            <CardContent>
              {calificaciones_recientes.length > 0 ? (
                <div className="space-y-2">
                  {calificaciones_recientes.slice(0, 5).map((cal) => (
                    <div
                      key={cal.id}
                      className="flex justify-between items-center p-2 border rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(cal.created_at).toLocaleDateString('es-ES')}
                      </span>
                      <Badge variant="secondary">
                        {cal.puntaje}/100
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sin calificaciones registradas</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs con información detallada */}
        <Tabs defaultValue="historico" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="factores">Factores Influyentes</TabsTrigger>
            <TabsTrigger value="carreras">Carreras Recomendadas</TabsTrigger>
          </TabsList>

          {/* Tab: Histórico de riesgo */}
          <TabsContent value="historico" className="space-y-4">
            {historico_riesgo.length > 0 ? (
              <RiskTrendChart
                data={datosGrafico}
                title="Histórico de Riesgo"
                description="Evolución de la puntuación de riesgo en los últimos 12 períodos"
                height="350px"
              />
            ) : (
              <Card>
                <CardContent className="pt-10">
                  <p className="text-center text-gray-500">
                    Sin datos históricos disponibles
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Factores influyentes */}
          <TabsContent value="factores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Factores Influyentes</CardTitle>
                <CardDescription>
                  Factores que influyen en la predicción de riesgo
                </CardDescription>
              </CardHeader>

              <CardContent>
                {prediccion_riesgo.factores_influyentes &&
                Object.keys(prediccion_riesgo.factores_influyentes).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(prediccion_riesgo.factores_influyentes).map(
                      ([factor, valor]) => (
                        <div
                          key={factor}
                          className="flex justify-between items-center p-3 border rounded-lg"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {factor.replace(/_/g, ' ')}
                          </span>
                          <Badge variant="secondary">
                            {typeof valor === 'number'
                              ? valor.toFixed(3)
                              : String(valor)}
                          </Badge>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Sin factores específicos disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Carreras recomendadas */}
          <TabsContent value="carreras" className="space-y-4">
            {recomendaciones_carrera.length > 0 ? (
              <CareerRecommendations
                carreras={recomendaciones_carrera}
                compact={true}
              />
            ) : (
              <Card>
                <CardContent className="pt-10">
                  <p className="text-center text-gray-500">
                    Sin recomendaciones de carrera disponibles
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Recomendaciones y acciones */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-lg">Recomendaciones y Acciones</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {prediccion_riesgo.nivel_riesgo === 'alto' && (
              <>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Contactar inmediatamente a padres/tutores
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Programar reunión con el estudiante y profesor consejero
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Considerar programa de tutoría o apoyo académico
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Realizar seguimiento en 2 semanas
                </p>
              </>
            )}

            {prediccion_riesgo.nivel_riesgo === 'medio' && (
              <>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Monitoreo cercano del desempeño
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Ofrecer apoyo académico preventivo
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Realizar seguimiento mensual
                </p>
              </>
            )}

            {prediccion_riesgo.nivel_riesgo === 'bajo' && (
              <>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Continuar con apoyo académico regular
                </p>
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  ✓ Mantener seguimiento periódico
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
