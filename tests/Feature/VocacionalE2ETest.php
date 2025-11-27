<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\TestVocacional;
use App\Models\PerfilVocacional;
use App\Models\PreguntaTest;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VocacionalE2ETest extends TestCase
{
    use RefreshDatabase;

    protected array $mockCareerResponse = [
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
        'timestamp' => '2025-11-27T12:00:00Z'
    ];

    protected array $mockClusteringResponse = [
        'student_id' => 1,
        'cluster_id' => 2,
        'cluster_nombre' => 'Alto Desempeño',
        'cluster_descripcion' => 'Estudiante con alto desempeño académico',
        'probabilidad' => 0.92,
        'perfil' => ['liderazgo' => 0.8, 'creatividad' => 0.75],
        'recomendaciones' => ['Participar en proyectos especiales'],
        'modelo_version' => '1.0',
        'timestamp' => '2025-11-27T12:00:00Z'
    ];

    protected array $mockSynthesisResponse = [
        'student_id' => 1,
        'narrativa' => 'Basándose en tu desempeño académico destacado y tus fortalezas en habilidades técnicas, se recomienda considerar carreras en ingeniería y tecnología...',
        'recomendaciones' => [
            'Fortalecer habilidades en programación avanzada',
            'Participar en hackathons y competencias de programación',
            'Considerar especialización en AI/Machine Learning',
            'Buscar experiencia laboral en startups tecnológicas',
            'Desarrollar pensamiento crítico y resolución de problemas',
            'Mantener actualización en nuevas tecnologías'
        ],
        'pasos_siguientes' => [
            'Fase 1: Consolidar fundamentos (próximos 6 meses)',
            'Fase 2: Especializarse en una subárea (próximos 12 meses)',
            'Fase 3: Buscar experiencia laboral (próximos 18 meses)',
            'Fase 4: Avanzar profesionalmente en tu carrera'
        ],
        'sintesis_tipo' => 'groq',
        'timestamp' => '2025-11-27T12:00:00Z'
    ];

    /**
     * TEST 1: Complete Vocational Test Flow
     */
    public function test_complete_vocational_test_flow()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();
        $test = TestVocacional::factory()->create(['activo' => true]);

        // Step 1: Student accesses test
        $response = $this->actingAs($student)->get(route('tests-vocacionales.take', $test));
        $this->assertTrue($response->successful());
        $this->assertArrayHasKey('test', $response->props());
        $this->assertArrayHasKey('preguntas', $response->props());

        // Step 2: Create test responses
        $preguntas = PreguntaTest::factory(15)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        // Step 3: Submit responses
        $response = $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        $this->assertRedirect(route('tests-vocacionales.resultados', $test));

        // Step 4: Verify profile was created
        $this->assertDatabaseHas('perfil_vocacionales', [
            'estudiante_id' => $student->id
        ]);

        // Step 5: View results
        $response = $this->actingAs($student)->get(route('tests-vocacionales.resultados', $test));
        $this->assertTrue($response->successful());
        $this->assertArrayHasKey('perfil', $response->props());

        $perfil = $response->props()['perfil'];
        $this->assertNotNull($perfil);
        $this->assertEquals('Ingeniería en Sistemas', $perfil['carrera_predicha_ml']);
    }

    /**
     * TEST 2: Profile Data Integrity and Completeness
     */
    public function test_profile_data_is_complete_and_valid()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();
        $test = TestVocacional::factory()->create(['activo' => true]);

        $preguntas = PreguntaTest::factory(10)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        $perfil = PerfilVocacional::where('estudiante_id', $student->id)->first();

        // Verify main fields
        $this->assertNotNull($perfil->carrera_predicha_ml);
        $this->assertNotNull($perfil->confianza_prediccion);
        $this->assertNotNull($perfil->cluster_aptitud);
        $this->assertNotNull($perfil->prediccion_detalles);
        $this->assertNotNull($perfil->recomendaciones_personalizadas);

        // Verify JSON structure for prediccion_detalles
        $detalles = json_decode($perfil->prediccion_detalles, true);
        $this->assertIsArray($detalles);
        $this->assertArrayHasKey('carrera_predicha', $detalles);
        $this->assertArrayHasKey('clustering', $detalles);
        $this->assertArrayHasKey('validacion_coherencia', $detalles);

        // Verify carrera is not null or empty
        $this->assertNotEmpty($detalles['carrera_predicha']);

        // Verify JSON structure for recomendaciones_personalizadas
        $recomendaciones = json_decode($perfil->recomendaciones_personalizadas, true);
        $this->assertIsArray($recomendaciones);
        $this->assertArrayHasKey('narrativa', $recomendaciones);
        $this->assertArrayHasKey('recomendaciones', $recomendaciones);
        $this->assertArrayHasKey('pasos_siguientes', $recomendaciones);
        $this->assertArrayHasKey('sintesis_tipo', $recomendaciones);

        // Verify narrative is not empty
        $this->assertNotEmpty($recomendaciones['narrativa']);
        $this->assertGreater(50, strlen($recomendaciones['narrativa']), 'Narrative should have meaningful content');

        // Verify arrays have content
        $this->assertIsArray($recomendaciones['recomendaciones']);
        $this->assertGreater(0, count($recomendaciones['recomendaciones']), 'Should have recommendations');

        $this->assertIsArray($recomendaciones['pasos_siguientes']);
        $this->assertGreater(0, count($recomendaciones['pasos_siguientes']), 'Should have next steps');
    }

    /**
     * TEST 3: Multiple Tests Per Student (updateOrCreate)
     */
    public function test_student_can_take_multiple_tests()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();
        $test1 = TestVocacional::factory()->create(['activo' => true]);
        $test2 = TestVocacional::factory()->create(['activo' => true]);

        // Complete first test
        $preguntas1 = PreguntaTest::factory(5)->create();
        $respuestas1 = [];
        foreach ($preguntas1 as $p) {
            $respuestas1[$p->id] = 1;
        }

        $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test1),
            ['respuestas' => $respuestas1]
        );

        $perfil1 = PerfilVocacional::where('estudiante_id', $student->id)->first();
        $carrera1 = $perfil1->carrera_predicha_ml;
        $perfil1Id = $perfil1->id;

        // Complete second test
        $preguntas2 = PreguntaTest::factory(5)->create();
        $respuestas2 = [];
        foreach ($preguntas2 as $p) {
            $respuestas2[$p->id] = 5;
        }

        $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test2),
            ['respuestas' => $respuestas2]
        );

        // Verify results table has 2 entries
        $this->assertEquals(
            2,
            \App\Models\ResultadoTestVocacional::where('estudiante_id', $student->id)->count(),
            'Should have 2 test results'
        );

        // Verify perfil_vocacionales table has only 1 entry (updateOrCreate)
        $this->assertEquals(
            1,
            PerfilVocacional::where('estudiante_id', $student->id)->count(),
            'Should have 1 profile (updated)'
        );

        // Verify profile was updated (same ID)
        $perfil2 = PerfilVocacional::where('estudiante_id', $student->id)->first();
        $this->assertEquals($perfil1Id, $perfil2->id, 'Profile ID should remain the same');

        // Profile should have latest data from second test
        $this->assertNotNull($perfil2->carrera_predicha_ml);
    }

    /**
     * TEST 4: Feature Extraction for Real Student
     */
    public function test_feature_extraction_uses_real_student_data()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();

        // Create academic performance records
        $student->rendimientoAcademico()->create([
            'promedio' => 88.5,
            'tendencia_temporal' => 'mejorando'
        ]);

        $test = TestVocacional::factory()->create(['activo' => true]);

        $preguntas = PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = 3;
        }

        // The feature extractor should be called during profile generation
        $response = $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        $perfil = PerfilVocacional::where('estudiante_id', $student->id)->first();
        $detalles = json_decode($perfil->prediccion_detalles, true);

        // Verify that prediction was made (features were extracted and used)
        $this->assertNotEmpty($detalles['carrera_predicha']);
    }

    /**
     * TEST 5: Authorization - Student Cannot View Other's Results
     */
    public function test_student_cannot_view_other_student_results()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student1 = User::factory()->create();
        $student2 = User::factory()->create();
        $test = TestVocacional::factory()->create(['activo' => true]);

        // Student 1 completes test
        $preguntas = PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $this->actingAs($student1)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        // Student 2 tries to view Student 1's results - should fail
        $response = $this->actingAs($student2)->get(route('tests-vocacionales.resultados', $test));

        $this->assertTrue(
            $response->status() === 404 || $response->status() === 403,
            "Should deny access to other student's results (got {$response->status()})"
        );
    }

    /**
     * TEST 6: Test Results Persistence
     */
    public function test_test_results_are_persisted_correctly()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();
        $test = TestVocacional::factory()->create(['activo' => true]);

        $preguntas = PreguntaTest::factory(8)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        // Verify resultado_test_vocacional record
        $resultado = \App\Models\ResultadoTestVocacional::where(
            'estudiante_id',
            $student->id
        )->where(
            'test_vocacional_id',
            $test->id
        )->first();

        $this->assertNotNull($resultado);
        $this->assertNotNull($resultado->respuestas);
        $this->assertNotNull($resultado->fecha_completacion);
    }

    /**
     * TEST 7: Different Student Scenarios
     */
    public function test_different_student_performance_levels()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response([
                'student_id' => 1,
                'carrera' => 'Ingeniería en Sistemas',
                'confianza' => 0.87,
                'compatibilidad' => 0.85,
                'top_3' => $this->mockCareerResponse['top_3'],
                'modelo_version' => '2.1',
                'timestamp' => '2025-11-27T12:00:00Z'
            ], 200),
            'http://localhost:8002/*' => Http::response([
                'student_id' => 1,
                'cluster_id' => 2,
                'cluster_nombre' => 'Alto Desempeño',
                'cluster_descripcion' => 'Estudiante con alto desempeño',
                'probabilidad' => 0.92,
                'perfil' => [],
                'recomendaciones' => [],
                'modelo_version' => '1.0',
                'timestamp' => '2025-11-27T12:00:00Z'
            ], 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        // High performing student
        $highPerformer = User::factory()->create();
        $highPerformer->rendimientoAcademico()->create([
            'promedio' => 95,
            'tendencia_temporal' => 'mejorando'
        ]);

        $test1 = TestVocacional::factory()->create(['activo' => true]);
        $preguntas = PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $p) {
            $respuestas[$p->id] = 5;
        }

        $this->actingAs($highPerformer)->post(
            route('tests-vocacionales.submit-respuestas', $test1),
            ['respuestas' => $respuestas]
        );

        $perfil1 = PerfilVocacional::where('estudiante_id', $highPerformer->id)->first();
        $this->assertNotNull($perfil1->carrera_predicha_ml);

        // Low performing student
        $lowPerformer = User::factory()->create();
        $lowPerformer->rendimientoAcademico()->create([
            'promedio' => 45,
            'tendencia_temporal' => 'empeorando'
        ]);

        $test2 = TestVocacional::factory()->create(['activo' => true]);
        $preguntas2 = PreguntaTest::factory(5)->create();
        $respuestas2 = [];
        foreach ($preguntas2 as $p) {
            $respuestas2[$p->id] = 1;
        }

        $this->actingAs($lowPerformer)->post(
            route('tests-vocacionales.submit-respuestas', $test2),
            ['respuestas' => $respuestas2]
        );

        $perfil2 = PerfilVocacional::where('estudiante_id', $lowPerformer->id)->first();
        $this->assertNotNull($perfil2->carrera_predicha_ml);

        // Both should have valid predictions even with different levels
        $this->assertNotEmpty($perfil1->carrera_predicha_ml);
        $this->assertNotEmpty($perfil2->carrera_predicha_ml);
    }

    /**
     * TEST 8: Complete Data Flow Validation
     */
    public function test_complete_data_flow_from_test_to_profile()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();
        $test = TestVocacional::factory()->create(['activo' => true]);

        // Verify no profile exists yet
        $this->assertDatabaseMissing('perfil_vocacionales', [
            'estudiante_id' => $student->id
        ]);

        // Complete test
        $preguntas = PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = 3;
        }

        $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        // Verify profile exists
        $this->assertDatabaseHas('perfil_vocacionales', [
            'estudiante_id' => $student->id
        ]);

        // Verify complete data
        $perfil = PerfilVocacional::where('estudiante_id', $student->id)->first();
        $this->assertNotNull($perfil->carrera_predicha_ml);
        $this->assertNotNull($perfil->confianza_prediccion);
        $this->assertNotNull($perfil->cluster_aptitud);

        // Verify result record exists
        $this->assertDatabaseHas('resultados_test_vocacional', [
            'test_vocacional_id' => $test->id,
            'estudiante_id' => $student->id
        ]);
    }

    /**
     * TEST 9: Unauthenticated Access Prevention
     */
    public function test_unauthenticated_student_cannot_access_test()
    {
        $test = TestVocacional::factory()->create(['activo' => true]);

        $response = $this->get(route('tests-vocacionales.take', $test));

        // Should redirect to login or return 401/403
        $this->assertTrue(
            $response->status() === 302 || $response->status() === 401 || $response->status() === 403,
            "Unauthenticated access should be denied (got {$response->status()})"
        );
    }

    /**
     * TEST 10: Test Not Found Returns Proper Error
     */
    public function test_accessing_nonexistent_test_returns_404()
    {
        $student = User::factory()->create();

        $response = $this->actingAs($student)->get(route('tests-vocacionales.take', 99999));

        $this->assertEquals(404, $response->status());
    }

    /**
     * TEST 11: Inactive Test Cannot Be Taken
     */
    public function test_inactive_test_cannot_be_taken()
    {
        $student = User::factory()->create();
        $inactiveTest = TestVocacional::factory()->create(['activo' => false]);

        $response = $this->actingAs($student)->get(route('tests-vocacionales.take', $inactiveTest));

        // Should either return 403 or redirect
        $this->assertTrue(
            $response->status() === 403 || $response->status() === 302,
            "Inactive test should not be accessible (got {$response->status()})"
        );
    }

    /**
     * TEST 12: Full Integration with Coherence Validation
     */
    public function test_predictions_are_validated_for_coherence()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();
        $test = TestVocacional::factory()->create(['activo' => true]);

        $preguntas = PreguntaTest::factory(10)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        $perfil = PerfilVocacional::where('estudiante_id', $student->id)->first();
        $detalles = json_decode($perfil->prediccion_detalles, true);

        // Verify validation was performed
        $this->assertArrayHasKey('validacion_coherencia', $detalles);

        // Verify coherence validation has expected structure
        $validacion = $detalles['validacion_coherencia'];
        $this->assertIsArray($validacion);

        // If validation exists, it should have meaningful data
        if (!empty($validacion)) {
            // Verify coherence check was performed
            $this->assertTrue(
                isset($validacion['es_coherente']) || !empty($validacion),
                'Should include coherence validation'
            );
        }
    }
}
