import React, { useEffect, useState } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendData {
    labels: string[];
    scores: number[];
}

interface TrendWidgetData {
    trend_data: TrendData;
    trend: string;
}

export function TrendWidget() {
    const [trendData, setTrendData] = useState<TrendWidgetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTrendData();
    }, []);

    const fetchTrendData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/mi-perfil/riesgo', {
                method: 'GET',
                credentials: 'include', // Enviar cookies de sesión
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar datos de tendencia');
            }

            const data = await response.json();
            setTrendData({
                trend_data: data.trend_data,
                trend: data.trend,
            });
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
            setTrendData(null);
        } finally {
            setLoading(false);
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

    const getTrendColor = (trend: string) => {
        switch (trend.toLowerCase()) {
            case 'improving':
            case 'mejorando':
                return 'bg-green-50 border-green-200';
            case 'declining':
            case 'declinando':
                return 'bg-red-50 border-red-200';
            case 'stable':
            case 'estable':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getMaxScore = (scores: number[]) => Math.max(...scores, 100);
    const getMinScore = (scores: number[]) => Math.min(...scores, 0);

    if (loading) {
        return (
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Mi Tendencia Académica</CardTitle>
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
            <Card className="border-0 shadow-sm border-l-4 border-l-orange-500">
                <CardHeader>
                    <CardTitle className="text-lg text-orange-700">Mi Tendencia Académica</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-orange-600">{error}</p>
                    <button
                        onClick={fetchTrendData}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Reintentar
                    </button>
                </CardContent>
            </Card>
        );
    }

    if (!trendData) {
        return null;
    }

    const { labels, scores } = trendData.trend_data;
    const maxScore = getMaxScore(scores);
    const minScore = getMinScore(scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const currentScore = scores[scores.length - 1];

    // Simple mini chart display
    const chartHeight = 60;
    const range = maxScore - minScore || 100;

    return (
        <Card className={`border-0 shadow-sm border-l-4 ${getTrendColor(trendData.trend)}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">Mi Tendencia Académica</CardTitle>
                        <CardDescription>
                            Últimos 12 meses de desempeño
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {getTrendIcon(trendData.trend)}
                        <span className="text-sm font-semibold text-gray-700">
                            {getTrendLabel(trendData.trend)}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Simple Bar Chart */}
                <div className="space-y-2">
                    <div className="flex items-end justify-between gap-1" style={{ height: `${chartHeight}px` }}>
                        {scores.map((score, idx) => {
                            const normalizedScore = (score - minScore) / range;
                            const barHeight = normalizedScore * 100;
                            const isLatest = idx === scores.length - 1;

                            return (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                                >
                                    <div className="text-xs text-gray-500 group-hover:text-gray-700 font-medium">
                                        {score.toFixed(0)}
                                    </div>
                                    <div
                                        className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                                            isLatest ? 'bg-blue-600' : 'bg-blue-400'
                                        }`}
                                        style={{ height: `${Math.max(barHeight, 5)}%` }}
                                        title={`${labels[idx]}: ${score.toFixed(1)}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 px-1">
                        <span>{labels[0]}</span>
                        <span>{labels[Math.floor(labels.length / 2)]}</span>
                        <span>{labels[labels.length - 1]}</span>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center">
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Promedio</p>
                        <p className="text-sm font-bold text-gray-900">{avgScore.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Actual</p>
                        <p className="text-sm font-bold text-blue-600">{currentScore.toFixed(1)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Máximo</p>
                        <p className="text-sm font-bold text-green-600">{maxScore.toFixed(1)}</p>
                    </div>
                </div>

                {/* CTA */}
                <div className="pt-2">
                    <a
                        href="/mi-perfil/riesgo"
                        className="w-full block text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-md transition-colors"
                    >
                        Ver Análisis Completo
                    </a>
                </div>
            </CardContent>
        </Card>
    );
}
