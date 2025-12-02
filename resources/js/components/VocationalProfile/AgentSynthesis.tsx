import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Sparkles,
  Loader,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Brain,
  Lightbulb,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface AgentSynthesisProps {
  studentId?: number;
  triggerLoad?: boolean;
}

interface SynthesisData {
  sintesis: string;
  recomendaciones: string[];
  pasos_siguientes: string[];
  fortalezas: string[];
  areas_mejora: string[];
}

export default function AgentSynthesis({ studentId, triggerLoad = false }: AgentSynthesisProps) {
  const [data, setData] = useState<SynthesisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const generarSintesis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vocacional/generar-sintesis-agente', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al generar síntesis');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.message || 'Error desconocido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar síntesis');
    } finally {
      setLoading(false);
    }
  };

  // Auto-load cuando se monta o si triggerLoad cambia
  useEffect(() => {
    if (triggerLoad) {
      generarSintesis();
    }
  }, [triggerLoad]);

  return (
    <div className="space-y-4">
      {/* Header con botón de generar */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <CardTitle className="text-purple-900 dark:text-purple-100">
                  Síntesis Inteligente
                </CardTitle>
                <CardDescription className="text-purple-700 dark:text-purple-300">
                  Análisis personalizado generado por IA
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={generarSintesis}
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : data ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Regenerar
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generar Síntesis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Síntesis narrativa */}
      {data && (
        <Card className="border-2 border-purple-100 dark:border-purple-900 shadow-lg overflow-hidden">
          <CardHeader
            className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950 dark:to-transparent"
            onClick={() => setExpanded(!expanded)}
          >
            <CardTitle className="text-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-gray-900 dark:text-white">Tu Perfil Vocacional</span>
              </div>
              <span className="text-sm font-normal text-gray-500 transition-transform" style={{
                transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)'
              }}>
                ▼
              </span>
            </CardTitle>
          </CardHeader>

          {expanded && (
            <CardContent className="space-y-8 pt-6">
              {/* Narrativa principal - Mejorada */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Análisis de tu Perfil
                </h3>
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {/* Dividir síntesis en párrafos */}
                  {data.sintesis.split('\n\n').map((parrafo, idx) => (
                    <p key={idx} className="text-sm sm:text-base">
                      {parrafo}
                    </p>
                  ))}
                </div>
              </div>

              {/* Fortalezas - Diseño mejorado */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Tus Fortalezas
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {data.fortalezas?.map((fortaleza, idx) => {
                    const icons = [
                      <Zap key="0" className="w-5 h-5" />,
                      <Brain key="1" className="w-5 h-5" />,
                      <CheckCircle key="2" className="w-5 h-5" />
                    ];
                    return (
                      <div
                        key={idx}
                        className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-200 dark:border-green-800 p-4 transition-all duration-300 hover:shadow-lg hover:border-green-400 dark:hover:border-green-600"
                      >
                        {/* Fondo animado */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-green-400 transition-opacity duration-300" />

                        <div className="relative flex items-start gap-3">
                          <div className="flex-shrink-0 text-green-600 dark:text-green-400 mt-0.5">
                            {icons[idx % icons.length]}
                          </div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            {fortaleza}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Áreas para Desarrollar - Diseño mejorado */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Áreas para Desarrollar
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {data.areas_mejora?.map((area, idx) => (
                    <div
                      key={idx}
                      className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border-2 border-amber-200 dark:border-amber-800 p-4 transition-all duration-300 hover:shadow-lg hover:border-amber-400 dark:hover:border-amber-600"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-amber-400 transition-opacity duration-300" />

                      <div className="relative flex items-start gap-3">
                        <div className="flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5">
                          <Lightbulb className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          {area}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendaciones - Mejoradas */}
              {data.recomendaciones && data.recomendaciones.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recomendaciones
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {data.recomendaciones.map((rec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 bg-cyan-50 dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-cyan-200 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-300 font-bold text-sm">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-cyan-900 dark:text-cyan-100 pt-0.5">
                          {rec}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Próximos Pasos - Timeline mejorado */}
              {data.pasos_siguientes && data.pasos_siguientes.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                      <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tu Ruta de Acción
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {data.pasos_siguientes.map((paso, idx) => (
                      <div key={idx} className="flex gap-4">
                        {/* Timeline línea */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-lg">
                            {idx + 1}
                          </div>
                          {idx < data.pasos_siguientes.length - 1 && (
                            <div className="w-1 h-12 bg-gradient-to-b from-indigo-300 to-transparent dark:from-indigo-700 mt-2" />
                          )}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1 pt-1 pb-4">
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-shadow">
                            <p className="text-sm text-indigo-900 dark:text-indigo-100 leading-relaxed">
                              {paso}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer con información */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Esta síntesis fue generada por IA (GROQ/Claude) basada en tu perfil vocacional
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Estado de carga */}
      {loading && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3">
              <Loader className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-blue-700 dark:text-blue-300">
                Generando síntesis inteligente...
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
