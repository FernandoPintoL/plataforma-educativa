<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\TestVocacional;
use App\Models\PerfilVocacional;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VocacionalFallbackTest extends TestCase
{
    use RefreshDatabase;

    protected User $student;
    protected TestVocacional $test;

    protected function setUp(): void
    {
        parent::setUp();

        $this->student = User::factory()->create();
        $this->test = TestVocacional::factory()->create(['activo' => true]);
    }

    /**
     * TEST 1: API Career fails - controller should handle gracefully
     */
    public function test_system_handles_api_career_failure()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response(null, 503, ['error' => 'Service Unavailable']),
            'http://localhost:8002/*' => Http::response([
                'student_id' => 1,
                'cluster_id' => 1,
                'cluster_nombre' => 'Desempeño Medio',
                'cluster_descripcion' => 'Estudiante con desempeño académico moderado',
                'probabilidad' => 0.75,
                'perfil' => ['resiliencia' => 0.6],
                'recomendaciones' => ['Mejorar asistencia', 'Aumentar participación'],
                'modelo_version' => '1.0',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8003/*' => Http::response([
                'student_id' => 1,
                'narrativa' => 'Fallback narrative',
                'recomendaciones' => [],
                'pasos_siguientes' => [],
                'sintesis_tipo' => 'fallback',
                'timestamp' => now()->toIso8601String()
            ], 200),
        ]);

        // Submit test responses
        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        // Attempt to submit and process
        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        // Should still create a profile with fallback data
        $this->assertDatabaseHas('perfil_vocacionales', [
            'estudiante_id' => $this->student->id
        ]);

        // Profile should have fallback indicators
        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();
        $this->assertNotNull($perfil);

        // May have fallback_type or null carrera_predicha_ml indicating API failure
        $detalles = json_decode($perfil->prediccion_detalles, true);
        $this->assertArrayHasKey('carrera_predicha', $detalles);
    }

    /**
     * TEST 2: API Synthesis fails - should generate fallback narrative
     */
    public function test_system_generates_fallback_narrative_when_synthesis_fails()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response([
                'student_id' => 1,
                'carrera' => 'Ingeniería en Sistemas',
                'confianza' => 0.87,
                'compatibilidad' => 0.85,
                'top_3' => [
                    ['ranking' => 1, 'carrera' => 'Ingeniería en Sistemas', 'confianza' => 0.87, 'compatibilidad' => 0.85],
                    ['ranking' => 2, 'carrera' => 'Ingeniería Informática', 'confianza' => 0.82, 'compatibilidad' => 0.80],
                    ['ranking' => 3, 'carrera' => 'Ciencia de Datos', 'confianza' => 0.78, 'compatibilidad' => 0.76]
                ],
                'modelo_version' => '2.1',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8002/*' => Http::response([
                'student_id' => 1,
                'cluster_id' => 2,
                'cluster_nombre' => 'Alto Desempeño',
                'cluster_descripcion' => 'Estudiante con alto desempeño académico',
                'probabilidad' => 0.92,
                'perfil' => ['liderazgo' => 0.8, 'creatividad' => 0.75],
                'recomendaciones' => ['Participar en proyectos especiales', 'Considerar posgrado temprano'],
                'modelo_version' => '1.0',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8003/*' => Http::response(null, 503, ['error' => 'LLM Service Unavailable'])
        ]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        // Profile should be created despite synthesis failure
        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();
        $this->assertNotNull($perfil);

        // Should still have career prediction from API
        $this->assertEquals('Ingeniería en Sistemas', $perfil->carrera_predicha_ml);
        $this->assertEquals(2, $perfil->cluster_aptitud);

        // Recomendaciones should exist (either from synthesis or fallback)
        $recomendaciones = json_decode($perfil->recomendaciones_personalizadas, true);
        $this->assertArrayHasKey('narrativa', $recomendaciones);
        $this->assertNotEmpty($recomendaciones['narrativa']);

        // Check if fallback was used
        $this->assertIn(
            $recomendaciones['sintesis_tipo'] ?? 'fallback',
            ['fallback', 'groq']
        );
    }

    /**
     * TEST 3: All APIs fail - should use local fallback analysis
     */
    public function test_system_uses_local_fallback_when_all_apis_fail()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response(null, 503),
            'http://localhost:8002/*' => Http::response(null, 503),
            'http://localhost:8003/*' => Http::response(null, 503),
        ]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        // Should still create profile using local analysis
        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();
        $this->assertNotNull($perfil);

        // Profile should have data from local fallback analysis
        $this->assertNotNull($perfil->prediccion_detalles);

        $detalles = json_decode($perfil->prediccion_detalles, true);
        $this->assertIsArray($detalles);

        // Should indicate that this came from fallback
        $this->assertArrayHasKey('analisis_tipo', $detalles);
        $this->assertEquals('fallback', $detalles['analisis_tipo']);
    }

    /**
     * TEST 4: API Clustering fails - Career should proceed independently
     */
    public function test_api_career_works_when_clustering_fails()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response([
                'student_id' => 1,
                'carrera' => 'Administración de Empresas',
                'confianza' => 0.76,
                'compatibilidad' => 0.72,
                'top_3' => [
                    ['ranking' => 1, 'carrera' => 'Administración de Empresas', 'confianza' => 0.76, 'compatibilidad' => 0.72],
                    ['ranking' => 2, 'carrera' => 'Contabilidad', 'confianza' => 0.71, 'compatibilidad' => 0.68],
                    ['ranking' => 3, 'carrera' => 'Economía', 'confianza' => 0.65, 'compatibilidad' => 0.61]
                ],
                'modelo_version' => '2.1',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8002/*' => Http::response(null, 503),
            'http://localhost:8003/*' => Http::response([
                'student_id' => 1,
                'narrativa' => 'Fallback narrative debido a clustering no disponible',
                'recomendaciones' => ['Recomendación 1'],
                'pasos_siguientes' => ['Paso 1'],
                'sintesis_tipo' => 'fallback',
                'timestamp' => now()->toIso8601String()
            ], 200),
        ]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();
        $this->assertNotNull($perfil);

        // Career prediction should be available
        $this->assertEquals('Administración de Empresas', $perfil->carrera_predicha_ml);

        // But cluster might be null or fallback
        // This depends on implementation - cluster may be required or optional
        $this->assertNotNull($perfil->prediccion_detalles);
    }

    /**
     * TEST 5: Partial data response - API returns incomplete data
     */
    public function test_system_handles_incomplete_api_responses()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response([
                'student_id' => 1,
                'carrera' => 'Psicología',
                // Missing: confianza, compatibilidad, top_3
                'modelo_version' => '2.1',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8002/*' => Http::response([
                'student_id' => 1,
                'cluster_id' => 1,
                'cluster_nombre' => 'Desempeño Medio',
                'probabilidad' => 0.65,
                'modelo_version' => '1.0',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8003/*' => Http::response([
                'student_id' => 1,
                'narrativa' => 'Narrativa generada',
                'recomendaciones' => [],
                'pasos_siguientes' => [],
                'sintesis_tipo' => 'groq',
                'timestamp' => now()->toIso8601String()
            ], 200),
        ]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        // Should still create profile and handle missing fields gracefully
        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();
        $this->assertNotNull($perfil);

        $detalles = json_decode($perfil->prediccion_detalles, true);
        // Should validate that essential fields are present or have defaults
        $this->assertArrayHasKey('carrera_predicha', $detalles);
    }

    /**
     * TEST 6: Network timeout - should fallback gracefully
     */
    public function test_system_handles_network_timeout()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response(null, 0, [], function () {
                throw new \Illuminate\Http\Client\ConnectionException('Connection timeout');
            }),
            'http://localhost:8002/*' => Http::response([
                'student_id' => 1,
                'cluster_id' => 1,
                'cluster_nombre' => 'Desempeño Medio',
                'cluster_descripcion' => 'Desempeño académico moderado',
                'probabilidad' => 0.68,
                'perfil' => [],
                'recomendaciones' => [],
                'modelo_version' => '1.0',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8003/*' => Http::response([
                'student_id' => 1,
                'narrativa' => 'Fallback narrative',
                'recomendaciones' => [],
                'pasos_siguientes' => [],
                'sintesis_tipo' => 'fallback',
                'timestamp' => now()->toIso8601String()
            ], 200),
        ]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        // Should handle timeout gracefully
        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        // Profile should still be created
        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();
        $this->assertNotNull($perfil);
    }

    /**
     * TEST 7: API returns 4xx error (bad request)
     */
    public function test_system_handles_malformed_request_to_api()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response(['error' => 'Invalid features'], 400),
            'http://localhost:8002/*' => Http::response([
                'student_id' => 1,
                'cluster_id' => 0,
                'cluster_nombre' => 'Bajo Desempeño',
                'cluster_descripcion' => 'Estudiante con bajo desempeño académico',
                'probabilidad' => 0.45,
                'perfil' => ['necesidad_apoyo' => 0.9],
                'recomendaciones' => ['Buscar tutoría'],
                'modelo_version' => '1.0',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8003/*' => Http::response([
                'student_id' => 1,
                'narrativa' => 'Fallback narrative',
                'recomendaciones' => ['Apoyo académico'],
                'pasos_siguientes' => ['Paso 1'],
                'sintesis_tipo' => 'fallback',
                'timestamp' => now()->toIso8601String()
            ], 200),
        ]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        // Should create profile with fallback
        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();
        $this->assertNotNull($perfil);
    }

    /**
     * TEST 8: Verify fallback narrative has minimum required structure
     */
    public function test_fallback_synthesis_has_complete_structure()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response(null, 503),
            'http://localhost:8002/*' => Http::response(null, 503),
            'http://localhost:8003/*' => Http::response(null, 503),
        ]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();
        $recomendaciones = json_decode($perfil->recomendaciones_personalizadas, true);

        // Verify fallback structure matches expected output
        $this->assertArrayHasKey('narrativa', $recomendaciones);
        $this->assertArrayHasKey('recomendaciones', $recomendaciones);
        $this->assertArrayHasKey('pasos_siguientes', $recomendaciones);
        $this->assertArrayHasKey('sintesis_tipo', $recomendaciones);

        // Verify minimum content
        $this->assertNotEmpty($recomendaciones['narrativa']);
        $this->assertIsArray($recomendaciones['recomendaciones']);
        $this->assertIsArray($recomendaciones['pasos_siguientes']);
        $this->assertEquals('fallback', $recomendaciones['sintesis_tipo']);
    }

    /**
     * TEST 9: Retry logic - Second attempt should work if API recovers
     */
    public function test_second_test_submission_succeeds_after_api_recovery()
    {
        // First submission - APIs fail
        Http::fake([
            'http://localhost:8001/*' => Http::response(null, 503),
            'http://localhost:8002/*' => Http::response(null, 503),
            'http://localhost:8003/*' => Http::response(null, 503),
        ]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $this->test),
            ['respuestas' => $respuestas]
        );

        // Create second test
        $test2 = TestVocacional::factory()->create(['activo' => true]);

        // Second submission - APIs work now
        Http::fake([
            'http://localhost:8001/*' => Http::response([
                'student_id' => 1,
                'carrera' => 'Medicina',
                'confianza' => 0.92,
                'compatibilidad' => 0.88,
                'top_3' => [
                    ['ranking' => 1, 'carrera' => 'Medicina', 'confianza' => 0.92, 'compatibilidad' => 0.88],
                    ['ranking' => 2, 'carrera' => 'Enfermería', 'confianza' => 0.85, 'compatibilidad' => 0.80],
                    ['ranking' => 3, 'carrera' => 'Fisioterapia', 'confianza' => 0.78, 'compatibilidad' => 0.74]
                ],
                'modelo_version' => '2.1',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8002/*' => Http::response([
                'student_id' => 1,
                'cluster_id' => 2,
                'cluster_nombre' => 'Alto Desempeño',
                'cluster_descripcion' => 'Estudiante con alto desempeño académico',
                'probabilidad' => 0.89,
                'perfil' => ['excelencia' => 0.9],
                'recomendaciones' => [],
                'modelo_version' => '1.0',
                'timestamp' => now()->toIso8601String()
            ], 200),
            'http://localhost:8003/*' => Http::response([
                'student_id' => 1,
                'narrativa' => 'Narrativa generada por LLM',
                'recomendaciones' => ['Recomenación 1'],
                'pasos_siguientes' => ['Paso 1'],
                'sintesis_tipo' => 'groq',
                'timestamp' => now()->toIso8601String()
            ], 200),
        ]);

        $respuestas2 = [];
        foreach ($preguntas as $pregunta) {
            $respuestas2[$pregunta->id] = 5;
        }

        $response = $this->actingAs($this->student)->post(
            route('tests-vocacionales.submit-respuestas', $test2),
            ['respuestas' => $respuestas2]
        );

        // Profile should be updated with new data
        $perfil = PerfilVocacional::where('estudiante_id', $this->student->id)->first();

        // Should have latest career (updateOrCreate behavior)
        $this->assertEquals('Medicina', $perfil->carrera_predicha_ml);
        $this->assertEquals(2, $perfil->cluster_aptitud);
    }
}
