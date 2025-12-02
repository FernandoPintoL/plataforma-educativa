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
            // evaluacion_id viene como parámetro de URL (implicit route model binding)
            // No necesita validación aquí
            'respuestas' => ['required', 'array'],
            // Acepta tanto formato plano como formato con pregunta_id
            'tiempo_usado' => ['nullable', 'integer', 'min:0'], // en minutos
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'respuestas.required' => 'Debe proporcionar respuestas.',
            'respuestas.array' => 'El formato de respuestas no es válido.',
        ];
    }
}
