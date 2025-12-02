<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerfilVocacionalCombinado extends Model
{
    use HasFactory;

    protected $table = 'perfil_vocacional_combinados';

    protected $fillable = [
        'estudiante_id',
        'resultado_test_1_id',
        'resultado_test_2_id',
        'resultado_test_3_id',
        'aptitudes_combinadas',
        'preferencias_laborales',
        'tipo_vocacional_riasec',
        'carrera_recomendada_principal',
        'carreras_recomendadas',
        'confianza_general',
        'resumen_perfil',
        'analisis_fortalezas',
        'analisis_oportunidades',
        'todos_tests_completados',
        'fecha_generacion',
    ];

    protected $casts = [
        'aptitudes_combinadas' => 'array',
        'preferencias_laborales' => 'array',
        'tipo_vocacional_riasec' => 'array',
        'carreras_recomendadas' => 'array',
        'analisis_fortalezas' => 'array',
        'analisis_oportunidades' => 'array',
        'todos_tests_completados' => 'boolean',
        'fecha_generacion' => 'datetime',
    ];

    /**
     * Relación con estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con resultado del test 1 (Explorador)
     */
    public function resultadoTest1(): BelongsTo
    {
        return $this->belongsTo(ResultadoTestVocacional::class, 'resultado_test_1_id');
    }

    /**
     * Relación con resultado del test 2 (Preferencias)
     */
    public function resultadoTest2(): BelongsTo
    {
        return $this->belongsTo(ResultadoTestVocacional::class, 'resultado_test_2_id');
    }

    /**
     * Relación con resultado del test 3 (RIASEC)
     */
    public function resultadoTest3(): BelongsTo
    {
        return $this->belongsTo(ResultadoTestVocacional::class, 'resultado_test_3_id');
    }

    /**
     * Verificar si todos los tests están completados
     */
    public function verificarTestsCompletos(): bool
    {
        return $this->resultado_test_1_id !== null &&
               $this->resultado_test_2_id !== null &&
               $this->resultado_test_3_id !== null;
    }

    /**
     * Generar perfil combinado a partir de los 3 tests
     *
     * UTILIZA: VocationalProfileSynthesisService para análisis ML inteligente
     *
     * Flujo:
     * 1. Verifica que los 3 tests estén completados
     * 2. Llama VocationalProfileSynthesisService para síntesis
     * 3. Guarda todos los datos en la BD
     */
    public function generarPerfilCombinado(): void
    {
        if (!$this->verificarTestsCompletos()) {
            throw new \Exception('No todos los tests están completados');
        }

        try {
            // Usar servicio de síntesis para análisis ML inteligente
            $synthesisService = app(\App\Services\VocationalProfileSynthesisService::class);
            $student = $this->estudiante;

            $profile = $synthesisService->generateCombinedProfile($student);

            // Actualizar perfil con resultados del servicio
            $this->aptitudes_combinadas = $profile['aptitudes_combinadas'];
            $this->preferencias_laborales = $profile['preferencias_laborales'];
            $this->tipo_vocacional_riasec = $profile['tipo_vocacional_riasec'];
            $this->carrera_recomendada_principal = $profile['carrera_recomendada_principal'];
            $this->carreras_recomendadas = $profile['carreras_recomendadas'];
            $this->confianza_general = $profile['confianza_general'];
            $this->resumen_perfil = $profile['resumen_perfil'];
            $this->analisis_fortalezas = $profile['analisis_fortalezas'];
            $this->analisis_oportunidades = $profile['analisis_oportunidades'];
            $this->todos_tests_completados = true;
            $this->fecha_generacion = now();

            $this->save();

            \Illuminate\Support\Facades\Log::info("✅ Perfil vocacional combinado generado", [
                'student_id' => $this->estudiante_id,
                'career' => $this->carrera_recomendada_principal,
                'confidence' => $this->confianza_general,
            ]);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error generando perfil combinado: {$e->getMessage()}", [
                'student_id' => $this->estudiante_id,
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Obtener perfil en formato legible
     */
    public function obtenerPerfilFormateado(): array
    {
        return [
            'estudiante' => [
                'id' => $this->estudiante_id,
                'nombre' => $this->estudiante->name ?? 'N/A',
            ],
            'aptitudes' => $this->aptitudes_combinadas,
            'preferencias' => $this->preferencias_laborales,
            'tipo_riasec' => $this->tipo_vocacional_riasec,
            'carrera_recomendada' => $this->carrera_recomendada_principal,
            'carreras_alternativas' => $this->carreras_recomendadas,
            'confianza' => $this->confianza_general . '%',
            'fortalezas' => $this->analisis_fortalezas,
            'oportunidades' => $this->analisis_oportunidades,
            'fecha_generacion' => $this->fecha_generacion->format('d/m/Y H:i:s'),
        ];
    }
}
