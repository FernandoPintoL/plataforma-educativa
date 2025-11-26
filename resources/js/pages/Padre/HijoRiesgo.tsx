import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, TrendingDown, TrendingUp, Minus, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RiskAnalysis {
    student_id: number;
    student_name: string;
    risk_score: number;
    risk_level: string;
    confidence: number;
    trend: string;
    last_update: string;
    trend_data: {
        labels: string[];
        scores: number[];
    };
    recent_grades: Array<{
        subject: string;
        grade: number;
        date: string;
    }>;
    factors: Array<{
        name: string;
        impact: number;
        interpretation: string;
    }>;
    recommendations: string[];
}

interface RouteParams {
    hijoId: string;
}

export default function HijoRiesgoPage({ hijoId }: RouteParams) {
    const [riskData, setRiskData] = useState<RiskAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRiskAnalysis();
    }, [hijoId]);

    const fetchRiskAnalysis = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/padre/hijos/${hijoId}/riesgo`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar el análisis de riesgo');
            }

            const data = await response.json();
            setRiskData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level.toUpperCase()) {
            case 'ALTO':
                return 'text-red-600';
            case 'MEDIO':
                return 'text-yellow-600';
            case 'BAJO':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const getRiskBorderColor = (level: string) => {
        switch (level.toUpperCase()) {
            case 'ALTO':
                return 'border-l-red-500';
            case 'MEDIO':
                return 'border-l-yellow-500';
            case 'BAJO':
                return 'border-l-green-500';
            default:
                return 'border-l-gray-500';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend.toLowerCase()) {
            case 'improving':
            case 'mejorando':
                return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'declining':
            case 'declinando':
                return <TrendingDown className="w-5 h-5 text-red-600" />;
            case 'stable':
            case 'estable':
                return <Minus className="w-5 h-5 text-gray-600" />;
            default:
                return <Minus className="w-5 h-5 text-gray-400" />;
        }
    };

    const getTrendLabel = (trend: string) => {
        const trendMap: { [key: string]: string } = {
            'improving': 'Mejorando',
            'mejorando': 'Mejorando',
            'declining': 'Declinando',
            'declinando': 'Declinando',
            'stable': 'Estable',
            'estable': 'Estable',
            'fluctuating': 'Fluctuante',
            'fluctuante': 'Fluctuante',
        };
        return trendMap[trend.toLowerCase()] || trend;
    };

    const getRiskInterpretation = (level: string) => {
        switch (level.toUpperCase()) {
            case 'ALTO':
                return {
                    title: 'Riesgo Alto',
                    description: 'El desempeño académico de tu hijo/a muestra indicadores que requieren atención inmediata.',
                    action: 'Se recomienda comunicarse con los profesores para obtener más información y establecer un plan de apoyo.',
                    color: 'bg-red-50 border-red-200',
                    icon: 'text-red-600',
                };
            case 'MEDIO':
                return {
                    title: 'Riesgo Medio',
                    description: 'El desempeño tiene algunos aspectos que podrían mejorarse.',
                    action: 'Considera dedicar más tiempo a estudiar juntos o buscar ayuda en áreas débiles.',
                    color: 'bg-yellow-50 border-yellow-200',
                    icon: 'text-yellow-600',
                };
            case 'BAJO':
                return {
                    title: 'Riesgo Bajo',
                    description: 'El desempeño académico es sólido y sostenido.',
                    action: 'Continúa apoyando su buen trabajo y mantén el seguimiento regular.',
                    color: 'bg-green-50 border-green-200',
                    icon: 'text-green-600',
                };
            default:
                return {
                    title: 'Información No Disponible',
                    description: 'No hay datos suficientes.',
                    action: 'Por favor intenta más tarde.',
                    color: 'bg-gray-50 border-gray-200',
                    icon: 'text-gray-600',
                };
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <Head title="Monitoreo de Desempeño - Hijo" />
                <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <Head title="Monitoreo de Desempeño - Hijo" />
                <div className="max-w-4xl mx-auto">
                    <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>

                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </AppLayout>
        );
    }

    if (!riskData) {
        return (
            <AppLayout>
                <Head title="Monitoreo de Desempeño - Hijo" />
                <div className="max-w-4xl mx-auto">
                    <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>No hay datos disponibles</AlertDescription>
                    </Alert>
                </div>
            </AppLayout>
        );
    }

    const interpretation = getRiskInterpretation(riskData.risk_level);

    return (
        <AppLayout>
            <Head title={`Análisis de Riesgo - ${riskData.student_name}`} />

            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Monitoreo de Desempeño Académico</h1>
                    <p className="text-gray-500 mt-2">
                        {riskData.student_name} • Última actualización: {new Date(riskData.last_update).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                {/* Main Risk Score Card */}
                <Card className={`border-0 shadow-md border-l-4 ${getRiskBorderColor(riskData.risk_level)} mb-6`}>
                    <CardHeader>
                        <CardTitle className="text-2xl">Puntuación de Riesgo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Score Display */}
                        <div>
                            <div className="flex items-end justify-between mb-4">
                                <span className="text-lg font-semibold text-gray-700">Puntuación</span>
                                <span className={`text-5xl font-bold ${getRiskColor(riskData.risk_level)}`}>
                                    {Math.round(riskData.risk_score * 100)}%
                                </span>
                            </div>
                            <Progress
                                value={riskData.risk_score * 100}
                                className="h-3"
                            />
                        </div>

                        {/* Grid Info */}
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Nivel de Riesgo</p>
                                <p className={`text-2xl font-bold ${getRiskColor(riskData.risk_level)}`}>
                                    {riskData.risk_level.charAt(0).toUpperCase() + riskData.risk_level.slice(1).toLowerCase()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Nivel de Confianza</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {Math.round(riskData.confidence * 100)}%
                                </p>
                            </div>
                        </div>

                        {/* Trend */}
                        <div className="flex items-center gap-4 pt-4 border-t">
                            <div className="flex items-center gap-3">
                                {getTrendIcon(riskData.trend)}
                                <div>
                                    <p className="text-sm text-gray-600">Tendencia Actual</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {getTrendLabel(riskData.trend)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Interpretation Alert */}
                <div className={`border-2 rounded-lg p-6 mb-6 ${interpretation.color}`}>
                    <div className="flex items-start gap-4">
                        <AlertCircle className={`w-6 h-6 ${interpretation.icon} flex-shrink-0 mt-1`} />
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{interpretation.title}</h3>
                            <p className="text-gray-700 mt-2">{interpretation.description}</p>
                            <p className="text-gray-700 mt-2">{interpretation.action}</p>
                        </div>
                    </div>
                </div>

                {/* Factors Grid */}
                {riskData.factors && riskData.factors.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Factores que Influyen en el Riesgo</CardTitle>
                            <CardDescription>
                                Principales factores que afectan la puntuación
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {riskData.factors.map((factor, idx) => (
                                    <div key={idx} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900">{factor.name}</h4>
                                            <span className="text-sm font-medium text-gray-600">
                                                Impacto: {Math.round(factor.impact * 100)}%
                                            </span>
                                        </div>
                                        <Progress value={factor.impact * 100} className="h-2 mb-2" />
                                        <p className="text-sm text-gray-600">{factor.interpretation}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recent Grades */}
                {riskData.recent_grades && riskData.recent_grades.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Calificaciones Recientes</CardTitle>
                            <CardDescription>Últimas 5 calificaciones</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {riskData.recent_grades.map((grade, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{grade.subject}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(grade.date).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                        <span className="text-2xl font-bold text-gray-900">{grade.grade.toFixed(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Recommendations */}
                {riskData.recommendations && riskData.recommendations.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Recomendaciones para el Apoyo Académico</CardTitle>
                            <CardDescription>Acciones sugeridas para mejorar el desempeño</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {riskData.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-700 pt-0.5">{rec}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Parent Actions */}
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">Próximos Pasos</h3>
                    <p className="text-gray-700 mb-4">
                        Si tienes preguntas o necesitas más información, no dudes en contactar a los profesores o directores académicos.
                    </p>
                    <div className="flex gap-4">
                        <a href="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Volver al Dashboard
                        </a>
                        <a href="#" className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300">
                            Contactar Profesor
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
