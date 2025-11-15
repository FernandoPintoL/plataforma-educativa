<?php

namespace App\Http\Controllers;

use App\Models\AdjuntoTrabajo;
use App\Models\Trabajo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AdjuntoTrabajoController extends Controller
{
    /**
     * Tamaño máximo de archivo permitido en bytes (10 MB)
     */
    private const MAX_FILE_SIZE = 10 * 1024 * 1024;

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
     * Subir un nuevo adjunto al trabajo
     */
    public function store(Request $request, Trabajo $trabajo)
    {
        // Validar que el usuario sea el dueño del trabajo
        if ($trabajo->estudiante_id !== $request->user()->id) {
            return back()->withErrors(['error' => 'No tienes permiso para adjuntar archivos a este trabajo']);
        }

        // Validar el archivo
        $request->validate([
            'archivo' => [
                'required',
                'file',
                'max:' . (self::MAX_FILE_SIZE / 1024), // en kilobytes
                function ($attribute, $value, $fail) {
                    if (!in_array($value->getMimeType(), self::ALLOWED_MIME_TYPES)) {
                        $fail('El tipo de archivo no está permitido.');
                    }
                },
            ],
            'descripcion' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $archivo = $request->file('archivo');

            // Generar nombre único para el archivo
            $nombreArchivo = time() . '_' . hash('sha256', $archivo->getClientOriginalName()) . '.' . $archivo->getClientOriginalExtension();

            // Guardar el archivo
            $ruta = $archivo->storeAs("trabajos/{$trabajo->id}", $nombreArchivo, 'public');

            // Crear registro del adjunto
            $adjunto = AdjuntoTrabajo::create([
                'trabajo_id' => $trabajo->id,
                'nombre_original' => $archivo->getClientOriginalName(),
                'archivo_path' => $ruta,
                'mime_type' => $archivo->getMimeType(),
                'tamanio' => $archivo->getSize(),
                'hash' => hash_file('sha256', $archivo->getRealPath()),
                'descripcion' => $request->input('descripcion'),
            ]);

            DB::commit();

            return back()->with('success', 'Archivo adjuntado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            // Limpiar archivo si fue guardado
            if (isset($ruta)) {
                Storage::disk('public')->delete($ruta);
            }
            return back()->withErrors(['error' => 'Error al adjuntar el archivo: ' . $e->getMessage()]);
        }
    }

    /**
     * Descargar un adjunto
     */
    public function descargar(AdjuntoTrabajo $adjunto)
    {
        // Verificar permisos - el usuario debe ser el propietario del trabajo o un profesor del curso
        $trabajo = $adjunto->trabajo;
        $usuario = auth()->user();

        $puedeDescargar =
            $trabajo->estudiante_id === $usuario->id ||
            $trabajo->contenido->creador_id === $usuario->id ||
            $usuario->roles()->where('name', 'director')->exists();

        if (!$puedeDescargar) {
            abort(403, 'No tienes permiso para descargar este archivo');
        }

        if (!Storage::disk('public')->exists($adjunto->archivo_path)) {
            abort(404, 'Archivo no encontrado');
        }

        return Storage::disk('public')->download(
            $adjunto->archivo_path,
            $adjunto->nombre_original
        );
    }

    /**
     * Eliminar un adjunto
     */
    public function destroy(AdjuntoTrabajo $adjunto)
    {
        // Verificar que el usuario sea el dueño del trabajo
        if ($adjunto->trabajo->estudiante_id !== auth()->user()->id) {
            return back()->withErrors(['error' => 'No tienes permiso para eliminar este archivo']);
        }

        try {
            DB::beginTransaction();

            $adjunto->delete();

            DB::commit();

            return back()->with('success', 'Archivo eliminado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Error al eliminar el archivo: ' . $e->getMessage()]);
        }
    }
}
