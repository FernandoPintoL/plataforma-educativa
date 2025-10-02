<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TestVocacional extends Model
{
    use HasFactory;

    protected $table = 'tests_vocacionales';

    protected $fillable = [
        'nombre',
        'descripcion',
        'duracion_estimada',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Relación con las categorías del test
     */
    public function categorias(): HasMany
    {
        return $this->hasMany(CategoriaTest::class);
    }

    /**
     * Relación con las respuestas del test
     */
    public function respuestas(): HasMany
    {
        return $this->hasMany(RespuestaTest::class);
    }

    /**
     * Relación con los resultados del test
     */
    public function resultados(): HasMany
    {
        return $this->hasMany(ResultadoTestVocacional::class);
    }

    /**
     * Relación con los estudiantes que han tomado el test
     */
    public function estudiantes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'resultado_test_vocacional', 'test_vocacional_id', 'estudiante_id')
            ->withTimestamps();
    }

    /**
     * Crear test
     */
    public function crearTest(): void
    {
        $this->update(['activo' => true]);
    }

    /**
     * Publicar test
     */
    public function publicarTest(): void
    {
        $this->update(['activo' => true]);
    }

    /**
     * Asignar test a un estudiante
     */
    public function asignarTest(User $estudiante): void
    {
        // Crear notificación para el estudiante
        Notificacion::crearParaUsuario(
            $estudiante,
            'Nuevo Test Vocacional Disponible',
            "Se ha asignado el test '{$this->nombre}' para completar.",
            'test_vocacional',
            ['test_id' => $this->id]
        );
    }

    /**
     * Calcular resultados del test
     */
    public function calcularResultados(array $respuestas): ResultadoTestVocacional
    {
        $puntajesPorCategoria = [];

        // Agrupar respuestas por categoría
        foreach ($respuestas as $respuesta) {
            $pregunta = PreguntaTest::find($respuesta['pregunta_id']);
            if ($pregunta) {
                $categoriaId = $pregunta->categoria_test_id;
                if (! isset($puntajesPorCategoria[$categoriaId])) {
                    $puntajesPorCategoria[$categoriaId] = 0;
                }
                $puntajesPorCategoria[$categoriaId] += $pregunta->getPuntuacionPorRespuesta($respuesta['respuesta']);
            }
        }

        // Crear resultado del test
        $resultado = ResultadoTestVocacional::create([
            'estudiante_id' => $respuestas[0]['estudiante_id'] ?? null,
            'test_vocacional_id' => $this->id,
            'fecha' => now(),
            'puntajes_por_categoria' => $puntajesPorCategoria,
        ]);

        // Generar perfil vocacional
        $resultado->generarPerfilVocacional();

        return $resultado;
    }

    /**
     * Obtener estadísticas del test
     */
    public function obtenerEstadisticas(): array
    {
        $totalRespuestas = $this->respuestas()->count();
        $totalResultados = $this->resultados()->count();
        $totalPreguntas = $this->categorias()->withCount('preguntas')->get()->sum('preguntas_count');

        return [
            'total_preguntas' => $totalPreguntas,
            'total_respuestas' => $totalRespuestas,
            'total_resultados' => $totalResultados,
            'promedio_tiempo' => $this->calcularPromedioTiempo(),
            'tasa_completacion' => $this->calcularTasaCompletacion(),
        ];
    }

    /**
     * Calcular promedio de tiempo de completación
     */
    private function calcularPromedioTiempo(): float
    {
        $tiempos = $this->respuestas()
            ->whereNotNull('tiempo')
            ->pluck('tiempo')
            ->toArray();

        if (empty($tiempos)) {
            return 0;
        }

        return array_sum($tiempos) / count($tiempos);
    }

    /**
     * Calcular tasa de completación
     */
    private function calcularTasaCompletacion(): float
    {
        $totalPreguntas = $this->categorias()->withCount('preguntas')->get()->sum('preguntas_count');
        $totalRespuestas = $this->respuestas()->count();

        if ($totalPreguntas == 0) {
            return 0;
        }

        return ($totalRespuestas / $totalPreguntas) * 100;
    }

    /**
     * Obtener preguntas del test
     */
    public function getPreguntas(): \Illuminate\Database\Eloquent\Collection
    {
        return PreguntaTest::whereHas('categoriaTest', function ($query) {
            $query->where('test_vocacional_id', $this->id);
        })->with('categoriaTest')->get();
    }

    /**
     * Obtener duración estimada formateada
     */
    public function getDuracionFormateada(): string
    {
        if (! $this->duracion_estimada) {
            return 'Sin límite de tiempo';
        }

        $minutos = $this->duracion_estimada;
        $horas = floor($minutos / 60);
        $minutosRestantes = $minutos % 60;

        if ($horas > 0) {
            return "{$horas}h {$minutosRestantes}m";
        }

        return "{$minutos} minutos";
    }

    /**
     * Verificar si el test está completo
     */
    public function estaCompleto(): bool
    {
        $totalPreguntas = $this->categorias()->withCount('preguntas')->get()->sum('preguntas_count');

        return $totalPreguntas > 0;
    }

    /**
     * Obtener información del test
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'duracion_estimada' => $this->duracion_estimada,
            'duracion_formateada' => $this->getDuracionFormateada(),
            'activo' => $this->activo,
            'esta_completo' => $this->estaCompleto(),
            'estadisticas' => $this->obtenerEstadisticas(),
            'total_categorias' => $this->categorias()->count(),
            'total_preguntas' => $this->getPreguntas()->count(),
        ];
    }
}
