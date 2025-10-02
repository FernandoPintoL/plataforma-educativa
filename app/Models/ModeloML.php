<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModeloML extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo',
        'parametros',
        'ultimo_entrenamiento',
        'precision',
    ];

    protected $casts = [
        'parametros' => 'array',
        'ultimo_entrenamiento' => 'datetime',
        'precision' => 'float',
    ];

    public function predecir(array $datos)
    {
        // Implementar lógica de predicción según el tipo de modelo
        return null;
    }

    public function evaluarRendimiento(): array
    {
        // Implementar métricas de rendimiento
        return [
            'precision' => $this->precision,
            'recall' => 0,
            'f1_score' => 0,
            'accuracy' => 0,
        ];
    }

    public function actualizarParametros(array $parametros): void
    {
        $this->parametros = $parametros;
        $this->save();
    }
}
