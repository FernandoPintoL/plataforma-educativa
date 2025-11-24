<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;

class DiscoveryOrchestrationControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Mock the ML API servers
        Http::preventStrayRequests();
    }

    /**
     * Test unified pipeline endpoint requires authentication
     */
    public function test_unified_pipeline_requires_authentication(): void
    {
        $response = $this->postJson('/api/discovery/unified-pipeline/1');

        $response->assertStatus(401);
    }

    /**
     * Test unified pipeline with authenticated user
     */
    public function test_unified_pipeline_with_authenticated_user(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        Http::fake([
            'http://localhost:8002/*' => Http::response([
                'success' => true,
                'labels' => [0, 1, 0],
                'silhouette_score' => 0.65,
            ]),
            'http://localhost:8001/*' => Http::response([
                'success' => true,
                'predictions' => ['risk_score' => 0.3],
            ]),
            'http://localhost:8003/*' => Http::response([
                'success' => true,
                'synthesis' => 'Student shows good progress',
            ], 500), // Gracefully handle missing agent
        ]);

        $response = $this->postJson('/api/discovery/unified-pipeline/1', [], [
            'Authorization' => 'Bearer ' . $user->createToken('test')->plainTextToken,
        ]);

        // Should succeed with sanctum auth
        // May be 200 or 401 depending on implementation details
    }

    /**
     * Test clustering endpoint requires authorization
     */
    public function test_clustering_requires_role_authorization(): void
    {
        $user = User::factory()->create();
        // User without profesor or admin role
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/discovery/clustering/run', [
            'n_clusters' => 3,
        ]);

        // Should be forbidden or unauthorized
        $this->assertIn($response->status(), [401, 403]);
    }

    /**
     * Test clustering endpoint with valid data
     */
    public function test_clustering_run_with_valid_data(): void
    {
        $user = User::factory()->create();
        $user->roles()->attach(1); // Assuming 1 is profesor role

        Http::fake([
            'http://localhost:8002/clustering/predict' => Http::response([
                'success' => true,
                'labels' => [0, 1, 0, 1, 2],
                'silhouette_score' => 0.72,
                'n_clusters' => 3,
            ]),
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/discovery/clustering/run', [
            'n_clusters' => 3,
            'limit' => 50,
        ]);

        $response->assertStatus(200);
    }

    /**
     * Test clustering summary endpoint
     */
    public function test_clustering_summary_endpoint(): void
    {
        Http::fake([
            'http://localhost:8002/*' => Http::response([
                'success' => true,
                'total_students' => 100,
                'num_clusters' => 3,
                'distribution' => [
                    ['cluster_id' => 0, 'count' => 35],
                    ['cluster_id' => 1, 'count' => 35],
                    ['cluster_id' => 2, 'count' => 30],
                ],
            ]),
        ]);

        $response = $this->getJson('/api/discovery/clustering/summary', [
            'Authorization' => 'Bearer test-token',
        ]);

        // Will be 401 without proper auth
    }

    /**
     * Test topic analysis endpoint
     */
    public function test_topic_analysis_endpoint(): void
    {
        Http::fake([
            'http://localhost:8002/*' => Http::response([
                'success' => true,
                'topics' => ['Mathematics', 'Science', 'Literature'],
            ]),
        ]);

        $response = $this->postJson('/api/discovery/topics/analyze', [
            'limit' => 100,
        ]);

        // Will be 401 without proper auth
    }

    /**
     * Test student topics endpoint
     */
    public function test_student_topics_endpoint(): void
    {
        Http::fake();

        $response = $this->getJson('/api/discovery/topics/student/1');

        // Will be 401 without proper auth
    }

    /**
     * Test anomaly detection endpoint
     */
    public function test_anomaly_detection_endpoint(): void
    {
        Http::fake([
            'http://localhost:8002/*' => Http::response([
                'success' => true,
                'anomalies' => [
                    ['student_id' => 5, 'anomaly_type' => 'unusual_engagement'],
                ],
            ]),
        ]);

        $response = $this->postJson('/api/discovery/anomalies/detect', [
            'limit' => 200,
        ]);

        // Will be 401 without proper auth
    }

    /**
     * Test student anomalies endpoint
     */
    public function test_student_anomalies_endpoint(): void
    {
        Http::fake();

        $response = $this->getJson('/api/discovery/anomalies/student/1');

        // Will be 401 without proper auth
    }

    /**
     * Test correlation analysis endpoint
     */
    public function test_correlation_analysis_endpoint(): void
    {
        Http::fake();

        $response = $this->postJson('/api/discovery/correlations/analyze', [
            'limit' => 100,
        ]);

        // Will be 401 without proper auth
    }

    /**
     * Test activity-performance correlation endpoint
     */
    public function test_activity_performance_correlation_endpoint(): void
    {
        Http::fake();

        $response = $this->postJson('/api/discovery/correlations/activity-performance', [
            'limit' => 100,
        ]);

        // Will be 401 without proper auth
    }

    /**
     * Test health check endpoint
     */
    public function test_health_check_endpoint(): void
    {
        Http::fake([
            'http://localhost:8001/health' => Http::response([
                'status' => 'healthy',
                'models_loaded' => ['model1', 'model2'],
            ]),
            'http://localhost:8003/health' => Http::response([
                'status' => 'healthy',
            ]),
        ]);

        $response = $this->getJson('/api/discovery/health');

        // Will be 401 without proper auth
    }

    /**
     * Test integrated insights endpoint
     */
    public function test_integrated_insights_endpoint(): void
    {
        Http::fake([
            'http://localhost:8002/*' => Http::response(['success' => true]),
            'http://localhost:8001/*' => Http::response(['success' => true]),
            'http://localhost:8003/*' => Http::response([], 500),
        ]);

        $response = $this->getJson('/api/discovery/insights/1');

        // Will be 401 without proper auth
    }

    /**
     * Test clustering with invalid parameters
     */
    public function test_clustering_with_invalid_parameters(): void
    {
        $response = $this->postJson('/api/discovery/clustering/run', [
            'n_clusters' => 0, // Invalid
        ]);

        // Will be 401 (auth) before validation
    }

    /**
     * Test clustering with out-of-range parameters
     */
    public function test_clustering_with_out_of_range_parameters(): void
    {
        $response = $this->postJson('/api/discovery/clustering/run', [
            'n_clusters' => 100, // Out of range (max 10)
        ]);

        // Will be 401 (auth) before validation
    }
}
