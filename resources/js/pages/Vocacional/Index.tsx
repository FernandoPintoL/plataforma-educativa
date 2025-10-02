import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { TestVocacional, PerfilVocacional, RecomendacionCarrera } from '../../types';
import { 
  MapIcon,
  PlayIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const VocacionalIndex: React.FC = () => {
  const { user, isEstudiante } = useAuth();
  const [activeTab, setActiveTab] = useState('tests');

  // Datos de ejemplo
  const testsDisponibles: TestVocacional[] = [
    {
      id: 1,
      nombre: 'Test de Intereses Profesionales',
      descripcion: 'Descubre tus áreas de interés profesional',
      duracion_estimada: 15,
      activo: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      nombre: 'Test de Aptitudes',
      descripcion: 'Evalúa tus habilidades y capacidades',
      duracion_estimada: 20,
      activo: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      nombre: 'Test de Personalidad Laboral',
      descripcion: 'Conoce tu personalidad en el ámbito laboral',
      duracion_estimada: 25,
      activo: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  const perfilVocacional: PerfilVocacional = {
    id: 1,
    estudiante_id: user?.id || 1,
    intereses: {
      'Matemáticas': 85,
      'Ciencias': 78,
      'Tecnología': 92,
      'Artes': 45,
      'Deportes': 60,
    },
    habilidades: {
      'Análisis': 88,
      'Creatividad': 65,
      'Liderazgo': 70,
      'Comunicación': 75,
      'Resolución de problemas': 90,
    },
    personalidad: {
      'Extroversión': 60,
      'Responsabilidad': 85,
      'Apertura': 70,
      'Amabilidad': 75,
      'Estabilidad': 80,
    },
    aptitudes: {
      'Matemáticas': 90,
      'Física': 85,
      'Programación': 95,
      'Diseño': 60,
      'Escritura': 70,
    },
    fecha_creacion: '2024-01-01T00:00:00Z',
    fecha_actualizacion: '2024-01-15T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  };

  const recomendaciones: RecomendacionCarrera[] = [
    {
      id: 1,
      estudiante_id: user?.id || 1,
      carrera_id: 1,
      compatibilidad: 0.92,
      justificacion: 'Excelente compatibilidad con tus intereses en tecnología y matemáticas',
      fecha: '2024-01-15T00:00:00Z',
      fuente: 'test_vocacional',
      carrera: {
        id: 1,
        nombre: 'Ingeniería en Sistemas',
        descripcion: 'Carrera enfocada en el desarrollo de software y sistemas informáticos',
        nivel_educativo: 'licenciatura',
        duracion_anos: 5,
        areas_conocimiento: ['Programación', 'Matemáticas', 'Lógica'],
        perfil_ideal: {},
        oportunidades_laborales: ['Desarrollador', 'Analista', 'Arquitecto de Software'],
        activo: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: 2,
      estudiante_id: user?.id || 1,
      carrera_id: 2,
      compatibilidad: 0.85,
      justificacion: 'Buena compatibilidad con tus aptitudes en matemáticas y física',
      fecha: '2024-01-15T00:00:00Z',
      fuente: 'test_vocacional',
      carrera: {
        id: 2,
        nombre: 'Ingeniería Matemática',
        descripcion: 'Aplicación de las matemáticas en la resolución de problemas complejos',
        nivel_educativo: 'licenciatura',
        duracion_anos: 5,
        areas_conocimiento: ['Matemáticas', 'Estadística', 'Análisis'],
        perfil_ideal: {},
        oportunidades_laborales: ['Matemático', 'Estadístico', 'Analista de Datos'],
        activo: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
  ];

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

  return (
    <Layout title="Orientación Vocacional">
      <div className="space-y-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {testsDisponibles.map((test) => (
                    <div key={test.id} className="bg-gray-50 rounded-lg p-6">
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
                      <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Comenzar Test
                      </button>
                    </div>
                  ))}
                </div>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Intereses */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Intereses</h4>
                    <div className="space-y-3">
                      {Object.entries(perfilVocacional.intereses).map(([area, puntaje]) => (
                        <div key={area}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{area}</span>
                            <span className="text-gray-500">{puntaje}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${puntaje}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Habilidades */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Habilidades</h4>
                    <div className="space-y-3">
                      {Object.entries(perfilVocacional.habilidades).map(([habilidad, puntaje]) => (
                        <div key={habilidad}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{habilidad}</span>
                            <span className="text-gray-500">{puntaje}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${puntaje}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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

                <div className="space-y-4">
                  {recomendaciones.map((recomendacion) => (
                    <div key={recomendacion.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <AcademicCapIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="text-lg font-semibold text-gray-900">
                              {recomendacion.carrera.nombre}
                            </h4>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {recomendacion.carrera.descripcion}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <span className="font-medium">Duración:</span>
                            <span className="ml-1">{recomendacion.carrera.duracion_anos} años</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span className="font-medium">Nivel:</span>
                            <span className="ml-1 capitalize">{recomendacion.carrera.nivel_educativo}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-4">
                            <strong>Justificación:</strong> {recomendacion.justificacion}
                          </p>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VocacionalIndex;
