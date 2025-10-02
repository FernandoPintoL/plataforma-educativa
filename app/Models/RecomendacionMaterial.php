<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecomendacionMaterial extends Model
{
    use HasFactory;

    protected $table = 'recomendaciones_material';

    protected $fillable = [
        'resultado_analisis_id',
        'material_apoyo_id',
        'estudiante_id',
        'relevancia',
        'asignado',
        'fecha_asignacion',
    ];

    protected $casts = [
        'asignado' => 'boolean',
        'fecha_asignacion' => 'datetime',
    ];

    /**
     * Relación con el resultado de análisis
     */
    public function resultadoAnalisis(): BelongsTo
    {
        return $this->belongsTo(ResultadoAnalisis::class);
    }

    /**
     * Relación con el material de apoyo
     */
    public function materialApoyo(): BelongsTo
    {
        return $this->belongsTo(MaterialApoyo::class);
    }

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Marcar como asignado
     */
    public function marcarComoAsignado(): void
    {
        $this->update([
            'asignado' => true,
            'fecha_asignacion' => now(),
        ]);
    }

    /**
     * Marcar como no asignado
     */
    public function marcarComoNoAsignado(): void
    {
        $this->update([
            'asignado' => false,
            'fecha_asignacion' => null,
        ]);
    }

    /**
     * Obtener nivel de relevancia en texto
     */
    public function getNivelRelevanciaTexto(): string
    {
        if ($this->relevancia >= 0.8) {
            return 'Muy Alta';
        } elseif ($this->relevancia >= 0.6) {
            return 'Alta';
        } elseif ($this->relevancia >= 0.4) {
            return 'Media';
        } elseif ($this->relevancia >= 0.2) {
            return 'Baja';
        } else {
            return 'Muy Baja';
        }
    }

    /**
     * Obtener color de relevancia
     */
    public function getColorRelevancia(): string
    {
        if ($this->relevancia >= 0.8) {
            return 'green';
        } elseif ($this->relevancia >= 0.6) {
            return 'lightgreen';
        } elseif ($this->relevancia >= 0.4) {
            return 'yellow';
        } elseif ($this->relevancia >= 0.2) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    /**
     * Verificar si es relevante
     */
    public function esRelevante(): bool
    {
        return $this->relevancia >= 0.5;
    }

    /**
     * Obtener información de la recomendación
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'material' => $this->materialApoyo->obtenerInformacion(),
            'estudiante' => $this->estudiante->nombre_completo,
            'relevancia' => $this->relevancia,
            'nivel_relevancia' => $this->getNivelRelevanciaTexto(),
            'color_relevancia' => $this->getColorRelevancia(),
            'asignado' => $this->asignado,
            'fecha_asignacion' => $this->fecha_asignacion?->format('d/m/Y H:i'),
            'es_relevante' => $this->esRelevante(),
        ];
    }

    /**
     * Obtener recomendaciones para un estudiante
     */
    public static function getParaEstudiante(User $estudiante): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('estudiante_id', $estudiante->id)
            ->with(['materialApoyo', 'resultadoAnalisis'])
            ->orderBy('relevancia', 'desc')
            ->get();
    }

    /**
     * Obtener recomendaciones asignadas
     */
    public static function getAsignadas(): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('asignado', true)
            ->with(['materialApoyo', 'estudiante'])
            ->orderBy('fecha_asignacion', 'desc')
            ->get();
    }

    /**
     * Obtener recomendaciones pendientes
     */
    public static function getPendientes(): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('asignado', false)
            ->where('relevancia', '>=', 0.5)
            ->with(['materialApoyo', 'estudiante'])
            ->orderBy('relevancia', 'desc')
            ->get();
    }

    /**
     * Obtener estadísticas de recomendaciones
     */
    public static function obtenerEstadisticas(): array
    {
        $total = static::count();
        $asignadas = static::where('asignado', true)->count();
        $pendientes = static::where('asignado', false)->count();
        $relevantes = static::where('relevancia', '>=', 0.5)->count();

        return [
            'total' => $total,
            'asignadas' => $asignadas,
            'pendientes' => $pendientes,
            'relevantes' => $relevantes,
            'porcentaje_asignacion' => $total > 0 ? ($asignadas / $total) * 100 : 0,
            'porcentaje_relevancia' => $total > 0 ? ($relevantes / $total) * 100 : 0,
        ];
    }
}
