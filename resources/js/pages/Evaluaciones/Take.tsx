import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface Pregunta {
  id: number;
  enunciado: string;
  tipo: string;
  opciones: string[] | null;
  puntos: number;
  orden: number;
}

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Evaluacion {
  id: number;
  tipo_evaluacion: string;
  puntuacion_total: number;
  tiempo_limite: number | null;
  contenido: {
    id: number;
    titulo: string;
    descripcion: string;
    curso: Curso;
  };
  preguntas: Pregunta[];
}

interface Props {
  evaluacion: Evaluacion;
  trabajo_existente: any;
}

export default function Take({ evaluacion, trabajo_existente }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Evaluaciones',
      href: '/evaluaciones',
    },
    {
      title: evaluacion.contenido.titulo,
      href: `/evaluaciones/${evaluacion.id}`,
    },
    {
      title: 'Tomar Evaluación',
      href: `/evaluaciones/${evaluacion.id}/take`,
    },
  ];

  const { data, setData, post, processing, errors } = useForm({
    respuestas: {} as Record<number, string>,
    tiempo_usado: 0,
  });

  const [tiempoRestante, setTiempoRestante] = useState(
    evaluacion.tiempo_limite ? evaluacion.tiempo_limite * 60 : null
  );
  const [iniciado, setIniciado] = useState(false);
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false);

  // Temporizador
  useEffect(() => {
    if (!iniciado || tiempoRestante === null) return;

    const interval = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          // Tiempo agotado, enviar automáticamente
          handleSubmit(new Event('submit') as any);
          return 0;
        }

        // Mostrar advertencia cuando queden 5 minutos
        if (prev === 300) {
          setMostrarAdvertencia(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [iniciado, tiempoRestante]);

  const handleRespuestaChange = (preguntaId: number, respuesta: string) => {
    setData('respuestas', {
      ...data.respuestas,
      [preguntaId]: respuesta,
    });
  };

  const handleIniciar = () => {
    setIniciado(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirm('¿Estás seguro de enviar tu evaluación? No podrás modificar tus respuestas después.')) {
      return;
    }

    const tiempoUsado = evaluacion.tiempo_limite
      ? evaluacion.tiempo_limite - (tiempoRestante ? Math.floor(tiempoRestante / 60) : 0)
      : 0;

    post(`/evaluaciones/${evaluacion.id}/submit`, {
      data: {
        ...data,
        tiempo_usado: tiempoUsado,
      },
    });
  };

  const formatTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const getTiempoColor = () => {
    if (tiempoRestante === null) return 'text-primary';
    if (tiempoRestante < 300) return 'text-red-500'; // Menos de 5 minutos
    if (tiempoRestante < 600) return 'text-yellow-500'; // Menos de 10 minutos
    return 'text-primary';
  };

  const respuestasCompletadas = Object.keys(data.respuestas).length;
  const totalPreguntas = evaluacion.preguntas.length;

  // Vista previa antes de iniciar
  if (!iniciado) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <div className="container mx-auto py-8 px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{evaluacion.contenido.titulo}</CardTitle>
              <CardDescription>{evaluacion.contenido.descripcion}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Información */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Curso</p>
                  <p className="text-sm">{evaluacion.contenido.curso.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                  <Badge>{evaluacion.tipo_evaluacion}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Preguntas</p>
                  <p className="text-sm">{totalPreguntas} preguntas</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Puntuación Total</p>
                  <p className="text-sm">{evaluacion.puntuacion_total} puntos</p>
                </div>
                {evaluacion.tiempo_limite && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tiempo Límite</p>
                    <p className="text-sm flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {evaluacion.tiempo_limite} minutos
                    </p>
                  </div>
                )}
              </div>

              {/* Advertencias */}
              <Alert>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Una vez iniciada, debes completar la evaluación en una sola sesión.</li>
                    {evaluacion.tiempo_limite && (
                      <li>El temporizador comenzará cuando presiones &quot;Iniciar Evaluación&quot;.</li>
                    )}
                    <li>Asegúrate de tener una conexión estable a internet.</li>
                    <li>No podrás modificar tus respuestas una vez enviadas.</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Reintentos */}
              {trabajo_existente && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Ya has completado esta evaluación anteriormente. Este es un nuevo intento.
                  </AlertDescription>
                </Alert>
              )}

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleIniciar} size="lg" className="flex-1">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Iniciar Evaluación
                </Button>
                <Button variant="outline" onClick={() => window.history.back()}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  // Vista de la evaluación
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header con temporizador */}
        <div className="sticky top-0 z-10 bg-background pb-4 mb-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{evaluacion.contenido.titulo}</h1>
              <p className="text-sm text-muted-foreground">
                Pregunta {respuestasCompletadas} de {totalPreguntas} respondidas
              </p>
            </div>
            {tiempoRestante !== null && (
              <div className={`flex items-center gap-2 ${getTiempoColor()}`}>
                <ClockIcon className="h-6 w-6" />
                <span className="text-2xl font-bold">{formatTiempo(tiempoRestante)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Advertencia de tiempo */}
        {mostrarAdvertencia && tiempoRestante !== null && tiempoRestante > 0 && (
          <Alert variant="destructive" className="mb-6">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>
              ¡Quedan menos de 5 minutos! Asegúrate de responder todas las preguntas.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preguntas */}
          {evaluacion.preguntas.map((pregunta, index) => (
            <Card key={pregunta.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>
                    Pregunta {index + 1}
                    {data.respuestas[pregunta.id] && (
                      <CheckCircleIcon className="inline h-4 w-4 ml-2 text-green-500" />
                    )}
                  </span>
                  <Badge variant="outline">{pregunta.puntos} pts</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enunciado */}
                <p className="text-sm whitespace-pre-wrap">{pregunta.enunciado}</p>

                {/* Respuestas según tipo */}
                {pregunta.tipo === 'opcion_multiple' && pregunta.opciones && (
                  <RadioGroup
                    value={data.respuestas[pregunta.id] || ''}
                    onValueChange={(value) => handleRespuestaChange(pregunta.id, value)}
                  >
                    {pregunta.opciones.map((opcion, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <RadioGroupItem value={opcion} id={`q${pregunta.id}-opt${i}`} />
                        <Label htmlFor={`q${pregunta.id}-opt${i}`} className="font-normal">
                          {String.fromCharCode(65 + i)}. {opcion}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {pregunta.tipo === 'verdadero_falso' && (
                  <RadioGroup
                    value={data.respuestas[pregunta.id] || ''}
                    onValueChange={(value) => handleRespuestaChange(pregunta.id, value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Verdadero" id={`q${pregunta.id}-true`} />
                      <Label htmlFor={`q${pregunta.id}-true`} className="font-normal">
                        Verdadero
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Falso" id={`q${pregunta.id}-false`} />
                      <Label htmlFor={`q${pregunta.id}-false`} className="font-normal">
                        Falso
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {pregunta.tipo === 'respuesta_corta' && (
                  <Input
                    value={data.respuestas[pregunta.id] || ''}
                    onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                    placeholder="Escribe tu respuesta..."
                  />
                )}

                {pregunta.tipo === 'respuesta_larga' && (
                  <Textarea
                    value={data.respuestas[pregunta.id] || ''}
                    onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                    placeholder="Desarrolla tu respuesta..."
                    rows={4}
                  />
                )}
              </CardContent>
            </Card>
          ))}

          {/* Errores */}
          {errors && Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                {Object.values(errors).map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Botón de enviar */}
          <div className="sticky bottom-0 bg-background pt-4 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {respuestasCompletadas} de {totalPreguntas} preguntas respondidas
              </p>
              <Button
                type="submit"
                disabled={processing}
                size="lg"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                {processing ? 'Enviando...' : 'Enviar Evaluación'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
