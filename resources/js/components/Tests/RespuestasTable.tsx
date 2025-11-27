import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Eye, Download } from 'lucide-react';
import RespuestaDetalleModal from './RespuestaDetalleModal';

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
}

interface PerfilVocacional {
  carrera_predicha_ml: string;
  confianza_prediccion: number;
  cluster_aptitud: number;
}

interface Respuesta {
  id: number;
  estudiante: Estudiante;
  fecha_completacion: string | null;
  estado: string;
  preguntas_respondidas: number;
  total_preguntas: number;
  tasa_completacion: number;
  perfil_vocacional: PerfilVocacional | null;
}

interface RespuestasTableProps {
  testId: number;
  testNombre: string;
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export default function RespuestasTable({
  testId,
  testNombre,
}: RespuestasTableProps) {
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [selectedRespuesta, setSelectedRespuesta] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    estado: '',
    searchEstudiante: '',
    page: 1,
    per_page: 25,
  });

  useEffect(() => {
    loadRespuestas();
  }, [filters]);

  const loadRespuestas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.estado) params.append('estado', filters.estado);
      if (filters.searchEstudiante) {
        // Note: We filter client-side for student name since API filters by ID
        params.append('page', filters.page.toString());
        params.append('per_page', filters.per_page.toString());
      } else {
        params.append('page', filters.page.toString());
        params.append('per_page', filters.per_page.toString());
      }

      const response = await axios.get(
        `/tests-vocacionales/${testId}/respuestas?${params}`
      );

      let data = response.data.respuestas;

      // Client-side filter for student name
      if (filters.searchEstudiante) {
        data = data.filter((r: Respuesta) =>
          r.estudiante.nombre
            .toLowerCase()
            .includes(filters.searchEstudiante.toLowerCase())
        );
      }

      setRespuestas(data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error al cargar respuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const response = await axios.get(
        `/tests-vocacionales/${testId}/respuestas/export?format=${format}`,
        { responseType: format === 'csv' ? 'text' : 'json' }
      );

      const element = document.createElement('a');
      const file = new Blob([response.data], {
        type:
          format === 'csv'
            ? 'text/csv;charset=utf-8'
            : 'application/json;charset=utf-8',
      });
      element.href = URL.createObjectURL(file);
      element.download = `respuestas-${testId}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const getClusterLabel = (cluster?: number) => {
    switch (cluster) {
      case 0:
        return 'Bajo Desempeño';
      case 1:
        return 'Desempeño Medio';
      case 2:
        return 'Alto Desempeño';
      default:
        return '-';
    }
  };

  const getEstadoBadge = (estado: string) => {
    return estado === 'completado'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
        <div className="flex-1 min-w-0">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Buscar Estudiante
          </label>
          <Input
            placeholder="Nombre del estudiante..."
            value={filters.searchEstudiante}
            onChange={(e) =>
              setFilters({ ...filters, searchEstudiante: e.target.value, page: 1 })
            }
          />
        </div>

        <div className="w-full sm:w-40">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Estado
          </label>
          <Select
            value={filters.estado}
            onValueChange={(value) =>
              setFilters({ ...filters, estado: value, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('json')}
          >
            <Download className="w-4 h-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Table */}
      {respuestas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            No hay respuestas que mostrar
          </p>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Carrera Predicha</TableHead>
                  <TableHead>Confianza</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {respuestas.map((respuesta) => (
                  <TableRow key={respuesta.id}>
                    <TableCell className="font-medium">
                      {respuesta.estudiante.nombre}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {respuesta.estudiante.email}
                    </TableCell>
                    <TableCell className="text-sm">
                      {respuesta.fecha_completacion
                        ? new Date(
                            respuesta.fecha_completacion
                          ).toLocaleDateString('es-ES')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoBadge(respuesta.estado)}>
                        {respuesta.estado === 'completado'
                          ? 'Completado'
                          : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-green-600 h-2 rounded-full dark:bg-green-500 transition-all"
                            style={{
                              width: `${respuesta.tasa_completacion}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {respuesta.tasa_completacion}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {respuesta.perfil_vocacional?.carrera_predicha_ml || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {respuesta.perfil_vocacional?.confianza_prediccion
                        ? `${Math.round(
                            respuesta.perfil_vocacional
                              .confianza_prediccion * 100
                          )}%`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSelectedRespuesta(respuesta.id)
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando {pagination.from} a {pagination.to} de{' '}
                {pagination.total} resultados
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: Math.max(1, filters.page - 1),
                    })
                  }
                  disabled={filters.page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: Math.min(
                        pagination.last_page,
                        filters.page + 1
                      ),
                    })
                  }
                  disabled={filters.page === pagination.last_page}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {selectedRespuesta !== null && (
        <RespuestaDetalleModal
          testId={testId}
          respuestaId={selectedRespuesta}
          onClose={() => setSelectedRespuesta(null)}
        />
      )}
    </div>
  );
}
