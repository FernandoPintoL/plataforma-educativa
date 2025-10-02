<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notificacion extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'contenido',
        'fecha',
        'destinatario_id',
        'leido',
        'tipo',
        'datos_adicionales',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'leido' => 'boolean',
        'datos_adicionales' => 'array',
    ];

    /**
     * Relación con el destinatario
     */
    public function destinatario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'destinatario_id');
    }

    /**
     * Marcar como leído
     */
    public function marcarLeido(): void
    {
        $this->update(['leido' => true]);
    }

    /**
     * Marcar como no leído
     */
    public function marcarNoLeido(): void
    {
        $this->update(['leido' => false]);
    }

    /**
     * Responder a la notificación
     */
    public function responder(string $mensaje): void
    {
        // Implementar lógica de respuesta
        // Por ejemplo, crear una nueva notificación o enviar un email
    }

    /**
     * Obtener icono según el tipo
     */
    public function getIcono(): string
    {
        $iconos = [
            'general' => '📢',
            'tarea' => '📝',
            'evaluacion' => '📊',
            'calificacion' => '🎯',
            'recomendacion' => '💡',
            'recordatorio' => '⏰',
            'alerta' => '⚠️',
            'exito' => '✅',
            'error' => '❌',
            'info' => 'ℹ️',
        ];
        
        return $iconos[$this->tipo] ?? '📢';
    }

    /**
     * Obtener color según el tipo
     */
    public function getColor(): string
    {
        $colores = [
            'general' => 'blue',
            'tarea' => 'green',
            'evaluacion' => 'purple',
            'calificacion' => 'yellow',
            'recomendacion' => 'orange',
            'recordatorio' => 'gray',
            'alerta' => 'red',
            'exito' => 'green',
            'error' => 'red',
            'info' => 'blue',
        ];
        
        return $colores[$this->tipo] ?? 'blue';
    }

    /**
     * Obtener tiempo transcurrido
     */
    public function getTiempoTranscurrido(): string
    {
        $diferencia = now()->diffInMinutes($this->fecha);
        
        if ($diferencia < 1) {
            return 'Hace un momento';
        } elseif ($diferencia < 60) {
            return "Hace {$diferencia} minutos";
        } elseif ($diferencia < 1440) {
            $horas = floor($diferencia / 60);
            return "Hace {$horas} hora" . ($horas > 1 ? 's' : '');
        } elseif ($diferencia < 10080) {
            $dias = floor($diferencia / 1440);
            return "Hace {$dias} día" . ($dias > 1 ? 's' : '');
        } else {
            return $this->fecha->format('d/m/Y');
        }
    }

    /**
     * Verificar si es reciente
     */
    public function esReciente(int $minutos = 30): bool
    {
        return $this->fecha->diffInMinutes(now()) <= $minutos;
    }

    /**
     * Obtener información de la notificación
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'contenido' => $this->contenido,
            'tipo' => $this->tipo,
            'icono' => $this->getIcono(),
            'color' => $this->getColor(),
            'leido' => $this->leido,
            'fecha' => $this->fecha->format('d/m/Y H:i'),
            'tiempo_transcurrido' => $this->getTiempoTranscurrido(),
            'es_reciente' => $this->esReciente(),
            'datos_adicionales' => $this->datos_adicionales,
        ];
    }

    /**
     * Crear notificación para un usuario
     */
    public static function crearParaUsuario(
        User $usuario,
        string $titulo,
        string $contenido,
        string $tipo = 'general',
        array $datosAdicionales = []
    ): self {
        return static::create([
            'titulo' => $titulo,
            'contenido' => $contenido,
            'fecha' => now(),
            'destinatario_id' => $usuario->id,
            'tipo' => $tipo,
            'datos_adicionales' => $datosAdicionales,
            'leido' => false,
        ]);
    }

    /**
     * Obtener notificaciones de un usuario
     */
    public static function getParaUsuario(User $usuario, int $limite = 50): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('destinatario_id', $usuario->id)
            ->orderBy('fecha', 'desc')
            ->limit($limite)
            ->get();
    }

    /**
     * Obtener notificaciones no leídas de un usuario
     */
    public static function getNoLeidasParaUsuario(User $usuario): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('destinatario_id', $usuario->id)
            ->where('leido', false)
            ->orderBy('fecha', 'desc')
            ->get();
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    public static function marcarTodasComoLeidas(User $usuario): int
    {
        return static::where('destinatario_id', $usuario->id)
            ->where('leido', false)
            ->update(['leido' => true]);
    }

    /**
     * Obtener estadísticas de notificaciones
     */
    public static function obtenerEstadisticas(): array
    {
        $total = static::count();
        $leidas = static::where('leido', true)->count();
        $noLeidas = static::where('leido', false)->count();
        $recientes = static::where('fecha', '>=', now()->subHours(24))->count();
        
        return [
            'total' => $total,
            'leidas' => $leidas,
            'no_leidas' => $noLeidas,
            'recientes' => $recientes,
            'porcentaje_lectura' => $total > 0 ? ($leidas / $total) * 100 : 0,
        ];
    }

    /**
     * Obtener notificaciones por tipo
     */
    public static function getPorTipo(string $tipo): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('tipo', $tipo)
            ->orderBy('fecha', 'desc')
            ->get();
    }

    /**
     * Limpiar notificaciones antiguas
     */
    public static function limpiarAntiguas(int $dias = 30): int
    {
        return static::where('fecha', '<', now()->subDays($dias))
            ->delete();
    }
}
