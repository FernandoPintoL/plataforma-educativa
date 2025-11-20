import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Briefcase, TrendingUp, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CareerRecommendation {
    rank: number;
    career: string;
    compatibility: number;
    description: string;
}

interface CareerData {
    student_id: number;
    careers: CareerRecommendation[];
}

export default function CarrerasPage() {
    const [careerData, setCareerData] = useState<CareerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCareerRecommendations();
    }, []);

    const fetchCareerRecommendations = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/mi-perfil/carreras', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar las recomendaciones de carrera');
            }

            const data = await response.json();
            setCareerData(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const getCompatibilityColor = (compatibility: number) => {
        if (compatibility >= 80) return 'text-green-600';
        if (compatibility >= 60) return 'text-blue-600';
        if (compatibility >= 40) return 'text-yellow-600';
        return 'text-orange-600';
    };

    const getCompatibilityBgColor = (compatibility: number) => {
        if (compatibility >= 80) return 'bg-green-50 border-green-200';
        if (compatibility >= 60) return 'bg-blue-50 border-blue-200';
        if (compatibility >= 40) return 'bg-yellow-50 border-yellow-200';
        return 'bg-orange-50 border-orange-200';
    };

    const getCompatibilityLabel = (compatibility: number) => {
        if (compatibility >= 80) return 'Muy Compatible';
        if (compatibility >= 60) return 'Compatible';
        if (compatibility >= 40) return 'Moderadamente Compatible';
        return 'Menos Compatible';
    };

    if (loading) {
        return (
            <AppLayout>
                <Head title="Mis Carreras Recomendadas" />
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
                <Head title="Mis Carreras Recomendadas" />
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

    if (!careerData) {
        return (
            <AppLayout>
                <Head title="Mis Carreras Recomendadas" />
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

    return (
        <AppLayout>
            <Head title="Mis Carreras Recomendadas" />

            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:underline mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Dashboard
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Carreras Recomendadas para Ti</h1>
                    <p className="text-gray-500 mt-2">
                        Basadas en tu perfil académico y aptitudes
                    </p>
                </div>

                {/* Intro Card */}
                <Card className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                            Tu Perfil Vocacional
                        </CardTitle>
                        <CardDescription>
                            Las siguientes carreras están recomendadas según tu desempeño académico, aptitudes y perfil de aprendizaje
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Career Recommendations Grid */}
                {careerData.careers && careerData.careers.length > 0 ? (
                    <div className="space-y-6">
                        {careerData.careers.map((career, idx) => (
                            <div
                                key={idx}
                                className={`border-2 rounded-lg p-6 ${getCompatibilityBgColor(career.compatibility)} transition-all hover:shadow-lg`}
                            >
                                {/* Rank Badge */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${
                                            idx === 0 ? 'bg-yellow-400 text-white font-bold text-lg' :
                                            idx === 1 ? 'bg-gray-400 text-white font-bold text-lg' :
                                            idx === 2 ? 'bg-orange-600 text-white font-bold text-lg' :
                                            'bg-gray-300 text-white font-bold'
                                        }`}>
                                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">{career.career}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{career.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Compatibility Score */}
                                <div className="mt-6 pt-6 border-t border-current border-opacity-20">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                                            <span className="font-semibold text-gray-700">Compatibilidad</span>
                                        </div>
                                        <span className={`text-2xl font-bold ${getCompatibilityColor(career.compatibility)}`}>
                                            {Math.round(career.compatibility)}%
                                        </span>
                                    </div>

                                    {/* Compatibility Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${
                                                career.compatibility >= 80 ? 'bg-green-500' :
                                                career.compatibility >= 60 ? 'bg-blue-500' :
                                                career.compatibility >= 40 ? 'bg-yellow-500' :
                                                'bg-orange-500'
                                            }`}
                                            style={{ width: `${career.compatibility}%` }}
                                        />
                                    </div>

                                    {/* Compatibility Label */}
                                    <p className={`text-sm font-medium mt-2 ${getCompatibilityColor(career.compatibility)}`}>
                                        {getCompatibilityLabel(career.compatibility)}
                                    </p>
                                </div>

                                {/* Why This Career */}
                                <div className="mt-6 pt-6 border-t border-current border-opacity-20">
                                    <h4 className="font-semibold text-gray-900 mb-3">Por qué esta carrera te conviene:</h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex gap-2">
                                            <span className="text-indigo-600 font-bold">✓</span>
                                            <span>Alineada con tu perfil de aptitudes y fortalezas académicas</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-indigo-600 font-bold">✓</span>
                                            <span>Ofrece oportunidades de desarrollo profesional en el mercado actual</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-indigo-600 font-bold">✓</span>
                                            <span>Requiere habilidades donde has mostrado excelente desempeño</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Next Steps */}
                                <div className="mt-6 pt-6 border-t border-current border-opacity-20">
                                    <h4 className="font-semibold text-gray-900 mb-3">Próximos Pasos:</h4>
                                    <div className="flex gap-3">
                                        <a
                                            href="#"
                                            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors text-center"
                                        >
                                            Más Información
                                        </a>
                                        <a
                                            href="#"
                                            className="flex-1 px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-md text-sm font-medium transition-colors text-center"
                                        >
                                            Ver Universidades
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="pt-8">
                            <div className="text-center py-12">
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin recomendaciones disponibles</h3>
                                <p className="text-gray-500">
                                    Aún no hay datos suficientes para hacer recomendaciones de carrera. Intenta más tarde.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Support Section */}
                <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-gray-900 mb-2">¿Necesitas ayuda?</h3>
                    <p className="text-gray-700 mb-4">
                        Si tienes preguntas sobre estas recomendaciones de carrera o necesitas más información, comunícate con tu orientador educativo.
                    </p>
                    <div className="flex gap-4">
                        <a href="/contacto/orientador" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                            Contactar Orientador
                        </a>
                        <a href="/mi-perfil/riesgo" className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 text-sm font-medium">
                            Ver Mi Análisis de Riesgo
                        </a>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
