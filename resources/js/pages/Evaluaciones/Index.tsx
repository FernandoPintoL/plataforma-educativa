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
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
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
    estado?: string;
    tipo_evaluacion?: string;
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Evaluaciones',
    href: '/evaluaciones',
  },
];

export default function Index({ evaluaciones, cursos, filters }: Props) {
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

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      borrador: { variant: 'secondary', label: 'Borrador' },
      publicado: { variant: 'default', label: 'Publicado' },
      finalizado: { variant: 'outline', label: 'Finalizado' },
    };

    const config = variants[estado] || variants.borrador;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getTipoEvaluacionBadge = (tipo: string) => {
    const labels: Record<string, string> = {
      examen: 'Examen',
      quiz: 'Quiz',
      parcial: 'Parcial',
      final: 'Final',
      practica: 'Práctica',
    };

    return <Badge variant="outline">{labels[tipo] || tipo}</Badge>;
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'Sin fecha límite';
    try {
      return format(new Date(fecha), "d 'de' MMM, yyyy HH:mm", { locale: es });
    } catch {
      return fecha;
    }
  };

  const estaVencida = (fecha: string | null) => {
    if (!fecha) return false;
    return new Date(fecha) < new Date();
  };

  const getEstadoTrabajo = (evaluacion: Evaluacion) => {
    if (!evaluacion.mi_trabajo) {
      return (
        <Badge variant="secondary">
          Pendiente
        </Badge>
      );
    }

    if (evaluacion.mi_trabajo.calificacion) {
      const porcentaje = (evaluacion.mi_trabajo.calificacion.puntaje / evaluacion.puntuacion_total) * 100;
      return (
        <Badge variant={porcentaje >= 60 ? 'default' : 'destructive'}>
          {evaluacion.mi_trabajo.calificacion.puntaje} / {evaluacion.puntuacion_total}
        </Badge>
      );
    }

    if (evaluacion.mi_trabajo.estado === 'entregado') {
      return <Badge variant="outline">Entregado</Badge>;
    }

    return <Badge variant="secondary">En progreso</Badge>;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Evaluaciones</h1>
                <p className="text-muted-foreground">
                  Gestiona y visualiza todas las evaluaciones
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

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
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

            {/* Tipo */}
            <div>
              <Select value={tipoEvaluacion} onValueChange={setTipoEvaluacion}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="examen">Examen</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="parcial">Parcial</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="practica">Práctica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
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

        {/* Tabla de Evaluaciones */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Preguntas</TableHead>
                <TableHead>Tiempo</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluaciones.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay evaluaciones disponibles</p>
                  </TableCell>
                </TableRow>
              ) : (
                evaluaciones.data.map((evaluacion) => (
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
                    <TableCell>{getTipoEvaluacionBadge(evaluacion.tipo_evaluacion)}</TableCell>
                    <TableCell>{getEstadoBadge(evaluacion.contenido.estado)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {evaluacion.preguntas?.length || 0} preguntas
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {evaluacion.tiempo_limite ? (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{evaluacion.tiempo_limite} min</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin límite</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatFecha(evaluacion.contenido.fecha_limite)}
                      </div>
                      {estaVencida(evaluacion.contenido.fecha_limite) && (
                        <Badge variant="destructive" className="mt-1">
                          Vencida
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{evaluacion.mi_trabajo !== undefined && getEstadoTrabajo(evaluacion)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {evaluacion.mi_trabajo === undefined ? (
                          // Vista de profesor
                          <>
                            <Link href={`/evaluaciones/${evaluacion.id}`}>
                              <Button size="sm" variant="outline">
                                Ver
                              </Button>
                            </Link>
                            <Link href={`/evaluaciones/${evaluacion.id}/edit`}>
                              <Button size="sm" variant="ghost">
                                Editar
                              </Button>
                            </Link>
                          </>
                        ) : (
                          // Vista de estudiante
                          <>
                            {!evaluacion.mi_trabajo ? (
                              <Link href={`/evaluaciones/${evaluacion.id}/take`}>
                                <Button size="sm">
                                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                                  Tomar Evaluación
                                </Button>
                              </Link>
                            ) : (
                              <Link href={`/evaluaciones/${evaluacion.id}/results`}>
                                <Button size="sm" variant="outline">
                                  Ver Resultados
                                </Button>
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {evaluaciones.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(evaluaciones.current_page - 1) * evaluaciones.per_page + 1} a{' '}
              {Math.min(evaluaciones.current_page * evaluaciones.per_page, evaluaciones.total)} de {evaluaciones.total}{' '}
              evaluaciones
            </p>
            <div className="flex gap-2">
              {Array.from({ length: evaluaciones.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === evaluaciones.current_page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    router.get('/evaluaciones', { ...filters, page })
                  }
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
