<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AgentResourceService
{
    /**
     * Obtener recursos educativos específicos del Agente Groq
     *
     * Llama al servicio ./agente para generar recursos personalizados
     * basados en el tema y nivel de riesgo del estudiante
     */
    protected string $agentUrl;

    public function __construct()
    {
        // URL del servicio agente (cambiar según entorno)
        // Usa ML_AGENTE_URL si está configurado, fallback a AGENT_API_URL, después a localhost
        $this->agentUrl = env('ML_AGENTE_URL', env('AGENT_API_URL', 'http://localhost:8003'));
    }

    /**
     * Obtener recursos para un tema específico
     *
     * @param string $studentName Nombre del estudiante
     * @param string $subject Materia/Tema
     * @param float $currentGrade Calificación actual (0-100)
     * @param string $riskLevel Nivel de riesgo (LOW, MEDIUM, HIGH)
     * @param string $need Tipo de necesidad (tutoring, resources, intervention, enrichment)
     * @return array Recursos sugeridos
     */
    public function getResourcesForTopic(
        string $studentName,
        string $subject,
        float $currentGrade,
        string $riskLevel,
        string $need = 'study_resource'
    ): array {
        try {
            Log::info('🤖 Solicitando recursos al Agente', [
                'student' => $studentName,
                'subject' => $subject,
                'risk_level' => $riskLevel,
            ]);

            // Llamar al endpoint del agente
            $response = Http::timeout(30)
                ->post("{$this->agentUrl}/api/resources", [
                    'student_name' => $studentName,
                    'subject' => $subject,
                    'current_grade' => $currentGrade / 10, // Convertir de 0-100 a 0-10
                    'risk_level' => $riskLevel,
                    'need' => $need,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('✅ Recursos obtenidos del Agente', [
                    'resources' => count($data['resources'] ?? []),
                ]);
                return $data;
            } else {
                Log::warning('⚠️ Agente retornó error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return $this->getFallbackResources($subject);
            }

        } catch (\Exception $e) {
            Log::error('❌ Error conectando con Agente', [
                'error' => $e->getMessage(),
                'url' => $this->agentUrl,
            ]);
            return $this->getFallbackResources($subject);
        }
    }

    /**
     * Obtener recursos para múltiples temas fallidos
     *
     * @param array $failedTopics Array de temas con errores
     * @param string $studentName Nombre del estudiante
     * @param float $currentGrade Calificación actual
     * @return array Recursos organizados por formato (resources_by_format)
     */
    public function getResourcesForFailedTopics(
        array $failedTopics,
        string $studentName,
        float $currentGrade
    ): array {
        $allResourcesByFormat = [
            'videos' => [],
            'articles' => [],
            'exercises' => [],
            'interactive' => [],
            'documentation' => [],
            'communities' => [],
        ];

        $totalResources = 0;

        foreach ($failedTopics as $topic => $errorRate) {
            // Determinar nivel de riesgo por tasa de error
            $riskLevel = $this->determineRiskLevel($errorRate);

            $topicResources = $this->getResourcesForTopic(
                $studentName,
                $topic,
                $currentGrade,
                $riskLevel,
                'study_resource'
            );

            // Extraer recursos_by_format de la respuesta del agente
            if (isset($topicResources['resources_by_format']) && is_array($topicResources['resources_by_format'])) {
                foreach ($topicResources['resources_by_format'] as $format => $resources) {
                    if (isset($allResourcesByFormat[$format])) {
                        $allResourcesByFormat[$format] = array_merge(
                            $allResourcesByFormat[$format],
                            $resources
                        );
                        $totalResources += count($resources);
                    }
                }
            }
        }

        // Retornar estructura compatible con el frontend
        return [
            'resources_by_format' => $allResourcesByFormat,
            'total_count' => $totalResources,
            'breakdown' => [
                'videos' => count($allResourcesByFormat['videos']),
                'articles' => count($allResourcesByFormat['articles']),
                'exercises' => count($allResourcesByFormat['exercises']),
                'interactive' => count($allResourcesByFormat['interactive']),
                'documentation' => count($allResourcesByFormat['documentation']),
                'communities' => count($allResourcesByFormat['communities']),
            ],
        ];
    }

    /**
     * Determinar nivel de riesgo basado en tasa de error
     */
    private function determineRiskLevel(float $errorRate): string
    {
        if ($errorRate >= 0.75) {
            return 'HIGH';
        } elseif ($errorRate >= 0.50) {
            return 'MEDIUM';
        } else {
            return 'LOW';
        }
    }

    /**
     * Recursos fallback cuando el agente no está disponible
     */
    private function getFallbackResources(string $subject): array
    {
        return [
            'resources_by_format' => [
                'videos' => [
                    [
                        'title' => "Busca '$subject' en Khan Academy",
                        'url' => 'https://www.khanacademy.org/',
                        'source' => 'Khan Academy',
                        'description' => 'Videos educativos sobre ' . $subject,
                        'type' => 'video',
                        'emoji' => '📺',
                    ]
                ],
                'articles' => [
                    [
                        'title' => "Artículo sobre $subject en Wikipedia",
                        'url' => 'https://www.wikipedia.org/',
                        'source' => 'Wikipedia',
                        'description' => 'Enciclopedia abierta con información sobre ' . $subject,
                        'type' => 'article',
                        'emoji' => '📄',
                    ]
                ],
                'exercises' => [
                    [
                        'title' => "Ejercicios de $subject",
                        'url' => 'https://www.codewars.com/',
                        'source' => 'CodeWars',
                        'description' => 'Plataforma de práctica con ejercicios interactivos',
                        'type' => 'exercise',
                        'emoji' => '🎯',
                    ]
                ],
                'interactive' => [],
                'documentation' => [],
                'communities' => [
                    [
                        'title' => 'Comunidad de aprendizaje',
                        'url' => 'https://www.reddit.com/r/learningprogramming/',
                        'source' => 'Reddit',
                        'description' => 'Comunidad para hacer preguntas y compartir recursos',
                        'type' => 'community',
                        'emoji' => '👥',
                    ]
                ],
            ],
            'total_count' => 4,
            'breakdown' => [
                'videos' => 1,
                'articles' => 1,
                'exercises' => 1,
                'interactive' => 0,
                'documentation' => 0,
                'communities' => 1,
            ],
            'note' => 'Recursos sugeridos (Agente no disponible)',
        ];
    }
}
