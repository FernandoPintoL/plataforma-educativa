import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X, CheckCircle, XCircle } from 'lucide-react';

interface Pregunta {
  id: number;
  enunciado: string;
  tipo: string;
  opciones: string[];
  respuesta_estudiante: string | null;
  respondida: boolean;
}

interface Categoria {
  categoria_id: number;
  categoria_nombre: string;
  preguntas: Pregunta[];
}

interface PerfilVocacional {
  id: number;
  carrera_predicha_ml: string;
  confianza_prediccion: number;
  cluster_aptitud: number;
  probabilidad_cluster: number;
  recomendaciones_personalizadas: Record<string, any>;
}

interface ResultadoDetalle {
  id: number;
  estudiante: {
    id: number;
    nombre: string;
    email: string;
  };
  test_id: number;
  test_nombre: string;
  fecha_completacion: string | null;
  tiempo_total_minutos: number | null;
  respuestas_detalladas: Categoria[];
  puntajes_por_categoria: Record<string, number>;
  perfil_vocacional: PerfilVocacional | null;
}

interface RespuestaDetalleModalProps {
  testId: number;
  respuestaId: number;
  onClose: () => void;
}

export default function RespuestaDetalleModal({
  testId,
  respuestaId,
  onClose,
}: RespuestaDetalleModalProps) {
  const [resultado, setResultado] = useState<ResultadoDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDetalle();
  }, [respuestaId]);

  const loadDetalle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `/tests-vocacionales/${testId}/respuestas/${respuestaId}`
      );
      setResultado(response.data.resultado);
    } catch (err) {
      setError('Error al cargar los detalles de la respuesta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getClusterBadge = (cluster?: number) => {
    switch (cluster) {
      case 0:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 1:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 2:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : resultado ? (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>{resultado.test_nombre}</DialogTitle>
              <DialogDescription>
                Respuestas de {resultado.estudiante.nombre}
              </DialogDescription>
            </DialogHeader>

            {/* Estudiante Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Estudiante
                    </p>
                    <p className="font-medium">
                      {resultado.estudiante.nombre}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-sm break-all">
                      {resultado.estudiante.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Fecha Completación
                    </p>
                    <p className="font-medium">
                      {resultado.fecha_completacion
                        ? new Date(
                            resultado.fecha_completacion
                          ).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tiempo Total
                    </p>
                    <p className="font-medium">
                      {resultado.tiempo_total_minutos
                        ? `${resultado.tiempo_total_minutos} min`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ML Predictions */}
            {resultado.perfil_vocacional && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Predicción ML - Perfil Vocacional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Carrera Predicha
                      </p>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {resultado.perfil_vocacional.carrera_predicha_ml}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Confianza
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="bg-green-600 h-2 rounded-full dark:bg-green-500"
                            style={{
                              width: `${
                                resultado.perfil_vocacional
                                  .confianza_prediccion * 100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round(
                            resultado.perfil_vocacional
                              .confianza_prediccion * 100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Cluster Aptitud
                      </p>
                      <Badge
                        className={getClusterBadge(
                          resultado.perfil_vocacional.cluster_aptitud
                        )}
                      >
                        {getClusterLabel(
                          resultado.perfil_vocacional.cluster_aptitud
                        )}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Prob. Cluster
                      </p>
                      <p className="font-medium">
                        {Math.round(
                          resultado.perfil_vocacional.probabilidad_cluster * 100
                        )}
                        %
                      </p>
                    </div>
                  </div>

                  {/* Recomendaciones */}
                  {Object.keys(resultado.perfil_vocacional.recomendaciones_personalizadas || {}).length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2">
                        Recomendaciones Personalizadas
                      </p>
                      <ul className="space-y-2">
                        {Object.entries(
                          resultado.perfil_vocacional
                            .recomendaciones_personalizadas || {}
                        ).map(([key, value]) => (
                          <li
                            key={key}
                            className="text-sm text-gray-700 dark:text-gray-300 flex gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{value as string}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Respuestas Detalladas */}
            <div className="space-y-4">
              <h3 className="font-semibold">Respuestas por Categoría</h3>
              {resultado.respuestas_detalladas.map((categoria) => (
                <Card key={categoria.categoria_id}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {categoria.categoria_nombre}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoria.preguntas.map((pregunta, idx) => (
                      <div
                        key={pregunta.id}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm">
                            {idx + 1}. {pregunta.enunciado}
                          </p>
                          {pregunta.respondida ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                          )}
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {pregunta.tipo}
                        </Badge>

                        {pregunta.opciones && pregunta.opciones.length > 0 && (
                          <div className="ml-2 space-y-1">
                            {pregunta.opciones.map((opcion, optIdx) => {
                              const isSelected =
                                pregunta.respuesta_estudiante ===
                                opcion;
                              return (
                                <div
                                  key={optIdx}
                                  className={`text-sm p-2 rounded ${
                                    isSelected
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 border border-blue-300'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}
                                >
                                  • {opcion}
                                  {isSelected && (
                                    <span className="ml-2 font-semibold">
                                      (Respuesta)
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {!pregunta.respondida && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">
                            No respondida
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
