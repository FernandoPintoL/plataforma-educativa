<?php

namespace App\Services;

use App\Models\StudentHint;
use App\Models\Trabajo;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

/**
 * HintGenerator
 *
 * Servicio para generar sugerencias e hints usando método Socrático
 * Utiliza el Agent IA para crear preguntas guía y explicaciones
 */
class HintGenerator
{
    protected Client $client;
    protected string $agentUrl;
    protected FeedbackIntellicentService $feedbackService;

    public function __construct(FeedbackIntellicentService $feedbackService)
    {
        $this->feedbackService = $feedbackService;
        $this->agentUrl = env('AGENT_SERVICE_URL', 'http://localhost:8002');
        $this->client = new Client([
            'timeout' => 30,
            'connect_timeout' => 5,
        ]);
    }

    /**
     * Generar una sugerencia socrática basada en la actividad
     */
    public function generarSugerenciaSocratica(
        int $trabajoId,
        int $estudianteId,
        string $tema,
        array $respuestaEstudiante,
        array $erroresDetectados = [],
        int $nivelDificultad = 2
    ): ?StudentHint {

        $trabajo = Trabajo::find($trabajoId);
        if (!$trabajo) {
            return null;
        }

        try {
            // Construir prompt para generar preguntas guía
            $prompt = $this->construirPromptSocratico(
                $tema,
                $respuestaEstudiante,
                $erroresDetectados,
                $nivelDificultad
            );

            // Llamar al agent para generar las preguntas
            $respuestaAgent = $this->llamarAgentParaHints($prompt);

            // Crear el hint en BD
            $hint = StudentHint::create([
                'trabajo_id' => $trabajoId,
                'estudiante_id' => $estudianteId,
                'tipo_sugerencia' => 'hint_socratico',
                'contenido_sugerencia' => $respuestaAgent['contenido'] ?? '',
                'razonamiento' => $respuestaAgent['razonamiento'] ?? '',
                'tema_abordado' => $tema,
                'contexto_problema' => [
                    'respuesta_estudiante' => $respuestaEstudiante,
                    'errores_detectados' => $erroresDetectados,
                ],
                'relevancia_estimada' => $respuestaAgent['relevancia'] ?? 0.8,
                'dificultad_estimada' => $nivelDificultad / 5,
                'especificidad' => $respuestaAgent['especificidad'] ?? 0.7,
                'preguntas_guia' => $respuestaAgent['preguntas'] ?? [],
                'nivel_socracion' => $nivelDificultad,
                'estado' => 'generada',
            ]);

            Log::info('Sugerencia socrática generada', [
                'hint_id' => $hint->id,
                'tema' => $tema,
                'nivel' => $nivelDificultad,
            ]);

            return $hint;

        } catch (\Exception $e) {
            Log::error('Error generando sugerencia socrática', [
                'tema' => $tema,
                'error' => $e->getMessage(),
            ]);

            return $this->generarSugerenciaFallback($trabajoId, $estudianteId, $tema);
        }
    }

    /**
     * Generar sugerencia de recurso
     */
    public function generarSugerenciaRecurso(
        int $trabajoId,
        int $estudianteId,
        string $tema,
        array $conceptosProblemáticos = []
    ): ?StudentHint {

        $trabajo = Trabajo::find($trabajoId);
        if (!$trabajo) {
            return null;
        }

        $recursoDescripcion = $this->construirDescripcionRecurso($tema, $conceptosProblemáticos);

        $hint = StudentHint::create([
            'trabajo_id' => $trabajoId,
            'estudiante_id' => $estudianteId,
            'tipo_sugerencia' => 'recurso',
            'contenido_sugerencia' => $recursoDescripcion['contenido'],
            'razonamiento' => $recursoDescripcion['razonamiento'],
            'tema_abordado' => $tema,
            'relevancia_estimada' => 0.9,
            'dificultad_estimada' => 0.3,
            'especificidad' => 0.8,
            'estado' => 'generada',
        ]);

        return $hint;
    }

    /**
     * Generar sugerencia de motivación/ánimo
     */
    public function generarSugerenciaMotivacion(
        int $trabajoId,
        int $estudianteId,
        string $razon = 'bajo_progreso'
    ): ?StudentHint {

        $trabajo = Trabajo::find($trabajoId);
        if (!$trabajo) {
            return null;
        }

        $mensajes = [
            'bajo_progreso' => '¡Vas por buen camino! Sé que puede ser difícil, pero estás haciendo un esfuerzo. Continúa, casi lo logras.',
            'muchos_errores' => 'Los errores son parte del aprendizaje. Cada intento te acerca más a la solución. ¡Sigue adelante!',
            'inactividad' => 'Vemos que llevas un tiempo sin avanzar. ¿Necesitas un descanso? Tómate unos minutos y vuelve cuando estés listo.',
            'consistencia' => 'Has hecho un excelente trabajo siendo consistente. Este tipo de dedicación es clave para el aprendizaje.',
        ];

        $mensaje = $mensajes[$razon] ?? $mensajes['bajo_progreso'];

        $hint = StudentHint::create([
            'trabajo_id' => $trabajoId,
            'estudiante_id' => $estudianteId,
            'tipo_sugerencia' => 'motivacion',
            'contenido_sugerencia' => $mensaje,
            'razonamiento' => 'Basado en el patrón de actividad detectado',
            'relevancia_estimada' => 0.7,
            'dificultad_estimada' => 0.1,
            'especificidad' => 0.4,
            'estado' => 'generada',
        ]);

        return $hint;
    }

    /**
     * Construir prompt para método Socrático
     */
    protected function construirPromptSocratico(
        string $tema,
        array $respuestaEstudiante,
        array $erroresDetectados,
        int $nivelDificultad
    ): string {

        $respuestaTexto = json_encode($respuestaEstudiante, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $erroresTexto = implode(', ', $erroresDetectados);

        return <<<PROMPT
Generar una serie de preguntas guía usando el método Socrático para ayudar al estudiante.

TEMA: $tema
NIVEL DE DIFICULTAD: $nivelDificultad/5

RESPUESTA DEL ESTUDIANTE:
$respuestaTexto

ERRORES DETECTADOS:
$erroresTexto

INSTRUCCIONES:
1. Crear preguntas que guíen al estudiante SIN dar la respuesta directa
2. Las preguntas deben ser progresivas, comenzando fácil y aumentando complejidad
3. Usar el método Socrático: hacer que el estudiante llegue a la conclusión por sí mismo
4. Nivel $nivelDificultad: 1=muy guiado, 5=muy independiente

FORMATO DE RESPUESTA (JSON):
{
  "preguntas": [
    {"pregunta": "¿Qué es lo que se pide en el problema?", "nivel": 1},
    {"pregunta": "¿Cuál es el primer paso que deberías dar?", "nivel": 1},
    {"pregunta": "¿Ves alguna relación entre X e Y?", "nivel": 2},
    ...
  ],
  "contenido": "Resumen de cómo guiar al estudiante",
  "razonamiento": "Por qué estas preguntas ayudarán",
  "relevancia": 0.85,
  "especificidad": 0.8
}
PROMPT;
    }

    /**
     * Llamar al Agent para generar hints
     */
    protected function llamarAgentParaHints(string $prompt): array
    {
        try {
            $response = $this->client->post("{$this->agentUrl}/analyze", [
                'json' => [
                    'prompt' => $prompt,
                    'model' => env('AGENT_MODEL', 'llama-3.3-70b'),
                ],
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]);

            $resultado = json_decode($response->getBody(), true);
            return $resultado['analysis'] ?? [];

        } catch (\Exception $e) {
            Log::error('Error llamando al Agent para hints', [
                'error' => $e->getMessage(),
            ]);

            return [
                'contenido' => 'Error generando sugerencia',
                'relevancia' => 0.3,
                'especificidad' => 0.3,
            ];
        }
    }

    /**
     * Construir descripción de recurso
     */
    protected function construirDescripcionRecurso(string $tema, array $conceptos): array
    {
        $conceptosTexto = implode(', ', $conceptos);

        return [
            'contenido' => "Te recomendamos revisar el material sobre: {$conceptosTexto}. "
                . "Puedes encontrarlo en la sección de recursos del curso, o preguntar a tu profesor.",
            'razonamiento' => "Basado en los conceptos problemáticos detectados: {$conceptosTexto}",
        ];
    }

    /**
     * Generar sugerencia de fallback si hay error
     */
    protected function generarSugerenciaFallback(
        int $trabajoId,
        int $estudianteId,
        string $tema
    ): ?StudentHint {

        $hint = StudentHint::create([
            'trabajo_id' => $trabajoId,
            'estudiante_id' => $estudianteId,
            'tipo_sugerencia' => 'orientacion',
            'contenido_sugerencia' => "Para mejorar tu respuesta sobre '{$tema}', "
                . "intenta revisar los conceptos fundamentales y compara tu respuesta con los ejemplos del material.",
            'relevancia_estimada' => 0.5,
            'dificultad_estimada' => 0.5,
            'estado' => 'generada',
        ]);

        return $hint;
    }

    /**
     * Obtener sugerencias pending para un estudiante
     */
    public function obtenerSugerenciasPendientes(int $estudianteId): array
    {
        return StudentHint::where('estudiante_id', $estudianteId)
            ->where('estado', 'generada')
            ->orderBy('relevancia_estimada', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($hint) => $hint->obtenerResumen())
            ->toArray();
    }

    /**
     * Marcar sugerencia como utilizada
     */
    public function marcarComoUtilizada(int $hintId, bool $fueEfectiva = true): void
    {
        $hint = StudentHint::find($hintId);
        if ($hint) {
            $hint->marcarComoUtilizada($fueEfectiva);
        }
    }
}
