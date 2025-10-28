<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTareaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $tarea = $this->route('tarea');

        // Solo el profesor creador puede editar
        return $this->user() &&
               $this->user()->esProfesor() &&
               $tarea &&
               $tarea->contenido->creador_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'instrucciones' => 'sometimes|required|string',
            'puntuacion' => 'sometimes|required|integer|min:1|max:1000',
            'fecha_limite' => 'sometimes|required|date',
            'permite_archivos' => 'boolean',
            'max_archivos' => 'nullable|integer|min:1|max:20',
            'tipo_archivo_permitido' => 'nullable|string',
            'estado' => 'sometimes|required|in:borrador,publicado,finalizado',
            'recursos' => 'nullable|array',
            'recursos.*' => 'file|max:51200',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titulo.required' => 'El título de la tarea es obligatorio.',
            'instrucciones.required' => 'Las instrucciones de la tarea son obligatorias.',
            'puntuacion.required' => 'La puntuación máxima es obligatoria.',
            'puntuacion.min' => 'La puntuación mínima es 1.',
            'puntuacion.max' => 'La puntuación máxima permitida es 1000.',
            'fecha_limite.required' => 'La fecha límite es obligatoria.',
            'max_archivos.max' => 'El número máximo de archivos permitidos es 20.',
            'recursos.*.max' => 'Cada archivo no debe superar los 50MB.',
        ];
    }
}
