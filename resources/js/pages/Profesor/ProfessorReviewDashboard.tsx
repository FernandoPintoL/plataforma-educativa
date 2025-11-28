import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../../components/Layout/Layout';
import {
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import IntentosTable from '../../components/Profesor/IntentosTable';
import IntentoReviewModal from '../../components/Profesor/IntentoReviewModal';

/**
 * Interface para un intento de evaluación
 */
interface Intento {
  id: number;
  estudiante: {
    id: number;
    nombre_completo: string;
    email: string;
  };
  puntaje_obtenido: number;
  porcentaje_acierto: number;
  nivel_confianza: number;
  tiene_anomalias: boolean;
  prioridad: 'urgente' | 'media' | 'baja';
  fecha_entrega: string;
  estado: string;
  numero_intento: number;
}

/**
 * Interface para estadísticas de revisión
 */
interface Estadisticas {
  total_intentos: number;
  entregados: number;
  calificados: number;
  pendientes: number;
  prioridades: {
    urgente: number;
    media: number;
    baja: number;
  };
  promedios: {
    confianza: number;
    porcentaje_acierto: number;
    puntaje: number;
  };
  porcentaje_completado: number;
}

/**
 * Props para el componente
 */
interface Props {
  evaluacionId: number;
  evaluacionTitulo: string;
}

/**
 * ProfessorReviewDashboard
 *
 * Dashboard principal para que los profesores revisen evaluaciones
 * Características:
 * - Lista de intentos priorizados por urgencia
 * - Filtros inteligentes (prioridad, búsqueda)
 * - Estadísticas de revisión
 * - Modal de revisión detallada
 * - Confirmación y ajuste de calificaciones
 */
export default function ProfessorReviewDashboard({
  evaluacionId,
  evaluacionTitulo,
}: Props) {
  // Estado para intentos y filtros
  const [intentos, setIntentos] = useState<Intento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroProioridad, setFiltroPrioridad] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState('');

  // Estado para estadísticas
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);

  // Estado para modal de revisión
  const [modalAbierto, setModalAbierto] = useState(false);
  const [intentoSeleccionado, setIntentoSeleccionado] = useState<number | null>(null);

  /**
   * Cargar intentos pendientes cuando cambian los filtros
   */
  useEffect(() => {
    cargarIntentos();
  }, [evaluacionId, filtroProioridad, busqueda]);

  /**
   * Cargar estadísticas al montar el componente
   */
  useEffect(() => {
    cargarEstadisticas();
  }, [evaluacionId]);

  /**
   * Cargar intentos pendientes desde la API
   */
  const cargarIntentos = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filtroProioridad !== 'todas') {
        params.append('prioridad', filtroProioridad);
      }
      if (busqueda) {
        params.append('buscar', busqueda);
      }

      const response = await fetch(
        `/api/profesor/evaluaciones/${evaluacionId}/intentos-pendientes?${params}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar intentos');
      }

      const data = await response.json();
      setIntentos(data.data || []);

      // Actualizar estadísticas si vienen en la respuesta
      if (data.estadisticas) {
        setEstadisticas(data.estadisticas);
      }
    } catch (error) {
      console.error('Error cargando intentos:', error);
      // Mostrar error al usuario
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar estadísticas de revisión
   */
  const cargarEstadisticas = async () => {
    try {
      const response = await fetch(
        `/api/profesor/evaluaciones/${evaluacionId}/estadisticas-revision`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEstadisticas(data.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  /**
   * Abrir modal de revisión para un intento
   */
  const abrirRevision = (id: number) => {
    setIntentoSeleccionado(id);
    setModalAbierto(true);
  };

  /**
   * Cerrar modal y recargar datos si fue necesario
   */
  const cerrarModal = (recargar: boolean = false) => {
    setModalAbierto(false);
    setIntentoSeleccionado(null);
    if (recargar) {
      cargarIntentos();
      cargarEstadisticas();
    }
  };

  /**
   * Obtener color para badge de prioridad
   */
  const getPrioridadColor = (prioridad: string) => {
    const colores = {
      urgente: 'bg-red-100 text-red-800',
      media: 'bg-yellow-100 text-yellow-800',
      baja: 'bg-green-100 text-green-800',
    };
    return colores[prioridad as keyof typeof colores] || 'bg-gray-100 text-gray-800';
  };

  /**
   * Obtener ícono para badge de prioridad
   */
  const getPrioridadIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'urgente':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'media':
        return <ArrowUpIcon className="h-4 w-4" />;
      case 'baja':
        return <CheckIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  /**
   * Obtener color para nivel de confianza
   */
  const getConfianzaColor = (confianza: number) => {
    if (confianza >= 0.8) return 'bg-green-100 text-green-800';
    if (confianza >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Layout>
      <Head title={`Revisión de Evaluaciones - ${evaluacionTitulo}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Revisión de Evaluaciones
            </h1>
            <p className="text-gray-600">
              {evaluacionTitulo}
            </p>
          </div>

          {/* ESTADÍSTICAS */}
          {estadisticas && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {/* Total */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Total de Intentos</div>
                <div className="mt-2 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {estadisticas.total_intentos}
                  </div>
                </div>
              </div>

              {/* Pendientes */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Pendientes de Revisar</div>
                <div className="mt-2 flex items-baseline">
                  <div className="text-2xl font-semibold text-yellow-600">
                    {estadisticas.pendientes}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({estadisticas.porcentaje_completado.toFixed(0)}% completado)
                  </span>
                </div>
              </div>

              {/* Confianza Promedio */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Confianza Promedio</div>
                <div className="mt-2 flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {(estadisticas.promedios.confianza * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Calificados */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-500">Calificados</div>
                <div className="mt-2 flex items-baseline">
                  <div className="text-2xl font-semibold text-green-600">
                    {estadisticas.calificados}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRIORIDADES */}
          {estadisticas && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Prioridad</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {estadisticas.prioridades.urgente}
                  </div>
                  <div className="text-sm text-red-600 font-medium">Urgentes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {estadisticas.prioridades.media}
                  </div>
                  <div className="text-sm text-yellow-600 font-medium">Medias</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {estadisticas.prioridades.baja}
                  </div>
                  <div className="text-sm text-green-600 font-medium">Bajas</div>
                </div>
              </div>
            </div>
          )}

          {/* FILTROS */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Filtro de Prioridad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Prioridad
                </label>
                <select
                  value={filtroProioridad}
                  onChange={(e) => setFiltroPrioridad(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="todas">Todas las Prioridades</option>
                  <option value="urgente">🔴 Urgentes</option>
                  <option value="media">🟡 Medias</option>
                  <option value="baja">🟢 Bajas</option>
                </select>
              </div>

              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Estudiante
                </label>
                <input
                  type="text"
                  placeholder="Nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* TABLA DE INTENTOS */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Cargando intentos...</p>
            </div>
          ) : intentos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <CheckIcon className="mx-auto h-12 w-12 text-green-600" />
              <p className="mt-4 text-gray-600">
                {filtroProioridad !== 'todas' || busqueda
                  ? 'No hay intentos que coincidan con los filtros'
                  : '¡Todas las evaluaciones han sido revisadas!'}
              </p>
            </div>
          ) : (
            <IntentosTable
              intentos={intentos}
              onRevisar={abrirRevision}
              getPrioridadColor={getPrioridadColor}
              getPrioridadIcon={getPrioridadIcon}
              getConfianzaColor={getConfianzaColor}
            />
          )}
        </div>
      </div>

      {/* MODAL DE REVISIÓN */}
      {modalAbierto && intentoSeleccionado && (
        <IntentoReviewModal
          intentoId={intentoSeleccionado}
          evaluacionId={evaluacionId}
          isOpen={modalAbierto}
          onClose={cerrarModal}
        />
      )}
    </Layout>
  );
}
