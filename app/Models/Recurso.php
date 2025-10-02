<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Recurso extends Model
{
    use HasFactory;

    protected $table = 'recursos';

    protected $fillable = [
        'nombre',
        'tipo',
        'url',
        'descripcion',
        'archivo_path',
        'tamaño',
        'mime_type',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Relación con los contenidos
     */
    public function contenidos(): BelongsToMany
    {
        return $this->belongsToMany(Contenido::class, 'contenido_recurso');
    }

    /**
     * Acceder al recurso
     */
    public function acceder(): void
    {
        // Implementar lógica de acceso al recurso
        // Por ejemplo, incrementar contador de visualizaciones
    }

    /**
     * Descargar el recurso
     */
    public function descargar(): void
    {
        // Implementar lógica de descarga del recurso
        // Por ejemplo, incrementar contador de descargas
    }

    /**
     * Verificar si es un archivo
     */
    public function esArchivo(): bool
    {
        return ! empty($this->archivo_path);
    }

    /**
     * Verificar si es una URL
     */
    public function esUrl(): bool
    {
        return ! empty($this->url);
    }

    /**
     * Obtener tamaño formateado
     */
    public function getTamañoFormateado(): string
    {
        if (! $this->tamaño) {
            return 'N/A';
        }

        $bytes = $this->tamaño;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2).' '.$units[$i];
    }

    /**
     * Obtener icono según el tipo
     */
    public function getIcono(): string
    {
        switch ($this->tipo) {
            case 'video':
                return '🎥';
            case 'documento':
                return '📄';
            case 'imagen':
                return '🖼️';
            case 'audio':
                return '🎵';
            case 'enlace':
                return '🔗';
            case 'presentacion':
                return '📊';
            default:
                return '📁';
        }
    }

    /**
     * Obtener color según el tipo
     */
    public function getColor(): string
    {
        switch ($this->tipo) {
            case 'video':
                return 'red';
            case 'documento':
                return 'blue';
            case 'imagen':
                return 'green';
            case 'audio':
                return 'purple';
            case 'enlace':
                return 'orange';
            case 'presentacion':
                return 'yellow';
            default:
                return 'gray';
        }
    }

    /**
     * Obtener URL de acceso
     */
    public function getUrlAcceso(): string
    {
        if ($this->esUrl()) {
            return $this->url;
        }

        if ($this->esArchivo()) {
            return asset('storage/'.$this->archivo_path);
        }

        return '#';
    }

    /**
     * Obtener información del recurso
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'tipo' => $this->tipo,
            'descripcion' => $this->descripcion,
            'tamaño' => $this->getTamañoFormateado(),
            'icono' => $this->getIcono(),
            'color' => $this->getColor(),
            'url' => $this->getUrlAcceso(),
            'activo' => $this->activo,
        ];
    }
}
