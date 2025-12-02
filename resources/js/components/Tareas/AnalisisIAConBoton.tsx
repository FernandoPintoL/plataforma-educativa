import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  SparklesIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  PaperClipIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { AnalisisIAService, type AnalisisResponse, type UploadProgress } from '@/services/analisisIAService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AnalisisIA {
  id: number;
  porcentaje_ia: number;
  estado: string;
  fecha_analisis?: string;
  detalles_analisis?: Record<string, any>;
  mensaje_error?: string;
}

interface Props {
  trabajo?: {
    id: number;
    respuestas?: {
      archivos?: Array<{
        nombre: string;
        path: string;
        tamaño: number;
      }>;
    };
  };
  analisisIA?: AnalisisIA | null;
  onAnalisisCompleto?: (resultado: AnalisisResponse) => void;
}

type EstadoAnalisis = 'idle' | 'cargando' | 'analizando' | 'completado' | 'pendiente' | 'error';

export default function AnalisisIAConBoton({ trabajo, analisisIA, onAnalisisCompleto }: Props) {
  const [estado, setEstado] = useState<EstadoAnalisis>(
    analisisIA ? 'completado' : 'idle'
  );
  const [progreso, setProgreso] = useState<UploadProgress | null>(null);
  const [resultado, setResultado] = useState<AnalisisResponse | null>(
    analisisIA
      ? {
          success: true,
          porcentaje_ia: analisisIA.porcentaje_ia,
          detalles: analisisIA.detalles_analisis || { total_palabras: 0, confianza: 0 },
        }
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const archivoInputRef = useRef<HTMLInputElement>(null);

  const descripcion = resultado
    ? AnalisisIAService.getDescripcion(resultado.porcentaje_ia)
    : null;

  const handleAnalizarClick = () => {
    archivoInputRef.current?.click();
  };

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    setEstado('cargando');
    setError(null);
    setProgreso(null);
    setResultado(null);

    try {
      // Paso 1: Cargar archivo
      await AnalisisIAService.analizarPDF(
        archivo,
        (progress) => {
          setProgreso(progress);
          if (progress.porcentaje === 100) {
            setEstado('analizando');
          }
        }
      )
        .then((res) => {
          // Paso 2: Análisis completado o pendiente
          setResultado(res);

          // Verificar si el análisis está pendiente en el backend
          if (res.detalles?.estado === 'PENDIENTE' || res.detalles?.mensaje_estado) {
            setEstado('pendiente');
          } else {
            setEstado('completado');
          }

          setProgreso(null);
          onAnalisisCompleto?.(res);
        })
        .catch((err) => {
          throw err;
        });
    } catch (err: any) {
      const mensaje = err.message || 'Error desconocido';
      setError(mensaje);
      setEstado('error');
      console.error('Error en análisis:', err);
    }

    // Limpiar input
    if (archivoInputRef.current) {
      archivoInputRef.current.value = '';
    }
  };

  // Estado: Sin análisis
  if (!resultado && estado === 'idle') {
    return (
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-gray-600" />
            Análisis de Detección de IA
          </CardTitle>
          <CardDescription>
            Analiza el documento para detectar contenido generado por IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Este análisis utiliza tecnología avanzada para detectar si el documento contiene
            contenido generado por inteligencia artificial. Haz clic en el botón para comenzar.
          </p>

          <input
            ref={archivoInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleArchivo}
            className="hidden"
            disabled={estado !== 'idle' && estado !== 'completado'}
          />

          <Button
            onClick={handleAnalizarClick}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={estado === 'cargando' || estado === 'analizando'}
          >
            {estado === 'cargando' || estado === 'analizando' ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Realizar Análisis
              </>
            )}
          </Button>

          {trabajo?.respuestas?.archivos && trabajo.respuestas.archivos.length > 0 && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold">Archivos disponibles:</p>
              {trabajo.respuestas.archivos.map((archivo, idx) => (
                <div key={idx} className="flex items-center gap-2 ml-2">
                  <PaperClipIcon className="h-3 w-3" />
                  <span>{archivo.nombre}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Estado: Cargando/Analizando
  if (estado === 'cargando' || estado === 'analizando') {
    return (
      <Card className="border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowPathIcon className="h-5 w-5 text-blue-600 animate-spin" />
            {estado === 'cargando' ? 'Cargando documento...' : 'Analizando...'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {progreso && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progreso de carga</span>
                  <span className="text-sm text-muted-foreground">{progreso.porcentaje}%</span>
                </div>
                <Progress value={progreso.porcentaje} className="h-2" />
              </div>
            </>
          )}
          {estado === 'analizando' && (
            <p className="text-sm text-muted-foreground">
              Procesando con inteligencia artificial. Por favor espera...
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Estado: Análisis Pendiente (en el backend)
  if (estado === 'pendiente') {
    return (
      <Card className="border-yellow-300 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowPathIcon className="h-5 w-5 text-yellow-600 animate-spin" />
            Análisis Pendiente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-yellow-300 bg-yellow-100">
            <AlertDescription className="text-yellow-800">
              📋 El documento ha sido registrado correctamente. El análisis se está procesando en el servidor.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">Información del documento:</p>
            {resultado?.detalles?.documento_id && (
              <div className="text-xs text-muted-foreground bg-white p-2 rounded border">
                <p>ID del documento: {resultado.detalles.documento_id}</p>
                {resultado.detalles.storage_key && (
                  <p>Ubicación: {resultado.detalles.storage_key}</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white p-3 rounded border border-yellow-200">
            <p className="text-sm text-yellow-900">
              ⏱️ {resultado?.detalles?.mensaje_estado || 'Los resultados estarán disponibles en breve. Puedes cerrar esta página y volver más tarde.'}
            </p>
          </div>

          <input
            ref={archivoInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleArchivo}
            className="hidden"
          />

          <Button
            onClick={handleAnalizarClick}
            variant="outline"
            className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Analizar otro documento
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Estado: Error
  if (estado === 'error') {
    return (
      <Card className="border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
            Error en el Análisis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-300 bg-red-100">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>

          <input
            ref={archivoInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleArchivo}
            className="hidden"
          />

          <Button
            onClick={handleAnalizarClick}
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-100"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Estado: Completado
  if (estado === 'completado' && resultado) {
    const porcentaje = resultado.porcentaje_ia;
    const desc = descripcion || AnalisisIAService.getDescripcion(porcentaje);

    return (
      <Card className={`border-2 ${desc.bg}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircleIcon className={`h-5 w-5 ${desc.color}`} />
                Análisis Completado
              </CardTitle>
              {analisisIA?.fecha_analisis && (
                <CardDescription>
                  Analizado el{' '}
                  {format(new Date(analisisIA.fecha_analisis), 'dd/MM/yyyy HH:mm', {
                    locale: es,
                  })}
                </CardDescription>
              )}
            </div>
            <input
              ref={archivoInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleArchivo}
              className="hidden"
            />
            <Button
              onClick={handleAnalizarClick}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <ArrowPathIcon className="h-3 w-3 mr-1" />
              Re-analizar
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Porcentaje Principal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Porcentaje de IA Detectado</span>
              <span className={`text-2xl font-bold ${desc.color}`}>{porcentaje}%</span>
            </div>
            <Progress
              value={porcentaje}
              className="h-3"
              style={{
                background: '#e5e7eb',
              }}
            />
          </div>

          {/* Interpretación */}
          <Alert className={`border-0 ${desc.bg}`}>
            <AlertDescription className={desc.color}>
              {desc.icon} {desc.texto}
            </AlertDescription>
          </Alert>

          {/* Badge de confianza */}
          {resultado.detalles?.confianza && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Confianza del análisis:</span>
              <Badge variant="outline">{(resultado.detalles.confianza * 100).toFixed(0)}%</Badge>
            </div>
          )}

          {/* Detalles */}
          {resultado.detalles && (
            <div className="border-t pt-4">
              <button
                onClick={() => setMostrarDetalles(!mostrarDetalles)}
                className="flex items-center gap-2 text-sm font-medium w-full py-2 hover:bg-gray-100 rounded px-2 transition"
              >
                {mostrarDetalles ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
                {mostrarDetalles ? 'Ocultar detalles' : 'Ver detalles técnicos'}
              </button>

              {mostrarDetalles && (
                <div className="mt-3 bg-gray-50 rounded p-3 text-xs font-mono space-y-1">
                  {resultado.detalles.total_palabras && (
                    <div>Total palabras: {resultado.detalles.total_palabras}</div>
                  )}
                  {resultado.detalles.porcentaje_por_seccion && (
                    <div className="mt-2">
                      <div className="font-semibold mb-1">Porcentaje por sección:</div>
                      <div className="ml-2 space-y-1">
                        {Object.entries(resultado.detalles.porcentaje_por_seccion).map(
                          ([seccion, porc]) => (
                            <div key={seccion}>
                              {seccion}: {typeof porc === 'number' ? porc.toFixed(1) : porc}%
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  {Object.entries(resultado.detalles).map(([key, value]) => {
                    if (
                      ['total_palabras', 'confianza', 'porcentaje_por_seccion'].includes(key)
                    ) {
                      return null;
                    }
                    return (
                      <div key={key}>
                        {key}: {JSON.stringify(value)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Recomendaciones */}
          <Alert className="border-blue-300 bg-blue-50">
            <AlertDescription className="text-blue-800 text-sm">
              💡 <strong>Consejo:</strong> Utiliza este análisis como referencia, pero verifica
              siempre manualmente el trabajo del estudiante.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return null;
}
