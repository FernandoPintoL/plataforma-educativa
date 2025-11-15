import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../../components/Layout/AppLayout';
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
} from 'lucide-react';

interface Pregunta {
  id: number;
  pregunta: string;
  tipo: string;
  opciones?: string[];
  order: number;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  preguntas: Pregunta[];
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

export default function Show({ test }: ShowProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Tests Vocacionales', href: '/tests-vocacionales' },
    { label: test.nombre },
  ];

  const totalPreguntas = test.categorias.reduce(
    (sum, cat) => sum + cat.preguntas.length,
    0
  );

  const handleDeletePregunta = (preguntaId: number) => {
    // Implement delete logic
    console.log('Delete pregunta:', preguntaId);
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
                    <Button disabled>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Categoría (Próximamente)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              test.categorias.map((categoria, catIndex) => (
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
                      <Badge variant="secondary">
                        {categoria.preguntas.length} preguntas
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {categoria.preguntas.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Sin preguntas en esta categoría
                        </p>
                        <Button disabled size="sm">
                          <Plus className="w-3 h-3 mr-2" />
                          Agregar Pregunta (Próximamente)
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {categoria.preguntas.map((pregunta, pregIndex) => (
                          <div
                            key={pregunta.id}
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {pregIndex + 1}. {pregunta.pregunta}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="mt-2"
                                >
                                  {pregunta.tipo}
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setDeleteConfirm(pregunta.id)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>

                            {pregunta.opciones &&
                              pregunta.opciones.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {pregunta.opciones.map(
                                    (opcion, idx) => (
                                      <div
                                        key={idx}
                                        className="ml-4 text-sm text-gray-600 dark:text-gray-400"
                                      >
                                        • {opcion}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Respuestas Tab */}
          <TabsContent value="respuestas">
            <Card>
              <CardHeader>
                <CardTitle>Respuestas del Test</CardTitle>
                <CardDescription>
                  {test.resultados_count} estudiante(s) han completado este
                  test
                </CardDescription>
              </CardHeader>

              <CardContent>
                {test.resultados_count === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-600 dark:text-gray-400">
                      Aún no hay respuestas. Los estudiantes que completen el
                      test aparecerán aquí.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">
                            Estudiante
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Fecha
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Estado
                          </th>
                          <th className="text-left py-3 px-4 font-medium">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Mock data - Replace with actual data */}
                        <tr className="border-b">
                          <td className="py-3 px-4">Estudiante Name</td>
                          <td className="py-3 px-4">15 Nov, 2025</td>
                          <td className="py-3 px-4">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Completado
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">
                              Ver Respuestas
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
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
