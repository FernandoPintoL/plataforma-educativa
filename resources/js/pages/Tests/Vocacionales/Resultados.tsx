import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import AgentSynthesis from '../../../components/VocationalProfile/AgentSynthesis';
import {
  Award,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Download,
} from 'lucide-react';

interface Resultado {
  id: number;
  test_vocacional_id: number;
  estudiante_id: number;
  respuestas: any;
  fecha_completacion: string;
}

interface Carrera {
  id: number;
  nombre: string;
  descripcion: string;
  match_percentage: number;
}

interface PerfilVocacional {
  id: number;
  estudiante_id: number;
  test_id?: number;
  carrera_predicha_ml?: string;
  confianza_prediccion?: number;
  cluster_aptitud?: number;
  probabilidad_cluster?: number;
  prediccion_detalles?: any;
  recomendaciones_personalizadas?: any;
  carreras_recomendadas?: Carrera[];
  fortalezas?: string[];
  areas_interes?: string[];
  nivel_confianza?: number;
  intereses?: Record<string, number>;
  habilidades?: Record<string, number>;
  personalidad?: Record<string, number>;
  aptitudes?: Record<string, number>;
}

interface TestVocacional {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface ResultadosProps {
  test: TestVocacional;
  resultado: Resultado;
  perfil: PerfilVocacional | null;
}

export default function Resultados({ test, resultado, perfil }: ResultadosProps) {
  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Tests Vocacionales', href: '/tests-vocacionales' },
    { label: 'Resultados' },
  ];

  // NUEVO: Parsear respuestas si es string JSON
  const respuestasObjeto = React.useMemo(() => {
    try {
      if (typeof resultado.respuestas === 'string') {
        return JSON.parse(resultado.respuestas);
      }
      return resultado.respuestas || {};
    } catch (err) {
      console.error('Error parsing respuestas:', err);
      return {};
    }
  }, [resultado.respuestas]);

  const respuestasCount = Object.keys(respuestasObjeto).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfianzaColor = (nivel: number) => {
    if (nivel >= 80) return 'text-green-600 dark:text-green-400';
    if (nivel >= 60) return 'text-blue-600 dark:text-blue-400';
    if (nivel >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getConfianzaBg = (nivel: number) => {
    if (nivel >= 80) return 'bg-green-100 dark:bg-green-950';
    if (nivel >= 60) return 'bg-blue-100 dark:bg-blue-950';
    if (nivel >= 40) return 'bg-yellow-100 dark:bg-yellow-950';
    return 'bg-orange-100 dark:bg-orange-950';
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Resultados: ${test.nombre}`} />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                ¡Test Completado!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Tus resultados de {test.nombre}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Descargar Resultados
            </Button>
          </div>

          {/* Información del Test */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fecha de completación
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {formatDate(resultado.fecha_completacion)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Test completado
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {test.nombre}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Preguntas respondidas
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white mt-1">
                    {respuestasCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estado
                  </p>
                  <Badge className="mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completado
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resultado Principal */}
        {perfil ? (
          <div className="space-y-6">
            {/* Carrera Predicha por ML */}
            {perfil.carrera_predicha_ml && (
              <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Award className="w-6 h-6" />
                    Carrera Recomendada
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Basado en análisis de ML (Supervisado + Clustering)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {perfil.carrera_predicha_ml}
                    </h3>
                    {perfil.confianza_prediccion !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            Nivel de Confianza:
                          </span>
                          <span className={`text-2xl font-bold ${getConfianzaColor(Math.round(perfil.confianza_prediccion * 100))}`}>
                            {Math.round(perfil.confianza_prediccion * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              perfil.confianza_prediccion >= 0.8
                                ? 'bg-green-500'
                                : perfil.confianza_prediccion >= 0.6
                                  ? 'bg-blue-500'
                                  : perfil.confianza_prediccion >= 0.4
                                    ? 'bg-yellow-500'
                                    : 'bg-orange-500'
                            }`}
                            style={{ width: `${perfil.confianza_prediccion * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cluster Asignado */}
                  {perfil.cluster_aptitud !== undefined && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Grupo de Aptitud</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {perfil.cluster_aptitud === 0 && 'Bajo Desempeño'}
                            {perfil.cluster_aptitud === 1 && 'Desempeño Medio'}
                            {perfil.cluster_aptitud === 2 && 'Alto Desempeño'}
                          </p>
                        </div>
                        {perfil.probabilidad_cluster !== undefined && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Probabilidad</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                              {Math.round(perfil.probabilidad_cluster * 100)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Top 3 Carreras desde Predicción */}
            {perfil.prediccion_detalles?.carrera_predicha?.top_3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top 3 Carreras Recomendadas
                  </CardTitle>
                  <CardDescription>
                    Ranking basado en compatibilidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {perfil.prediccion_detalles.carrera_predicha.top_3.map((carrera: any) => (
                      <div key={carrera.ranking} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              #{carrera.ranking} - {carrera.carrera}
                            </h4>
                          </div>
                          <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {Math.round((carrera.compatibilidad || 0) * 100)}% match
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                            <span>Compatibilidad</span>
                            <span>Confianza</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: `${(carrera.compatibilidad || 0) * 100}%` }}
                              />
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${(carrera.confianza || 0) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Narrativa Personalizada */}
            {perfil.recomendaciones_personalizadas?.narrativa && (
              <Card className="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Análisis Personalizado
                  </CardTitle>
                  <CardDescription>
                    {perfil.recomendaciones_personalizadas.sintesis_tipo === 'groq'
                      ? 'Generado con IA (Groq)'
                      : 'Análisis automático'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {perfil.recomendaciones_personalizadas.narrativa}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Recomendaciones */}
            {perfil.recomendaciones_personalizadas?.recomendaciones &&
             perfil.recomendaciones_personalizadas.recomendaciones.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Recomendaciones Personalizadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {perfil.recomendaciones_personalizadas.recomendaciones.map((rec: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Pasos Siguientes */}
            {perfil.recomendaciones_personalizadas?.pasos_siguientes &&
             perfil.recomendaciones_personalizadas.pasos_siguientes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Pasos Siguientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {perfil.recomendaciones_personalizadas.pasos_siguientes.map((paso: string, idx: number) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 pt-0.5">{paso}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Carreras Recomendadas */}
            {perfil.carreras_recomendadas &&
              perfil.carreras_recomendadas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Carreras Recomendadas
                    </CardTitle>
                    <CardDescription>
                      Basado en tus respuestas, estas carreras podrían ser
                      ideales para ti
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {perfil.carreras_recomendadas.map((carrera, index) => (
                        <div
                          key={carrera.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {index + 1}. {carrera.nombre}
                              </h3>
                              {carrera.descripcion && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {carrera.descripcion}
                                </p>
                              )}
                            </div>
                            <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {carrera.match_percentage}% match
                            </Badge>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-blue-500"
                                style={{
                                  width: `${carrera.match_percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Fortalezas */}
            {perfil.fortalezas && perfil.fortalezas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Tus Fortalezas
                  </CardTitle>
                  <CardDescription>
                    Habilidades y aptitudes destacadas identificadas
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {perfil.fortalezas.map((fortaleza, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {fortaleza}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Áreas de Interés */}
            {perfil.areas_interes && perfil.areas_interes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Áreas de Interés
                  </CardTitle>
                  <CardDescription>
                    Áreas profesionales que se alinean con tu perfil
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {perfil.areas_interes.map((area, index) => (
                      <Badge
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agent Synthesis - Análisis Inteligente */}
            <AgentSynthesis triggerLoad={true} />
          </div>
        ) : (
          <Card>
            <CardContent className="pt-10">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Análisis en Progreso
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Tu perfil vocacional se está generando. Vuelve más tarde
                  para ver tus resultados completos.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-lg">Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Basado en tus resultados, te recomendamos:
            </p>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span>
                  Consulta con un orientador académico para explorar más sobre
                  las carreras recomendadas
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span>
                  Realiza investigación sobre las instituciones que ofrecen
                  estas carreras
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                <span>
                  Considera completar otros tests para confirmar tu orientación
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/tests-vocacionales">
            <Button className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Ver Otros Tests
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline">Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
