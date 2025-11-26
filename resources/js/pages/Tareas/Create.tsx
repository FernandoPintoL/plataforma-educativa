import React, { useState, useRef, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { DocumentTextIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { type BreadcrumbItem } from '@/types';
import { ContentAssistant, type ContentSuggestions, type ContentType } from '@/components/ContentAssistant';
import TareaForm from '@/components/Forms/TareaForm';

interface Curso {
  id: number;
  nombre: string;
  codigo: string;
}

interface Props {
  cursos: Curso[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Tareas',
    href: '/tareas',
  },
  {
    title: 'Crear Tarea',
    href: '/tareas/create',
  },
];

export default function Create({ cursos }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    titulo: '',
    descripcion: '',
    instrucciones: '',
    curso_id: '',
    puntuacion: 100,
    fecha_limite: '',
    permite_archivos: true,
    max_archivos: 5,
    tipo_archivo_permitido: '',
    estado: 'borrador',
    recursos: [] as File[],
  });

  // Usar ref para trackear si estamos esperando un submit
  const shouldSubmitRef = useRef(false);

  /**
   * Manejar cuando se aplican sugerencias del agente
   * Auto-llena los campos del formulario con las sugerencias
   */
  const handleApplySuggestions = (suggestions: ContentSuggestions) => {
    console.log('[Create.tsx] Applying suggestions:', suggestions);

    // Actualizar cada campo individualmente para asegurar que Inertia lo procese correctamente
    if (suggestions.descripcion) {
      setData('descripcion', suggestions.descripcion);
    }
    if (suggestions.instrucciones_plantilla) {
      setData('instrucciones', suggestions.instrucciones_plantilla);
    }
    if (suggestions.puntuacion_sugerida) {
      setData('puntuacion', suggestions.puntuacion_sugerida);
    }

    console.log('[Create.tsx] Suggestions applied');
  };

  const handleSubmit = (e: React.FormEvent, publicar = false) => {
    e.preventDefault();

    const estado = publicar ? 'publicado' : 'borrador';
    console.log('[Create.tsx] handleSubmit called', { publicar, estado, currentData: data });

    // Actualizar el estado
    setData('estado', estado);

    // Marcar que debemos hacer submit después de que el estado se actualice
    shouldSubmitRef.current = true;
    console.log('[Create.tsx] Marked for submit, estado will be:', estado);

    // Usar setTimeout para asegurar que setData se propague
    setTimeout(() => {
      if (shouldSubmitRef.current) {
        console.log('[Create.tsx] Executing POST to /tareas with current data');
        console.log('[Create.tsx] Full data object:', {
          titulo: data.titulo,
          descripcion: data.descripcion,
          instrucciones: data.instrucciones,
          curso_id: data.curso_id,
          puntuacion: data.puntuacion,
          fecha_limite: data.fecha_limite,
          permite_archivos: data.permite_archivos,
          max_archivos: data.max_archivos,
          tipo_archivo_permitido: data.tipo_archivo_permitido,
          estado: data.estado,
          recursos_count: (data.recursos as File[]).length,
        });

        // Verificar que los campos obligatorios estén completos
        if (!data.titulo || !data.instrucciones || !data.curso_id) {
          console.error('[Create.tsx] ERROR: Campos obligatorios vacíos', {
            titulo: !data.titulo ? '❌ VACIO' : '✓',
            instrucciones: !data.instrucciones ? '❌ VACIO' : '✓',
            curso_id: !data.curso_id ? '❌ VACIO' : '✓',
          });
          return;
        }

        post('/tareas', {
          onSuccess: () => {
            console.log('[Create.tsx] POST /tareas successful');
            shouldSubmitRef.current = false;
          },
          onError: (errors) => {
            console.error('[Create.tsx] POST /tareas error:', errors);
            shouldSubmitRef.current = false;
          },
        });
      }
    }, 150);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Crear Nueva Tarea</h1>
              <p className="text-muted-foreground">
                Elige cómo crear tu tarea: con asistencia de IA o de forma manual
              </p>
            </div>
          </div>
        </div>

        {/* ContentAssistant - Selector de modo (Con IA / Manual) */}
        <ContentAssistant
          contentType="tarea"
          courseId={parseInt(data.curso_id.toString()) || null}
          courses={cursos}
          onSuggestionsApplied={handleApplySuggestions}
          title="Crear Tarea"
        >
          {/* TareaForm - Formulario reutilizable */}
          <TareaForm
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
