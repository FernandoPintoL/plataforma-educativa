<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRespuestaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo estudiantes pueden enviar respuestas
        return $this->user() && $this->user()->esEstudiante();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'evaluacion_id' => ['required', 'exists:evaluaciones,id'],
            'respuestas' => ['required', 'array'],
            'respuestas.*' => ['required', 'string'],
            'tiempo_usado' => ['nullable', 'integer', 'min:0'], // en minutos
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
            'respuestas.required' => 'Debe proporcionar respuestas.',
            'respuestas.array' => 'El formato de respuestas no es válido.',
        ];
    }
}
