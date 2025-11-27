import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DocumentTextIcon, ArrowLeftIcon, CheckCircleIcon, LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { type BreadcrumbItem } from '@/types';
import { ContentAssistant, type ContentSuggestions } from '@/components/ContentAssistant';
import EvaluacionForm from '@/components/Forms/EvaluacionForm';
import EvaluacionPreview from '@/components/Forms/EvaluacionPreview';
import PreviewControls from '@/components/Forms/PreviewControls';
import EvaluacionAnalyzer from '@/components/EvaluationEnhancement/EvaluacionAnalyzer';
import { usePreviewToggle } from '@/hooks/usePreviewToggle';

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Props {
  cursos: Curso[];
}

interface Pregunta {
  enunciado: string;
  tipo: string;
  opciones: string[];
  respuesta_correcta: string;
  puntos: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Evaluaciones',
    href: '/evaluaciones',
  },
  {
    title: 'Crear',
    href: '/evaluaciones/create',
  },
];

export default function Create({ cursos }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    titulo: '',
    descripcion: '',
    curso_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    tipo_evaluacion: 'examen',
    puntuacion_total: 100,
    tiempo_limite: 60,
    calificacion_automatica: true,
    mostrar_respuestas: true,
    permite_reintento: false,
    max_reintentos: 1,
    estado: 'borrador',
    preguntas: [] as Pregunta[],
  });

  // Preview state
  const [previewData, setPreviewData] = useState({});
  const { isPreviewVisible, togglePreview, layoutMode, setLayoutMode } = usePreviewToggle('side');

  // Analysis state
  const [analysisData, setAnalysisData] = useState<any>(null);

  /**
   * Manejar cuando se aplican sugerencias del agente
   * Auto-llena los campos del formulario con las sugerencias
   */
  const handleApplySuggestions = (suggestions: ContentSuggestions) => {
    setData({
      ...data,
      descripcion: suggestions.descripcion || data.descripcion,
      tiempo_limite: suggestions.tiempo_limite || data.tiempo_limite,
      puntuacion_total: suggestions.puntuacion_total || data.puntuacion_total,
    });
  };

  const handleSubmit = (e: React.FormEvent, estado: string) => {
    e.preventDefault();
    setData('estado', estado);
    post('/evaluaciones');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DocumentTextIcon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Crear Nueva Evaluación</h1>
              <p className="text-muted-foreground text-lg mt-1">
                Diseña evaluaciones con preguntas personalizadas y configuración flexible
              </p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-blue-900">Múltiples Formatos</p>
                    <p className="text-xs text-blue-700 mt-1">Opción múltiple, V/F, respuestas cortas y largas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <SparklesIcon className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-purple-900">Flexible</p>
                    <p className="text-xs text-purple-700 mt-1">Configura tiempo, reintentos y calificación automática</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <LightBulbIcon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-green-900">Inteligente</p>
                    <p className="text-xs text-green-700 mt-1">Asistencia IA para crear evaluaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Layout con Preview */}
        <div className={layoutMode === 'fullscreen' ? '' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
          {/* Columna Izquierda: Formulario */}
          <div>
            <PreviewControls
              isVisible={isPreviewVisible}
              onToggle={togglePreview}
              layoutMode={layoutMode}
              onLayoutChange={setLayoutMode}
              className="mb-4"
            />

            <ContentAssistant
              contentType="evaluacion"
              courseId={parseInt(data.curso_id.toString()) || null}
              courses={cursos}
              onSuggestionsApplied={handleApplySuggestions}
              title="Crear Evaluación"
            >
              {/* EvaluacionForm - Formulario reutilizable */}
              <EvaluacionForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                cursos={cursos}
                onSubmit={handleSubmit}
                onPreviewDataChange={setPreviewData}
              />
            </ContentAssistant>
          </div>

          {/* Columna Derecha: Preview */}
          {isPreviewVisible && layoutMode !== 'tabs' && (
            <div className="sticky top-4 h-fit">
              <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="border-b border-blue-200 bg-blue-100/50">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>👁️</span> Vista Previa del Estudiante
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Así es como verán los estudiantes esta evaluación
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <EvaluacionPreview data={previewData} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">💡 Consejos para Crear Mejores Evaluaciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Claridad:</strong> Escribe preguntas claras y concisas para evitar confusión en los estudiantes.
              </AlertDescription>
            </Alert>
            <Alert>
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Variedad:</strong> Usa diferentes tipos de preguntas para evaluar distintos niveles de comprensión.
              </AlertDescription>
            </Alert>
            <Alert>
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Tiempo:</strong> Configura un tiempo límite realista basado en la cantidad y complejidad de preguntas.
              </AlertDescription>
            </Alert>
            <Alert>
              <CheckCircleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Retroalimentación:</strong> Habilita mostrar respuestas correctas para mejorar el aprendizaje.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* AI Analysis Section */}
        {data.preguntas.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <SparklesIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Análisis de Calidad con IA</h3>
                  <p className="text-sm text-muted-foreground">Mejora automática de tu evaluación</p>
                </div>
              </div>
            </div>
            <EvaluacionAnalyzer
              evaluacionData={{
                titulo: data.titulo,
                tipo_evaluacion: data.tipo_evaluacion,
                curso_id: parseInt(data.curso_id.toString()) || 0,
                preguntas: data.preguntas as Pregunta[],
              }}
              onAnalysisComplete={setAnalysisData}
              autoAnalyze={true}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
