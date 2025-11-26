/**
 * useMLAnalysis Hook
 *
 * Hook personalizado para obtener y manejar datos de análisis ML integrado
 * Reutilizable en múltiples páginas y componentes
 */

import { useState, useCallback, useEffect } from 'react';
import { mlAnalysisService, IntegratedMLAnalysis } from '@/services/ml-analysis.service';

interface UseMLAnalysisOptions {
  studentId?: number;
  autoFetch?: boolean;
}

interface UseMLAnalysisReturn {
  // Estado
  data: IntegratedMLAnalysis | null;
  loading: boolean;
  error: Error | null;

  // Datos derivados
  predictions: any | null;
  discoveries: any | null;
  synthesis: any | null;
  interventionStrategy: any | null;

  // Métodos
  fetch: (id: number) => Promise<void>;
  reset: () => void;
  isReady: boolean;
}

export function useMLAnalysis(options: UseMLAnalysisOptions = {}): UseMLAnalysisReturn {
  const { studentId, autoFetch = true } = options;

  const [data, setData] = useState<IntegratedMLAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Función para obtener datos
  const fetch = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await mlAnalysisService.getIntegratedAnalysis(id);
      setData(result);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching ML analysis');
      setError(error);
      console.error('Error in useMLAnalysis:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch cuando studentId cambia
  useEffect(() => {
    if (autoFetch && studentId) {
      fetch(studentId);
    }
  }, [studentId, autoFetch, fetch]);

  // Derivar datos del respuesta
  const predictions = data?.data?.ml_data?.predictions ?? null;
  const discoveries = data?.data?.ml_data?.discoveries ?? null;
  const synthesis = data?.data?.synthesis ?? null;
  const interventionStrategy = data?.data?.intervention_strategy ?? null;

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    predictions,
    discoveries,
    synthesis,
    interventionStrategy,
    fetch,
    reset,
    isReady: !loading && !error && data !== null,
  };
}

export default useMLAnalysis;
