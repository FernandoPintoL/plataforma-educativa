<?php

namespace App\Http\Controllers;

use App\Models\TestVocacional;
use App\Models\ResultadoTestVocacional;
use App\Models\PerfilVocacional;
use App\Models\PreguntaTest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        try {
            // 1. Procesar respuestas
            $areasScore = $this->procesarRespuestasTest($resultado);

            // 2. Identificar fortalezas
            $fortalezas = $this->identificarFortalezas($areasScore);

            // 3. Recomendar carreras
            $carreras = $this->recomendarCarreras($areasScore, $fortalezas);

            // 4. Calcular confianza
            $confianza = $this->calcularConfianza($areasScore, $resultado);

            // 5. Guardar perfil
            $perfilData = [
                'estudiante_id' => $estudiante->id,
                'test_id' => $test->id,
                'resultado_id' => $resultado->id,
                'carreras_recomendadas' => $carreras,
                'fortalezas' => $fortalezas,
                'areas_interes' => array_keys($areasScore),
                'nivel_confianza' => $confianza,
                'generado_en' => now(),
            ];

            PerfilVocacional::updateOrCreate(
                ['estudiante_id' => $estudiante->id],
                $perfilData
            );

            Log::info("Perfil vocacional generado para estudiante {$estudiante->id}");
        } catch (\Exception $e) {
            Log::error("Error generando perfil vocacional: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Procesar respuestas del test y extraer áreas de interés
     */
    private function procesarRespuestasTest($resultado): array
    {
        $respuestas = $resultado->respuestas ?? [];

        $areas = [
            'ciencias' => 0,
            'tecnologia' => 0,
            'humanidades' => 0,
            'artes' => 0,
            'negocios' => 0,
            'salud' => 0,
        ];

        // Procesar cada respuesta
        foreach ($respuestas as $id_pregunta => $respuesta_data) {
            // Si viene como ID simple o como array con puntuación
            $puntuacion = is_array($respuesta_data) ? ($respuesta_data['puntuacion'] ?? 0) : 1;

            // Intentar obtener la pregunta y su área
            try {
                $pregunta = PreguntaTest::find($id_pregunta);

                if ($pregunta && isset($pregunta->area) && isset($areas[$pregunta->area])) {
                    $areas[$pregunta->area] += $puntuacion;
                }
            } catch (\Exception $e) {
                Log::warning("Pregunta {$id_pregunta} no encontrada: {$e->getMessage()}");
            }
        }

        return $areas;
    }

    /**
     * Identificar fortalezas (top 2-3 áreas con mayor puntuación)
     */
    private function identificarFortalezas($areasScore): array
    {
        // Ordenar descendente
        arsort($areasScore);

        $fortalezas = [];
        foreach (array_slice($areasScore, 0, 3) as $area => $score) {
            if ($score > 0) {
                $fortalezas[] = [
                    'area' => $area,
                    'score' => $score,
                    'descripcion' => $this->getDescripcionArea($area),
                ];
            }
        }

        return $fortalezas;
    }

    /**
     * Obtener descripción amigable de cada área
     */
    private function getDescripcionArea(string $area): string
    {
        $descripciones = [
            'ciencias' => 'Ciencias Naturales - Biología, Química, Física',
            'tecnologia' => 'Tecnología e Informática - Programación, Sistemas',
            'humanidades' => 'Humanidades - Literatura, Historia, Filosofía',
            'artes' => 'Artes y Creatividad - Diseño, Música, Teatro',
            'negocios' => 'Negocios y Administración - Gestión, Marketing',
            'salud' => 'Salud y Bienestar - Medicina, Enfermería, Psicología',
        ];

        return $descripciones[$area] ?? 'Área desconocida';
    }

    /**
     * Recomendar carreras basadas en áreas fuertes
     */
    private function recomendarCarreras($areasScore, $fortalezas): array
    {
        $carrerasPorArea = [
            'ciencias' => [
                'Biología',
                'Química',
                'Física',
                'Medicina',
                'Farmacología',
                'Geología',
            ],
            'tecnologia' => [
                'Ingeniería Informática',
                'Ingeniería de Sistemas',
                'Ciencia de Datos',
                'Ciberseguridad',
                'Desarrollo de Software',
                'Ingeniería de Redes',
            ],
            'humanidades' => [
                'Literatura',
                'Derecho',
                'Filosofía',
                'Historia',
                'Educación',
                'Periodismo',
            ],
            'artes' => [
                'Artes Plásticas',
                'Diseño Gráfico',
                'Música',
                'Teatro',
                'Cinematografía',
                'Animación Digital',
            ],
            'negocios' => [
                'Administración de Empresas',
                'Contabilidad',
                'Marketing',
                'Economía',
                'Finanzas',
                'Recursos Humanos',
            ],
            'salud' => [
                'Enfermería',
                'Psicología',
                'Medicina',
                'Fisioterapia',
                'Odontología',
                'Nutrición',
            ],
        ];

        $carrerasRecomendadas = [];

        // Tomar las carreras de las áreas más fuertes
        foreach ($fortalezas as $fortaleza) {
            $area = $fortaleza['area'];
            if (isset($carrerasPorArea[$area])) {
                $carreras = $carrerasPorArea[$area];
                foreach ($carreras as $carrera) {
                    $carrerasRecomendadas[] = [
                        'nombre' => $carrera,
                        'area' => $area,
                        'compatibilidad' => min(1.0, $fortaleza['score'] / 100),
                    ];
                }
            }
        }

        return $carrerasRecomendadas;
    }

    /**
     * Calcular nivel de confianza basado en claridad de preferencias
     */
    private function calcularConfianza($areasScore, $resultado): float
    {
        // Confianza basada en:
        // 1. Claridad de preferencias (una área mucho más alta = confianza alta)
        // 2. Consistencia de respuestas

        $scores = array_values($areasScore);

        if (empty($scores)) {
            return 0.3;
        }

        $maxScore = max($scores);
        $minScore = min($scores);
        $promedio = array_sum($scores) / count($scores);

        // Si maxScore es 0, retornar confianza mínima
        if ($maxScore === 0) {
            return 0.3;
        }

        // Claridad: qué tan separada está la más alta de las demás
        $claridad = ($maxScore - $promedio) / $maxScore;

        // Rango de confianza: 0.3 (baja) a 0.95 (alta)
        $confianza = 0.3 + ($claridad * 0.65);

        return round(min(0.95, max(0.3, $confianza)), 2);
    }
}
