import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
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
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AcademicCapIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Estudiante {
  id: number;
  name: string;
  apellido?: string;
}

interface Calificacion {
  id: number;
  puntaje: number;
  comentario: string;
}

interface Trabajo {
  id: number;
  estado: 'en_progreso' | 'entregado' | 'calificado' | 'devuelto';
  fecha_entrega: string | null;
  fecha_inicio: string;
  comentarios: string;
  estudiante: Estudiante;
  calificacion?: Calificacion;
  contenido: {
    id: number;
    titulo: string;
    curso: {
      id: number;
      nombre: string;
      codigo: string;
    };
    tarea: {
      id: number;
      puntuacion: number;
    };
  };
}

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Props {
  trabajos: {
    data: Trabajo[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  cursos: Curso[];
  filters: {
    estado?: string;
    curso_id?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Trabajos',
    href: '/trabajos',
  },
];

export default function Index({ trabajos, cursos, filters }: Props) {
  const [estado, setEstado] = useState(filters.estado || 'all');
  const [cursoId, setCursoId] = useState(filters.curso_id || 'all');

  const handleFilter = () => {
    router.get(
      '/trabajos',
      {
        estado: estado === 'all' ? '' : estado,
        curso_id: cursoId === 'all' ? '' : cursoId,
      },
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  const clearFilters = () => {
    setEstado('all');
    setCursoId('all');
    router.get('/trabajos');
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: any; label: string; icon: any }> = {
      en_progreso: { variant: 'secondary', label: 'En Progreso', icon: ClockIcon },
      entregado: { variant: 'default', label: 'Entregado', icon: CheckCircleIcon },
      calificado: { variant: 'outline', label: 'Calificado', icon: CheckCircleIcon },
      devuelto: { variant: 'destructive', label: 'Devuelto', icon: XCircleIcon },
    };

    const config = variants[estado] || variants.en_progreso;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'No entregado';
    try {
      return format(new Date(fecha), "d 'de' MMM, yyyy HH:mm", { locale: es });
    } catch {
      return fecha;
    }
  };

  const getCalificacionBadge = (trabajo: Trabajo) => {
    if (!trabajo.calificacion) return null;

    const porcentaje = (trabajo.calificacion.puntaje / trabajo.contenido.tarea.puntuacion) * 100;
    let variant: 'default' | 'secondary' | 'destructive' = 'default';

    if (porcentaje < 60) variant = 'destructive';
    else if (porcentaje < 80) variant = 'secondary';

    return (
      <Badge variant={variant}>
        {trabajo.calificacion.puntaje} / {trabajo.contenido.tarea.puntuacion}
      </Badge>
    );
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <AcademicCapIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Trabajos</h1>
              <p className="text-muted-foreground">
                Visualiza y gestiona los trabajos entregados
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
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="entregado">Entregado</SelectItem>
                  <SelectItem value="calificado">Calificado</SelectItem>
                  <SelectItem value="devuelto">Devuelto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleFilter} size="sm">
                Aplicar Filtros
              </Button>
              <Button onClick={clearFilters} size="sm" variant="outline">
                Limpiar
              </Button>
            </div>
          </div>
        </div>

        {/* Tabla de Trabajos */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarea</TableHead>
                <TableHead>Estudiante</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Entrega</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trabajos.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay trabajos disponibles</p>
                  </TableCell>
                </TableRow>
              ) : (
                trabajos.data.map((trabajo) => (
                  <TableRow key={trabajo.id}>
                    <TableCell>
                      <Link
                        href={`/trabajos/${trabajo.id}`}
                        className="font-medium hover:underline"
                      >
                        {trabajo.contenido.titulo}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">
                          {trabajo.estudiante.name} {trabajo.estudiante.apellido || ''}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{trabajo.contenido.curso.nombre}</div>
                        <div className="text-muted-foreground">{trabajo.contenido.curso.codigo}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(trabajo.estado)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{formatFecha(trabajo.fecha_entrega)}</div>
                    </TableCell>
                    <TableCell>
                      {trabajo.calificacion ? (
                        getCalificacionBadge(trabajo)
                      ) : trabajo.estado === 'entregado' ? (
                        <Badge variant="secondary">Pendiente</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/trabajos/${trabajo.id}`}>
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                        </Link>
                        {trabajo.estado === 'entregado' && !trabajo.calificacion && (
                          <Link href={`/trabajos/${trabajo.id}/calificar`}>
                            <Button size="sm">
                              Calificar
                            </Button>
                          </Link>
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
        {trabajos.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(trabajos.current_page - 1) * trabajos.per_page + 1} a{' '}
              {Math.min(trabajos.current_page * trabajos.per_page, trabajos.total)} de {trabajos.total}{' '}
              trabajos
            </p>
            <div className="flex gap-2">
              {Array.from({ length: trabajos.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === trabajos.current_page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    router.get('/trabajos', { ...filters, page })
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
