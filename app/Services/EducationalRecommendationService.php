<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Support\Facades\Log;
use App\Models\StudentRecommendation;
use App\Models\EducationalResource;
use Exception;

/**
 * Servicio para obtener recomendaciones educativas personalizadas
 *
 * ARQUITECTURA DE 3 CAPAS CON AGENTE INDEPENDIENTE
 *
 * Capa 1 (Presentacion): Controllers/Routes (Laravel)
 * Capa 2 (Servicios): Este servicio + Agente Independiente
 * Capa 3 (Datos): Database + Models (Eloquent)
 *
 * FLUJO:
 * 1. Laravel obtiene datos del estudiante (BD)
 * 2. Opcionalmente llama ML API para predicciones (puerto 8001)
 * 3. Llama AGENTE INDEPENDIENTE para generar recomendaciones (puerto 8002)
 * 4. Guarda recomendaciones en BD
 *
 * El AGENTE es INDEPENDIENTE y NO depende de ML API
 */
class EducationalRecommendationService
{
    protected $client;
    protected $mlApiUrl;        // ML API (Predicciones) - Puerto 8001
    protected $agentApiUrl;     // Agente Independiente - Puerto 8002
    protected $timeout;
    protected $retries;
    protected $mlPredictionService;

    /**
     * Constructor del servicio
     *
     * Inicializa las URLs de ambos servicios independientes
     */
    public function __construct()
    {
        // Capa 1: ML API (OPCIONAL - solo para predicciones)
        $this->mlApiUrl = env('ML_SERVICE_URL', 'http://localhost:8001');

        // Capa 2: Agente Independiente (REQUERIDO - para recomendaciones)
        $this->agentApiUrl = env('AGENT_SERVICE_URL', 'http://localhost:8002');

        $this->timeout = env('ML_HTTP_TIMEOUT', 300);
        $this->retries = env('ML_RETRIES', 3);

        $this->client = new Client([
            'timeout' => $this->timeout,
            'connect_timeout' => 5,
        ]);

        $this->mlPredictionService = new MLPredictionService();

        Log::info('EducationalRecommendationService inicializado', [
            'ml_api_url' => $this->mlApiUrl,
            'agent_api_url' => $this->agentApiUrl,
            'timeout' => $this->timeout,
        ]);
    }

    /**
     * Obtener recomendaciones personalizadas para un estudiante
     *
     * Combina datos académicos y predicciones ML para generar
     * recomendaciones contextuales usando el Agente IA
     *
     * @param int $studentId ID del estudiante
     * @return array Recomendaciones con tipo, urgencia, acciones, recursos
     * @throws Exception Si hay error en la generación de recomendaciones
     */
    public function getRecommendations(int $studentId): array
    {
        try {
            Log::info('Obteniendo recomendaciones', ['student_id' => $studentId]);

            // Obtener datos del estudiante
            $studentData = $this->getStudentData($studentId);

            if (!$studentData) {
                throw new Exception("No se encontraron datos para el estudiante {$studentId}");
            }

            Log::info('Datos del estudiante obtenidos', [
                'student_id' => $studentId,
                'name' => $studentData['name'],
            ]);

            // Obtener predicciones ML
            $predictions = $this->getStudentPredictions($studentId, $studentData);

            Log::info('Predicciones ML obtenidas', [
                'student_id' => $studentId,
                'risk_level' => $predictions['risk_level'] ?? 'UNKNOWN',
            ]);

            // Llamar al endpoint de recomendaciones
            $recommendations = $this->fetchRecommendations($studentData, $predictions);

            Log::info('Recomendaciones generadas exitosamente', [
                'student_id' => $studentId,
                'recommendation_type' => $recommendations['recommendation_type'] ?? 'unknown',
            ]);

            return $recommendations;

        } catch (Exception $e) {
            Log::error('Error obteniendo recomendaciones', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Obtener recomendaciones y guardar en BD
     *
     * Genera recomendaciones y las persiste en la tabla student_recommendations
     *
     * @param int $studentId ID del estudiante
     * @return array Recomendaciones con ID guardado en BD
     */
    public function getAndSaveRecommendations(int $studentId): array
    {
        try {
            // Obtener recomendaciones
            $recommendations = $this->getRecommendations($studentId);

            // Guardar en BD
            $savedRecommendation = $this->saveToDatabase($studentId, $recommendations);

            // Agregar ID guardado a respuesta
            $recommendations['id'] = $savedRecommendation->id;
            $recommendations['saved_at'] = $savedRecommendation->created_at->toIso8601String();

            Log::info('Recomendaciones guardadas en BD', [
                'student_id' => $studentId,
                'recommendation_id' => $savedRecommendation->id,
            ]);

            return $recommendations;

        } catch (Exception $e) {
            Log::error('Error guardando recomendaciones', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Obtener datos académicos del estudiante desde la BD
     *
     * Consulta datos reales del estudiante:
     * - Información personal (nombre, email)
     * - Calificaciones recientes y análisis estadístico
     * - Trabajos entregados y en progreso
     * - Métricas de entrega y consultas de material
     *
     * @param int $studentId
     * @return array|null
     */
    protected function getStudentData(int $studentId): ?array
    {
        try {
            // Obtener usuario estudiante
            $student = \App\Models\User::find($studentId);

            if (!$student || !$student->esEstudiante()) {
                Log::warning('Usuario no encontrado o no es estudiante', [
                    'student_id' => $studentId,
                ]);
                return null;
            }

            // Obtener trabajos del estudiante con sus calificaciones
            $trabajos = $student->trabajos()
                ->with('calificacion')
                ->get();

            if ($trabajos->isEmpty()) {
                Log::warning('Estudiante sin trabajos registrados', [
                    'student_id' => $studentId,
                ]);
                return null;
            }

            // Extraer calificaciones
            $calificaciones = $trabajos
                ->filter(fn($t) => $t->calificacion !== null)
                ->map(fn($t) => $t->calificacion->puntaje)
                ->toArray();

            // Calcular estadísticas académicas
            $num_calificaciones = count($calificaciones);
            $current_grade = !empty($calificaciones) ? end($calificaciones) : 0;
            $promedio = !empty($calificaciones) ? array_sum($calificaciones) / count($calificaciones) : 0;

            // Calcular varianza (para detectar inconsistencia en el desempeño)
            $varianza = 0;
            if (!empty($calificaciones)) {
                $sum_squared_diff = array_sum(array_map(fn($x) => pow($x - $promedio, 2), $calificaciones));
                $varianza = $sum_squared_diff / count($calificaciones);
            }

            // Obtener trabajos entregados
            $trabajos_entregados = $trabajos->filter(fn($t) => $t->estaEntregado() || $t->estaCalificado())->count();
            $num_trabajos = $trabajos->count();

            // Calcular días promedio de entrega
            $dias_entrega = $trabajos
                ->filter(fn($t) => $t->fecha_entrega && $t->fecha_inicio)
                ->map(function($t) {
                    $dias = $t->fecha_entrega->diffInDays($t->fecha_inicio);
                    return $dias;
                })
                ->toArray();

            $dias_promedio_entrega = !empty($dias_entrega) ? array_sum($dias_entrega) / count($dias_entrega) : 0;

            // Obtener promedio de consultas de material
            $consultas_material = $trabajos->map(fn($t) => $t->consultas_material ?? 0)->toArray();
            $promedio_consultas = !empty($consultas_material) ? array_sum($consultas_material) / count($consultas_material) : 0;

            // Obtener intentos promedio
            $intentos = $trabajos->map(fn($t) => $t->intentos ?? 0)->toArray();
            $promedio_intentos = !empty($intentos) ? array_sum($intentos) / count($intentos) : 0;

            // Obtener cursos del estudiante
            $cursos = $student->cursosComoEstudiante()->pluck('nombre')->toArray();
            $subject = !empty($cursos) ? $cursos[0] : 'General';

            $studentData = [
                'student_id' => $studentId,
                'name' => $student->name,
                'email' => $student->email,
                'subject' => $subject,
                'current_grade' => round($current_grade, 2),
                'previous_average' => round($promedio, 2),
                'average_variance' => round($varianza, 2),
                'num_calificaciones' => $num_calificaciones,
                'num_trabajos' => $num_trabajos,
                'trabajos_entregados' => $trabajos_entregados,
                'dias_promedio_entrega' => round($dias_promedio_entrega, 2),
                'promedio_consultas_material' => round($promedio_consultas, 2),
                'promedio_intentos' => round($promedio_intentos, 2),
                'min_grade' => !empty($calificaciones) ? min($calificaciones) : 0,
                'max_grade' => !empty($calificaciones) ? max($calificaciones) : 0,
            ];

            Log::info('Datos del estudiante obtenidos correctamente', [
                'student_id' => $studentId,
                'num_trabajos' => $num_trabajos,
                'promedio' => $promedio,
            ]);

            return $studentData;

        } catch (Exception $e) {
            Log::error('Error obteniendo datos del estudiante', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return null;
        }
    }

    /**
     * Obtener predicciones ML para el estudiante
     *
     * Llama a todos los endpoints de predicción de la ML API
     *
     * @param int $studentId
     * @param array $studentData
     * @return array Predicciones combinadas
     */
    protected function getStudentPredictions(int $studentId, array $studentData): array
    {
        try {
            $predictions = [
                'risk_score' => 0.5,
                'risk_level' => 'MEDIUM',
                'projected_grade' => 7.0,
                'trend' => 'stable',
                'confidence' => 0.7,
            ];

            // Llamar a predicción de riesgo
            try {
                $riskPrediction = $this->mlPredictionService->predictRisk($studentData);
                $predictions['risk_score'] = $riskPrediction['risk_score'] ?? 0.5;
                $predictions['risk_level'] = $riskPrediction['risk_level'] ?? 'MEDIUM';
                $predictions['confidence'] = $riskPrediction['confidence'] ?? 0.7;
            } catch (Exception $e) {
                Log::warning('Error obteniendo predicción de riesgo', ['error' => $e->getMessage()]);
            }

            // Llamar a predicción de tendencia
            try {
                $trendPrediction = $this->mlPredictionService->predictTrend($studentData);
                $predictions['trend'] = $trendPrediction['trend'] ?? 'stable';
            } catch (Exception $e) {
                Log::warning('Error obteniendo predicción de tendencia', ['error' => $e->getMessage()]);
            }

            // Llamar a análisis de progreso
            try {
                $progressPrediction = $this->mlPredictionService->predictProgress($studentData);
                $predictions['projected_grade'] = $progressPrediction['projected_grade'] ?? 7.0;
            } catch (Exception $e) {
                Log::warning('Error obteniendo análisis de progreso', ['error' => $e->getMessage()]);
            }

            return $predictions;

        } catch (Exception $e) {
            Log::error('Error obteniendo predicciones', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);

            // Retornar predicciones por defecto
            return [
                'risk_score' => 0.5,
                'risk_level' => 'MEDIUM',
                'projected_grade' => 7.0,
                'trend' => 'stable',
                'confidence' => 0.7,
            ];
        }
    }

    /**
     * Llamar al endpoint /recommendations de la ML API
     *
     * @param array $studentData
     * @param array $predictions
     * @return array Recomendaciones
     * @throws Exception
     */
    protected function fetchRecommendations(array $studentData, array $predictions): array
    {
        /**
         * ARQUITECTURA DE 3 CAPAS - CAPA 2 (SERVICIOS)
         *
         * Este método llama al AGENTE INDEPENDIENTE (puerto 8002)
         * El Agente NO depende de ML API - funciona independientemente
         *
         * Flujo:
         * 1. Prepara datos del estudiante
         * 2. Prepara predicciones ML (pueden ser null)
         * 3. Llama Agente Independiente en puerto 8002
         * 4. Retorna recomendaciones generadas con IA
         */

        $attempt = 0;
        $lastError = null;

        while ($attempt < $this->retries) {
            try {
                $attempt++;

                Log::info('Llamando AGENTE INDEPENDIENTE /generate', [
                    'intento' => $attempt,
                    'student_id' => $studentData['student_id'],
                    'agent_url' => $this->agentApiUrl,
                ]);

                // Preparar datos para el agente con información enriquecida
                // Mapear métricas reales a categorías comprensibles para el agente
                $assignment_timeliness = $studentData['dias_promedio_entrega'] <= 1 ? 'on-time'
                    : ($studentData['dias_promedio_entrega'] <= 3 ? 'slightly-late' : 'late');

                $material_consultation = $studentData['promedio_consultas_material'] < 1 ? 'low'
                    : ($studentData['promedio_consultas_material'] < 3 ? 'medium' : 'high');

                $payload = [
                    'student_data' => [
                        'student_name' => $studentData['name'] ?? 'Unknown',
                        'student_id' => $studentData['student_id'],
                        'email' => $studentData['email'],
                        'subject' => $studentData['subject'] ?? 'General',
                        'current_grade' => $studentData['current_grade'] ?? 0.0,
                        'previous_average' => $studentData['previous_average'] ?? 0.0,
                        'min_grade' => $studentData['min_grade'] ?? 0.0,
                        'max_grade' => $studentData['max_grade'] ?? 0.0,
                        'grade_variance' => $studentData['average_variance'] ?? 0.0,
                        'num_completed_assignments' => $studentData['trabajos_entregados'] ?? 0,
                        'num_total_assignments' => $studentData['num_trabajos'] ?? 0,
                        'num_grades' => $studentData['num_calificaciones'] ?? 0,
                        'average_attempts' => $studentData['promedio_intentos'] ?? 0.0,
                        'assignment_submission_timeliness' => $assignment_timeliness,
                        'average_delivery_days' => round($studentData['dias_promedio_entrega'] ?? 0, 2),
                        'material_consultation_frequency' => $material_consultation,
                        'average_material_consultations' => round($studentData['promedio_consultas_material'] ?? 0, 2),
                    ],
                    'predictions' => [
                        'risk_level' => $predictions['risk_level'] ?? 'medium',
                        'risk_score' => $predictions['risk_score'] ?? 0.5,
                        'trend' => $predictions['trend'] ?? 'stable',
                        'confidence' => $predictions['confidence'] ?? 0.8,
                        'projected_grade' => $predictions['projected_grade'] ?? $studentData['previous_average'] ?? 0.0,
                    ]
                ];

                // Llamar al AGENTE INDEPENDIENTE en puerto 8002
                $response = $this->client->post(
                    "{$this->agentApiUrl}/generate",
                    [
                        'json' => $payload,
                        'headers' => [
                            'Content-Type' => 'application/json',
                        ],
                        'timeout' => 30,  // Timeout más corto para agente
                    ]
                );

                // Decodificar respuesta
                $result = json_decode($response->getBody(), true);

                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception('JSON inválido: ' . json_last_error_msg());
                }

                Log::info('Recomendaciones generadas por AGENTE INDEPENDIENTE', [
                    'student_id' => $studentData['student_id'],
                    'status' => $result['status'] ?? 'unknown',
                ]);

                return $result['recommendations'] ?? $result;

            } catch (ConnectException $e) {
                $lastError = $e;
                Log::warning('Conexión rechazada al AGENTE INDEPENDIENTE', [
                    'intento' => $attempt,
                    'error' => $e->getMessage(),
                    'agent_url' => $this->agentApiUrl,
                ]);

                if ($attempt < $this->retries) {
                    sleep(2);
                }

            } catch (GuzzleException $e) {
                $lastError = $e;
                Log::error('Error HTTP en AGENTE INDEPENDIENTE', [
                    'intento' => $attempt,
                    'error' => $e->getMessage(),
                    'response' => $e->getResponse()?->getBody(),
                ]);

                if ($attempt < $this->retries) {
                    sleep(2);
                }

            } catch (Exception $e) {
                $lastError = $e;
                Log::error('Error inesperado en /recommendations', [
                    'intento' => $attempt,
                    'error' => $e->getMessage(),
                ]);

                if ($attempt < $this->retries) {
                    sleep(2);
                }
            }
        }

        // FALLBACK: Si el Agente falla, generar recomendación basada en predicciones
        Log::warning('Activando fallback de recomendaciones', [
            'student_id' => $studentData['student_id'],
            'reason' => 'Agent service unavailable',
            'last_error' => $lastError ? $lastError->getMessage() : 'Error desconocido',
        ]);

        return $this->generateFallbackRecommendation($studentData, $predictions);
    }

    /**
     * Generar recomendación de fallback cuando el Agente no está disponible
     *
     * Genera recomendaciones inteligentes basadas en:
     * - Risk level (alto riesgo = intervención)
     * - Trend (declinando = tutoría urgente)
     * - Varianza de notas (inconsistente = recursos de estudio)
     * - Entrega de trabajos (tarde = mejora de tiempo)
     *
     * @param array $studentData Datos del estudiante
     * @param array $predictions Predicciones del ML
     * @return array Recomendación generada
     */
    protected function generateFallbackRecommendation(array $studentData, array $predictions): array
    {
        $riskLevel = strtoupper($predictions['risk_level'] ?? 'MEDIUM');
        $riskScore = $predictions['risk_score'] ?? 0.5;
        $trend = strtolower($predictions['trend'] ?? 'stable');
        $variance = $studentData['average_variance'] ?? 0;
        $avgDeliveryDays = $studentData['dias_promedio_entrega'] ?? 0;

        Log::info('Generando recomendación de fallback', [
            'student_id' => $studentData['student_id'],
            'risk_level' => $riskLevel,
            'risk_score' => $riskScore,
            'trend' => $trend,
        ]);

        // Determinar tipo de recomendación basado en riesgo
        if ($riskLevel === 'HIGH' || $riskScore > 0.7) {
            $type = 'intervention';
            $urgency = 'immediate';
            $reason = "Alto riesgo de bajo desempeño detectado (score: {$riskScore}). Se recomienda intervención inmediata con tutoría especializada y seguimiento frecuente.";
        } elseif ($trend === 'declining' || ($variance > 30 && $riskScore > 0.5)) {
            $type = 'tutoring';
            $urgency = 'normal';
            $reason = "Tendencia declinante o desempeño inconsistente detectado. La tutoría personalizada ayudará a estabilizar el aprendizaje.";
        } elseif ($avgDeliveryDays > 3) {
            $type = 'study_resource';
            $urgency = 'preventive';
            $reason = "Entrega de trabajos frecuentemente tarde. Se recomiendan recursos de gestión de tiempo y técnicas de estudio.";
        } else {
            $type = 'enrichment';
            $urgency = 'preventive';
            $reason = "Para mantener el desempeño actual, se recomiendan recursos de enriquecimiento en áreas de interés.";
        }

        $recommendation = [
            'recommendation_type' => $type,
            'urgency' => $urgency,
            'subject' => $studentData['subject'] ?? 'General',
            'reason' => $reason,
            'risk_score' => $riskScore,
            'risk_level' => $riskLevel,
            'actions' => $this->generateFallbackActions($type, $studentData),
            'resources' => $this->generateFallbackResources($type),
            'fallback' => true, // Indicador de que es una recomendación de fallback
            'generated_at' => now()->toIso8601String(),
        ];

        Log::info('Recomendación de fallback generada', [
            'student_id' => $studentData['student_id'],
            'type' => $type,
            'urgency' => $urgency,
        ]);

        return $recommendation;
    }

    /**
     * Generar acciones recomendadas para fallback
     *
     * @param string $type Tipo de recomendación
     * @param array $studentData Datos del estudiante
     * @return array Acciones recomendadas
     */
    private function generateFallbackActions(string $type, array $studentData): array
    {
        $actions = [
            'intervention' => [
                'Contactar al estudiante dentro de 24 horas',
                'Evaluar causas raíz del bajo desempeño',
                'Establecer plan de recuperación personalizado',
                'Realizar seguimiento semanal',
                'Involucrar a padres/acudientes si es necesario',
            ],
            'tutoring' => [
                'Agendar sesiones de tutoría 2-3 veces por semana',
                'Enfocarse en temas críticos donde hay debilidad',
                'Monitorear progreso mediante mini evaluaciones',
                'Ajustar estrategias de enseñanza según respuesta',
            ],
            'study_resource' => [
                'Proporcionar guía de gestión de tiempo',
                'Implementar sistema de recordatorios para fechas límite',
                'Usar técnicas Pomodoro para concentración',
                'Crear horario de estudio estructurado',
                'Identificar distracciones y minimizarlas',
            ],
            'enrichment' => [
                'Explorar temas avanzados de interés',
                'Proyectos de investigación independiente',
                'Mentoría con estudiantes de grados superiores',
                'Participación en actividades extracurriculares',
                'Desarrollo de habilidades de liderazgo',
            ],
        ];

        return $actions[$type] ?? $actions['study_resource'];
    }

    /**
     * Generar recursos recomendados para fallback
     *
     * @param string $type Tipo de recomendación
     * @return array Recursos recomendados
     */
    private function generateFallbackResources(string $type): array
    {
        $resources = [
            'intervention' => [
                'Plan de Intervención Académica',
                'Asesoría Psicopedagógica',
                'Seguimiento de Caso',
            ],
            'tutoring' => [
                'Sesiones de Tutoría',
                'Material Didáctico Complementario',
                'Ejercicios Prácticos',
            ],
            'study_resource' => [
                'Guía de Técnicas de Estudio',
                'Calendario de Estudios',
                'Videos Tutoriales',
                'Resúmenes de Conceptos',
            ],
            'enrichment' => [
                'Material de Lectura Avanzada',
                'Proyectos de Investigación',
                'Desafíos Académicos',
                'Recursos Multimedia',
            ],
        ];

        return $resources[$type] ?? $resources['study_resource'];
    }

    /**
     * Guardar recomendación en la BD
     *
     * @param int $studentId
     * @param array $recommendations
     * @return StudentRecommendation
     */
    protected function saveToDatabase(int $studentId, array $recommendations): StudentRecommendation
    {
        try {
            // Obtener recurso educativo si está disponible
            $resourceId = null;
            if (!empty($recommendations['resources'][0])) {
                $resource = EducationalResource::where('title', 'like', '%' . $recommendations['resources'][0] . '%')->first();
                if ($resource) {
                    $resourceId = $resource->id;
                }
            }

            // Crear recomendación
            $recommendation = StudentRecommendation::create([
                'student_id' => $studentId,
                'educational_resource_id' => $resourceId,
                'recommendation_type' => $recommendations['recommendation_type'] ?? 'tutoring',
                'urgency' => $recommendations['urgency'] ?? 'normal',
                'subject' => $recommendations['subject'] ?? 'General',
                'reason' => $recommendations['reason'] ?? json_encode($recommendations),
                'risk_score' => $recommendations['risk_score'] ?? null,
                'risk_level' => $recommendations['risk_level'] ?? null,
                'accepted' => false,
                'completed' => false,
            ]);

            Log::info('Recomendación guardada en BD', [
                'recommendation_id' => $recommendation->id,
                'student_id' => $studentId,
            ]);

            return $recommendation;

        } catch (Exception $e) {
            Log::error('Error guardando recomendación en BD', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Marcar una recomendación como aceptada
     *
     * @param int $recommendationId
     * @return bool
     */
    public function acceptRecommendation(int $recommendationId): bool
    {
        try {
            $recommendation = StudentRecommendation::findOrFail($recommendationId);
            $recommendation->update(['accepted' => true]);

            Log::info('Recomendación aceptada', [
                'recommendation_id' => $recommendationId,
                'student_id' => $recommendation->student_id,
            ]);

            return true;

        } catch (Exception $e) {
            Log::error('Error aceptando recomendación', [
                'recommendation_id' => $recommendationId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Marcar una recomendación como completada
     *
     * @param int $recommendationId
     * @param float|null $effectivenessRating Calificación de efectividad (1-5)
     * @return bool
     */
    public function completeRecommendation(int $recommendationId, ?float $effectivenessRating = null): bool
    {
        try {
            $recommendation = StudentRecommendation::findOrFail($recommendationId);

            $updateData = [
                'completed' => true,
                'completed_at' => now(),
            ];

            if ($effectivenessRating !== null && $effectivenessRating >= 1 && $effectivenessRating <= 5) {
                $updateData['effectiveness_rating'] = $effectivenessRating;
            }

            $recommendation->update($updateData);

            Log::info('Recomendación completada', [
                'recommendation_id' => $recommendationId,
                'student_id' => $recommendation->student_id,
                'effectiveness_rating' => $effectivenessRating,
            ]);

            return true;

        } catch (Exception $e) {
            Log::error('Error completando recomendación', [
                'recommendation_id' => $recommendationId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Obtener historial de recomendaciones para un estudiante
     *
     * @param int $studentId
     * @param int $limit
     * @return array
     */
    public function getStudentRecommendationHistory(int $studentId, int $limit = 10): array
    {
        try {
            $recommendations = StudentRecommendation::where('student_id', $studentId)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->with('educationalResource')
                ->get();

            return $recommendations->toArray();

        } catch (Exception $e) {
            Log::error('Error obteniendo historial de recomendaciones', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }

    /**
     * Obtener estadísticas de recomendaciones para un estudiante
     *
     * @param int $studentId
     * @return array
     */
    public function getRecommendationStats(int $studentId): array
    {
        try {
            $total = StudentRecommendation::where('student_id', $studentId)->count();
            $accepted = StudentRecommendation::where('student_id', $studentId)->where('accepted', true)->count();
            $completed = StudentRecommendation::where('student_id', $studentId)->where('completed', true)->count();
            $avgEffectiveness = StudentRecommendation::where('student_id', $studentId)
                ->whereNotNull('effectiveness_rating')
                ->avg('effectiveness_rating');

            return [
                'total_recommendations' => $total,
                'accepted' => $accepted,
                'completed' => $completed,
                'average_effectiveness' => round($avgEffectiveness ?? 0, 2),
                'acceptance_rate' => $total > 0 ? round(($accepted / $total) * 100, 2) : 0,
                'completion_rate' => $total > 0 ? round(($completed / $total) * 100, 2) : 0,
            ];

        } catch (Exception $e) {
            Log::error('Error obteniendo estadísticas de recomendaciones', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);
            return [];
        }
    }
}
