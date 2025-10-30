import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Pregunta {
  id: number;
  puntos: number;
}

interface Evaluacion {
  id: number;
  tipo_evaluacion: string;
  puntuacion_total: number;
  tiempo_limite: number | null;
  contenido: {
    id: number;
    titulo: string;
    descripcion: string;
    estado: 'borrador' | 'publicado' | 'finalizado';
    fecha_creacion: string;
    fecha_limite: string | null;
    curso: Curso;
  };
  preguntas: Pregunta[];
}

interface Props {
  evaluaciones: {
    data: Evaluacion[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  cursos: Curso[];
  filters: {
    curso_id?: string;
    estado?: string;
    tipo_evaluacion?: string;
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Gestionar Evaluaciones',
    href: '/evaluaciones',
  },
];

export default function IndexProfesor({ evaluaciones, cursos, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [cursoId, setCursoId] = useState(filters.curso_id || 'all');
  const [estado, setEstado] = useState(filters.estado || 'all');
  const [tipoEvaluacion, setTipoEvaluacion] = useState(filters.tipo_evaluacion || 'all');

  const handleFilter = () => {
    router.get(
      '/evaluaciones',
      {
        search,
        curso_id: cursoId === 'all' ? '' : cursoId,
        estado: estado === 'all' ? '' : estado,
        tipo_evaluacion: tipoEvaluacion === 'all' ? '' : tipoEvaluacion,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const clearFilters = () => {
    setSearch('');
    setCursoId('all');
    setEstado('all');
    setTipoEvaluacion('all');
    router.get('/evaluaciones');
  };

  const handleDelete = (evaluacionId: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
      router.delete(`/evaluaciones/${evaluacionId}`, {
        onSuccess: () => {
          router.get('/evaluaciones', {}, { preserveScroll: true });
        },
      });
    }
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estados: Record<string, { variant: any; label: string }> = {
      borrador: { variant: 'secondary', label: 'Borrador' },
      publicado: { variant: 'default', label: 'Publicado' },
      finalizado: { variant: 'outline', label: 'Finalizado' },
    };
    return estados[estado] || { variant: 'outline', label: estado };
  };

  const getTipoEvaluacionBadge = (tipo: string) => {
    const tipos: Record<string, { label: string; variant: any }> = {
      quiz: { label: 'Quiz', variant: 'secondary' },
      parcial: { label: 'Examen Parcial', variant: 'outline' },
      final: { label: 'Examen Final', variant: 'outline' },
      practica: { label: 'Práctica', variant: 'secondary' },
    };
    return tipos[tipo] || { label: tipo, variant: 'default' };
  };

  const estadoConfig = getEstadoBadge('publicado');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Gestionar Evaluaciones</h1>
                <p className="text-muted-foreground">
                  Crea, edita y administra las evaluaciones de tus cursos
                </p>
              </div>
            </div>
            <Link href="/evaluaciones/create">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Nueva Evaluación
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-lg border p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título o descripción..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Curso */}
            <div>
              <Select value={cursoId} onValueChange={setCursoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los cursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los cursos</SelectItem>
                  {cursos.map((curso) => (
                    <SelectItem key={curso.id} value={curso.id.toString()}>
                      {curso.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Evaluación */}
            <div>
              <Select value={tipoEvaluacion} onValueChange={setTipoEvaluacion}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="parcial">Examen Parcial</SelectItem>
                  <SelectItem value="final">Examen Final</SelectItem>
                  <SelectItem value="practica">Práctica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleFilter} size="sm">
              Aplicar Filtros
            </Button>
            <Button onClick={clearFilters} size="sm" variant="outline">
              Limpiar
            </Button>
          </div>
        </div>

        {/* Tabla de Evaluaciones para Profesor */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evaluación</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Preguntas</TableHead>
                <TableHead className="text-center">Puntuación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluaciones.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay evaluaciones creadas</p>
                    <Link href="/evaluaciones/create" className="mt-4 inline-block">
                      <Button size="sm" variant="outline">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Crear Primera Evaluación
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                evaluaciones.data.map((evaluacion) => {
                  const tipoBadge = getTipoEvaluacionBadge(evaluacion.tipo_evaluacion);
                  const estadoBadge = getEstadoBadge(evaluacion.contenido.estado);

                  return (
                    <TableRow key={evaluacion.id}>
                      <TableCell>
                        <div>
                          <Link
                            href={`/evaluaciones/${evaluacion.id}`}
                            className="font-medium hover:underline"
                          >
                            {evaluacion.contenido.titulo}
                          </Link>
                          {evaluacion.contenido.descripcion && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {evaluacion.contenido.descripcion}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{evaluacion.contenido.curso.nombre}</div>
                          <div className="text-muted-foreground">{evaluacion.contenido.curso.codigo}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tipoBadge.variant}>{tipoBadge.label}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{evaluacion.preguntas.length}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{evaluacion.puntuacion_total} pts</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoBadge.variant}>{estadoBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatFecha(evaluacion.contenido.fecha_creacion)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/evaluaciones/${evaluacion.id}`} title="Ver detalles">
                            <Button size="sm" variant="ghost">
                              <EyeIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/evaluaciones/${evaluacion.id}/edit`} title="Editar">
                            <Button size="sm" variant="outline">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Ver estadísticas"
                          >
                            <ChartBarIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            title="Eliminar"
                            onClick={() => handleDelete(evaluacion.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {evaluaciones.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(evaluaciones.current_page - 1) * evaluaciones.per_page + 1} a{' '}
              {Math.min(evaluaciones.current_page * evaluaciones.per_page, evaluaciones.total)} de{' '}
              {evaluaciones.total} evaluaciones
            </p>
            <div className="flex gap-2">
              {Array.from({ length: evaluaciones.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === evaluaciones.current_page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => router.get('/evaluaciones', { ...filters, page })}
                >
                  {page}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
