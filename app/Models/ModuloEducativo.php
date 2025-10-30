<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ModuloEducativo extends Model
{
    use HasFactory;

    protected $table = 'modulos_educativos';

    protected $fillable = [
        'titulo',
        'descripcion',
        'slug',
        'curso_id',
        'orden',
        'imagen_portada',
        'estado',
        'duracion_estimada',
        'creador_id',
    ];

    protected $casts = [
        'orden' => 'integer',
        'duracion_estimada' => 'integer',
    ];

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        // Generar slug automáticamente antes de crear
        static::creating(function ($modulo) {
            if (empty($modulo->slug)) {
                $modulo->slug = Str::slug($modulo->titulo);
            }

            // Asignar orden automáticamente si no se especifica
            if ($modulo->orden === 0) {
                $ultimoOrden = static::where('curso_id', $modulo->curso_id)
                    ->max('orden') ?? 0;
                $modulo->orden = $ultimoOrden + 1;
            }
        });
    }

    /**
     * Relación con el curso
     */
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    /**
     * Relación con el creador (usuario)
     */
    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creador_id');
    }

    /**
     * Relación con las lecciones
     */
    public function lecciones(): HasMany
    {
        return $this->hasMany(Leccion::class)->orderBy('orden');
    }

    /**
     * Obtener lecciones publicadas
     */
    public function leccionesPublicadas(): HasMany
    {
        return $this->hasMany(Leccion::class)
            ->where('estado', 'publicado')
            ->orderBy('orden');
    }

    /**
     * Publicar el módulo
     */
    public function publicar(): void
    {
        $this->update(['estado' => 'publicado']);
    }

    /**
     * Archivar el módulo
     */
    public function archivar(): void
    {
        $this->update(['estado' => 'archivado']);
    }

    /**
     * Convertir a borrador
     */
    public function convertirABorrador(): void
    {
        $this->update(['estado' => 'borrador']);
    }

    /**
     * Verificar si está publicado
     */
    public function estaPublicado(): bool
    {
        return $this->estado === 'publicado';
    }

    /**
     * Verificar si está archivado
     */
    public function estaArchivado(): bool
    {
        return $this->estado === 'archivado';
    }

    /**
     * Obtener total de lecciones
     */
    public function getTotalLecciones(): int
    {
        return $this->lecciones()->count();
    }

    /**
     * Obtener duración total del módulo (suma de lecciones)
     */
    public function getDuracionTotal(): int
    {
        return $this->lecciones()->sum('duracion_estimada') ?? 0;
    }

    /**
     * Obtener progreso de un estudiante
     */
    public function getProgresoEstudiante(User $estudiante): array
    {
        $totalLecciones = $this->getTotalLecciones();

        if ($totalLecciones === 0) {
            return [
                'total' => 0,
                'completadas' => 0,
                'porcentaje' => 0,
            ];
        }

        // Aquí se implementaría la lógica de seguimiento de progreso
        // Por ahora retornamos valores por defecto
        return [
            'total' => $totalLecciones,
            'completadas' => 0,
            'porcentaje' => 0,
        ];
    }

    /**
     * Reordenar módulos
     */
    public static function reordenar(array $ordenIds): void
    {
        foreach ($ordenIds as $orden => $id) {
            static::where('id', $id)->update(['orden' => $orden + 1]);
        }
    }

    /**
     * Duplicar módulo
     */
    public function duplicar(): ModuloEducativo
    {
        $nuevoModulo = $this->replicate();
        $nuevoModulo->titulo = $this->titulo . ' (Copia)';
        $nuevoModulo->slug = Str::slug($nuevoModulo->titulo);
        $nuevoModulo->estado = 'borrador';
        $nuevoModulo->save();

        // Duplicar lecciones
        foreach ($this->lecciones as $leccion) {
            $leccion->duplicar($nuevoModulo->id);
        }

        return $nuevoModulo;
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopeEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para filtrar por curso
     */
    public function scopeCurso($query, $cursoId)
    {
        return $query->where('curso_id', $cursoId);
    }

    /**
     * Scope para buscar por título
     */
    public function scopeBuscar($query, $termino)
    {
        return $query->where('titulo', 'like', "%{$termino}%")
            ->orWhere('descripcion', 'like', "%{$termino}%");
    }
}
