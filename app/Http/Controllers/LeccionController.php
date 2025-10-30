<?php

namespace App\Http\Controllers;

use App\Models\Leccion;
use App\Models\ModuloEducativo;
use App\Models\Recurso;
use App\Http\Requests\StoreLeccionRequest;
use App\Http\Requests\UpdateLeccionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LeccionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Leccion::with(['moduloEducativo.curso', 'recursos']);

        // Filtrar por permisos del usuario
        if ($user->esProfesor()) {
            $query->whereHas('moduloEducativo', function ($q) use ($user) {
                $q->where('creador_id', $user->id);
            });
        } elseif ($user->esEstudiante()) {
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
            $query->whereHas('moduloEducativo', function ($q) use ($cursosIds) {
                $q->whereIn('curso_id', $cursosIds)
                    ->where('estado', 'publicado');
            })->where('estado', 'publicado');
        }

        // Filtros
        if ($request->filled('modulo_id')) {
            $query->where('modulo_educativo_id', $request->modulo_id);
        }

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
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

        $lecciones = $query->paginate(15)->withQueryString();

        // Obtener módulos para el filtro
        $modulos = $user->esProfesor()
            ? ModuloEducativo::where('creador_id', $user->id)->get()
            : ModuloEducativo::all();

        return Inertia::render('Lecciones/Index', [
            'lecciones' => $lecciones,
            'modulos' => $modulos,
            'filters' => $request->only(['modulo_id', 'tipo', 'estado', 'search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $user = auth()->user();

        $modulos = $user->esProfesor()
            ? ModuloEducativo::where('creador_id', $user->id)->get()
            : ModuloEducativo::all();

        $moduloId = $request->get('modulo_id');
        $recursos = Recurso::where('activo', true)->get();

        return Inertia::render('Lecciones/Create', [
            'modulos' => $modulos,
            'modulo_id' => $moduloId,
            'recursos' => $recursos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLeccionRequest $request)
    {
        $data = $request->validated();

        // Establecer estado por defecto
        if (!isset($data['estado'])) {
            $data['estado'] = 'borrador';
        }

        $leccion = Leccion::create($data);

        // Asociar recursos si existen
        if ($request->has('recursos') && is_array($request->recursos)) {
            foreach ($request->recursos as $index => $recursoId) {
                $leccion->asociarRecurso($recursoId, $index + 1);
            }
        }

        return redirect()->route('modulos.show', $leccion->modulo_educativo_id)
            ->with('success', 'Lección creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Leccion $leccione)
    {
        $user = auth()->user();
        $leccion = $leccione;

        // Verificar permisos
        $modulo = $leccion->moduloEducativo;

        if ($user->esEstudiante()) {
            $cursosIds = $user->cursosComoEstudiante()->pluck('cursos.id');
            if (!$cursosIds->contains($modulo->curso_id) || !$leccion->estaPublicada() || !$modulo->estaPublicado()) {
                abort(403, 'No tienes acceso a esta lección.');
            }
        } elseif ($user->esProfesor() && $modulo->creador_id !== $user->id) {
            abort(403, 'No tienes acceso a esta lección.');
        }

        $leccion->load(['moduloEducativo.curso', 'recursos']);

        // Obtener lecciones vecinas (anterior y siguiente)
        $leccionAnterior = Leccion::where('modulo_educativo_id', $leccion->modulo_educativo_id)
            ->where('orden', '<', $leccion->orden)
            ->orderBy('orden', 'desc')
            ->first();

        $leccionSiguiente = Leccion::where('modulo_educativo_id', $leccion->modulo_educativo_id)
            ->where('orden', '>', $leccion->orden)
            ->orderBy('orden', 'asc')
            ->first();

        return Inertia::render('Lecciones/Show', [
            'leccion' => $leccion,
            'leccion_anterior' => $leccionAnterior,
            'leccion_siguiente' => $leccionSiguiente,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Leccion $leccione)
    {
        $user = auth()->user();
        $leccion = $leccione;
        $modulo = $leccion->moduloEducativo;

        // Verificar permisos
        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para editar esta lección.');
        }

        $leccion->load(['recursos']);

        $modulos = $user->esProfesor()
            ? ModuloEducativo::where('creador_id', $user->id)->get()
            : ModuloEducativo::all();

        $recursos = Recurso::where('activo', true)->get();

        // IDs de recursos asociados
        $recursosAsociados = $leccion->recursos->pluck('id')->toArray();

        return Inertia::render('Lecciones/Edit', [
            'leccion' => $leccion,
            'modulos' => $modulos,
            'recursos' => $recursos,
            'recursos_asociados' => $recursosAsociados,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLeccionRequest $request, Leccion $leccione)
    {
        $leccion = $leccione;
        $data = $request->validated();

        $leccion->update($data);

        // Sincronizar recursos
        if ($request->has('recursos')) {
            $leccion->recursos()->detach();

            if (is_array($request->recursos)) {
                foreach ($request->recursos as $index => $recursoId) {
                    $leccion->asociarRecurso($recursoId, $index + 1);
                }
            }
        }

        return redirect()->route('modulos.show', $leccion->modulo_educativo_id)
            ->with('success', 'Lección actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leccion $leccione)
    {
        $user = auth()->user();
        $leccion = $leccione;
        $modulo = $leccion->moduloEducativo;

        // Verificar permisos
        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para eliminar esta lección.');
        }

        $moduloId = $leccion->modulo_educativo_id;
        $leccion->delete();

        return redirect()->route('modulos.show', $moduloId)
            ->with('success', 'Lección eliminada exitosamente.');
    }

    /**
     * Publicar la lección
     */
    public function publicar(Leccion $leccione)
    {
        $user = auth()->user();
        $leccion = $leccione;
        $modulo = $leccion->moduloEducativo;

        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para publicar esta lección.');
        }

        $leccion->publicar();

        return back()->with('success', 'Lección publicada exitosamente.');
    }

    /**
     * Archivar la lección
     */
    public function archivar(Leccion $leccione)
    {
        $user = auth()->user();
        $leccion = $leccione;
        $modulo = $leccion->moduloEducativo;

        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para archivar esta lección.');
        }

        $leccion->archivar();

        return back()->with('success', 'Lección archivada exitosamente.');
    }

    /**
     * Reordenar lecciones
     */
    public function reordenar(Request $request)
    {
        $request->validate([
            'orden' => 'required|array',
            'orden.*' => 'exists:lecciones,id',
        ]);

        Leccion::reordenar($request->orden);

        return back()->with('success', 'Lecciones reordenadas exitosamente.');
    }

    /**
     * Duplicar lección
     */
    public function duplicar(Leccion $leccione)
    {
        $user = auth()->user();
        $leccion = $leccione;
        $modulo = $leccion->moduloEducativo;

        if ($user->esProfesor() && $modulo->creador_id !== $user->id && !$user->esDirector()) {
            abort(403, 'No tienes permiso para duplicar esta lección.');
        }

        $nuevaLeccion = $leccion->duplicar();

        return redirect()->route('lecciones.edit', $nuevaLeccion)
            ->with('success', 'Lección duplicada exitosamente. Puedes editarla ahora.');
    }
}
