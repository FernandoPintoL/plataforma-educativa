import React, { useState, useEffect, FormEvent } from 'react';
import { useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Zap,
  PenTool,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  Loader2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { format, addDays, addWeeks, addHours } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipos
interface Curso {
  id: number;
  nombre: string;
  codigo?: string;
}

interface AnalysisResult {
  descripcion: string;
  instrucciones: string;
  tiempo_estimado: number;
  unidad_tiempo: 'horas' | 'dias' | 'semanas';
  dificultad: 'facil' | 'intermedia' | 'dificil';
  puntuacion_sugerida: number;
  confidence: number;
}

interface WizardData {
  selectedMode: 'ia' | 'manual' | null;
  basicInfo: {
    titulo: string;
    curso_id: number | null;
  };
  analysis: AnalysisResult | null;
  review: {
    descripcion: string;
    instrucciones: string;
    tiempo_estimado: number;
    dificultad: string;
    fecha_entrega: string;
    puntuacion: number;
  };
  form: {
    titulo: string;
    descripcion: string;
    curso_id: number | null;
    instrucciones: string;
    fecha_limite: string;
    puntuacion: number;
    permite_archivos: boolean;
    max_archivos: number;
    tipo_archivo_permitido: string;
    recursos: File[];
    estado: 'borrador' | 'publicado';
  };
}

const calculateDueDate = (days: number, unit: 'horas' | 'dias' | 'semanas'): string => {
  const now = new Date();
  let dueDate: Date;

  switch (unit) {
    case 'horas':
      dueDate = addHours(now, days);
      break;
    case 'semanas':
      dueDate = addWeeks(now, days);
      break;
    case 'dias':
    default:
      dueDate = addDays(now, days);
  }

  return format(dueDate, 'yyyy-MM-dd');
};

export default function TareaWizard({ cursos }: { cursos: Curso[] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [wizardData, setWizardData] = useState<WizardData>({
    selectedMode: null,
    basicInfo: {
      titulo: '',
      curso_id: null,
    },
    analysis: null,
    review: {
      descripcion: '',
      instrucciones: '',
      tiempo_estimado: 0,
      dificultad: 'intermedia',
      fecha_entrega: '',
      puntuacion: 100,
    },
    form: {
      titulo: '',
      descripcion: '',
      curso_id: null,
      instrucciones: '',
      fecha_limite: '',
      puntuacion: 100,
      permite_archivos: true,
      max_archivos: 5,
      tipo_archivo_permitido: '',
      recursos: [],
      estado: 'borrador',
    },
  });

  const { data, setData, post, processing, errors } = useForm({
    titulo: wizardData.form.titulo,
    descripcion: wizardData.form.descripcion,
    curso_id: wizardData.form.curso_id,
    instrucciones: wizardData.form.instrucciones,
    fecha_limite: wizardData.form.fecha_limite,
    puntuacion: wizardData.form.puntuacion,
    permite_archivos: wizardData.form.permite_archivos,
    max_archivos: wizardData.form.max_archivos,
    tipo_archivo_permitido: wizardData.form.tipo_archivo_permitido,
    estado: wizardData.form.estado,
  });

  const selectMode = (mode: 'ia' | 'manual') => {
    setWizardData((prev) => ({
      ...prev,
      selectedMode: mode,
    }));
    setCurrentStep(2);
  };

  const updateBasicInfo = (titulo: string, curso_id: number | null) => {
    setWizardData((prev) => ({
      ...prev,
      basicInfo: { titulo, curso_id },
    }));
  };

  const proceedToAnalysis = async () => {
    if (wizardData.selectedMode === 'manual') {
      initializeFormData();
      setCurrentStep(5);
      return;
    }

    if (!wizardData.basicInfo.titulo || !wizardData.basicInfo.curso_id) {
      setAnalysisError('Por favor completa título y curso');
      return;
    }

    setCurrentStep(3);
    await analyzeContent();
  };

  const analyzeContent = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Obtener CSRF token del meta tag
      const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
      const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute('content') : '';

      const response = await fetch('/api/content/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
        },
        body: JSON.stringify({
          titulo: wizardData.basicInfo.titulo,
          curso_id: wizardData.basicInfo.curso_id,
          content_type: 'tarea',
        }),
      });

      if (!response.ok) {
        throw new Error('Error al analizar contenido');
      }

      const responseData = await response.json();

      if (responseData.success && responseData.analysis) {
        const analysis = responseData.analysis;
        const fechaEntrega = calculateDueDate(
          analysis.tiempo_estimado || 3,
          analysis.unidad_tiempo || 'dias'
        );

        setWizardData((prev) => ({
          ...prev,
          analysis: {
            descripcion: analysis.descripcion || '',
            instrucciones: analysis.instrucciones || '',
            tiempo_estimado: analysis.tiempo_estimado || 3,
            unidad_tiempo: analysis.unidad_tiempo || 'dias',
            dificultad: analysis.dificultad || 'intermedia',
            puntuacion_sugerida: analysis.puntuacion_sugerida || 100,
            confidence: analysis.confidence || 0,
          },
          review: {
            descripcion: analysis.descripcion || '',
            instrucciones: analysis.instrucciones || '',
            tiempo_estimado: analysis.tiempo_estimado || 3,
            dificultad: analysis.dificultad || 'intermedia',
            fecha_entrega: fechaEntrega,
            puntuacion: analysis.puntuacion_sugerida || 100,
          },
        }));
      } else {
        setAnalysisError(responseData.message || 'Error desconocido al analizar');
      }
    } catch (error) {
      setAnalysisError(
        error instanceof Error ? error.message : 'Error al conectar con el servicio de IA'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateReview = (updates: Partial<WizardData['review']>) => {
    setWizardData((prev) => ({
      ...prev,
      review: { ...prev.review, ...updates },
    }));

    if (updates.tiempo_estimado !== undefined && wizardData.analysis) {
      const newDueDate = calculateDueDate(
        updates.tiempo_estimado,
        wizardData.analysis.unidad_tiempo
      );
      setWizardData((prev) => ({
        ...prev,
        review: { ...prev.review, fecha_entrega: newDueDate },
      }));
    }
  };

  const initializeFormData = () => {
    if (wizardData.selectedMode === 'ia' && wizardData.analysis) {
      setData({
        titulo: wizardData.basicInfo.titulo,
        descripcion: wizardData.review.descripcion,
        curso_id: wizardData.basicInfo.curso_id,
        instrucciones: wizardData.review.instrucciones,
        fecha_limite: wizardData.review.fecha_entrega,
        puntuacion: wizardData.review.puntuacion,
        permite_archivos: true,
        max_archivos: 5,
        tipo_archivo_permitido: '',
        estado: 'borrador',
      });
    } else {
      setData({
        titulo: wizardData.basicInfo.titulo,
        descripcion: '',
        curso_id: wizardData.basicInfo.curso_id,
        instrucciones: '',
        fecha_limite: '',
        puntuacion: 100,
        permite_archivos: true,
        max_archivos: 5,
        tipo_archivo_permitido: '',
        estado: 'borrador',
      });
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !wizardData.selectedMode) return;
    if (currentStep === 2 && (!wizardData.basicInfo.titulo || !wizardData.basicInfo.curso_id))
      return;
    if (currentStep === 4) {
      initializeFormData();
    }

    if (currentStep === 2 && wizardData.selectedMode === 'ia') {
      proceedToAnalysis();
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: FormEvent, estado: 'borrador' | 'publicado') => {
    e.preventDefault();
    setData('estado', estado);
    post('/tareas', {
      preserveScroll: true,
      onSuccess: () => {
        window.location.href = '/tareas';
      },
    });
  };

  const progressPercentage = (currentStep / 5) * 100;

  return (
    <AppLayout title="Crear Tarea">
      <Head title="Crear Tarea" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4">
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex gap-2 justify-center mb-6">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`h-10 w-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step === currentStep
                      ? 'bg-blue-600 text-white shadow-lg'
                      : step < currentStep
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step < currentStep ? <CheckCircle2 size={20} /> : step}
                </div>
              ))}
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-900">
              Crear Nueva Tarea/Evaluación
            </h1>
          </div>

          {/* Step 1: Selector */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-900">
                ¿Cómo deseas crear la tarea?
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* IA Card */}
                <Card
                  className={`cursor-pointer transition-all border-2 ${
                    wizardData.selectedMode === 'ia'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-600'
                  }`}
                  onClick={() => selectMode('ia')}
                >
                  <CardHeader>
                    <div className="flex gap-3 items-start">
                      <div className="rounded-lg bg-blue-600 p-3 text-white">
                        <Zap size={24} />
                      </div>
                      <div>
                        <CardTitle>Crear con IA</CardTitle>
                        <CardDescription>
                          Déja que la inteligencia artificial genere sugerencias
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Análisis automático
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Sugerencias inteligentes
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Tiempo optimizado
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Manual Card */}
                <Card
                  className={`cursor-pointer transition-all border-2 ${
                    wizardData.selectedMode === 'manual'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-600'
                  }`}
                  onClick={() => selectMode('manual')}
                >
                  <CardHeader>
                    <div className="flex gap-3 items-start">
                      <div className="rounded-lg bg-blue-600 p-3 text-white">
                        <PenTool size={24} />
                      </div>
                      <div>
                        <CardTitle>Crear Manualmente</CardTitle>
                        <CardDescription>Control total sobre todos los detalles</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Control total
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Personalización completa
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-green-600" />
                        Rápido y directo
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  {wizardData.selectedMode === 'ia'
                    ? 'Proporciona el título y curso para el análisis IA'
                    : 'Completa los datos básicos'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    placeholder="Ej: Análisis de la Revolución Francesa"
                    value={wizardData.basicInfo.titulo}
                    onChange={(e) =>
                      updateBasicInfo(e.target.value, wizardData.basicInfo.curso_id)
                    }
                    minLength={5}
                    maxLength={255}
                  />
                  <div className="text-sm text-gray-500">
                    {wizardData.basicInfo.titulo.length} / 255 caracteres
                    {wizardData.basicInfo.titulo.length < 5 && (
                      <span className="text-red-600"> (Mínimo 5)</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="curso">Curso *</Label>
                  <Select
                    value={wizardData.basicInfo.curso_id?.toString() || ''}
                    onValueChange={(value) =>
                      updateBasicInfo(wizardData.basicInfo.titulo, parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {cursos.map((curso) => (
                        <SelectItem key={curso.id} value={curso.id.toString()}>
                          {curso.nombre}
                          {curso.codigo && ` (${curso.codigo})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {wizardData.selectedMode === 'ia' && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <Zap size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <strong>Análisis con IA:</strong> Una vez que proporciones esta
                        información, nuestro agente analiza el contenido y sugiere descripción,
                        instrucciones, tiempo estimado y más.
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Analysis */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Análisis del Agente IA</CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="text-center py-12">
                    <Loader2 size={48} className="mx-auto mb-4 animate-spin text-blue-600" />
                    <h3 className="text-lg font-bold mb-2">Analizando contenido...</h3>
                    <p className="text-gray-600">
                      Nuestro agente inteligente está revisando tu solicitud
                    </p>
                  </div>
                ) : analysisError ? (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <div className="flex gap-3">
                        <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-red-900 mb-1">Error al analizar</h4>
                          <p className="text-sm text-red-800">{analysisError}</p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={async () => await analyzeContent()}>Reintentar</Button>
                  </div>
                ) : wizardData.analysis ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Confianza del Análisis:</span>
                        <span className="font-bold text-blue-600">
                          {Math.round((wizardData.analysis.confidence || 0) * 100)}%
                        </span>
                      </div>
                      <Progress value={(wizardData.analysis.confidence || 0) * 100} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileText size={18} />
                            Descripción Sugerida
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-700">
                          {wizardData.analysis.descripcion || 'No disponible'}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <FileText size={18} />
                            Instrucciones
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-700">
                          {wizardData.analysis.instrucciones || 'No disponible'}
                        </CardContent>
                      </Card>

                      <Card className="md:col-span-2 border-2 border-blue-200 bg-blue-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Clock size={18} className="text-blue-600" />
                            Tiempo Estimado
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold text-blue-600">
                          {wizardData.analysis.tiempo_estimado}{' '}
                          <span className="text-sm">{wizardData.analysis.unidad_tiempo}</span>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Dificultad</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge
                            variant={
                              wizardData.analysis.dificultad === 'facil'
                                ? 'default'
                                : wizardData.analysis.dificultad === 'intermedia'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {wizardData.analysis.dificultad}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Star size={18} />
                            Puntuación Sugerida
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                          {wizardData.analysis.puntuacion_sugerida}
                          <span className="text-sm text-gray-500"> puntos</span>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 mt-6">
                      <div className="flex gap-3">
                        <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                          <strong>Próximo paso:</strong> En la siguiente pantalla podrás revisar y editar estos
                          datos antes de completar la tarea.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Revisión & Edición</CardTitle>
                <CardDescription>
                  Revisa los datos sugeridos. Puedes editar cualquier campo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={wizardData.review.descripcion}
                    onChange={(e) => updateReview({ descripcion: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Instrucciones</Label>
                  <Textarea
                    value={wizardData.review.instrucciones}
                    onChange={(e) => updateReview({ instrucciones: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tiempo Estimado</Label>
                    <Input
                      type="number"
                      value={wizardData.review.tiempo_estimado}
                      onChange={(e) =>
                        updateReview({ tiempo_estimado: parseInt(e.target.value) || 0 })
                      }
                      min={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unidad</Label>
                    <div className="p-2 bg-gray-100 rounded">{wizardData.analysis?.unidad_tiempo}</div>
                  </div>
                </div>

                <div className="space-y-2 p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
                  <Label className="font-bold">📅 Fecha de Entrega (Automática)</Label>
                  <div className="text-lg font-bold text-blue-600">
                    {format(new Date(wizardData.review.fecha_entrega), 'EEEE, dd MMMM yyyy', {
                      locale: es,
                    })}
                  </div>
                  <div className="text-sm text-blue-900">
                    ✓ Calculada automáticamente basada en el tiempo estimado
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Puntuación Máxima</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={wizardData.review.puntuacion}
                      onChange={(e) =>
                        updateReview({ puntuacion: parseInt(e.target.value) || 100 })
                      }
                      min={1}
                      max={999}
                      className="flex-1"
                    />
                    <div className="p-2 bg-gray-100 rounded">puntos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Full Form */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Formulario Completo</CardTitle>
                <CardDescription>Revisa y completa todos los detalles</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="form-titulo">Título *</Label>
                    <Input
                      id="form-titulo"
                      value={data.titulo}
                      onChange={(e) => setData('titulo', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form-curso">Curso *</Label>
                    <Select
                      value={data.curso_id?.toString() || ''}
                      onValueChange={(value) => setData('curso_id', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {cursos.map((curso) => (
                          <SelectItem key={curso.id} value={curso.id.toString()}>
                            {curso.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form-desc">Descripción</Label>
                    <Textarea
                      id="form-desc"
                      value={data.descripcion}
                      onChange={(e) => setData('descripcion', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="form-instr">Instrucciones</Label>
                    <Textarea
                      id="form-instr"
                      value={data.instrucciones}
                      onChange={(e) => setData('instrucciones', e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="form-fecha">Fecha de Entrega</Label>
                      <Input
                        id="form-fecha"
                        type="date"
                        value={data.fecha_limite}
                        onChange={(e) => setData('fecha_limite', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="form-puntos">Puntuación</Label>
                      <Input
                        id="form-puntos"
                        type="number"
                        value={data.puntuacion}
                        onChange={(e) => setData('puntuacion', parseInt(e.target.value) || 100)}
                        min={1}
                        max={999}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <strong>Resumen:</strong> Se creará una tarea con todos estos datos. Puedes
                        guardarla como borrador o publicarla directamente.
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-4 justify-between">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={isSaving}
                className="gap-2"
              >
                <ChevronLeft size={18} />
                Atrás
              </Button>
            )}

            {currentStep < 5 && currentStep !== 5 && (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !wizardData.selectedMode) ||
                  (currentStep === 2 && (!wizardData.basicInfo.titulo || !wizardData.basicInfo.curso_id)) ||
                  (currentStep === 3 && isAnalyzing) ||
                  (currentStep === 4 && !wizardData.review.fecha_entrega)
                }
                className="gap-2 ml-auto"
              >
                {currentStep === 3 ? '→ Revisar & Confirmar' : 'Siguiente'}
                <ChevronRight size={18} />
              </Button>
            )}

            {currentStep === 5 && (
              <div className="ml-auto flex gap-4">
                <Button
                  variant="outline"
                  onClick={(e) => handleSubmit(e, 'borrador')}
                  disabled={processing || !data.titulo}
                >
                  💾 Guardar como Borrador
                </Button>
                <Button
                  onClick={(e) => handleSubmit(e, 'publicado')}
                  disabled={processing || !data.titulo}
                  className="gap-2"
                >
                  {processing ? <Loader2 size={18} className="animate-spin" /> : '🚀'}
                  Publicar Tarea
                </Button>
              </div>
            )}

            {currentStep === 1 && (
              <Button
                variant="ghost"
                onClick={() => (window.location.href = '/tareas')}
                className="ml-auto"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
