<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * MLPredictionFeedback Model
 *
 * Rastrea predicciones ML y compara con resultados reales
 * para medir precisión y mejorar modelos continuamente.
 */
class MLPredictionFeedback extends Model
{
    protected $table = 'ml_prediction_feedback';

    protected $fillable = [
        'estudiante_id',
        'prediction_type',
        'predicted_value',
        'predicted_score',
        'confidence',
        'modelo_version',
        'actual_value',
        'actual_score',
        'prediction_correct',
        'error_margin',
        'error_percentage',
        'accuracy_level',
        'student_context',
        'prediction_details',
        'validation_result',
        'prediction_timestamp',
        'feedback_timestamp',
        'days_to_feedback',
        'notes',
        'requires_review',
        'review_reason',
    ];

    protected $casts = [
        'predicted_value' => 'array',
        'actual_value' => 'array',
        'student_context' => 'array',
        'prediction_details' => 'array',
        'validation_result' => 'array',
        'prediction_timestamp' => 'datetime',
        'feedback_timestamp' => 'datetime',
        'prediction_correct' => 'boolean',
        'requires_review' => 'boolean',
    ];

    /**
     * Relación con usuario/estudiante
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Scope para predicciones no validadas
     */
    public function scopePendingFeedback($query)
    {
        return $query->whereNull('actual_value');
    }

    /**
     * Scope para predicciones con feedback
     */
    public function scopeWithFeedback($query)
    {
        return $query->whereNotNull('actual_value');
    }

    /**
     * Scope para predicciones de un tipo específico
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('prediction_type', $type);
    }

    /**
     * Scope para predicciones de un modelo específico
     */
    public function scopeOfVersion($query, string $version)
    {
        return $query->where('modelo_version', $version);
    }

    /**
     * Scope para predicciones que requieren revisión
     */
    public function scopeNeedsReview($query)
    {
        return $query->where('requires_review', true);
    }

    /**
     * Scope para últimas predicciones
     */
    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('prediction_timestamp', '>=', now()->subDays($days));
    }

    /**
     * Obtener tasa de exactitud
     */
    public static function getAccuracyRate(string $type = null, string $version = null): float
    {
        $query = self::withFeedback()->where('prediction_correct', true);

        if ($type) {
            $query->where('prediction_type', $type);
        }

        if ($version) {
            $query->where('modelo_version', $version);
        }

        $correct = $query->count();
        $total = self::withFeedback()
            ->when($type, fn($q) => $q->where('prediction_type', $type))
            ->when($version, fn($q) => $q->where('modelo_version', $version))
            ->count();

        return $total > 0 ? round(($correct / $total) * 100, 2) : 0;
    }

    /**
     * Obtener error promedio
     */
    public static function getAverageError(string $type = null): float
    {
        $query = self::withFeedback()->whereNotNull('error_percentage');

        if ($type) {
            $query->where('prediction_type', $type);
        }

        return round($query->avg('error_percentage'), 2) ?? 0;
    }

    /**
     * Obtener métricas por tipo de predicción
     */
    public static function getMetricsByType(): array
    {
        $types = ['risk', 'carrera', 'tendencia', 'progreso', 'cluster', 'anomaly'];
        $metrics = [];

        foreach ($types as $type) {
            $feedbacks = self::withFeedback()->ofType($type)->get();

            if ($feedbacks->isEmpty()) {
                continue;
            }

            $correct = $feedbacks->where('prediction_correct', true)->count();
            $total = $feedbacks->count();

            $metrics[$type] = [
                'total_predictions' => $total,
                'correct' => $correct,
                'accuracy' => round(($correct / $total) * 100, 2),
                'avg_error' => round($feedbacks->avg('error_percentage'), 2),
                'avg_confidence' => round($feedbacks->avg('confidence'), 3),
            ];
        }

        return $metrics;
    }

    /**
     * Obtener análisis de modelos
     */
    public static function getModelAnalysis(): array
    {
        $versions = self::withFeedback()->distinct('modelo_version')->pluck('modelo_version');
        $analysis = [];

        foreach ($versions as $version) {
            $feedbacks = self::withFeedback()->ofVersion($version)->get();

            if ($feedbacks->isEmpty()) {
                continue;
            }

            $correct = $feedbacks->where('prediction_correct', true)->count();
            $total = $feedbacks->count();

            $analysis[$version] = [
                'total_feedback' => $total,
                'accuracy' => round(($correct / $total) * 100, 2),
                'avg_confidence' => round($feedbacks->avg('confidence'), 3),
                'needs_review_count' => $feedbacks->where('requires_review', true)->count(),
                'first_prediction' => $feedbacks->min('prediction_timestamp'),
                'last_prediction' => $feedbacks->max('prediction_timestamp'),
            ];
        }

        return $analysis;
    }

    /**
     * Registrar feedback para una predicción
     */
    public static function recordFeedback(
        int $studentId,
        string $type,
        mixed $actualValue,
        float $actualScore = null,
        ?string $notes = null
    ): self {
        $prediction = self::where('estudiante_id', $studentId)
            ->where('prediction_type', $type)
            ->whereNull('actual_value')
            ->latest('prediction_timestamp')
            ->first();

        if (!$prediction) {
            throw new \Exception("No pending prediction found for student {$studentId} of type {$type}");
        }

        // Calcular error
        $errorMargin = null;
        $errorPercentage = null;

        if ($prediction->predicted_score !== null && $actualScore !== null) {
            $errorMargin = abs($prediction->predicted_score - $actualScore);
            $errorPercentage = round(($errorMargin / ($prediction->predicted_score ?: 1)) * 100, 2);
        }

        // Determinar si fue correcta
        $correct = $actualValue == $prediction->predicted_value;

        // Determinar nivel de exactitud
        if ($errorPercentage === null) {
            $accuracyLevel = null;
        } elseif ($errorPercentage <= 5) {
            $accuracyLevel = 'excellent';
        } elseif ($errorPercentage <= 15) {
            $accuracyLevel = 'good';
        } elseif ($errorPercentage <= 30) {
            $accuracyLevel = 'fair';
        } else {
            $accuracyLevel = 'poor';
        }

        // Calcular días hasta feedback
        $daysSince = $prediction->prediction_timestamp->diffInDays(now());

        // Marcar para revisión si error es alto
        $requiresReview = ($errorPercentage ?? 0) > 25 || ($prediction->confidence ?? 1) < 0.6;
        $reviewReason = $requiresReview ? "High error ({$errorPercentage}%) or low confidence ({$prediction->confidence})" : null;

        // Actualizar predicción
        $prediction->update([
            'actual_value' => $actualValue,
            'actual_score' => $actualScore,
            'prediction_correct' => $correct,
            'error_margin' => $errorMargin,
            'error_percentage' => $errorPercentage,
            'accuracy_level' => $accuracyLevel,
            'feedback_timestamp' => now(),
            'days_to_feedback' => $daysSince,
            'notes' => $notes,
            'requires_review' => $requiresReview,
            'review_reason' => $reviewReason,
        ]);

        return $prediction;
    }

    /**
     * Obtener predicciones pendientes de feedback
     */
    public static function getPendingFeedback(int $daysOld = 7): array
    {
        return self::pendingFeedback()
            ->where('prediction_timestamp', '<=', now()->subDays($daysOld))
            ->orderBy('prediction_timestamp')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'student_id' => $p->estudiante_id,
                'type' => $p->prediction_type,
                'predicted' => $p->predicted_value,
                'days_pending' => $p->prediction_timestamp->diffInDays(now()),
            ])
            ->toArray();
    }
}
