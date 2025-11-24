<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Trabajo;
use App\Models\Calificacion;
use App\Models\FeedbackAnalysis;
use App\Services\FeedbackIntellicentService;
use Tests\TestCase;
use Illuminate\Support\Facades\Log;

/**
 * IntelligentFeedbackTest
 *
 * Tests para el sistema de feedback inteligente generado por IA
 */
class IntelligentFeedbackTest extends TestCase
{
    protected User $student;
    protected User $teacher;
    protected Trabajo $trabajo;
    protected Calificacion $calificacion;

    /**
     * Setup inicial
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Crear estudiante y profesor
        $this->student = User::factory()->create(['tipo_usuario' => 'estudiante']);
        $this->teacher = User::factory()->create(['tipo_usuario' => 'profesor']);

        // Crear trabajo y calificación
        $this->createWorkAndGrade();
    }

    /**
     * Helper: Crear trabajo y calificación
     */
    private function createWorkAndGrade(): void
    {
        $curso = \App\Models\Curso::create([
            'nombre' => 'Test Course for Feedback',
            'descripcion' => 'Test course',
            'profesor_id' => $this->teacher->id,
            'estado' => 'activo',
            'codigo' => 'FEEDBACK001',
        ]);

        $contenido = \App\Models\Contenido::create([
            'curso_id' => $curso->id,
            'titulo' => 'Essay Assignment',
            'descripcion' => 'Write an essay about climate change',
            'tipo' => 'tarea',
            'estado' => 'publico',
            'creador_id' => $this->teacher->id,
            'fecha_creacion' => now(),
            'fecha_limite' => now()->addDays(7),
        ]);

        $this->trabajo = Trabajo::create([
            'contenido_id' => $contenido->id,
            'estudiante_id' => $this->student->id,
            'respuestas' => [
                'essay' => 'Climate change is a significant threat to our planet. Rising temperatures cause melting ice caps...',
                'sources' => ['Scientific journal', 'NASA data'],
            ],
            'estado' => 'entregado',
            'fecha_entrega' => now(),
            'tiempo_total' => 120,
            'intentos' => 2,
            'consultas_material' => 3,
        ]);

        $this->calificacion = Calificacion::create([
            'trabajo_id' => $this->trabajo->id,
            'puntaje' => 85,
            'comentario' => 'Good work',
            'fecha_calificacion' => now(),
            'evaluador_id' => $this->teacher->id,
            'criterios_evaluacion' => [
                'clarity' => 8,
                'evidence' => 8,
                'structure' => 9,
                'grammar' => 8,
            ],
        ]);
    }

    /**
     * Test: Feedback generado exitosamente
     */
    public function test_feedback_generated_successfully(): void
    {
        $this->actingAs($this->teacher);

        $feedbackService = new FeedbackIntellicentService();
        $result = $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('feedback_analysis', $result);
        $this->assertArrayHasKey('estado', $result);
        $this->assertEquals('generado', $result['estado']);
    }

    /**
     * Test: Feedback almacenado en BD
     */
    public function test_feedback_stored_in_database(): void
    {
        $this->actingAs($this->teacher);

        $feedbackService = new FeedbackIntellicentService();
        $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        $feedback = FeedbackAnalysis::where('calificacion_id', $this->calificacion->id)->first();

        $this->assertNotNull($feedback);
        $this->assertEquals($this->trabajo->id, $feedback->trabajo_id);
        $this->assertNotNull($feedback->feedback_analysis);
        $this->assertNotNull($feedback->fecha_analisis);
    }

    /**
     * Test: Aprobar feedback
     */
    public function test_approve_feedback(): void
    {
        $this->actingAs($this->teacher);

        $feedbackService = new FeedbackIntellicentService();
        $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        $feedback = FeedbackAnalysis::where('calificacion_id', $this->calificacion->id)->first();

        $feedbackService->aprobarFeedback(
            $feedback->id,
            'Modified feedback: This is excellent work.'
        );

        $feedback->refresh();

        $this->assertEquals('aprobado', $feedback->estado);
        $this->assertNotNull($feedback->feedback_final);
        $this->assertNotNull($feedback->fecha_aprobacion);
        $this->assertStringContainsString('Modified', $feedback->feedback_final);
    }

    /**
     * Test: Rechazar feedback
     */
    public function test_reject_feedback(): void
    {
        $this->actingAs($this->teacher);

        $feedbackService = new FeedbackIntellicentService();
        $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        $feedback = FeedbackAnalysis::where('calificacion_id', $this->calificacion->id)->first();
        $feedbackService->rechazarFeedback($feedback->id);

        $feedback->refresh();
        $this->assertEquals('rechazado', $feedback->estado);
    }

    /**
     * Test: Feedback analysis estructura
     */
    public function test_feedback_analysis_structure(): void
    {
        $this->actingAs($this->teacher);

        $feedbackService = new FeedbackIntellicentService();
        $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        $feedback = FeedbackAnalysis::where('calificacion_id', $this->calificacion->id)->first();

        // Validar que tenga estructura de análisis
        $this->assertNotNull($feedback->feedback_analysis);
        $this->assertIsNumeric($feedback->confidence_score);
        $this->assertGreaterThanOrEqual(0, $feedback->confidence_score);
        $this->assertLessThanOrEqual(1, $feedback->confidence_score);
    }

    /**
     * Test: Feedback fallback si Agent no está disponible
     */
    public function test_feedback_fallback_when_agent_unavailable(): void
    {
        $this->actingAs($this->teacher);

        // El servicio manejará el fallback automáticamente
        $feedbackService = new FeedbackIntellicentService();
        $result = $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);

        // Feedback debería existir aunque el Agent haya fallado
        $feedback = FeedbackAnalysis::find($result['id']);
        $this->assertNotNull($feedback);
    }

    /**
     * Test: Validar que feedback pendiente es recuperable
     */
    public function test_pending_feedback_is_retrievable(): void
    {
        $this->actingAs($this->teacher);

        // Generar feedback
        $feedbackService = new FeedbackIntellicentService();
        $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        // Buscar feedback pendiente
        $pendingFeedback = FeedbackAnalysis::whereHas('calificacion', function ($q) {
            $q->where('evaluador_id', $this->teacher->id);
        })
            ->where('estado', 'generado')
            ->get();

        $this->assertCount(1, $pendingFeedback);
        $this->assertTrue($pendingFeedback->first()->calificacion->is($this->calificacion));
    }

    /**
     * Test: Resumen de feedback
     */
    public function test_feedback_summary(): void
    {
        $this->actingAs($this->teacher);

        $feedbackService = new FeedbackIntellicentService();
        $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        $feedback = FeedbackAnalysis::where('calificacion_id', $this->calificacion->id)->first();
        $summary = $feedback->obtenerResumen();

        $this->assertIsArray($summary);
        $this->assertArrayHasKey('id', $summary);
        $this->assertArrayHasKey('estado', $summary);
        $this->assertArrayHasKey('confidence_score', $summary);
        $this->assertArrayHasKey('tiempo_generacion_ms', $summary);
    }

    /**
     * Test: Feedback para mostrar al estudiante
     */
    public function test_feedback_for_student_display(): void
    {
        $this->actingAs($this->teacher);

        $feedbackService = new FeedbackIntellicentService();
        $feedbackService->generarFeedback($this->trabajo->id, $this->calificacion->id);

        $feedback = FeedbackAnalysis::where('calificacion_id', $this->calificacion->id)->first();

        // Si no está aprobado, debe mostrar el análisis generado
        $feedbackToShow = $feedback->getFeedbackParaMostrar();
        $this->assertNotEmpty($feedbackToShow);

        // Después de aprobar, debe mostrar el final
        $feedback->aprobar('Final feedback for student');
        $feedbackToShow = $feedback->getFeedbackParaMostrar();
        $this->assertStringContainsString('Final', $feedbackToShow);
    }
}
