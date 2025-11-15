<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdjuntoTrabajoRequest extends FormRequest
{
    /**
     * Tamaño máximo de archivo permitido (10 MB)
     */
    private const MAX_FILE_SIZE = 10240; // kilobytes

    /**
     * Tipos MIME permitidos
     */
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'text/csv',
        'application/zip',
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // El usuario debe ser el propietario del trabajo
        return auth()->check() &&
               $this->route('trabajo')->estudiante_id === auth()->id();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'archivo' => [
                'required',
                'file',
                'max:' . self::MAX_FILE_SIZE,
                Rule::in(array_values(self::ALLOWED_MIME_TYPES))->using('mimes'),
            ],
            'descripcion' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom error messages
     */
    public function messages(): array
    {
        return [
            'archivo.required' => 'Debe adjuntar un archivo',
            'archivo.file' => 'El archivo debe ser un fichero válido',
            'archivo.max' => 'El archivo no puede superar 10 MB',
            'archivo.in' => 'El tipo de archivo no está permitido',
            'descripcion.max' => 'La descripción no puede superar 500 caracteres',
        ];
    }
}
