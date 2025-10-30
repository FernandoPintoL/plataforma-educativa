<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLeccionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo profesores y directores pueden crear lecciones
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
            'modulo_educativo_id' => ['required', 'exists:modulos_educativos,id'],
            'titulo' => ['required', 'string', 'max:255'],
            'contenido' => ['nullable', 'string'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:lecciones,slug'],
            'tipo' => ['required', 'in:video,lectura,actividad,quiz,recurso,enlace'],
            'orden' => ['nullable', 'integer', 'min:0'],
            'duracion_estimada' => ['nullable', 'integer', 'min:0'],
            'video_url' => ['nullable', 'string', 'max:500'],
            'video_proveedor' => ['nullable', 'in:youtube,vimeo,local'],
            'es_obligatoria' => ['boolean'],
            'permite_descarga' => ['boolean'],
            'estado' => ['nullable', 'in:borrador,publicado,archivado'],
            'recursos' => ['nullable', 'array'],
            'recursos.*' => ['exists:recursos,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'modulo_educativo_id' => 'módulo educativo',
            'titulo' => 'título',
            'contenido' => 'contenido',
            'tipo' => 'tipo',
            'duracion_estimada' => 'duración estimada',
            'video_url' => 'URL del video',
            'video_proveedor' => 'proveedor del video',
            'es_obligatoria' => 'obligatoria',
            'permite_descarga' => 'permite descarga',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'modulo_educativo_id.required' => 'Debes seleccionar un módulo educativo.',
            'modulo_educativo_id.exists' => 'El módulo educativo no existe.',
            'titulo.required' => 'El título de la lección es obligatorio.',
            'titulo.max' => 'El título no puede exceder los 255 caracteres.',
            'tipo.required' => 'Debes seleccionar un tipo de lección.',
            'tipo.in' => 'El tipo de lección no es válido.',
            'video_proveedor.in' => 'El proveedor de video debe ser: youtube, vimeo o local.',
            'estado.in' => 'El estado debe ser: borrador, publicado o archivado.',
        ];
    }
}
