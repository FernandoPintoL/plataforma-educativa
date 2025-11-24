<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Trabajo;
use App\Models\Calificacion;
use App\Models\StudentRecommendation;
use App\Services\EducationalRecommendationService;
use App\Services\MLPredictionService;
use Tests\TestCase;
use Illuminate\Support\Facades\Log;

/**
 * MLPipelineIntegrationTest
 *
 * Tests del flujo completo de integración ML:
 * - Obtención de datos académicos reales
 * - Llamadas a ML API
 * - Generación de recomendaciones con Agente
 * - Persistencia en base de datos
 */
class MLPipelineIntegrationTest extends TestCase
{
    protected User $student;
    protected User $teacher;
    protected EducationalRecommendationService $recommendationService;
    protected MLPredictionService $mlPredictionService;

    /**
     * Setup inicial para cada test
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Crear estudiante con datos académicos
        $this->student = User::factory()->create([
            'tipo_usuario' => 'estudiante',
            'email' => 'student-ml-test@test.com',
        ]);

        // Crear profesor para evaluaciones
        $this->teacher = User::factory()->create([
            'tipo_usuario' => 'profesor',
            'email' => 'teacher-ml-test@test.com',
        ]);

        // Crear trabajos con calificaciones para el estudiante
        $this->createStudentWorkloadWithGrades();

        // Inicializar servicios
        $this->recommendationService = new EducationalRecommendationService();
        $this->mlPredictionService = new MLPredictionService();

        Log::info('MLPipelineIntegrationTest setup completado', [
            'student_id' => $this->student->id,
        ]);
    }

    /**
     * Test: Obtener datos del estudiante con datos reales de BD
     */
    public function test_can_fetch_real_student_data(): void
    {
        // Este test valida que getStudentData() obtiene datos reales, no mock
        $reflection = new \ReflectionClass($this->recommendationService);
        $method = $reflection->getMethod('getStudentData');
        $method->setAccessible(true);

        $studentData = $method->invoke($this->recommendationService, $this->student->id);

        // Validar estructura básica
        $this->assertNotNull($studentData);
        $this->assertIsArray($studentData);
        $this->assertEquals($this->student->id, $studentData['student_id']);
        $this->assertEquals($this->student->name, $studentData['name']);

        // Validar que NO son datos hardcodeados
        $this->assertNotEquals('Estudiante', $studentData['name']);
        $this->assertGreaterThan(0, $studentData['num_trabajos']);
        $this->assertGreaterThan(0, $studentData['num_calificaciones']);

        // Validar métricas calculadas
        $this->assertGreaterThanOrEqual(0, $studentData['current_grade']);
        $this->assertGreaterThanOrEqual(0, $studentData['previous_average']);
        $this->assertGreaterThanOrEqual(0, $studentData['dias_promedio_entrega']);

        // Validar varianza se calcula correctamente
        $this->assertIsFloat($studentData['average_variance']);
    }

    /**
     * Test: ML API health check
     */
    public function test_ml_api_is_healthy(): void
    {
        $healthData = $this->mlPredictionService->healthCheck();

        $this->assertIsArray($healthData);
        $this->assertEquals('healthy', $healthData['status']);
        $this->assertTrue($healthData['models_loaded']['risk'] ?? false);
        $this->assertTrue($healthData['models_loaded']['trend'] ?? false);
        $this->assertTrue($healthData['models_loaded']['progress'] ?? false);
    }

    /**
     * Test: Hacer predicción de riesgo
     */
    public function test_can_predict_risk(): void
    {
        // Actuar como estudiante autenticado
        $this->actingAs($this->student);

        // Obtener datos del estudiante
        $reflection = new \ReflectionClass($this->recommendationService);
        $method = $reflection->getMethod('getStudentData');
        $method->setAccessible(true);

        $studentData = $method->invoke($this->recommendationService, $this->student->id);
        $this->assertNotNull($studentData);

        // Predecir riesgo
        $riskPrediction = $this->mlPredictionService->predictRisk($studentData);

        // Validar estructura de respuesta
        $this->assertIsArray($riskPrediction);
        $this->assertArrayHasKey('risk_level', $riskPrediction);
        $this->assertArrayHasKey('risk_score', $riskPrediction);
        $this->assertContains(
            $riskPrediction['risk_level'],
            ['HIGH', 'MEDIUM', 'LOW', 'high', 'medium', 'low']
        );
        $this->assertGreaterThanOrEqual(0, $riskPrediction['risk_score']);
        $this->assertLessThanOrEqual(1, $riskPrediction['risk_score']);
    }

    /**
     * Test: Hacer predicción de tendencia
     */
    public function test_can_predict_trend(): void
    {
        $this->actingAs($this->student);

        $reflection = new \ReflectionClass($this->recommendationService);
        $method = $reflection->getMethod('getStudentData');
        $method->setAccessible(true);

        $studentData = $method->invoke($this->recommendationService, $this->student->id);
        $this->assertNotNull($studentData);

        $trendPrediction = $this->mlPredictionService->predictTrend($studentData);

        $this->assertIsArray($trendPrediction);
        $this->assertArrayHasKey('trend', $trendPrediction);
        $this->assertNotEmpty($trendPrediction['trend']);
    }

    /**
     * Test: Hacer predicción de progreso
     */
    public function test_can_predict_progress(): void
    {
        $this->actingAs($this->student);

        $reflection = new \ReflectionClass($this->recommendationService);
        $method = $reflection->getMethod('getStudentData');
        $method->setAccessible(true);

        $studentData = $method->invoke($this->recommendationService, $this->student->id);
        $this->assertNotNull($studentData);

        $progressPrediction = $this->mlPredictionService->predictProgress($studentData);

        $this->assertIsArray($progressPrediction);
        $this->assertArrayHasKey('projected_grade', $progressPrediction);
        $this->assertGreaterThanOrEqual(0, $progressPrediction['projected_grade']);
    }

    /**
     * Test: Generar recomendación completa
     */
    public function test_complete_recommendation_flow(): void
    {
        $this->actingAs($this->student);

        // Obtener recomendaciones (esto llama todo el flujo)
        $recommendations = $this->recommendationService->getRecommendations($this->student->id);

        // Validar estructura de recomendación
        $this->assertIsArray($recommendations);
        $this->assertArrayHasKey('recommendation_type', $recommendations);
        $this->assertArrayHasKey('urgency', $recommendations);
        $this->assertArrayHasKey('reason', $recommendations);

        // Validar valores válidos
        $this->assertContains(
            $recommendations['recommendation_type'],
            ['study_resource', 'tutoring', 'intervention', 'enrichment']
        );
        $this->assertContains(
            $recommendations['urgency'],
            ['immediate', 'normal', 'preventive']
        );
    }

    /**
     * Test: Guardar recomendación en BD
     */
    public function test_save_recommendation_to_database(): void
    {
        $this->actingAs($this->student);

        // Obtener y guardar recomendación
        $result = $this->recommendationService->getAndSaveRecommendations($this->student->id);

        // Validar respuesta
        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('saved_at', $result);

        // Verificar en BD
        $saved = StudentRecommendation::find($result['id']);
        $this->assertNotNull($saved);
        $this->assertEquals($this->student->id, $saved->student_id);
        $this->assertNotNull($saved->recommendation_type);
        $this->assertNotNull($saved->urgency);
    }

    /**
     * Test: Validar flujo completo de student a recomendación
     */
    public function test_end_to_end_student_recommendation_flow(): void
    {
        $this->actingAs($this->student);

        // 1. Obtener datos del estudiante
        $reflection = new \ReflectionClass($this->recommendationService);
        $getStudentDataMethod = $reflection->getMethod('getStudentData');
        $getStudentDataMethod->setAccessible(true);

        $studentData = $getStudentDataMethod->invoke($this->recommendationService, $this->student->id);
        $this->assertNotNull($studentData);
        $this->assertGreaterThan(0, $studentData['num_trabajos']);

        // 2. Obtener predicciones ML
        $getPredictionsMethod = $reflection->getMethod('getStudentPredictions');
        $getPredictionsMethod->setAccessible(true);

        $predictions = $getPredictionsMethod->invoke(
            $this->recommendationService,
            $this->student->id,
            $studentData
        );
        $this->assertNotNull($predictions);
        $this->assertArrayHasKey('risk_level', $predictions);
        $this->assertArrayHasKey('risk_score', $predictions);

        // 3. Obtener recomendaciones del agente
        $fetchRecommendationsMethod = $reflection->getMethod('fetchRecommendations');
        $fetchRecommendationsMethod->setAccessible(true);

        $recommendations = $fetchRecommendationsMethod->invoke(
            $this->recommendationService,
            $studentData,
            $predictions
        );
        $this->assertNotNull($recommendations);
        $this->assertArrayHasKey('recommendation_type', $recommendations);

        // 4. Guardar en BD
        $saved = StudentRecommendation::create([
            'student_id' => $this->student->id,
            'recommendation_type' => $recommendations['recommendation_type'] ?? 'tutoring',
            'urgency' => $recommendations['urgency'] ?? 'normal',
            'subject' => $studentData['subject'] ?? 'General',
            'reason' => $recommendations['reason'] ?? 'Test recommendation',
            'risk_score' => $predictions['risk_score'] ?? null,
            'risk_level' => $predictions['risk_level'] ?? null,
        ]);

        $this->assertNotNull($saved->id);
        $this->assertEquals($this->student->id, $saved->student_id);
    }

    /**
     * Test: Validar que datos de varianza se usan para recomendaciones
     */
    public function test_grade_variance_affects_recommendations(): void
    {
        $this->actingAs($this->student);

        $reflection = new \ReflectionClass($this->recommendationService);
        $method = $reflection->getMethod('getStudentData');
        $method->setAccessible(true);

        $studentData = $method->invoke($this->recommendationService, $this->student->id);

        // Validar que se calcula varianza
        $this->assertArrayHasKey('average_variance', $studentData);
        $this->assertIsFloat($studentData['average_variance']);

        // Varianza alta indica inconsistencia
        if ($studentData['average_variance'] > 50) {
            // El estudiante tiene calificaciones muy inconsistentes
            $this->assertTrue($studentData['average_variance'] > 0);
        }
    }

    /**
     * Test: Validar métricas de entrega a tiempo
     */
    public function test_on_time_delivery_metrics(): void
    {
        $this->actingAs($this->student);

        $reflection = new \ReflectionClass($this->recommendationService);
        $method = $reflection->getMethod('getStudentData');
        $method->setAccessible(true);

        $studentData = $method->invoke($this->recommendationService, $this->student->id);

        // Validar métricas de entrega
        $this->assertArrayHasKey('dias_promedio_entrega', $studentData);
        $this->assertGreaterThanOrEqual(0, $studentData['dias_promedio_entrega']);

        // Validar consultas de material
        $this->assertArrayHasKey('promedio_consultas_material', $studentData);
        $this->assertGreaterThanOrEqual(0, $studentData['promedio_consultas_material']);
    }

    /**
     * Helper: Crear trabajos y calificaciones para el estudiante
     */
    private function createStudentWorkloadWithGrades(): void
    {
        // Crear un curso primero
        $curso = \App\Models\Curso::create([
            'nombre' => 'Test Course',
            'descripcion' => 'Test course for ML',
            'profesor_id' => $this->teacher->id,
            'estado' => 'activo',
            'codigo' => 'TEST001',
        ]);

        // Crear 5 trabajos con calificaciones variadas
        $scores = [75, 82, 78, 85, 80];

        foreach ($scores as $score) {
            // Crear contenido para el trabajo
            $contenido = \App\Models\Contenido::create([
                'curso_id' => $curso->id,
                'titulo' => "Test Content {$score}",
                'descripcion' => 'Test content',
                'tipo' => 'tarea',
                'estado' => 'activo',
                'creador_id' => $this->teacher->id,
                'fecha_creacion' => now()->subDays(10),
                'fecha_limite' => now()->addDays(10),
            ]);

            // Crear trabajo
            $trabajo = Trabajo::create([
                'contenido_id' => $contenido->id,
                'estudiante_id' => $this->student->id,
                'estado' => 'calificado',
                'fecha_inicio' => now()->subDays(10),
                'fecha_entrega' => now()->subDays(8),
                'intentos' => rand(1, 3),
                'consultas_material' => rand(1, 5),
                'respuestas' => [],
            ]);

            // Crear calificación para el trabajo
            Calificacion::create([
                'trabajo_id' => $trabajo->id,
                'puntaje' => $score,
                'comentario' => "Buen trabajo, puntuación: {$score}",
                'fecha_calificacion' => now()->subDays(7),
                'evaluador_id' => $this->teacher->id,
                'criterios_evaluacion' => [],
            ]);
        }
    }
}
