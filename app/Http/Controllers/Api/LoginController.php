<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Handle API login request
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // Determine if email or username
        $login = $validated['email'];
        $field = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'usernick';

        // Attempt authentication
        $credentials = [
            $field => $login,
            'password' => $validated['password'],
        ];

        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $user = Auth::user();

        try {
            // Delete old tokens to keep things clean
            $user->tokens()->where('name', 'api-token')->delete();
            
            // Create new Sanctum token
            $tokenResponse = $user->createToken('api-token');
            $token = $tokenResponse->plainTextToken;

            Log::info('Token created successfully', [
                'user_id' => $user->id,
                'token_length' => strlen($token),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Login exitoso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'token' => $token,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Token creation failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al generar token',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle logout
     */
    public function logout(Request $request)
    {
        try {
            $user = Auth::user();
            
            if ($user) {
                $user->tokens()->where('name', 'api-token')->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Logout exitoso',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al hacer logout',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
