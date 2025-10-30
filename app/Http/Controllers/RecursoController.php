<?php

namespace App\Http\Controllers;

use App\Models\Recurso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RecursoController extends Controller
{
    /**
     * Mostrar listado de recursos
     */
    public function index(Request $request)
    {
        $query = Recurso::query()->orderBy('created_at', 'desc');

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('descripcion', 'like', "%{$search}%");
            });
        }

        // Filtro por tipo
        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        // Filtro por estado activo
        if ($request->filled('activo')) {
            $query->where('activo', $request->activo === 'true');
        }

        // Ordenamiento
        if ($request->filled('sort')) {
            $direction = $request->get('direction', 'asc');
            $query->orderBy($request->sort, $direction);
        }

        $recursos = $query->paginate(15)->withQueryString();

        return Inertia::render('Recursos/Index', [
            'recursos' => $recursos,
            'filters' => $request->only(['search', 'tipo', 'activo', 'sort', 'direction'])
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        return Inertia::render('Recursos/Create');
    }

    /**
     * Almacenar nuevo recurso
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:video,documento,imagen,audio,enlace,presentacion',
            'descripcion' => 'nullable|string',
            'url' => 'nullable|url|max:500',
            'archivo' => 'nullable|file|max:51200', // 50MB max
            'activo' => 'boolean'
        ]);

        $data = $request->only(['nombre', 'tipo', 'descripcion', 'url', 'activo']);

        // Manejar archivo si se sube
        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $path = $file->store('recursos', 'public');

            $data['archivo_path'] = $path;
            $data['tamaño'] = $file->getSize();
            $data['mime_type'] = $file->getMimeType();
        }

        Recurso::create($data);

        return redirect()->route('recursos.index')
            ->with('success', 'Recurso creado exitosamente.');
    }

    /**
     * Mostrar un recurso específico
     */
    public function show(Recurso $recurso)
    {
        return Inertia::render('Recursos/Show', [
            'recurso' => $recurso
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(Recurso $recurso)
    {
        return Inertia::render('Recursos/Edit', [
            'recurso' => $recurso
        ]);
    }

    /**
     * Actualizar recurso
     */
    public function update(Request $request, Recurso $recurso)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:video,documento,imagen,audio,enlace,presentacion',
            'descripcion' => 'nullable|string',
            'url' => 'nullable|url|max:500',
            'archivo' => 'nullable|file|max:51200', // 50MB max
            'activo' => 'boolean'
        ]);

        $data = $request->only(['nombre', 'tipo', 'descripcion', 'url', 'activo']);

        // Manejar nuevo archivo si se sube
        if ($request->hasFile('archivo')) {
            // Eliminar archivo anterior si existe
            if ($recurso->archivo_path) {
                Storage::disk('public')->delete($recurso->archivo_path);
            }

            $file = $request->file('archivo');
            $path = $file->store('recursos', 'public');

            $data['archivo_path'] = $path;
            $data['tamaño'] = $file->getSize();
            $data['mime_type'] = $file->getMimeType();
        }

        $recurso->update($data);

        return redirect()->route('recursos.index')
            ->with('success', 'Recurso actualizado exitosamente.');
    }

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
