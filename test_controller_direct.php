<?php
/**
 * Direct test of MLAnalysisController
 * This bypasses the HTTP layer and tests the controller logic directly
 */

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Now we can use Laravel classes
use App\Http\Controllers\MLAnalysisController;
use App\Services\AgentSynthesisService;

echo "=== Testing MLAnalysisController ===\n\n";

try {
    // Create an instance of the service
    $agentService = new AgentSynthesisService();
    echo "✓ AgentSynthesisService instantiated\n";

    // Create an instance of the controller
    $controller = new MLAnalysisController($agentService);
    echo "✓ MLAnalysisController instantiated\n\n";

    // Test the integrated analysis for student 253
    echo "Calling getIntegratedAnalysis(253)...\n";
    $result = $controller->getIntegratedAnalysis(253);

    echo "\nResponse Status: " . $result->status() . "\n";
    $data = json_decode($result->getContent(), true);

    if (isset($data['success']) && $data['success']) {
        echo "✓ SUCCESS - Endpoint returned valid response\n";
        echo "  Student ID: " . $data['student_id'] . "\n";
        echo "  Student Name: " . $data['student_name'] . "\n";

        // Check for required fields
        if (isset($data['data']['ml_data'])) {
            echo "  ✓ ML Data: Present\n";
            if (isset($data['data']['ml_data']['predictions'])) {
                echo "    - Predictions: Present\n";
            }
            if (isset($data['data']['ml_data']['discoveries'])) {
                echo "    - Discoveries: Present\n";
            }
        }

        if (isset($data['data']['synthesis'])) {
            echo "  ✓ Synthesis: Present\n";
        }

        if (isset($data['data']['intervention_strategy'])) {
            echo "  ✓ Intervention Strategy: Present\n";
        }

        echo "\nFull Response (first 1000 chars):\n";
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";

    } else {
        echo "✗ FAILED - Endpoint returned error\n";
        echo "Response:\n";
        echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
    }

} catch (Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . "\n";
    echo "Line: " . $e->getLine() . "\n";
    echo "\nStack Trace:\n";
    echo $e->getTraceAsString() . "\n";
}
