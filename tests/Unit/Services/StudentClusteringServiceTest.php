<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\StudentClusteringService;
use App\Models\StudentCluster;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class StudentClusteringServiceTest extends TestCase
{
    protected StudentClusteringService $clusteringService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->clusteringService = new StudentClusteringService();
    }

    /**
     * Test extracting student features
     */
    public function test_extract_student_features_returns_valid_data(): void
    {
        // Mock database query
        DB::shouldReceive('table')->once()->andReturnSelf()
            ->shouldReceive('whereHas')->once()->andReturnSelf()
            ->shouldReceive('select')->once()->andReturnSelf()
            ->shouldReceive('selectRaw')->once()->andReturnSelf()
            ->shouldReceive('leftJoin')->times(4)->andReturnSelf()
            ->shouldReceive('groupBy')->once()->andReturnSelf()
            ->shouldReceive('get')->once()->andReturn(collect([
                (object)[
                    'id' => 1,
                    'name' => 'John Doe',
                    'promedio_calificaciones' => 3.5,
                    'desviacion_notas' => 0.8,
                    'asistencia_promedio' => 85.0,
                    'tareas_completadas_porcentaje' => 90.0,
                    'participacion_promedio' => 2.5,
                ],
                (object)[
                    'id' => 2,
                    'name' => 'Jane Smith',
                    'promedio_calificaciones' => 4.0,
                    'desviacion_notas' => 0.5,
                    'asistencia_promedio' => 95.0,
                    'tareas_completadas_porcentaje' => 95.0,
                    'participacion_promedio' => 3.0,
                ],
            ]));

        $result = $this->invokeMethod($this->clusteringService, 'extractStudentFeatures', [null]);

        $this->assertArrayHasKey('data', $result);
        $this->assertArrayHasKey('student_ids', $result);
        $this->assertCount(2, $result['data']);
        $this->assertCount(2, $result['student_ids']);
        $this->assertEquals([1, 2], $result['student_ids']);
    }

    /**
     * Test clustering with valid data
     */
    public function test_cluster_students_with_mock_api(): void
    {
        Http::fake([
            'http://localhost:8002/clustering/predict' => Http::response([
                'success' => true,
                'labels' => [0, 1, 0, 1, 2],
                'n_clusters' => 3,
                'silhouette_score' => 0.65,
                'cluster_sizes' => [2, 2, 1],
            ]),
        ]);

        // Mock database operations
        DB::shouldReceive('table')->once()->andReturnSelf()
            ->shouldReceive('whereHas')->once()->andReturnSelf()
            ->shouldReceive('select')->once()->andReturnSelf()
            ->shouldReceive('selectRaw')->once()->andReturnSelf()
            ->shouldReceive('leftJoin')->times(4)->andReturnSelf()
            ->shouldReceive('groupBy')->once()->andReturnSelf()
            ->shouldReceive('get')->once()->andReturn(collect([
                (object)[
                    'id' => 1,
                    'name' => 'Student 1',
                    'promedio_calificaciones' => 3.5,
                    'desviacion_notas' => 0.8,
                    'asistencia_promedio' => 85.0,
                    'tareas_completadas_porcentaje' => 90.0,
                    'participacion_promedio' => 2.5,
                ],
            ]));

        // Mock StudentCluster model
        StudentCluster::shouldReceive('updateOrCreate')->once()->andReturn(new StudentCluster());
        StudentCluster::shouldReceive('getDistribucionClusters')->once()->andReturn([
            ['cluster_id' => 0, 'count' => 2],
            ['cluster_id' => 1, 'count' => 2],
            ['cluster_id' => 2, 'count' => 1],
        ]);

        $result = $this->clusteringService->clusterStudents(3, 1);

        $this->assertTrue($result['success']);
        $this->assertEquals(3, $result['num_clusters']);
    }

    /**
     * Test clustering with empty data
     */
    public function test_cluster_students_returns_error_with_no_data(): void
    {
        // Mock database query returning empty
        DB::shouldReceive('table')->once()->andReturnSelf()
            ->shouldReceive('whereHas')->once()->andReturnSelf()
            ->shouldReceive('select')->once()->andReturnSelf()
            ->shouldReceive('selectRaw')->once()->andReturnSelf()
            ->shouldReceive('leftJoin')->times(4)->andReturnSelf()
            ->shouldReceive('groupBy')->once()->andReturnSelf()
            ->shouldReceive('get')->once()->andReturn(collect([]));

        $result = $this->clusteringService->clusterStudents();

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('No data available', $result['message']);
    }

    /**
     * Test API failure handling
     */
    public function test_clustering_handles_api_failure(): void
    {
        Http::fake([
            'http://localhost:8002/clustering/predict' => Http::response([
                'success' => false,
                'message' => 'Model not loaded',
            ], 500),
        ]);

        // Mock database
        DB::shouldReceive('table')->once()->andReturnSelf()
            ->shouldReceive('whereHas')->once()->andReturnSelf()
            ->shouldReceive('select')->once()->andReturnSelf()
            ->shouldReceive('selectRaw')->once()->andReturnSelf()
            ->shouldReceive('leftJoin')->times(4)->andReturnSelf()
            ->shouldReceive('groupBy')->once()->andReturnSelf()
            ->shouldReceive('get')->once()->andReturn(collect([
                (object)[
                    'id' => 1,
                    'name' => 'Student 1',
                    'promedio_calificaciones' => 3.5,
                    'desviacion_notas' => 0.8,
                    'asistencia_promedio' => 85.0,
                    'tareas_completadas_porcentaje' => 90.0,
                    'participacion_promedio' => 2.5,
                ],
            ]));

        $result = $this->clusteringService->clusterStudents();

        $this->assertFalse($result['success']);
    }

    /**
     * Test get cluster analysis
     */
    public function test_get_cluster_analysis_returns_valid_data(): void
    {
        StudentCluster::shouldReceive('where')->with('cluster_id', 1)->andReturnSelf()
            ->shouldReceive('with')->with('estudiante')->andReturnSelf()
            ->shouldReceive('get')->andReturn(collect([
                (object)[
                    'id' => 1,
                    'cluster_distance' => 1.5,
                    'membership_probabilities' => [0.8, 0.15, 0.05],
                    'estudiante' => (object)['name' => 'John Doe'],
                ],
                (object)[
                    'id' => 2,
                    'cluster_distance' => 1.8,
                    'membership_probabilities' => [0.75, 0.2, 0.05],
                    'estudiante' => (object)['name' => 'Jane Smith'],
                ],
            ]));

        $result = $this->clusteringService->getClusterAnalysis(1);

        $this->assertTrue($result['success']);
        $this->assertEquals(1, $result['cluster_id']);
        $this->assertEquals(2, $result['num_students']);
    }

    /**
     * Test get clusters summary
     */
    public function test_get_clusters_summary(): void
    {
        StudentCluster::shouldReceive('getDistribucionClusters')->andReturn([
            ['cluster_id' => 0, 'count' => 25],
            ['cluster_id' => 1, 'count' => 30],
            ['cluster_id' => 2, 'count' => 20],
        ]);

        StudentCluster::shouldReceive('count')->andReturn(75);
        StudentCluster::shouldReceive('latest')->with('fecha_asignacion')->andReturnSelf()
            ->shouldReceive('first')->andReturn((object)[
                'fecha_asignacion' => now(),
            ]);

        StudentCluster::shouldReceive('where')->with('cluster_id', 0)->andReturnSelf()
            ->shouldReceive('first')->andReturn((object)[
                'getDescripcionCluster' => function() { return 'High performers'; },
                'getRecomendaciones' => function() { return ['Advanced topics']; },
            ]);

        $result = $this->clusteringService->getClustersSummary();

        $this->assertTrue($result['success']);
        $this->assertEquals(75, $result['total_students']);
        $this->assertEquals(3, $result['num_clusters']);
    }

    /**
     * Test get anomalous students
     */
    public function test_get_anomalous_students(): void
    {
        StudentCluster::shouldReceive('where')->with('cluster_distance', '>', 2.0)->andReturnSelf()
            ->shouldReceive('with')->with('estudiante')->andReturnSelf()
            ->shouldReceive('orderByDesc')->with('cluster_distance')->andReturnSelf()
            ->shouldReceive('get')->andReturn(collect([
                (object)[
                    'id' => 1,
                    'cluster_id' => 0,
                    'cluster_distance' => 2.5,
                    'estudiante' => (object)['name' => 'Outlier Student'],
                ],
            ]));

        $result = $this->clusteringService->getAnomalousStudents(2.0);

        $this->assertTrue($result['success']);
        $this->assertEquals(1, $result['count']);
        $this->assertEquals(2.0, $result['threshold']);
    }

    /**
     * Test get similar students
     */
    public function test_get_similar_students(): void
    {
        StudentCluster::shouldReceive('where')->with('estudiante_id', 1)->andReturnSelf()
            ->shouldReceive('first')->andReturn((object)[
                'cluster_id' => 1,
                'estudiante_id' => 1,
            ]);

        StudentCluster::shouldReceive('where')->with('cluster_id', 1)->andReturnSelf()
            ->shouldReceive('where')->with('estudiante_id', '!=', 1)->andReturnSelf()
            ->shouldReceive('orderBy')->with('cluster_distance')->andReturnSelf()
            ->shouldReceive('limit')->with(5)->andReturnSelf()
            ->shouldReceive('with')->with('estudiante')->andReturnSelf()
            ->shouldReceive('get')->andReturn(collect([
                (object)[
                    'estudiante_id' => 2,
                    'cluster_distance' => 1.2,
                    'membership_probabilities' => [0.05, 0.8, 0.15],
                    'estudiante' => (object)['name' => 'Similar Student'],
                    'getAssignedClusterProbability' => function() { return 0.8; },
                ],
            ]));

        $result = $this->clusteringService->getSimilarStudents(1, 5);

        $this->assertTrue($result['success']);
        $this->assertEquals(1, $result['reference_student_id']);
        $this->assertEquals(1, count($result['similar_students']));
    }

    /**
     * Helper method to invoke private methods
     */
    protected function invokeMethod(&$object, $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass(get_class($object));
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);

        return $method->invokeArgs($object, $parameters);
    }
}
