import React, { useState } from 'react';
import {
  ChevronUpDownIcon,
  CheckIcon,
  ArrowUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

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

interface Props {
  intentos: Intento[];
  onRevisar: (id: number) => void;
  getPrioridadColor: (prioridad: string) => string;
  getPrioridadIcon: (prioridad: string) => React.ReactNode;
  getConfianzaColor: (confianza: number) => string;
}

type SortField = 'estudiante' | 'puntaje' | 'porcentaje' | 'confianza' | 'fecha';
type SortDirection = 'asc' | 'desc';

/**
 * IntentosTable
 *
 * Componente tabla para mostrar lista de intentos pendientes de revisión
 * Soporta ordenamiento por columnas y acciones para abrir revisión detallada
 *
 * Props:
 * - intentos: Array de intentos a mostrar
 * - onRevisar: Callback cuando se hace click en "Revisar"
 * - getPrioridadColor: Función para obtener color del badge de prioridad
 * - getPrioridadIcon: Función para obtener ícono de prioridad
 * - getConfianzaColor: Función para obtener color de confianza
 */
export default function IntentosTable({
  intentos,
  onRevisar,
  getPrioridadColor,
  getPrioridadIcon,
  getConfianzaColor,
}: Props) {
  const [sortField, setSortField] = useState<SortField>('fecha');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  /**
   * Manejar click en encabezado para ordenar
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cambiar dirección si es el mismo campo
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nuevo campo, ordenar ascendente
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /**
   * Ordenar intentos según campo y dirección actual
   */
  const intentosOrdenados = [...intentos].sort((a, b) => {
    let valueA: any;
    let valueB: any;

    switch (sortField) {
      case 'estudiante':
        valueA = a.estudiante.nombre_completo.toLowerCase();
        valueB = b.estudiante.nombre_completo.toLowerCase();
        break;
      case 'puntaje':
        valueA = a.puntaje_obtenido;
        valueB = b.puntaje_obtenido;
        break;
      case 'porcentaje':
        valueA = a.porcentaje_acierto;
        valueB = b.porcentaje_acierto;
        break;
      case 'confianza':
        valueA = a.nivel_confianza;
        valueB = b.nivel_confianza;
        break;
      case 'fecha':
        valueA = new Date(a.fecha_entrega).getTime();
        valueB = new Date(b.fecha_entrega).getTime();
        break;
      default:
        return 0;
    }

    if (typeof valueA === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }
  });

  /**
   * Obtener ícono de ordenamiento para columna
   */
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUpDownIcon className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronUpDownIcon className="h-4 w-4 text-blue-600 transform rotate-180" />
    );
  };

  /**
   * Formatear fecha en formato legible
   */
  const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Obtener etiqueta de prioridad
   */
  const getPrioridadLabel = (prioridad: string): string => {
    const labels = {
      urgente: 'Urgente',
      media: 'Media',
      baja: 'Baja',
    };
    return labels[prioridad as keyof typeof labels] || prioridad;
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {/* Estudiante */}
            <th className="px-6 py-3 text-left">
              <button
                onClick={() => handleSort('estudiante')}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
              >
                Estudiante
                {getSortIcon('estudiante')}
              </button>
            </th>

            {/* Puntaje */}
            <th className="px-6 py-3 text-center">
              <button
                onClick={() => handleSort('puntaje')}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 mx-auto"
              >
                Puntaje
                {getSortIcon('puntaje')}
              </button>
            </th>

            {/* Porcentaje */}
            <th className="px-6 py-3 text-center">
              <button
                onClick={() => handleSort('porcentaje')}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 mx-auto"
              >
                Acierto %
                {getSortIcon('porcentaje')}
              </button>
            </th>

            {/* Confianza */}
            <th className="px-6 py-3 text-center">
              <button
                onClick={() => handleSort('confianza')}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 mx-auto"
              >
                Confianza
                {getSortIcon('confianza')}
              </button>
            </th>

            {/* Prioridad */}
            <th className="px-6 py-3 text-center">
              <span className="text-sm font-semibold text-gray-700">Prioridad</span>
            </th>

            {/* Fecha */}
            <th className="px-6 py-3 text-center">
              <button
                onClick={() => handleSort('fecha')}
                className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 mx-auto"
              >
                Fecha Entrega
                {getSortIcon('fecha')}
              </button>
            </th>

            {/* Acciones */}
            <th className="px-6 py-3 text-center">
              <span className="text-sm font-semibold text-gray-700">Acciones</span>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {intentosOrdenados.map((intento) => (
            <tr key={intento.id} className="hover:bg-gray-50 transition-colors">
              {/* Estudiante */}
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {intento.estudiante.nombre_completo}
                  </p>
                  <p className="text-sm text-gray-500">{intento.estudiante.email}</p>
                  {intento.tiene_anomalias && (
                    <div className="mt-2 flex items-center gap-1">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                      <span className="text-xs font-medium text-red-600">
                        Tiene anomalías
                      </span>
                    </div>
                  )}
                </div>
              </td>

              {/* Puntaje */}
              <td className="px-6 py-4 text-center">
                <span className="text-sm font-semibold text-gray-900">
                  {intento.puntaje_obtenido.toFixed(1)}
                </span>
              </td>

              {/* Porcentaje */}
              <td className="px-6 py-4 text-center">
                <span className="text-sm font-semibold text-gray-900">
                  {intento.porcentaje_acierto.toFixed(1)}%
                </span>
              </td>

              {/* Confianza */}
              <td className="px-6 py-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getConfianzaColor(
                    intento.nivel_confianza
                  )}`}
                >
                  {(intento.nivel_confianza * 100).toFixed(0)}%
                </span>
              </td>

              {/* Prioridad */}
              <td className="px-6 py-4 text-center">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getPrioridadColor(
                    intento.prioridad
                  )}`}
                >
                  {getPrioridadIcon(intento.prioridad)}
                  <span>{getPrioridadLabel(intento.prioridad)}</span>
                </div>
              </td>

              {/* Fecha */}
              <td className="px-6 py-4 text-center">
                <span className="text-sm text-gray-600">
                  {formatearFecha(intento.fecha_entrega)}
                </span>
              </td>

              {/* Acciones */}
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onRevisar(intento.id)}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Revisar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
