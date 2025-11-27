<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class QuestionBank extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'question_bank';

    protected $fillable = [
        'curso_id',
        'tipo',
        'enunciado',
        'opciones',
        'respuesta_correcta',
        'explicacion',
        'nivel_bloom',
        'dificultad_estimada',
        'dificultad_real',
        'puntos',
        'conceptos_clave',
        'notas_profesor',
        'referencias',
        'leccion_id',
        'modulo_id',
        'fuente',
        'metadata_generacion',
        'creado_por',
        'estado',
        'validada',
        'veces_usada',
    ];

    protected $casts = [
        'opciones' => 'array',
        'conceptos_clave' => 'array',
        'referencias' => 'array',
        'metadata_generacion' => 'array',
        'dificultad_estimada' => 'decimal:2',
        'dificultad_real' => 'decimal:2',
        'validada' => 'boolean',
    ];

    /**
     * Relación con el curso
     */
    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    /**
     * Relación con el usuario que creó la pregunta
     */
    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por');
    }

    /**
     * Relación con la lección (contenido)
     */
    public function leccion(): BelongsTo
    {
        return $this->belongsTo(Contenido::class, 'leccion_id');
    }

    /**
     * Relación con el módulo sidebar
     */
    public function modulo(): BelongsTo
    {
        return $this->belongsTo(ModuloSidebar::class, 'modulo_id');
    }

    /**
     * Relación con analytics de la pregunta
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(QuestionAnalytics::class, 'question_id');
    }

    /**
     * Relación con uso de la pregunta
     */
    public function usage(): HasMany
    {
        return $this->hasMany(QuestionUsage::class, 'question_id');
    }

    /**
     * Relación con distractores
     */
    public function distractors(): HasMany
    {
        return $this->hasMany(QuestionDistractor::class, 'question_id');
    }

    /**
     * Obtener opciones formateadas (con letras A, B, C, D...)
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
                'texto' => $opcion,
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
     * Validar respuesta larga (por ahora solo verifica que no esté vacía)
     */
    private function validarRespuestaLarga(string $respuesta): bool
    {
        return !empty(trim($respuesta));
    }

    /**
     * Obtener la tasa de acierto promedio
     */
    public function getTasaAciertoProm(): ?float
    {
        $analytics = $this->analytics()->whereNotNull('tasa_acierto')->get();

        if ($analytics->isEmpty()) {
            return null;
        }

        return $analytics->avg('tasa_acierto');
    }

    /**
     * Obtener el índice de discriminación promedio
     */
    public function getIndiceDiscriminacionProm(): ?float
    {
        $analytics = $this->analytics()->whereNotNull('indice_discriminacion')->get();

        if ($analytics->isEmpty()) {
            return null;
        }

        return $analytics->avg('indice_discriminacion');
    }

    /**
     * Marcar pregunta como de alta calidad
     */
    public function esAltaCalidad(): bool
    {
        $discriminacion = $this->getIndiceDiscriminacionProm();

        return $discriminacion !== null && $discriminacion > 0.30;
    }
}
