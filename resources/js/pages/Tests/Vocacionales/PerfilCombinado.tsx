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
  AlertCircle,
  Zap,
  Target,
  Brain,
} from 'lucide-react';

interface Aptitudes {
  habilidades_stem?: number;
  creatividad?: number;
  comunicacion?: number;
  liderazgo?: number;
  promedio_general?: number;
  [key: string]: number | undefined;
}

interface Preferencias {
  ambiente_laboral?: string;
  tipo_tareas?: string;
  valores_profesionales?: string;
  [key: string]: string | undefined;
}

interface RIASEC {
  tipo_principal?: string;
  tipo_secundario?: string;
  descripcion?: string;
  [key: string]: string | undefined;
}

interface PerfilCombinado {
  estudiante: {
    id: number;
    nombre: string;
  };
  aptitudes: Aptitudes;
  preferencias: Preferencias;
  tipo_riasec: RIASEC;
  carrera_recomendada: string;
  carreras_alternativas: string[];
  confianza: string;
  fortalezas: string[];
  oportunidades: string[];
  fecha_generacion: string;
}

interface Progreso {
  test_1_completado: boolean;
  test_2_completado: boolean;
  test_3_completado: boolean;
  todos_completados: boolean;
}

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PerfilCombinadoProps {
  perfil: PerfilCombinado | null;
  progreso: Progreso;
  breadcrumbs?: Breadcrumb[];
}

export default function PerfilCombinado({ perfil, progreso, breadcrumbs }: PerfilCombinadoProps) {
  const defaultBreadcrumbs = breadcrumbs || [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Tests Vocacionales', href: '/tests-vocacionales' },
    { label: 'Mi Perfil Vocacional' },
  ];

  const getConfianzaColor = (confianzaStr: string) => {
    const valor = parseInt(confianzaStr);
    if (valor >= 80) return 'text-green-600 dark:text-green-400';
    if (valor >= 60) return 'text-blue-600 dark:text-blue-400';
    if (valor >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getConfianzaBg = (confianzaStr: string) => {
    const valor = parseInt(confianzaStr);
    if (valor >= 80) return 'bg-green-100 dark:bg-green-950';
    if (valor >= 60) return 'bg-blue-100 dark:bg-blue-950';
    if (valor >= 40) return 'bg-yellow-100 dark:bg-yellow-950';
    return 'bg-orange-100 dark:bg-orange-950';
  };

  const getConfianzaBarColor = (confianzaStr: string) => {
    const valor = parseInt(confianzaStr);
    if (valor >= 80) return 'bg-green-500';
    if (valor >= 60) return 'bg-blue-500';
    if (valor >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout breadcrumbs={defaultBreadcrumbs}>
      <Head title="Mi Perfil Vocacional Combinado" />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Mi Perfil Vocacional
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Análisis combinado de tus 3 tests vocacionales
              </p>
            </div>
          </div>

          {/* Progreso de Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Progreso de Tests
              </CardTitle>
              <CardDescription>
                Estado de completación de los 3 tests vocacionales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Test 1 */}
                <div className={`p-4 border-2 rounded-lg transition-colors ${
                  progreso.test_1_completado
                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Test 1: Explorador
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Aptitudes y habilidades
                      </p>
                    </div>
                    {progreso.test_1_completado && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </div>

                {/* Test 2 */}
                <div className={`p-4 border-2 rounded-lg transition-colors ${
                  progreso.test_2_completado
                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Test 2: Preferencias
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Valores y preferencias
                      </p>
                    </div>
                    {progreso.test_2_completado && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </div>

                {/* Test 3 */}
                <div className={`p-4 border-2 rounded-lg transition-colors ${
                  progreso.test_3_completado
                    ? 'border-green-500 bg-green-50 dark:bg-green-950'
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Test 3: RIASEC
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Tipo vocacional RIASEC
                      </p>
                    </div>
                    {progreso.test_3_completado && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido del Perfil */}
        {perfil ? (
          <div className="space-y-6">
            {/* Carrera Recomendada Principal */}
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Award className="w-6 h-6" />
                  Carrera Recomendada
                </CardTitle>
                <CardDescription className="text-lg">
                  Basado en tu análisis combinado de los 3 tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {perfil.carrera_recomendada}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Nivel de Confianza:
                      </span>
                      <span className={`text-2xl font-bold ${getConfianzaColor(perfil.confianza)}`}>
                        {perfil.confianza}
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all ${getConfianzaBarColor(perfil.confianza)}`}
                        style={{ width: `${perfil.confianza}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Información de Generación */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Perfil generado: {formatDate(perfil.fecha_generacion)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Carreras Alternativas */}
            {perfil.carreras_alternativas && perfil.carreras_alternativas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Carreras Alternativas
                  </CardTitle>
                  <CardDescription>
                    Otras opciones que se alinean con tu perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfil.carreras_alternativas.map((carrera, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {index + 1}. {carrera}
                          </h4>
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            Compatible
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Aptitudes Combinadas */}
            {perfil.aptitudes && Object.keys(perfil.aptitudes).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Aptitudes Combinadas
                  </CardTitle>
                  <CardDescription>
                    Análisis de habilidades desde Test 1 (Explorador)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(perfil.aptitudes).map(([aptitud, valor]) => {
                      if (typeof valor !== 'number') return null;
                      const nombreFormato = aptitud
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase());
                      return (
                        <div key={aptitud}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {nombreFormato}
                            </span>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {valor}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${valor}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preferencias Laborales */}
            {perfil.preferencias && Object.keys(perfil.preferencias).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Preferencias Laborales
                  </CardTitle>
                  <CardDescription>
                    Tus preferencias identificadas en Test 2 (Preferencias)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(perfil.preferencias).map(([preferencia, valor]) => {
                      if (!valor || valor === 'No determinado') return null;
                      const nombreFormato = preferencia
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase());
                      return (
                        <div
                          key={preferencia}
                          className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900"
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {nombreFormato}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {valor}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tipo RIASEC */}
            {perfil.tipo_riasec && (perfil.tipo_riasec.tipo_principal || perfil.tipo_riasec.tipo_secundario) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Tipo Vocacional RIASEC
                  </CardTitle>
                  <CardDescription>
                    Clasificación RIASEC de Test 3 (RIASEC)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Tipo Principal
                    </h4>
                    <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-4 py-2">
                      {perfil.tipo_riasec.tipo_principal || 'No determinado'}
                    </Badge>
                  </div>
                  {perfil.tipo_riasec.tipo_secundario && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Tipo Secundario
                      </h4>
                      <Badge variant="outline">
                        {perfil.tipo_riasec.tipo_secundario}
                      </Badge>
                    </div>
                  )}
                  {perfil.tipo_riasec.descripcion && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {perfil.tipo_riasec.descripcion}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Fortalezas */}
            {perfil.fortalezas && perfil.fortalezas.length > 0 && (
              <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
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
                  <ul className="space-y-2">
                    {perfil.fortalezas.map((fortaleza, idx) => (
                      <li key={idx} className="flex gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{fortaleza}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Oportunidades de Mejora */}
            {perfil.oportunidades && perfil.oportunidades.length > 0 && (
              <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Oportunidades de Mejora
                  </CardTitle>
                  <CardDescription>
                    Áreas en las que puedes desarrollarte más
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {perfil.oportunidades.map((oportunidad, idx) => (
                      <li key={idx} className="flex gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 dark:text-gray-300">{oportunidad}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Agent Synthesis - Análisis Inteligente */}
            <AgentSynthesis triggerLoad={true} />

            {/* Próximos Pasos */}
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Próximos Pasos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Basado en tu perfil vocacional combinado, te recomendamos:
                </p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>
                      Profundiza en carreras relacionadas con {perfil.carrera_recomendada}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>
                      Consulta con un orientador académico para explorar opciones educativas
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>
                      Busca experiencias prácticas o voluntariados en campos relacionados
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>
                      Trabaja en desarrollar las áreas de mejora identificadas
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-10">
              <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Perfil no disponible
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {!progreso.todos_completados
                      ? 'Debes completar los 3 tests vocacionales antes de generar tu perfil combinado.'
                      : 'Tu perfil se está generando. Por favor, intenta más tarde.'}
                  </p>
                  {!progreso.todos_completados && (
                    <Link href="/tests-vocacionales">
                      <Button>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Completar Tests
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/tests-vocacionales">
            <Button variant="outline">
              <ArrowRight className="w-4 h-4 mr-2" />
              Ver Todos los Tests
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
