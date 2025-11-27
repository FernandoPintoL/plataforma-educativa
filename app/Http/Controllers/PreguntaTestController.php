<?php

namespace App\Http\Controllers;

use App\Models\TestVocacional;
use App\Models\CategoriaTest;
use App\Models\PreguntaTest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PreguntaTestController extends Controller
{
    /**
     * Question types
     */
    const TIPOS_PREGUNTA = [
        'opcion_multiple' => 'Opción Múltiple',
        'escala_likert' => 'Escala Likert',
        'verdadero_falso' => 'Verdadero/Falso',
    ];

    /**
     * Autorizar acceso
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
     * Validate question data based on type
     */
    private function validarPregunta(Request $request, $tipo)
    {
        $rules = [
            'enunciado' => 'required|string|min:10|max:500',
            'tipo' => ['required', Rule::in(array_keys(self::TIPOS_PREGUNTA))],
        ];

        // Validaciones específicas por tipo
        switch ($tipo) {
            case 'opcion_multiple':
                $rules['opciones'] = 'required|json|array';
                $rules['opciones.*'] = 'required|string|min:2|max:100';
                break;

            case 'verdadero_falso':
                // No requiere opciones, se generan automáticamente
                break;

            case 'escala_likert':
                // Opcionales para Likert
                $rules['escala_minima'] = 'nullable|integer|min:1|max:10';
                $rules['escala_maxima'] = 'nullable|integer|min:1|max:10';
                break;
        }

        return $request->validate($rules);
    }

    /**
     * Store a newly created question
     * POST /tests-vocacionales/{testId}/categorias/{categoriaId}/preguntas
     */
    public function store(Request $request, TestVocacional $test, CategoriaTest $categoria)
    {
        $this->autorizar($test);

        // Verify categoria belongs to test
        if ($categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Categoría no encontrada');
        }

        $tipo = $request->input('tipo');
        $validated = $this->validarPregunta($request, $tipo);

        try {
            // Get next orden
            $maxOrden = $categoria->preguntas()->max('orden') ?? 0;
            $validated['orden'] = $maxOrden + 1;
            $validated['categoria_test_id'] = $categoria->id;

            // Process opciones based on type
            if ($tipo === 'verdadero_falso') {
                $validated['opciones'] = json_encode(['Verdadero', 'Falso']);
            } elseif ($tipo === 'opcion_multiple') {
                // Convert array to JSON if not already
                if (is_array($validated['opciones'])) {
                    $validated['opciones'] = json_encode($validated['opciones']);
                }

                // Validate option count (2-5 options)
                $opcionesArray = is_array($validated['opciones'])
                    ? $validated['opciones']
                    : json_decode($validated['opciones'], true);

                if (count($opcionesArray) < 2 || count($opcionesArray) > 5) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Debe haber entre 2 y 5 opciones',
                    ], 422);
                }
            }

            $pregunta = PreguntaTest::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Pregunta creada exitosamente',
                'pregunta' => $pregunta->load('categoria'),
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Error creando pregunta: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al crear la pregunta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified question
     * PUT /tests-vocacionales/{testId}/preguntas/{preguntaId}
     */
    public function update(Request $request, TestVocacional $test, PreguntaTest $pregunta)
    {
        $this->autorizar($test);

        // Verify pregunta belongs to a categoria of this test
        if ($pregunta->categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Pregunta no encontrada');
        }

        $tipo = $request->input('tipo', $pregunta->tipo);
        $validated = $this->validarPregunta($request, $tipo);

        try {
            // Process opciones based on type
            if ($tipo === 'verdadero_falso') {
                $validated['opciones'] = json_encode(['Verdadero', 'Falso']);
            } elseif ($tipo === 'opcion_multiple') {
                if (is_array($validated['opciones'])) {
                    $validated['opciones'] = json_encode($validated['opciones']);
                }

                $opcionesArray = is_array($validated['opciones'])
                    ? $validated['opciones']
                    : json_decode($validated['opciones'], true);

                if (count($opcionesArray) < 2 || count($opcionesArray) > 5) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Debe haber entre 2 y 5 opciones',
                    ], 422);
                }
            }

            $pregunta->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Pregunta actualizada exitosamente',
                'pregunta' => $pregunta,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error actualizando pregunta: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar la pregunta',
            ], 500);
        }
    }

    /**
     * Delete the specified question
     * DELETE /tests-vocacionales/{testId}/preguntas/{preguntaId}
     */
    public function destroy(TestVocacional $test, PreguntaTest $pregunta)
    {
        $this->autorizar($test);

        // Verify pregunta belongs to this test
        if ($pregunta->categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Pregunta no encontrada');
        }

        try {
            $categoriaId = $pregunta->categoria_test_id;
            $pregunta->delete();

            // Reorder questions in the category
            $this->reordenarPreguntas($categoriaId);

            return response()->json([
                'success' => true,
                'message' => 'Pregunta eliminada exitosamente',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error eliminando pregunta: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar la pregunta',
            ], 500);
        }
    }

    /**
     * Reorder questions within a category
     * POST /tests-vocacionales/{testId}/categorias/{categoriaId}/preguntas/reorder
     */
    public function reorder(Request $request, TestVocacional $test, CategoriaTest $categoria)
    {
        $this->autorizar($test);

        if ($categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Categoría no encontrada');
        }

        $validated = $request->validate([
            'orden' => 'required|array',
            'orden.*' => 'required|integer|exists:preguntas_test,id',
        ]);

        try {
            $orden = $validated['orden'];

            // Verify all IDs belong to this categoria
            $countIds = PreguntaTest::whereIn('id', $orden)
                ->where('categoria_test_id', $categoria->id)
                ->count();

            if ($countIds !== count($orden)) {
                return response()->json([
                    'success' => false,
                    'message' => 'IDs de preguntas inválidos',
                ], 400);
            }

            // Update orden
            foreach ($orden as $index => $preguntaId) {
                PreguntaTest::where('id', $preguntaId)->update(['orden' => $index + 1]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Preguntas reordenadas exitosamente',
                'preguntas' => $categoria->preguntas()->orderBy('orden')->get(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error reordenando preguntas: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al reordenar las preguntas',
            ], 500);
        }
    }

    /**
     * Helper: Reorder questions after deletion
     */
    private function reordenarPreguntas($categoriaId)
    {
        $preguntas = PreguntaTest::where('categoria_test_id', $categoriaId)
            ->orderBy('orden')
            ->pluck('id')
            ->toArray();

        foreach ($preguntas as $index => $id) {
            PreguntaTest::where('id', $id)->update(['orden' => $index + 1]);
        }
    }

    /**
     * Get all questions for a category
     * GET /tests-vocacionales/{testId}/categorias/{categoriaId}/preguntas
     */
    public function indexByCategoria(TestVocacional $test, CategoriaTest $categoria)
    {
        $this->autorizar($test);

        if ($categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Categoría no encontrada');
        }

        $preguntas = $categoria->preguntas()
            ->orderBy('orden')
            ->get();

        return response()->json([
            'success' => true,
            'preguntas' => $preguntas,
            'categoria' => $categoria,
        ]);
    }

    /**
     * Get single question
     * GET /tests-vocacionales/{testId}/preguntas/{preguntaId}
     */
    public function show(TestVocacional $test, PreguntaTest $pregunta)
    {
        $this->autorizar($test);

        if ($pregunta->categoria->test_vocacional_id !== $test->id) {
            abort(404, 'Pregunta no encontrada');
        }

        return response()->json([
            'success' => true,
            'pregunta' => $pregunta->load('categoria'),
        ]);
    }

    /**
     * Get question types
     * GET /preguntas-test/tipos
     */
    public function tipos()
    {
        return response()->json([
            'success' => true,
            'tipos' => self::TIPOS_PREGUNTA,
        ]);
    }
}
