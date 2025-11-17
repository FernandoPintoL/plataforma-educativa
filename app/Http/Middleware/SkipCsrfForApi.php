<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

/**
 * Middleware para excluir rutas API de validación CSRF
 *
 * En Laravel con Sanctum, las rutas API autenticadas con sesión
 * pueden omitir CSRF si se autentica con bearer token o cookies.
 *
 * Este middleware extiende VerifyCsrfToken para excluir rutas API
 * que usan autenticación Sanctum.
 */
class SkipCsrfForApi extends Middleware
{
    /**
     * Las rutas que deben estar excluidas de la validación CSRF.
     *
     * @var array
     */
    protected $except = [
        'api/*',
    ];
}
