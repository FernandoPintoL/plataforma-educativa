import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '../../contexts/AuthContext';
import { type BreadcrumbItem } from '@/types';
import { TestVocacional, PerfilVocacional, RecomendacionCarrera } from '../../types';
import AgentSynthesis from '../../components/VocationalProfile/AgentSynthesis';
import {
  MapIcon,
  PlayIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Orientación Vocacional',
    href: '/vocacional',
  },
];

const VocacionalIndex: React.FC = () => {
  const { user, isEstudiante } = useAuth();
  const [activeTab, setActiveTab] = useState('tests');

  // State management for real API data
  const [testsDisponibles, setTestsDisponibles] = useState<TestVocacional[]>([]);
  const [perfilVocacional, setPerfilVocacional] = useState<PerfilVocacional | null>(null);
  const [recomendaciones, setRecomendaciones] = useState<RecomendacionCarrera[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch available tests
        const testsResponse = await axios.get('/api/tests-vocacionales');
        const tests = testsResponse.data.data || testsResponse.data;
        setTestsDisponibles(
          Array.isArray(tests) ? tests.filter((t: any) => t.activo) : []
        );

        // Fetch student's vocational profile
        try {
          const perfilResponse = await axios.get('/api/vocacional/mi-perfil');
          if (perfilResponse.data.success) {
            setPerfilVocacional(perfilResponse.data.perfil);
          } else {
            // Profile doesn't exist yet - student hasn't completed a test
            setPerfilVocacional(null);
          }
        } catch (err: any) {
          console.error('Error fetching profile:', err);
          setPerfilVocacional(null);
        }

        // Fetch career recommendations with AI analysis
        try {
          const recomendacionesResponse = await axios.get(
            '/api/vocacional/recomendaciones-carrera-con-agente'
          );
          if (recomendacionesResponse.data.success) {
            // Combinar top 5 con análisis del agente + resto sin análisis
            const todasRecomendaciones = [
              ...(recomendacionesResponse.data.recomendaciones || []),
              ...(recomendacionesResponse.data.todas_las_carreras || [])
            ];
            setRecomendaciones(todasRecomendaciones);
          } else {
            // Fallback: usar endpoint sin agente si hay error
            try {
              const fallbackResponse = await axios.get(
                '/api/vocacional/recomendaciones-carrera-formato'
              );
              if (fallbackResponse.data.success) {
                setRecomendaciones(fallbackResponse.data.recomendaciones || []);
              } else {
                setRecomendaciones([]);
              }
            } catch {
              setRecomendaciones([]);
            }
          }
        } catch (err: any) {
          console.error('Error fetching recommendations:', err);
          // Fallback: usar endpoint sin agente
          try {
            const fallbackResponse = await axios.get(
              '/api/vocacional/recomendaciones-carrera-formato'
            );
            if (fallbackResponse.data.success) {
              setRecomendaciones(fallbackResponse.data.recomendaciones || []);
            }
          } catch {
            setRecomendaciones([]);
          }
        }
      } catch (err: any) {
        console.error('Error fetching vocational data:', err);
        setError('Error cargando datos vocacionales. Por favor intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    if (isEstudiante) {
      fetchData();
    }
  }, [isEstudiante]);

  const getCompatibilityColor = (compatibilidad: number) => {
    if (compatibilidad >= 0.8) return 'text-green-600 bg-green-100';
    if (compatibilidad >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompatibilityText = (compatibilidad: number) => {
    if (compatibilidad >= 0.9) return 'Excelente';
    if (compatibilidad >= 0.8) return 'Muy Alta';
    if (compatibilidad >= 0.7) return 'Alta';
    if (compatibilidad >= 0.6) return 'Buena';
    return 'Moderada';
  };

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando orientación vocacional...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Orientación Vocacional</h1>
              <p className="text-gray-600">Descubre tu vocación y encuentra la carrera perfecta para ti</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('tests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tests Vocacionales
              </button>
              <button
                onClick={() => setActiveTab('perfil')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'perfil'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mi Perfil
              </button>
              <button
                onClick={() => setActiveTab('recomendaciones')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recomendaciones'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recomendaciones
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Tests Tab */}
            {activeTab === 'tests' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Tests Disponibles</h3>
                  <p className="text-gray-600 mb-6">
                    Completa estos tests para descubrir tus intereses, aptitudes y personalidad profesional.
                  </p>
                </div>

                {testsDisponibles.length === 0 ? (
                  <div className="text-center py-12">
                    <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay tests disponibles en este momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testsDisponibles.map((test) => (
                      <div key={test.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {test.nombre}
                            </h4>
                            <p className="text-gray-600 text-sm mb-4">
                              {test.descripcion}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              <span>{test.duracion_estimada} minutos</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/tests-vocacionales/${test.id}/tomar`}>
                          <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Comenzar Test
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Perfil Tab */}
            {activeTab === 'perfil' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mi Perfil Vocacional</h3>
                  <p className="text-gray-600 mb-6">
                    Tu perfil se genera automáticamente basado en los tests que has completado.
                  </p>
                </div>

                {!perfilVocacional ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                    <AcademicCapIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Sin Perfil Aún</h4>
                    <p className="text-gray-600 mb-6">
                      Completa un test vocacional para generar tu perfil y descubrir tus fortalezas, intereses y aptitudes.
                    </p>
                    <button
                      onClick={() => setActiveTab('tests')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Ir a Tests
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Intereses */}
                      {perfilVocacional.intereses && Object.keys(perfilVocacional.intereses).length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Intereses</h4>
                          <div className="space-y-3">
                            {Object.entries(perfilVocacional.intereses).map(([area, puntaje]) => (
                              <div key={area}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-700">{area}</span>
                                  <span className="text-gray-500">{typeof puntaje === 'number' ? `${puntaje}%` : puntaje}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${typeof puntaje === 'number' ? puntaje : 0}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Habilidades */}
                      {perfilVocacional.habilidades && Object.keys(perfilVocacional.habilidades).length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h4>
                          <div className="space-y-3">
                            {Object.entries(perfilVocacional.habilidades).map(([habilidad, puntaje]) => (
                              <div key={habilidad}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-700">{habilidad}</span>
                                  <span className="text-gray-500">{typeof puntaje === 'number' ? `${puntaje}%` : puntaje}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${typeof puntaje === 'number' ? puntaje : 0}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Agent Synthesis - Análisis Inteligente */}
                    <AgentSynthesis triggerLoad={true} />
                  </div>
                )}
              </div>
            )}

            {/* Recomendaciones Tab */}
            {activeTab === 'recomendaciones' && (
              <div className="space-y-6">
                {/* Header mejorado */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <AcademicCapIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Carreras Recomendadas</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 ml-11 leading-relaxed">
                    Basado en tu perfil vocacional, IA ha analizado tus intereses y aptitudes para encontrar las carreras que mejor se adaptan a ti.
                  </p>
                </div>

                {recomendaciones.length === 0 ? (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-12 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                        <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sin Recomendaciones Aún</h4>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Completa un test vocacional para recibir recomendaciones personalizadas de carreras basadas en tus intereses y aptitudes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recomendaciones.map((recomendacion, index) => (
                      <div
                        key={recomendacion.id || index}
                        className={`rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 ${
                          index < 5
                            ? 'border-2 border-blue-300 dark:border-blue-700 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-gray-900 dark:to-indigo-950 shadow-md'
                            : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                        }`}
                      >
                        <div className="p-6">
                          {/* Top row: Insignia + Nombre + Compatibilidad */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                {index < 5 && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-md">
                                    ✨ Top {index + 1}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <AcademicCapIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                  {recomendacion.carrera?.nombre || 'Carrera'}
                                </h4>
                              </div>
                            </div>

                            {/* Círculo de compatibilidad mejorado */}
                            <div className="ml-4 flex-shrink-0 flex flex-col items-center">
                              <div className={`relative flex items-center justify-center w-20 h-20 rounded-full font-bold text-2xl shadow-lg ${
                                recomendacion.compatibilidad >= 0.8
                                  ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white'
                                  : recomendacion.compatibilidad >= 0.6
                                  ? 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white'
                                  : 'bg-gradient-to-br from-amber-400 to-orange-600 text-white'
                              }`}>
                                {Math.round(recomendacion.compatibilidad * 100)}
                                <span className="absolute text-xs font-normal">%</span>
                              </div>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 text-center">compatibilidad</p>
                            </div>
                          </div>

                          {/* Justificación inteligente - Destacada y mejorada */}
                          {recomendacion.justificacion && !recomendacion.justificacion.includes('Analizando') && (
                            <div className={`mb-4 rounded-lg overflow-hidden border-l-4 p-4 ${
                              index < 5
                                ? 'border-l-blue-500 bg-white dark:bg-gray-800 shadow-sm'
                                : 'border-l-gray-300 bg-gray-50 dark:bg-gray-800'
                            }`}>
                              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                                💡 Por qué esta carrera
                              </p>
                              <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                                {recomendacion.justificacion}
                              </p>
                            </div>
                          )}

                          {/* Descripción de la carrera */}
                          {recomendacion.carrera?.descripcion && (
                            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                              {recomendacion.carrera.descripcion}
                            </p>
                          )}

                          {/* Información de duración y nivel */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            {recomendacion.carrera?.duracion_anos && (
                              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="text-lg">⏱️</span>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duración</p>
                                  <p className="text-sm font-bold text-gray-900 dark:text-white">{recomendacion.carrera.duracion_anos} años</p>
                                </div>
                              </div>
                            )}
                            {recomendacion.carrera?.nivel_educativo && (
                              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="text-lg">📚</span>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Nivel</p>
                                  <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{recomendacion.carrera.nivel_educativo}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Áreas de conocimiento - Mejoradas */}
                          {recomendacion.carrera?.areas_conocimiento && recomendacion.carrera.areas_conocimiento.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">Áreas de estudio</p>
                              <div className="flex flex-wrap gap-2">
                                {recomendacion.carrera.areas_conocimiento.map((area, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors cursor-default"
                                  >
                                    📍 {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default VocacionalIndex;
