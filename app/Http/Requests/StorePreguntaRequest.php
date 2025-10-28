<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePreguntaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo profesores pueden agregar preguntas
        return $this->user() && $this->user()->esProfesor();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'evaluacion_id' => ['required', 'exists:evaluaciones,id'],
            'enunciado' => ['required', 'string'],
            'tipo' => ['required', 'in:opcion_multiple,verdadero_falso,respuesta_corta,respuesta_larga'],
            'opciones' => ['nullable', 'array', 'min:2'],
            'opciones.*' => ['required_with:opciones', 'string'],
            'respuesta_correcta' => ['required', 'string'],
            'puntos' => ['required', 'numeric', 'min:0', 'max:100'],
            'orden' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'evaluacion_id.required' => 'La evaluación es requerida.',
            'evaluacion_id.exists' => 'La evaluación no existe.',
            'enunciado.required' => 'El enunciado es obligatorio.',
            'tipo.required' => 'Debe seleccionar un tipo de pregunta.',
            'tipo.in' => 'El tipo de pregunta no es válido.',
            'opciones.min' => 'Debe proporcionar al menos 2 opciones.',
            'respuesta_correcta.required' => 'Debe especificar la respuesta correcta.',
            'puntos.required' => 'Debe especificar los puntos de la pregunta.',
            'puntos.min' => 'Los puntos deben ser mayores a 0.',
        ];
    }
}
