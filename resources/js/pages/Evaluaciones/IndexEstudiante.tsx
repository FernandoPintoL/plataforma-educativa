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
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  ArrowRightIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Calificacion {
  id: number;
  puntaje: number;
}

interface Trabajo {
  id: number;
  estado: string;
  fecha_entrega: string;
  calificacion?: Calificacion;
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
  mi_trabajo?: Trabajo;
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
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Mis Evaluaciones',
    href: '/evaluaciones',
  },
];

export default function IndexEstudiante({ evaluaciones, cursos, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [cursoId, setCursoId] = useState(filters.curso_id || 'all');

  const handleFilter = () => {
    router.get(
      '/evaluaciones',
      {
        search,
        curso_id: cursoId === 'all' ? '' : cursoId,
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
    router.get('/evaluaciones');
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'Sin límite';
    try {
      return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  const getEstadoBadge = (trabajo?: Trabajo) => {
    if (!trabajo) {
      return { variant: 'outline' as const, label: 'Sin intentar', icon: 'clock' };
    }
    if (trabajo.estado === 'entregado' || trabajo.estado === 'calificado') {
      if (trabajo.calificacion) {
        return { variant: 'default' as const, label: 'Completada', icon: 'check' };
      }
      return { variant: 'outline' as const, label: 'En revisión', icon: 'eye' };
    }
    return { variant: 'secondary' as const, label: 'En progreso', icon: 'clock' };
  };

  const estaVencida = (fecha_limite: string | null) => {
    if (!fecha_limite) return false;
    return new Date(fecha_limite) < new Date();
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

  const estadosBadge = (trabajo?: Trabajo) => {
    const estado = getEstadoBadge(trabajo);
    return <Badge variant={estado.variant}>{estado.label}</Badge>;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Mis Evaluaciones</h1>
              <p className="text-muted-foreground">
                Revisa y participa en las evaluaciones disponibles de tus cursos
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-lg border p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Tabla de Evaluaciones para Estudiante */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evaluación</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Puntuación Total</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluaciones.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay evaluaciones disponibles en tus cursos</p>
                  </TableCell>
                </TableRow>
              ) : (
                evaluaciones.data.map((evaluacion) => {
                  const tipoBadge = getTipoEvaluacionBadge(evaluacion.tipo_evaluacion);
                  const vencida = estaVencida(evaluacion.contenido.fecha_limite);

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
                        <div className="font-semibold">{evaluacion.puntuacion_total} pts</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className={vencida ? 'text-red-500 font-medium' : ''}>
                            {formatFecha(evaluacion.contenido.fecha_limite)}
                          </span>
                          {vencida && (
                            <Badge variant="destructive" className="text-xs">
                              Vencida
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {estadosBadge(evaluacion.mi_trabajo)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {!evaluacion.mi_trabajo ? (
                            <Link href={`/evaluaciones/${evaluacion.id}/take`}>
                              <Button size="sm">
                                <ArrowRightIcon className="h-4 w-4 mr-2" />
                                Tomar Evaluación
                              </Button>
                            </Link>
                          ) : evaluacion.mi_trabajo.estado === 'calificado' ? (
                            <Link href={`/evaluaciones/${evaluacion.id}/results`}>
                              <Button size="sm" variant="outline">
                                <EyeIcon className="h-4 w-4 mr-2" />
                                Ver Resultado ({evaluacion.mi_trabajo.calificacion?.puntaje || 0})
                              </Button>
                            </Link>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              <ClockIcon className="h-4 w-4 mr-2" />
                              En revisión
                            </Button>
                          )}
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
