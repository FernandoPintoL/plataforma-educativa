import React, { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChildAlert {
    type: 'danger' | 'warning' | 'info' | 'success';
    studentId: number;
    studentName: string;
    message: string;
    timestamp: string;
    actionUrl?: string;
}

export function AlertsWidget() {
    const [alerts, setAlerts] = useState<ChildAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleAlerts, setVisibleAlerts] = useState<number[]>([]);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/padre/hijos', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const generatedAlerts = await generateAlertsFromChildren(data.hijos || []);
                setAlerts(generatedAlerts);
                setVisibleAlerts(generatedAlerts.map((_, idx) => idx));
            }
        } catch (err) {
            console.error('Error fetching alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateAlertsFromChildren = async (children: any[]) => {
        const alerts: ChildAlert[] = [];

        for (const child of children) {
            try {
                const response = await fetch(`/api/padre/hijos/${child.id}/riesgo`, {
                    headers: { 'Accept': 'application/json' },
                });

                if (response.ok) {
                    const riskData = await response.json();

                    // High risk alert
                    if (riskData.risk_level?.toUpperCase() === 'ALTO') {
                        alerts.push({
                            type: 'danger',
                            studentId: child.id,
                            studentName: child.name,
                            message: `${child.name} presenta RIESGO ALTO en su desempeño académico (${Math.round(riskData.risk_score * 100)}%). Requiere atención inmediata.`,
                            timestamp: new Date().toISOString(),
                            actionUrl: `/padre/hijo/${child.id}/riesgo`,
                        });
                    }

                    // Medium risk alert
                    if (riskData.risk_level?.toUpperCase() === 'MEDIO') {
                        alerts.push({
                            type: 'warning',
                            studentId: child.id,
                            studentName: child.name,
                            message: `${child.name} presenta RIESGO MEDIO. Se recomienda seguimiento académico más cercano.`,
                            timestamp: new Date().toISOString(),
                            actionUrl: `/padre/hijo/${child.id}/riesgo`,
                        });
                    }

                    // Low confidence alert
                    if (riskData.confidence < 0.6) {
                        alerts.push({
                            type: 'info',
                            studentId: child.id,
                            studentName: child.name,
                            message: `Datos limitados para ${child.name}. Se necesita más información para un análisis preciso.`,
                            timestamp: new Date().toISOString(),
                        });
                    }

                    // Good performance alert
                    if (riskData.risk_level?.toUpperCase() === 'BAJO') {
                        alerts.push({
                            type: 'success',
                            studentId: child.id,
                            studentName: child.name,
                            message: `Excelente desempeño de ${child.name}. Continúa apoyando su buen trabajo académico.`,
                            timestamp: new Date().toISOString(),
                        });
                    }
                }
            } catch (err) {
                console.error(`Error fetching risk data for child ${child.id}:`, err);
            }
        }

        return alerts;
    };

    const dismissAlert = (index: number) => {
        setVisibleAlerts(visibleAlerts.filter(i => i !== index));
    };

    const getAlertIcon = (type: ChildAlert['type']) => {
        switch (type) {
            case 'danger':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getAlertColor = (type: ChildAlert['type']) => {
        switch (type) {
            case 'danger':
                return 'bg-red-50 border-red-200 border-l-4 border-l-red-500';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-500';
            case 'success':
                return 'bg-green-50 border-green-200 border-l-4 border-l-green-500';
            case 'info':
                return 'bg-blue-50 border-blue-200 border-l-4 border-l-blue-500';
        }
    };

    const getAlertTextColor = (type: ChildAlert['type']) => {
        switch (type) {
            case 'danger':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            case 'success':
                return 'text-green-800';
            case 'info':
                return 'text-blue-800';
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Alertas Académicas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const visibleAlertsData = alerts.filter((_, idx) => visibleAlerts.includes(idx));

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Alertas Académicas</CardTitle>
                <span className="text-sm font-semibold text-gray-600">
                    {visibleAlertsData.length} {visibleAlertsData.length === 1 ? 'alerta' : 'alertas'}
                </span>
            </CardHeader>
            <CardContent>
                {visibleAlertsData.length > 0 ? (
                    <div className="space-y-3">
                        {visibleAlertsData.map((alert, idx) => (
                            <div
                                key={idx}
                                className={`p-4 rounded-lg ${getAlertColor(alert.type)}`}
                            >
                                <div className="flex items-start gap-3">
                                    {getAlertIcon(alert.type)}
                                    <div className="flex-1">
                                        <p className={`font-medium ${getAlertTextColor(alert.type)}`}>
                                            {alert.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <p className="text-xs text-gray-600">
                                                {new Date(alert.timestamp).toLocaleDateString('es-ES', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                            {alert.actionUrl && (
                                                <>
                                                    <span className="text-gray-400">•</span>
                                                    <a
                                                        href={alert.actionUrl}
                                                        className={`text-xs font-medium hover:underline ${
                                                            alert.type === 'danger' ? 'text-red-600' :
                                                            alert.type === 'warning' ? 'text-yellow-600' :
                                                            alert.type === 'success' ? 'text-green-600' :
                                                            'text-blue-600'
                                                        }`}
                                                    >
                                                        Ver detalles
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => dismissAlert(alerts.indexOf(alert))}
                                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label="Cerrar alerta"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">
                            No hay alertas. El desempeño académico de todos tus hijos es satisfactorio.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
