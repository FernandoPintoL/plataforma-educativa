<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEvaluacionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $evaluacion = $this->route('evaluacione'); // Laravel pluraliza a 'evaluacione'

        // Solo el profesor creador puede actualizar
        return $this->user() &&
               $this->user()->esProfesor() &&
               $evaluacion->contenido->creador_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Campos de Contenido
            'titulo' => ['sometimes', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'fecha_limite' => ['nullable', 'date'],
            'estado' => ['nullable', 'in:borrador,publicado,finalizado'],

            // Campos de Evaluacion
            'tipo_evaluacion' => ['sometimes', 'in:examen,quiz,parcial,final,practica'],
            'puntuacion_total' => ['sometimes', 'numeric', 'min:0', 'max:1000'],
            'tiempo_limite' => ['nullable', 'integer', 'min:1', 'max:480'],
            'calificacion_automatica' => ['nullable', 'boolean'],
            'mostrar_respuestas' => ['nullable', 'boolean'],
            'permite_reintento' => ['nullable', 'boolean'],
            'max_reintentos' => ['nullable', 'integer', 'min:1', 'max:10'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'titulo.string' => 'El título debe ser texto.',
            'puntuacion_total.min' => 'La puntuación debe ser mayor a 0.',
            'tiempo_limite.min' => 'El tiempo límite debe ser al menos 1 minuto.',
        ];
    }
}
