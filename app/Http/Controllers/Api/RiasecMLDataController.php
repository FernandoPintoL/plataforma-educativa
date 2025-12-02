<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RiasecMLDataPreparationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RiasecMLDataController extends Controller
{
    protected RiasecMLDataPreparationService $dataPreparation;

    public function __construct(RiasecMLDataPreparationService $dataPreparation)
    {
        $this->dataPreparation = $dataPreparation;
        $this->middleware('auth:sanctum');
        $this->middleware('role:profesor|admin');
    }

    /**
     * Extract RIASEC scores for all students
     *
     * GET /api/ml-data/test/{testId}/riasec-scores
     */
    public function getRiasecScores($testId): JsonResponse
    {
        try {
            $scores = $this->dataPreparation->extractRiasecScores($testId);

            return response()->json([
                'success' => true,
                'data' => $scores,
                'total_students' => count($scores),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Create supervised learning dataset (career prediction)
     *
     * GET /api/ml-data/test/{testId}/supervised-dataset
     */
    public function getSupervisedDataset($testId): JsonResponse
    {
        try {
            $dataset = $this->dataPreparation->createSuperviserDataset($testId);

            return response()->json([
                'success' => true,
                'data' => $dataset,
                'samples_count' => count($dataset['dataset']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Create unsupervised learning dataset (clustering)
     *
     * GET /api/ml-data/test/{testId}/unsupervised-dataset
     */
    public function getUnsupervisedDataset($testId): JsonResponse
    {
        try {
            $dataset = $this->dataPreparation->createUnsuperviserDataset($testId);

            return response()->json([
                'success' => true,
                'data' => $dataset,
                'samples_count' => count($dataset['dataset']),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Export supervised dataset as CSV
     *
     * GET /api/ml-data/test/{testId}/export/supervised
     */
    public function exportSupervisedCsv($testId)
    {
        try {
            $dataset = $this->dataPreparation->createSuperviserDataset($testId);
            $csv = $this->dataPreparation->exportDatasetAsCsv($dataset, 'riasec_supervised.csv');

            return response($csv, 200)
                ->header('Content-Type', 'text/csv; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="riasec_supervised_' . now()->format('Y-m-d_His') . '.csv"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Export unsupervised dataset as CSV
     *
     * GET /api/ml-data/test/{testId}/export/unsupervised
     */
    public function exportUnsupervisedCsv($testId)
    {
        try {
            $dataset = $this->dataPreparation->createUnsuperviserDataset($testId);
            $csv = $this->dataPreparation->exportDatasetAsCsv($dataset, 'riasec_unsupervised.csv');

            return response($csv, 200)
                ->header('Content-Type', 'text/csv; charset=utf-8')
                ->header('Content-Disposition', 'attachment; filename="riasec_unsupervised_' . now()->format('Y-m-d_His') . '.csv"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get dataset statistics
     *
     * GET /api/ml-data/test/{testId}/supervised-dataset/statistics
     */
    public function getSupervisedStatistics($testId): JsonResponse
    {
        try {
            $dataset = $this->dataPreparation->createSuperviserDataset($testId);
            $stats = $this->dataPreparation->getDatasetStatistics($dataset);

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get feature importance
     *
     * GET /api/ml-data/test/{testId}/feature-importance
     */
    public function getFeatureImportance($testId): JsonResponse
    {
        try {
            $dataset = $this->dataPreparation->createUnsuperviserDataset($testId);
            $importance = $this->dataPreparation->getFeatureImportance($dataset);

            return response()->json([
                'success' => true,
                'data' => $importance,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Create train/test split
     *
     * POST /api/ml-data/test/{testId}/train-test-split
     */
    public function createTrainTestSplit($testId, Request $request): JsonResponse
    {
        try {
            $train_ratio = $request->input('train_ratio', 0.8);

            // Validate ratio
            if ($train_ratio < 0.5 || $train_ratio > 0.95) {
                return response()->json([
                    'success' => false,
                    'error' => 'train_ratio must be between 0.5 and 0.95',
                ], 400);
            }

            $dataset = $this->dataPreparation->createSuperviserDataset($testId);
            $split = $this->dataPreparation->createTrainTestSplit($dataset, $train_ratio);

            return response()->json([
                'success' => true,
                'data' => [
                    'train_samples' => count($split['train']),
                    'test_samples' => count($split['test']),
                    'train_ratio' => $split['train_ratio'],
                    'test_ratio' => $split['test_ratio'],
                    'note' => 'Use train_samples for training your ML model, test_samples for evaluation',
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get complete ML data summary
     *
     * GET /api/ml-data/test/{testId}/summary
     */
    public function getMlDataSummary($testId): JsonResponse
    {
        try {
            $supervised = $this->dataPreparation->createSuperviserDataset($testId);
            $unsupervised = $this->dataPreparation->createUnsuperviserDataset($testId);
            $supervised_stats = $this->dataPreparation->getDatasetStatistics($supervised);
            $feature_importance = $this->dataPreparation->getFeatureImportance($unsupervised);

            return response()->json([
                'success' => true,
                'data' => [
                    'supervised_learning' => [
                        'total_samples' => count($supervised['dataset']),
                        'features' => $supervised['metadata']['total_features'],
                        'target_classes' => $supervised['metadata']['target_classes'],
                        'use_case' => 'Career prediction (classification)',
                        'recommended_algorithm' => 'Random Forest, SVM, or Neural Networks',
                    ],
                    'unsupervised_learning' => [
                        'total_samples' => count($unsupervised['dataset']),
                        'features' => $unsupervised['metadata']['total_features'],
                        'recommended_clusters' => $unsupervised['metadata']['recommended_clusters'],
                        'use_case' => 'Vocational profile clustering',
                        'recommended_algorithm' => 'K-Means (k=' . $unsupervised['metadata']['recommended_clusters'] . ') or DBSCAN',
                    ],
                    'feature_statistics' => $supervised_stats['dimension_statistics'] ?? [],
                    'feature_importance' => $feature_importance['feature_importance'] ?? [],
                    'download_endpoints' => [
                        'supervised_csv' => "/api/ml-data/test/{$testId}/export/supervised",
                        'unsupervised_csv' => "/api/ml-data/test/{$testId}/export/unsupervised",
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
