<?php

namespace App\Http\Controllers;

use App\Models\ModuloEducativo;
use App\Models\Curso;
use App\Http\Requests\StoreModuloEducativoRequest;
use App\Http\Requests\UpdateModuloEducativoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ModuloEducativoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = ModuloEducativo::with(['curso', 'creador', 'lecciones']);

        if ($user->esProfesor()) {
            // Profesor: ver solo los módulos que ha creado
            $query->where('creador_id', $user->id);
        } elseif ($user->esEstudiante()) {
            // Estudiante: ver módulos de los cursos en los que está inscrito
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
            $query->whereIn('curso_id', $cursosIds)
                ->where('estado', 'publicado');
        }

        // Filtros
        if ($request->filled('curso_id')) {
            $query->where('curso_id', $request->curso_id);
        }

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('search')) {
            $query->buscar($request->search);
        }

        // Ordenar
        $sortField = $request->get('sort', 'orden');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $modulos = $query->paginate(15)->withQueryString();

        // Agregar información adicional a cada módulo
        $modulos->getCollection()->transform(function ($modulo) {
            $modulo->total_lecciones = $modulo->getTotalLecciones();
            $modulo->duracion_total = $modulo->getDuracionTotal();
            return $modulo;
        });

        // Obtener cursos para el filtro
        $cursos = $user->esProfesor()
            ? $user->cursosComoProfesor()->get()
            : ($user->esEstudiante() ? $user->cursosComoEstudiante()->get() : Curso::all());

        return Inertia::render('Modulos/Index', [
            'modulos' => $modulos,
            'cursos' => $cursos,
            'filters' => $request->only(['curso_id', 'estado', 'search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth()->user();

        $cursos = $user->esProfesor()
            ? $user->cursosComoProfesor()->get()
            : Curso::all();

        return Inertia::render('Modulos/Create', [
            'cursos' => $cursos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreModuloEducativoRequest $request)
    {
        $data = $request->validated();
        $data['creador_id'] = auth()->id();

        // Manejar la imagen de portada si existe
        if ($request->hasFile('imagen_portada')) {
            $path = $request->file('imagen_portada')->store('modulos/portadas', 'public');
            $data['imagen_portada'] = $path;
        }

        // Establecer estado por defecto
        if (!isset($data['estado'])) {
            $data['estado'] = 'borrador';
        }

        $modulo = ModuloEducativo::create($data);

        return redirect()->route('modulos.show', $modulo)
            ->with('success', 'Módulo educativo creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ModuloEducativo $modulo)
    {
        $user = auth()->user();

        // Verificar permisos
        if ($user->esEstudiante()) {
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
            if (!$cursosIds->contains($modulo->curso_id) || !$modulo->estaPublicado()) {
                abort(403, 'No tienes acceso a este módulo.');
            }
        } elseif ($user->esProfesor() && $modulo->creador_id !== $user->id) {
            abort(403, 'No tienes acceso a este módulo.');
        }

        $modulo->load(['curso', 'creador', 'lecciones.recursos']);

        // Información adicional
        $modulo->total_lecciones = $modulo->getTotalLecciones();
        $modulo->duracion_total = $modulo->getDuracionTotal();

        // Progreso del estudiante si aplica
        if ($user->esEstudiante()) {
            $modulo->progreso = $modulo->getProgresoEstudiante($user);
        }

        return Inertia::render('Modulos/Show', [
            'modulo' => $modulo,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ModuloEducativo $modulo)
    {
        $user = auth()->user();

        // Verificar permisos
        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para editar este módulo.');
        }

        $modulo->load(['lecciones']);

        $cursos = $user->esProfesor()
            ? $user->cursosComoProfesor()->get()
            : Curso::all();

        return Inertia::render('Modulos/Edit', [
            'modulo' => $modulo,
            'cursos' => $cursos,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateModuloEducativoRequest $request, ModuloEducativo $modulo)
    {
        $data = $request->validated();

        // Manejar la imagen de portada si existe
        if ($request->hasFile('imagen_portada')) {
            // Eliminar la imagen anterior si existe
            if ($modulo->imagen_portada) {
                Storage::disk('public')->delete($modulo->imagen_portada);
            }

            $path = $request->file('imagen_portada')->store('modulos/portadas', 'public');
            $data['imagen_portada'] = $path;
        }

        $modulo->update($data);

        return redirect()->route('modulos.show', $modulo)
            ->with('success', 'Módulo educativo actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ModuloEducativo $modulo)
    {
        $user = auth()->user();

        // Verificar permisos
        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para eliminar este módulo.');
        }

        // Eliminar imagen de portada si existe
        if ($modulo->imagen_portada) {
            Storage::disk('public')->delete($modulo->imagen_portada);
        }

        $modulo->delete();

        return redirect()->route('modulos.index')
            ->with('success', 'Módulo educativo eliminado exitosamente.');
    }

    /**
     * Publicar el módulo
     */
    public function publicar(ModuloEducativo $modulo)
    {
        $user = auth()->user();

        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para publicar este módulo.');
        }

        $modulo->publicar();

        return back()->with('success', 'Módulo publicado exitosamente.');
    }

    /**
     * Archivar el módulo
     */
    public function archivar(ModuloEducativo $modulo)
    {
        $user = auth()->user();

        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para archivar este módulo.');
        }

        $modulo->archivar();

        return back()->with('success', 'Módulo archivado exitosamente.');
    }

    /**
     * Reordenar módulos
     */
    public function reordenar(Request $request)
    {
        $request->validate([
            'orden' => 'required|array',
            'orden.*' => 'exists:modulos_educativos,id',
        ]);

        ModuloEducativo::reordenar($request->orden);

        return back()->with('success', 'Módulos reordenados exitosamente.');
    }

    /**
     * Duplicar módulo
     */
    public function duplicar(ModuloEducativo $modulo)
    {
        $user = auth()->user();

        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para duplicar este módulo.');
        }

        $nuevoModulo = $modulo->duplicar();

        return redirect()->route('modulos.edit', $nuevoModulo)
            ->with('success', 'Módulo duplicado exitosamente. Puedes editarlo ahora.');
    }
}
