<?php

namespace App\Services;

use App\Models\ResultadoTestVocacional;
use App\Models\User;
use App\Models\PerfilVocacionalCombinado;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Servicio de Síntesis de Perfil Vocacional Combinado
 *
 * Integra 3 tests vocacionales en una sola predicción de carrera coherente.
 *
 * Flujo:
 * 1. Extrae features de los 3 tests (Test 1: Explorador, Test 2: Preferencias, Test 3: RIASEC)
 * 2. Combina features de forma inteligente
 * 3. Envía a ML (puerto 8001) para predicción de carrera
 * 4. Usa Agente (puerto 8003) para generar narrativa personalizada
 * 5. Guarda perfil combinado completo
 *
 * @author Claude Code
 * @version 1.0
 */
class VocationalProfileSynthesisService
{
    protected VocationalTestIntelligenceService $testIntelligence;
    protected MLPredictionService $mlService;
    protected AgentSynthesisService $agentService;
    protected VocationalFeatureExtractorService $featureExtractor;

    // IDs de los 3 tests vocacionales (según seeder)
    private const TEST_1_ID = 52;  // Explorador de Carreras
    private const TEST_2_ID = 54;  // Preferencias Laborales
    private const TEST_3_ID = 55;  // RIASEC

    public function __construct(
        VocationalTestIntelligenceService $testIntelligence,
        MLPredictionService $mlService,
        AgentSynthesisService $agentService,
        VocationalFeatureExtractorService $featureExtractor
    ) {
        $this->testIntelligence = $testIntelligence;
        $this->mlService = $mlService;
        $this->agentService = $agentService;
        $this->featureExtractor = $featureExtractor;
    }

    /**
     * MÉTODO PRINCIPAL: Generar perfil vocacional combinado de los 3 tests
     *
     * Este método orquesta todo el flujo de análisis ML
     *
     * @param User $student Estudiante a analizar
     * @return array Perfil completo con predicciones y análisis
     * @throws Exception Si falta algún test o hay error en análisis
     */
    public function generateCombinedProfile(User $student): array
    {
        try {
            Log::info("Iniciando síntesis de perfil vocacional para estudiante {$student->id}");

            // ================================================================
            // PASO 1: Verificar que todos los tests están completados
            // ================================================================
            $testResults = $this->verifyAllTestsCompleted($student);
            if (!$testResults['all_completed']) {
                throw new Exception("No todos los tests vocacionales están completados");
            }

            Log::info("✓ Todos los tests completados", [
                'student_id' => $student->id,
                'test_1' => $testResults['test_1']->id,
                'test_2' => $testResults['test_2']->id,
                'test_3' => $testResults['test_3']->id,
            ]);

            // ================================================================
            // PASO 2: Extraer features de cada test
            // ================================================================
            $test1_features = $this->extractTestFeatures($testResults['test_1'], $testResults['test_1_obj']);
            $test2_features = $this->extractTestFeatures($testResults['test_2'], $testResults['test_2_obj']);
            $test3_features = $this->extractTestFeatures($testResults['test_3'], $testResults['test_3_obj']);

            Log::info("✓ Features extraídos de los 3 tests", [
                'test_1_features' => count($test1_features),
                'test_2_features' => count($test2_features),
                'test_3_features' => count($test3_features),
            ]);

            // ================================================================
            // PASO 3: Combinar features de forma inteligente
            // ================================================================
            $combinedFeatures = $this->combineMultiTestFeatures($test1_features, $test2_features, $test3_features);

            Log::info("✓ Features combinados", [
                'total_combined_features' => count($combinedFeatures),
            ]);

            // ================================================================
            // PASO 4: Enviar a ML para predicción de carrera
            // ================================================================
            $mlPrediction = $this->predictCareerWithML($student, $combinedFeatures);

            Log::info("✓ Predicción ML obtenida", [
                'career' => $mlPrediction['career'],
                'confidence' => $mlPrediction['confidence'],
            ]);

            // ================================================================
            // PASO 5: Generar síntesis con Agente IA
            // ================================================================
            $agentSynthesis = $this->generateAgentSynthesis($student, $mlPrediction, $combinedFeatures);

            Log::info("✓ Síntesis del agente generada");

            // ================================================================
            // PASO 6: Compilar perfil final completo
            // ================================================================
            $finalProfile = $this->compileCompleteProfile(
                $student,
                $testResults,
                $combinedFeatures,
                $mlPrediction,
                $agentSynthesis
            );

            Log::info("✅ Perfil vocacional combinado completado", [
                'student_id' => $student->id,
                'career' => $finalProfile['carrera_recomendada_principal'],
            ]);

            return $finalProfile;

        } catch (Exception $e) {
            Log::error("Error en síntesis de perfil vocacional: {$e->getMessage()}", [
                'student_id' => $student->id,
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * PASO 1: Verificar que los 3 tests estén completados
     */
    private function verifyAllTestsCompleted(User $student): array
    {
        $test1 = ResultadoTestVocacional::where('estudiante_id', $student->id)
            ->where('test_vocacional_id', self::TEST_1_ID)
            ->latest()
            ->first();

        $test2 = ResultadoTestVocacional::where('estudiante_id', $student->id)
            ->where('test_vocacional_id', self::TEST_2_ID)
            ->latest()
            ->first();

        $test3 = ResultadoTestVocacional::where('estudiante_id', $student->id)
            ->where('test_vocacional_id', self::TEST_3_ID)
            ->latest()
            ->first();

        $test1_obj = \App\Models\TestVocacional::find(self::TEST_1_ID);
        $test2_obj = \App\Models\TestVocacional::find(self::TEST_2_ID);
        $test3_obj = \App\Models\TestVocacional::find(self::TEST_3_ID);

        return [
            'all_completed' => $test1 && $test2 && $test3,
            'test_1' => $test1,
            'test_2' => $test2,
            'test_3' => $test3,
            'test_1_obj' => $test1_obj,
            'test_2_obj' => $test2_obj,
            'test_3_obj' => $test3_obj,
        ];
    }

    /**
     * PASO 2: Extraer features de un resultado de test
     *
     * Utiliza VocationalTestIntelligenceService para procesar respuestas
     */
    private function extractTestFeatures($resultado, $test): array
    {
        if (!$resultado || !$test) {
            return [];
        }

        try {
            $features = $this->testIntelligence->procesarRespuestasTest($resultado, $test);
            return $features;
        } catch (Exception $e) {
            Log::warning("Error extrayendo features: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * PASO 3: Combinar features de los 3 tests de forma inteligente
     *
     * Estrategia:
     * - Test 1 (Explorador): 40% peso → aptitudes base
     * - Test 2 (Preferencias): 30% peso → alineamiento valores
     * - Test 3 (RIASEC): 30% peso → tipo vocacional validado
     */
    private function combineMultiTestFeatures(array $test1, array $test2, array $test3): array
    {
        $combined = [];

        // Pesos para cada test
        $weights = [
            'test_1' => 0.40,  // Explorador tiene más peso
            'test_2' => 0.30,
            'test_3' => 0.30,
        ];

        // Obtener todas las claves únicas
        $allKeys = array_unique(array_merge(
            array_keys($test1),
            array_keys($test2),
            array_keys($test3)
        ));

        foreach ($allKeys as $key) {
            $value1 = $test1[$key] ?? 0;
            $value2 = $test2[$key] ?? 0;
            $value3 = $test3[$key] ?? 0;

            // Combinar con pesos
            if (is_numeric($value1) && is_numeric($value2) && is_numeric($value3)) {
                $combined[$key] = round(
                    ($value1 * $weights['test_1']) +
                    ($value2 * $weights['test_2']) +
                    ($value3 * $weights['test_3']),
                    2
                );
            } else {
                // Para valores no numéricos, tomar el de mayor peso disponible
                $combined[$key] = $value1 ?: ($value2 ?: $value3);
            }
        }

        // Agregar metadatos de síntesis
        $combined['_synthesis_method'] = 'multi_test_weighted';
        $combined['_weights'] = $weights;
        $combined['_test_count'] = 3;

        return $combined;
    }

    /**
     * PASO 4: Enviar features a ML para predicción de carrera
     *
     * Utiliza MLPredictionService para obtener predicción del modelo
     */
    private function predictCareerWithML(User $student, array $features): array
    {
        try {
            // Preparar datos para ML
            $studentData = [
                'student_id' => $student->id,
                'features' => $features,
                'academic_data' => [
                    'promedio' => $student->rendimientoAcademico?->promedio ?? 0,
                    'tendencia' => $student->rendimientoAcademico?->tendencia_temporal ?? 'estable',
                ],
            ];

            Log::info("Enviando a ML para predicción", [
                'student_id' => $student->id,
                'features_count' => count($features),
            ]);

            // Llamar a ML API
            $prediction = $this->mlService->predictCareer($studentData);

            // Procesar respuesta de ML
            return $this->processMLPrediction($prediction);

        } catch (Exception $e) {
            Log::warning("Error en predicción ML, usando fallback: {$e->getMessage()}");
            return $this->generateFallbackPrediction($student, $features);
        }
    }

    /**
     * Procesar respuesta de ML y extraer datos relevantes
     */
    private function processMLPrediction(array $prediction): array
    {
        // ML API retorna estructura: carrera_predicha_ml, confianza_prediccion, top_3, etc.
        return [
            'career' => $prediction['carrera_predicha_ml'] ?? 'Por determinar',
            'confidence' => round(($prediction['confianza_prediccion'] ?? 0.65) * 100, 2),
            'alternatives' => $this->extractTopCareers($prediction),
            'raw_prediction' => $prediction,
        ];
    }

    /**
     * Extraer top 3 carreras de la predicción ML
     */
    private function extractTopCareers(array $prediction): array
    {
        $careers = [];

        // Buscar en estructura top_3 si existe
        if (isset($prediction['prediccion_detalles']['carrera_predicha']['top_3'])) {
            foreach ($prediction['prediccion_detalles']['carrera_predicha']['top_3'] as $item) {
                $careers[] = [
                    'nombre' => $item['carrera'] ?? 'Unknown',
                    'compatibilidad' => $item['compatibilidad'] ?? 0,
                    'confianza' => $item['confianza'] ?? 0,
                ];
            }
        }

        return $careers;
    }

    /**
     * Fallback si ML no está disponible
     *
     * Genera predicción basada en features combinados
     */
    private function generateFallbackPrediction(User $student, array $features): array
    {
        Log::info("Usando predicción fallback para estudiante {$student->id}");

        // Identificar área dominante de features
        $topArea = $this->identifyDominantArea($features);

        return [
            'career' => $this->mapAreaToCareer($topArea),
            'confidence' => 65,
            'alternatives' => $this->generateAlternativeCareer($topArea),
            'method' => 'fallback',
        ];
    }

    /**
     * Identificar área vocacional dominante
     */
    private function identifyDominantArea(array $features): string
    {
        $areas = [
            'tecnologia' => $features['area_tecnologia'] ?? 0,
            'ingenieria' => $features['area_ingenieria'] ?? 0,
            'salud' => $features['area_salud'] ?? 0,
            'negocios' => $features['area_negocios'] ?? 0,
            'artes' => $features['area_artes'] ?? 0,
        ];

        arsort($areas);
        return array_key_first($areas) ?? 'negocios';
    }

    /**
     * Mapear área vocacional a carrera recomendada
     */
    private function mapAreaToCareer(string $area): string
    {
        $mapping = [
            'tecnologia' => 'Ingeniería en Sistemas',
            'ingenieria' => 'Ingeniería Industrial',
            'salud' => 'Medicina',
            'negocios' => 'Administración de Empresas',
            'artes' => 'Diseño Gráfico',
        ];

        return $mapping[$area] ?? 'Administración de Empresas';
    }

    /**
     * Generar carreras alternativas
     */
    private function generateAlternativeCareer(string $area): array
    {
        $mapping = [
            'tecnologia' => ['Ingeniería en Sistemas', 'Análisis de Datos', 'Ciberseguridad'],
            'ingenieria' => ['Ingeniería Industrial', 'Ingeniería Civil', 'Ingeniería Mecánica'],
            'salud' => ['Medicina', 'Enfermería', 'Psicología'],
            'negocios' => ['Administración de Empresas', 'Contabilidad', 'Marketing'],
            'artes' => ['Diseño Gráfico', 'Artes Visuales', 'Comunicación'],
        ];

        return $mapping[$area] ?? ['Administración de Empresas', 'Contabilidad', 'Marketing'];
    }

    /**
     * PASO 5: Generar síntesis con Agente IA
     *
     * Utiliza AgentSynthesisService para crear narrativa personalizada
     */
    private function generateAgentSynthesis(User $student, array $prediction, array $features): array
    {
        try {
            Log::info("Generando síntesis de agente para estudiante {$student->id}");

            // Preparar contexto para el agente
            $context = [
                'student_name' => $student->name,
                'predicted_career' => $prediction['career'],
                'confidence' => $prediction['confidence'],
                'strengths' => $this->extractStrengths($features),
                'opportunities' => $this->extractOpportunities($features),
                'dominant_areas' => $this->extractDominantAreas($features),
            ];

            // Intentar usar agente, con fallback a síntesis local
            try {
                $synthesis = $this->agentService->getIntegratedStudentAnalysis($student->id);
                return array_merge($synthesis, ['source' => 'agent']);
            } catch (Exception $e) {
                Log::warning("Agente no disponible, usando síntesis local");
                return $this->generateLocalSynthesis($context);
            }

        } catch (Exception $e) {
            Log::warning("Error en síntesis: {$e->getMessage()}");
            return $this->generateLocalSynthesis([]);
        }
    }

    /**
     * Generar síntesis local si agente no está disponible
     */
    private function generateLocalSynthesis(array $context): array
    {
        $narrative = sprintf(
            "Basándote en tu análisis vocacional combinado, se recomienda la carrera de %s. " .
            "Tu perfil muestra aptitudes especiales en %s y oportunidades de mejora en %s. " .
            "Se sugiere profundizar en formación relacionada y buscar experiencias prácticas en el campo.",
            $context['predicted_career'] ?? 'Administración de Empresas',
            implode(', ', $context['strengths'] ?? ['análisis', 'comunicación']),
            implode(', ', $context['opportunities'] ?? ['liderazgo', 'creatividad'])
        );

        return [
            'success' => true,
            'narrative' => $narrative,
            'recommendations' => [
                'Explora carreras en el área identificada',
                'Realiza investigación sobre instituciones que las ofrecen',
                'Busca mentores en campos relacionados',
                'Desarrolla habilidades identificadas como oportunidades',
            ],
            'source' => 'local_synthesis',
        ];
    }

    /**
     * Extraer fortalezas de features
     */
    private function extractStrengths(array $features): array
    {
        $strengths = [];

        foreach ($features as $key => $value) {
            if (is_numeric($value) && $value > 70) {
                $strengths[] = $this->formatFeatureName($key);
            }
        }

        return array_slice($strengths, 0, 3) ?: ['Pensamiento analítico', 'Comunicación', 'Trabajo en equipo'];
    }

    /**
     * Extraer oportunidades de features
     */
    private function extractOpportunities(array $features): array
    {
        $opportunities = [];

        foreach ($features as $key => $value) {
            if (is_numeric($value) && $value < 50) {
                $opportunities[] = $this->formatFeatureName($key);
            }
        }

        return array_slice($opportunities, 0, 3) ?: ['Liderazgo', 'Creatividad', 'Gestión de recursos'];
    }

    /**
     * Extraer áreas dominantes
     */
    private function extractDominantAreas(array $features): array
    {
        $areas = [];

        foreach ($features as $key => $value) {
            if (strpos($key, 'area_') === 0 && is_numeric($value) && $value > 50) {
                $areas[] = str_replace('area_', '', $key);
            }
        }

        return $areas;
    }

    /**
     * Formatear nombre de feature para presentación
     */
    private function formatFeatureName(string $key): string
    {
        return ucfirst(str_replace('_', ' ', $key));
    }

    /**
     * PASO 6: Compilar perfil final completo
     */
    private function compileCompleteProfile(
        User $student,
        array $testResults,
        array $features,
        array $prediction,
        array $synthesis
    ): array {
        return [
            'estudiante_id' => $student->id,
            'resultado_test_1_id' => $testResults['test_1']->id,
            'resultado_test_2_id' => $testResults['test_2']->id,
            'resultado_test_3_id' => $testResults['test_3']->id,
            'aptitudes_combinadas' => $this->normalizeAptitudes($features),
            'preferencias_laborales' => $this->normalizePreferences($testResults['test_2']),
            'tipo_vocacional_riasec' => $this->normalizeRiasec($testResults['test_3']),
            'carrera_recomendada_principal' => $prediction['career'],
            'carreras_recomendadas' => $prediction['alternatives'],
            'confianza_general' => $prediction['confidence'],
            'resumen_perfil' => $synthesis['narrative'] ?? $this->generateSummary($prediction, $features),
            'analisis_fortalezas' => $this->extractStrengths($features),
            'analisis_oportunidades' => $this->extractOpportunities($features),
            'todos_tests_completados' => true,
            'fecha_generacion' => now(),
            'synthesis_data' => $synthesis,
        ];
    }

    /**
     * Normalizar aptitudes para almacenamiento
     */
    private function normalizeAptitudes(array $features): array
    {
        return [
            'habilidades_stem' => $features['area_tecnologia'] ?? $features['area_ingenieria'] ?? 0,
            'creatividad' => $features['area_artes'] ?? 0,
            'comunicacion' => $features['comunicacion'] ?? 0,
            'liderazgo' => $features['liderazgo'] ?? 0,
            'promedio_general' => round(array_sum(array_filter(
                $features,
                fn($v) => is_numeric($v)
            )) / max(1, count(array_filter($features, fn($v) => is_numeric($v)))), 2),
        ];
    }

    /**
     * Normalizar preferencias del test 2
     */
    private function normalizePreferences($testResult): array
    {
        if (!$testResult) {
            return [
                'ambiente_laboral' => 'No determinado',
                'tipo_tareas' => 'No determinado',
                'valores_profesionales' => 'No determinado',
            ];
        }

        // Extraer del puntajes_por_categoria si existe
        $puntajes = json_decode($testResult->puntajes_por_categoria, true) ?? [];

        return [
            'ambiente_laboral' => array_key_first($puntajes) ?? 'No determinado',
            'tipo_tareas' => $puntajes[array_key_first($puntajes)] ?? 'No determinado',
            'valores_profesionales' => 'No determinado',
        ];
    }

    /**
     * Normalizar tipo RIASEC del test 3
     */
    private function normalizeRiasec($testResult): array
    {
        if (!$testResult) {
            return [
                'tipo_principal' => 'No determinado',
                'tipo_secundario' => 'No determinado',
                'descripcion' => '',
            ];
        }

        // Extraer del puntajes_por_categoria
        $puntajes = json_decode($testResult->puntajes_por_categoria, true) ?? [];

        // Ordenar por puntaje descendente
        arsort($puntajes);
        $tipos = array_keys(array_slice($puntajes, 0, 2));

        return [
            'tipo_principal' => $tipos[0] ?? 'No determinado',
            'tipo_secundario' => $tipos[1] ?? 'No determinado',
            'descripcion' => $this->describeRiasecType($tipos[0] ?? ''),
        ];
    }

    /**
     * Describir tipo RIASEC
     */
    private function describeRiasecType(string $type): string
    {
        $descriptions = [
            'Realista' => 'Orientado a trabajo con objetos, máquinas, herramientas',
            'Investigador' => 'Orientado a investigación, análisis y ciencia',
            'Artístico' => 'Orientado a expresión creativa y artes',
            'Social' => 'Orientado a ayuda, enseñanza y relaciones interpersonales',
            'Empresarial' => 'Orientado a liderazgo, persuasión y gestión',
            'Convencional' => 'Orientado a organización, detalles y procedimientos',
        ];

        return $descriptions[$type] ?? '';
    }

    /**
     * Generar resumen del perfil
     */
    private function generateSummary(array $prediction, array $features): string
    {
        return sprintf(
            "Perfil vocacional combinado basado en 3 evaluaciones. " .
            "La carrera recomendada es %s con nivel de confianza del %s%%. " .
            "El estudiante muestra aptitudes destacadas en múltiples áreas.",
            $prediction['career'],
            $prediction['confidence']
        );
    }
}
