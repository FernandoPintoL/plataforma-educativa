import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '../../../components/Layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Plus,
  ArrowRight,
  Clock,
  Users,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface TestVocacional {
  id: number;
  nombre: string;
  descripcion: string;
  duracion_estimada: number;
  activo: boolean;
  resultados_count: number;
  created_at: string;
  updated_at: string;
}

interface IndexProps {
  tests: TestVocacional[];
}

export default function Index({ tests }: IndexProps) {
  const { user } = useAuth();
  const isProfesor = user?.esProfesor?.() || user?.hasRole?.(['profesor']);
  const isDirector = user?.esDirector?.() || user?.hasRole?.(['director']);
  const isEstudiante = user?.esEstudiante?.() || user?.hasRole?.(['estudiante']);
  const canCreate = isProfesor || isDirector;

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Tests Vocacionales' },
  ];

  const handleDelete = (testId: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este test vocacional?')) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `/tests-vocacionales/${testId}`;
      form.innerHTML = `
        <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}">
        <input type="hidden" name="_method" value="DELETE">
      `;
      document.body.appendChild(form);
      form.submit();
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tests Vocacionales" />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tests Vocacionales
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explora tus intereses y descubre carreras ideales para ti
            </p>
          </div>

          {canCreate && (
            <Link href="/tests-vocacionales/crear">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Crear Test
              </Button>
            </Link>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tests Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tests.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Listos para resolver
              </p>
            </CardContent>
          </Card>

          {isDirector && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total de Respuestas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tests.reduce((sum, test) => sum + test.resultados_count, 0)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  De todos los tests
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tests Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tests.filter((t) => t.activo).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Disponibles actualmente
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tests List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tests.length === 0 ? (
            <Card className="lg:col-span-2">
              <CardContent className="pt-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No hay tests disponibles
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {canCreate
                      ? 'Crea el primer test vocacional para empezar'
                      : 'Pronto habrá tests vocacionales disponibles'}
                  </p>
                  {canCreate && (
                    <Link href="/tests-vocacionales/crear">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primer Test
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            tests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{test.nombre}</CardTitle>
                      <CardDescription className="mt-2">
                        {test.descripcion || 'Sin descripción'}
                      </CardDescription>
                    </div>
                    {test.activo && (
                      <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Activo
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      {test.duracion_estimada && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{test.duracion_estimada} min</span>
                        </div>
                      )}
                      {isDirector && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{test.resultados_count} respuestas</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      {isEstudiante && test.activo && (
                        <Link href={`/tests-vocacionales/${test.id}/tomar`} className="flex-1">
                          <Button className="w-full" variant="default">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Resolver
                          </Button>
                        </Link>
                      )}

                      {(isProfesor || isDirector) && (
                        <>
                          <Link href={`/tests-vocacionales/${test.id}`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </Button>
                          </Link>
                          <Link href={`/tests-vocacionales/${test.id}/editar`} className="flex-1">
                            <Button variant="outline" className="w-full">
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleDelete(test.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
