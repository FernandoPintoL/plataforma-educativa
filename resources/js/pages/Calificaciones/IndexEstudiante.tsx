import React, { useState } from 'react';
import { router } from '@inertiajs/react';
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
  CalendarIcon,
  StarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Calificacion {
  id: number;
  puntaje: number;
  comentario: string;
  fecha_calificacion: string;
  trabajo: {
    id: number;
    estado: string;
    contenido: {
      id: number;
      titulo: string;
      descripcion: string;
      curso: {
        id: number;
        nombre: string;
        codigo: string;
      };
    };
  };
  evaluador?: {
    id: number;
    name: string;
    apellido: string;
  };
}

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Props {
  calificaciones: {
    data: Calificacion[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  cursos: Curso[];
  filters?: {
    curso_id?: string;
    search?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Mis Calificaciones',
    href: '/calificaciones',
  },
];

export default function IndexEstudiante({ calificaciones, cursos, filters = {} }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [cursoId, setCursoId] = useState(filters.curso_id || 'all');

  const handleFilter = () => {
    router.get(
      '/calificaciones',
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
    router.get('/calificaciones');
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  const getPuntajeBadge = (puntaje: number) => {
    if (puntaje >= 90) return { variant: 'default' as const, label: 'Excelente', color: 'bg-green-500' };
    if (puntaje >= 80) return { variant: 'default' as const, label: 'Muy Bien', color: 'bg-blue-500' };
    if (puntaje >= 70) return { variant: 'outline' as const, label: 'Bien', color: 'bg-yellow-500' };
    if (puntaje >= 60) return { variant: 'outline' as const, label: 'Regular', color: 'bg-orange-500' };
    return { variant: 'destructive' as const, label: 'Insuficiente', color: 'bg-red-500' };
  };

  const calcularPromedio = () => {
    if (calificaciones.data.length === 0) return 0;
    const suma = calificaciones.data.reduce((acc, cal) => acc + cal.puntaje, 0);
    return (suma / calificaciones.data.length).toFixed(1);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <StarIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Mis Calificaciones</h1>
              <p className="text-muted-foreground">
                Revisa todas tus calificaciones y desempeño académico
              </p>
            </div>
          </div>

          {/* Estadísticas de Desempeño */}
          {calificaciones.data.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg border p-4">
                <div className="text-sm text-muted-foreground mb-1">Promedio General</div>
                <div className="text-3xl font-bold text-primary">{calcularPromedio()}</div>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <div className="text-sm text-muted-foreground mb-1">Total de Calificaciones</div>
                <div className="text-3xl font-bold">{calificaciones.total}</div>
              </div>
              <div className="bg-card rounded-lg border p-4">
                <div className="text-sm text-muted-foreground mb-1">Última Calificación</div>
                <div className="text-lg font-semibold">
                  {calificaciones.data.length > 0
                    ? `${calificaciones.data[0].puntaje} pts`
                    : 'Sin calificaciones'}
                </div>
              </div>
            </div>
          )}
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
                  placeholder="Buscar por título de tarea o evaluación..."
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

        {/* Tabla de Calificaciones del Estudiante */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarea/Evaluación</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead className="text-center">Puntaje</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Fecha de Calificación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calificaciones.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No tienes calificaciones disponibles aún</p>
                  </TableCell>
                </TableRow>
              ) : (
                calificaciones.data.map((calificacion) => {
                  const puntajeBadgeConfig = getPuntajeBadge(calificacion.puntaje);
                  return (
                    <TableRow key={calificacion.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {calificacion.trabajo.contenido.titulo}
                          </div>
                          {calificacion.trabajo.contenido.descripcion && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {calificacion.trabajo.contenido.descripcion}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {calificacion.trabajo.contenido.curso.nombre}
                          </div>
                          <div className="text-muted-foreground">
                            {calificacion.trabajo.contenido.curso.codigo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`font-bold ${puntajeBadgeConfig.color} text-white rounded px-3 py-1 text-sm`}>
                            {calificacion.puntaje}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {calificacion.evaluador ? (
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {calificacion.evaluador.name} {calificacion.evaluador.apellido}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No asignado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{formatFecha(calificacion.fecha_calificacion)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {calificacion.comentario && (
                          <Button
                            size="sm"
                            variant="outline"
                            title={calificacion.comentario}
                            onClick={() => alert(`Comentario del profesor:\n\n${calificacion.comentario}`)}
                          >
                            Ver Comentario
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {calificaciones.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(calificaciones.current_page - 1) * calificaciones.per_page + 1} a{' '}
              {Math.min(calificaciones.current_page * calificaciones.per_page, calificaciones.total)} de{' '}
              {calificaciones.total} calificaciones
            </p>
            <div className="flex gap-2">
              {Array.from({ length: calificaciones.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === calificaciones.current_page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => router.get('/calificaciones', { ...filters, page })}
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
