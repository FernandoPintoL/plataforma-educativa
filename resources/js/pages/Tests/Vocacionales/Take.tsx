import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface Pregunta {
  id: number;
  pregunta: string;
  opciones?: string[];
  tipo: string;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  preguntas: Pregunta[];
}

interface TestVocacional {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_estimada: number;
}

interface TakeProps {
  test: TestVocacional;
  preguntas: Categoria[];
}

export default function Take({ test, preguntas }: TakeProps) {
  const { data, setData, post, processing } = useForm<{
    respuestas: Record<number, any>;
  }>({
    respuestas: {},
  });

  const [tiempoInicio] = useState(Date.now());
  const [tiempoRestante, setTiempoRestante] = useState(test.duracion_estimada * 60);
  const [paginaActual, setPaginaActual] = useState(0);
  const [respuestasCompletadas, setRespuestasCompletadas] = useState(0);

  // Calcular total de preguntas
  const totalPreguntas = preguntas.reduce(
    (sum, cat) => sum + cat.preguntas.length,
    0
  );

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 0) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Actualizar contador de respuestas
  useEffect(() => {
    setRespuestasCompletadas(Object.keys(data.respuestas).length);
  }, [data.respuestas]);

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const handleRespuesta = (preguntaId: number, valor: any) => {
    setData({
      ...data,
      respuestas: {
        ...data.respuestas,
        [preguntaId]: valor,
      },
    });
  };

  const handleSubmit = () => {
    if (confirm('¿Estás seguro de que deseas enviar tus respuestas?')) {
      post(`/tests-vocacionales/${test.id}/enviar`);
    }
  };

  const mostrarAdvertencia = tiempoRestante <= 300 && tiempoRestante > 0;

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Tests Vocacionales', href: '/tests-vocacionales' },
    { label: test.nombre },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Resolver: ${test.nombre}`} />

      <div className="space-y-6 p-4">
        {/* Header con progreso */}
        <Card className="sticky top-4 z-10 shadow-lg">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Título y Tiempo */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {test.nombre}
                  </h1>
                  {test.descripcion && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {test.descripcion}
                    </p>
                  )}
                </div>

                {/* Timer */}
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
                    mostrarAdvertencia
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  {formatearTiempo(tiempoRestante)}
                </div>
              </div>

              {/* Advertencia de tiempo */}
              {mostrarAdvertencia && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    Se acabó el tiempo. Por favor, envía tu test inmediatamente.
                  </AlertDescription>
                </Alert>
              )}

              {/* Progreso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Progreso
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {respuestasCompletadas} de {totalPreguntas} respuestas
                  </span>
                </div>
                <div className="relative h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(respuestasCompletadas / totalPreguntas) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenido del Test */}
        <div className="space-y-6">
          {preguntas.map((categoria, catIndex) => (
            <div key={categoria.id}>
              {/* Encabezado Categoría */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {catIndex + 1}. {categoria.nombre}
                </h2>
                {categoria.descripcion && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {categoria.descripcion}
                  </p>
                )}
              </div>

              {/* Preguntas */}
              <div className="space-y-4">
                {categoria.preguntas.map((pregunta, pregIndex) => (
                  <Card
                    key={pregunta.id}
                    className={`transition-all ${
                      data.respuestas[pregunta.id]
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-base flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium">
                          {pregIndex + 1}
                        </span>
                        <span className="flex-1">{pregunta.pregunta}</span>
                        {data.respuestas[pregunta.id] && (
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        )}
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      {pregunta.tipo === 'multiple_choice' ? (
                        <RadioGroup
                          value={
                            data.respuestas[pregunta.id]?.toString() || ''
                          }
                          onValueChange={(val) =>
                            handleRespuesta(pregunta.id, val)
                          }
                        >
                          <div className="space-y-3">
                            {pregunta.opciones?.map((opcion, idx) => (
                              <div
                                key={idx}
                                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                <RadioGroupItem
                                  value={idx.toString()}
                                  id={`pregunta_${pregunta.id}_opcion_${idx}`}
                                />
                                <Label
                                  htmlFor={`pregunta_${pregunta.id}_opcion_${idx}`}
                                  className="flex-1 cursor-pointer"
                                >
                                  {opcion}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      ) : (
                        <div className="text-gray-600 dark:text-gray-400">
                          Tipo de pregunta: {pregunta.tipo}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <Card className="sticky bottom-4 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
                disabled={processing || respuestasCompletadas === 0}
                className="flex-1 flex items-center justify-center gap-2"
                size="lg"
              >
                <CheckCircle className="w-5 h-5" />
                {processing ? 'Enviando...' : 'Enviar Respuestas'}
              </Button>

              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                {respuestasCompletadas === totalPreguntas
                  ? '✓ Todas las preguntas respondidas'
                  : `${totalPreguntas - respuestasCompletadas} preguntas sin responder`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
