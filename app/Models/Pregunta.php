<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pregunta extends Model
{
    use HasFactory;

    protected $fillable = [
        'evaluacion_id',
        'enunciado',
        'tipo',
        'opciones',
        'respuesta_correcta',
        'puntos',
        'orden',
    ];

    protected $casts = [
        'opciones' => 'array',
    ];

    /**
     * Relación con la evaluación
     */
    public function evaluacion(): BelongsTo
    {
        return $this->belongsTo(Evaluacion::class);
    }

    /**
     * Validar una respuesta
     */
    public function validarRespuesta(string $respuesta): bool
    {
        switch ($this->tipo) {
            case 'opcion_multiple':
            case 'verdadero_falso':
                return strtolower(trim($respuesta)) === strtolower(trim($this->respuesta_correcta));
            
            case 'respuesta_corta':
                return $this->validarRespuestaCorta($respuesta);
            
            case 'respuesta_larga':
                return $this->validarRespuestaLarga($respuesta);
            
            default:
                return false;
        }
    }

    /**
     * Validar respuesta corta (comparación aproximada)
     */
    private function validarRespuestaCorta(string $respuesta): bool
    {
        $respuestaCorrecta = strtolower(trim($this->respuesta_correcta));
        $respuestaEstudiante = strtolower(trim($respuesta));
        
        // Comparación exacta
        if ($respuestaCorrecta === $respuestaEstudiante) {
            return true;
        }
        
        // Comparación con variaciones comunes
        $variaciones = [
            $respuestaCorrecta,
            str_replace(' ', '', $respuestaCorrecta),
            str_replace(['á', 'é', 'í', 'ó', 'ú'], ['a', 'e', 'i', 'o', 'u'], $respuestaCorrecta),
        ];
        
        return in_array($respuestaEstudiante, $variaciones);
    }

    /**
     * Validar respuesta larga (análisis de palabras clave)
     */
    private function validarRespuestaLarga(string $respuesta): bool
    {
        // Para respuestas largas, implementar análisis de palabras clave
        // Por ahora, retornar true si la respuesta no está vacía
        return !empty(trim($respuesta));
    }

    /**
     * Obtener opciones formateadas
     */
    public function getOpcionesFormateadas(): array
    {
        if (!$this->opciones) {
            return [];
        }

        $opciones = [];
        foreach ($this->opciones as $index => $opcion) {
            $opciones[] = [
                'valor' => chr(65 + $index), // A, B, C, D...
                'texto' => $opcion
            ];
        }

        return $opciones;
    }

    /**
     * Obtener la letra de la respuesta correcta
     */
    public function getLetraRespuestaCorrecta(): string
    {
        if (!$this->opciones || !$this->respuesta_correcta) {
            return '';
        }

        $index = array_search($this->respuesta_correcta, $this->opciones);
        return $index !== false ? chr(65 + $index) : '';
    }

    /**
     * Obtener estadísticas de la pregunta
     */
    public function obtenerEstadisticas(): array
    {
        $trabajos = $this->evaluacion->contenido->trabajos()
            ->where('estado', 'entregado')
            ->get();

        $respuestasCorrectas = 0;
        $totalRespuestas = 0;

        foreach ($trabajos as $trabajo) {
            $respuestas = $trabajo->respuestas ?? [];
            $respuesta = $respuestas[$this->id] ?? null;
            
            if ($respuesta) {
                $totalRespuestas++;
                if ($this->validarRespuesta($respuesta)) {
                    $respuestasCorrectas++;
                }
            }
        }

        return [
            'total_respuestas' => $totalRespuestas,
            'respuestas_correctas' => $respuestasCorrectas,
            'porcentaje_acierto' => $totalRespuestas > 0 ? ($respuestasCorrectas / $totalRespuestas) * 100 : 0,
        ];
    }
}
