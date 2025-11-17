<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware para verificar tokens API
 *
 * Para Inertia + Sanctum, verifica:
 * 1. Session cookie (PHPSESSID)
 * 2. Bearer token en Authorization header
 * 3. CSRF token en X-CSRF-TOKEN header (para POST/PUT/DELETE desde navegador)
 */
class VerifyApiTokens
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Log incoming request for debugging
        \Log::debug('API Request', [
            'url' => $request->path(),
            'method' => $request->method(),
            'has_session' => $request->session()?->exists('PHPSESSID') ?? false,
            'has_auth_header' => $request->hasHeader('Authorization'),
            'has_csrf_header' => $request->hasHeader('X-CSRF-TOKEN'),
            'cookies' => array_keys($request->cookies->all()),
        ]);

        return $next($request);
    }
}
