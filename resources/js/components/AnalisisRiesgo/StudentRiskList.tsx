import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Input } from '../ui/input';
import { AlertTriangle, AlertCircle, CheckCircle, Eye, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import type { PrediccionRiesgo, PrediccionTendencia, NivelRiesgo } from '@/types/analisis-riesgo';

interface StudentRiskListProps {
  predicciones: PrediccionRiesgo[];
  tendencias?: Record<number, PrediccionTendencia>;
  onViewDetail?: (estudianteId: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function StudentRiskList({
  predicciones,
  tendencias = {},
  onViewDetail,
  isLoading = false,
  emptyMessage = 'No hay estudiantes con predicciones de riesgo',
}: StudentRiskListProps) {
  const [search, setSearch] = useState('');
  const [filtroNivel, setFiltroNivel] = useState<NivelRiesgo | 'todos'>('todos');

  // Filtrar datos
  const datosFiltrados = predicciones.filter((p) => {
    const matchSearch =
      !search ||
      p.estudiante?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.estudiante?.email?.toLowerCase().includes(search.toLowerCase());

    const matchFiltro = filtroNivel === 'todos' || (p.nivel_riesgo || 'bajo') === filtroNivel;

    return matchSearch && matchFiltro;
  });

  const getIconoRiesgo = (nivel: NivelRiesgo) => {
    switch (nivel) {
      case 'alto':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medio':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'bajo':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const getColorBadge = (nivel: NivelRiesgo) => {
    switch (nivel) {
      case 'alto':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'bajo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getColorFila = (nivel: NivelRiesgo) => {
    switch (nivel) {
      case 'alto':
        return 'hover:bg-red-50 dark:hover:bg-red-950/20';
      case 'medio':
        return 'hover:bg-yellow-50 dark:hover:bg-yellow-950/20';
      case 'bajo':
        return 'hover:bg-green-50 dark:hover:bg-green-950/20';
    }
  };

  const getIconoTendencia = (tendencia: string) => {
    switch (tendencia) {
      case 'mejorando':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declinando':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'estable':
        return <Minus className="w-4 h-4 text-blue-600" />;
      case 'fluctuando':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getTendenciaLabel = (tendencia: string) => {
    switch (tendencia) {
      case 'mejorando':
        return 'Mejorando';
      case 'declinando':
        return 'Declinando';
      case 'estable':
        return 'Estable';
      case 'fluctuando':
        return 'Fluctuando';
      default:
        return '—';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-10">
          <div className="text-center text-gray-500">
            Cargando datos...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (predicciones.length === 0) {
    return (
      <Card>
        <CardContent className="pt-10">
          <div className="text-center text-gray-500">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estudiantes Analizados</CardTitle>
        <CardDescription>
          Total: {predicciones.length} estudiantes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />

          <div className="flex gap-2">
            {(['todos', 'alto', 'medio', 'bajo'] as const).map((nivel) => (
              <Button
                key={nivel}
                variant={filtroNivel === nivel ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFiltroNivel(nivel)}
              >
                {nivel === 'todos' ? 'Todos' : nivel.charAt(0).toUpperCase() + nivel.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Riesgo</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Confianza</TableHead>
                <TableHead>Tendencia</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {datosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No hay resultados que coincidan con los filtros
                  </TableCell>
                </TableRow>
              ) : (
                datosFiltrados.map((pred) => {
                  const tendencia = tendencias[pred.estudiante_id];
                  const percentage = Math.round(pred.score_riesgo * 100);
                  const nivel = pred.nivel_riesgo || 'bajo';

                  return (
                    <TableRow key={pred.id} className={`${getColorFila(nivel)} transition-colors`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pred.estudiante?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{pred.estudiante?.email || 'N/A'}</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={`${getColorBadge(nivel)} flex items-center gap-1 w-fit`}>
                          {getIconoRiesgo(nivel)}
                          {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-semibold">{percentage}%</p>
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full ${
                                nivel === 'alto'
                                  ? 'bg-red-500'
                                  : nivel === 'medio'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {pred.confianza ? (
                          <span className="text-sm">
                            {Math.round(pred.confianza * 100)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {tendencia ? (
                          <div className="flex items-center gap-1">
                            {getIconoTendencia(tendencia.tendencia)}
                            <span className="text-sm">
                              {getTendenciaLabel(tendencia.tendencia)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(pred.fecha_prediccion).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetail?.(pred.estudiante_id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resumen */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {datosFiltrados.length} de {predicciones.length} estudiantes
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default StudentRiskList;
