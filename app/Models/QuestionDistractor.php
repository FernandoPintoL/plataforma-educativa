<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionDistractor extends Model
{
    use HasFactory;

    protected $table = 'question_distractors';

    protected $fillable = [
        'question_id',
        'opcion',
        'razon_incorrecta',
        'error_comun',
        'veces_elegida',
    ];

    protected $casts = [
        'veces_elegida' => 'integer',
    ];

    /**
     * Relación con la pregunta del banco
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(QuestionBank::class, 'question_id');
    }

    /**
     * Obtener la popularidad del distractor (qué tan frecuentemente es elegido)
     */
    public function getPopularidad(): float
    {
        $question = $this->question;
        $totalRespuestas = $question->analytics()->sum('veces_respondida');

        if ($totalRespuestas === 0) {
            return 0;
        }

        return round(($this->veces_elegida / $totalRespuestas) * 100, 2);
    }
}
