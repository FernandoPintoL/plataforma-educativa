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
     * for all subsequent API requests via the Authorization header
     */
    public function getToken(Request $request): JsonResponse
    {
        // Try to get the authenticated user
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Not authenticated. Please log in first.',
            ], 401);
        }

        // Get or create API token for this user
        // First check if user has an existing api-token
        $token = $user->tokens()->where('name', 'api-token')->first();

        if (!$token) {
            // Token doesn't exist, need to create one
            // This shouldn't happen in normal flow, but handle it gracefully
            $token = $user->createToken('api-token');
            $tokenString = $token->plainTextToken;
        } else {
            // Token exists but we don't have the plain text version
            // We need to create a new one and return it
            $user->tokens()->where('name', 'api-token')->delete();
            $token = $user->createToken('api-token');
            $tokenString = $token->plainTextToken;
        }

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
