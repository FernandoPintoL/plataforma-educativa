<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\UnifiedLearningOrchestrator;
use App\Services\StudentClusteringService;
use App\Services\ConceptTopicModelingService;
use App\Services\AnomalyDetectionService;
use App\Services\CorrelationAnalysisService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class UnifiedLearningOrchestratorTest extends TestCase
{
    protected UnifiedLearningOrchestrator $orchestrator;
    protected $clusteringService;
    protected $topicService;
    protected $anomalyService;
    protected $correlationService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->clusteringService = $this->createMock(StudentClusteringService::class);
        $this->topicService = $this->createMock(ConceptTopicModelingService::class);
        $this->anomalyService = $this->createMock(AnomalyDetectionService::class);
        $this->correlationService = $this->createMock(CorrelationAnalysisService::class);

        $this->orchestrator = new UnifiedLearningOrchestrator(
            $this->clusteringService,
            $this->topicService,
            $this->anomalyService,
            $this->correlationService
        );
    }

    /**
     * Test full learning pipeline returns proper structure
     */
    public function test_full_learning_pipeline_returns_valid_structure(): void
    {
        $studentId = 1;

        // Mock the services
        $this->clusteringService->expects($this->once())
            ->method('getClustersSummary')
            ->willReturn([
                'success' => true,
                'total_students' => 100,
                'num_clusters' => 3,
                'distribution' => [
                    ['cluster_id' => 0, 'count' => 35],
                    ['cluster_id' => 1, 'count' => 35],
                    ['cluster_id' => 2, 'count' => 30],
                ],
            ]);

        $this->topicService->expects($this->once())
            ->method('getStudentTopics')
            ->willReturn([
                'success' => true,
                'student_id' => $studentId,
                'dominant_topic' => 'Mathematics',
                'topics' => ['Algebra', 'Geometry'],
            ]);

        $this->anomalyService->expects($this->once())
            ->method('getStudentAnomalies')
            ->willReturn([
                'success' => true,
                'detected_patterns' => [],
            ]);

        $this->correlationService->expects($this->once())
            ->method('analyzeActivityPerformanceRelationship')
            ->willReturn([
                'success' => true,
                'correlation' => 0.75,
            ]);

        // Mock HTTP calls
        Http::fake([
            'http://localhost:8001/*' => Http::response(['success' => true]),
            'http://localhost:8003/*' => Http::response(['success' => true]),
        ]);

        $result = $this->orchestrator->runFullLearningPipeline($studentId);

        // Assert structure
        $this->assertTrue($result['success']);
        $this->assertEquals($studentId, $result['student_id']);
        $this->assertArrayHasKey('timestamp', $result);
        $this->assertArrayHasKey('layers', $result);
        $this->assertArrayHasKey('integrated_insights', $result);

        // Assert layers exist
        $this->assertArrayHasKey('unsupervised_discovery', $result['layers']);
        $this->assertArrayHasKey('supervised_predictions', $result['layers']);
        $this->assertArrayHasKey('agent_synthesis', $result['layers']);
        $this->assertArrayHasKey('adaptive_actions', $result['layers']);
    }

    /**
     * Test unsupervised discovery layer
     */
    public function test_unsupervised_discovery_layer(): void
    {
        $studentId = 1;

        $this->clusteringService->expects($this->once())
            ->method('getClustersSummary')
            ->willReturn([
                'success' => true,
                'total_students' => 100,
                'distribution' => [['cluster_id' => 0, 'count' => 50]],
            ]);

        $this->topicService->expects($this->once())
            ->method('getStudentTopics')
            ->willReturn([
                'success' => true,
                'dominant_topic' => 'Science',
            ]);

        $this->anomalyService->expects($this->once())
            ->method('getStudentAnomalies')
            ->willReturn([
                'success' => true,
                'detected_patterns' => ['unusual_engagement'],
            ]);

        $this->correlationService->expects($this->once())
            ->method('analyzeActivityPerformanceRelationship')
            ->willReturn(['success' => true]);

        Http::fake();

        $result = $this->orchestrator->runFullLearningPipeline($studentId);

        $discoveries = $result['layers']['unsupervised_discovery'];
        $this->assertArrayHasKey('discoveries', $discoveries);
        $this->assertArrayHasKey('cluster_analysis', $discoveries['discoveries']);
        $this->assertArrayHasKey('concept_topics', $discoveries['discoveries']);
        $this->assertArrayHasKey('anomalies', $discoveries['discoveries']);
        $this->assertArrayHasKey('correlations', $discoveries['discoveries']);
    }

    /**
     * Test local synthesis when agent is unavailable
     */
    public function test_local_synthesis_when_agent_unavailable(): void
    {
        $studentId = 1;

        // Mock services
        $this->clusteringService->expects($this->once())
            ->method('getClustersSummary')
            ->willReturn([
                'success' => true,
                'distribution' => [['cluster_id' => 0, 'count' => 50]],
            ]);

        $this->topicService->expects($this->once())
            ->method('getStudentTopics')
            ->willReturn([
                'success' => true,
                'dominant_topic' => 'Mathematics',
            ]);

        $this->anomalyService->expects($this->once())
            ->method('getStudentAnomalies')
            ->willReturn([
                'success' => true,
                'detected_patterns' => ['low_engagement'],
            ]);

        $this->correlationService->expects($this->once())
            ->method('analyzeActivityPerformanceRelationship')
            ->willReturn(['success' => true]);

        // Mock HTTP - supervised works, agent fails
        Http::fake([
            'http://localhost:8001/*' => Http::response(['success' => true]),
            'http://localhost:8003/*' => Http::response(['error' => 'Connection refused'], 500),
        ]);

        $result = $this->orchestrator->runFullLearningPipeline($studentId);

        $synthesis = $result['layers']['agent_synthesis'];
        $this->assertArrayHasKey('local_synthesis', $synthesis);
        $this->assertStringContainsString('local_synthesis', $synthesis['local_synthesis']['method'] ?? '');
    }

    /**
     * Test adaptive actions generation
     */
    public function test_adaptive_actions_generation(): void
    {
        $studentId = 1;

        // Setup mocks
        $this->clusteringService->expects($this->once())
            ->method('getClustersSummary')
            ->willReturn(['success' => true, 'distribution' => []]);

        $this->topicService->expects($this->once())
            ->method('getStudentTopics')
            ->willReturn(['success' => true]);

        $this->anomalyService->expects($this->once())
            ->method('getStudentAnomalies')
            ->willReturn(['success' => true]);

        $this->correlationService->expects($this->once())
            ->method('analyzeActivityPerformanceRelationship')
            ->willReturn(['success' => true]);

        Http::fake();

        $result = $this->orchestrator->runFullLearningPipeline($studentId);

        $actions = $result['layers']['adaptive_actions'];
        $this->assertArrayHasKey('actions', $actions);
        $this->assertArrayHasKey('personalized_learning_path', $actions['actions']);
        $this->assertArrayHasKey('intervention_strategy', $actions['actions']);
        $this->assertArrayHasKey('resource_recommendations', $actions['actions']);
        $this->assertArrayHasKey('timeline', $actions['actions']);
    }

    /**
     * Test integrated insights generation
     */
    public function test_integrated_insights_generation(): void
    {
        $studentId = 1;

        // Setup mocks
        $this->clusteringService->expects($this->once())
            ->method('getClustersSummary')
            ->willReturn([
                'success' => true,
                'distribution' => [['cluster_id' => 0, 'count' => 50]],
            ]);

        $this->topicService->expects($this->once())
            ->method('getStudentTopics')
            ->willReturn(['success' => true]);

        $this->anomalyService->expects($this->once())
            ->method('getStudentAnomalies')
            ->willReturn(['success' => true]);

        $this->correlationService->expects($this->once())
            ->method('analyzeActivityPerformanceRelationship')
            ->willReturn(['success' => true]);

        Http::fake();

        $result = $this->orchestrator->runFullLearningPipeline($studentId);

        $insights = $result['integrated_insights'];
        $this->assertIsArray($insights);
        $this->assertGreater(count($insights), 0);

        // Check for insight types
        $insightTypes = array_column($insights, 'type');
        $this->assertContains('consensus', $insightTypes);
        $this->assertContains('divergence', $insightTypes);
        $this->assertContains('emergent_patterns', $insightTypes);
        $this->assertContains('confidence_score', $insightTypes);
    }

    /**
     * Test platform health status
     */
    public function test_get_platform_health_status(): void
    {
        Http::fake([
            'http://localhost:8001/health' => Http::response([
                'status' => 'healthy',
                'models_loaded' => ['performance_predictor'],
            ]),
            'http://localhost:8003/health' => Http::response([
                'status' => 'healthy',
            ]),
        ]);

        DB::shouldReceive('connection')->andReturnSelf()
            ->shouldReceive('getPdo')->andReturn(true);

        $result = $this->orchestrator->getPlatformHealthStatus();

        $this->assertArrayHasKey('timestamp', $result);
        $this->assertArrayHasKey('layers', $result);
        $this->assertArrayHasKey('overall_status', $result);
    }

    /**
     * Test confidence score calculation
     */
    public function test_confidence_score_calculation(): void
    {
        $studentId = 1;

        // Setup mocks with discoveries
        $this->clusteringService->expects($this->once())
            ->method('getClustersSummary')
            ->willReturn([
                'success' => true,
                'distribution' => [
                    ['cluster_id' => 0, 'count' => 30],
                    ['cluster_id' => 1, 'count' => 30],
                    ['cluster_id' => 2, 'count' => 30],
                ],
            ]);

        $this->topicService->expects($this->once())
            ->method('getStudentTopics')
            ->willReturn(['success' => true]);

        $this->anomalyService->expects($this->once())
            ->method('getStudentAnomalies')
            ->willReturn(['success' => true]);

        $this->correlationService->expects($this->once())
            ->method('analyzeActivityPerformanceRelationship')
            ->willReturn(['success' => true]);

        Http::fake([
            'http://localhost:8001/*' => Http::response(['success' => true]),
            'http://localhost:8003/*' => Http::response(['success' => true]),
        ]);

        $result = $this->orchestrator->runFullLearningPipeline($studentId);

        $insights = $result['integrated_insights'];
        $confidenceInsight = collect($insights)->firstWhere('type', 'confidence_score');

        $this->assertNotNull($confidenceInsight);
        $this->assertArrayHasKey('value', $confidenceInsight);
        $this->assertGreaterThanOrEqual(0, $confidenceInsight['value']);
        $this->assertLessThanOrEqual(1, $confidenceInsight['value']);
    }

    /**
     * Test error handling in pipeline
     */
    public function test_pipeline_error_handling(): void
    {
        $studentId = 999;

        // Mock services to throw exceptions
        $this->clusteringService->expects($this->once())
            ->method('getClustersSummary')
            ->willThrowException(new \Exception('Database connection error'));

        Http::fake();

        $result = $this->orchestrator->runFullLearningPipeline($studentId);

        // Should still complete with error handling
        $this->assertArrayHasKey('success', $result);
        // Either success is false or it handles the error gracefully
    }
}
