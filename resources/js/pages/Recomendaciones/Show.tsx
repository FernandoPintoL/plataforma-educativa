import React, { useEffect, useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { recommendationsService, type Recommendation } from '@/services/recommendations.service'
import { ChevronLeft, AlertCircle, CheckCircle, Clock, Lightbulb } from 'lucide-react'

interface ShowProps {
    id: number
}

/**
 * Página de detalles de una recomendación
 */
export default function RecommendationShow({ id }: ShowProps) {
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionInProgress, setActionInProgress] = useState(false)

    useEffect(() => {
        loadRecommendation()
    }, [id])

    const loadRecommendation = async () => {
        try {
            setLoading(true)
            const data = await recommendationsService.getRecommendation(id)
            setRecommendation(data)
            setError(null)
        } catch (err) {
            setError('No se pudo cargar la recomendación')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            </AppLayout>
        )
    }

    if (error || !recommendation) {
        return (
            <AppLayout>
                <Head title="Error - Recomendación" />
                <div className="space-y-4">
                    <Link href="/recomendaciones">
                        <Button variant="outline">
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <CardContent className="pt-6">
                            <p className="text-red-600 dark:text-red-400">
                                {error || 'Recomendación no encontrada'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        )
    }

    // Obtener icono
    const getRecommendationIcon = (type: string) => {
        switch (type) {
            case 'intervention':
                return <AlertCircle className="w-6 h-6 text-red-500" />
            case 'improvement':
                return <Lightbulb className="w-6 h-6 text-yellow-500" />
            case 'encouragement':
                return <CheckCircle className="w-6 h-6 text-green-500" />
            default:
                return <Clock className="w-6 h-6 text-blue-500" />
        }
    }

    // Obtener color urgencia
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

    // Obtener tipo
    const getRecommendationType = (type: string) => {
        const types: Record<string, string> = {
            'intervention': 'Intervención Requerida',
            'improvement': 'Mejora Sugerida',
            'encouragement': 'Felicitación',
            'progress': 'Progreso Notable'
        }
        return types[type] || type
    }

    // Manejadores
    const handleAccept = async () => {
        try {
            setActionInProgress(true)
            await recommendationsService.acceptRecommendation(recommendation.id)
            await loadRecommendation()
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setActionInProgress(false)
        }
    }

    const handleComplete = async () => {
        try {
            setActionInProgress(true)
            await recommendationsService.completeRecommendation(recommendation.id, 4.0)
            await loadRecommendation()
        } catch (err) {
            console.error('Error:', err)
        } finally {
            setActionInProgress(false)
        }
    }

    return (
        <AppLayout>
            <Head title={`Recomendación: ${getRecommendationType(recommendation.recommendation_type)}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/recomendaciones">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Detalles de Recomendación
                    </h1>
                </div>

                {/* Tarjeta principal */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                {getRecommendationIcon(recommendation.recommendation_type)}
                                <div className="flex-1">
                                    <CardTitle className="text-2xl">
                                        {getRecommendationType(recommendation.recommendation_type)}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        Creada el {new Date(recommendation.created_at).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </CardDescription>
                                </div>
                            </div>

                            {/* Estado */}
                            <div className="text-right">
                                {recommendation.completed && (
                                    <Badge className="bg-green-600">Completada</Badge>
                                )}
                                {!recommendation.completed && recommendation.accepted && (
                                    <Badge className="bg-blue-600">Aceptada</Badge>
                                )}
                                {!recommendation.completed && !recommendation.accepted && (
                                    <Badge variant="outline">Pendiente</Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Urgencia y Riesgo */}
                        <div className="flex flex-wrap gap-3">
                            <Badge className={getUrgencyColor(recommendation.urgency)}>
                                {recommendation.urgency === 'immediate' && 'Urgencia: INMEDIATA'}
                                {recommendation.urgency === 'high' && 'Urgencia: ALTA'}
                                {recommendation.urgency === 'normal' && 'Urgencia: NORMAL'}
                                {recommendation.urgency === 'low' && 'Urgencia: BAJA'}
                            </Badge>
                            {recommendation.risk_score && (
                                <Badge variant="outline" className="text-base">
                                    Nivel de Riesgo: {(recommendation.risk_score * 100).toFixed(0)}%
                                </Badge>
                            )}
                            {recommendation.risk_level && (
                                <Badge variant="secondary">
                                    {recommendation.risk_level === 'HIGH' && 'Riesgo Alto'}
                                    {recommendation.risk_level === 'MEDIUM' && 'Riesgo Medio'}
                                    {recommendation.risk_level === 'LOW' && 'Riesgo Bajo'}
                                </Badge>
                            )}
                        </div>

                        {/* Razón */}
                        <div className="border-l-4 border-blue-500 pl-4 py-2">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                Razón
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {recommendation.reason}
                            </p>
                        </div>

                        {/* Acciones */}
                        {recommendation.actions.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                                    Acciones Recomendadas
                                </h3>
                                <div className="space-y-2">
                                    {recommendation.actions.map((action, idx) => (
                                        <div key={idx} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <div className="text-blue-600 dark:text-blue-400 font-bold">
                                                {idx + 1}.
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {action}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recursos */}
                        {recommendation.resources.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                                    Recursos Disponibles
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {recommendation.resources.map((resource, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-base py-2 px-3">
                                            {resource}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Indicadores de éxito */}
                        {recommendation.success_indicators.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
                                    Indicadores de Éxito
                                </h3>
                                <ul className="space-y-2">
                                    {recommendation.success_indicators.map((indicator, idx) => (
                                        <li key={idx} className="flex gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {indicator}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Calificación de efectividad */}
                        {recommendation.completed && recommendation.effectiveness_rating && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    Calificación de Efectividad
                                </h4>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            className={star <= recommendation.effectiveness_rating! ? 'text-yellow-500' : 'text-gray-300'}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Botones de acción */}
                        {!recommendation.completed && (
                            <div className="flex gap-3 pt-4 border-t">
                                {!recommendation.accepted && (
                                    <Button
                                        onClick={handleAccept}
                                        disabled={actionInProgress}
                                        className="flex-1"
                                    >
                                        {actionInProgress ? 'Procesando...' : 'Aceptar Recomendación'}
                                    </Button>
                                )}
                                {recommendation.accepted && (
                                    <Button
                                        onClick={handleComplete}
                                        disabled={actionInProgress}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        {actionInProgress ? 'Procesando...' : 'Marcar como Completada'}
                                    </Button>
                                )}
                                <Link href="/recomendaciones" className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        Volver a Lista
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {recommendation.completed && (
                            <div className="flex gap-3 pt-4 border-t">
                                <Link href="/recomendaciones" className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        Volver a Lista
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
