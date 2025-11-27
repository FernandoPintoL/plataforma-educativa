import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  ChevronLeft,
  Edit,
  Plus,
  Users,
  Clock,
  FileText,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import CategoriaForm from '@/components/Tests/CategoriaForm';
import PreguntaForm from '@/components/Tests/PreguntaForm';
import PreguntaList from '@/components/Tests/PreguntaList';
import RespuestasTable from '@/components/Tests/RespuestasTable';
import AnalyticsCard from '@/components/Tests/AnalyticsCard';

interface Pregunta {
  id: number;
  enunciado: string;
  tipo: string;
  opciones?: string[];
  categoria_test_id: number;
  orden: number;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  test_vocacional_id: number;
  preguntas: Pregunta[];
  orden: number;
}

interface TestVocacional {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_estimada: number;
  activo: boolean;
  resultados_count: number;
  categorias: Categoria[];
  created_at: string;
  updated_at: string;
}

interface ShowProps {
  test: TestVocacional;
}

export default function Show({ test: initialTest }: ShowProps) {
  const [test, setTest] = useState(initialTest);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Tests Vocacionales', href: '/tests-vocacionales' },
    { label: test.nombre },
  ];

  const totalPreguntas = test.categorias.reduce(
    (sum, cat) => sum + cat.preguntas.length,
    0
  );

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/tests-vocacionales/${test.id}`
      );
      setTest(response.data.data || response.data);
    } catch (err) {
      setError('Error al actualizar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={test.nombre} />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/tests-vocacionales">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {test.nombre}
            </h1>
            {test.descripcion && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {test.descripcion}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/tests-vocacionales/${test.id}/editar`}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                className={
                  test.activo
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }
              >
                {test.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Duración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="font-semibold">
                  {test.duracion_estimada} min
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categorías</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {test.categorias.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Preguntas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPreguntas}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Respuestas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="font-semibold">
                  {test.resultados_count}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contenido" className="w-full">
          <TabsList>
            <TabsTrigger value="contenido" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Contenido
            </TabsTrigger>
            <TabsTrigger value="respuestas" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Respuestas ({test.resultados_count})
            </TabsTrigger>
          </TabsList>

          {/* Contenido Tab */}
          <TabsContent value="contenido" className="space-y-6">
            {error && (
              <div className="flex gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{error}</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleRefresh}
                    className="text-red-600 dark:text-red-400 h-auto p-0 mt-1"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            )}

            {test.categorias.length === 0 ? (
              <Card>
                <CardContent className="pt-10">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Sin categorías
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Este test aún no tiene preguntas. Agrega categorías y
                      preguntas.
                    </p>
                    <CategoriaForm
                      testId={test.id}
                      onSuccess={handleRefresh}
                      variant="create"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-end">
                  <CategoriaForm
                    testId={test.id}
                    onSuccess={handleRefresh}
                    variant="create"
                  />
                </div>

                <div className="space-y-6">
                  {test.categorias.map((categoria, catIndex) => (
                    <Card key={categoria.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">
                              {catIndex + 1}. {categoria.nombre}
                            </CardTitle>
                            {categoria.descripcion && (
                              <CardDescription className="mt-1">
                                {categoria.descripcion}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">
                              {categoria.preguntas.length} preguntas
                            </Badge>
                            <CategoriaForm
                              testId={test.id}
                              categoria={categoria}
                              onSuccess={handleRefresh}
                              variant="edit"
                            />
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {categoria.preguntas.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              Sin preguntas en esta categoría
                            </p>
                            <PreguntaForm
                              testId={test.id}
                              categoriaId={categoria.id}
                              onSuccess={handleRefresh}
                              variant="create"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-end mb-4">
                              <PreguntaForm
                                testId={test.id}
                                categoriaId={categoria.id}
                                onSuccess={handleRefresh}
                                variant="create"
                              />
                            </div>

                            <PreguntaList
                              testId={test.id}
                              categoriaId={categoria.id}
                              preguntas={categoria.preguntas}
                              onUpdate={handleRefresh}
                            />
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Respuestas Tab */}
          <TabsContent value="respuestas" className="space-y-6">
            {test.resultados_count === 0 ? (
              <Card>
                <CardContent className="text-center py-10">
                  <p className="text-gray-600 dark:text-gray-400">
                    Aún no hay respuestas. Los estudiantes que completen el
                    test aparecerán aquí.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <AnalyticsCard testId={test.id} />
                <RespuestasTable testId={test.id} testNombre={test.nombre} />
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Meta Info */}
        <Card className="border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          <CardHeader>
            <CardTitle className="text-sm">Información Técnica</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">
                  Creado:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {new Date(test.created_at).toLocaleDateString('es-ES')}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600 dark:text-gray-400">
                  Última actualización:
                </dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {new Date(test.updated_at).toLocaleDateString('es-ES')}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
