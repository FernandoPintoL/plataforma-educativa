import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Pencil, Trash2, MoreVertical } from 'lucide-react';

interface Evaluacion {
  id: number;
  tipo_evaluacion: string;
  puntuacion_total: number;
  contenido: {
    titulo: string;
    descripcion: string;
    estado: string;
    curso: { nombre: string; };
  };
  preguntas: any[];
}

interface Props {
  evaluaciones: { data: Evaluacion[]; links: any; };
  cursos: any[];
  filters: { curso_id?: number; estado?: string; search?: string; };
}

export default function IndexProfesor({ evaluaciones, cursos, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [cursoId, setCursoId] = useState(filters.curso_id?.toString() || '');
  const [estado, setEstado] = useState(filters.estado || '');

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (cursoId) params.append('curso_id', cursoId);
    if (estado) params.append('estado', estado);
    router.get(`/evaluaciones?${params.toString()}`);
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'publicado': 'default' as const,
      'borrador': 'secondary' as const,
      'cerrado': 'destructive' as const,
    };
    return variants[estado as keyof typeof variants] || 'outline' as const;
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
      router.delete(`/evaluaciones/${id}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Evaluaciones</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Gestiona tus evaluaciones y revisa el desempeño de tus estudiantes
            </p>
          </div>
          <Link href="/evaluaciones/create">
            <Button><Plus className="mr-2 h-4 w-4" />Nueva Evaluación</Button>
          </Link>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">Filtros</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleFilter()} />
              <Select value={cursoId} onValueChange={setCursoId}>
                <SelectTrigger><SelectValue placeholder="Todos los cursos" /></SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (<SelectItem key={curso.id} value={curso.id.toString()}>{curso.nombre}</SelectItem>))}
                </SelectContent>
              </Select>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger><SelectValue placeholder="Todos los estados" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="publicado">Publicado</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleFilter}>Filtrar</Button>
            </div>
          </CardContent>
        </Card>

        {evaluaciones.data.length === 0 ? (
          <Card><CardContent className="pt-6 text-center"><p className="text-gray-500">No hay evaluaciones</p></CardContent></Card>
        ) : (
          <div className="grid gap-4">
            {evaluaciones.data.map((evaluacion) => (
              <Card key={evaluacion.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{evaluacion.contenido.titulo}</h3>
                        <Badge variant={getEstadoBadge(evaluacion.contenido.estado)}>{evaluacion.contenido.estado}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{evaluacion.contenido.descripcion}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>📚 {evaluacion.contenido.curso.nombre}</span>
                        <span>❓ {evaluacion.preguntas.length} preguntas</span>
                        <span>⭐ {evaluacion.puntuacion_total} pts</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/evaluaciones/${evaluacion.id}`}><Button variant="outline" size="sm">Ver</Button></Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link href={`/evaluaciones/${evaluacion.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Editar</Link></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(evaluacion.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}