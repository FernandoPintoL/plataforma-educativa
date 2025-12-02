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
  ClockIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Tarea {
  id: number;
  instrucciones: string;
  puntuacion: number;
  fecha_limite: string;
  contenido: {
    id: number;
    titulo: string;
    descripcion: string;
    estado: 'borrador' | 'publicado' | 'finalizado';
    fecha_creacion: string;
    curso: {
      id: number;
      nombre: string;
      codigo: string;
    };
  };
  trabajos_count?: number;
}

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Props {
  tareas: {
    data: Tarea[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  cursos: Curso[];
  filters: {
    curso_id?: string;
    estado?: string;
    search?: string;
  };
  userRole: 'profesor' | 'estudiante' | 'otro';
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tareas',
    href: '/tareas',
  },
];

export default function Index({ tareas, cursos, filters, userRole }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [cursoId, setCursoId] = useState(filters.curso_id || 'all');
  const [estado, setEstado] = useState(filters.estado || 'all');
  const esProfesor = userRole === 'profesor';

  const handleFilter = () => {
    router.get(
      '/tareas',
      {
        search,
        curso_id: cursoId === 'all' ? '' : cursoId,
        estado: estado === 'all' ? '' : estado,
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
    router.get('/tareas');
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      borrador: { variant: 'secondary', label: 'Borrador' },
      publicado: { variant: 'default', label: 'Publicado' },
      finalizado: { variant: 'outline', label: 'Finalizado' },
    };

    const config = variants[estado] || variants.borrador;

    return (
      <Badge variant={config.variant as any}>{config.label}</Badge>
    );
  };

  const formatFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  const estaVencida = (fecha_limite: string) => {
    return new Date(fecha_limite) < new Date();
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
                <h1 className="text-3xl font-bold">Tareas</h1>
                <p className="text-muted-foreground">
                  Gestiona y visualiza todas las tareas
                </p>
              </div>
            </div>
            <Link href="/tareas/create">
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Nueva Tarea
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
                  placeholder="Buscar por título o instrucciones..."
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

        {/* Tabla de Tareas */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Puntuación</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tareas.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <DocumentTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No hay tareas disponibles</p>
                  </TableCell>
                </TableRow>
              ) : (
                tareas.data.map((tarea) => (
                  <TableRow key={tarea.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/tareas/${tarea.id}`}
                          className="font-medium hover:underline"
                        >
                          {tarea.contenido.titulo}
                        </Link>
                        {tarea.contenido.descripcion && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {tarea.contenido.descripcion}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{tarea.contenido.curso.nombre}</div>
                        <div className="text-muted-foreground">{tarea.contenido.curso.codigo}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(tarea.contenido.estado)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tarea.puntuacion} pts</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span className={estaVencida(tarea.fecha_limite) ? 'text-red-500' : ''}>
                          {formatFecha(tarea.fecha_limite)}
                        </span>
                      </div>
                      {estaVencida(tarea.fecha_limite) && (
                        <Badge variant="destructive" className="mt-1">
                          Vencida
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/tareas/${tarea.id}`}>
                          <Button size="sm" variant="outline">
                            Ver
                          </Button>
                        </Link>
                        {esProfesor && (
                          <Link href={`/tareas/${tarea.id}/edit`}>
                            <Button size="sm" variant="ghost">
                              Editar
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
        {tareas.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {(tareas.current_page - 1) * tareas.per_page + 1} a{' '}
              {Math.min(tareas.current_page * tareas.per_page, tareas.total)} de {tareas.total}{' '}
              tareas
            </p>
            <div className="flex gap-2">
              {Array.from({ length: tareas.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === tareas.current_page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    router.get('/tareas', { ...filters, page })
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
