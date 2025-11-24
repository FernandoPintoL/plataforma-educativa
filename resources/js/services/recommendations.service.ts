import axios from 'axios'

/**
 * Servicio para manejar las recomendaciones educativas
 * Interactúa con los endpoints de la API de recomendaciones
 */

export interface Recommendation {
    id: number
    student_id: number
    recommendation_type: string
    urgency: string
    reason: string
    actions: string[]
    resources: string[]
    success_indicators: string[]
    risk_score: number
    risk_level: string
    accepted: boolean
    completed: boolean
    effectiveness_rating: number | null
    created_at: string
    updated_at: string
}

export interface RecommendationResponse {
    status: string
    message: string
    data: Recommendation[]
    timestamp: string
}

export interface RecommendationActionPayload {
    accepted?: boolean
    completed?: boolean
    effectiveness_rating?: number
}

class RecommendationsService {
    private baseURL = '/api/recommendations'

    /**
     * Obtener mis recomendaciones (estudiante autenticado)
     */
    async getMyRecommendations(): Promise<Recommendation[]> {
        try {
            const response = await axios.get<RecommendationResponse>(
                `${this.baseURL}/my`
            )
            return response.data.data || []
        } catch (error) {
            console.error('Error obteniendo recomendaciones:', error)
            throw error
        }
    }

    /**
     * Obtener recomendaciones de un estudiante específico (solo docentes/admin)
     */
    async getStudentRecommendations(studentId: number): Promise<Recommendation[]> {
        try {
            const response = await axios.get<RecommendationResponse>(
                `${this.baseURL}/student/${studentId}`
            )
            return response.data.data || []
        } catch (error) {
            console.error(`Error obteniendo recomendaciones del estudiante ${studentId}:`, error)
            throw error
        }
    }

    /**
     * Obtener una recomendación específica
     */
    async getRecommendation(id: number): Promise<Recommendation> {
        try {
            const response = await axios.get<{ data: Recommendation }>(
                `${this.baseURL}/${id}`
            )
            return response.data.data
        } catch (error) {
            console.error(`Error obteniendo recomendación ${id}:`, error)
            throw error
        }
    }

    /**
     * Aceptar una recomendación
     */
    async acceptRecommendation(id: number): Promise<Recommendation> {
        try {
            const response = await axios.post<{ data: Recommendation }>(
                `${this.baseURL}/${id}/accept`,
                {}
            )
            return response.data.data
        } catch (error) {
            console.error(`Error aceptando recomendación ${id}:`, error)
            throw error
        }
    }

    /**
     * Marcar una recomendación como completada
     */
    async completeRecommendation(
        id: number,
        effectivenessRating?: number
    ): Promise<Recommendation> {
        try {
            const payload: RecommendationActionPayload = {
                completed: true,
            }

            if (effectivenessRating !== undefined) {
                payload.effectiveness_rating = effectivenessRating
            }

            const response = await axios.post<{ data: Recommendation }>(
                `${this.baseURL}/${id}/complete`,
                payload
            )
            return response.data.data
        } catch (error) {
            console.error(`Error completando recomendación ${id}:`, error)
            throw error
        }
    }

    /**
     * Obtener historial de recomendaciones
     */
    async getHistory(filters?: Record<string, any>): Promise<Recommendation[]> {
        try {
            const response = await axios.get<RecommendationResponse>(
                `${this.baseURL}/history`,
                { params: filters }
            )
            return response.data.data || []
        } catch (error) {
            console.error('Error obteniendo historial de recomendaciones:', error)
            throw error
        }
    }

    /**
     * Obtener estadísticas de recomendaciones
     */
    async getStats(): Promise<Record<string, any>> {
        try {
            const response = await axios.get(
                `${this.baseURL}/stats`
            )
            return response.data.data || {}
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error)
            throw error
        }
    }
}

export const recommendationsService = new RecommendationsService()
