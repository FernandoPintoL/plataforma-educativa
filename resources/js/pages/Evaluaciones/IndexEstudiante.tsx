import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, CheckCircle2, Clock, BookOpen } from 'lucide-react';

interface Evaluacion {
  id: number;
  tipo_evaluacion: string;
  puntuacion_total: number;
  mi_trabajo?: {
    id: number;
    estado: string;
    calificacion?: { puntaje: number; };
  };
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
  filters: { curso_id?: number; search?: string; };
}

export default function IndexEstudiante({ evaluaciones, cursos, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [cursoId, setCursoId] = useState(filters.curso_id?.toString() || '');

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (cursoId) params.append('curso_id', cursoId);
    router.get('/evaluaciones?' + params.toString());
  };

  const getEstadoBadge = (evaluacion: Evaluacion) => {
    if (evaluacion.mi_trabajo) {
      if (evaluacion.mi_trabajo.estado === 'calificado') {
        return { variant: 'default' as const, label: 'Calificado', icon: CheckCircle2 };
      }
      return { variant: 'secondary' as const, label: 'En Progreso', icon: Clock };
    }
    return { variant: 'outline' as const, label: 'Disponible', icon: PlayCircle };
  };

  const getPuntajeDisplay = (evaluacion: Evaluacion) => {
    if (evaluacion.mi_trabajo?.calificacion) {
      return evaluacion.mi_trabajo.calificacion.puntaje + '/' + evaluacion.puntuacion_total;
    }
    return '-';
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mis Evaluaciones</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Revisa tus evaluaciones disponibles y consulta tus resultados
            </p>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">Filtros</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input placeholder="Buscar evaluacion..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleFilter()} />
              <Select value={cursoId} onValueChange={setCursoId}>
                <SelectTrigger><SelectValue placeholder="Todos los cursos" /></SelectTrigger>
                <SelectContent>
                  {cursos.map((curso) => (<SelectItem key={curso.id} value={curso.id.toString()}>{curso.nombre}</SelectItem>))}
                </SelectContent>
              </Select>
              <Button onClick={handleFilter}>Filtrar</Button>
            </div>
          </CardContent>
        </Card>

        {evaluaciones.data.length === 0 ? (
          <Card><CardContent className="pt-6 text-center"><BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">No hay evaluaciones disponibles</p></CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {evaluaciones.data.map((evaluacion) => {
              const badgeConfig = getEstadoBadge(evaluacion);
              const IconComponent = badgeConfig.icon;
              return (
                <Card key={evaluacion.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{evaluacion.contenido.titulo}</h3>
                          <p className="mt-1 text-sm text-gray-600">{evaluacion.contenido.descripcion}</p>
                        </div>
                        <Badge variant={badgeConfig.variant} className="ml-2 flex items-center gap-1"><IconComponent className="h-3 w-3" />{badgeConfig.label}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">Curso:</span><p className="font-medium">{evaluacion.contenido.curso.nombre}</p></div>
                        <div><span className="text-gray-500">Puntuacion:</span><p className="font-medium">{getPuntajeDisplay(evaluacion)}</p></div>
                        <div><span className="text-gray-500">Preguntas:</span><p className="font-medium">{evaluacion.preguntas.length}</p></div>
                        <div><span className="text-gray-500">Tipo:</span><p className="font-medium capitalize">{evaluacion.tipo_evaluacion}</p></div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        {evaluacion.mi_trabajo ? (
                          <Link href={'/evaluaciones/' + evaluacion.id + '/results'} className="flex-1"><Button className="w-full" variant="outline">Ver Resultado</Button></Link>
                        ) : (
                          <Link href={'/evaluaciones/' + evaluacion.id + '/take'} className="flex-1"><Button className="w-full"><PlayCircle className="mr-2 h-4 w-4" />Realizar Evaluacion</Button></Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}