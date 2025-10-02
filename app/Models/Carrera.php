<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrera extends Model
{
    use HasFactory;

    protected $table = 'carreras';

    protected $fillable = [
        'nombre',
        'descripcion',
        'nivel_educativo',
        'duracion_anos',
        'areas_conocimiento',
        'perfil_ideal',
        'oportunidades_laborales',
        'activo',
    ];

    protected $casts = [
        'areas_conocimiento' => 'array',
        'perfil_ideal' => 'array',
        'oportunidades_laborales' => 'array',
        'activo' => 'boolean',
    ];

    /**
     * Relación con las recomendaciones de carrera
     */
    public function recomendacionesCarrera(): HasMany
    {
        return $this->hasMany(RecomendacionCarrera::class);
    }

    /**
     * Relación con las instituciones que ofrecen la carrera
     */
    public function instituciones(): BelongsToMany
    {
        return $this->belongsToMany(Institucion::class);
    }

    /**
     * Calcular compatibilidad con un perfil vocacional
     */
    public function calcularCompatibilidad(PerfilVocacional $perfil): float
    {
        return $perfil->calcularCompatibilidadCarrera($this);
    }

    /**
     * Obtener instituciones que ofrecen la carrera
     */
    public function obtenerInstitucionesOfertantes(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->instituciones()->where('activo', true)->get();
    }

    /**
     * Obtener duración formateada
     */
    public function getDuracionFormateada(): string
    {
        $anos = floor($this->duracion_anos);
        $meses = round(($this->duracion_anos - $anos) * 12);

        if ($anos > 0 && $meses > 0) {
            return "{$anos} año".($anos > 1 ? 's' : '')." y {$meses} mes".($meses > 1 ? 'es' : '');
        } elseif ($anos > 0) {
            return "{$anos} año".($anos > 1 ? 's' : '');
        } else {
            return "{$meses} mes".($meses > 1 ? 'es' : '');
        }
    }

    /**
     * Obtener nivel educativo formateado
     */
    public function getNivelEducativoFormateado(): string
    {
        $niveles = [
            'tecnico' => 'Técnico',
            'tecnico_superior' => 'Técnico Superior',
            'licenciatura' => 'Licenciatura',
            'ingenieria' => 'Ingeniería',
            'maestria' => 'Maestría',
            'doctorado' => 'Doctorado',
        ];

        return $niveles[$this->nivel_educativo] ?? ucfirst($this->nivel_educativo);
    }

    /**
     * Obtener áreas de conocimiento formateadas
     */
    public function getAreasConocimientoFormateadas(): array
    {
        if (! $this->areas_conocimiento) {
            return [];
        }

        return array_map('ucfirst', $this->areas_conocimiento);
    }

    /**
     * Obtener oportunidades laborales formateadas
     */
    public function getOportunidadesLaboralesFormateadas(): array
    {
        if (! $this->oportunidades_laborales) {
            return [];
        }

        return array_map('ucfirst', $this->oportunidades_laborales);
    }

    /**
     * Obtener perfil ideal formateado
     */
    public function getPerfilIdealFormateado(): array
    {
        if (! $this->perfil_ideal) {
            return [];
        }

        $perfilFormateado = [];
        foreach ($this->perfil_ideal as $criterio => $puntaje) {
            $perfilFormateado[ucfirst(str_replace('_', ' ', $criterio))] = $puntaje;
        }

        return $perfilFormateado;
    }

    /**
     * Obtener información de la carrera
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'nivel_educativo' => $this->nivel_educativo,
            'nivel_educativo_formateado' => $this->getNivelEducativoFormateado(),
            'duracion_anos' => $this->duracion_anos,
            'duracion_formateada' => $this->getDuracionFormateada(),
            'areas_conocimiento' => $this->areas_conocimiento,
            'areas_conocimiento_formateadas' => $this->getAreasConocimientoFormateadas(),
            'perfil_ideal' => $this->perfil_ideal,
            'perfil_ideal_formateado' => $this->getPerfilIdealFormateado(),
            'oportunidades_laborales' => $this->oportunidades_laborales,
            'oportunidades_laborales_formateadas' => $this->getOportunidadesLaboralesFormateadas(),
            'activo' => $this->activo,
            'instituciones' => $this->obtenerInstitucionesOfertantes(),
        ];
    }

    /**
     * Obtener estadísticas de la carrera
     */
    public function obtenerEstadisticas(): array
    {
        $totalRecomendaciones = $this->recomendacionesCarrera()->count();
        $recomendacionesAltaCompatibilidad = $this->recomendacionesCarrera()
            ->where('compatibilidad', '>=', 0.8)
            ->count();

        return [
            'total_recomendaciones' => $totalRecomendaciones,
            'recomendaciones_alta_compatibilidad' => $recomendacionesAltaCompatibilidad,
            'promedio_compatibilidad' => $this->recomendacionesCarrera()->avg('compatibilidad') ?? 0,
            'total_instituciones' => $this->instituciones()->count(),
        ];
    }

    /**
     * Buscar carreras por área de conocimiento
     */
    public static function buscarPorArea(string $area): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->whereJsonContains('areas_conocimiento', $area)
            ->get();
    }

    /**
     * Buscar carreras por nivel educativo
     */
    public static function buscarPorNivel(string $nivel): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->where('nivel_educativo', $nivel)
            ->get();
    }

    /**
     * Buscar carreras por duración
     */
    public static function buscarPorDuracion(float $duracionMinima, float $duracionMaxima): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->whereBetween('duracion_anos', [$duracionMinima, $duracionMaxima])
            ->get();
    }

    /**
     * Obtener carreras más populares
     */
    public static function getMasPopulares(int $limite = 10): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->withCount('recomendacionesCarrera')
            ->orderBy('recomendaciones_carrera_count', 'desc')
            ->limit($limite)
            ->get();
    }

    /**
     * Obtener carreras recomendadas para un perfil
     */
    public static function getRecomendadasParaPerfil(PerfilVocacional $perfil, int $limite = 10): \Illuminate\Database\Eloquent\Collection
    {
        $carreras = static::where('activo', true)->get();
        $recomendaciones = [];

        foreach ($carreras as $carrera) {
            $compatibilidad = $carrera->calcularCompatibilidad($perfil);

            if ($compatibilidad > 0.5) {
                $recomendaciones[] = [
                    'carrera' => $carrera,
                    'compatibilidad' => $compatibilidad,
                ];
            }
        }

        // Ordenar por compatibilidad
        usort($recomendaciones, fn ($a, $b) => $b['compatibilidad'] <=> $a['compatibilidad']);

        return collect(array_slice($recomendaciones, 0, $limite))->pluck('carrera');
    }

    /**
     * Verificar si la carrera es apropiada para un perfil
     */
    public function esApropiadaParaPerfil(PerfilVocacional $perfil): bool
    {
        return $this->calcularCompatibilidad($perfil) >= 0.6;
    }

    /**
     * Obtener nivel de dificultad de la carrera
     */
    public function getNivelDificultad(): string
    {
        $duracion = $this->duracion_anos;

        if ($duracion >= 5) {
            return 'Alta';
        }

        if ($duracion >= 3) {
            return 'Media';
        }

        return 'Baja';
    }

    /**
     * Obtener color del nivel de dificultad
     */
    public function getColorNivelDificultad(): string
    {
        $nivel = $this->getNivelDificultad();

        return match ($nivel) {
            'Alta' => 'red',
            'Media' => 'yellow',
            'Baja' => 'green',
            default => 'gray',
        };
    }
}
