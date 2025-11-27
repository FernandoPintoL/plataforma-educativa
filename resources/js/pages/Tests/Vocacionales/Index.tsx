import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
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
  Search,
  X,
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

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all');

  // Filtered tests
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        test.nombre.toLowerCase().includes(searchLower) ||
        test.descripcion?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter === 'activo' && !test.activo) return false;
      if (statusFilter === 'inactivo' && test.activo) return false;

      return true;
    });
  }, [tests, searchQuery, statusFilter]);

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

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o descripción..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="activo">Solo activos</SelectItem>
                  <SelectItem value="inactivo">Solo inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery || statusFilter !== 'all') && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Filtros aplicados: {filteredTests.length} de {tests.length} tests</span>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tests Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTests.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {filteredTests.length === tests.length
                  ? 'Listos para resolver'
                  : `de ${tests.length} tests`}
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
          {filteredTests.length === 0 ? (
            <Card className="lg:col-span-2">
              <CardContent className="pt-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {tests.length === 0
                      ? 'No hay tests disponibles'
                      : 'No coinciden con los filtros'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {tests.length === 0
                      ? canCreate
                        ? 'Crea el primer test vocacional para empezar'
                        : 'Pronto habrá tests vocacionales disponibles'
                      : 'Intenta ajustar los filtros de búsqueda'}
                  </p>
                  {canCreate && tests.length === 0 && (
                    <Link href="/tests-vocacionales/crear">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primer Test
                      </Button>
                    </Link>
                  )}
                  {tests.length > 0 && filteredTests.length === 0 && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredTests.map((test) => (
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
