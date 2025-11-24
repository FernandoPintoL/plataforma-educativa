<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\StudentRecommendation;
use Tests\TestCase;

/**
 * RecommendationTest
 *
 * Tests para el sistema de recomendaciones educativas
 * Cubre: API endpoints, autenticación, autorización, flujos de usuario
 */
class RecommendationTest extends TestCase
{
    protected User $student;
    protected User $teacher;
    protected StudentRecommendation $recommendation;

    /**
     * Setup inicial para cada test
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario estudiante
        $this->student = User::factory()->create([
            'role' => 'estudiante',
            'email' => 'estudiante@test.com',
        ]);

        // Crear usuario profesor (teacher role for API authorization)
        $this->teacher = User::factory()->create([
            'role' => 'teacher',
            'email' => 'profesor@test.com',
        ]);

        // Crear recomendación de prueba
        $this->recommendation = StudentRecommendation::create([
            'student_id' => $this->student->id,
            'recommendation_type' => 'study_resource',
            'urgency' => 'normal',
            'subject' => 'mathematics',
            'reason' => 'Tu desempeño en matemáticas ha bajado',
            'risk_score' => 0.45,
            'risk_level' => 'MEDIUM',
            'accepted' => false,
            'completed' => false,
            'effectiveness_rating' => null,
        ]);
    }

    /**
     * Test: Obtener mis recomendaciones como estudiante autenticado
     */
    public function test_student_can_get_their_recommendations(): void
    {
        $response = $this->actingAs($this->student)
            ->getJson('/api/recommendations/my');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data',
                'timestamp',
            ])
            ->assertJsonPath('status', 'success');

        // Validar que la recomendación esté en los datos
        $this->assertNotNull($response->json('data'));
    }

    /**
     * Test: No autenticado no puede obtener recomendaciones
     */
    public function test_unauthenticated_user_cannot_get_recommendations(): void
    {
        $response = $this->getJson('/api/recommendations/my');

        $response->assertStatus(401);
    }

    /**
     * Test: Ver detalle de una recomendación
     */
    public function test_student_can_view_recommendation_detail(): void
    {
        $response = $this->actingAs($this->student)
            ->getJson("/api/recommendations/{$this->recommendation->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'id',
                    'student_id',
                    'recommendation_type',
                    'reason',
                ],
                'timestamp',
            ]);
    }

    /**
     * Test: Estudiante no puede ver recomendación de otro estudiante
     */
    public function test_student_cannot_view_other_student_recommendation(): void
    {
        // Crear otro estudiante
        $otherStudent = User::factory()->create(['role' => 'estudiante']);

        $response = $this->actingAs($otherStudent)
            ->getJson("/api/recommendations/{$this->recommendation->id}");

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error');
    }

    /**
     * Test: Aceptar una recomendación
     */
    public function test_student_can_accept_recommendation(): void
    {
        $response = $this->actingAs($this->student)
            ->postJson("/api/recommendations/{$this->recommendation->id}/accept");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('message', 'Recomendación aceptada');

        // Verificar en base de datos
        $this->assertTrue(
            StudentRecommendation::find($this->recommendation->id)->accepted
        );
    }

    /**
     * Test: Completar una recomendación con rating
     */
    public function test_student_can_complete_recommendation(): void
    {
        // Primero aceptar
        $this->recommendation->update(['accepted' => true]);

        $response = $this->actingAs($this->student)
            ->postJson(
                "/api/recommendations/{$this->recommendation->id}/complete",
                ['effectiveness_rating' => 4]
            );

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('message', 'Recomendación completada');

        // Verificar en base de datos
        $updated = StudentRecommendation::find($this->recommendation->id);
        $this->assertTrue($updated->completed);
        $this->assertEquals(4, $updated->effectiveness_rating);
    }

    /**
     * Test: Validación de rating (debe ser 1-5)
     */
    public function test_effectiveness_rating_must_be_valid(): void
    {
        $this->recommendation->update(['accepted' => true]);

        // Rating inválido (6)
        $response = $this->actingAs($this->student)
            ->postJson(
                "/api/recommendations/{$this->recommendation->id}/complete",
                ['effectiveness_rating' => 6]
            );

        $response->assertStatus(422)
            ->assertJsonPath('status', 'error');
    }

    /**
     * Test: Obtener historial de recomendaciones
     */
    public function test_student_can_get_recommendation_history(): void
    {
        // Crear varias recomendaciones completadas
        for ($i = 0; $i < 3; $i++) {
            StudentRecommendation::create([
                'student_id' => $this->student->id,
                'recommendation_type' => 'study_resource',
                'urgency' => 'preventive',
                'subject' => 'mathematics',
                'reason' => "Recomendación histórica {$i}",
                'risk_score' => 0.2,
                'risk_level' => 'LOW',
                'accepted' => true,
                'completed' => true,
                'effectiveness_rating' => 5,
            ]);
        }

        $response = $this->actingAs($this->student)
            ->getJson('/api/recommendations/history?limit=5');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data',
                'count',
                'timestamp',
            ])
            ->assertJsonPath('status', 'success');

        // Validar que hay historial
        $count = $response->json('count');
        $this->assertGreaterThan(0, $count);
    }

    /**
     * Test: Obtener estadísticas de recomendaciones
     */
    public function test_student_can_get_recommendation_stats(): void
    {
        // Crear recomendaciones en diferentes estados
        $this->recommendation->update(['accepted' => true]);

        StudentRecommendation::create([
            'student_id' => $this->student->id,
            'recommendation_type' => 'intervention',
            'urgency' => 'immediate',
            'subject' => 'language',
            'reason' => 'Test recomendación',
            'risk_score' => 0.6,
            'risk_level' => 'HIGH',
            'accepted' => false,
            'completed' => false,
        ]);

        $response = $this->actingAs($this->student)
            ->getJson('/api/recommendations/stats');

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonStructure([
                'status',
                'data',
                'timestamp',
            ]);
    }

    /**
     * Test: Profesor puede ver recomendaciones de un estudiante
     */
    public function test_teacher_can_view_student_recommendations(): void
    {
        $response = $this->actingAs($this->teacher)
            ->getJson("/api/recommendations/student/{$this->student->id}");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('student_id', $this->student->id);
    }

    /**
     * Test: Estudiante no puede ver recomendaciones de otro estudiante por endpoint admin
     */
    public function test_student_cannot_access_other_student_endpoint(): void
    {
        $otherStudent = User::factory()->create(['role' => 'estudiante']);

        $response = $this->actingAs($otherStudent)
            ->getJson("/api/recommendations/student/{$this->student->id}");

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error');
    }

    /**
     * Test: No se puede aceptar recomendación de otro estudiante
     */
    public function test_cannot_accept_other_student_recommendation(): void
    {
        $otherStudent = User::factory()->create(['role' => 'estudiante']);

        $response = $this->actingAs($otherStudent)
            ->postJson("/api/recommendations/{$this->recommendation->id}/accept");

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error');

        // Verificar que no fue aceptada
        $this->assertFalse(
            StudentRecommendation::find($this->recommendation->id)->accepted
        );
    }

    /**
     * Test: Recomendación no encontrada retorna 404
     */
    public function test_not_found_recommendation_returns_404(): void
    {
        $response = $this->actingAs($this->student)
            ->getJson('/api/recommendations/99999');

        $response->assertStatus(404)
            ->assertJsonPath('status', 'error');
    }

    /**
     * Test: Flujo completo: Aceptar → Completar
     */
    public function test_complete_recommendation_flow(): void
    {
        // 1. Obtener recomendaciones
        $getResponse = $this->actingAs($this->student)
            ->getJson('/api/recommendations/my');
        $getResponse->assertStatus(200);

        // 2. Ver detalle
        $showResponse = $this->actingAs($this->student)
            ->getJson("/api/recommendations/{$this->recommendation->id}");
        $showResponse->assertStatus(200);

        // 3. Aceptar
        $acceptResponse = $this->actingAs($this->student)
            ->postJson("/api/recommendations/{$this->recommendation->id}/accept");
        $acceptResponse->assertStatus(200);

        // Verificar estado después de aceptar
        $afterAccept = StudentRecommendation::find($this->recommendation->id);
        $this->assertTrue($afterAccept->accepted);
        $this->assertFalse($afterAccept->completed);

        // 4. Completar
        $completeResponse = $this->actingAs($this->student)
            ->postJson(
                "/api/recommendations/{$this->recommendation->id}/complete",
                ['effectiveness_rating' => 4]
            );
        $completeResponse->assertStatus(200);

        // Verificar estado final
        $final = StudentRecommendation::find($this->recommendation->id);
        $this->assertTrue($final->accepted);
        $this->assertTrue($final->completed);
        $this->assertEquals(4, $final->effectiveness_rating);
    }

    /**
     * Test: Múltiples recomendaciones en diferentes estados
     */
    public function test_multiple_recommendations_different_states(): void
    {
        // Pendiente
        $pending = $this->recommendation;

        // Aceptada
        $accepted = StudentRecommendation::create([
            'student_id' => $this->student->id,
            'recommendation_type' => 'enrichment',
            'urgency' => 'preventive',
            'subject' => 'science',
            'reason' => 'Recomendación aceptada',
            'risk_score' => 0.2,
            'risk_level' => 'LOW',
            'accepted' => true,
            'completed' => false,
        ]);

        // Completada
        $completed = StudentRecommendation::create([
            'student_id' => $this->student->id,
            'recommendation_type' => 'tutoring',
            'urgency' => 'immediate',
            'subject' => 'mathematics',
            'reason' => 'Recomendación completada',
            'risk_score' => 0.7,
            'risk_level' => 'HIGH',
            'accepted' => true,
            'completed' => true,
            'effectiveness_rating' => 5,
        ]);

        // Obtener todas
        $response = $this->actingAs($this->student)
            ->getJson('/api/recommendations/my');

        $response->assertStatus(200);

        // Validar que todas están presentes
        $recommendations = $response->json('data');
        $this->assertIsArray($recommendations);
    }

    /**
     * Test: Validación de entrada en complete
     */
    public function test_complete_with_invalid_input(): void
    {
        $this->recommendation->update(['accepted' => true]);

        // Rating no numérico
        $response = $this->actingAs($this->student)
            ->postJson(
                "/api/recommendations/{$this->recommendation->id}/complete",
                ['effectiveness_rating' => 'invalid']
            );

        $response->assertStatus(422);
    }

    /**
     * Test: Timestamp en respuestas
     */
    public function test_responses_include_timestamp(): void
    {
        $response = $this->actingAs($this->student)
            ->getJson('/api/recommendations/my');

        $response->assertStatus(200)
            ->assertJsonStructure(['timestamp']);

        $timestamp = $response->json('timestamp');
        $this->assertNotNull($timestamp);
    }
}
