<?php
/**
 * Test ML Analysis endpoint via HTTP
 * Simulates an authenticated HTTP request
 */

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use Illuminate\Testing\TestResponse;
use Laravel\Sanctum\HasApiTokens;

echo "=== Testing ML Analysis HTTP Endpoint ===\n\n";

try {
    // Get a profesor user
    $user = \App\Models\User::where('tipo_usuario', 'profesor')->first();

    if (!$user) {
        die("No profesor user found\n");
    }

    echo "User: " . $user->name . " (ID: " . $user->id . ")\n";

    // Create a token
    $token = $user->createToken('test-ml-http')->plainTextToken;
    echo "Token: " . substr($token, 0, 30) . "...\n\n";

    // Create a fake HTTP request
    $request = Request::create(
        '/api/ml/student/253/analysis',
        'GET',
        [],
        [],
        [],
        [
            'HTTP_AUTHORIZATION' => 'Bearer ' . $token,
            'HTTP_ACCEPT' => 'application/json',
            'CONTENT_TYPE' => 'application/json',
        ]
    );

    // Get the router
    $router = $app['router'];

    // Try to find a matching route
    $matchedRoute = null;
    foreach ($router->getRoutes() as $route) {
        if ($route->matches($request)) {
            $matchedRoute = $route;
            echo "✓ Route matched: " . $route->getName() . "\n";
            echo "  URI: " . $route->uri() . "\n";
            echo "  Methods: " . implode(', ', $route->methods()) . "\n";
            echo "  Middleware: " . implode(', ', $route->gatherMiddleware()) . "\n\n";
            break;
        }
    }

    if (!$matchedRoute) {
        echo "✗ No matching route found\n";
        echo "\nAvailable ML routes:\n";
        foreach ($router->getRoutes() as $route) {
            if (strpos($route->uri(), 'api/ml') !== false) {
                echo "  - " . $route->uri() . " (" . implode(', ', $route->methods()) . ")\n";
            }
        }
        return;
    }

    // Authenticate the request
    $request->setUserResolver(function () use ($user) {
        return $user;
    });

    // Dispatch the request
    echo "Dispatching request...\n";
    $response = $router->dispatch($request);

    echo "Response Status: " . $response->status() . "\n";

    if ($response->status() === 200) {
        $data = json_decode($response->getContent(), true);
        echo "✓ SUCCESS - HTTP endpoint working!\n\n";

        echo "Response structure:\n";
        echo "  - success: " . ($data['success'] ? 'true' : 'false') . "\n";
        echo "  - student_id: " . $data['student_id'] . "\n";
        echo "  - student_name: " . $data['student_name'] . "\n";

        if (isset($data['data'])) {
            echo "  - data:\n";
            if (isset($data['data']['ml_data'])) {
                echo "    - ml_data: present\n";
                if (isset($data['data']['ml_data']['predictions'])) {
                    echo "      - predictions: " . count($data['data']['ml_data']['predictions']) . " models\n";
                }
                if (isset($data['data']['ml_data']['discoveries'])) {
                    echo "      - discoveries: present\n";
                }
            }
            if (isset($data['data']['synthesis'])) {
                echo "    - synthesis: present\n";
            }
            if (isset($data['data']['intervention_strategy'])) {
                echo "    - intervention_strategy: present\n";
            }
        }

        echo "\n\nResponse preview (first 800 chars):\n";
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";

    } else {
        echo "✗ Error - Status: " . $response->status() . "\n";
        echo "Response:\n";
        echo $response->getContent() . "\n";
    }

} catch (Exception $e) {
    echo "✗ Exception: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "\nStack trace:\n";
    echo $e->getTraceAsString() . "\n";
}
