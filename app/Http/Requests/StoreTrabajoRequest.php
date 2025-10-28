<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Tarea;

class StoreTrabajoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Solo estudiantes pueden entregar trabajos
        if (!$this->user() || !$this->user()->esEstudiante()) {
            return false;
        }

        // Verificar que el estudiante esté inscrito en el curso de la tarea
        $tarea = $this->route('tarea');
        if (!$tarea) {
            return false;
        }

        return $this->user()
            ->cursosComoEstudiante()
            ->where('cursos.id', $tarea->contenido->curso_id)
            ->exists();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $tarea = $this->route('tarea');

        $rules = [
            'comentarios' => 'nullable|string|max:5000',
            'archivos' => 'nullable|array',
        ];

        // Si la tarea permite archivos, validar según sus restricciones
        if ($tarea && $tarea->permite_archivos) {
            $maxArchivos = $tarea->max_archivos ?? 5;
            $rules['archivos'] = "nullable|array|max:{$maxArchivos}";
            $rules['archivos.*'] = 'file|max:51200'; // 50MB

            // Si hay tipos de archivo específicos permitidos
            if ($tarea->tipo_archivo_permitido) {
                $tiposPermitidos = $tarea->getTiposArchivoPermitidos();
                if (!empty($tiposPermitidos)) {
                    $mimeTypes = implode(',', $tiposPermitidos);
                    $rules['archivos.*'] .= "|mimes:{$mimeTypes}";
                }
            }
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        $tarea = $this->route('tarea');
        $maxArchivos = $tarea ? $tarea->max_archivos : 5;

        return [
            'comentarios.max' => 'Los comentarios no pueden exceder los 5000 caracteres.',
            'archivos.array' => 'Los archivos deben enviarse en un formato válido.',
            'archivos.max' => "Solo puedes subir un máximo de {$maxArchivos} archivos.",
            'archivos.*.file' => 'Cada elemento debe ser un archivo válido.',
            'archivos.*.max' => 'Cada archivo no debe superar los 50MB.',
            'archivos.*.mimes' => 'El tipo de archivo no está permitido para esta tarea.',
        ];
    }
}
