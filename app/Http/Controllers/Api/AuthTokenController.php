<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

/**
 * Controller for managing Sanctum API tokens
 *
 * Provides endpoints for obtaining and revoking API tokens used for
 * authentication with the REST API
 */
class AuthTokenController extends Controller
{
    /**
     * Get the current API token for the authenticated user
     *
     * The token is stored in the session during login and is used
     * for all subsequent API requests via the Authorization header.
     * This endpoint works with session-based auth (web guard) rather than
     * requiring an existing Bearer token.
     */
    public function getToken(Request $request): JsonResponse
    {
        // First, try to get the token from session
        // This is available after login via the web guard
        $tokenString = $request->session()->get('api_token');

        if ($tokenString) {
            return response()->json([
                'success' => true,
                'token' => $tokenString,
                'type' => 'Bearer',
            ]);
        }

        // If not in session, try to get the user and recreate token
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authenticated. Please log in first.',
            ], 401);
        }

        // Get or create API token for this user
        $user->tokens()->where('name', 'api-token')->delete();
        $token = $user->createToken('api-token');
        $tokenString = $token->plainTextToken;

        // Store in session for future requests
        $request->session()->put('api_token', $tokenString);

        return response()->json([
            'success' => true,
            'token' => $tokenString,
            'type' => 'Bearer',
        ]);
    }

    /**
     * Revoke the current API token
     */
    public function revokeToken(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user) {
            // Delete the api-token
            $user->tokens()->where('name', 'api-token')->delete();

            // Clear from session
            $request->session()->forget('api_token');
        }

        return response()->json([
            'success' => true,
            'message' => 'API token revoked.',
        ]);
    }
}
