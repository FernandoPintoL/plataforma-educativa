<?php
// Simple test to make HTTP request to ML endpoint

// First, try to get a token via artisan command
$output = shell_exec('cd "D:\PLATAFORMA EDUCATIVA\plataforma-educativa" && php artisan tinker --execute="\$u = \App\Models\User::where(\"tipo_usuario\",\"profesor\")->first(); echo \$u->createToken(\"test\")->plainTextToken;"');

$token = trim($output);

echo "Testing ML Analysis endpoint...\n";
echo "Token obtained: " . substr($token, 0, 20) . "...\n\n";

// Make the request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/ml/student/253/analysis');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
    'Accept: application/json'
]);

echo "GET http://localhost:8000/api/ml/student/253/analysis\n";

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

echo "HTTP Status: " . $http_code . "\n";
echo "Response:\n";

if ($error) {
    echo "cURL Error: " . $error . "\n";
} else {
    if (str_starts_with((string)$http_code, '2')) {
        $data = json_decode($response, true);
        echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
    } else {
        echo $response . "\n";
    }
}
