import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Eye } from 'lucide-react';
import analisisRiesgoService from '@/services/analisis-riesgo.service';
import type { AnalisPorCurso } from '@/types/analisis-riesgo';

interface CursosProps {
  cursos?: Array<{ id: number; nombre: string }>;
}

export default function Cursos({ cursos = [] }: CursosProps) {
  const [selectedCurso, setSelectedCurso] = useState<number | null>(
    cursos.length > 0 ? cursos[0].id : null
  );
  const [analisisData, setAnalisisData] = useState<AnalisPorCurso | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Análisis de Riesgo', href: '/analisis-riesgo' },
    { label: 'Por Cursos' },
  ];

  useEffect(() => {
    if (selectedCurso) {
      loadAnalisis(selectedCurso);
    }
  }, [selectedCurso]);

  const loadAnalisis = async (cursoId: number) => {
    try {
      setIsLoading(true);
      const data = await analisisRiesgoService.analisPorCurso(cursoId);
      setAnalisisData(data);
    } catch (error) {
      console.error('Error cargando análisis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedCurso || !analisisData) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Análisis por Cursos" />
        <div className="space-y-4 p-4">
          <Link href="/analisis-riesgo">
            <Button variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <Card>
            <CardContent className="pt-10">
              <p className="text-center">No hay cursos disponibles</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const { curso, metricas, estudiantes_por_nivel, lista_completa } = analisisData;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Análisis: ${curso.nombre}`} />

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
              Análisis: {curso.nombre}
            </h1>
            {curso.codigo && (
              <p className="text-gray-600 dark:text-gray-400">Código: {curso.codigo}</p>
            )}
          </div>
        </div>

        {/* Selector de curso */}
        {cursos.length > 1 && (
          <Card>
            <CardContent className="pt-6">
              <label className="block text-sm font-medium mb-2">Seleccionar curso:</label>
              <select
                value={selectedCurso}
                onChange={(e) => setSelectedCurso(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              >
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metricas.total_estudiantes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Score Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {(metricas.score_promedio * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">% Riesgo Alto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {metricas.porcentaje_alto_riesgo.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Distribucion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p>🔴 Alto: {metricas.distribucion.alto}</p>
                <p>🟡 Medio: {metricas.distribucion.medio}</p>
                <p>🟢 Bajo: {metricas.distribucion.bajo}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="riesgo-alto" className="w-full">
          <TabsList>
            <TabsTrigger value="riesgo-alto">
              Riesgo Alto ({estudiantes_por_nivel.alto.length})
            </TabsTrigger>
            <TabsTrigger value="riesgo-medio">
              Riesgo Medio ({estudiantes_por_nivel.medio.length})
            </TabsTrigger>
            <TabsTrigger value="lista-completa">
              Lista Completa ({lista_completa.length})
            </TabsTrigger>
          </TabsList>

          {/* Riesgo Alto */}
          <TabsContent value="riesgo-alto">
            <Card>
              <CardHeader>
                <CardTitle>Estudiantes en Riesgo Alto</CardTitle>
              </CardHeader>
              <CardContent>
                {estudiantes_por_nivel.alto.length > 0 ? (
                  <div className="space-y-2">
                    {estudiantes_por_nivel.alto.map((est, idx) => (
                      <Link
                        key={idx}
                        href={`/analisis-riesgo/estudiante/${est.estudiante_id}`}
                      >
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer">
                          <p className="font-medium">{est.nombre}</p>
                          <Badge className="bg-red-600 text-white">
                            {Math.round(est.score * 100)}%
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Sin estudiantes en riesgo alto</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Riesgo Medio */}
          <TabsContent value="riesgo-medio">
            <Card>
              <CardHeader>
                <CardTitle>Estudiantes en Riesgo Medio</CardTitle>
              </CardHeader>
              <CardContent>
                {estudiantes_por_nivel.medio.length > 0 ? (
                  <div className="space-y-2">
                    {estudiantes_por_nivel.medio.map((est, idx) => (
                      <Link
                        key={idx}
                        href={`/analisis-riesgo/estudiante/${est.estudiante_id}`}
                      >
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-950 transition-colors cursor-pointer">
                          <p className="font-medium">{est.nombre}</p>
                          <Badge className="bg-yellow-600 text-white">
                            {Math.round(est.score * 100)}%
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Sin estudiantes en riesgo medio</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lista Completa */}
          <TabsContent value="lista-completa">
            <Card>
              <CardHeader>
                <CardTitle>Todos los Estudiantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Estudiante</th>
                        <th className="text-left py-2 px-2">Riesgo</th>
                        <th className="text-left py-2 px-2">Score</th>
                        <th className="text-right py-2 px-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lista_completa.map((est, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-950">
                          <td className="py-2 px-2">{est.nombre}</td>
                          <td className="py-2 px-2">
                            <Badge
                              className={
                                est.nivel_riesgo === 'alto'
                                  ? 'bg-red-100 text-red-800'
                                  : est.nivel_riesgo === 'medio'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }
                            >
                              {est.nivel_riesgo?.charAt(0).toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 font-semibold">
                            {Math.round(est.score_riesgo * 100)}%
                          </td>
                          <td className="py-2 px-2 text-right">
                            <Link
                              href={`/analisis-riesgo/estudiante/${est.estudiante_id}`}
                            >
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
