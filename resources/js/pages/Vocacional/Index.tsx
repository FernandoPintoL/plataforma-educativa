import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '../../contexts/AuthContext';
import { type BreadcrumbItem } from '@/types';
import { TestVocacional, PerfilVocacional, RecomendacionCarrera } from '../../types';
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

        // Fetch career recommendations
        try {
          const recomendacionesResponse = await axios.get(
            '/api/vocacional/recomendaciones-carrera'
          );
          if (recomendacionesResponse.data.success) {
            setRecomendaciones(recomendacionesResponse.data.recomendaciones || []);
          } else {
            // Recommendations don't exist yet - student needs to complete a test
            setRecomendaciones([]);
          }
        } catch (err: any) {
          console.error('Error fetching recommendations:', err);
          setRecomendaciones([]);
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
                )}
              </div>
            )}

            {/* Recomendaciones Tab */}
            {activeTab === 'recomendaciones' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Carreras Recomendadas</h3>
                  <p className="text-gray-600 mb-6">
                    Basado en tu perfil vocacional, estas son las carreras que mejor se adaptan a ti.
                  </p>
                </div>

                {recomendaciones.length === 0 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                    <ChartBarIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Sin Recomendaciones Aún</h4>
                    <p className="text-gray-600">
                      Completa un test vocacional para recibir recomendaciones de carreras basadas en tus intereses y aptitudes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recomendaciones.map((recomendacion, index) => (
                      <div key={recomendacion.id || index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                              <h4 className="text-lg font-semibold text-gray-900">
                                {recomendacion.carrera?.nombre || 'Carrera'}
                              </h4>
                            </div>
                            {recomendacion.carrera?.descripcion && (
                              <p className="text-gray-600 mb-4">
                                {recomendacion.carrera.descripcion}
                              </p>
                            )}
                            {recomendacion.carrera?.duracion_anos && (
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <span className="font-medium">Duración:</span>
                                <span className="ml-1">{recomendacion.carrera.duracion_anos} años</span>
                              </div>
                            )}
                            {recomendacion.carrera?.nivel_educativo && (
                              <div className="flex items-center text-sm text-gray-500 mb-4">
                                <span className="font-medium">Nivel:</span>
                                <span className="ml-1 capitalize">{recomendacion.carrera.nivel_educativo}</span>
                              </div>
                            )}
                            {recomendacion.justificacion && (
                              <p className="text-sm text-gray-700 mb-4">
                                <strong>Justificación:</strong> {recomendacion.justificacion}
                              </p>
                            )}
                            {recomendacion.carrera?.areas_conocimiento && (
                              <div className="flex flex-wrap gap-2">
                                {recomendacion.carrera.areas_conocimiento.map((area, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {area}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="ml-4 text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCompatibilityColor(recomendacion.compatibilidad)}`}>
                              {getCompatibilityText(recomendacion.compatibilidad)}
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mt-2">
                              {Math.round(recomendacion.compatibilidad * 100)}%
                            </div>
                          </div>
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
