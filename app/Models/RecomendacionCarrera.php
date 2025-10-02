<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecomendacionCarrera extends Model
{
    use HasFactory;

    protected $fillable = [
        'estudiante_id',
        'carrera_id',
        'compatibilidad',
        'justificacion',
        'fecha',
        'fuente',
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con la carrera
     */
    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class);
    }

    /**
     * Detallar compatibilidad
     */
    public function detallarCompatibilidad(): array
    {
        $perfil = $this->estudiante->perfilVocacional;
        $carrera = $this->carrera;
        
        if (!$perfil || !$carrera) {
            return [];
        }
        
        $detalles = [];
        $perfilIdeal = $carrera->perfil_ideal;
        
        foreach ($perfilIdeal as $criterio => $puntajeRequerido) {
            $puntajeEstudiante = $perfil->obtenerPuntajeCriterio($criterio);
            $compatibilidadCriterio = min(1, $puntajeEstudiante / $puntajeRequerido);
            
            $detalles[] = [
                'criterio' => ucfirst(str_replace('_', ' ', $criterio)),
                'puntaje_estudiante' => $puntajeEstudiante,
                'puntaje_requerido' => $puntajeRequerido,
                'compatibilidad' => $compatibilidadCriterio,
                'nivel' => $this->obtenerNivelCompatibilidad($compatibilidadCriterio),
            ];
        }
        
        return $detalles;
    }

    /**
     * Obtener nivel de compatibilidad
     */
    private function obtenerNivelCompatibilidad(float $compatibilidad): string
    {
        if ($compatibilidad >= 0.9) return 'Excelente';
        if ($compatibilidad >= 0.8) return 'Muy Alta';
        if ($compatibilidad >= 0.7) return 'Alta';
        if ($compatibilidad >= 0.6) return 'Buena';
        if ($compatibilidad >= 0.5) return 'Moderada';
        return 'Baja';
    }

    /**
     * Mostrar recursos informativos
     */
    public function mostrarRecursosInformativos(): array
    {
        $carrera = $this->carrera;
        $recursos = [];
        
        // Recursos de la carrera
        $recursos[] = [
            'tipo' => 'descripcion',
            'titulo' => 'Descripción de la Carrera',
            'contenido' => $carrera->descripcion,
        ];
        
        // Áreas de conocimiento
        if (!empty($carrera->areas_conocimiento)) {
            $recursos[] = [
                'tipo' => 'areas_conocimiento',
                'titulo' => 'Áreas de Conocimiento',
                'contenido' => $carrera->getAreasConocimientoFormateadas(),
            ];
        }
        
        // Oportunidades laborales
        if (!empty($carrera->oportunidades_laborales)) {
            $recursos[] = [
                'tipo' => 'oportunidades_laborales',
                'titulo' => 'Oportunidades Laborales',
                'contenido' => $carrera->getOportunidadesLaboralesFormateadas(),
            ];
        }
        
        // Instituciones que ofrecen la carrera
        $instituciones = $carrera->obtenerInstitucionesOfertantes();
        if ($instituciones->isNotEmpty()) {
            $recursos[] = [
                'tipo' => 'instituciones',
                'titulo' => 'Instituciones que Ofrecen esta Carrera',
                'contenido' => $instituciones->pluck('nombre')->toArray(),
            ];
        }
        
        return $recursos;
    }

    /**
     * Obtener nivel de compatibilidad en texto
     */
    public function getNivelCompatibilidadTexto(): string
    {
        return $this->obtenerNivelCompatibilidad($this->compatibilidad);
    }

    /**
     * Obtener color de compatibilidad
     */
    public function getColorCompatibilidad(): string
    {
        if ($this->compatibilidad >= 0.8) return 'green';
        if ($this->compatibilidad >= 0.6) return 'yellow';
        return 'red';
    }

    /**
     * Verificar si es una recomendación fuerte
     */
    public function esRecomendacionFuerte(): bool
    {
        return $this->compatibilidad >= 0.8;
    }

    /**
     * Verificar si es una recomendación moderada
     */
    public function esRecomendacionModerada(): bool
    {
        return $this->compatibilidad >= 0.6 && $this->compatibilidad < 0.8;
    }

    /**
     * Verificar si es una recomendación débil
     */
    public function esRecomendacionDebil(): bool
    {
        return $this->compatibilidad < 0.6;
    }

    /**
     * Obtener información de la recomendación
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'estudiante' => $this->estudiante->nombre_completo,
            'carrera' => $this->carrera->obtenerInformacion(),
            'compatibilidad' => $this->compatibilidad,
            'nivel_compatibilidad' => $this->getNivelCompatibilidadTexto(),
            'color_compatibilidad' => $this->getColorCompatibilidad(),
            'justificacion' => $this->justificacion,
            'fecha' => $this->fecha->format('d/m/Y H:i'),
            'fuente' => $this->fuente,
            'es_fuerte' => $this->esRecomendacionFuerte(),
            'es_moderada' => $this->esRecomendacionModerada(),
            'es_debil' => $this->esRecomendacionDebil(),
            'detalles_compatibilidad' => $this->detallarCompatibilidad(),
            'recursos_informativos' => $this->mostrarRecursosInformativos(),
        ];
    }

    /**
     * Obtener recomendaciones para un estudiante
     */
    public static function getParaEstudiante(User $estudiante): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('estudiante_id', $estudiante->id)
            ->with('carrera')
            ->orderBy('compatibilidad', 'desc')
            ->get();
    }

    /**
     * Obtener recomendaciones fuertes
     */
    public static function getFuertes(): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('compatibilidad', '>=', 0.8)
            ->with(['estudiante', 'carrera'])
            ->orderBy('compatibilidad', 'desc')
            ->get();
    }

    /**
     * Obtener recomendaciones por fuente
     */
    public static function getPorFuente(string $fuente): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('fuente', $fuente)
            ->with(['estudiante', 'carrera'])
            ->orderBy('compatibilidad', 'desc')
            ->get();
    }

    /**
     * Obtener estadísticas de recomendaciones
     */
    public static function obtenerEstadisticas(): array
    {
        $total = static::count();
        $fuertes = static::where('compatibilidad', '>=', 0.8)->count();
        $moderadas = static::where('compatibilidad', '>=', 0.6)->where('compatibilidad', '<', 0.8)->count();
        $debil = static::where('compatibilidad', '<', 0.6)->count();
        
        return [
            'total' => $total,
            'fuertes' => $fuertes,
            'moderadas' => $moderadas,
            'debil' => $debil,
            'promedio_compatibilidad' => static::avg('compatibilidad') ?? 0,
            'porcentaje_fuertes' => $total > 0 ? ($fuertes / $total) * 100 : 0,
        ];
    }

    /**
     * Crear recomendación para un estudiante
     */
    public static function crearParaEstudiante(
        User $estudiante,
        Carrera $carrera,
        float $compatibilidad,
        string $justificacion,
        string $fuente = 'sistema'
    ): self {
        return static::create([
            'estudiante_id' => $estudiante->id,
            'carrera_id' => $carrera->id,
            'compatibilidad' => $compatibilidad,
            'justificacion' => $justificacion,
            'fecha' => now(),
            'fuente' => $fuente,
        ]);
    }
}
