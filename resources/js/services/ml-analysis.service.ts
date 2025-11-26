/**
 * ML Analysis Service
 *
 * Servicio para consumir los endpoints unificados de análisis ML
 * que coordinan supervisada, no_supervisada, síntesis LLM e intervención
 */

import axios, { AxiosInstance } from 'axios';

interface MLPrediction {
  student_id: number;
  prediction: number;
  confidence: number;
  model_used: string;
}

interface MLDiscoveries {
  cluster_assignment?: any;
  cluster_analysis?: any;
  [key: string]: any;
}

interface MLData {
  success: boolean;
  student_id: number;
  predictions?: Record<string, MLPrediction>;
  discoveries?: MLDiscoveries;
  combined_analysis?: any;
  timestamp?: string;
}

interface MLSynthesis {
  success: boolean;
  synthesis?: any;
  reasoning?: string[];
  confidence?: number;
  timestamp?: string;
  method?: string;
}

interface InterventionStrategy {
  success: boolean;
  strategy?: any;
  actions?: string[];
  resources?: any[];
  confidence?: number;
  timestamp?: string;
}

export interface IntegratedMLAnalysis {
  success: boolean;
  student_id: number;
  student_name?: string;
  data?: {
    success: boolean;
    student_id: number;
    ml_data?: MLData;
    synthesis?: MLSynthesis;
    intervention_strategy?: InterventionStrategy;
    timestamp?: string;
    method?: string;
  };
}

export interface MLHealthStatus {
  success: boolean;
  agent_service?: {
    status: string;
    [key: string]: any;
  };
  timestamp?: string;
}

export interface MLSystemInfo {
  success: boolean;
  agent_info?: {
    [key: string]: any;
  };
  timestamp?: string;
}

class MLAnalysisService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: '/api/ml',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  /**
   * Obtener análisis completo integrado para un estudiante
   * Incluye: predicciones supervisadas + clustering no supervisado + síntesis LLM + estrategia
   */
  async getIntegratedAnalysis(studentId: number): Promise<IntegratedMLAnalysis> {
    try {
      const response = await this.apiClient.get<IntegratedMLAnalysis>(
        `/student/${studentId}/analysis`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching integrated analysis for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener solo predicciones (supervisada)
   */
  async getPredictions(studentId: number): Promise<{ success: boolean; student_id: number; predictions: Record<string, MLPrediction> }> {
    try {
      const response = await this.apiClient.get(
        `/student/${studentId}/predictions`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching predictions for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener solo clustering (no supervisada)
   */
  async getClustering(studentId: number): Promise<{ success: boolean; student_id: number; clustering: MLDiscoveries }> {
    try {
      const response = await this.apiClient.get(
        `/student/${studentId}/clustering`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching clustering for student ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Análisis en lote para múltiples estudiantes
   */
  async batchAnalysis(studentIds: number[]): Promise<{
    success: boolean;
    total: number;
    results: IntegratedMLAnalysis[];
    timestamp: string;
  }> {
    try {
      const response = await this.apiClient.post('/batch-analysis', {
        student_ids: studentIds,
      });
      return response.data;
    } catch (error) {
      console.error('Error in batch analysis:', error);
      throw error;
    }
  }

  /**
   * Verificar salud del ML System
   */
  async checkHealth(): Promise<MLHealthStatus> {
    try {
      const response = await this.apiClient.post<MLHealthStatus>('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking ML health:', error);
      throw error;
    }
  }

  /**
   * Obtener información del ML System
   */
  async getSystemInfo(): Promise<MLSystemInfo> {
    try {
      const response = await this.apiClient.get<MLSystemInfo>('/info');
      return response.data;
    } catch (error) {
      console.error('Error getting ML system info:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
export const mlAnalysisService = new MLAnalysisService();
export default MLAnalysisService;
