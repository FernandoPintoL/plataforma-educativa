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
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'calificacion_automatica' => $this->boolean('calificacion_automatica', true),
            'mostrar_respuestas' => $this->boolean('mostrar_respuestas', true),
            'permite_reintento' => $this->boolean('permite_reintento', false),
            'estado' => $this->input('estado', 'borrador'),
        ]);
    }
}
