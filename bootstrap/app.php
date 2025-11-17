<?php

use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // CRITICAL: Session middleware MUST be applied BEFORE Sanctum's EnsureFrontendRequestsAreStateful
        // The order is: EncryptCookies -> StartSession -> EnsureFrontendRequestsAreStateful -> App logic
        $middleware->api(prepend: [
            // Start the session FIRST - this must happen before any auth checks
            \Illuminate\Session\Middleware\StartSession::class,
            // Then Sanctum checks if it's a stateful request using the session
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            // CORS handling
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Share session errors with the view
        $middleware->api(append: [
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        ]);

        // Excluir rutas del middleware CSRF para testing
        $middleware->validateCsrfTokens(except: [
            'test-csrf',
        ]);

        // Aliases for middleware
        // Usamos nuestro middleware personalizado para 'role' que valida tanto tipo_usuario como roles de Spatie
        $middleware->alias([
            'role' => EnsureUserHasRole::class,
            'permission' => PermissionMiddleware::class,
            'role_or_permission' => RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
