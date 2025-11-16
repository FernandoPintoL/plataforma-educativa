import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskTrendChart } from '@/components/AnalisisRiesgo/RiskTrendChart';
import { ChevronLeft } from 'lucide-react';
import analisisRiesgoService from '@/services/analisis-riesgo.service';
import type { TendenciasGraficas } from '@/types/analisis-riesgo';

interface TendenciasProps {
  cursos?: Array<{ id: number; nombre: string }>;
}

export default function Tendencias({ cursos = [] }: TendenciasProps) {
  const [selectedCurso, setSelectedCurso] = useState<number | undefined>();
  const [dias, setDias] = useState(90);
  const [tendencias, setTendencias] = useState<TendenciasGraficas | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Análisis de Riesgo', href: '/analisis-riesgo' },
    { label: 'Tendencias' },
  ];

  useEffect(() => {
    loadTendencias();
  }, [selectedCurso, dias]);

  const loadTendencias = async () => {
    try {
      setIsLoading(true);
      const data = await analisisRiesgoService.obtenerTendencias({
        curso_id: selectedCurso,
        dias,
      });
      setTendencias(data);
    } catch (error) {
      console.error('Error cargando tendencias:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!tendencias) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Tendencias de Riesgo" />
        <div className="flex items-center justify-center h-screen">
          <p>Cargando tendencias...</p>
        </div>
      </AppLayout>
    );
  }

  const { grafico_tendencia, distribucion_tendencia } = tendencias;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tendencias de Riesgo" />

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
              Análisis de Tendencias
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Seguimiento histórico del riesgo académico
            </p>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              {cursos.length > 0 && (
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
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
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
                  <option value={30}>Últimos 30 días</option>
                  <option value={60}>Últimos 60 días</option>
                  <option value={90}>Últimos 90 días</option>
                  <option value={180}>Últimos 180 días</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button onClick={loadTendencias} variant="outline" size="sm">
                  Actualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de tendencia */}
        <RiskTrendChart
          data={grafico_tendencia}
          title="Tendencia de Riesgo Promedio"
          description={`Evolución del score de riesgo promedio en los últimos ${dias} días`}
          height="400px"
          isLoading={isLoading}
        />

        {/* Distribución de tendencias */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 dark:text-green-200">
                Mejorando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {distribucion_tendencia.mejorando}
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Estudiantes con tendencia positiva
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Estable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {distribucion_tendencia.estable}
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Desempeño consistente
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-900 dark:text-red-200">
                Declinando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {distribucion_tendencia.declinando}
              </div>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Requiere intervención
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                Fluctuando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {distribucion_tendencia.fluctuando}
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                Desempeño variable
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Información interpretativa */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-lg">Interpretación de Tendencias</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">
                ↑ Mejorando
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Los estudiantes muestran una trayectoria académica positiva. Continúe
                con el apoyo regular.
              </p>
            </div>

            <div className="pt-3 border-t">
              <p className="font-medium text-blue-700 dark:text-blue-300">
                — Estable
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                El desempeño es consistente. Mantenga el monitoreo periódico.
              </p>
            </div>

            <div className="pt-3 border-t">
              <p className="font-medium text-red-700 dark:text-red-300">
                ↓ Declinando
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Se detecta un declive en el desempeño. Se recomienda intervención
                inmediata y seguimiento cercano.
              </p>
            </div>

            <div className="pt-3 border-t">
              <p className="font-medium text-yellow-700 dark:text-yellow-300">
                ⚡ Fluctuando
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                El desempeño es variable. Investigue factores que pueden estar
                afectando la consistencia.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recomendaciones Basadas en Tendencias</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {distribucion_tendencia.declinando > 0 && (
              <p className="text-sm">
                ✓ Hay {distribucion_tendencia.declinando} estudiantes declinando - Priorice
                intervenciones para estos casos
              </p>
            )}

            {distribucion_tendencia.mejorando > 0 && (
              <p className="text-sm">
                ✓ Hay {distribucion_tendencia.mejorando} estudiantes mejorando - Documente
                las estrategias exitosas
              </p>
            )}

            {distribucion_tendencia.fluctuando > 0 && (
              <p className="text-sm">
                ✓ Hay {distribucion_tendencia.fluctuando} estudiantes fluctuando - Realice
                seguimiento más frecuente
              </p>
            )}

            <p className="text-sm text-blue-700 dark:text-blue-300 pt-2 border-t">
              Utilice estos datos para adaptar estrategias de enseñanza y apoyo
              académico.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
