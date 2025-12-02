<?php

namespace App\Services;

use App\Models\Trabajo;
use App\Models\Evaluacion;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Servicio para analizar evaluaciones y generar recomendaciones
 *
 * Cuando un estudiante completa una evaluación:
 * 1. Analiza qué preguntas respondió mal
 * 2. Identifica áreas de debilidad por tema
 * 3. Llama al Agente para generar recomendaciones personalizadas
 * 4. Guarda las recomendaciones en la base de datos
 */
class EvaluationAnalysisService
{
    protected $client;
    protected $agentApiUrl;
    protected $timeout;

    public function __construct()
    {
        $this->agentApiUrl = env('ML_AGENTE_URL', 'http://localhost:8003');
        $this->timeout = env('ML_HTTP_TIMEOUT', 30);

        $this->client = new Client([
            'timeout' => $this->timeout,
            'connect_timeout' => 5,
        ]);

        Log::info('EvaluationAnalysisService inicializado', [
            'agent_api_url' => $this->agentApiUrl,
        ]);
    }

    /**
     * Analizar una evaluación completada y generar recomendaciones
     *
     * @param Trabajo $trabajo El trabajo/evaluación completada
     * @param Evaluacion $evaluacion La evaluación
     * @return array Recomendaciones personalizadas
     */
    public function analyzeAndRecommend(Trabajo $trabajo, Evaluacion $evaluacion): array
    {
        try {
            Log::info('Analizando evaluación completada', [
                'trabajo_id' => $trabajo->id,
                'evaluacion_id' => $evaluacion->id,
                'estudiante_id' => $trabajo->estudiante_id,
            ]);

            // 1. Analizar respuestas y determinar áreas débiles
            $analysisData = $this->analyzeResponses($trabajo, $evaluacion);

            // 2. Obtener datos del estudiante
            $student = User::find($trabajo->estudiante_id);
            $studentData = $this->getStudentContext($student);

            // 3. Preparar payload para el agente
            $payload = [
                'student_data' => $studentData,
                'evaluation_analysis' => $analysisData,
                'evaluation' => [
                    'titulo' => $evaluacion->contenido->titulo ?? 'Evaluación',
                    'descripcion' => $evaluacion->contenido->descripcion ?? '',
                    'tipo' => $evaluacion->tipo_evaluacion,
                    'puntuacion_total' => $evaluacion->puntuacion_total,
                ]
            ];

            // 4. Llamar al agente para generar recomendaciones
            $recommendations = $this->fetchAgentRecommendations($payload);

            // 5. NUEVAS LINEAS: Obtener recursos específicos de los temas débiles
            $failedTopics = $this->extractFailedTopics($analysisData);
            $resources = [];

            if (!empty($failedTopics)) {
                $agentResourceService = new AgentResourceService();
                $resources = $agentResourceService->getResourcesForFailedTopics(
                    $failedTopics,
                    $student->name,
                    $trabajo->calificacion->puntaje ?? 0
                );

                Log::info('Recursos generados para temas débiles', [
                    'trabajo_id' => $trabajo->id,
                    'num_topics' => count($failedTopics),
                    'num_resources' => count($resources),
                ]);
            }

            // 6. Incluir recursos en las recomendaciones (compatibles con frontend)
            if (!empty($resources)) {
                // Agregar estructura de recursos_by_format para el frontend
                $recommendations['resources_by_format'] = $resources['resources_by_format'] ?? [];
                $recommendations['total_count'] = $resources['total_count'] ?? 0;
                $recommendations['breakdown'] = $resources['breakdown'] ?? [];

                // Log
                Log::info('✓ Recursos multi-formato incluidos', [
                    'trabajo_id' => $trabajo->id,
                    'total_resources' => $resources['total_count'] ?? 0,
                    'categories' => count($resources['resources_by_format'] ?? []),
                ]);
            } else {
                // Fallback si no hay recursos
                $recommendations['resources_by_format'] = [];
                $recommendations['total_count'] = 0;
                $recommendations['breakdown'] = [];
            }

            $recommendations['failed_topics'] = $failedTopics;

            Log::info('Recomendaciones y recursos generados exitosamente', [
                'trabajo_id' => $trabajo->id,
                'num_recommendations' => count($recommendations['recommendations'] ?? []),
                'total_resources' => $recommendations['total_count'] ?? 0,
            ]);

            return $recommendations;

        } catch (Exception $e) {
            Log::error('Error analizando evaluación', [
                'trabajo_id' => $trabajo->id,
                'error' => $e->getMessage(),
            ]);

            // Retornar recomendaciones por defecto si hay error
            return $this->getDefaultRecommendations($analysisData ?? []);
        }
    }

    /**
     * Analizar respuestas y determinar áreas de debilidad
     *
     * @param Trabajo $trabajo
     * @param Evaluacion $evaluacion
     * @return array Análisis detallado de respuestas
     */
    protected function analyzeResponses(Trabajo $trabajo, Evaluacion $evaluacion): array
    {
        $respuestas = $trabajo->respuestas;
        if (is_string($respuestas)) {
            $respuestas = json_decode($respuestas, true);
        }
        if (is_object($respuestas)) {
            $respuestas = json_decode(json_encode($respuestas), true);
        }
        $respuestas = $respuestas ?? [];

        $preguntas = $evaluacion->preguntas;
        $totalPreguntas = $preguntas->count();
        $respuestasIncorrectas = 0;
        $areasDebiles = [];
        $respuestasDetalladas = [];

        foreach ($preguntas as $pregunta) {
            $esCorrecta = false;
            $respuestaEstudiante = null;

            // Buscar la respuesta del estudiante
            foreach ($respuestas as $respuesta) {
                if (is_array($respuesta) && ($respuesta['pregunta_id'] ?? null) == $pregunta->id) {
                    $respuestaEstudiante = $respuesta['respuesta'] ?? null;
                    $esCorrecta = $respuesta['es_correcta'] ?? false;
                    break;
                }
            }

            if (!$esCorrecta && $respuestaEstudiante !== null) {
                $respuestasIncorrectas++;

                // Determinar tema con jerarquía inteligente
                // 1. Primero: campo tema explícito de la pregunta
                // 2. Fallback: extraer del enunciado de la pregunta
                // 3. Fallback final: usar título de evaluación
                $tema = $this->determineTemaForPregunta($pregunta, $evaluacion);

                if (!isset($areasDebiles[$tema])) {
                    $areasDebiles[$tema] = [
                        'nombre' => $tema,
                        'incorrectas' => 0,
                        'total' => 0,
                        'preguntas_ids' => [],
                    ];
                }
                $areasDebiles[$tema]['incorrectas']++;
                $areasDebiles[$tema]['preguntas_ids'][] = $pregunta->id;
            }

            // Contar total por tema (usando misma lógica)
            $tema = $this->determineTemaForPregunta($pregunta, $evaluacion);
            if (!isset($areasDebiles[$tema])) {
                $areasDebiles[$tema] = [
                    'nombre' => $tema,
                    'incorrectas' => 0,
                    'total' => 0,
                    'preguntas_ids' => [],
                ];
            }
            $areasDebiles[$tema]['total']++;

            $respuestasDetalladas[] = [
                'pregunta_id' => $pregunta->id,
                'pregunta_texto' => substr($pregunta->enunciado, 0, 100),
                'respuesta_estudiante' => $respuestaEstudiante,
                'respuesta_correcta' => $pregunta->respuesta_correcta,
                'es_correcta' => $esCorrecta,
                'tema' => $tema,
            ];
        }

        // Calcular porcentaje de aciertos
        $porcentajeAciertos = $totalPreguntas > 0
            ? (($totalPreguntas - $respuestasIncorrectas) / $totalPreguntas) * 100
            : 0;

        // Ordenar áreas débiles por porcentaje de errores
        uasort($areasDebiles, function($a, $b) {
            $porcentajeA = $a['total'] > 0 ? ($a['incorrectas'] / $a['total']) * 100 : 0;
            $porcentajeB = $b['total'] > 0 ? ($b['incorrectas'] / $b['total']) * 100 : 0;
            return $porcentajeB <=> $porcentajeA;
        });

        return [
            'total_preguntas' => $totalPreguntas,
            'respuestas_correctas' => $totalPreguntas - $respuestasIncorrectas,
            'respuestas_incorrectas' => $respuestasIncorrectas,
            'porcentaje_aciertos' => round($porcentajeAciertos, 2),
            'calificacion' => round($trabajo->calificacion->puntaje ?? 0, 2),
            'calificacion_maxima' => $evaluacion->puntuacion_total,
            'areas_debiles' => $areasDebiles,
            'respuestas_detalladas' => $respuestasDetalladas,
        ];
    }

    /**
     * Obtener contexto académico del estudiante
     *
     * @param User $student
     * @return array
     */
    protected function getStudentContext(User $student): array
    {
        $trabajos = $student->trabajos()->with('calificacion')->get();

        $calificaciones = $trabajos
            ->filter(fn($t) => $t->calificacion !== null)
            ->map(fn($t) => $t->calificacion->puntaje)
            ->toArray();

        $promedio = !empty($calificaciones) ? array_sum($calificaciones) / count($calificaciones) : 0;

        return [
            'student_id' => $student->id,
            'nombre' => $student->name,
            'email' => $student->email,
            'total_evaluaciones' => $trabajos->count(),
            'promedio_general' => round($promedio, 2),
            'evaluaciones_completadas' => $trabajos->filter(fn($t) => $t->estaEntregado() || $t->estaCalificado())->count(),
        ];
    }

    /**
     * Llamar al agente para generar recomendaciones personalizadas
     *
     * @param array $payload
     * @return array
     */
    protected function fetchAgentRecommendations(array $payload): array
    {
        try {
            Log::info('Llamando agente para generar recomendaciones de evaluación', [
                'agent_url' => $this->agentApiUrl,
                'areas_debiles' => count($payload['evaluation_analysis']['areas_debiles'] ?? []),
            ]);

            // Intentar primero con /api/student/{id}/analysis si es disponible
            $studentId = $payload['student_data']['student_id'] ?? null;
            $endpoint = "/api/student/{$studentId}/analysis";

            $response = $this->client->post(
                "{$this->agentApiUrl}{$endpoint}",
                [
                    'json' => [
                        'student_id' => $studentId,
                        'analysis_type' => 'evaluation_performance',
                        'evaluation_data' => $payload['evaluation_analysis'],
                        'student_context' => $payload['student_data'],
                    ],
                    'headers' => ['Content-Type' => 'application/json'],
                    'timeout' => 60,
                ]
            );

            $result = json_decode($response->getBody(), true);

            Log::info('Agente generó recomendaciones', [
                'status' => $result['status'] ?? 'unknown',
            ]);

            // Extraer recomendaciones del resultado
            return [
                'recommendations' => $result['recommendations'] ?? $result['analysis'] ?? [],
                'evaluation_analysis' => $payload['evaluation_analysis'],
            ];

        } catch (\GuzzleHttp\Exception\ConnectException $e) {
            Log::warning('No se pudo conectar al agente - usando análisis básico', [
                'error' => $e->getMessage(),
            ]);

            // Retornar análisis básico si falla la conexión
            return [
                'recommendations' => [],
                'evaluation_analysis' => $payload['evaluation_analysis'],
            ];
        } catch (\Exception $e) {
            Log::warning('Error llamando al agente - usando análisis básico', [
                'error' => $e->getMessage(),
            ]);

            // Retornar análisis básico sin recomendaciones del agente
            return [
                'recommendations' => [],
                'evaluation_analysis' => $payload['evaluation_analysis'],
            ];
        }
    }

    /**
     * Recomendaciones por defecto si falla el agente
     *
     * @param array $analysisData
     * @return array
     */
    protected function getDefaultRecommendations(array $analysisData): array
    {
        $recommendations = [
            'recomendaciones' => [],
            'areas_mejora' => [],
            'recursos_sugeridos' => [],
        ];

        // Generar recomendaciones basadas en el análisis
        foreach ($analysisData['areas_debiles'] ?? [] as $area) {
            $porcentajeError = $area['total'] > 0
                ? ($area['incorrectas'] / $area['total']) * 100
                : 0;

            if ($porcentajeError > 50) {
                $recommendations['recomendaciones'][] = [
                    'titulo' => "Refuerza el área: {$area['nombre']}",
                    'descripcion' => "Tuviste {$area['incorrectas']} errores de {$area['total']} preguntas en este tema ({$porcentajeError}%)",
                    'tipo' => 'critical',
                    'urgencia' => 'alta',
                ];

                $recommendations['areas_mejora'][] = $area['nombre'];
            }
        }

        return $recommendations;
    }

    /**
     * Extraer temas fallidos del análisis
     * Retorna un array en formato: ['Tema' => errorRate, ...]
     *
     * @param array $analysisData
     * @return array
     */
    protected function extractFailedTopics(array $analysisData): array
    {
        // NUEVO: Análisis de contexto general en lugar de por pregunta individual
        return $this->analyzeFailedQuestionsContext($analysisData);
    }

    /**
     * Analizar contexto GENERAL de TODAS las preguntas fallidas juntas
     *
     * En lugar de tratar cada pregunta fallida de forma aislada,
     * analiza todas ellas como un conjunto para detectar el tema principal
     */
    protected function analyzeFailedQuestionsContext(array $analysisData): array
    {
        $respuestasDetalladas = $analysisData['respuestas_detalladas'] ?? [];

        // 1. Filtrar solo respuestas incorrectas
        $respuestasIncorrectas = array_filter($respuestasDetalladas, function($resp) {
            return !($resp['es_correcta'] ?? false);
        });

        if (empty($respuestasIncorrectas)) {
            return [];
        }

        // 2. Concatenar todos los enunciados de preguntas fallidas
        $enunciadosJuntos = implode(' ', array_column($respuestasIncorrectas, 'pregunta_texto'));
        $enunciadosJuntos = strtolower($enunciadosJuntos);

        // 3. Mapeo de temas con palabras clave
        $temasMap = [
            // Matemáticas
            'Cálculo' => ['cálculo', 'calculo', 'derivada', 'integral', 'límite', 'limite', 'función', 'funcion'],
            'Álgebra' => ['álgebra', 'algebra', 'ecuación', 'ecuacion', 'polinomio', 'factor', 'variable', 'x²', 'x^'],
            'Geometría' => ['geometría', 'geometria', 'triángulo', 'triangulo', 'círculo', 'circulo', 'área', 'area', 'perímetro', 'perimetro'],
            'Trigonometría' => ['trigonometría', 'trigonometria', 'seno', 'coseno', 'tangente', 'ángulo', 'angulo'],
            'Estadística' => ['estadística', 'estadistica', 'probabilidad', 'media', 'desviación', 'distribucion', 'varianza'],

            // Ciencias
            'Física' => ['física', 'fisica', 'velocidad', 'aceleración', 'aceleracion', 'fuerza', 'energía', 'energia', 'movimiento', 'newton'],
            'Química' => ['química', 'quimica', 'reacción', 'reaccion', 'elemento', 'molécula', 'molecula', 'átomo', 'atomo', 'ion', 'compuesto'],
            'Biología' => ['biología', 'biologia', 'célula', 'celula', 'gen', 'proteína', 'proteina', 'enzima', 'evolución', 'evolucion', 'organismo'],

            // Humanidades
            'Historia' => ['historia', 'histórico', 'historico', 'época', 'epoca', 'civilización', 'civilizacion', 'imperio', 'guerra', 'revolución', 'revolucion'],
            'Literatura' => ['literatura', 'literario', 'libro', 'novela', 'poema', 'poesía', 'poesia', 'autor', 'escritor'],
            'Lengua' => ['lengua', 'gramática', 'gramatica', 'ortografía', 'ortografia', 'sintaxis', 'verbo', 'sustantivo', 'adjetivo'],

            // Tecnología
            'Programación' => ['programación', 'programacion', 'código', 'codigo', 'python', 'javascript', 'java', 'función', 'funcion', 'algoritmo', 'loop', 'variable'],
            'Bases de Datos' => ['base de datos', 'sql', 'tabla', 'consulta', 'relación', 'relacion', 'primary key'],
            'Redes' => ['red', 'internet', 'protocolo', 'ip', 'servidor', 'cliente', 'conexión', 'conexion'],
        ];

        // 4. Contar frecuencia de palabras clave por tema
        $frecuenciasTemas = [];

        foreach ($temasMap as $tema => $palabras_clave) {
            $conteo = 0;
            foreach ($palabras_clave as $palabra) {
                $conteo += substr_count($enunciadosJuntos, $palabra);
            }
            if ($conteo > 0) {
                $frecuenciasTemas[$tema] = $conteo;
            }
        }

        // 5. Si no detecta temas, retornar vacío (fallback a título evaluación)
        if (empty($frecuenciasTemas)) {
            return [];
        }

        // 6. Ordenar por frecuencia (temas principales primero)
        arsort($frecuenciasTemas);

        // 7. Retornar solo los top 2-3 temas con mayor frecuencia
        $temasDetectados = [];
        $topTemas = array_slice($frecuenciasTemas, 0, 3); // Top 3 temas

        foreach ($topTemas as $tema => $frecuencia) {
            $relevancia = min(1.0, $frecuencia / 10); // Normalizar relevancia 0-1
            $temasDetectados[$tema] = $relevancia;
        }

        \Log::info('✓ Contexto general analizado', [
            'temas_detectados' => array_keys($temasDetectados),
            'frecuencias' => $topTemas,
            'respuestas_incorrectas' => count($respuestasIncorrectas),
        ]);

        return $temasDetectados;
    }

    /**
     * Determinar tema para una pregunta usando jerarquía inteligente
     *
     * Jerarquía de prioridad:
     * 1. Campo 'tema' explícito de la pregunta (más específico)
     * 2. Extraer del enunciado de la pregunta (palabras clave)
     * 3. Título de la evaluación (fallback más genérico)
     *
     * @param $pregunta Pregunta
     * @param $evaluacion Evaluacion
     * @return string Tema determinado
     */
    protected function determineTemaForPregunta($pregunta, $evaluacion): string
    {
        // 1. PRIORIDAD 1: Campo tema explícito
        if (!empty($pregunta->tema)) {
            return $pregunta->tema;
        }

        // 2. PRIORIDAD 2: Extraer del enunciado usando palabras clave
        $temaExtraido = $this->extractTemaFromEnunciado($pregunta->enunciado);
        if (!empty($temaExtraido)) {
            return $temaExtraido;
        }

        // 3. PRIORIDAD 3: Usar título de la evaluación
        if (!empty($evaluacion->contenido->titulo)) {
            return $evaluacion->contenido->titulo;
        }

        // Fallback final
        return 'General';
    }

    /**
     * Extraer tema del enunciado usando palabras clave
     *
     * @param string $enunciado
     * @return string|null Tema encontrado o null
     */
    protected function extractTemaFromEnunciado(string $enunciado): ?string
    {
        $enunciado = strtolower($enunciado);

        // Mapeo de palabras clave por tema
        $temasMap = [
            // Matemáticas
            'Álgebra' => ['álgebra', 'algebra', 'ecuación', 'ecuacion', 'polinomio', 'factor', 'variable'],
            'Geometría' => ['geometría', 'geometria', 'triángulo', 'triangulo', 'círculo', 'circulo', 'área', 'area', 'perímetro', 'perimetro'],
            'Cálculo' => ['cálculo', 'calculo', 'derivada', 'integral', 'límite', 'limite', 'función', 'funcion'],
            'Trigonometría' => ['trigonometría', 'trigonometria', 'seno', 'coseno', 'tangente', 'ángulo', 'angulo'],
            'Estadística' => ['estadística', 'estadistica', 'probabilidad', 'media', 'desviación', 'distribucion', 'varianza'],

            // Ciencias
            'Física' => ['física', 'fisica', 'velocidad', 'aceleración', 'aceleracion', 'fuerza', 'energía', 'energia', 'movimiento', 'Newton'],
            'Química' => ['química', 'quimica', 'reacción', 'reaccion', 'elemento', 'molécula', 'molecula', 'átomo', 'atomo', 'ion', 'compuesto'],
            'Biología' => ['biología', 'biologia', 'célula', 'celula', 'gen', 'proteína', 'proteina', 'enzima', 'evolución', 'evolucion', 'organismo'],

            // Humanidades
            'Historia' => ['historia', 'histórico', 'historico', 'época', 'epoca', 'civilización', 'civilizacion', 'imperio', 'guerra', 'revolución', 'revolucion'],
            'Literatura' => ['literatura', 'literario', 'libro', 'novela', 'poema', 'poesía', 'poesia', 'autor', 'escritor'],
            'Lengua' => ['lengua', 'gramática', 'gramatica', 'ortografía', 'ortografia', 'sintaxis', 'verbo', 'sustantivo', 'adjetivo'],

            // Tecnología
            'Programación' => ['programación', 'programacion', 'código', 'codigo', 'python', 'javascript', 'java', 'función', 'funcion', 'algoritmo', 'loop', 'variable'],
            'Bases de Datos' => ['base de datos', 'sql', 'tabla', 'consulta', 'relación', 'relacion', 'primary key'],
            'Redes' => ['red', 'internet', 'protocolo', 'ip', 'servidor', 'cliente', 'conexión', 'conexion'],
        ];

        // Buscar coincidencias
        foreach ($temasMap as $tema => $palabras_clave) {
            foreach ($palabras_clave as $palabra) {
                if (strpos($enunciado, $palabra) !== false) {
                    return $tema;
                }
            }
        }

        return null;
    }
}
