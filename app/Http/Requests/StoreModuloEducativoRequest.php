<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreModuloEducativoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo profesores y directores pueden crear módulos
        return $this->user()?->esProfesor() || $this->user()?->esDirector();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:modulos_educativos,slug'],
            'curso_id' => ['required', 'exists:cursos,id'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'imagen_portada' => ['nullable', 'image', 'max:2048'], // Max 2MB
            'estado' => ['nullable', 'in:borrador,publicado,archivado'],
            'duracion_estimada' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'titulo' => 'título',
            'descripcion' => 'descripción',
            'curso_id' => 'curso',
            'imagen_portada' => 'imagen de portada',
            'duracion_estimada' => 'duración estimada',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'titulo.required' => 'El título del módulo es obligatorio.',
            'titulo.max' => 'El título no puede exceder los 255 caracteres.',
            'curso_id.required' => 'Debes seleccionar un curso.',
            'curso_id.exists' => 'El curso seleccionado no existe.',
            'imagen_portada.image' => 'El archivo debe ser una imagen.',
            'imagen_portada.max' => 'La imagen no puede pesar más de 2MB.',
            'estado.in' => 'El estado debe ser: borrador, publicado o archivado.',
        ];
    }
}
