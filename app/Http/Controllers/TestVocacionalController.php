<?php

namespace App\Http\Controllers;

use App\Models\TestVocacional;
use App\Models\ResultadoTestVocacional;
use App\Models\PerfilVocacional;
use App\Models\PreguntaTest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TestVocacionalController extends Controller
{
    /**
     * Display a listing of available vocational tests
     */
    public function index()
    {
        $tests = TestVocacional::where('activo', true)
            ->withCount('resultados')
            ->get();

        return Inertia::render('Tests/Vocacionales/Index', [
            'tests' => $tests,
        ]);
    }

    /**
     * Show the form for creating a new test
     * (Solo para profesores/directores)
     */
    public function create()
    {
        return Inertia::render('Tests/Vocacionales/Create');
    }

    /**
     * Store a newly created test
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:tests_vocacionales',
            'descripcion' => 'nullable|string',
            'duracion_estimada' => 'nullable|integer|min:1',
            'activo' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            $test = TestVocacional::create($validated);

            DB::commit();

            return redirect()
                ->route('tests-vocacionales.show', $test)
                ->with('success', 'Test vocacional creado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withInput()
                ->withErrors(['error' => 'Error al crear el test: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified test
     */
    public function show(TestVocacional $testVocacional)
    {
        $testVocacional->load('categorias.preguntas');

        return Inertia::render('Tests/Vocacionales/Show', [
            'test' => $testVocacional,
        ]);
    }

    /**
     * Show the form for taking the test (para estudiantes)
     */
    public function take(TestVocacional $testVocacional)
    {
        $preguntas = $testVocacional->categorias()
            ->with('preguntas')
            ->get();

        return Inertia::render('Tests/Vocacionales/Take', [
            'test' => $testVocacional,
            'preguntas' => $preguntas,
        ]);
    }

    /**
     * Submit test responses
     */
    public function submitRespuestas(Request $request, TestVocacional $testVocacional)
    {
        $validated = $request->validate([
            'respuestas' => 'required|array',
            'respuestas.*' => 'integer|exists:preguntas_tests,id',
        ]);

        try {
            DB::beginTransaction();

            // Crear resultado del test
            $resultado = ResultadoTestVocacional::create([
                'test_vocacional_id' => $testVocacional->id,
                'estudiante_id' => auth()->id(),
                'respuestas' => $validated['respuestas'],
                'fecha_completacion' => now(),
            ]);

            // Analizar respuestas y generar perfil vocacional
            $this->generarPerfilVocacional(auth()->user(), $testVocacional, $resultado);

            DB::commit();

            return redirect()
                ->route('tests-vocacionales.resultados', $testVocacional)
                ->with('success', 'Test completado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withErrors(['error' => 'Error al procesar el test: ' . $e->getMessage()]);
        }
    }

    /**
     * Display test results
     */
    public function resultados(TestVocacional $testVocacional)
    {
        $resultado = ResultadoTestVocacional::where('test_vocacional_id', $testVocacional->id)
            ->where('estudiante_id', auth()->id())
            ->firstOrFail();

        $perfil = PerfilVocacional::where('estudiante_id', auth()->id())
            ->latest()
            ->first();

        return Inertia::render('Tests/Vocacionales/Resultados', [
            'test' => $testVocacional,
            'resultado' => $resultado,
            'perfil' => $perfil,
        ]);
    }

    /**
     * Show the form for editing the test
     */
    public function edit(TestVocacional $testVocacional)
    {
        $testVocacional->load('categorias.preguntas');

        return Inertia::render('Tests/Vocacionales/Edit', [
            'test' => $testVocacional,
        ]);
    }

    /**
     * Update the specified test
     */
    public function update(Request $request, TestVocacional $testVocacional)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:tests_vocacionales,nombre,' . $testVocacional->id,
            'descripcion' => 'nullable|string',
            'duracion_estimada' => 'nullable|integer|min:1',
            'activo' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            $testVocacional->update($validated);

            DB::commit();

            return redirect()
                ->route('tests-vocacionales.show', $testVocacional)
                ->with('success', 'Test vocacional actualizado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withInput()
                ->withErrors(['error' => 'Error al actualizar el test: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified test
     */
    public function destroy(TestVocacional $testVocacional)
    {
        try {
            DB::beginTransaction();

            // Eliminar resultados asociados
            ResultadoTestVocacional::where('test_vocacional_id', $testVocacional->id)->delete();

            // Eliminar preguntas
            $testVocacional->categorias()->each(function ($categoria) {
                $categoria->preguntas()->delete();
                $categoria->delete();
            });

            // Eliminar test
            $testVocacional->delete();

            DB::commit();

            return redirect()
                ->route('tests-vocacionales.index')
                ->with('success', 'Test vocacional eliminado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withErrors(['error' => 'Error al eliminar el test: ' . $e->getMessage()]);
        }
    }

    /**
     * Generar perfil vocacional basado en respuestas del test
     */
    private function generarPerfilVocacional($estudiante, TestVocacional $test, ResultadoTestVocacional $resultado)
    {
        // Lógica para analizar respuestas y crear un perfil
        // Este es un placeholder que se debe completar con la lógica real
        // de análisis de orientación vocacional

        $perfilData = [
            'estudiante_id' => $estudiante->id,
            'test_id' => $test->id,
            'resultado_id' => $resultado->id,
            'carreras_recomendadas' => [], // Se debe llenar con la lógica real
            'fortalezas' => [],
            'areas_interes' => [],
            'nivel_confianza' => 0,
        ];

        // Actualizar o crear perfil
        PerfilVocacional::updateOrCreate(
            ['estudiante_id' => $estudiante->id],
            $perfilData
        );
    }
}
