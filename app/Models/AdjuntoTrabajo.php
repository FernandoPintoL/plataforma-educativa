<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class AdjuntoTrabajo extends Model
{
    use HasFactory;

    protected $table = 'adjuntos_trabajos';

    protected $fillable = [
        'trabajo_id',
        'nombre_original',
        'archivo_path',
        'mime_type',
        'tamanio',
        'hash',
        'descripcion',
    ];

    /**
     * Relación con el trabajo
     */
    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    /**
     * Obtener la URL del archivo
     */
    public function getUrlDescarga(): string
    {
        return Storage::disk('public')->url($this->archivo_path);
    }

    /**
     * Obtener el tamaño formateado
     */
    public function getTamanioFormateado(): string
    {
        $tamanio = $this->tamanio;
        $unidades = ['B', 'KB', 'MB', 'GB'];

        foreach ($unidades as $unidad) {
            if ($tamanio < 1024) {
                return round($tamanio, 2) . ' ' . $unidad;
            }
            $tamanio /= 1024;
        }

        return round($tamanio, 2) . ' TB';
    }

    /**
     * Obtener la extensión del archivo
     */
    public function getExtension(): string
    {
        return strtoupper(pathinfo($this->nombre_original, PATHINFO_EXTENSION));
    }

    /**
     * Verificar si es una imagen
     */
    public function esImagen(): bool
    {
        return in_array($this->mime_type, [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
        ]);
    }

    /**
     * Verificar si es un PDF
     */
    public function esPdf(): bool
    {
        return $this->mime_type === 'application/pdf';
    }

    /**
     * Eliminar el archivo del storage
     */
    public function eliminarArchivo(): bool
    {
        if (Storage::disk('public')->exists($this->archivo_path)) {
            return Storage::disk('public')->delete($this->archivo_path);
        }

        return true;
    }

    /**
     * Al eliminar el modelo, también eliminar el archivo
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($adjunto) {
            $adjunto->eliminarArchivo();
        });
    }
}
