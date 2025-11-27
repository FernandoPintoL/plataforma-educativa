<?php

namespace Tests\Integration;

use Tests\TestCase;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VocacionalAPIsTest extends TestCase
{
    use RefreshDatabase;

    protected array $features = [
        'student_id' => 1,
        'promedio' => 85,
        'asistencia' => 90,
        'tasa_entrega' => 0.95,
        'tendencia_score' => 0.8,
        'recencia_score' => 0.9,
        'area_dominante' => 90,
        'num_areas_fuertes' => 3
    ];

    /**
     * TEST 1: API Career Health Check
     */
    public function test_api_career_is_healthy()
    {
        $response = Http::get('http://localhost:8001/health');

        $this->assertTrue(
            $response->successful(),
            "API Career (8001) no está disponible. Asegúrate de ejecutar: python -m uvicorn api_server:app --port 8001"
        );

        $data = $response->json();
        $this->assertArrayHasKey('status', $data);
        $this->assertEquals('healthy', $data['status']);
    }

    /**
     * TEST 2: API Clustering Health Check
     */
    public function test_api_clustering_is_healthy()
    {
        $response = Http::get('http://localhost:8002/health');

        $this->assertTrue(
            $response->successful(),
            "API Clustering (8002) no está disponible. Asegúrate de ejecutar: python -m uvicorn api_unsupervised_server:app --port 8002"
        );

        $data = $response->json();
        $this->assertArrayHasKey('status', $data);
        $this->assertEquals('healthy', $data['status']);
    }

    /**
     * TEST 3: API Synthesis Health Check
     */
    public function test_api_synthesis_is_healthy()
    {
        $response = Http::get('http://localhost:8003/health');

        $this->assertTrue(
            $response->successful(),
            "API Synthesis (8003) no está disponible. Asegúrate de ejecutar: python -m uvicorn agent_service:app --port 8003"
        );

        $data = $response->json();
        $this->assertArrayHasKey('status', $data);
    }

    /**
     * TEST 4: API Career Returns Career Prediction
     */
    public function test_api_career_predict_vocational()
    {
        $response = Http::post('http://localhost:8001/predict/career/vocational', $this->features);

        $this->assertTrue($response->successful(), "API Career no respondió exitosamente");

        $data = $response->json();

        // Verificar estructura de respuesta
        $this->assertArrayHasKey('student_id', $data);
        $this->assertArrayHasKey('carrera', $data);
        $this->assertArrayHasKey('confianza', $data);
        $this->assertArrayHasKey('compatibilidad', $data);
        $this->assertArrayHasKey('top_3', $data);
        $this->assertArrayHasKey('modelo_version', $data);
        $this->assertArrayHasKey('timestamp', $data);

        // Verificar valores
        $this->assertEquals(1, $data['student_id']);
        $this->assertNotEmpty($data['carrera']);
        $this->assertBetween(0, 1, $data['confianza']);
        $this->assertBetween(0, 1, $data['compatibilidad']);
        $this->assertIsArray($data['top_3']);
        $this->assertCount(3, $data['top_3']);

        // Verificar estructura de top_3
        foreach ($data['top_3'] as $carrera) {
            $this->assertArrayHasKey('ranking', $carrera);
            $this->assertArrayHasKey('carrera', $carrera);
            $this->assertArrayHasKey('confianza', $carrera);
            $this->assertArrayHasKey('compatibilidad', $carrera);
        }

        return $data;  // Para usar en otros tests
    }

    /**
     * TEST 5: API Clustering Returns Cluster Assignment
     */
    public function test_api_clustering_cluster_vocational()
    {
        $response = Http::post('http://localhost:8002/cluster/vocational', $this->features);

        $this->assertTrue($response->successful(), "API Clustering no respondió exitosamente");

        $data = $response->json();

        // Verificar estructura
        $this->assertArrayHasKey('student_id', $data);
        $this->assertArrayHasKey('cluster_id', $data);
        $this->assertArrayHasKey('cluster_nombre', $data);
        $this->assertArrayHasKey('cluster_descripcion', $data);
        $this->assertArrayHasKey('probabilidad', $data);
        $this->assertArrayHasKey('perfil', $data);
        $this->assertArrayHasKey('recomendaciones', $data);
        $this->assertArrayHasKey('modelo_version', $data);
        $this->assertArrayHasKey('timestamp', $data);

        // Verificar valores
        $this->assertEquals(1, $data['student_id']);
        $this->assertBetween(0, 2, $data['cluster_id']);  // 3 clusters (0, 1, 2)
        $this->assertNotEmpty($data['cluster_nombre']);
        $this->assertBetween(0, 1, $data['probabilidad']);
        $this->assertIsArray($data['recomendaciones']);

        return $data;
    }

    /**
     * TEST 6: API Synthesis Returns Narrative
     */
    public function test_api_synthesis_vocational()
    {
        $careerData = $this->test_api_career_predict_vocational();
        $clusterData = $this->test_api_clustering_cluster_vocational();

        $payload = [
            'student_id' => 1,
            'nombre_estudiante' => 'Juan Pérez',
            'promedio_academico' => 85,
            'carrera_predicha' => $careerData['carrera'],
            'confianza' => $careerData['confianza'],
            'cluster_aptitud' => $clusterData['cluster_id'],
            'cluster_nombre' => $clusterData['cluster_nombre'],
            'areas_interes' => [
                'tecnologia' => 95,
                'ciencias' => 80,
                'humanidades' => 50,
                'artes' => 40,
                'negocios' => 65,
                'salud' => 35
            ]
        ];

        $response = Http::post('http://localhost:8003/synthesis/vocational', $payload);

        $this->assertTrue($response->successful(), "API Synthesis no respondió exitosamente");

        $data = $response->json();

        // Verificar estructura
        $this->assertArrayHasKey('student_id', $data);
        $this->assertArrayHasKey('narrativa', $data);
        $this->assertArrayHasKey('recomendaciones', $data);
        $this->assertArrayHasKey('pasos_siguientes', $data);
        $this->assertArrayHasKey('sintesis_tipo', $data);
        $this->assertArrayHasKey('timestamp', $data);

        // Verificar valores
        $this->assertEquals(1, $data['student_id']);
        $this->assertNotEmpty($data['narrativa']);
        $this->assertGreater(50, strlen($data['narrativa']));  // Narrativa tiene contenido
        $this->assertIsArray($data['recomendaciones']);
        $this->assertGreater(0, count($data['recomendaciones']));  // Al menos una recomendación
        $this->assertIsArray($data['pasos_siguientes']);
        $this->assertGreater(0, count($data['pasos_siguientes']));  // Al menos un paso
        $this->assertIn($data['sintesis_tipo'], ['groq', 'fallback']);

        return $data;
    }

    /**
     * TEST 7: API Career with Different Features
     */
    public function test_api_career_with_low_performance_student()
    {
        $lowPerformanceFeatures = [
            'student_id' => 2,
            'promedio' => 45,  // Bajo desempeño
            'asistencia' => 50,
            'tasa_entrega' => 0.5,
            'tendencia_score' => 0.3,
            'recencia_score' => 0.2,
            'area_dominante' => 55,
            'num_areas_fuertes' => 1
        ];

        $response = Http::post('http://localhost:8001/predict/career/vocational', $lowPerformanceFeatures);

        $this->assertTrue($response->successful());
        $data = $response->json();

        // Debería retornar una carrera válida aunque con confianza menor
        $this->assertNotEmpty($data['carrera']);
        $this->assertBetween(0, 1, $data['confianza']);
    }

    /**
     * TEST 8: API Clustering with Different Features
     */
    public function test_api_clustering_identifies_correct_clusters()
    {
        // High performance
        $highPerformance = array_merge($this->features, [
            'promedio' => 95,
            'asistencia' => 98,
            'area_dominante' => 95
        ]);

        $response = Http::post('http://localhost:8002/cluster/vocational', $highPerformance);
        $data = $response->json();

        // Debería asignar a cluster de alto desempeño
        $this->assertNotNull($data['cluster_id']);
        $this->assertGreater(0.8, $data['probabilidad']);  // Alta probabilidad
    }

    /**
     * TEST 9: API Response Times
     */
    public function test_api_response_times_are_acceptable()
    {
        $times = [];

        // Time API Career
        $start = microtime(true);
        Http::post('http://localhost:8001/predict/career/vocational', $this->features);
        $times['career'] = (microtime(true) - $start) * 1000;

        // Time API Clustering
        $start = microtime(true);
        Http::post('http://localhost:8002/cluster/vocational', $this->features);
        $times['clustering'] = (microtime(true) - $start) * 1000;

        // Career debería ser < 100ms
        $this->assertLessThan(100, $times['career'], "API Career es demasiado lenta: {$times['career']}ms");

        // Clustering debería ser < 100ms
        $this->assertLessThan(100, $times['clustering'], "API Clustering es demasiado lenta: {$times['clustering']}ms");
    }

    /**
     * TEST 10: All APIs respond to root endpoint
     */
    public function test_all_apis_have_root_endpoints()
    {
        $career = Http::get('http://localhost:8001/');
        $clustering = Http::get('http://localhost:8002/');
        $synthesis = Http::get('http://localhost:8003/');

        $this->assertTrue($career->successful());
        $this->assertTrue($clustering->successful());
        $this->assertTrue($synthesis->successful());

        // Deberían tener información de endpoints
        $this->assertArrayHasKey('endpoints', $career->json());
        $this->assertArrayHasKey('endpoints', $clustering->json());
        $this->assertArrayHasKey('endpoints', $synthesis->json());
    }

    /**
     * TEST 11: Complete flow with all 3 APIs
     */
    public function test_complete_vocational_flow_with_all_apis()
    {
        // 1. Call Career API
        $career = Http::post('http://localhost:8001/predict/career/vocational', $this->features);
        $this->assertTrue($career->successful());

        // 2. Call Clustering API
        $cluster = Http::post('http://localhost:8002/cluster/vocational', $this->features);
        $this->assertTrue($cluster->successful());

        // 3. Call Synthesis API
        $synthesis = Http::post('http://localhost:8003/synthesis/vocational', [
            'student_id' => 1,
            'nombre_estudiante' => 'Test Student',
            'promedio_academico' => 85,
            'carrera_predicha' => $career->json()['carrera'],
            'confianza' => $career->json()['confianza'],
            'cluster_aptitud' => $cluster->json()['cluster_id'],
            'cluster_nombre' => $cluster->json()['cluster_nombre'],
            'areas_interes' => ['tecnologia' => 95, 'ciencias' => 80]
        ]);

        $this->assertTrue($synthesis->successful());

        // Verify all have complete data
        $this->assertNotEmpty($career->json()['carrera']);
        $this->assertNotEmpty($cluster->json()['cluster_nombre']);
        $this->assertNotEmpty($synthesis->json()['narrativa']);
    }
}
