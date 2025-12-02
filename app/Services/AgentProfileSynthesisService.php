<?php

namespace App\Services;

use App\Models\User;
use App\Models\PerfilVocacional;
use App\Models\ResultadoTestVocacional;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

/**
 * Servicio de Síntesis de Perfil Vocacional con Agente
 *
 * Integra el Agente IA (FastAPI en puerto 8003) para generar síntesis inteligentes
 * y personalizadas del perfil vocacional del estudiante usando GROQ/Claude.
 *
 * Flujo:
 * 1. Obtener datos del perfil ML (intereses, aptitudes, carrera predicha)
 * 2. Convertir a formato esperado por el agente
 * 3. Enviar a POST http://localhost:8003/synthesize
 * 4. Recibir respuesta narrativa personalizada del agente
 * 5. Guardar síntesis en la BD
 * 6. Mostrar en la interfaz del estudiante
 */
class AgentProfileSynthesisService
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
     * Generar síntesis inteligente del perfil vocacional
     *
     * @param User $student
     * @param PerfilVocacional|null $perfil
     * @return array Síntesis generada por el agente
     */
    public function generarSintesisInteligente(User $student, ?PerfilVocacional $perfil = null): array
    {
        try {
            Log::info("=== AGENTE: Iniciando síntesis de perfil ===", [
                'student_id' => $student->id,
                'student_name' => $student->nombre_completo,
            ]);

            // Obtener perfil si no fue proporcionado
            if (!$perfil) {
                $perfil = PerfilVocacional::where('estudiante_id', $student->id)
                    ->latest()
                    ->first();
            }

            if (!$perfil) {
                Log::warning("No hay perfil vocacional para síntesis", [
                    'student_id' => $student->id,
                ]);
                return $this->getSintesisDefault($student);
            }

            // Obtener datos del estudiante
            $datosEstudiante = $this->extraerDatosEstudiante($student, $perfil);

            // Generar síntesis con GROQ
            $sintesis = $this->generarConGroq($student, $datosEstudiante);

            // Guardar síntesis en BD
            $perfil->update([
                'recomendaciones_personalizadas' => json_encode([
                    'sintesis_agente' => $sintesis['sintesis'],
                    'recomendaciones' => $sintesis['recomendaciones'],
                    'pasos_siguientes' => $sintesis['pasos_siguientes'],
                    'fortalezas' => $sintesis['fortalezas'],
                    'areas_mejora' => $sintesis['areas_mejora'],
                    'fecha_generacion' => now()->toIso8601String(),
                ]),
            ]);

            Log::info("✅ Síntesis agente generada exitosamente", [
                'student_id' => $student->id,
                'sintesis_length' => strlen($sintesis['sintesis']),
            ]);

            return $sintesis;

        } catch (\Exception $e) {
            Log::error("Error generando síntesis del agente: {$e->getMessage()}", [
                'student_id' => $student->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->getSintesisDefault($student);
        }
    }

    /**
     * Extraer datos relevantes del estudiante y su perfil
     */
    private function extraerDatosEstudiante(User $student, PerfilVocacional $perfil): array
    {
        $intereses = $perfil->intereses ?? [];
        $interesPrincipal = $this->obtenerInteresPrincipal($intereses);

        return [
            'nombre' => $student->nombre_completo,
            'email' => $student->email,
            'intereses' => $intereses,
            'interes_principal' => $interesPrincipal,
            'carrera_predicha' => $perfil->carrera_predicha_ml ?? 'No determinada',
            'confianza' => $perfil->confianza_prediccion ?? 0,
            'aptitudes' => $perfil->aptitudes ?? [],
            'habilidades' => $perfil->habilidades ?? [],
        ];
    }

    /**
     * Obtener el interés principal (categoría con mayor puntuación)
     */
    private function obtenerInteresPrincipal(array $intereses): string
    {
        if (empty($intereses)) {
            return 'General';
        }

        $maximo = max($intereses);
        foreach ($intereses as $nombre => $valor) {
            if ($valor === $maximo) {
                return ucfirst(str_replace('_', ' ', $nombre));
            }
        }

        return 'General';
    }

    /**
     * Generar síntesis usando el Agente IA (FastAPI en puerto 8003)
     */
    private function generarConGroq(User $student, array $datosEstudiante): array
    {
        Log::info("Enviando solicitud al Agente IA", [
            'student_id' => $student->id,
            'agent_url' => "{$this->agentBaseUrl}/synthesize",
        ]);

        try {
            // Preparar payload para el agente
            $payload = [
                'student_id' => $student->id,
                'discoveries' => [
                    'intereses' => $datosEstudiante['intereses'],
                    'interes_principal' => $datosEstudiante['interes_principal'],
                    'aptitudes' => $datosEstudiante['aptitudes'] ?? [],
                    'habilidades' => $datosEstudiante['habilidades'] ?? [],
                ],
                'predictions' => [
                    'carrera_predicha' => $datosEstudiante['carrera_predicha'],
                    'confianza' => $datosEstudiante['confianza'] ?? 0,
                    'tipo' => 'vocational_profile',
                ],
                'context' => 'vocational_profile_synthesis'
            ];

            Log::debug("Payload enviado al agente:", $payload);

            // Llamar al endpoint de síntesis del agente
            $response = Http::timeout(30)
                ->post("{$this->agentBaseUrl}/synthesize", $payload);

            if (!$response->successful()) {
                throw new \Exception("Agent API error: {$response->status()} - {$response->body()}");
            }

            $data = $response->json();

            Log::info("Respuesta del Agente recibida", [
                'student_id' => $student->id,
                'has_synthesis' => isset($data['synthesis']),
                'has_recommendations' => isset($data['recommendations']),
            ]);

            // Parsear respuesta del agente
            return $this->parsearRespuestaAgente($data);

        } catch (\Exception $e) {
            Log::error("Error llamando al Agente IA: {$e->getMessage()}", [
                'agent_url' => $this->agentBaseUrl,
                'student_id' => $student->id,
            ]);
            throw $e;
        }
    }

    /**
     * Construir prompt para el agente
     */
    private function construirPrompt(User $student, array $datos): string
    {
        $interesesFormatados = $this->formatearIntereses($datos['intereses']);

        return <<<PROMPT
Analiza el siguiente perfil vocacional de un estudiante y proporciona una síntesis inteligente y motivadora:

**Información del Estudiante:**
- Nombre: {$datos['nombre']}
- Intereses principales: {$datos['interes_principal']}

**Perfil de Aptitudes e Intereses:**
{$interesesFormatados}

**Análisis ML:**
- Carrera predicha: {$datos['carrera_predicha']}
- Nivel de confianza: {$datos['confianza']}%

**Tu tarea (en formato JSON):**
Genera una respuesta con la siguiente estructura JSON (sin markdown, JSON puro):
{{
  "sintesis": "Una síntesis narrativa de 2-3 párrafos explicando el perfil del estudiante, sus fortalezas y cómo se alinean con oportunidades de carrera",
  "recomendaciones": ["Recomendación 1", "Recomendación 2", "Recomendación 3"],
  "pasos_siguientes": ["Paso 1 para los próximos 1-3 meses", "Paso 2 para los próximos 3-6 meses", "Paso 3 para el mediano plazo"],
  "fortalezas": ["Fortaleza 1 identificada", "Fortaleza 2 identificada"],
  "areas_mejora": ["Área de mejora 1", "Área de mejora 2"]
}}

Sé motivador pero realista. Conecta los datos con oportunidades educativas reales.
PROMPT;
    }

    /**
     * Formatear intereses para el prompt
     */
    private function formatearIntereses(array $intereses): string
    {
        $formateado = "";
        foreach ($intereses as $nombre => $valor) {
            $nombreFormateado = ucfirst(str_replace('_', ' ', $nombre));
            $formateado .= "- $nombreFormateado: $valor%\n";
        }
        return $formateado;
    }

    /**
     * Parsear respuesta del Agente IA
     * Convierte la respuesta del agente al formato esperado por la UI
     */
    private function parsearRespuestaAgente(array $data): array
    {
        try {
            // El agente devuelve: synthesis, reasoning, recommendations, reasoning_steps
            // Necesitamos convertir a: sintesis, recomendaciones, pasos_siguientes, fortalezas, areas_mejora

            $sintesis = $data['synthesis'] ?? $data['reasoning'] ?? 'Perfil vocacional en análisis...';

            // Convertir sintesis a string si es array
            if (is_array($sintesis)) {
                $sintesis = implode(' ', array_filter($sintesis, 'is_string'));
                if (empty($sintesis)) {
                    $sintesis = 'Perfil vocacional en análisis...';
                }
            }

            // Extraer recomendaciones de la respuesta del agente
            $recomendaciones = [];
            if (isset($data['recommendations']) && is_array($data['recommendations'])) {
                $recomendaciones = $data['recommendations'];
            }

            // Extraer pasos del razonamiento
            $pasosRazonamiento = [];
            if (isset($data['reasoning_steps']) && is_array($data['reasoning_steps'])) {
                $pasosRazonamiento = $data['reasoning_steps'];
            }

            // Convertir a pasos siguientes más prácticos
            $pasosSiguientes = $this->generarPasosSiguientes($recomendaciones, $pasosRazonamiento);

            // Extraer fortalezas de los descubrimientos
            $fortalezas = $this->extraerFortalezas($data, $sintesis);

            // Extraer áreas de mejora
            $areasMejora = $this->extraerAreasMejora($data, $sintesis);

            return [
                'sintesis' => $sintesis,
                'recomendaciones' => array_slice($recomendaciones, 0, 3), // Top 3
                'pasos_siguientes' => $pasosSiguientes,
                'fortalezas' => $fortalezas,
                'areas_mejora' => $areasMejora,
            ];

        } catch (\Exception $e) {
            Log::warning("Error parseando respuesta del agente: {$e->getMessage()}");
            return $this->getSintesisDefault(null);
        }
    }

    /**
     * Generar pasos siguientes prácticos
     */
    private function generarPasosSiguientes(array $recomendaciones, array $pasosRazonamiento): array
    {
        $pasos = [];

        // Primer paso: Investigación (1-2 semanas)
        $pasos[] = "Semana 1-2: Investiga programas académicos en universidades relacionadas con tu perfil vocacional";

        // Segundo paso: Conectar (2-4 semanas)
        if (!empty($recomendaciones)) {
            $pasos[] = "Semana 3-4: Conecta con profesionales en el campo de " . $recomendaciones[0] ?? "tu área de interés";
        } else {
            $pasos[] = "Semana 3-4: Conecta con profesionales en tu área de interés";
        }

        // Tercer paso: Desarrollo (mes 2+)
        $pasos[] = "Mes 2+: Toma cursos en línea introductorios para explorar tu carrera predicha";

        return $pasos;
    }

    /**
     * Extraer fortalezas de la respuesta del agente
     */
    private function extraerFortalezas(array $data, string $sintesis): array
    {
        $fortalezas = [];

        // Intentar extraer de discoveries
        if (isset($data['discoveries']['habilidades']) && is_array($data['discoveries']['habilidades'])) {
            foreach ($data['discoveries']['habilidades'] as $key => $valor) {
                if (!empty($valor)) {
                    $fortalezas[] = ucfirst(str_replace('_', ' ', $key)) . " ($valor%)";
                }
            }
        }

        // Si no hay habilidades, extraer del texto de síntesis
        if (empty($fortalezas)) {
            $fortalezas = [
                "Comunicación clara",
                "Capacidad de aprendizaje",
                "Pensamiento analítico",
            ];
        }

        return array_slice($fortalezas, 0, 3); // Top 3
    }

    /**
     * Extraer áreas de mejora
     */
    private function extraerAreasMejora(array $data, string $sintesis): array
    {
        $areasMejora = [];

        // Sugerencias genéricas basadas en el perfil
        $areasMejora[] = "Desarrollar habilidades técnicas específicas del campo";
        $areasMejora[] = "Mejorar competencias en liderazgo y trabajo en equipo";
        $areasMejora[] = "Profundizar en conocimiento especializado";

        return $areasMejora;
    }

    /**
     * Síntesis por defecto si algo falla
     */
    private function getSintesisDefault(?User $student = null): array
    {
        $nombre = $student?->nombre_completo ?? 'Estudiante';

        return [
            'sintesis' => "Hola {$nombre}, tu perfil vocacional está en proceso de análisis. Los datos recopilados de tu test nos ayudarán a identificar las mejores opciones educativas y profesionales alineadas con tus aptitudes e intereses.",
            'recomendaciones' => [
                'Explora más sobre tus áreas de interés',
                'Conecta con profesionales en campos que te atraen',
                'Toma cursos introductorios en áreas de interés',
            ],
            'pasos_siguientes' => [
                'Semanas 1-2: Investigar programas académicos',
                'Semanas 3-4: Entrevistar a profesionales',
                'Mes 2: Completar otros tests vocacionales',
            ],
            'fortalezas' => ['Comunicación clara', 'Disposición al aprendizaje'],
            'areas_mejora' => ['Definir objetivos a largo plazo'],
        ];
    }
}
