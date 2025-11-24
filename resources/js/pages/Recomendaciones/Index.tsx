import React, { useEffect, useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { recommendationsService, type Recommendation } from '@/services/recommendations.service'
import { AlertCircle, CheckCircle, Clock, Lightbulb } from 'lucide-react'

/**
 * Página principal de recomendaciones educativas
 * Muestra las recomendaciones personalizadas del estudiante
 */
export default function RecommendationsIndex() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Cargar recomendaciones al montar el componente
    useEffect(() => {
        loadRecommendations()
    }, [])

    const loadRecommendations = async () => {
        try {
            setLoading(true)
            const data = await recommendationsService.getMyRecommendations()
            setRecommendations(data)
            setError(null)
        } catch (err) {
            setError('No se pudieron cargar las recomendaciones')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Obtener icono según el tipo de recomendación
    const getRecommendationIcon = (type: string) => {
        switch (type) {
            case 'intervention':
                return <AlertCircle className="w-5 h-5 text-red-500" />
            case 'improvement':
                return <Lightbulb className="w-5 h-5 text-yellow-500" />
            case 'encouragement':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            default:
                return <Clock className="w-5 h-5 text-blue-500" />
        }
    }

    // Obtener color del badge según urgencia
    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'immediate':
                return 'bg-red-100 text-red-800'
            case 'high':
                return 'bg-orange-100 text-orange-800'
            case 'normal':
                return 'bg-blue-100 text-blue-800'
            case 'low':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Obtener etiqueta de estado
    const getStatusBadge = (rec: Recommendation) => {
        if (rec.completed) {
            return <Badge variant="default" className="bg-green-600">Completada</Badge>
        }
        if (rec.accepted) {
            return <Badge variant="secondary" className="bg-blue-600">Aceptada</Badge>
        }
        return <Badge variant="outline">Pendiente</Badge>
    }

    // Traducir tipo de recomendación
    const getRecommendationType = (type: string) => {
        const types: Record<string, string> = {
            'intervention': 'Intervención Requerida',
            'improvement': 'Mejora Sugerida',
            'encouragement': 'Felicitación',
            'progress': 'Progreso Notable'
        }
        return types[type] || type
    }

    return (
        <AppLayout>
            <Head title="Mis Recomendaciones Educativas" />

            <div className="space-y-6">
                {/* Encabezado */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Mis Recomendaciones
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Recomendaciones educativas personalizadas basadas en tu desempeño
                        </p>
                    </div>
                    <Button onClick={loadRecommendations} variant="outline">
                        Actualizar
                    </Button>
                </div>

                {/* Estado de carga */}
                {loading && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Mensaje de error */}
                {error && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <CardContent className="pt-6">
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Lista de recomendaciones */}
                {!loading && recommendations.length > 0 && (
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {recommendations.map((rec) => (
                            <Card key={rec.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            {getRecommendationIcon(rec.recommendation_type)}
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">
                                                    {getRecommendationType(rec.recommendation_type)}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {rec.subject || 'General'}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        {getStatusBadge(rec)}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Urgencia */}
                                    <div className="flex gap-2">
                                        <Badge className={getUrgencyColor(rec.urgency)}>
                                            {rec.urgency === 'immediate' && 'Urgente'}
                                            {rec.urgency === 'high' && 'Alta'}
                                            {rec.urgency === 'normal' && 'Normal'}
                                            {rec.urgency === 'low' && 'Baja'}
                                        </Badge>
                                        {rec.risk_score && (
                                            <Badge variant="outline">
                                                Riesgo: {(rec.risk_score * 100).toFixed(0)}%
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Razón */}
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                            Razón
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {rec.reason}
                                        </p>
                                    </div>

                                    {/* Acciones */}
                                    {rec.actions.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                                Acciones Recomendadas
                                            </h4>
                                            <ul className="list-disc list-inside mt-2 space-y-1">
                                                {rec.actions.slice(0, 3).map((action, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                                        {action}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Recursos */}
                                    {rec.resources.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                                                Recursos Disponibles
                                            </h4>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {rec.resources.slice(0, 3).map((resource, idx) => (
                                                    <Badge key={idx} variant="secondary">
                                                        {resource}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Botones de acción */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        {!rec.accepted && (
                                            <Button
                                                size="sm"
                                                onClick={() => handleAccept(rec.id)}
                                            >
                                                Aceptar
                                            </Button>
                                        )}
                                        {rec.accepted && !rec.completed && (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => handleComplete(rec.id)}
                                            >
                                                Marcar Completada
                                            </Button>
                                        )}
                                        <Link href={`/recomendaciones/${rec.id}`}>
                                            <Button size="sm" variant="outline">
                                                Ver Detalles
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Sin recomendaciones */}
                {!loading && recommendations.length === 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Sin recomendaciones pendientes
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    Completa exámenes y asignaciones para recibir recomendaciones personalizadas
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    )

    // Manejadores de acciones
    async function handleAccept(id: number) {
        try {
            await recommendationsService.acceptRecommendation(id)
            await loadRecommendations()
        } catch (err) {
            console.error('Error aceptando recomendación:', err)
        }
    }

    async function handleComplete(id: number) {
        try {
            await recommendationsService.completeRecommendation(id, 4.0)
            await loadRecommendations()
        } catch (err) {
            console.error('Error completando recomendación:', err)
        }
    }
}
