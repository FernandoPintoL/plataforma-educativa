<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\StreamedResponse;
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

        $query = Notificacion::where('destinatario_id', $user->id)
            ->orderBy('fecha', 'desc');

        if ($tipo) {
            $query->where('tipo', $tipo);
        }

        $notificaciones = $query->limit($limite)->get();

        return response()->json([
            'success' => true,
            'data' => $notificaciones->map(fn($n) => $n->obtenerInformacion()),
            'count' => $notificaciones->count(),
        ]);
    }

    /**
     * Obtener notificaciones no leídas
     */
    public function getNoLeidas(Request $request): JsonResponse
    {
        $user = $request->user();

        $noLeidas = Notificacion::getNoLeidasParaUsuario($user);

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
        // Verificar que el usuario sea el destinatario
        if ($notificacion->destinatario_id !== $request->user()->id) {
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
        // Verificar que el usuario sea el destinatario
        if ($notificacion->destinatario_id !== $request->user()->id) {
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
        $cantidad = Notificacion::marcarTodasComoLeidas($user);

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
        // Verificar que el usuario sea el destinatario
        if ($notificacion->destinatario_id !== $request->user()->id) {
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
            'total' => Notificacion::where('destinatario_id', $user->id)->count(),
            'no_leidas' => Notificacion::where('destinatario_id', $user->id)
                ->where('leido', false)
                ->count(),
            'leidas' => Notificacion::where('destinatario_id', $user->id)
                ->where('leido', true)
                ->count(),
            'recientes_24h' => Notificacion::where('destinatario_id', $user->id)
                ->where('fecha', '>=', now()->subHours(24))
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
     * Uso del cliente:
     * const eventSource = new EventSource('/api/notificaciones/stream');
     * eventSource.addEventListener('notificacion', (event) => {
     *     const notificacion = JSON.parse(event.data);
     *     console.log('Nueva notificación:', notificacion);
     * });
     */
    public function stream(Request $request): StreamedResponse
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            Log::warning('Unauthorized SSE stream request', [
                'ip' => $request->ip(),
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
            $noLeidas = Notificacion::where('destinatario_id', $userId)
                ->where('leido', false)
                ->where('fecha', '>=', now()->subHours(1))
                ->orderBy('fecha', 'desc')
                ->get();

            foreach ($noLeidas as $notificacion) {
                echo "event: notificacion\n";
                echo "data: " . json_encode($notificacion->obtenerInformacion()) . "\n\n";
                flush();
            }

            // Mantener la conexión abierta y enviar notificaciones nuevas
            $ultimaFecha = now();

            while (true) {
                // Buscar nuevas notificaciones cada 2 segundos
                sleep(2);

                $nuevas = Notificacion::where('destinatario_id', $userId)
                    ->where('fecha', '>', $ultimaFecha)
                    ->orderBy('fecha', 'asc')
                    ->get();

                if ($nuevas->isNotEmpty()) {
                    foreach ($nuevas as $notificacion) {
                        echo "event: notificacion\n";
                        echo "data: " . json_encode($notificacion->obtenerInformacion()) . "\n\n";
                        flush();

                        // Actualizar timestamp
                        $ultimaFecha = $notificacion->fecha;
                    }
                }

                // Enviar heartbeat cada 30 segundos para mantener la conexión
                if (now()->diffInSeconds($ultimaFecha) >= 30) {
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
