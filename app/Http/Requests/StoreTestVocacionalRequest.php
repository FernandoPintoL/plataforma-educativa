<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestVocacionalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->hasRole(['profesor', 'director']) || auth()->user()->esProfesor() || auth()->user()->esDirector());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255|unique:tests_vocacionales',
            'descripcion' => 'nullable|string|max:1000',
            'duracion_estimada' => 'nullable|integer|min:1|max:480', // máximo 8 horas
            'activo' => 'boolean',
        ];
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del test es requerido',
            'nombre.unique' => 'Ya existe un test con este nombre',
            'duracion_estimada.max' => 'La duración estimada no puede superar 480 minutos (8 horas)',
        ];
    }
}
