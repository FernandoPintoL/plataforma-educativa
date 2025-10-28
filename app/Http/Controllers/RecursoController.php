<?php

namespace App\Http\Controllers;

use App\Models\Recurso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RecursoController extends Controller
{
    /**
     * Descargar un recurso
     */
    public function descargar(Recurso $recurso)
    {
        $user = auth()->user();

        // Verificar que el recurso esté asociado a un contenido al que el usuario tiene acceso
        $contenidos = $recurso->contenidos;

        if ($contenidos->isEmpty()) {
            abort(404, 'Recurso no encontrado.');
        }

        $tieneAcceso = false;

        foreach ($contenidos as $contenido) {
            // Profesor: puede descargar si es el creador
            if ($user->esProfesor() && $contenido->creador_id === $user->id) {
                $tieneAcceso = true;
                break;
            }

            // Estudiante: puede descargar si está inscrito en el curso
            if ($user->esEstudiante()) {
                $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
                if ($cursosIds->contains($contenido->curso_id)) {
                    $tieneAcceso = true;
                    break;
                }
            }
        }

        if (!$tieneAcceso) {
            abort(403, 'No tienes acceso a este recurso.');
        }

        // Verificar que el archivo existe
        if ($recurso->archivo_path && Storage::disk('public')->exists($recurso->archivo_path)) {
            return Storage::disk('public')->download($recurso->archivo_path, $recurso->nombre);
        }

        // Si es un enlace, redirigir
        if ($recurso->url) {
            return redirect($recurso->url);
        }

        abort(404, 'El archivo no existe.');
    }

    /**
     * Ver un recurso en el navegador (streaming)
     */
    public function ver(Recurso $recurso)
    {
        $user = auth()->user();

        // Verificar acceso (misma lógica que descargar)
        $contenidos = $recurso->contenidos;

        if ($contenidos->isEmpty()) {
            abort(404, 'Recurso no encontrado.');
        }

        $tieneAcceso = false;

        foreach ($contenidos as $contenido) {
            if ($user->esProfesor() && $contenido->creador_id === $user->id) {
                $tieneAcceso = true;
                break;
            }

            if ($user->esEstudiante()) {
                $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
                if ($cursosIds->contains($contenido->curso_id)) {
                    $tieneAcceso = true;
                    break;
                }
            }
        }

        if (!$tieneAcceso) {
            abort(403, 'No tienes acceso a este recurso.');
        }

        // Verificar que el archivo existe
        if ($recurso->archivo_path && Storage::disk('public')->exists($recurso->archivo_path)) {
            return Storage::disk('public')->response($recurso->archivo_path);
        }

        abort(404, 'El archivo no existe.');
    }

    /**
     * Eliminar un recurso (solo el creador del contenido)
     */
    public function destroy(Recurso $recurso)
    {
        $user = auth()->user();

        // Verificar que el usuario sea el creador del contenido asociado
        $contenidos = $recurso->contenidos;

        if ($contenidos->isEmpty()) {
            abort(404, 'Recurso no encontrado.');
        }

        $esCreador = false;

        foreach ($contenidos as $contenido) {
            if ($contenido->creador_id === $user->id) {
                $esCreador = true;
                break;
            }
        }

        if (!$esCreador) {
            abort(403, 'No tienes permiso para eliminar este recurso.');
        }

        try {
            // Eliminar archivo físico si existe
            if ($recurso->archivo_path) {
                Storage::disk('public')->delete($recurso->archivo_path);
            }

            $recurso->delete();

            return back()->with('success', 'Recurso eliminado exitosamente.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al eliminar el recurso: ' . $e->getMessage()]);
        }
    }
}
