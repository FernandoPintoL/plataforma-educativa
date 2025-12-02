import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface AnalisisIA {
  id: number;
  porcentaje_ia: number;
  estado: string;
  fecha_analisis?: string;
  detalles_analisis?: Record<string, any>;
  mensaje_error?: string;
}

interface Props {
  analisisIA?: AnalisisIA | null;
  loading?: boolean;
}

export default function AnalisisIAWidget({ analisisIA, loading = false }: Props) {
  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-600" />
            Analizando documento...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              El documento está siendo analizado en busca de contenido generado por IA...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analisisIA) {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-gray-600" />
            Análisis de IA
          </CardTitle>
          <CardDescription>
            Ningún análisis disponible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            El documento no ha sido analizado aún o no se encontraron archivos PDF para analizar.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Si hay error
  if (analisisIA.estado === 'error') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircleIcon className="h-5 w-5 text-red-600" />
            Error en Análisis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-red-700">
            {analisisIA.mensaje_error || 'Error desconocido al procesar el análisis'}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Si el análisis está en progreso
  if (analisisIA.estado === 'pendiente' || analisisIA.estado === 'procesando') {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-yellow-600" />
            Análisis en Progreso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-700">
            El documento está siendo analizado. Los resultados estarán disponibles en breve.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Determinar color y mensajes según el porcentaje
  const porcentaje = Number(analisisIA.porcentaje_ia) || 0;
  let colorClase = 'border-green-200 bg-green-50';
  let iconColor = 'text-green-600';
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
  let titulo = 'Parece contenido original';
  let descripcion = 'El análisis no detectó patrones típicos de contenido generado por IA';

  if (porcentaje >= 80) {
    colorClase = 'border-red-200 bg-red-50';
    iconColor = 'text-red-600';
    badgeVariant = 'destructive';
    titulo = 'Alto riesgo de contenido IA';
    descripcion = 'Existe una alta probabilidad de que el documento haya sido generado o modificado por IA';
  } else if (porcentaje >= 50) {
    colorClase = 'border-orange-200 bg-orange-50';
    iconColor = 'text-orange-600';
    badgeVariant = 'destructive';
    titulo = 'Posible contenido IA detectado';
    descripcion = 'El análisis encontró patrones que sugieren contenido generado por IA';
  } else if (porcentaje >= 20) {
    colorClase = 'border-yellow-200 bg-yellow-50';
    iconColor = 'text-yellow-600';
    badgeVariant = 'outline';
    titulo = 'Similitud moderada con patrones de IA';
    descripcion = 'Se detectaron algunas características similares a contenido generado por IA';
  }

  return (
    <Card className={colorClase}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className={`h-5 w-5 ${iconColor}`} />
            {titulo}
          </CardTitle>
          <Badge variant={badgeVariant}>
            {porcentaje.toFixed(1)}% IA
          </Badge>
        </div>
        <CardDescription>{descripcion}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Barra de progreso visual */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Similitud detectada:</span>
            <span className="text-muted-foreground">{porcentaje.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                porcentaje >= 80
                  ? 'bg-red-500'
                  : porcentaje >= 50
                  ? 'bg-orange-500'
                  : porcentaje >= 20
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>

        {/* Alerta si hay contenido de IA */}
        {porcentaje >= 50 && (
          <Alert className={porcentaje >= 80 ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50'}>
            <ExclamationCircleIcon className={`h-4 w-4 ${porcentaje >= 80 ? 'text-red-600' : 'text-orange-600'}`} />
            <AlertDescription className={porcentaje >= 80 ? 'text-red-700' : 'text-orange-700'}>
              {porcentaje >= 80
                ? 'Se recomienda revisar cuidadosamente este trabajo y posiblemente entrevistar al estudiante.'
                : 'Se recomienda revisar este trabajo con atención especial.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Detalles adicionales si existen */}
        {analisisIA.detalles_analisis && Object.keys(analisisIA.detalles_analisis).length > 0 && (
          <details className="text-sm cursor-pointer">
            <summary className="font-medium text-gray-700 hover:text-gray-900">
              Ver detalles del análisis
            </summary>
            <div className="mt-2 p-2 bg-white rounded border border-gray-200 max-h-48 overflow-y-auto">
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-600">
                {JSON.stringify(analisisIA.detalles_analisis, null, 2)}
              </pre>
            </div>
          </details>
        )}

        {/* Fecha del análisis */}
        {analisisIA.fecha_analisis && (
          <p className="text-xs text-muted-foreground">
            Analizado el {new Date(analisisIA.fecha_analisis).toLocaleString('es-ES')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
