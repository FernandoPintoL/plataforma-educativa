<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Leccion extends Model
{
    use HasFactory;

    protected $table = 'lecciones';

    protected $fillable = [
        'modulo_educativo_id',
        'titulo',
        'contenido',
        'slug',
        'tipo',
        'orden',
        'duracion_estimada',
        'video_url',
        'video_proveedor',
        'es_obligatoria',
        'permite_descarga',
        'estado',
    ];

    protected $casts = [
        'orden' => 'integer',
        'duracion_estimada' => 'integer',
        'es_obligatoria' => 'boolean',
        'permite_descarga' => 'boolean',
    ];

    /**
     * Boot del modelo
     */
    protected static function boot()
    {
        parent::boot();

        // Generar slug automáticamente antes de crear
        static::creating(function ($leccion) {
            if (empty($leccion->slug)) {
                $leccion->slug = Str::slug($leccion->titulo);
            }

            // Asignar orden automáticamente si no se especifica
            if ($leccion->orden === 0) {
                $ultimoOrden = static::where('modulo_educativo_id', $leccion->modulo_educativo_id)
                    ->max('orden') ?? 0;
                $leccion->orden = $ultimoOrden + 1;
            }
        });
    }

    /**
     * Relación con el módulo educativo
     */
    public function moduloEducativo(): BelongsTo
    {
        return $this->belongsTo(ModuloEducativo::class);
    }

    /**
     * Relación con recursos (muchos a muchos)
     */
    public function recursos(): BelongsToMany
    {
        return $this->belongsToMany(Recurso::class, 'leccion_recurso')
            ->withPivot('orden')
            ->withTimestamps()
            ->orderBy('leccion_recurso.orden');
    }

    /**
     * Publicar la lección
     */
    public function publicar(): void
    {
        $this->update(['estado' => 'publicado']);
    }

    /**
     * Archivar la lección
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
     * Verificar si está publicada
     */
    public function estaPublicada(): bool
    {
        return $this->estado === 'publicado';
    }

    /**
     * Verificar si es de tipo video
     */
    public function esVideo(): bool
    {
        return $this->tipo === 'video';
    }

    /**
     * Verificar si es de tipo lectura
     */
    public function esLectura(): bool
    {
        return $this->tipo === 'lectura';
    }

    /**
     * Obtener el proveedor del video formateado
     */
    public function getVideoProveedorFormateado(): ?string
    {
        if (!$this->video_proveedor) {
            return null;
        }

        return match($this->video_proveedor) {
            'youtube' => 'YouTube',
            'vimeo' => 'Vimeo',
            'local' => 'Video Local',
            default => ucfirst($this->video_proveedor)
        };
    }

    /**
     * Obtener embed ID de YouTube
     */
    public function getYoutubeEmbedId(): ?string
    {
        if ($this->video_proveedor !== 'youtube' || !$this->video_url) {
            return null;
        }

        // Extraer ID del video de diferentes formatos de URL de YouTube
        preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $this->video_url, $matches);

        return $matches[1] ?? null;
    }

    /**
     * Obtener embed ID de Vimeo
     */
    public function getVimeoEmbedId(): ?string
    {
        if ($this->video_proveedor !== 'vimeo' || !$this->video_url) {
            return null;
        }

        // Extraer ID del video de Vimeo
        preg_match('/vimeo\.com\/(\d+)/', $this->video_url, $matches);

        return $matches[1] ?? null;
    }

    /**
     * Duplicar lección
     */
    public function duplicar(?int $nuevoModuloId = null): Leccion
    {
        $nuevaLeccion = $this->replicate();
        $nuevaLeccion->titulo = $this->titulo . ' (Copia)';
        $nuevaLeccion->slug = Str::slug($nuevaLeccion->titulo);
        $nuevaLeccion->estado = 'borrador';

        if ($nuevoModuloId) {
            $nuevaLeccion->modulo_educativo_id = $nuevoModuloId;
        }

        $nuevaLeccion->save();

        // Duplicar recursos asociados
        foreach ($this->recursos as $recurso) {
            $nuevaLeccion->recursos()->attach($recurso->id, [
                'orden' => $recurso->pivot->orden
            ]);
        }

        return $nuevaLeccion;
    }

    /**
     * Reordenar lecciones
     */
    public static function reordenar(array $ordenIds): void
    {
        foreach ($ordenIds as $orden => $id) {
            static::where('id', $id)->update(['orden' => $orden + 1]);
        }
    }

    /**
     * Asociar recurso a la lección
     */
    public function asociarRecurso(int $recursoId, int $orden = 0): void
    {
        if ($orden === 0) {
            $orden = $this->recursos()->count() + 1;
        }

        $this->recursos()->attach($recursoId, ['orden' => $orden]);
    }

    /**
     * Desasociar recurso de la lección
     */
    public function desasociarRecurso(int $recursoId): void
    {
        $this->recursos()->detach($recursoId);
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopeEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    /**
     * Scope para filtrar por módulo
     */
    public function scopeModulo($query, $moduloId)
    {
        return $query->where('modulo_educativo_id', $moduloId);
    }

    /**
     * Scope para filtrar por tipo
     */
    public function scopeTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    /**
     * Scope para buscar por título
     */
    public function scopeBuscar($query, $termino)
    {
        return $query->where('titulo', 'like', "%{$termino}%")
            ->orWhere('contenido', 'like', "%{$termino}%");
    }

    /**
     * Scope para lecciones obligatorias
     */
    public function scopeObligatorias($query)
    {
        return $query->where('es_obligatoria', true);
    }
}
