import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../../components/Layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
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
  test_id: number;
  carreras_recomendadas: Carrera[];
  fortalezas: string[];
  areas_interes: string[];
  nivel_confianza: number;
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
                    {Object.keys(resultado.respuestas).length}
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
            {/* Nivel de Confianza */}
            <Card className={getConfianzaBg(perfil.nivel_confianza)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Nivel de Confianza
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className={`text-3xl font-bold ${getConfianzaColor(perfil.nivel_confianza)}`}>
                        {perfil.nivel_confianza}%
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {perfil.nivel_confianza >= 80
                          ? 'Muy Confiable'
                          : perfil.nivel_confianza >= 60
                            ? 'Confiable'
                            : perfil.nivel_confianza >= 40
                              ? 'Moderadamente Confiable'
                              : 'En Revisión'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${
                          perfil.nivel_confianza >= 80
                            ? 'bg-green-500'
                            : perfil.nivel_confianza >= 60
                              ? 'bg-blue-500'
                              : perfil.nivel_confianza >= 40
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                        }`}
                        style={{ width: `${perfil.nivel_confianza}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Este nivel indica la precisión de los resultados basada
                    en tu consistencia en las respuestas.
                  </p>
                </div>
              </CardContent>
            </Card>

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
