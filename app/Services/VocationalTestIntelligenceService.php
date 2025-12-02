<?php

namespace App\Services;

use App\Models\TestVocacional;
use App\Models\ResultadoTestVocacional;
use Illuminate\Support\Facades\Log;

/**
 * Servicio de Inteligencia Vocacional
 *
 * Procesa respuestas del test vocacional y extrae features intelligentes
 * para enviar a los modelos ML
 */
class VocationalTestIntelligenceService
{
    /**
     * Mapeo de categorías de test a áreas vocacionales
     * Esto permite que cualquier test sea inteligente
     */
    private const VOCATIONAL_AREAS = [
        'tecnologia' => ['programación', 'sistemas', 'informática', 'desarrollo', 'software', 'datos'],
        'ingenieria' => ['civil', 'industrial', 'mecanica', 'electrica', 'construccion'],
        'salud' => ['medicina', 'enfermeria', 'psicologia', 'nutricion', 'odontologia'],
        'negocios' => ['contabilidad', 'economia', 'administración', 'marketing', 'finanzas'],
        'artes' => ['diseño', 'artes', 'musica', 'cine', 'comunicacion', 'diseño grafico'],
        'educacion' => ['pedagogia', 'docencia', 'educacion', 'capacitacion'],
        'derecho' => ['derecho', 'legal', 'justicia'],
        'ciencias' => ['fisica', 'quimica', 'biologia', 'matematica'],
    ];

    /**
     * Procesar respuestas del test y extraer features vocacionales
     *
     * @param ResultadoTestVocacional $resultado
     * @param TestVocacional $test
     * @return array Features procesados para ML
     */
    public function procesarRespuestasTest(ResultadoTestVocacional $resultado, TestVocacional $test): array
    {
        Log::info("VocationalTestIntelligenceService: Procesando respuestas del test");

        $respuestas = $resultado->getRespuestasArray();
        $features = [];

        // =====================================================================
        // PASO 1: Calcular scores por categoría
        // =====================================================================
        $scoresCategoria = $this->calcularScoresCategoria($respuestas, $test);
        $features = array_merge($features, $scoresCategoria);

        // =====================================================================
        // PASO 2: Identificar áreas vocacionales dominantes
        // =====================================================================
        $areasVocacionales = $this->identificarAreasVocacionales($test, $scoresCategoria);
        $features = array_merge($features, $areasVocacionales);

        // =====================================================================
        // PASO 3: Calcular patrones de respuesta
        // =====================================================================
        $patrones = $this->analizarPatronesRespuesta($respuestas, $test);
        $features = array_merge($features, $patrones);

        // =====================================================================
        // PASO 4: Normalizar features para ML (0-100)
        // =====================================================================
        $featuresNormalizados = $this->normalizarFeatures($features);

        Log::info("VocationalTestIntelligenceService: Features procesados", [
            'total_features' => count($featuresNormalizados),
            'areas_identificadas' => array_keys($areasVocacionales),
        ]);

        return $featuresNormalizados;
    }

    /**
     * PASO 1: Calcular scores por categoría
     *
     * Analiza qué porcentaje de preguntas respondió el estudiante
     * en cada categoría
     */
    private function calcularScoresCategoria($respuestas, TestVocacional $test): array
    {
        $scores = [];
        $puntajesPorCategoria = [];

        foreach ($test->categorias as $categoria) {
            $preguntasTotal = $categoria->preguntas->count();

            if ($preguntasTotal === 0) {
                continue;
            }

            // Contar respuestas respondidas en esta categoría
            $respondidas = 0;
            $puntajeTotal = 0;

            foreach ($categoria->preguntas as $pregunta) {
                if (isset($respuestas[$pregunta->id])) {
                    $respondidas++;

                    // Calcular puntaje según tipo de pregunta
                    $puntaje = $this->calcularPuntajePregunta(
                        $pregunta,
                        $respuestas[$pregunta->id]
                    );
                    $puntajeTotal += $puntaje;
                }
            }

            // Score de completación (0-100)
            $scoreCompletacion = ($respondidas / $preguntasTotal) * 100;

            // Score de desempeño (0-100)
            $scoreDesempeno = $preguntasTotal > 0
                ? ($puntajeTotal / $preguntasTotal) / 10 * 100  // Normalizar a 0-100
                : 0;

            // Combinar: 60% completación + 40% desempeño
            $scoreCompuesto = ($scoreCompletacion * 0.6) + ($scoreDesempeno * 0.4);

            $nombreNormalizado = strtolower(str_replace(' ', '_', $categoria->nombre));
            $scores["categoria_{$nombreNormalizado}"] = round($scoreCompuesto, 2);
            $puntajesPorCategoria[$categoria->nombre] = $scoreCompuesto;
        }

        // Guardar puntajes por categoría en el resultado
        if (!empty($puntajesPorCategoria)) {
            $resultado = ResultadoTestVocacional::find($resultado->id);
            if ($resultado) {
                $resultado->update([
                    'puntajes_por_categoria' => json_encode($puntajesPorCategoria)
                ]);
            }
        }

        return $scores;
    }

    /**
     * Calcular puntaje individual de una pregunta
     *
     * Cada tipo de pregunta se evalúa diferente
     */
    private function calcularPuntajePregunta($pregunta, $respuesta): float
    {
        switch ($pregunta->tipo) {
            case 'opcion_multiple':
                // Para múltiple choice, todas las respuestas valen igual
                // En una versión mejorada, podrían tener pesos diferentes
                return 5.0;

            case 'verdadero_falso':
                // Verdadero/Falso también vale igual
                return 5.0;

            case 'escala_likert':
                // Para escala Likert, el valor es el puntaje
                $respuestaNum = intval($respuesta);
                return min($respuestaNum, 10.0); // Max 10 puntos

            default:
                return 0.0;
        }
    }

    /**
     * PASO 2: Identificar áreas vocacionales dominantes
     *
     * Mapea las categorías del test a áreas vocacionales
     * (tecnología, salud, negocios, etc.)
     */
    private function identificarAreasVocacionales($test, $scoresCategoria): array
    {
        $areasIdentificadas = [];
        $areasScores = [];

        // Intentar mapear cada categoría a un área vocacional
        foreach ($test->categorias as $categoria) {
            $nombreLower = strtolower($categoria->nombre);

            // Buscar coincidencias en las áreas definidas
            foreach (self::VOCATIONAL_AREAS as $area => $keywords) {
                foreach ($keywords as $keyword) {
                    if (strpos($nombreLower, $keyword) !== false) {
                        // Encontramos una coincidencia
                        $categoriaKey = "categoria_" . strtolower(str_replace(' ', '_', $categoria->nombre));
                        $score = $scoresCategoria[$categoriaKey] ?? 50;

                        if (!isset($areasScores[$area])) {
                            $areasScores[$area] = [];
                        }
                        $areasScores[$area][] = $score;
                        break 2;
                    }
                }
            }
        }

        // Promediar scores por área
        foreach ($areasScores as $area => $scores) {
            $promedio = array_sum($scores) / count($scores);
            $areasIdentificadas["area_{$area}"] = round($promedio, 2);
        }

        // Si no se identificaron áreas, usar scores de categorías como fallback
        if (empty($areasIdentificadas)) {
            $areasIdentificadas = $scoresCategoria;
        }

        Log::info("Áreas vocacionales identificadas", $areasIdentificadas);

        return $areasIdentificadas;
    }

    /**
     * PASO 3: Analizar patrones de respuesta
     *
     * Extrae características de cómo respondió (patrones cognitivos)
     */
    private function analizarPatronesRespuesta($respuestas, TestVocacional $test): array
    {
        $patrones = [];

        // Patrón 1: Velocidad de respuesta (qué tan completo está el test)
        $totalPreguntas = $test->categorias->sum(function ($cat) {
            return $cat->preguntas->count();
        });
        $respuestas_count = count(array_filter($respuestas));
        $tasaCompletacion = $totalPreguntas > 0 ? ($respuestas_count / $totalPreguntas) * 100 : 0;
        $patrones['tasa_completacion'] = round($tasaCompletacion, 2);

        // Patrón 2: Consistencia en respuestas
        $patrones['consistencia_respuesta'] = $this->calcularConsistencia($respuestas, $test);

        // Patrón 3: Variabilidad de respuestas (diversidad)
        $patrones['variabilidad_respuesta'] = $this->calcularVariabilidad($respuestas, $test);

        // Patrón 4: Fortaleza en categorías (diferencia entre mejor y peor)
        $patrones['fortaleza_promedio'] = $this->calcularFortalezaPromedio($respuestas, $test);

        return $patrones;
    }

    /**
     * Calcular consistencia en respuestas (0-100)
     */
    private function calcularConsistencia($respuestas, TestVocacional $test): float
    {
        if (empty($respuestas)) {
            return 0;
        }

        $respuestasArray = array_values(array_filter($respuestas));

        if (count($respuestasArray) < 2) {
            return 100; // Si hay muy pocas respuestas, considerarlo consistente
        }

        // Calcular varianza de las respuestas (si son números)
        $numericResponses = array_filter($respuestasArray, 'is_numeric');

        if (empty($numericResponses)) {
            return 80; // Respuestas que no son numéricas tienen consistencia media-alta
        }

        $mean = array_sum($numericResponses) / count($numericResponses);
        $variance = 0;

        foreach ($numericResponses as $response) {
            $variance += pow($response - $mean, 2);
        }

        $variance /= count($numericResponses);
        $stdDev = sqrt($variance);

        // Normalizar: baja desviación = alta consistencia
        // Si stdDev es 0, consistencia es 100
        // Si stdDev es 5 (máximo esperado), consistencia es baja
        $consistencia = max(0, 100 - ($stdDev * 20));

        return round($consistencia, 2);
    }

    /**
     * Calcular variabilidad en respuestas (0-100)
     * Mide si el estudiante responde de forma diversa
     */
    private function calcularVariabilidad($respuestas, TestVocacional $test): float
    {
        if (empty($respuestas)) {
            return 0;
        }

        $respuestasNum = array_filter($respuestas, 'is_numeric');

        if (count($respuestasNum) < 2) {
            return 0;
        }

        $min = min($respuestasNum);
        $max = max($respuestasNum);
        $rango = $max - $min;

        // Normalizar rango a 0-100
        // En escala Likert típica (1-5), rango máximo es 4
        $variabilidad = min(100, ($rango / 10) * 100);

        return round($variabilidad, 2);
    }

    /**
     * Calcular fortaleza promedio
     */
    private function calcularFortalezaPromedio($respuestas, TestVocacional $test): float
    {
        if (empty($respuestas)) {
            return 50;
        }

        $respuestasNum = array_filter($respuestas, 'is_numeric');

        if (empty($respuestasNum)) {
            return 50; // Default si no hay respuestas numéricas
        }

        $promedio = array_sum($respuestasNum) / count($respuestasNum);

        // Normalizar a 0-100 (asumiendo escala 1-10)
        return round(($promedio / 10) * 100, 2);
    }

    /**
     * PASO 4: Normalizar todos los features para ML
     *
     * Asegura que todos los valores estén en rango 0-100
     */
    private function normalizarFeatures($features): array
    {
        $normalizados = [];

        foreach ($features as $key => $value) {
            // Si es un valor numérico, asegurarse que esté en rango 0-100
            if (is_numeric($value)) {
                $valor = floatval($value);
                // Clampear a rango 0-100
                $valor = max(0, min(100, $valor));
                $normalizados[$key] = round($valor, 2);
            } else {
                $normalizados[$key] = $value;
            }
        }

        return $normalizados;
    }

    /**
     * Generar reporte de análisis del test
     *
     * Útil para profesores que quieren entender qué se midió
     */
    public function generarReporteAnalisis(TestVocacional $test, array $features): array
    {
        return [
            'nombre_test' => $test->nombre,
            'fecha_analisis' => now()->toIso8601String(),
            'total_categorias' => $test->categorias->count(),
            'total_preguntas' => $test->categorias->sum(fn($c) => $c->preguntas->count()),
            'features_extraidos' => count($features),
            'areas_medidas' => array_keys(
                array_filter($features, fn($key) => strpos($key, 'area_') === 0, ARRAY_FILTER_USE_KEY)
            ),
            'features_por_categoria' => array_filter(
                $features,
                fn($key) => strpos($key, 'categoria_') === 0,
                ARRAY_FILTER_USE_KEY
            ),
            'patrones_respuesta' => [
                'tasa_completacion' => $features['tasa_completacion'] ?? 0,
                'consistencia' => $features['consistencia_respuesta'] ?? 0,
                'variabilidad' => $features['variabilidad_respuesta'] ?? 0,
            ],
        ];
    }
}
