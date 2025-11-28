import React, { useEffect, useState } from 'react';
import { AlertCircle, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import axios from '@/config/axiosConfig';

interface RiskData {
    risk_score: number;
    risk_level: string;
    confidence: number;
    trend: string;
    last_update: string;
}

export function RiskWidget() {
    const [riskData, setRiskData] = useState<RiskData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRiskData();
    }, []);

    const fetchRiskData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/mi-perfil/riesgo');

            if (response.data.success) {
                setRiskData(response.data);
                setError(null);
            } else {
                // No risk data available yet - this is normal for new students
                setRiskData(null);
                setError(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error cargando datos de riesgo');
            setRiskData(null);
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

    const getRiskBgColor = (level: string) => {
        switch (level.toUpperCase()) {
            case 'ALTO':
                return 'bg-red-50 border-red-200';
            case 'MEDIO':
                return 'bg-yellow-50 border-yellow-200';
            case 'BAJO':
                return 'bg-green-50 border-green-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend.toLowerCase()) {
            case 'improving':
            case 'mejorando':
                return <TrendingUp className="w-4 h-4 text-green-600" />;
            case 'declining':
            case 'declinando':
                return <TrendingDown className="w-4 h-4 text-red-600" />;
            case 'stable':
            case 'estable':
                return <Minus className="w-4 h-4 text-gray-600" />;
            default:
                return <Minus className="w-4 h-4 text-gray-400" />;
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

    if (loading) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Mi Puntuación de Riesgo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="border-0 shadow-sm border-l-4 border-l-red-500">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        Mi Puntuación de Riesgo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                        onClick={fetchRiskData}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Reintentar
                    </button>
                </CardContent>
            </Card>
        );
    }

    if (!riskData) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Mi Puntuación de Riesgo</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">No hay datos disponibles</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`border-0 shadow-sm border-l-4 ${getRiskBgColor(riskData.risk_level)}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">Mi Puntuación de Riesgo</CardTitle>
                        <CardDescription>
                            Última actualización: {new Date(riskData.last_update).toLocaleDateString('es-ES')}
                        </CardDescription>
                    </div>
                    {riskData.risk_level.toUpperCase() === 'ALTO' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Risk Score */}
                <div>
                    <div className="flex items-end justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">Puntuación de Riesgo</label>
                        <span className={`text-3xl font-bold ${getRiskColor(riskData.risk_level)}`}>
                            {Math.round(riskData.risk_score * 100)}%
                        </span>
                    </div>
                    <Progress
                        value={riskData.risk_score * 100}
                        className="h-2"
                    />
                </div>

                {/* Risk Level Badge */}
                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium text-gray-700">Nivel de Riesgo:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(riskData.risk_level)}`}>
                        {riskData.risk_level.charAt(0).toUpperCase() + riskData.risk_level.slice(1).toLowerCase()}
                    </span>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Confianza:</span>
                    <span className="text-sm text-gray-600">
                        {Math.round(riskData.confidence * 100)}%
                    </span>
                </div>

                {/* Trend */}
                <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-medium text-gray-700">Tendencia:</span>
                    <div className="flex items-center gap-2">
                        {getTrendIcon(riskData.trend)}
                        <span className="text-sm text-gray-600">
                            {getTrendLabel(riskData.trend)}
                        </span>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                    <a
                        href="/mi-perfil/riesgo"
                        className="w-full block text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        Ver Análisis Completo
                    </a>
                </div>

                {/* Warning Message for High Risk */}
                {riskData.risk_level.toUpperCase() === 'ALTO' && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md">
                        <p className="text-sm text-red-800">
                            <strong>⚠️ Riesgo Alto:</strong> Te recomendamos hablar con tu profesor o director para recibir apoyo adicional.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
