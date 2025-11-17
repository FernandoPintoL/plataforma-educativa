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
        $token = $request->session()->get('api_token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'No API token available. Please log in again.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'token' => $token,
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
