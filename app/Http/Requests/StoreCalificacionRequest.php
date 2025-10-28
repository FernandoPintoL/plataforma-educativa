<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCalificacionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo profesores pueden calificar
        if (!$this->user() || !$this->user()->esProfesor()) {
            return false;
        }

        // Verificar que el profesor sea el creador de la tarea
        $trabajo = $this->route('trabajo');
        if (!$trabajo) {
            return false;
        }

        return $trabajo->contenido->creador_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $trabajo = $this->route('trabajo');
        $puntuacionMaxima = 100;

        // Obtener la puntuación máxima de la tarea
        if ($trabajo && $trabajo->contenido->tipo === 'tarea') {
            $tarea = $trabajo->contenido->tarea;
            if ($tarea) {
                $puntuacionMaxima = $tarea->puntuacion;
            }
        }

        return [
            'puntaje' => "required|numeric|min:0|max:{$puntuacionMaxima}",
            'comentario' => 'nullable|string|max:5000',
            'criterios_evaluacion' => 'nullable|array',
            'criterios_evaluacion.*.criterio' => 'required_with:criterios_evaluacion|string',
            'criterios_evaluacion.*.puntaje' => 'required_with:criterios_evaluacion|numeric|min:0',
            'criterios_evaluacion.*.comentario' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        $trabajo = $this->route('trabajo');
        $puntuacionMaxima = 100;

        if ($trabajo && $trabajo->contenido->tipo === 'tarea') {
            $tarea = $trabajo->contenido->tarea;
            if ($tarea) {
                $puntuacionMaxima = $tarea->puntuacion;
            }
        }

        return [
            'puntaje.required' => 'El puntaje es obligatorio.',
            'puntaje.numeric' => 'El puntaje debe ser un número.',
            'puntaje.min' => 'El puntaje mínimo es 0.',
            'puntaje.max' => "El puntaje máximo para esta tarea es {$puntuacionMaxima}.",
            'comentario.max' => 'El comentario no puede exceder los 5000 caracteres.',
            'criterios_evaluacion.array' => 'Los criterios de evaluación deben ser un arreglo válido.',
            'criterios_evaluacion.*.criterio.required_with' => 'El nombre del criterio es obligatorio.',
            'criterios_evaluacion.*.puntaje.required_with' => 'El puntaje del criterio es obligatorio.',
            'criterios_evaluacion.*.puntaje.numeric' => 'El puntaje del criterio debe ser un número.',
        ];
    }
}
