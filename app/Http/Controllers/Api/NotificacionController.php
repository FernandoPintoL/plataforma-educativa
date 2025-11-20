<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class NotificacionController extends Controller
{
    /**
     * Obtener notificaciones del usuario autenticado
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            Log::warning('Unauthorized API request to notificaciones.index', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'session_id' => session()->getId(),
                'session_exists' => session()->all(),
                'auth_check' => auth()->check(),
                'auth_user' => auth()->user(),
                'headers' => [
                    'Authorization' => $request->header('Authorization') ? 'present' : 'missing',
                    'X-CSRF-TOKEN' => $request->header('X-CSRF-TOKEN') ? 'present' : 'missing',
                    'Referer' => $request->header('Referer'),
                ],
                'cookies' => [
                    'PHPSESSID' => $request->cookie('PHPSESSID') ? 'present' : 'missing',
                    'XSRF-TOKEN' => $request->cookie('XSRF-TOKEN') ? 'present' : 'missing',
                    'laravel_session' => $request->cookie('laravel_session') ? 'present' : 'missing',
                ],
                'guards' => [
                    'web' => auth('web')->check(),
                    'sanctum' => auth('sanctum')->check(),
                ],
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: User not authenticated',
            ], 401);
        }

        $limite = $request->input('limit', 50);
        $tipo = $request->input('tipo');

        $query = Notificacion::where('usuario_id', $user->id)
            ->orderBy('created_at', 'desc');

        if ($tipo) {
            $query->where('tipo', $tipo);
        }

        $notificaciones = $query->limit($limite)->get();

        try {
            $data = $notificaciones->map(function($n) {
                if (!$n) {
                    Log::warning('Notificación null en index', ['user_id' => $user->id]);
                    return null;
                }
                return $n->obtenerInformacion();
            })->filter(fn($item) => $item !== null)->values();

            return response()->json([
                'success' => true,
                'data' => $data,
                'count' => $data->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error en NotificacionController::index', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener notificaciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener notificaciones no leídas
     */
    public function getNoLeidas(Request $request): JsonResponse
    {
        $user = $request->user();

        $noLeidas = Notificacion::where('usuario_id', $user->id)
            ->where('leida', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $noLeidas->map(fn($n) => $n->obtenerInformacion()),
            'count' => $noLeidas->count(),
        ]);
    }

    /**
     * Marcar notificación como leída
     */
    public function marcarLeido(Request $request, Notificacion $notificacion): JsonResponse
    {
        // Verificar que el usuario sea el propietario
        if ($notificacion->usuario_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $notificacion->marcarLeido();

        Log::info("Notificación {$notificacion->id} marcada como leída", [
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como leída',
            'data' => $notificacion->obtenerInformacion(),
        ]);
    }

    /**
     * Marcar notificación como no leída
     */
    public function marcarNoLeido(Request $request, Notificacion $notificacion): JsonResponse
    {
        // Verificar que el usuario sea el propietario
        if ($notificacion->usuario_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $notificacion->marcarNoLeido();

        Log::info("Notificación {$notificacion->id} marcada como no leída", [
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notificación marcada como no leída',
            'data' => $notificacion->obtenerInformacion(),
        ]);
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public function marcarTodasLeidas(Request $request): JsonResponse
    {
        $user = $request->user();
        $cantidad = Notificacion::where('usuario_id', $user->id)
            ->where('leida', false)
            ->update(['leida' => true]);

        Log::info("Se marcaron {$cantidad} notificaciones como leídas", [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Se marcaron {$cantidad} notificaciones como leídas",
            'data' => ['cantidad' => $cantidad],
        ]);
    }

    /**
     * Eliminar una notificación
     */
    public function eliminar(Request $request, Notificacion $notificacion): JsonResponse
    {
        // Verificar que el usuario sea el propietario
        if ($notificacion->usuario_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado',
            ], 403);
        }

        $id = $notificacion->id;
        $notificacion->delete();

        Log::info("Notificación {$id} eliminada", [
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notificación eliminada',
        ]);
    }

    /**
     * Obtener estadísticas de notificaciones
     */
    public function estadisticas(Request $request): JsonResponse
    {
        $user = $request->user();

        $stats = [
            'total' => Notificacion::where('usuario_id', $user->id)->count(),
            'no_leidas' => Notificacion::where('usuario_id', $user->id)
                ->where('leida', false)
                ->count(),
            'leidas' => Notificacion::where('usuario_id', $user->id)
                ->where('leida', true)
                ->count(),
            'recientes_24h' => Notificacion::where('usuario_id', $user->id)
                ->where('created_at', '>=', now()->subHours(24))
                ->count(),
        ];

        $stats['porcentaje_leidas'] = $stats['total'] > 0
            ? round(($stats['leidas'] / $stats['total']) * 100, 2)
            : 0;

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * SSE Stream - Notificaciones en tiempo real
     *
     * Este endpoint usa Server-Sent Events para enviar notificaciones
     * en tiempo real al cliente sin necesidad de WebSocket.
     *
     * Soporta autenticación por:
     * 1. Header Authorization con Bearer token (para axios/fetch)
     * 2. Query parameter ?token=xxx (para EventSource que no soporta headers)
     *
     * Uso del cliente:
     * const eventSource = new EventSource('/api/notificaciones/stream?token=xxx');
     * eventSource.addEventListener('notificacion', (event) => {
     *     const notificacion = JSON.parse(event.data);
     *     console.log('Nueva notificación:', notificacion);
     * });
     */
    public function stream(Request $request): StreamedResponse
    {
        // Try to get user from Sanctum authentication
        $user = $request->user();

        // If not authenticated via header, try token from query parameter
        if (!$user) {
            $token = $request->query('token');
            if ($token) {
                // Validate the Sanctum token
                $personalAccessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
                if ($personalAccessToken && $personalAccessToken->tokenable) {
                    $user = $personalAccessToken->tokenable;
                    Log::debug('SSE stream authenticated via token parameter', [
                        'user_id' => $user->id,
                    ]);
                }
            }
        }

        // Check if user is authenticated
        if (!$user) {
            Log::warning('Unauthorized SSE stream request', [
                'ip' => $request->ip(),
                'has_token_param' => $request->query('token') ? 'yes' : 'no',
                'headers' => [
                    'Authorization' => $request->header('Authorization') ? 'present' : 'missing',
                    'PHPSESSID' => $request->cookie('PHPSESSID') ? 'present' : 'missing',
                ],
            ]);

            // Return error as SSE stream
            return response()->stream(function () {
                echo "event: error\n";
                echo "data: " . json_encode(['error' => 'Unauthorized']) . "\n\n";
            }, 401, [
                'Content-Type' => 'text/event-stream',
                'Cache-Control' => 'no-cache',
            ]);
        }

        $userId = $user->id;

        // Configurar headers para SSE
        return response()->stream(function () use ($userId) {
            // Enviar notificaciones existentes no leídas
            $noLeidas = Notificacion::where('usuario_id', $userId)
                ->where('leida', false)
                ->where('created_at', '>=', now()->subHours(1))
                ->orderBy('created_at', 'desc')
                ->get();

            foreach ($noLeidas as $notificacion) {
                echo "event: notificacion\n";
                echo "data: " . json_encode($notificacion->obtenerInformacion()) . "\n\n";
                flush();
            }

            // Mantener la conexión abierta y enviar notificaciones nuevas
            $ultimaFecha = now();
            $startTime = time();
            $maxDuration = 50; // Cerrar conexión después de 50 segundos (PHP timeout es 60s)

            while (true) {
                // Verificar si hemos alcanzado el límite de tiempo
                if (time() - $startTime >= $maxDuration) {
                    Log::debug("SSE stream closing due to max duration for user {$userId}");
                    echo "event: reconnect\n";
                    echo "data: {\"message\":\"Reconnecting...\"}\n\n";
                    flush();
                    break;
                }

                // Buscar nuevas notificaciones cada 2 segundos
                sleep(2);

                $nuevas = Notificacion::where('usuario_id', $userId)
                    ->where('created_at', '>', $ultimaFecha)
                    ->orderBy('created_at', 'asc')
                    ->get();

                if ($nuevas->isNotEmpty()) {
                    foreach ($nuevas as $notificacion) {
                        echo "event: notificacion\n";
                        echo "data: " . json_encode($notificacion->obtenerInformacion()) . "\n\n";
                        flush();

                        // Actualizar timestamp
                        $ultimaFecha = $notificacion->created_at;
                    }
                }

                // Enviar heartbeat cada 15 segundos para mantener la conexión
                if (now()->diffInSeconds($ultimaFecha) >= 15) {
                    echo "event: heartbeat\n";
                    echo "data: {\"status\":\"ok\"}\n\n";
                    flush();
                    $ultimaFecha = now();
                }

                // Verificar si el cliente desconectó
                if (connection_aborted()) {
                    Log::info("Conexión SSE cerrada para usuario {$userId}");
                    break;
                }
            }
        }, 200, [
            'Cache-Control' => 'no-cache',
            'Content-Type' => 'text/event-stream',
            'X-Accel-Buffering' => 'no',
            'Connection' => 'keep-alive',
        ]);
    }

    /**
     * Crear una notificación (uso interno)
     */
    public static function crearNotificacion(
        User $usuario,
        string $titulo,
        string $contenido,
        string $tipo = 'general',
        array $datosAdicionales = []
    ): Notificacion {
        return Notificacion::crearParaUsuario(
            $usuario,
            $titulo,
            $contenido,
            $tipo,
            $datosAdicionales
        );
    }

    /**
     * Crear notificación a múltiples usuarios
     */
    public static function crearParaMultiplesUsuarios(
        array $usuarioIds,
        string $titulo,
        string $contenido,
        string $tipo = 'general',
        array $datosAdicionales = []
    ): int {
        $creadas = 0;

        foreach ($usuarioIds as $usuarioId) {
            $usuario = User::find($usuarioId);
            if ($usuario) {
                Notificacion::crearParaUsuario(
                    $usuario,
                    $titulo,
                    $contenido,
                    $tipo,
                    $datosAdicionales
                );
                $creadas++;
            }
        }

        Log::info("Se crearon {$creadas} notificaciones para múltiples usuarios");

        return $creadas;
    }
}
