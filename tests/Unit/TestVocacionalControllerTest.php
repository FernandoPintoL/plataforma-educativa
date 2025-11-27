<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\TestVocacionalController;
use App\Models\User;
use App\Models\TestVocacional;
use App\Services\MLPredictionService;
use App\Services\ClusteringService;
use App\Services\EducationalRecommendationService;
use App\Services\PredictionValidator;
use App\Services\AgentSynthesisService;
use App\Services\VocationalFeatureExtractorService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TestVocacionalControllerTest extends TestCase
{
    use RefreshDatabase;

    protected TestVocacionalController $controller;
    protected User $student;
    protected TestVocacional $test;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear instancia del controller
        $this->controller = app(TestVocacionalController::class);

        // Crear datos de prueba
        $this->student = User::factory()->create();
        $this->test = TestVocacional::factory()->create(['activo' => true]);
    }

    /**
     * TEST 1: Verificar inyección de dependencias
     */
    public function test_controller_has_all_required_dependencies()
    {
        $this->assertNotNull($this->controller);
        $this->assertTrue(method_exists($this->controller, 'submitRespuestas'));
        $this->assertTrue(method_exists($this->controller, 'resultados'));
    }

    /**
     * TEST 2: Verificar que VocationalFeatureExtractorService está disponible
     */
    public function test_feature_extractor_service_is_available()
    {
        $featureExtractor = app(VocationalFeatureExtractorService::class);
        $this->assertNotNull($featureExtractor);
    }

    /**
     * TEST 3: Extraer features REALES de estudiante
     */
    public function test_extract_real_features_from_student()
    {
        // Crear estudiante con datos académicos
        $student = User::factory()->create();

        // Crear rendimiento académico
        $student->rendimientoAcademico()->create([
            'promedio' => 85.5,
            'tendencia_temporal' => 'mejorando'
        ]);

        $featureExtractor = app(VocationalFeatureExtractorService::class);
        $features = $featureExtractor->extractVocationalFeatures($student);

        // Verificar que todas las claves están presentes
        $this->assertArrayHasKey('promedio', $features);
        $this->assertArrayHasKey('asistencia', $features);
        $this->assertArrayHasKey('tasa_entrega', $features);
        $this->assertArrayHasKey('tendencia_score', $features);
        $this->assertArrayHasKey('recencia_score', $features);
        $this->assertArrayHasKey('area_dominante', $features);
        $this->assertArrayHasKey('num_areas_fuertes', $features);

        // Verificar tipos y rangos
        $this->assertIsFloat($features['promedio']);
        $this->assertIsFloat($features['asistencia']);
        $this->assertGreaterThanOrEqual(0, $features['promedio']);
        $this->assertLessThanOrEqual(100, $features['promedio']);
    }

    /**
     * TEST 4: Validación de estructura de features
     */
    public function test_features_structure_is_valid()
    {
        $featureExtractor = app(VocationalFeatureExtractorService::class);
        $features = $featureExtractor->extractVocationalFeatures($this->student);

        // Verificar validación
        $validation = $featureExtractor->validateFeatures($features);

        $this->assertTrue($validation['valid'] ?? false);
        $this->assertEmpty($validation['missing'] ?? []);
    }

    /**
     * TEST 5: Acceder a test vocacional como estudiante
     */
    public function test_student_can_view_vocational_test()
    {
        $response = $this->actingAs($this->student)
            ->get(route('tests-vocacionales.take', $this->test));

        $this->assertTrue($response->successful());
        $this->assertArrayHasKey('test', $response->props());
        $this->assertArrayHasKey('preguntas', $response->props());
    }

    /**
     * TEST 6: Validar datos requeridos en test
     */
    public function test_test_vocacional_has_required_fields()
    {
        $this->assertNotNull($this->test->id);
        $this->assertNotNull($this->test->nombre);
        $this->assertTrue($this->test->activo);
    }

    /**
     * TEST 7: Enviar respuestas válidas
     */
    public function test_submit_valid_test_responses()
    {
        // Crear preguntas para el test
        $preguntas = \App\Models\PreguntaTest::factory(5)->create();

        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $response = $this->actingAs($this->student)
            ->post(
                route('tests-vocacionales.submit-respuestas', $this->test),
                ['respuestas' => $respuestas]
            );

        // Debería redirigir a resultados
        $this->assertRedirect();

        // Debería crear resultado en BD
        $this->assertDatabaseHas('resultados_test_vocacional', [
            'test_vocacional_id' => $this->test->id,
            'estudiante_id' => $this->student->id
        ]);
    }

    /**
     * TEST 8: Validar respuestas incompletas
     */
    public function test_reject_invalid_test_responses()
    {
        $response = $this->actingAs($this->student)
            ->post(
                route('tests-vocacionales.submit-respuestas', $this->test),
                ['respuestas' => []]  // Array vacío
            );

        // Debería fallar validación
        $this->assertSessionHasErrors('respuestas');
    }

    /**
     * TEST 9: Verificar que perfil vocacional se crea
     */
    public function test_vocational_profile_is_created()
    {
        $preguntas = \App\Models\PreguntaTest::factory(5)->create();

        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $this->actingAs($this->student)
            ->post(
                route('tests-vocacionales.submit-respuestas', $this->test),
                ['respuestas' => $respuestas]
            );

        // Verificar que PerfilVocacional existe
        $this->assertDatabaseHas('perfil_vocacionales', [
            'estudiante_id' => $this->student->id
        ]);
    }

    /**
     * TEST 10: Ver resultados del test
     */
    public function test_student_can_view_test_results()
    {
        // Primero completar el test
        $preguntas = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas = [];
        foreach ($preguntas as $pregunta) {
            $respuestas[$pregunta->id] = rand(1, 5);
        }

        $this->actingAs($this->student)
            ->post(
                route('tests-vocacionales.submit-respuestas', $this->test),
                ['respuestas' => $respuestas]
            );

        // Luego ver resultados
        $response = $this->actingAs($this->student)
            ->get(route('tests-vocacionales.resultados', $this->test));

        $this->assertTrue($response->successful());
        $this->assertArrayHasKey('perfil', $response->props());
    }

    /**
     * TEST 11: Estudiante no puede ver test de otro estudiante
     */
    public function test_student_cannot_view_other_student_results()
    {
        $otherStudent = User::factory()->create();

        // Crear resultado para otro estudiante
        \App\Models\ResultadoTestVocacional::create([
            'test_vocacional_id' => $this->test->id,
            'estudiante_id' => $otherStudent->id,
            'respuestas' => [],
            'fecha_completacion' => now()
        ]);

        // Otro estudiante intenta ver resultado
        $response = $this->actingAs($this->student)
            ->get(route('tests-vocacionales.resultados', $this->test));

        // Debería fallar
        $this->assertTrue($response->status() === 404 || $response->status() === 403);
    }

    /**
     * TEST 12: Feature extractor maneja estudiantes sin datos académicos
     */
    public function test_feature_extractor_handles_student_without_academic_data()
    {
        $student = User::factory()->create();
        // Sin crear rendimiento académico

        $featureExtractor = app(VocationalFeatureExtractorService::class);
        $features = $featureExtractor->extractVocationalFeatures($student);

        // Debería retornar features con valores por defecto
        $this->assertIsArray($features);
        $this->assertArrayHasKey('promedio', $features);
        $this->assertGreaterThanOrEqual(0, $features['promedio']);
    }

    /**
     * TEST 13: Validar que se genera reporte completo
     */
    public function test_feature_extractor_generates_complete_report()
    {
        $featureExtractor = app(VocationalFeatureExtractorService::class);
        $report = $featureExtractor->generateFeatureReport($this->student);

        $this->assertArrayHasKey('student_id', $report);
        $this->assertArrayHasKey('student_name', $report);
        $this->assertArrayHasKey('features', $report);
        $this->assertArrayHasKey('validation', $report);
        $this->assertArrayHasKey('ready_for_prediction', $report);
    }

    /**
     * TEST 14: Múltiples tests del mismo estudiante
     */
    public function test_student_can_take_multiple_tests()
    {
        $test2 = TestVocacional::factory()->create(['activo' => true]);

        // Completar primer test
        $preguntas1 = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas1 = [];
        foreach ($preguntas1 as $p) {
            $respuestas1[$p->id] = 1;
        }

        $this->actingAs($this->student)
            ->post(
                route('tests-vocacionales.submit-respuestas', $this->test),
                ['respuestas' => $respuestas1]
            );

        // Completar segundo test
        $preguntas2 = \App\Models\PreguntaTest::factory(5)->create();
        $respuestas2 = [];
        foreach ($preguntas2 as $p) {
            $respuestas2[$p->id] = 5;
        }

        $this->actingAs($this->student)
            ->post(
                route('tests-vocacionales.submit-respuestas', $test2),
                ['respuestas' => $respuestas2]
            );

        // Debería haber 2 resultados
        $this->assertEquals(
            2,
            \App\Models\ResultadoTestVocacional::where('estudiante_id', $this->student->id)->count()
        );

        // Pero solo 1 perfil (updateOrCreate)
        $this->assertEquals(
            1,
            \App\Models\PerfilVocacional::where('estudiante_id', $this->student->id)->count()
        );
    }
}
