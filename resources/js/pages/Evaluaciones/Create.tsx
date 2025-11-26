import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DocumentTextIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { type BreadcrumbItem } from '@/types';
import { ContentAssistant, type ContentSuggestions } from '@/components/ContentAssistant';
import EvaluacionForm from '@/components/Forms/EvaluacionForm';

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
    fecha_limite: '',
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
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Crear Nueva Evaluación</h1>
              <p className="text-muted-foreground">
                Elige cómo crear tu evaluación: con asistencia de IA o de forma manual
              </p>
            </div>
          </div>
        </div>

        {/* ContentAssistant - Selector de modo (Con IA / Manual) */}
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
          />
        </ContentAssistant>
      </div>
    </AppLayout>
  );
}
