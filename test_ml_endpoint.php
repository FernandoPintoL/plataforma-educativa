<?php
// Test script for ML Analysis endpoints
require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Get a profesor user
$user = \App\Models\User::where('tipo_usuario', 'profesor')->first();

if (!$user) {
    die("No profesor user found\n");
}

echo "Found user: " . $user->name . " (ID: " . $user->id . ")\n";

// Create a token
$token = $user->createToken('test-ml-token')->plainTextToken;
echo "Token: " . $token . "\n\n";

// Test the ML endpoint using curl
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/ml/student/253/analysis');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
    'Accept: application/json'
]);

echo "Making request to: http://localhost:8000/api/ml/student/253/analysis\n";
echo "Auth: Bearer {token}\n\n";

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "HTTP Status: " . $http_code . "\n";
echo "Response:\n";

if ($error) {
    echo "Error: " . $error . "\n";
} else {
    // Try to pretty print JSON
    $data = json_decode($response, true);
    if ($data) {
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
    } else {
        echo $response . "\n";
    }
}
