<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionUsage extends Model
{
    use HasFactory;

    protected $table = 'question_usage';

    protected $fillable = [
        'question_id',
        'evaluacion_id',
        'orden',
        'puntos_asignados',
    ];

    protected $casts = [
        'puntos_asignados' => 'integer',
        'orden' => 'integer',
    ];

    /**
     * Relación con la pregunta del banco
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(QuestionBank::class, 'question_id');
    }

    /**
     * Relación con la evaluación
     */
    public function evaluacion(): BelongsTo
    {
        return $this->belongsTo(Evaluacion::class);
    }
}
