<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTareaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo profesores pueden crear tareas
        return $this->user() && $this->user()->esProfesor();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'instrucciones' => 'required|string',
            'curso_id' => 'required|exists:cursos,id',
            'puntuacion' => 'required|integer|min:1|max:1000',
            'fecha_limite' => 'required|date|after:now',
            'permite_archivos' => 'boolean',
            'max_archivos' => 'nullable|integer|min:1|max:20',
            'tipo_archivo_permitido' => 'nullable|string',
            'estado' => 'required|in:borrador,publicado',
            'recursos' => 'nullable|array',
            'recursos.*' => 'file|max:51200', // 50MB por archivo
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
            'curso_id.required' => 'Debes seleccionar un curso.',
            'curso_id.exists' => 'El curso seleccionado no existe.',
            'puntuacion.required' => 'La puntuación máxima es obligatoria.',
            'puntuacion.min' => 'La puntuación mínima es 1.',
            'puntuacion.max' => 'La puntuación máxima permitida es 1000.',
            'fecha_limite.required' => 'La fecha límite es obligatoria.',
            'fecha_limite.after' => 'La fecha límite debe ser posterior a la fecha actual.',
            'max_archivos.max' => 'El número máximo de archivos permitidos es 20.',
            'recursos.*.max' => 'Cada archivo no debe superar los 50MB.',
        ];
    }
}
