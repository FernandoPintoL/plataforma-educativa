<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Session\Middleware\StartSession;

/**
 * Middleware to properly handle stateful API requests from the frontend
 *
 * This middleware ensures that:
 * 1. Session is loaded for API routes (required for Sanctum session auth)
 * 2. The web guard is used for session authentication
 * 3. SSE and REST API requests both use the same session-based auth
 *
 * Note: This must run AFTER EnsureFrontendRequestsAreStateful but before route handlers
 */
class HandleStatefulApiRequests
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Ensure session is started for this request
        if (!session()->isStarted()) {
            session()->start();
        }

        // Log the incoming request for debugging
        Log::debug('API Request - HandleStatefulApiRequests', [
            'path' => $request->path(),
            'method' => $request->method(),
            'origin' => $request->header('Origin'),
            'referer' => $request->header('Referer'),
            'session_id' => session()->getId(),
            'session_has_data' => !empty(session()->all()),
            'auth_check_web' => auth('web')->check(),
            'auth_check_sanctum' => auth('sanctum')->check(),
            'auth_check_default' => auth()->check(),
            'authenticated_user_id' => auth()->id(),
            'csrf_token_present' => $request->hasHeader('X-CSRF-TOKEN'),
            'cookies' => array_keys($request->cookies->all()),
        ]);

        // Get the response
        $response = $next($request);

        return $response;
    }
}
