<?php

namespace Tests\Performance;

use Tests\TestCase;
use App\Models\User;
use App\Models\TestVocacional;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VocacionalPerformanceTest extends TestCase
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
        'narrativa' => 'Basándose en tu desempeño académico destacado y tus fortalezas en habilidades técnicas...',
        'recomendaciones' => [
            'Fortalecer habilidades en programación avanzada',
            'Participar en hackathons',
            'Considerar especialización en AI/ML',
            'Buscar experiencia laboral en startups tech'
        ],
        'pasos_siguientes' => [
            'Fase 1: Consolidar fundamentos (próximos 6 meses)',
            'Fase 2: Especializarse (próximos 12 meses)',
            'Fase 3: Buscar experiencia laboral (próximos 18 meses)',
            'Fase 4: Avanzar profesionalmente'
        ],
        'sintesis_tipo' => 'groq',
        'timestamp' => '2025-11-27T12:00:00Z'
    ];

    /**
     * TEST 1: Feature Extraction Performance
     */
    public function test_feature_extraction_is_performant()
    {
        $students = User::factory(10)->create();

        $featureExtractor = app(\App\Services\VocationalFeatureExtractorService::class);

        $times = [];
        foreach ($students as $index => $student) {
            $start = microtime(true);
            $features = $featureExtractor->extractVocationalFeatures($student);
            $elapsed = (microtime(true) - $start) * 1000; // ms

            $times[$index] = $elapsed;

            // Each extraction should be < 50ms
            $this->assertLessThan(
                50,
                $elapsed,
                "Feature extraction for student {$index} took {$elapsed}ms (expected < 50ms)"
            );
        }

        $avgTime = array_sum($times) / count($times);
        $this->assertLessThan(30, $avgTime, "Average feature extraction time {$avgTime}ms (expected < 30ms)");
    }

    /**
     * TEST 2: Feature Validation Performance
     */
    public function test_feature_validation_is_performant()
    {
        $featureExtractor = app(\App\Services\VocationalFeatureExtractorService::class);

        $validFeatures = [
            'student_id' => 1,
            'promedio' => 85,
            'asistencia' => 90,
            'tasa_entrega' => 0.95,
            'tendencia_score' => 0.8,
            'recencia_score' => 0.9,
            'area_dominante' => 90,
            'num_areas_fuertes' => 3
        ];

        $times = [];
        for ($i = 0; $i < 20; $i++) {
            $start = microtime(true);
            $validation = $featureExtractor->validateFeatures($validFeatures);
            $elapsed = (microtime(true) - $start) * 1000;

            $times[$i] = $elapsed;

            $this->assertTrue($validation['valid'] ?? false);
            $this->assertLessThan(10, $elapsed, "Validation took {$elapsed}ms (expected < 10ms)");
        }

        $avgTime = array_sum($times) / count($times);
        $this->assertLessThan(5, $avgTime, "Average validation time {$avgTime}ms (expected < 5ms)");
    }

    /**
     * TEST 3: Individual API Response Times
     */
    public function test_api_response_times_are_acceptable()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $features = [
            'student_id' => 1,
            'promedio' => 85,
            'asistencia' => 90,
            'tasa_entrega' => 0.95,
            'tendencia_score' => 0.8,
            'recencia_score' => 0.9,
            'area_dominante' => 90,
            'num_areas_fuertes' => 3
        ];

        // Test API Career (should be ~45ms)
        $start = microtime(true);
        $response = Http::post('http://localhost:8001/predict/career/vocational', $features);
        $careerTime = (microtime(true) - $start) * 1000;

        $this->assertTrue($response->successful());
        $this->assertLessThan(100, $careerTime, "Career API took {$careerTime}ms (expected < 100ms)");

        // Test API Clustering (should be ~32ms)
        $start = microtime(true);
        $response = Http::post('http://localhost:8002/cluster/vocational', $features);
        $clusterTime = (microtime(true) - $start) * 1000;

        $this->assertTrue($response->successful());
        $this->assertLessThan(100, $clusterTime, "Clustering API took {$clusterTime}ms (expected < 100ms)");

        // Test API Synthesis (should be ~800ms with LLM)
        $start = microtime(true);
        $response = Http::post('http://localhost:8003/synthesis/vocational', [
            'student_id' => 1,
            'nombre_estudiante' => 'Test Student',
            'promedio_academico' => 85,
            'carrera_predicha' => 'Ingeniería en Sistemas',
            'confianza' => 0.87,
            'cluster_aptitud' => 2,
            'cluster_nombre' => 'Alto Desempeño',
            'areas_interes' => ['tecnologia' => 95, 'ciencias' => 80]
        ]);
        $synthesisTime = (microtime(true) - $start) * 1000;

        $this->assertTrue($response->successful());
        $this->assertLessThan(2500, $synthesisTime, "Synthesis API took {$synthesisTime}ms (expected < 2500ms)");
    }

    /**
     * TEST 4: Complete Controller Flow Performance
     */
    public function test_complete_controller_flow_is_performant()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();
        $test = TestVocacional::factory()->create(['activo' => true]);

        $preguntas = \App\Models\PreguntaTest::factory(10)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        // Measure complete flow
        $start = microtime(true);

        $response = $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        $elapsed = (microtime(true) - $start) * 1000;

        $this->assertRedirect();
        $this->assertLessThan(
            3000,
            $elapsed,
            "Complete flow took {$elapsed}ms (expected < 3000ms)"
        );
    }

    /**
     * TEST 5: Multiple Concurrent Student Submissions
     */
    public function test_system_handles_multiple_concurrent_submissions()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $test = TestVocacional::factory()->create(['activo' => true]);
        $numStudents = 5;

        $timings = [];

        foreach (range(1, $numStudents) as $i) {
            $student = User::factory()->create();

            $preguntas = \App\Models\PreguntaTest::factory(10)->create();
            $respuestas = [];
            foreach ($preguntas as $pregunta) {
                $respuestas[$pregunta->id] = rand(1, 5);
            }

            $start = microtime(true);

            $this->actingAs($student)->post(
                route('tests-vocacionales.submit-respuestas', $test),
                ['respuestas' => $respuestas]
            );

            $elapsed = (microtime(true) - $start) * 1000;
            $timings[$i] = $elapsed;
        }

        $avgTime = array_sum($timings) / count($timings);
        $maxTime = max($timings);

        // Average per student should be < 3 seconds
        $this->assertLessThan(3000, $avgTime, "Average time per student {$avgTime}ms (expected < 3000ms)");

        // Even the slowest should be < 5 seconds
        $this->assertLessThan(5000, $maxTime, "Max time {$maxTime}ms (expected < 5000ms)");
    }

    /**
     * TEST 6: Database Operation Performance
     */
    public function test_database_save_performance()
    {
        $student = User::factory()->create();
        $featureExtractor = app(\App\Services\VocationalFeatureExtractorService::class);
        $features = $featureExtractor->extractVocationalFeatures($student);

        $times = [];

        for ($i = 0; $i < 10; $i++) {
            $start = microtime(true);

            \App\Models\PerfilVocacional::updateOrCreate(
                ['estudiante_id' => $student->id],
                [
                    'carrera_predicha_ml' => 'Ingeniería en Sistemas',
                    'confianza_prediccion' => 0.87,
                    'cluster_aptitud' => 2,
                    'prediccion_detalles' => json_encode(['test' => 'data']),
                    'recomendaciones_personalizadas' => json_encode(['narrative' => 'test'])
                ]
            );

            $elapsed = (microtime(true) - $start) * 1000;
            $times[$i] = $elapsed;

            // Each save should be < 50ms
            $this->assertLessThan(50, $elapsed, "Save operation {$i} took {$elapsed}ms (expected < 50ms)");
        }

        $avgTime = array_sum($times) / count($times);
        $this->assertLessThan(30, $avgTime, "Average save time {$avgTime}ms (expected < 30ms)");
    }

    /**
     * TEST 7: Memory Usage During Processing
     */
    public function test_memory_usage_is_reasonable()
    {
        $initialMemory = memory_get_usage(true);

        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $students = User::factory(10)->create();

        foreach ($students as $student) {
            $test = TestVocacional::factory()->create(['activo' => true]);

            $preguntas = \App\Models\PreguntaTest::factory(10)->create();
            $respuestas = [];
            foreach ($preguntas as $pregunta) {
                $respuestas[$pregunta->id] = rand(1, 5);
            }

            $this->actingAs($student)->post(
                route('tests-vocacionales.submit-respuestas', $test),
                ['respuestas' => $respuestas]
            );
        }

        $finalMemory = memory_get_usage(true);
        $memoryUsed = ($finalMemory - $initialMemory) / 1024 / 1024; // MB

        // Processing 10 students should not use more than 20 MB
        $this->assertLessThan(20, $memoryUsed, "Memory used: {$memoryUsed}MB (expected < 20MB)");
    }

    /**
     * TEST 8: Stress Test - Rapid Sequential Submissions
     */
    public function test_rapid_sequential_submissions()
    {
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200),
        ]);

        $student = User::factory()->create();
        $numTests = 3;

        $times = [];
        $overallStart = microtime(true);

        foreach (range(1, $numTests) as $i) {
            $test = TestVocacional::factory()->create(['activo' => true]);

            $preguntas = \App\Models\PreguntaTest::factory(5)->create();
            $respuestas = [];
            foreach ($preguntas as $pregunta) {
                $respuestas[$pregunta->id] = rand(1, 5);
            }

            $start = microtime(true);

            $this->actingAs($student)->post(
                route('tests-vocacionales.submit-respuestas', $test),
                ['respuestas' => $respuestas]
            );

            $elapsed = (microtime(true) - $start) * 1000;
            $times[$i] = $elapsed;
        }

        $totalTime = (microtime(true) - $overallStart) * 1000;
        $avgTime = $totalTime / $numTests;

        // Each submission in stress test should still be < 3 seconds
        foreach ($times as $index => $time) {
            $this->assertLessThan(3000, $time, "Submission {$index} took {$time}ms (expected < 3000ms)");
        }

        // Average of all should be < 3 seconds
        $this->assertLessThan(3000, $avgTime, "Average time per submission {$avgTime}ms (expected < 3000ms)");
    }

    /**
     * TEST 9: Large Feature Set Processing
     */
    public function test_large_feature_set_processing()
    {
        $featureExtractor = app(\App\Services\VocationalFeatureExtractorService::class);

        // Create student with more academic records
        $student = User::factory()->create();

        // Create multiple academic performance records
        for ($i = 0; $i < 20; $i++) {
            $student->rendimientoAcademico()->create([
                'promedio' => rand(60, 95) + rand(0, 99) / 100,
                'tendencia_temporal' => ['mejorando', 'estable', 'empeorando'][rand(0, 2)]
            ]);
        }

        $times = [];

        for ($i = 0; $i < 5; $i++) {
            $start = microtime(true);
            $features = $featureExtractor->extractVocationalFeatures($student);
            $elapsed = (microtime(true) - $start) * 1000;

            $times[$i] = $elapsed;

            // Should still be performant with more data
            $this->assertLessThan(100, $elapsed, "Extraction with large dataset took {$elapsed}ms (expected < 100ms)");
        }

        $avgTime = array_sum($times) / count($times);
        $this->assertLessThan(60, $avgTime, "Average extraction time with large dataset {$avgTime}ms (expected < 60ms)");
    }

    /**
     * TEST 10: API Timeout Resilience
     */
    public function test_system_degrades_gracefully_under_api_timeout()
    {
        // Simulate slow API responses
        Http::fake([
            'http://localhost:8001/*' => Http::response($this->mockCareerResponse, 200, [], function () {
                usleep(150000); // 150ms delay
                return $this->mockCareerResponse;
            }),
            'http://localhost:8002/*' => Http::response($this->mockClusteringResponse, 200, [], function () {
                usleep(120000); // 120ms delay
                return $this->mockClusteringResponse;
            }),
            'http://localhost:8003/*' => Http::response($this->mockSynthesisResponse, 200, [], function () {
                usleep(1000000); // 1000ms delay (slow LLM)
                return $this->mockSynthesisResponse;
            }),
        ]);

        $student = User::factory()->create();
        $test = TestVocacional::factory()->create(['activo' => true]);

        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $start = microtime(true);

        $response = $this->actingAs($student)->post(
            route('tests-vocacionales.submit-respuestas', $test),
            ['respuestas' => $respuestas]
        );

        $elapsed = (microtime(true) - $start) * 1000;

        // Should complete within total timeout
        $this->assertLessThan(5000, $elapsed, "Complete flow with delays took {$elapsed}ms (expected < 5000ms)");

        // Profile should still be created
        $this->assertDatabaseHas('perfil_vocacionales', [
            'estudiante_id' => $student->id
        ]);
    }
}
