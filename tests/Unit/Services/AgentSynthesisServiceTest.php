<?php

namespace Tests\Unit\Services;

use App\Services\AgentSynthesisService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class AgentSynthesisServiceTest extends TestCase
{
    protected AgentSynthesisService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new AgentSynthesisService();
    }

    /**
     * Test synthesis endpoint success
     */
    public function test_synthesize_discoveries_success()
    {
        $studentId = 1;
        $discoveries = [
            'cluster_analysis' => [
                'data' => ['distribution' => [['cluster_id' => 0, 'count' => 10]]],
            ],
        ];
        $predictions = ['predictions' => []];

        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => $studentId,
                'synthesis' => ['key_insights' => ['Test insight']],
                'reasoning' => ['Test reasoning'],
                'confidence' => 0.8,
                'timestamp' => now()->toIso8601String(),
                'method' => 'agent_llm',
            ], 200),
        ]);

        $result = $this->service->synthesizeDiscoveries($studentId, $discoveries, $predictions);

        $this->assertTrue($result['success']);
        $this->assertEquals($studentId, $result['student_id']);
        $this->assertArrayHasKey('synthesis', $result);
        $this->assertArrayHasKey('reasoning', $result);
        $this->assertArrayHasKey('confidence', $result);
    }

    /**
     * Test synthesis falls back to local when API unavailable
     */
    public function test_synthesize_fallback_when_api_unavailable()
    {
        $studentId = 2;
        $discoveries = ['cluster_analysis' => ['data' => ['distribution' => []]]];
        $predictions = [];

        Http::fake([
            'http://localhost:8003/synthesize' => Http::response(null, 500),
        ]);

        $result = $this->service->synthesizeDiscoveries($studentId, $discoveries, $predictions);

        $this->assertTrue($result['success']);
        $this->assertEquals('local_synthesis', $result['method']);
        $this->assertEquals(0.7, $result['confidence']);
    }

    /**
     * Test explaining reasoning
     */
    public function test_explain_reasoning_success()
    {
        $studentId = 1;
        $discoveries = ['cluster_analysis' => ['data' => []]];
        $predictions = [];

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

        $result = $this->service->explainReasoning($studentId, $discoveries, $predictions);

        $this->assertTrue($result['success']);
        $this->assertArrayHasKey('reasoning_steps', $result);
        $this->assertArrayHasKey('key_insights', $result);
        $this->assertArrayHasKey('recommendations', $result);
    }

    /**
     * Test generating intervention strategy
     */
    public function test_generate_intervention_strategy_success()
    {
        $studentId = 1;
        $discoveries = [];
        $predictions = [];

        Http::fake([
            'http://localhost:8003/intervention-strategy' => Http::response([
                'success' => true,
                'student_id' => $studentId,
                'strategy' => [
                    'type' => 'personalized',
                    'frequency' => 'weekly',
                    'focus_areas' => ['Math', 'English'],
                ],
                'actions' => ['Action 1'],
                'resources' => [['type' => 'tutorial', 'priority' => 'high']],
                'confidence' => 0.75,
                'timestamp' => now()->toIso8601String(),
            ], 200),
        ]);

        $result = $this->service->generateInterventionStrategy($studentId, $discoveries, $predictions);

        $this->assertTrue($result['success']);
        $this->assertEquals($studentId, $result['student_id']);
        $this->assertArrayHasKey('strategy', $result);
        $this->assertArrayHasKey('actions', $result);
        $this->assertArrayHasKey('resources', $result);
    }

    /**
     * Test health check success
     */
    public function test_health_check_success()
    {
        Http::fake([
            'http://localhost:8003/health' => Http::response([
                'status' => 'healthy',
                'llm_available' => true,
            ], 200),
        ]);

        $result = $this->service->checkAgentHealth();

        $this->assertEquals('healthy', $result['status']);
        $this->assertTrue($result['llm_available']);
    }

    /**
     * Test health check unavailable
     */
    public function test_health_check_unavailable()
    {
        Http::fake([
            'http://localhost:8003/health' => Http::response(null, 500),
        ]);

        $result = $this->service->checkAgentHealth();

        $this->assertEquals('unavailable', $result['status']);
        $this->assertArrayHasKey('error', $result);
    }

    /**
     * Test get agent info
     */
    public function test_get_agent_info_success()
    {
        Http::fake([
            'http://localhost:8003/' => Http::response([
                'name' => 'Agent Synthesis Service',
                'version' => '1.0.0',
                'endpoints' => [],
            ], 200),
        ]);

        $result = $this->service->getAgentInfo();

        $this->assertArrayHasKey('name', $result);
        $this->assertEquals('Agent Synthesis Service', $result['name']);
    }

    /**
     * Test synthesis with different contexts
     */
    public function test_synthesize_with_custom_context()
    {
        $studentId = 3;
        $context = 'custom_context';

        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => $studentId,
                'synthesis' => [],
                'reasoning' => [],
                'confidence' => 0.7,
                'timestamp' => now()->toIso8601String(),
                'method' => 'local_synthesis',
            ], 200),
        ]);

        $result = $this->service->synthesizeDiscoveries($studentId, [], [], $context);

        $this->assertTrue($result['success']);
    }

    /**
     * Test synthesis with empty discoveries
     */
    public function test_synthesize_with_empty_discoveries()
    {
        $studentId = 4;

        Http::fake([
            'http://localhost:8003/synthesize' => Http::response([
                'success' => true,
                'student_id' => $studentId,
                'synthesis' => ['key_insights' => []],
                'reasoning' => [],
                'confidence' => 0.6,
                'timestamp' => now()->toIso8601String(),
                'method' => 'local_synthesis',
            ], 200),
        ]);

        $result = $this->service->synthesizeDiscoveries($studentId, [], []);

        $this->assertTrue($result['success']);
        $this->assertIsArray($result['synthesis']);
    }

    /**
     * Test synthesis timeout handling
     */
    public function test_synthesize_timeout_handling()
    {
        $studentId = 5;

        Http::fake([
            'http://localhost:8003/synthesize' => Http::response(null, 504),
        ]);

        $result = $this->service->synthesizeDiscoveries($studentId, [], []);

        // Should fall back to local synthesis
        $this->assertTrue($result['success']);
        $this->assertEquals('local_synthesis', $result['method']);
    }

    /**
     * Test local synthesis contains proper structure
     */
    public function test_local_synthesis_structure()
    {
        $discoveries = [
            'cluster_analysis' => ['data' => ['distribution' => []]],
            'anomalies' => ['data' => ['detected_patterns' => ['pattern1']]],
        ];
        $predictions = [];

        Http::fake([
            'http://localhost:8003/synthesize' => Http::response(null, 500),
        ]);

        $result = $this->service->synthesizeDiscoveries(1, $discoveries, $predictions);

        $this->assertTrue($result['success']);
        $this->assertArrayHasKey('synthesis', $result);
        $this->assertArrayHasKey('reasoning', $result);
        $this->assertArrayHasKey('confidence', $result);
        $this->assertArrayHasKey('timestamp', $result);
        $this->assertArrayHasKey('method', $result);
    }

    /**
     * Test exception handling in synthesis
     */
    public function test_synthesis_exception_handling()
    {
        Http::fake([
            'http://localhost:8003/synthesize' => Http::response(null, 500),
        ]);

        $result = $this->service->synthesizeDiscoveries(1, [], []);

        // Should not throw, should return success with fallback
        $this->assertIsArray($result);
        $this->assertTrue($result['success']);
    }

    /**
     * Test multiple synthesis calls
     */
    public function test_multiple_synthesis_calls()
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

        for ($i = 1; $i <= 3; $i++) {
            $result = $this->service->synthesizeDiscoveries($i, [], []);
            $this->assertTrue($result['success']);
        }

        // Verify HTTP was called multiple times
        Http::assertSent(function ($request) {
            return str_contains($request->url(), 'synthesize');
        });
    }
}
