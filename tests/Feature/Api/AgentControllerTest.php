<?php

namespace Tests\Feature\Api;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AgentControllerTest extends TestCase
{
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        Http::fake();
        $this->user = $this->createUserWithRole('profesor');
    }

    /**
     * Helper to create authenticated user with role
     */
    protected function createUserWithRole(string $role)
    {
        return \App\Models\User::factory()->create([
            'role' => $role,
        ]);
    }

    /**
     * Test synthesize endpoint success
     */
    public function test_synthesize_endpoint_success()
    {
        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => 1,
                'synthesis' => ['text' => 'Test synthesis'],
                'reasoning' => ['Step 1'],
                'confidence' => 0.8,
                'timestamp' => now()->toIso8601String(),
                'method' => 'agent_llm',
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/agent/synthesize/1', [
                'discoveries' => ['cluster_analysis' => []],
                'predictions' => [],
            ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'student_id', 'synthesis']);
    }

    /**
     * Test synthesis endpoint validation
     */
    public function test_synthesize_endpoint_validation()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/agent/synthesize/1', [
                'discoveries' => 'invalid',  // Should be array
            ]);

        $response->assertStatus(422);
        $response->assertJsonStructure(['errors']);
    }

    /**
     * Test synthesis without authentication
     */
    public function test_synthesize_requires_authentication()
    {
        $response = $this->postJson('/api/agent/synthesize/1', [
            'discoveries' => [],
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test synthesis requires profesor or admin role
     */
    public function test_synthesize_requires_profesor_or_admin_role()
    {
        $studentUser = $this->createUserWithRole('estudiante');

        $response = $this->actingAs($studentUser)
            ->postJson('/api/agent/synthesize/1', [
                'discoveries' => [],
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test reasoning endpoint
     */
    public function test_reasoning_endpoint_success()
    {
        Http::fake([
            'http://localhost:8003/reasoning' => Http::response([
                'success' => true,
                'reasoning_steps' => ['Step 1', 'Step 2'],
                'key_insights' => ['Insight 1'],
                'recommendations' => ['Recommendation 1'],
                'confidence' => 0.8,
                'timestamp' => now()->toIso8601String(),
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/agent/reasoning/1?discoveries={"cluster":{}}&predictions={}');

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'reasoning_steps']);
    }

    /**
     * Test intervention endpoint
     */
    public function test_intervention_endpoint_success()
    {
        Http::fake([
            'http://localhost:8003/intervention-strategy' => Http::response([
                'success' => true,
                'student_id' => 1,
                'strategy' => ['type' => 'personalized'],
                'actions' => ['Action 1'],
                'resources' => [],
                'confidence' => 0.75,
                'timestamp' => now()->toIso8601String(),
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/agent/intervention/1', [
                'discoveries' => [],
                'predictions' => [],
            ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'strategy', 'actions']);
    }

    /**
     * Test health check endpoint
     */
    public function test_health_check_endpoint()
    {
        Http::fake([
            'http://localhost:8003/health' => Http::response([
                'status' => 'healthy',
                'llm_available' => true,
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/agent/health');

        $response->assertStatus(200);
        $response->assertJsonStructure(['status']);
    }

    /**
     * Test info endpoint
     */
    public function test_info_endpoint()
    {
        Http::fake([
            'http://localhost:8003/' => Http::response([
                'name' => 'Agent Synthesis Service',
                'version' => '1.0.0',
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/agent/info');

        $response->assertStatus(200);
    }

    /**
     * Test complete analysis endpoint
     */
    public function test_complete_analysis_endpoint()
    {
        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => 1,
                'synthesis' => [],
                'reasoning' => [],
                'confidence' => 0.8,
                'timestamp' => now()->toIso8601String(),
                'method' => 'agent_llm',
            ], 200),
            'http://localhost:8003/reasoning' => Http::response([
                'success' => true,
                'reasoning_steps' => [],
                'key_insights' => [],
                'recommendations' => [],
                'confidence' => 0.8,
                'timestamp' => now()->toIso8601String(),
            ], 200),
            'http://localhost:8003/intervention-strategy' => Http::response([
                'success' => true,
                'student_id' => 1,
                'strategy' => [],
                'actions' => [],
                'resources' => [],
                'confidence' => 0.75,
                'timestamp' => now()->toIso8601String(),
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/agent/complete-analysis/1', [
                'discoveries' => [],
                'predictions' => [],
            ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'student_id',
            'synthesis',
            'reasoning',
            'intervention',
            'timestamp',
        ]);
    }

    /**
     * Test test endpoint
     */
    public function test_test_endpoint()
    {
        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => 1,
                'synthesis' => [],
                'reasoning' => [],
                'confidence' => 0.7,
                'timestamp' => now()->toIso8601String(),
                'method' => 'local_synthesis',
            ], 200),
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/agent/test');

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'message']);
    }

    /**
     * Test error handling when agent service fails
     */
    public function test_synthesize_error_when_agent_fails()
    {
        Http::fake([
            'http://localhost:8003/synthesize' => Http::response(null, 500),
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/api/agent/synthesize/1', [
                'discoveries' => [],
            ]);

        $response->assertStatus(500);
        $response->assertJsonStructure(['success']);
        $this->assertFalse($response->json('success'));
    }

    /**
     * Test all endpoints protected by auth
     */
    public function test_all_endpoints_require_authentication()
    {
        $endpoints = [
            ['POST', '/api/agent/synthesize/1'],
            ['GET', '/api/agent/reasoning/1'],
            ['POST', '/api/agent/intervention/1'],
            ['GET', '/api/agent/health'],
            ['GET', '/api/agent/info'],
            ['POST', '/api/agent/complete-analysis/1'],
            ['GET', '/api/agent/test'],
        ];

        foreach ($endpoints as [$method, $endpoint]) {
            $response = $this->call($method, $endpoint);
            $this->assertEquals(401, $response->status(), "Endpoint {$method} {$endpoint} should require authentication");
        }
    }

    /**
     * Test admin can access agent endpoints
     */
    public function test_admin_can_access_agent_endpoints()
    {
        $admin = $this->createUserWithRole('admin');

        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => 1,
                'synthesis' => [],
                'reasoning' => [],
                'confidence' => 0.8,
                'timestamp' => now()->toIso8601String(),
                'method' => 'agent_llm',
            ], 200),
        ]);

        $response = $this->actingAs($admin)
            ->postJson('/api/agent/synthesize/1', [
                'discoveries' => [],
            ]);

        $response->assertStatus(200);
    }

    /**
     * Test synthesize with complete discovery data
     */
    public function test_synthesize_with_complete_discovery_data()
    {
        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => 1,
                'synthesis' => ['text' => 'Comprehensive analysis'],
                'reasoning' => ['Analysis step'],
                'confidence' => 0.85,
                'timestamp' => now()->toIso8601String(),
                'method' => 'agent_llm',
            ], 200),
        ]);

        $discoveries = [
            'cluster_analysis' => [
                'data' => ['distribution' => [['cluster_id' => 0, 'count' => 100]]],
            ],
            'anomalies' => [
                'data' => ['detected_patterns' => ['pattern1', 'pattern2']],
            ],
            'concept_topics' => [
                'data' => ['dominant_topic' => 'Mathematics'],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/agent/synthesize/1', [
                'discoveries' => $discoveries,
                'predictions' => ['model_type' => 'supervised'],
                'context' => 'unified_learning_pipeline',
            ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
    }

    /**
     * Test multiple students analysis
     */
    public function test_analyze_multiple_students()
    {
        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => 0,
                'synthesis' => [],
                'reasoning' => [],
                'confidence' => 0.7,
                'timestamp' => now()->toIso8601String(),
                'method' => 'agent_llm',
            ], 200),
        ]);

        for ($studentId = 1; $studentId <= 3; $studentId++) {
            $response = $this->actingAs($this->user)
                ->postJson("/api/agent/synthesize/{$studentId}", [
                    'discoveries' => [],
                ]);

            $response->assertStatus(200);
        }
    }

    /**
     * Test API rate limiting or concurrent requests
     */
    public function test_handles_rapid_requests()
    {
        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => 1,
                'synthesis' => [],
                'reasoning' => [],
                'confidence' => 0.7,
                'timestamp' => now()->toIso8601String(),
                'method' => 'agent_llm',
            ], 200),
        ]);

        for ($i = 0; $i < 5; $i++) {
            $response = $this->actingAs($this->user)
                ->postJson('/api/agent/synthesize/1', [
                    'discoveries' => [],
                ]);

            $response->assertStatus(200);
        }
    }
}
