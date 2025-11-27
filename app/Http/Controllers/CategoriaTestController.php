<?php

namespace App\Http\Controllers;

use App\Models\TestVocacional;
use App\Models\CategoriaTest;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoriaTestController extends Controller
{
    /**
     * Autorizar acceso al test
     */
    private function autorizar(TestVocacional $test)
    {
        $user = auth()->user();

        if (!$user->hasRole(['profesor', 'director'])) {
            abort(403, 'No tienes permiso para gestionar este test');
        }

        if ($user->hasRole('profesor') && $test->created_by !== $user->id && !$user->hasRole('director')) {
            abort(403, 'Solo puedes gestionar tests que creaste');
        }
    }

    /**
     * Store a newly created category
     * POST /tests-vocacionales/{testId}/categorias
     */
    public function store(Request $request, TestVocacional $test)
    {
        $this->autorizar($test);

        $validated = $request->validate([
            'nombre' => 'required|string|min:3|max:255',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        try {
            // Get next orden value
            $maxOrden = $test->categorias()->max('orden') ?? 0;
            $validated['orden'] = $maxOrden + 1;

            $categoria = $test->categorias()->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Categoría creada exitosamente',
                'categoria' => $categoria,
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creando categoría: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la categoría',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified category
     * PUT /tests-vocacionales/{testId}/categorias/{categoriaId}
     */
    public function update(Request $request, TestVocacional $test, CategoriaTest $categoria)
    {
        $this->autorizar($test);

        // Verify categoria belongs to this test
        if ($categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Categoría no encontrada');
        }

        $validated = $request->validate([
            'nombre' => 'required|string|min:3|max:255',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        try {
            $categoria->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Categoría actualizada exitosamente',
                'categoria' => $categoria,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error actualizando categoría: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la categoría',
            ], 500);
        }
    }

    /**
     * Delete the specified category
     * DELETE /tests-vocacionales/{testId}/categorias/{categoriaId}
     */
    public function destroy(TestVocacional $test, CategoriaTest $categoria)
    {
        $this->autorizar($test);

        // Verify categoria belongs to this test
        if ($categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Categoría no encontrada');
        }

        try {
            // Delete will cascade to preguntas (foreign key constraint)
            $categoria->delete();

            // Reorder remaining categorias
            $this->reordenaCategorias($test);

            return response()->json([
                'success' => true,
                'message' => 'Categoría eliminada exitosamente',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error eliminando categoría: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la categoría',
            ], 500);
        }
    }

    /**
     * Reorder categories
     * POST /tests-vocacionales/{testId}/categorias/reorder
     */
    public function reorder(Request $request, TestVocacional $test)
    {
        $this->autorizar($test);

        $validated = $request->validate([
            'orden' => 'required|array',
            'orden.*' => 'required|integer|exists:categoria_tests,id',
        ]);

        try {
            $orden = $validated['orden'];

            // Verify all IDs belong to this test
            $countIds = CategoriaTest::whereIn('id', $orden)
                ->where('test_vocacional_id', $test->id)
                ->count();

            if ($countIds !== count($orden)) {
                return response()->json([
                    'success' => false,
                    'message' => 'IDs de categorías inválidos',
                ], 400);
            }

            // Update orden for each categoria
            foreach ($orden as $index => $categoriaId) {
                CategoriaTest::where('id', $categoriaId)->update(['orden' => $index + 1]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Categorías reordenadas exitosamente',
                'categorias' => $test->categorias()->orderBy('orden')->get(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error reordenando categorías: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al reordenar las categorías',
            ], 500);
        }
    }

    /**
     * Helper: Reorder categorias after deletion
     */
    private function reordenaCategorias(TestVocacional $test)
    {
        $categorias = $test->categorias()
            ->orderBy('orden')
            ->pluck('id')
            ->toArray();

        foreach ($categorias as $index => $id) {
            CategoriaTest::where('id', $id)->update(['orden' => $index + 1]);
        }
    }

    /**
     * Get all categories with questions for a test
     * GET /tests-vocacionales/{testId}/categorias
     */
    public function index(TestVocacional $test)
    {
        $this->autorizar($test);

        $categorias = $test->categorias()
            ->with('preguntas')
            ->orderBy('orden')
            ->get();

        return response()->json([
            'success' => true,
            'categorias' => $categorias,
        ]);
    }

    /**
     * Get single category with questions
     * GET /tests-vocacionales/{testId}/categorias/{categoriaId}
     */
    public function show(TestVocacional $test, CategoriaTest $categoria)
    {
        $this->autorizar($test);

        if ($categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Categoría no encontrada');
        }

        $categoria->load('preguntas');

        return response()->json([
            'success' => true,
            'categoria' => $categoria,
        ]);
    }
}
