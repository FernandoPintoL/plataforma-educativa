<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MaterialApoyo extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'tipo',
        'url',
        'descripcion',
        'nivel_dificultad',
        'conceptos_relacionados',
        'activo',
    ];

    protected $casts = [
        'conceptos_relacionados' => 'array',
        'activo' => 'boolean',
    ];

    /**
     * Relación con las recomendaciones de material
     */
    public function recomendacionesMaterial(): HasMany
    {
        return $this->hasMany(RecomendacionMaterial::class);
    }

    /**
     * Asignar material a un estudiante
     */
    public function asignarAEstudiante(User $estudiante): void
    {
        // Crear recomendación de material
        RecomendacionMaterial::create([
            'resultado_analisis_id' => null, // Se puede asignar sin análisis previo
            'material_apoyo_id' => $this->id,
            'estudiante_id' => $estudiante->id,
            'relevancia' => 0.5, // Relevancia por defecto
            'asignado' => true,
            'fecha_asignacion' => now(),
        ]);
    }

    /**
     * Registrar interacción con el material
     */
    public function registrarInteraccion(string $tipo): void
    {
        // Implementar registro de interacciones
        // Por ejemplo, incrementar contador de visualizaciones, descargas, etc.
        
        switch ($tipo) {
            case 'visualizacion':
                $this->increment('visualizaciones');
                break;
            case 'descarga':
                $this->increment('descargas');
                break;
            case 'completado':
                $this->increment('completados');
                break;
        }
    }

    /**
     * Obtener icono según el tipo
     */
    public function getIcono(): string
    {
        $iconos = [
            'video' => '🎥',
            'documento' => '📄',
            'ejercicio' => '📝',
            'simulacion' => '🎮',
            'enlace' => '🔗',
            'presentacion' => '📊',
            'audio' => '🎵',
            'imagen' => '🖼️',
        ];
        
        return $iconos[$this->tipo] ?? '📁';
    }

    /**
     * Obtener color según el tipo
     */
    public function getColor(): string
    {
        $colores = [
            'video' => 'red',
            'documento' => 'blue',
            'ejercicio' => 'green',
            'simulacion' => 'purple',
            'enlace' => 'orange',
            'presentacion' => 'yellow',
            'audio' => 'pink',
            'imagen' => 'teal',
        ];
        
        return $colores[$this->tipo] ?? 'gray';
    }

    /**
     * Obtener nivel de dificultad en texto
     */
    public function getNivelDificultadTexto(): string
    {
        $niveles = [
            1 => 'Muy Fácil',
            2 => 'Fácil',
            3 => 'Intermedio',
            4 => 'Difícil',
            5 => 'Muy Difícil',
        ];
        
        return $niveles[$this->nivel_dificultad] ?? 'Desconocido';
    }

    /**
     * Obtener color del nivel de dificultad
     */
    public function getColorNivelDificultad(): string
    {
        $colores = [
            1 => 'green',
            2 => 'lightgreen',
            3 => 'yellow',
            4 => 'orange',
            5 => 'red',
        ];
        
        return $colores[$this->nivel_dificultad] ?? 'gray';
    }

    /**
     * Verificar si el material es apropiado para un nivel
     */
    public function esApropiadoParaNivel(int $nivelEstudiante): bool
    {
        // El material es apropiado si está dentro de 2 niveles del estudiante
        return abs($this->nivel_dificultad - $nivelEstudiante) <= 2;
    }

    /**
     * Obtener URL de acceso
     */
    public function getUrlAcceso(): string
    {
        if ($this->url) {
            return $this->url;
        }
        
        // Si es un archivo local, generar URL
        return route('material.download', $this->id);
    }

    /**
     * Obtener información del material
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'tipo' => $this->tipo,
            'descripcion' => $this->descripcion,
            'nivel_dificultad' => $this->nivel_dificultad,
            'nivel_dificultad_texto' => $this->getNivelDificultadTexto(),
            'conceptos_relacionados' => $this->conceptos_relacionados,
            'icono' => $this->getIcono(),
            'color' => $this->getColor(),
            'url' => $this->getUrlAcceso(),
            'activo' => $this->activo,
            'fecha_creacion' => $this->created_at->format('d/m/Y'),
        ];
    }

    /**
     * Obtener estadísticas de uso
     */
    public function obtenerEstadisticas(): array
    {
        $recomendaciones = $this->recomendacionesMaterial();
        
        return [
            'total_recomendaciones' => $recomendaciones->count(),
            'total_asignaciones' => $recomendaciones->where('asignado', true)->count(),
            'promedio_relevancia' => $recomendaciones->avg('relevancia') ?? 0,
            'ultima_asignacion' => $recomendaciones->where('asignado', true)
                ->orderBy('fecha_asignacion', 'desc')
                ->first()?->fecha_asignacion,
        ];
    }

    /**
     * Buscar materiales por concepto
     */
    public static function buscarPorConcepto(string $concepto): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->whereJsonContains('conceptos_relacionados', $concepto)
            ->get();
    }

    /**
     * Buscar materiales por nivel de dificultad
     */
    public static function buscarPorNivel(int $nivel): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->where('nivel_dificultad', $nivel)
            ->get();
    }

    /**
     * Buscar materiales por tipo
     */
    public static function buscarPorTipo(string $tipo): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->where('tipo', $tipo)
            ->get();
    }

    /**
     * Obtener materiales recomendados para un estudiante
     */
    public static function getRecomendadosParaEstudiante(User $estudiante): \Illuminate\Database\Eloquent\Collection
    {
        $rendimiento = $estudiante->rendimientoAcademico;
        $nivelEstudiante = $rendimiento ? 
            ($rendimiento->promedio >= 90 ? 5 : 
             ($rendimiento->promedio >= 80 ? 4 : 
              ($rendimiento->promedio >= 70 ? 3 : 
               ($rendimiento->promedio >= 60 ? 2 : 1)))) : 3;
        
        return static::where('activo', true)
            ->whereBetween('nivel_dificultad', [$nivelEstudiante - 1, $nivelEstudiante + 1])
            ->orderBy('nivel_dificultad')
            ->get();
    }

    /**
     * Obtener materiales más populares
     */
    public static function getMasPopulares(int $limite = 10): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->withCount('recomendacionesMaterial')
            ->orderBy('recomendaciones_material_count', 'desc')
            ->limit($limite)
            ->get();
    }
}
