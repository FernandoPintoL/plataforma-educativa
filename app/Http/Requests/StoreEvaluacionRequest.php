<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvaluacionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo profesores pueden crear evaluaciones
        return $this->user() && $this->user()->esProfesor();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Campos de Contenido (tabla padre)
            'titulo' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'curso_id' => ['required', 'exists:cursos,id'],
            'fecha_limite' => ['nullable', 'date', 'after:now'],
            'estado' => ['nullable', 'in:borrador,publicado,finalizado'],

            // Campos específicos de Evaluacion
            'tipo_evaluacion' => ['required', 'in:examen,quiz,parcial,final,practica'],
            'puntuacion_total' => ['required', 'numeric', 'min:0', 'max:1000'],
            'tiempo_limite' => ['nullable', 'integer', 'min:1', 'max:480'], // en minutos, max 8 horas
            'calificacion_automatica' => ['nullable', 'boolean'],
            'mostrar_respuestas' => ['nullable', 'boolean'],
            'permite_reintento' => ['nullable', 'boolean'],
            'max_reintentos' => ['nullable', 'integer', 'min:1', 'max:10'],

            // Preguntas (array de preguntas)
            'preguntas' => ['nullable', 'array'],
            'preguntas.*.enunciado' => ['required_with:preguntas', 'string'],
            'preguntas.*.tipo' => ['required_with:preguntas', 'in:opcion_multiple,verdadero_falso,respuesta_corta,respuesta_larga'],
            'preguntas.*.opciones' => ['nullable', 'array'],
            'preguntas.*.respuesta_correcta' => ['required_with:preguntas', 'string'],
            'preguntas.*.tema' => ['nullable', 'string', 'max:100'],
            'preguntas.*.puntos' => ['required_with:preguntas', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'titulo.required' => 'El título es obligatorio.',
            'curso_id.required' => 'Debe seleccionar un curso.',
            'curso_id.exists' => 'El curso seleccionado no existe.',
            'tipo_evaluacion.required' => 'Debe seleccionar un tipo de evaluación.',
            'puntuacion_total.required' => 'La puntuación total es obligatoria.',
            'puntuacion_total.min' => 'La puntuación debe ser mayor a 0.',
            'tiempo_limite.min' => 'El tiempo límite debe ser al menos 1 minuto.',
            'max_reintentos.min' => 'Debe permitir al menos 1 reintento.',
            'preguntas.*.enunciado.required_with' => 'El enunciado de la pregunta es obligatorio.',
            'preguntas.*.tipo.required_with' => 'El tipo de pregunta es obligatorio.',
            'preguntas.*.respuesta_correcta.required_with' => 'Debe especificar la respuesta correcta.',
            'preguntas.*.puntos.required_with' => 'Debe especificar los puntos de la pregunta.',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * Implementa presets inteligentes basados en el tipo de evaluación:
     * - quiz: 3 reintentos, auto-grading, mostrar respuestas
     * - practica: 5 reintentos, auto-grading, mostrar respuestas
     * - parcial/final: sin reintentos, sin mostrar respuestas
     * - examen: 2 reintentos, auto-grading, sin mostrar respuestas
     */
    protected function prepareForValidation(): void
    {
        // Obtener presets según tipo de evaluación
        $presets = $this->getRetryPresetsByType($this->input('tipo_evaluacion'));

        $this->merge([
            'calificacion_automatica' => $this->boolean('calificacion_automatica', true),
            'mostrar_respuestas' => $this->boolean('mostrar_respuestas', true),
            'permite_reintento' => $this->boolean('permite_reintento', $presets['permite_reintento']),
            'max_reintentos' => $this->input('max_reintentos', $presets['max_reintentos']),
            'estado' => $this->input('estado', 'borrador'),
        ]);
    }

    /**
     * Obtener presets de reintentos según el tipo de evaluación
     *
     * @param string|null $tipo Tipo de evaluación
     * @return array Array con claves 'permite_reintento' y 'max_reintentos'
     */
    private function getRetryPresetsByType(?string $tipo): array
    {
        return match($tipo) {
            'quiz' => ['permite_reintento' => true, 'max_reintentos' => 3],
            'practica' => ['permite_reintento' => true, 'max_reintentos' => 5],
            'parcial' => ['permite_reintento' => false, 'max_reintentos' => 1],
            'final' => ['permite_reintento' => false, 'max_reintentos' => 1],
            'examen' => ['permite_reintento' => true, 'max_reintentos' => 2],
            default => ['permite_reintento' => true, 'max_reintentos' => 3],
        };
    }
}
