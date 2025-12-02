<?php

namespace App\Services;

use App\Models\IntentosEvaluacion;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

/**
 * Servicio de Análisis de Evaluaciones con Agente IA
 *
 * Integra el Agente IA (FastAPI en puerto 8003) para generar análisis inteligentes
 * sobre el desempeño del estudiante en evaluaciones usando GROQ/Claude.
 *
 * Flujo:
 * 1. Obtener datos del intento de evaluación (puntaje, áreas débiles, áreas fuertes)
 * 2. Extraer contexto de la evaluación (asignatura, dificultad)
 * 3. Enviar a POST http://localhost:8003/analyze_evaluation
 * 4. Recibir respuesta con recomendaciones personalizadas del agente
 * 5. Guardar análisis en recomendaciones_ia
 * 6. Mostrar en dashboard del estudiante
 */
class StudentEvaluationAnalysisService
{
    private string $agentBaseUrl;
    private int $agentPort = 8003;
    private string $agentHost = 'localhost';

    public function __construct()
    {
        $this->agentHost = config('app.agent_host', 'localhost');
        $this->agentPort = config('app.agent_port', 8003);
        $this->agentBaseUrl = "http://{$this->agentHost}:{$this->agentPort}";
    }

    /**
     * Generar análisis inteligente del intento de evaluación
     *
     * @param IntentosEvaluacion $intento
     * @return array Análisis generado por el agente
     */
    public function analizarEvaluacion(IntentosEvaluacion $intento): array
    {
        try {
            Log::info("=== AGENTE: Iniciando análisis de evaluación ===", [
                'intento_id' => $intento->id,
                'evaluacion_id' => $intento->evaluacion_id,
                'estudiante_id' => $intento->estudiante_id,
            ]);

            // Obtener estudiante y evaluación
            $estudiante = $intento->estudiante;
            $evaluacion = $intento->evaluacion;
            $contenido = $evaluacion->contenido;

            if (!$estudiante || !$evaluacion) {
                Log::warning("Datos incompletos para análisis", [
                    'intento_id' => $intento->id,
                ]);
                return $this->getAnalisisDefault($intento);
            }

            // Extraer datos del intento
            $datosEvaluacion = $this->extraerDatosEvaluacion($intento, $estudiante, $contenido);

            // Generar análisis con el agente
            $analisis = $this->generarConAgente($estudiante, $datosEvaluacion);

            // Guardar análisis en BD
            $intento->update([
                'recomendaciones_ia' => json_encode($analisis),
            ]);

            Log::info("✅ Análisis de evaluación generado exitosamente", [
                'intento_id' => $intento->id,
                'estudiante_id' => $estudiante->id,
                'analisis_length' => strlen($analisis['analisis'] ?? ''),
            ]);

            return $analisis;

        } catch (\Exception $e) {
            Log::error("Error generando análisis de evaluación: {$e->getMessage()}", [
                'intento_id' => $intento->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->getAnalisisDefault($intento);
        }
    }

    /**
     * Extraer datos relevantes del intento de evaluación
     */
    private function extraerDatosEvaluacion(IntentosEvaluacion $intento, User $estudiante, $contenido): array
    {
        return [
            'estudiante_nombre' => $estudiante->nombre_completo,
            'estudiante_grado' => $estudiante->grado ?? '6to',
            'asignatura' => $contenido->titulo ?? 'Evaluación General',
            'puntaje_obtenido' => $intento->puntaje_obtenido,
            'puntaje_total' => $intento->evaluacion->puntuacion_total ?? 100,
            'porcentaje_acierto' => $intento->porcentaje_acierto,
            'dificultad_detectada' => $intento->dificultad_detectada,
            'areas_debilidad' => is_array($intento->areas_debilidad)
                ? $intento->areas_debilidad
                : json_decode($intento->areas_debilidad ?? '[]', true),
            'areas_fortaleza' => is_array($intento->areas_fortaleza)
                ? $intento->areas_fortaleza
                : json_decode($intento->areas_fortaleza ?? '[]', true),
            'tiempo_empleado' => $intento->tiempo_total ?? 0,
            'numero_intento' => $intento->numero_intento ?? 1,
        ];
    }

    /**
     * Generar análisis usando el Agente IA (FastAPI en puerto 8003)
     */
    private function generarConAgente(User $estudiante, array $datosEvaluacion): array
    {
        Log::info("Enviando solicitud de análisis al Agente IA", [
            'estudiante_id' => $estudiante->id,
            'agent_url' => "{$this->agentBaseUrl}/analyze_evaluation",
        ]);

        try {
            // Preparar payload para el agente
            $payload = [
                'student_id' => $estudiante->id,
                'evaluation_data' => [
                    'asignatura' => $datosEvaluacion['asignatura'],
                    'puntaje_obtenido' => $datosEvaluacion['puntaje_obtenido'],
                    'puntaje_total' => $datosEvaluacion['puntaje_total'],
                    'porcentaje_acierto' => $datosEvaluacion['porcentaje_acierto'],
                    'numero_intento' => $datosEvaluacion['numero_intento'],
                ],
                'academic_context' => [
                    'student_name' => $datosEvaluacion['estudiante_nombre'],
                    'grado' => $datosEvaluacion['estudiante_grado'],
                    'dificultad_detectada' => $datosEvaluacion['dificultad_detectada'],
                ],
                'areas_debilidad' => $datosEvaluacion['areas_debilidad'],
                'areas_fortaleza' => $datosEvaluacion['areas_fortaleza'],
                'context' => 'evaluation_analysis'
            ];

            Log::debug("Payload de análisis enviado al agente:", $payload);

            // Llamar al endpoint de análisis del agente
            $response = Http::timeout(30)
                ->post("{$this->agentBaseUrl}/analyze_evaluation", $payload);

            if (!$response->successful()) {
                throw new \Exception("Agent API error: {$response->status()} - {$response->body()}");
            }

            $data = $response->json();

            Log::info("Respuesta del Agente recibida", [
                'estudiante_id' => $estudiante->id,
                'has_analysis' => isset($data['analysis']),
            ]);

            // Parsear respuesta del agente
            return $this->parsearRespuestaAgente($data);

        } catch (\Exception $e) {
            Log::error("Error llamando al Agente IA: {$e->getMessage()}", [
                'agent_url' => $this->agentBaseUrl,
                'estudiante_id' => $estudiante->id,
            ]);
            throw $e;
        }
    }

    /**
     * Parsear respuesta del Agente IA
     * Convierte la respuesta del agente al formato esperado
     */
    private function parsearRespuestaAgente(array $data): array
    {
        try {
            // Extraer análisis principal
            $analisis = $data['analysis'] ?? $data['synthesis'] ?? 'Análisis en proceso...';

            // Convertir análisis a string si es array
            if (is_array($analisis)) {
                $analisis = implode(' ', array_filter($analisis, 'is_string'));
                if (empty($analisis)) {
                    $analisis = 'Análisis en proceso...';
                }
            }

            // Extraer recomendaciones personalizadas
            $recomendaciones = [];
            if (isset($data['recommendations']) && is_array($data['recommendations'])) {
                $recomendaciones = $data['recommendations'];
            }

            // Extraer áreas de mejora
            $areasMejora = [];
            if (isset($data['improvement_areas']) && is_array($data['improvement_areas'])) {
                $areasMejora = $data['improvement_areas'];
            }

            // Extraer próximos pasos
            $proximosPasos = [];
            if (isset($data['next_steps']) && is_array($data['next_steps'])) {
                $proximosPasos = $data['next_steps'];
            }

            // Si no hay próximos pasos, generar algunos por defecto
            if (empty($proximosPasos)) {
                $proximosPasos = $this->generarProximosPasos($data, $recomendaciones);
            }

            return [
                'analisis' => $analisis,
                'recomendaciones' => array_slice($recomendaciones, 0, 3),
                'areas_mejora' => array_slice($areasMejora, 0, 3),
                'proximos_pasos' => $proximosPasos,
                'fecha_analisis' => now()->toIso8601String(),
            ];

        } catch (\Exception $e) {
            Log::warning("Error parseando respuesta del agente: {$e->getMessage()}");
            return $this->getAnalisisDefault(null);
        }
    }

    /**
     * Generar próximos pasos prácticos
     */
    private function generarProximosPasos(array $data, array $recomendaciones): array
    {
        $pasos = [];

        // Paso 1: Revisión inmediata
        $pasos[] = "Revisa los temas donde tuviste dificultad esta semana (2-3 horas)";

        // Paso 2: Práctica adicional
        if (!empty($recomendaciones)) {
            $pasos[] = "Practica ejercicios adicionales en: " . $recomendaciones[0];
        } else {
            $pasos[] = "Realiza prácticas adicionales en los temas débiles";
        }

        // Paso 3: Preparación para próximo intento
        $pasos[] = "Prepárate para el próximo intento focalizándote en las áreas identificadas";

        return $pasos;
    }

    /**
     * Análisis por defecto si algo falla
     */
    private function getAnalisisDefault(?IntentosEvaluacion $intento = null): array
    {
        $asignatura = $intento ? ($intento->evaluacion->contenido->titulo ?? 'Evaluación') : 'Evaluación';
        $puntaje = $intento ? $intento->porcentaje_acierto : 0;

        return [
            'analisis' => "Tu evaluación de {$asignatura} ha sido registrada. Estamos procesando tu análisis detallado para proporcionarte recomendaciones personalizadas sobre las áreas de mejora y cómo fortalecer tus conocimientos.",
            'recomendaciones' => [
                'Dedica tiempo extra a los temas más difíciles',
                'Forma grupos de estudio con compañeros',
                'Utiliza recursos online para reforzar conceptos',
            ],
            'areas_mejora' => [
                'Comprensión de conceptos clave',
                'Aplicación práctica de la teoría',
                'Resolución de problemas complejos',
            ],
            'proximos_pasos' => [
                'Semana 1: Revisar los temas con menor desempeño',
                'Semana 2-3: Realizar prácticas adicionales',
                'Mes siguiente: Prepararse para el próximo intento',
            ],
            'fecha_analisis' => now()->toIso8601String(),
        ];
    }
}
