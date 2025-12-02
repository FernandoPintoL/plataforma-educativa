<?php

namespace App\Http\Controllers;

use App\Models\TestVocacional;
use App\Models\ResultadoTestVocacional;
use App\Models\PerfilVocacional;
use App\Models\PreguntaTest;
use App\Models\User;
use App\Services\MLPredictionService;
use App\Services\ClusteringService;
use App\Services\EducationalRecommendationService;
use App\Services\PredictionValidator;
use App\Services\AgentSynthesisService;
use App\Services\VocationalFeatureExtractorService;
use App\Services\VocationalTestIntelligenceService;
use App\Services\AgentProfileSynthesisService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class TestVocacionalController extends Controller
{
    protected MLPredictionService $mlService;
    protected ClusteringService $clusteringService;
    protected EducationalRecommendationService $recommendationService;
    protected PredictionValidator $validator;
    protected AgentSynthesisService $agentService;
    protected VocationalFeatureExtractorService $featureExtractor;
    protected VocationalTestIntelligenceService $testIntelligence;

    public function __construct(
        MLPredictionService $mlService,
        ClusteringService $clusteringService,
        EducationalRecommendationService $recommendationService,
        PredictionValidator $validator,
        AgentSynthesisService $agentService,
        VocationalFeatureExtractorService $featureExtractor,
        VocationalTestIntelligenceService $testIntelligence
    ) {
        $this->mlService = $mlService;
        $this->clusteringService = $clusteringService;
        $this->recommendationService = $recommendationService;
        $this->validator = $validator;
        $this->agentService = $agentService;
        $this->featureExtractor = $featureExtractor;
        $this->testIntelligence = $testIntelligence;
    }
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
     *
     * MEJORA: Carga respuestas previas si el test ya fue respondido
     */
    public function take(TestVocacional $testVocacional)
    {
        $preguntas = $testVocacional->categorias()
            ->with('preguntas')
            ->get()
            ->map(function($categoria) {
                return [
                    'id' => $categoria->id,
                    'nombre' => $categoria->nombre,
                    'descripcion' => $categoria->descripcion,
                    'preguntas' => $categoria->preguntas->map(function($pregunta) {
                        return [
                            'id' => $pregunta->id,
                            'enunciado' => $pregunta->enunciado,
                            'tipo' => $pregunta->tipo,
                            'opciones' => $pregunta->getOpcionesFormateadas(),
                            'orden' => $pregunta->orden,
                        ];
                    })->sortBy('orden')->values(),
                ];
            })->sortBy('id')->values();

        // NUEVO: Obtener respuestas previas si existen
        $estudiante = auth()->user();
        $respuestasGuardadas = [];

        if ($estudiante) {
            $resultadoPrevio = ResultadoTestVocacional::where('test_vocacional_id', $testVocacional->id)
                ->where('estudiante_id', $estudiante->id)
                ->latest()
                ->first();

            if ($resultadoPrevio && $resultadoPrevio->respuestas) {
                // Usar el método helper que maneja ambos casos (array o JSON string)
                $respuestasGuardadas = $resultadoPrevio->getRespuestasArray();
            }
        }

        // DEBUG: Loguear datos para debuggeo
        Log::info('Test Vocacional Take - Debug', [
            'test_id' => $testVocacional->id,
            'test_name' => $testVocacional->nombre,
            'categorias_count' => $preguntas->count(),
            'respuestas_guardadas_count' => count($respuestasGuardadas),
        ]);

        return Inertia::render('Tests/Vocacionales/Take', [
            'test' => $testVocacional,
            'preguntas' => $preguntas,
            'respuestasGuardadas' => $respuestasGuardadas,
        ]);
    }

    /**
     * Submit test responses (ML-ENHANCED)
     *
     * MEJORA: Ahora acepta respuestas en formato {preguntaId: respuestaValor}
     * donde respuestaValor puede ser 'verdadero'/'falso', '1-5', etc.
     */
    public function submitRespuestas(Request $request, TestVocacional $testVocacional)
    {
        // DEBUG INICIAL: Loguear request recibido
        Log::info("=== SUBMITRESPUESTAS - INICIO ===", [
            'test_vocacional_id' => $testVocacional->id,
            'test_nombre' => $testVocacional->nombre,
            'request_data' => $request->all(),
        ]);

        $validated = $request->validate([
            'respuestas' => 'required|array',
            'respuestas.*' => 'required|string',  // Cambio: Aceptar strings (valores de respuestas)
        ]);

        Log::info("Request validado", [
            'respuestas_count' => count($validated['respuestas']),
            'respuestas_keys' => array_keys($validated['respuestas']),
        ]);

        try {
            DB::beginTransaction();

            $estudiante = auth()->user();
            Log::info("Estudiante autenticado", [
                'user_id' => $estudiante->id,
                'user_email' => $estudiante->email,
            ]);

            // Validar que todas las preguntas del test fueron respondidas
            $preguntasCount = $testVocacional->categorias()
                ->with('preguntas')
                ->get()
                ->sum(fn($cat) => $cat->preguntas->count());

            Log::info("Total preguntas calculado", [
                'expected_count' => $preguntasCount,
                'received_count' => count($validated['respuestas']),
                'match' => count($validated['respuestas']) == $preguntasCount,
            ]);

            if (count($validated['respuestas']) != $preguntasCount) {
                Log::warning("Validación fallida: respuestas incompletas", [
                    'test_id' => $testVocacional->id,
                    'estudiante_id' => $estudiante->id,
                    'expected' => $preguntasCount,
                    'received' => count($validated['respuestas']),
                ]);
                return back()->withErrors([
                    'error' => "Debes responder todas las {$preguntasCount} preguntas. Respondiste " . count($validated['respuestas'])
                ]);
            }

            // Crear resultado del test
            // NOTA: La conversión a JSON es manejada automáticamente por el cast 'array' en el modelo
            $resultadoData = [
                'test_vocacional_id' => $testVocacional->id,
                'estudiante_id' => $estudiante->id,
                'respuestas' => $validated['respuestas'],  // Laravel lo convertirá a JSON automáticamente
                'fecha_completacion' => now(),
            ];

            Log::info("Datos preparados para create()", [
                'test_vocacional_id' => $resultadoData['test_vocacional_id'],
                'estudiante_id' => $resultadoData['estudiante_id'],
                'respuestas_keys' => array_keys($validated['respuestas']),
                'respuestas_count' => count($validated['respuestas']),
                'fecha_completacion' => $resultadoData['fecha_completacion'],
            ]);

            $resultado = ResultadoTestVocacional::create($resultadoData);

            Log::info("Resultado creado exitosamente", [
                'resultado_id' => $resultado->id,
                'test_id' => $resultado->test_vocacional_id,
                'estudiante_id' => $resultado->estudiante_id,
            ]);

            // MEJORA ML: Analizar respuestas y generar perfil vocacional enriquecido
            Log::info("Iniciando generación de perfil ML...");
            $this->generarPerfilVocacionalML($estudiante, $testVocacional, $resultado);

            DB::commit();

            Log::info("=== SUBMITRESPUESTAS - COMPLETADO EXITOSAMENTE ===", [
                'resultado_id' => $resultado->id,
                'test_id' => $testVocacional->id,
                'estudiante_id' => $estudiante->id,
            ]);

            return redirect()
                ->route('tests-vocacionales.resultados', $testVocacional)
                ->with('success', 'Test completado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("=== SUBMITRESPUESTAS - ERROR ===", [
                'error_message' => $e->getMessage(),
                'error_code' => $e->getCode(),
                'trace' => $e->getTraceAsString(),
                'test_id' => $testVocacional->id,
                'estudiante_id' => auth()->id(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
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
     * FASE 3: Generar perfil vocacional MEJORADO CON APIs
     *
     * Integra las 3 APIs Python:
     * - API Career (8001): Predicción de carrera (ML supervisado)
     * - API Clustering (8002): Clustering de aptitudes (K-Means)
     * - API Synthesis (8003): Síntesis personalizada con LLM
     *
     * Flujo:
     * 1. Extraer features REALES con VocationalFeatureExtractorService
     * 2. Llamar API Career → Predicción de carrera + top 3
     * 3. Llamar API Clustering → Asignación de cluster
     * 4. Llamar API Synthesis → Narrativa personalizada
     * 5. Validar coherencia con PredictionValidator
     * 6. Guardar perfil enriquecido en BD
     */
    private function generarPerfilVocacionalML($estudiante, TestVocacional $test, ResultadoTestVocacional $resultado)
    {
        try {
            Log::info("========================================");
            Log::info("FASE 3: Iniciando análisis vocacional con APIs");
            Log::info("Estudiante: {$estudiante->id}");
            Log::info("========================================");

            // ===================================================================
            // PASO 1: Extraer Features INTELIGENTES del Test + Académicos
            // ===================================================================

            Log::info("PASO 1: Extrayendo features del test vocacional...");

            // SUBPASO 1A: Procesar respuestas del test vocacional
            $testFeatures = $this->testIntelligence->procesarRespuestasTest($resultado, $test);
            Log::info("Features del test extraídos:", [
                'areas_identificadas' => array_filter(
                    array_keys($testFeatures),
                    fn($k) => strpos($k, 'area_') === 0
                ),
                'tasa_completacion' => $testFeatures['tasa_completacion'] ?? 0,
            ]);

            // SUBPASO 1B: Extraer features académicos reales
            Log::info("PASO 1B: Extrayendo features académicos...");
            $academicFeatures = $this->featureExtractor->extractVocationalFeatures($estudiante);
            Log::info("Features académicos extraídos:", [
                'promedio' => $academicFeatures['promedio'] ?? 'N/A',
                'asistencia' => $academicFeatures['asistencia'] ?? 'N/A',
                'area_dominante' => $academicFeatures['area_dominante'] ?? 'N/A',
            ]);

            // SUBPASO 1C: Combinar features (test + académicos)
            // Las respuestas del test tienen mayor peso (70%) que académicos (30%)
            $features = $this->combinarFeatures($testFeatures, $academicFeatures, 0.7);
            Log::info("Features combinados:", [
                'total_features' => count($features),
                'peso_test' => '70%',
                'peso_academico' => '30%',
            ]);

            // ===================================================================
            // PASO 2: Llamar API Career (Puerto 8001)
            // ===================================================================

            Log::info("PASO 2: Llamando API Career (http://localhost:8001/predict/career/vocational)...");
            $careerResponse = Http::post('http://localhost:8001/predict/career/vocational', $features);

            if (!$careerResponse->successful()) {
                throw new \Exception("API Career respondió con error: {$careerResponse->status()}");
            }

            $careerData = $careerResponse->json();
            Log::info("Predicción de carrera obtenida:", [
                'carrera' => $careerData['carrera'] ?? 'N/A',
                'confianza' => $careerData['confianza'] ?? 0,
                'compatibilidad' => $careerData['compatibilidad'] ?? 0,
            ]);

            // ===================================================================
            // PASO 3: Llamar API Clustering (Puerto 8002)
            // ===================================================================

            Log::info("PASO 3: Llamando API Clustering (http://localhost:8002/cluster/vocational)...");
            $clusterResponse = Http::post('http://localhost:8002/cluster/vocational', $features);

            if (!$clusterResponse->successful()) {
                throw new \Exception("API Clustering respondió con error: {$clusterResponse->status()}");
            }

            $clusterData = $clusterResponse->json();
            Log::info("Clustering de aptitudes obtenido:", [
                'cluster_nombre' => $clusterData['cluster_nombre'] ?? 'N/A',
                'cluster_id' => $clusterData['cluster_id'] ?? 'N/A',
                'probabilidad' => $clusterData['probabilidad'] ?? 0,
            ]);

            // ===================================================================
            // PASO 4: Llamar API Synthesis (Puerto 8003)
            // ===================================================================

            Log::info("PASO 4: Llamando API Synthesis (http://localhost:8003/synthesis/vocational)...");

            $synthesisPayload = [
                'student_id' => $estudiante->id,
                'nombre_estudiante' => $estudiante->nombre_completo,
                'promedio_academico' => $features['promedio'] ?? 0,
                'carrera_predicha' => $careerData['carrera'] ?? 'No determinada',
                'confianza' => $careerData['confianza'] ?? 0,
                'cluster_aptitud' => $clusterData['cluster_id'] ?? 0,
                'cluster_nombre' => $clusterData['cluster_nombre'] ?? 'No determinado',
                'areas_interes' => $features['areas_score_json'] ?? ['tecnologia' => 50],
            ];

            $synthesisResponse = Http::post('http://localhost:8003/synthesis/vocational', $synthesisPayload);

            if (!$synthesisResponse->successful()) {
                Log::warning("API Synthesis respondió con error: {$synthesisResponse->status()}, usando fallback");
                $synthesisData = $this->generateFallbackSynthesis($careerData, $clusterData, $estudiante);
            } else {
                $synthesisData = $synthesisResponse->json();
            }

            Log::info("Síntesis personalizada obtenida:", [
                'tipo' => $synthesisData['sintesis_tipo'] ?? 'fallback',
                'recomendaciones_count' => count($synthesisData['recomendaciones'] ?? []),
            ]);

            // ===================================================================
            // PASO 5: Validar Coherencia entre predicciones
            // ===================================================================

            Log::info("PASO 5: Validando coherencia entre predicciones...");
            $validation = $this->validator->validatePredictions($estudiante->id, [
                'carrera' => $careerData,
                'cluster' => $clusterData,
            ]);

            Log::info("Validación completada:", [
                'is_coherent' => $validation['is_coherent'] ?? false,
                'confidence_score' => $validation['confidence_score'] ?? 0.5,
            ]);

            // ===================================================================
            // PASO 6: Guardar Perfil Vocacional Enriquecido en BD
            // ===================================================================

            Log::info("PASO 6: Guardando perfil vocacional enriquecido en BD...");

            $perfilData = [
                'estudiante_id' => $estudiante->id,
                'carrera_predicha_ml' => $careerData['carrera'] ?? 'No determinada',
                'confianza_prediccion' => round($careerData['confianza'] ?? 0, 3),
                'cluster_aptitud' => $clusterData['cluster_id'] ?? null,
                'probabilidad_cluster' => round($clusterData['probabilidad'] ?? 0, 3),
                'prediccion_detalles' => json_encode([
                    'carrera_predicha' => $careerData,
                    'clustering' => $clusterData,
                    'validacion_coherencia' => $validation,
                    'features_utilizados' => $features,
                ]),
                'recomendaciones_personalizadas' => json_encode([
                    'narrativa' => $synthesisData['narrativa'] ?? 'No disponible',
                    'recomendaciones' => $synthesisData['recomendaciones'] ?? [],
                    'pasos_siguientes' => $synthesisData['pasos_siguientes'] ?? [],
                    'tipo_sintesis' => $synthesisData['sintesis_tipo'] ?? 'fallback',
                ]),
                'fecha_creacion' => now(),
                'fecha_actualizacion' => now(),
            ];

            $perfil = PerfilVocacional::updateOrCreate(
                ['estudiante_id' => $estudiante->id],
                $perfilData
            );

            Log::info("========================================");
            Log::info("FASE 3: Análisis vocacional COMPLETADO");
            Log::info("Perfil guardado en BD:");
            Log::info("  - ID: {$perfil->id}");
            Log::info("  - Carrera: {$perfilData['carrera_predicha_ml']}");
            Log::info("  - Confianza: {$perfilData['confianza_prediccion']}");
            Log::info("  - Cluster: {$perfilData['cluster_aptitud']}");
            Log::info("========================================");

        } catch (\Exception $e) {
            Log::error("Error en FASE 3: {$e->getMessage()}", [
                'estudiante_id' => $estudiante->id,
                'trace' => $e->getTraceAsString()
            ]);

            // Fallback: Usar análisis manual si las APIs fallan
            Log::warning("Usando fallback a análisis manual...");
            $this->generarPerfilVocacional($estudiante, $test, $resultado);
        }
    }

    /**
     * Generar síntesis fallback si API no está disponible
     */
    private function generateFallbackSynthesis($careerData, $clusterData, $estudiante): array
    {
        $carrera = $careerData['carrera'] ?? 'No determinada';
        $clusterNombre = $clusterData['cluster_nombre'] ?? 'Desempeño Estándar';

        return [
            'narrativa' => "Tu perfil vocacional sugiere que {$carrera} podría ser una excelente opción para ti. Basándonos en tu desempeño académico y áreas de interés, te ubicamos en el grupo de {$clusterNombre}, lo que indica que tienes el potencial necesario para destacar en esta carrera.",
            'recomendaciones' => [
                "Investiga programas académicos de {$carrera}",
                "Conecta con profesionales en el área",
                "Desarrolla habilidades complementarias",
                "Busca experiencias prácticas",
                "Mantén un buen promedio académico",
            ],
            'pasos_siguientes' => [
                "Semana 1-2: Investigar universidades",
                "Mes 1-2: Entrevistar profesionales",
                "Mes 2-3: Tomar cursos introductorios",
                "Mes 3+: Buscar oportunidades de práctica",
            ],
            'sintesis_tipo' => 'fallback',
        ];
    }

    /**
     * Extraer features vocacionales para modelos ML
     */
    private function extraerFeaturesVocacionales($estudiante, $areasScore, $fortalezas): array
    {
        $features = [];

        // Features del test
        $features['areas_score'] = $areasScore;
        $features['area_dominante'] = max(array_values($areasScore));
        $features['num_areas_fuertes'] = count(array_filter($areasScore, fn($s) => $s > 70));

        // Features académicos
        $rendimiento = $estudiante->rendimientoAcademico;
        if ($rendimiento) {
            $features['promedio_academico'] = $rendimiento->promedio ?? 0;
            $features['tendencia'] = $rendimiento->tendencia_temporal ?? 'estable';
        }

        // Features de comportamiento
        $features['num_tareas_entregadas'] = $estudiante->trabajos()->count();
        $features['tasa_entrega'] = $estudiante->trabajos()->count() > 0
            ? ($estudiante->trabajos()->whereHas('calificacion')->count() / $estudiante->trabajos()->count())
            : 0;

        // Normalizar features para ML
        $features['features_normalizados'] = [
            'promedio' => $features['promedio_academico'] ?? 50,
            'asistencia' => 80, // Puede obtenerse de otra tabla
            'trabajos_entregados' => $features['num_tareas_entregadas'] ?? 0,
            'trabajos_totales' => $estudiante->trabajos()->count() ?? 1,
            'varianza_calificaciones' => 10, // Puede calcularse
            'dias_desde_ultima_calificacion' => 0,
            'num_consultas_materiales' => 0,
        ];

        return $features;
    }

    /**
     * Combinar features inteligentemente
     *
     * Combina features del test vocacional con features académicos
     * usando pesos específicos para darle más importancia al test
     */
    private function combinarFeatures(array $testFeatures, array $academicFeatures, float $pesoTest = 0.7): array
    {
        $combinados = [];
        $pesoAcademico = 1 - $pesoTest;

        // Features que vienen del test (70%)
        foreach ($testFeatures as $key => $value) {
            if (is_numeric($value)) {
                $combinados[$key] = $value * $pesoTest;
            } else {
                $combinados[$key] = $value; // Mantener strings tal como están
            }
        }

        // Features académicos (30%) - combinar si existen versiones comunes
        foreach ($academicFeatures as $key => $value) {
            if (is_numeric($value)) {
                if (isset($combinados[$key]) && is_numeric($combinados[$key])) {
                    // Combinar si el key ya existe
                    $combinados[$key] = $combinados[$key] + ($value * $pesoAcademico);
                } else {
                    // Agregar si no existe
                    $combinados[$key] = $value * $pesoAcademico;
                }
            }
        }

        // Normalizar nuevamente para asegurar rango 0-100
        foreach ($combinados as $key => &$value) {
            if (is_numeric($value)) {
                $value = round(max(0, min(100, $value)), 2);
            }
        }

        Log::info("Features combinados con pesos: Test {$pesoTest} + Académico {$pesoAcademico}");

        return $combinados;
    }

    /**
     * Generar perfil vocacional basado en respuestas del test (versión original fallback)
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
                'intereses' => $areasScore,
                'habilidades' => $fortalezas,
                'personalidad' => [],
                'aptitudes' => $this->extraerAptitudes($areasScore),
                'fecha_creacion' => now(),
                'fecha_actualizacion' => now(),
            ];

            PerfilVocacional::updateOrCreate(
                ['estudiante_id' => $estudiante->id],
                $perfilData
            );

            Log::info("Perfil vocacional tradicional generado para estudiante {$estudiante->id}");
        } catch (\Exception $e) {
            Log::error("Error generando perfil vocacional: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Extraer aptitudes de áreas de puntuación
     */
    private function extraerAptitudes($areasScore): array
    {
        // Mapeo dinámico de categorías a aptitudes
        $mapeo = [
            'habilidades stem' => ['análisis', 'investigación', 'razonamiento', 'resolución de problemas', 'lógica'],
            'creatividad' => ['creatividad', 'innovación', 'expresión', 'imaginación'],
            'comunicación' => ['comunicación', 'expresión verbal', 'escritura', 'persuasión'],
            'liderazgo' => ['liderazgo', 'gestión', 'coordinación', 'toma de decisiones'],
        ];

        $aptitudes = [];
        foreach ($areasScore as $area => $score) {
            $areaLower = strtolower($area);
            if (isset($mapeo[$areaLower])) {
                foreach ($mapeo[$areaLower] as $aptitud) {
                    $aptitudes[$aptitud] = $score;
                }
            } else {
                // Si no hay mapeo específico, devolver el area como aptitud
                $aptitudes[$area] = $score;
            }
        }

        return $aptitudes;
    }

    /**
     * Procesar respuestas del test y extraer áreas de interés
     * MEJORADO: Usa las categorías reales del test
     */
    private function procesarRespuestasTest($resultado): array
    {
        $respuestas = $resultado->getRespuestasArray(); // Usar el método helper
        $test = $resultado->testVocacional;

        // Inicializar scores para cada categoría del test
        $areas = [];
        foreach ($test->categorias as $cat) {
            $areas[strtolower($cat->nombre)] = 0;
        }

        // Si no hay respuestas, devolver áreas vacías
        if (empty($respuestas)) {
            return $areas;
        }

        // Procesar cada respuesta
        foreach ($respuestas as $id_pregunta => $respuesta_valor) {
            try {
                $pregunta = PreguntaTest::find($id_pregunta);

                if (!$pregunta) {
                    continue;
                }

                // Obtener la categoría de la pregunta
                $categoria = $pregunta->categoriaTest;
                if (!$categoria) {
                    continue;
                }

                // Convertir respuesta a puntuación (1-5 típicamente)
                $puntuacion = $this->convertirRespuestaAPuntuacion($respuesta_valor);

                // Agregar al score de la categoría
                $categoryKey = strtolower($categoria->nombre);
                if (isset($areas[$categoryKey])) {
                    $areas[$categoryKey] += $puntuacion;
                }
            } catch (\Exception $e) {
                Log::warning("Error procesando pregunta {$id_pregunta}: {$e->getMessage()}");
            }
        }

        // Normalizar scores a porcentaje (0-100)
        $totalPreguntas = count($respuestas);
        if ($totalPreguntas > 0) {
            foreach ($areas as $key => $score) {
                // Convertir a porcentaje basado en número de preguntas de esa categoría
                $areas[$key] = round(($score / $totalPreguntas) * 100, 2);
            }
        }

        return $areas;
    }

    /**
     * Convertir valor de respuesta a puntuación numérica
     */
    private function convertirRespuestaAPuntuacion($valor): float
    {
        // Mapear valores comunes a puntuaciones
        $mapeos = [
            'totalmente_en_desacuerdo' => 1,
            'en_desacuerdo' => 2,
            'neutral' => 3,
            'de_acuerdo' => 4,
            'totalmente_de_acuerdo' => 5,
            'falso' => 1,
            'verdadero' => 5,
        ];

        // Si es un número, devolverlo como float
        if (is_numeric($valor)) {
            return (float) $valor;
        }

        // Si es una string conocida, devolver su puntuación
        $valorMinuscula = strtolower(trim($valor));
        if (isset($mapeos[$valorMinuscula])) {
            return (float) $mapeos[$valorMinuscula];
        }

        // Default: considerar como verdadero/positivo
        return 3.0;
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

    /**
     * ====================================
     * ENDPOINTS API (NUEVO - ML VOCACIONAL)
     * ====================================
     */

    /**
     * Obtener perfil vocacional actual del estudiante autenticado
     *
     * GET /api/vocacional/mi-perfil
     */
    public function getPerfilVocacional()
    {
        try {
            $estudiante = auth()->user();

            $perfil = PerfilVocacional::where('estudiante_id', $estudiante->id)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'perfil' => [
                    'id' => $perfil->id,
                    'intereses' => $perfil->intereses,
                    'habilidades' => $perfil->habilidades,
                    'personalidad' => $perfil->personalidad,
                    'aptitudes' => $perfil->aptitudes,
                    'carrera_predicha_ml' => $perfil->carrera_predicha_ml ?? 'No determinada',
                    'confianza_prediccion' => $perfil->confianza_prediccion ?? 0,
                    'cluster_aptitud' => $perfil->cluster_aptitud,
                    'probabilidad_cluster' => $perfil->probabilidad_cluster,
                    'recomendaciones_personalizadas' => json_decode($perfil->recomendaciones_personalizadas, true) ?? [],
                    'fecha_actualizacion' => $perfil->fecha_actualizacion,
                ],
                'timestamp' => now(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'No hay perfil vocacional. Por favor completa una prueba vocacional primero.',
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error getting vocational profile: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving vocational profile',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener recomendaciones de carrera personalizadas
     *
     * GET /api/vocacional/recomendaciones-carrera
     */
    public function getRecomendacionesCarrera()
    {
        try {
            $estudiante = auth()->user();

            $perfil = PerfilVocacional::where('estudiante_id', $estudiante->id)
                ->firstOrFail();

            $recomendaciones = json_decode($perfil->recomendaciones_personalizadas, true) ?? [];

            return response()->json([
                'success' => true,
                'carrera_predicha' => $perfil->carrera_predicha_ml ?? 'No determinada',
                'confianza' => round($perfil->confianza_prediccion ?? 0, 3),
                'recomendaciones' => $recomendaciones,
                'cluster_aptitudes' => $perfil->cluster_aptitud,
                'probabilidad_cluster' => round($perfil->probabilidad_cluster ?? 0, 3),
                'timestamp' => now(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'No hay perfil vocacional disponible',
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error getting recommendations: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving recommendations',
            ], 500);
        }
    }

    /**
     * Obtener análisis detallado vocacional de un estudiante
     *
     * GET /api/vocacional/analisis/{studentId}
     * Solo profesores/admin
     */
    public function getAnalisisVocacional($studentId)
    {
        try {
            $estudiante = User::findOrFail($studentId);

            $perfil = PerfilVocacional::where('estudiante_id', $studentId)->first();

            if (!$perfil) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student has not completed a vocational test',
                ], 404);
            }

            $prediccion_detalles = json_decode($perfil->prediccion_detalles, true) ?? [];

            return response()->json([
                'success' => true,
                'estudiante' => [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->nombre_completo,
                    'email' => $estudiante->email,
                ],
                'analisis' => [
                    'intereses' => $perfil->intereses,
                    'habilidades' => $perfil->habilidades,
                    'personalidad' => $perfil->personalidad,
                    'aptitudes' => $perfil->aptitudes,
                    'carrera_predicha' => $perfil->carrera_predicha_ml,
                    'confianza_general' => round($perfil->confianza_prediccion ?? 0, 3),
                ],
                'detalle_ml' => [
                    'prediccion_supervisada' => $prediccion_detalles['prediccion_supervisada'] ?? null,
                    'clustering_no_supervisado' => $prediccion_detalles['clustering_no_supervisado'] ?? null,
                    'validacion_coherencia' => $prediccion_detalles['validacion_coherencia'] ?? null,
                    'confianza_manual' => $prediccion_detalles['confianza_manual'] ?? 0,
                    'confianza_ml' => $prediccion_detalles['confianza_ml'] ?? 0,
                ],
                'recomendaciones' => json_decode($perfil->recomendaciones_personalizadas, true) ?? [],
                'fecha_analisis' => $perfil->fecha_actualizacion,
                'timestamp' => now(),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found',
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error getting vocational analysis: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving vocational analysis',
            ], 500);
        }
    }

    /**
     * Reporte institucional de vocaciones
     *
     * GET /api/vocacional/reporte-institucional
     * Solo profesores/admin
     * Query params:
     *   - limit: max estudiantes (default 50)
     */
    public function getReporteInstitucional(\Illuminate\Http\Request $request)
    {
        try {
            $limit = (int)$request->query('limit', 50);

            $perfiles = PerfilVocacional::with('estudiante')
                ->orderBy('fecha_actualizacion', 'desc')
                ->limit($limit)
                ->get();

            $estadisticas = [
                'total_estudiantes_analizado' => $perfiles->count(),
                'carreras_predichas' => $perfiles->pluck('carrera_predicha_ml')->countBy()->toArray(),
                'confianza_promedio' => round($perfiles->avg('confianza_prediccion') ?? 0, 3),
                'clusters_distribucion' => $perfiles->pluck('cluster_aptitud')->countBy()->toArray(),
            ];

            $listado = $perfiles->map(function ($perfil) {
                return [
                    'estudiante_id' => $perfil->estudiante_id,
                    'estudiante_nombre' => $perfil->estudiante?->nombre_completo,
                    'carrera_predicha' => $perfil->carrera_predicha_ml,
                    'confianza' => round($perfil->confianza_prediccion ?? 0, 3),
                    'cluster' => $perfil->cluster_aptitud,
                    'fecha_analisis' => $perfil->fecha_actualizacion,
                ];
            });

            return response()->json([
                'success' => true,
                'estadisticas' => $estadisticas,
                'listado' => $listado,
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error getting institutional vocational report: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving vocational report',
            ], 500);
        }
    }

    /**
     * Generar perfil vocacional combinado (Fase 3)
     * Combina resultados de los 3 tests en un perfil único
     */
    public function generarPerfilCombinado(Request $request)
    {
        try {
            $estudiante_id = auth()->id();

            Log::info('Generando perfil combinado para estudiante: ' . $estudiante_id);

            // Verificar que el estudiante haya completado los 3 tests
            $test1 = ResultadoTestVocacional::where('estudiante_id', $estudiante_id)
                ->where('test_vocacional_id', 52) // Explorador de Carreras
                ->latest()
                ->first();

            $test2 = ResultadoTestVocacional::where('estudiante_id', $estudiante_id)
                ->where('test_vocacional_id', 54) // Preferencias Laborales
                ->latest()
                ->first();

            $test3 = ResultadoTestVocacional::where('estudiante_id', $estudiante_id)
                ->where('test_vocacional_id', 55) // RIASEC
                ->latest()
                ->first();

            if (!$test1 || !$test2 || !$test3) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debes completar los 3 tests antes de generar tu perfil combinado',
                    'tests_completados' => [
                        'test_1' => $test1 ? true : false,
                        'test_2' => $test2 ? true : false,
                        'test_3' => $test3 ? true : false,
                    ]
                ], 400);
            }

            // Crear o actualizar perfil combinado
            $perfil = \App\Models\PerfilVocacionalCombinado::updateOrCreate(
                ['estudiante_id' => $estudiante_id],
                [
                    'resultado_test_1_id' => $test1->id,
                    'resultado_test_2_id' => $test2->id,
                    'resultado_test_3_id' => $test3->id,
                ]
            );

            // Generar perfil combinado
            $perfil->generarPerfilCombinado();

            Log::info('Perfil combinado generado exitosamente para estudiante: ' . $estudiante_id);

            return response()->json([
                'success' => true,
                'message' => 'Perfil vocacional combinado generado exitosamente',
                'perfil' => $perfil->obtenerPerfilFormateado(),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error generando perfil combinado: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al generar el perfil: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener perfil combinado existente
     */
    public function obtenerPerfilCombinado()
    {
        try {
            $estudiante_id = auth()->id();

            $perfil = \App\Models\PerfilVocacionalCombinado::where('estudiante_id', $estudiante_id)
                ->latest()
                ->first();

            if (!$perfil) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay perfil combinado generado aún',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'perfil' => $perfil->obtenerPerfilFormateado(),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error obteniendo perfil combinado: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el perfil',
            ], 500);
        }
    }

    /**
     * Vista para mostrar perfil combinado
     */
    public function mostrarPerfilCombinado()
    {
        try {
            $estudiante_id = auth()->id();

            $perfil = \App\Models\PerfilVocacionalCombinado::where('estudiante_id', $estudiante_id)
                ->latest()
                ->first();

            // Obtener progreso de tests
            $test1 = ResultadoTestVocacional::where('estudiante_id', $estudiante_id)
                ->where('test_vocacional_id', 52)
                ->latest()
                ->first();
            $test2 = ResultadoTestVocacional::where('estudiante_id', $estudiante_id)
                ->where('test_vocacional_id', 54)
                ->latest()
                ->first();
            $test3 = ResultadoTestVocacional::where('estudiante_id', $estudiante_id)
                ->where('test_vocacional_id', 55)
                ->latest()
                ->first();

            $progreso = [
                'test_1_completado' => $test1 ? true : false,
                'test_2_completado' => $test2 ? true : false,
                'test_3_completado' => $test3 ? true : false,
                'todos_completados' => $test1 && $test2 && $test3,
            ];

            $breadcrumbs = [
                ['label' => 'Inicio', 'href' => '/dashboard'],
                ['label' => 'Tests Vocacionales', 'href' => '/tests-vocacionales'],
                ['label' => 'Mi Perfil Vocacional'],
            ];

            return Inertia::render('Tests/Vocacionales/PerfilCombinado', [
                'perfil' => $perfil ? $perfil->obtenerPerfilFormateado() : null,
                'progreso' => $progreso,
                'breadcrumbs' => $breadcrumbs,
            ]);

        } catch (\Exception $e) {
            Log::error('Error en mostrarPerfilCombinado: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Error al cargar el perfil']);
        }
    }

    /**
     * Generar síntesis inteligente del perfil con el Agente (GROQ)
     *
     * GET /api/vocacional/generar-sintesis-agente
     */
    public function generarSintesisAgente(Request $request, AgentProfileSynthesisService $agentService)
    {
        try {
            $estudiante = auth()->user();

            Log::info("Iniciando generación de síntesis agente", [
                'student_id' => $estudiante->id,
            ]);

            // Obtener perfil vocacional
            $perfil = PerfilVocacional::where('estudiante_id', $estudiante->id)
                ->latest()
                ->first();

            if (!$perfil) {
                return response()->json([
                    'success' => false,
                    'message' => 'No hay perfil vocacional disponible. Completa un test primero.',
                ], 404);
            }

            // Generar síntesis con el agente
            $sintesis = $agentService->generarSintesisInteligente($estudiante, $perfil);

            return response()->json([
                'success' => true,
                'message' => 'Síntesis generada exitosamente',
                'data' => [
                    'sintesis' => $sintesis['sintesis'],
                    'recomendaciones' => $sintesis['recomendaciones'],
                    'pasos_siguientes' => $sintesis['pasos_siguientes'],
                    'fortalezas' => $sintesis['fortalezas'],
                    'areas_mejora' => $sintesis['areas_mejora'],
                ],
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error generando síntesis agente: {$e->getMessage()}", [
                'student_id' => auth()->id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al generar síntesis: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener recomendaciones de carreras CON ANÁLISIS DEL AGENTE
     * Combina ML (compatibilidad) + Agente (justificaciones inteligentes)
     */
    public function obtenerRecomendacionesCarreraConAgente(
        Request $request,
        AgentProfileSynthesisService $agentService
    ) {
        try {
            $estudiante = auth()->user();

            // Obtener perfil vocacional
            $perfil = PerfilVocacional::where('estudiante_id', $estudiante->id)
                ->latest()
                ->first();

            if (!$perfil) {
                return response()->json([
                    'success' => false,
                    'recomendaciones' => [],
                    'message' => 'No hay perfil vocacional disponible',
                ], 200);
            }

            // Obtener todas las carreras
            $carreras = \App\Models\Carrera::where('activo', true)
                ->get();

            if ($carreras->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'recomendaciones' => [],
                    'message' => 'No hay carreras disponibles',
                ], 200);
            }

            $recomendaciones = [];
            $intereses = $perfil->intereses ?? [];
            $habilidades = $perfil->habilidades ?? [];

            // Calcular compatibilidad para cada carrera
            foreach ($carreras as $carrera) {
                $compatibilidad = 0.5; // Base del 50%

                // Aumentar compatibilidad si hay match con intereses
                if (!empty($intereses) && !empty($carrera->intereses_relacionados)) {
                    $interesesCarrera = is_array($carrera->intereses_relacionados)
                        ? $carrera->intereses_relacionados
                        : json_decode($carrera->intereses_relacionados, true);

                    if (is_array($interesesCarrera)) {
                        $matches = count(array_intersect(array_keys($intereses), array_keys($interesesCarrera)));
                        $compatibilidad += ($matches * 0.1);
                    }
                }

                // Aumentar compatibilidad si hay match con habilidades
                if (!empty($habilidades) && !empty($carrera->habilidades_requeridas)) {
                    $habilidadesCarrera = is_array($carrera->habilidades_requeridas)
                        ? $carrera->habilidades_requeridas
                        : json_decode($carrera->habilidades_requeridas, true);

                    if (is_array($habilidadesCarrera)) {
                        $matches = count(array_intersect(array_keys($habilidades), $habilidadesCarrera));
                        $compatibilidad += ($matches * 0.1);
                    }
                }

                // Usar carrera predicha si existe
                if ($perfil->carrera_predicha_ml &&
                    strtolower($carrera->nombre) === strtolower($perfil->carrera_predicha_ml)) {
                    $compatibilidad = min(($perfil->confianza_prediccion ?? 0.7), 1.0);
                }

                // Limitar a rango 0-1
                $compatibilidad = min(max($compatibilidad, 0), 1.0);

                $recomendaciones[] = [
                    'id' => $carrera->id,
                    'carrera' => [
                        'id' => $carrera->id,
                        'nombre' => $carrera->nombre,
                        'descripcion' => $carrera->descripcion,
                        'duracion_anos' => $carrera->duracion_anos ?? 4,
                        'nivel_educativo' => $carrera->nivel_educativo ?? 'pregrado',
                        'areas_conocimiento' => $carrera->areas_conocimiento
                            ? (is_array($carrera->areas_conocimiento)
                                ? $carrera->areas_conocimiento
                                : json_decode($carrera->areas_conocimiento, true))
                            : [],
                    ],
                    'compatibilidad' => $compatibilidad,
                    'justificacion' => "Analizando compatibilidad...", // Placeholder, será reemplazado por agente
                ];
            }

            // Ordenar por compatibilidad (descendente)
            usort($recomendaciones, fn($a, $b) => $b['compatibilidad'] <=> $a['compatibilidad']);

            // Top 5 para análisis del agente (para optimizar performance)
            $top5Recomendaciones = array_slice($recomendaciones, 0, 5);

            // Generar justificaciones inteligentes con el agente
            foreach ($top5Recomendaciones as &$recomendacion) {
                try {
                    $justificacionAgente = $this->generarJustificacionCarrera(
                        $estudiante,
                        $perfil,
                        $recomendacion['carrera'],
                        $recomendacion['compatibilidad'],
                        $agentService
                    );
                    $recomendacion['justificacion'] = $justificacionAgente;
                } catch (\Exception $e) {
                    Log::warning("Error generando justificación con agente: {$e->getMessage()}");
                    $recomendacion['justificacion'] = "Esta carrera es compatible con tu perfil vocacional basado en tus intereses y habilidades.";
                }
            }

            return response()->json([
                'success' => true,
                'recomendaciones' => $top5Recomendaciones, // Top 5 con justificaciones del agente
                'todas_las_carreras' => array_slice($recomendaciones, 5), // Resto sin justificaciones
                'total' => count($recomendaciones),
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo recomendaciones con agente: {$e->getMessage()}", [
                'student_id' => auth()->id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'recomendaciones' => [],
                'message' => 'Error al obtener recomendaciones',
            ], 500);
        }
    }

    /**
     * Generar justificación inteligente para una carrera usando el agente
     */
    private function generarJustificacionCarrera(
        User $estudiante,
        PerfilVocacional $perfil,
        array $carrera,
        float $compatibilidad,
        AgentProfileSynthesisService $agentService
    ): string {
        try {
            // Preparar contexto para el agente
            $contexto = [
                'nombre_estudiante' => $estudiante->nombre_completo,
                'carrera_nombre' => $carrera['nombre'],
                'compatibilidad' => round($compatibilidad * 100),
                'intereses' => $perfil->intereses ?? [],
                'habilidades' => $perfil->habilidades ?? [],
                'carrera_predicha' => $perfil->carrera_predicha_ml,
                'areas_conocimiento' => $carrera['areas_conocimiento'],
            ];

            // Construir prompt para el agente
            $prompt = $this->construirPromptJustificacionCarrera($contexto);

            // Llamar al agente a través de HTTP
            $response = \Illuminate\Support\Facades\Http::timeout(15)
                ->post("{$this->obtenerAgentUrl()}/synthesize", [
                    'student_id' => $estudiante->id,
                    'discoveries' => [
                        'intereses' => $perfil->intereses ?? [],
                        'habilidades' => $perfil->habilidades ?? [],
                    ],
                    'predictions' => [
                        'carrera_predicha' => $carrera['nombre'],
                        'confianza' => $compatibilidad,
                        'tipo' => 'carrera_justification',
                    ],
                    'context' => 'carrera_recommendation_justification',
                    'custom_prompt' => $prompt,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $synthesis = $data['synthesis'] ?? $data['reasoning'] ?? null;

                if ($synthesis) {
                    // Si es un array, convertir a string
                    if (is_array($synthesis)) {
                        $synthesis = implode(' ', array_filter($synthesis, 'is_string'));
                    }
                    return $synthesis;
                }
            }

            // Fallback si el agente falla
            return "Esta carrera de {$carrera['nombre']} es compatible ({$contexto['compatibilidad']}%) con tu perfil vocacional. Combina bien con tus intereses y habilidades identificadas.";

        } catch (\Exception $e) {
            Log::error("Error en generarJustificacionCarrera: {$e->getMessage()}");
            return "Carrera compatible con tu perfil. Te invitamos a explorar más detalles.";
        }
    }

    /**
     * Construir prompt para justificación de carrera
     */
    private function construirPromptJustificacionCarrera(array $contexto): string
    {
        $interesesStr = implode(', ', array_map(
            fn($k, $v) => "$k ($v%)",
            array_keys($contexto['intereses']),
            $contexto['intereses']
        ));

        $habilidadesStr = implode(', ', array_keys($contexto['habilidades']));
        $areasStr = implode(', ', $contexto['areas_conocimiento'] ?? []);

        return <<<PROMPT
Por favor, proporciona una justificación BREVE (1-2 oraciones) sobre por qué la carrera de {$contexto['carrera_nombre']} es una buena recomendación para el estudiante {$contexto['nombre_estudiante']}.

Datos del estudiante:
- Intereses: $interesesStr
- Habilidades: $habilidadesStr
- Carrera predicha por ML: {$contexto['carrera_predicha']}
- Compatibilidad con esta carrera: {$contexto['compatibilidad']}%

Áreas de conocimiento de {$contexto['carrera_nombre']}: $areasStr

Instrucciones:
- Sé conciso y motivador
- Conecta los intereses/habilidades con la carrera
- Evita ser genérico
- Máximo 2 oraciones
PROMPT;
    }

    /**
     * Obtener URL del agente (centralizado para facilitar cambios)
     */
    private function obtenerAgentUrl(): string
    {
        $host = config('app.agent_host', 'localhost');
        $port = config('app.agent_port', 8003);
        return "http://{$host}:{$port}";
    }

    /**
     * Obtener recomendaciones de carreras para el tab de Recomendaciones
     * Devuelve carreras en formato compatible con el componente Vocacional/Index.tsx
     */
    public function obtenerRecomendacionesCarreraFormato(Request $request)
    {
        try {
            $estudiante = auth()->user();

            // Obtener perfil vocacional
            $perfil = PerfilVocacional::where('estudiante_id', $estudiante->id)
                ->latest()
                ->first();

            if (!$perfil) {
                return response()->json([
                    'success' => false,
                    'recomendaciones' => [],
                    'message' => 'No hay perfil vocacional disponible',
                ], 200);
            }

            // Obtener todas las carreras
            $carreras = \App\Models\Carrera::where('activo', true)
                ->get();

            if ($carreras->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'recomendaciones' => [],
                    'message' => 'No hay carreras disponibles',
                ], 200);
            }

            $recomendaciones = [];
            $intereses = $perfil->intereses ?? [];
            $habilidades = $perfil->habilidades ?? [];

            // Calcular compatibilidad para cada carrera
            foreach ($carreras as $carrera) {
                $compatibilidad = 0.5; // Base del 50%

                // Aumentar compatibilidad si hay match con intereses
                if (!empty($intereses) && !empty($carrera->intereses_relacionados)) {
                    $interesesCarrera = is_array($carrera->intereses_relacionados)
                        ? $carrera->intereses_relacionados
                        : json_decode($carrera->intereses_relacionados, true);

                    if (is_array($interesesCarrera)) {
                        $matches = count(array_intersect(array_keys($intereses), array_keys($interesesCarrera)));
                        $compatibilidad += ($matches * 0.1);
                    }
                }

                // Aumentar compatibilidad si hay match con habilidades
                if (!empty($habilidades) && !empty($carrera->habilidades_requeridas)) {
                    $habilidadesCarrera = is_array($carrera->habilidades_requeridas)
                        ? $carrera->habilidades_requeridas
                        : json_decode($carrera->habilidades_requeridas, true);

                    if (is_array($habilidadesCarrera)) {
                        $matches = count(array_intersect(array_keys($habilidades), $habilidadesCarrera));
                        $compatibilidad += ($matches * 0.1);
                    }
                }

                // Usar carrera predicha si existe
                if ($perfil->carrera_predicha_ml &&
                    strtolower($carrera->nombre) === strtolower($perfil->carrera_predicha_ml)) {
                    $compatibilidad = min(($perfil->confianza_prediccion ?? 0.7), 1.0);
                }

                // Limitar a rango 0-1
                $compatibilidad = min(max($compatibilidad, 0), 1.0);

                $recomendaciones[] = [
                    'id' => $carrera->id,
                    'carrera' => [
                        'id' => $carrera->id,
                        'nombre' => $carrera->nombre,
                        'descripcion' => $carrera->descripcion,
                        'duracion_anos' => $carrera->duracion_anos ?? 4,
                        'nivel_educativo' => $carrera->nivel_educativo ?? 'pregrado',
                        'areas_conocimiento' => $carrera->areas_conocimiento
                            ? (is_array($carrera->areas_conocimiento)
                                ? $carrera->areas_conocimiento
                                : json_decode($carrera->areas_conocimiento, true))
                            : [],
                    ],
                    'compatibilidad' => $compatibilidad,
                    'justificacion' => "Basado en tu perfil vocacional y análisis de coincidencia con esta carrera.",
                ];
            }

            // Ordenar por compatibilidad (descendente)
            usort($recomendaciones, fn($a, $b) => $b['compatibilidad'] <=> $a['compatibilidad']);

            return response()->json([
                'success' => true,
                'recomendaciones' => array_slice($recomendaciones, 0, 10), // Top 10
                'total' => count($recomendaciones),
                'timestamp' => now(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo recomendaciones: {$e->getMessage()}", [
                'student_id' => auth()->id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'recomendaciones' => [],
                'message' => 'Error al obtener recomendaciones',
            ], 500);
        }
    }
}
