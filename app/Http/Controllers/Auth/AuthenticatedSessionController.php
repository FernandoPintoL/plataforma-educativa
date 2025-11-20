<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Generate Sanctum token for API authentication
        $user = Auth::guard('web')->user();
        if ($user) {
            try {
                // Reutilizar token existente o crear uno nuevo si no existe
                // Esto es más rápido que eliminar y recrear en cada login
                $existingToken = $user->tokens()->where('name', 'api-token')->first();

                if ($existingToken) {
                    // Reutilizar token existente
                    $tokenString = $existingToken->plainTextToken;
                } else {
                    // Crear nuevo token solo si no existe
                    $token = $user->createToken('api-token');
                    $tokenString = $token->plainTextToken;
                }

                // Store token in session
                $request->session()->put('api_token', $tokenString);

                // Also store as a temporary flash message so frontend can capture it
                $request->session()->flash('sanctum_token', $tokenString);

                // Debug log
                \Log::info('Token obtained for user', [
                    'user_id' => $user->id,
                    'token_exists' => !empty($tokenString),
                    'session_has_token' => $request->session()->has('api_token'),
                    'token_reused' => $existingToken ? true : false,
                ]);
            } catch (\Exception $e) {
                \Log::error('Failed to obtain token', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
