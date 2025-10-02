<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PerfilVocacional extends Model
{
    use HasFactory;

    protected $fillable = [
        'estudiante_id',
        'intereses',
        'habilidades',
        'personalidad',
        'aptitudes',
        'fecha_creacion',
        'fecha_actualizacion',
    ];

    protected $casts = [
        'intereses' => 'array',
        'habilidades' => 'array',
        'personalidad' => 'array',
        'aptitudes' => 'array',
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime',
    ];

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con las recomendaciones de carrera
     */
    public function recomendacionesCarrera(): HasMany
    {
        return $this->hasMany(RecomendacionCarrera::class);
    }

    /**
     * Actualizar perfil con resultado de test
     */
    public function actualizarPerfil(ResultadoTestVocacional $resultadoTest): void
    {
        $this->update([
            'intereses' => $resultadoTest->extraerIntereses(),
            'habilidades' => $resultadoTest->extraerHabilidades(),
            'personalidad' => $resultadoTest->extraerPersonalidad(),
            'aptitudes' => $resultadoTest->extraerAptitudes(),
            'fecha_actualizacion' => now(),
        ]);
    }

    /**
     * Combinar con rendimiento académico
     */
    public function combinarConRendimientoAcademico(): void
    {
        $rendimiento = $this->estudiante->rendimientoAcademico;
        
        if (!$rendimiento) {
            return;
        }
        
        // Obtener contribución del rendimiento académico
        $contribucion = $rendimiento->contribuirAlPerfilVocacional();
        
        // Combinar aptitudes académicas con las existentes
        $aptitudesActuales = $this->aptitudes ?? [];
        $aptitudesAcademicas = $contribucion['aptitudes_academicas'] ?? [];
        
        foreach ($aptitudesAcademicas as $aptitud) {
            $aptitudesActuales[$aptitud] = $rendimiento->promedio / 100; // Normalizar a 0-1
        }
        
        $this->update([
            'aptitudes' => $aptitudesActuales,
            'fecha_actualizacion' => now(),
        ]);
    }

    /**
     * Calcular compatibilidad con una carrera
     */
    public function calcularCompatibilidadCarrera(Carrera $carrera): float
    {
        $perfilIdeal = $carrera->perfil_ideal;
        $compatibilidad = 0;
        $totalCriterios = 0;
        
        foreach ($perfilIdeal as $criterio => $puntajeRequerido) {
            $puntajeEstudiante = $this->obtenerPuntajeCriterio($criterio);
            
            if ($puntajeEstudiante > 0) {
                $compatibilidad += min(1, $puntajeEstudiante / $puntajeRequerido);
                $totalCriterios++;
            }
        }
        
        return $totalCriterios > 0 ? $compatibilidad / $totalCriterios : 0;
    }

    /**
     * Obtener puntaje de un criterio específico
     */
    private function obtenerPuntajeCriterio(string $criterio): float
    {
        return $this->intereses[$criterio] ?? 
               $this->habilidades[$criterio] ?? 
               $this->personalidad[$criterio] ?? 
               $this->aptitudes[$criterio] ?? 0;
    }

    /**
     * Obtener áreas de mayor interés
     */
    public function getAreasMayorInteres(int $limite = 5): array
    {
        if (!$this->intereses) {
            return [];
        }
        
        arsort($this->intereses);
        return array_slice($this->intereses, 0, $limite, true);
    }

    /**
     * Obtener habilidades más desarrolladas
     */
    public function getHabilidadesMasDesarrolladas(int $limite = 5): array
    {
        if (!$this->habilidades) {
            return [];
        }
        
        arsort($this->habilidades);
        return array_slice($this->habilidades, 0, $limite, true);
    }

    /**
     * Obtener rasgos de personalidad dominantes
     */
    public function getRasgosPersonalidadDominantes(int $limite = 5): array
    {
        if (!$this->personalidad) {
            return [];
        }
        
        arsort($this->personalidad);
        return array_slice($this->personalidad, 0, $limite, true);
    }

    /**
     * Obtener aptitudes más fuertes
     */
    public function getAptitudesMasFuertes(int $limite = 5): array
    {
        if (!$this->aptitudes) {
            return [];
        }
        
        arsort($this->aptitudes);
        return array_slice($this->aptitudes, 0, $limite, true);
    }

    /**
     * Obtener perfil resumido
     */
    public function obtenerPerfilResumido(): array
    {
        return [
            'estudiante' => $this->estudiante->nombre_completo,
            'areas_interes' => $this->getAreasMayorInteres(),
            'habilidades_desarrolladas' => $this->getHabilidadesMasDesarrolladas(),
            'rasgos_personalidad' => $this->getRasgosPersonalidadDominantes(),
            'aptitudes_fuertes' => $this->getAptitudesMasFuertes(),
            'fecha_actualizacion' => $this->fecha_actualizacion->format('d/m/Y'),
        ];
    }

    /**
     * Obtener recomendaciones de carrera
     */
    public function obtenerRecomendacionesCarrera(int $limite = 10): array
    {
        $carreras = Carrera::where('activo', true)->get();
        $recomendaciones = [];
        
        foreach ($carreras as $carrera) {
            $compatibilidad = $this->calcularCompatibilidadCarrera($carrera);
            
            if ($compatibilidad > 0.5) {
                $recomendaciones[] = [
                    'carrera' => $carrera,
                    'compatibilidad' => $compatibilidad,
                    'nivel_compatibilidad' => $this->obtenerNivelCompatibilidad($compatibilidad),
                ];
            }
        }
        
        // Ordenar por compatibilidad
        usort($recomendaciones, fn($a, $b) => $b['compatibilidad'] <=> $a['compatibilidad']);
        
        return array_slice($recomendaciones, 0, $limite);
    }

    /**
     * Obtener nivel de compatibilidad en texto
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
     * Obtener información completa del perfil
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'estudiante' => $this->estudiante->nombre_completo,
            'intereses' => $this->intereses,
            'habilidades' => $this->habilidades,
            'personalidad' => $this->personalidad,
            'aptitudes' => $this->aptitudes,
            'fecha_creacion' => $this->fecha_creacion->format('d/m/Y H:i'),
            'fecha_actualizacion' => $this->fecha_actualizacion->format('d/m/Y H:i'),
            'perfil_resumido' => $this->obtenerPerfilResumido(),
            'recomendaciones_carrera' => $this->obtenerRecomendacionesCarrera(),
        ];
    }

    /**
     * Obtener estadísticas del perfil
     */
    public function obtenerEstadisticas(): array
    {
        return [
            'total_intereses' => count($this->intereses ?? []),
            'total_habilidades' => count($this->habilidades ?? []),
            'total_rasgos_personalidad' => count($this->personalidad ?? []),
            'total_aptitudes' => count($this->aptitudes ?? []),
            'promedio_intereses' => $this->calcularPromedio($this->intereses),
            'promedio_habilidades' => $this->calcularPromedio($this->habilidades),
            'promedio_personalidad' => $this->calcularPromedio($this->personalidad),
            'promedio_aptitudes' => $this->calcularPromedio($this->aptitudes),
        ];
    }

    /**
     * Calcular promedio de un array de puntajes
     */
    private function calcularPromedio(?array $puntajes): float
    {
        if (!$puntajes || empty($puntajes)) {
            return 0;
        }
        
        return array_sum($puntajes) / count($puntajes);
    }

    /**
     * Verificar si el perfil está completo
     */
    public function estaCompleto(): bool
    {
        return !empty($this->intereses) && 
               !empty($this->habilidades) && 
               !empty($this->personalidad) && 
               !empty($this->aptitudes);
    }

    /**
     * Obtener nivel de completitud
     */
    public function getNivelCompletitud(): float
    {
        $campos = [
            'intereses' => !empty($this->intereses),
            'habilidades' => !empty($this->habilidades),
            'personalidad' => !empty($this->personalidad),
            'aptitudes' => !empty($this->aptitudes),
        ];
        
        $completos = array_sum($campos);
        return ($completos / count($campos)) * 100;
    }
}
