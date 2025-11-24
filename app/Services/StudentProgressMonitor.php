<?php

namespace App\Services;

use App\Models\Trabajo;
use App\Models\RealTimeMonitoring;
use Illuminate\Support\Facades\Log;

/**
 * StudentProgressMonitor
 *
 * Servicio para monitorear el progreso y actividad del estudiante en tiempo real
 * Calcula métricas, detecta patrones y evalúa riesgo
 */
class StudentProgressMonitor
{
    /**
     * Registrar un evento de actividad del estudiante
     */
    public function registrarActividad(
        int $trabajoId,
        int $estudianteId,
        int $contenidoId,
        string $evento,
        array $detalles = []
    ): RealTimeMonitoring {

        $trabajo = Trabajo::find($trabajoId);

        if (!$trabajo) {
            throw new \Exception("Trabajo no encontrado: {$trabajoId}");
        }

        // Calcular duración del evento y tiempo acumulado
        $duracionEvento = $detalles['duracion_evento'] ?? null;
        $tiempoAcumulado = $this->calcularTiempoAcumulado($trabajoId);

        // Analizar la actividad
        $metricas = $this->analizarActividad(
            $trabajo,
            $evento,
            $detalles,
            $tiempoAcumulado
        );

        // Crear registro de monitoreo
        $monitoring = RealTimeMonitoring::create([
            'trabajo_id' => $trabajoId,
            'estudiante_id' => $estudianteId,
            'contenido_id' => $contenidoId,
            'evento' => $evento,
            'timestamp' => now(),
            'duracion_evento' => $duracionEvento,
            'tiempo_total_acumulado' => $tiempoAcumulado,
            'descripcion_evento' => $detalles['descripcion'] ?? null,
            'contexto_evento' => $detalles['contexto'] ?? [],
            'metricas_cognitivas' => $metricas['cognitivas'] ?? [],
            'progreso_estimado' => $metricas['progreso'] ?? null,
            'velocidad_respuesta' => $metricas['velocidad'] ?? null,
            'num_correcciones' => $detalles['num_correcciones'] ?? 0,
            'num_consultas' => $detalles['num_consultas'] ?? 0,
            'errores_detectados' => $detalles['errores'] ?? [],
            'score_riesgo' => $metricas['score_riesgo'] ?? 0,
            'tipo_intervencion' => $metricas['tipo_intervencion'] ?? 'none',
        ]);

        // Evaluar riesgo
        $monitoring->nivel_riesgo = $monitoring->evaluarRiesgo();
        $monitoring->save();

        Log::info('Actividad registrada', [
            'trabajo_id' => $trabajoId,
            'evento' => $evento,
            'progreso' => $monitoring->progreso_estimado,
            'riesgo' => $monitoring->nivel_riesgo,
        ]);

        return $monitoring;
    }

    /**
     * Calcular tiempo total acumulado en el trabajo
     */
    protected function calcularTiempoAcumulado(int $trabajoId): int
    {
        $eventos = RealTimeMonitoring::where('trabajo_id', $trabajoId)
            ->whereNotNull('duracion_evento')
            ->sum('duracion_evento');

        return $eventos ?? 0;
    }

    /**
     * Analizar la actividad y calcular métricas
     */
    protected function analizarActividad(
        Trabajo $trabajo,
        string $evento,
        array $detalles,
        int $tiempoAcumulado
    ): array {

        $metricas = [
            'progreso' => null,
            'velocidad' => null,
            'cognitivas' => [],
            'score_riesgo' => 0,
            'tipo_intervencion' => 'none',
        ];

        // Calcular progreso basado en eventos
        $respuestasPresentes = isset($detalles['respuestas_completas'])
            ? count($detalles['respuestas_completas'])
            : 0;

        $totalRespuestas = isset($detalles['total_respuestas'])
            ? $detalles['total_respuestas']
            : 1;

        if ($totalRespuestas > 0) {
            $metricas['progreso'] = min(100, ($respuestasPresentes / $totalRespuestas) * 100);
        }

        // Calcular velocidad de respuesta
        if ($tiempoAcumulado > 0 && $evento === 'respuesta_escrita') {
            $palabras = isset($detalles['caracteres_escritos'])
                ? ceil($detalles['caracteres_escritos'] / 5)
                : 0;

            $minutos = $tiempoAcumulado / 60;
            $metricas['velocidad'] = $minutos > 0 ? $palabras / $minutos : 0;
        }

        // Evaluar riesgo
        $metricas['score_riesgo'] = $this->evaluarScoreRiesgo(
            $evento,
            $tiempoAcumulado,
            $metricas['progreso'],
            $detalles
        );

        // Determinar tipo de intervención
        if ($metricas['score_riesgo'] > 0.7) {
            $metricas['tipo_intervencion'] = 'hint';
        } elseif ($metricas['score_riesgo'] > 0.5) {
            $metricas['tipo_intervencion'] = 'encouragement';
        }

        return $metricas;
    }

    /**
     * Evaluar el score de riesgo
     */
    protected function evaluarScoreRiesgo(
        string $evento,
        int $tiempoAcumulado,
        ?float $progreso,
        array $detalles
    ): float {

        $score = 0;

        // Evento crítico: abandono
        if ($evento === 'abandono') {
            return 1.0;
        }

        // Inactividad prolongada
        if ($evento === 'pausa' && $tiempoAcumulado > 600) {
            $score += 0.3;
        }

        // Bajo progreso después de tiempo
        if ($progreso !== null && $progreso < 25 && $tiempoAcumulado > 900) {
            $score += 0.4;
        }

        // Muchas correcciones (indica confusión)
        $correcciones = $detalles['num_correcciones'] ?? 0;
        if ($correcciones > 5) {
            $score += 0.2;
        }

        // Errores detectados
        $errores = count($detalles['errores'] ?? []);
        if ($errores > 3) {
            $score += 0.1;
        }

        return min(1.0, $score);
    }

    /**
     * Obtener estadísticas de sesión actual
     */
    public function obtenerEstadisticas(int $trabajoId): array
    {
        $monitoreos = RealTimeMonitoring::where('trabajo_id', $trabajoId)
            ->orderBy('timestamp', 'asc')
            ->get();

        if ($monitoreos->isEmpty()) {
            return [
                'tiempo_total' => 0,
                'eventos' => 0,
                'progreso' => 0,
                'nivel_riesgo' => 'bajo',
                'score_riesgo' => 0,
            ];
        }

        $tiempoTotal = $monitoreos->sum('duracion_evento') ?? 0;
        $progresoPromedio = $monitoreos->avg('progreso_estimado') ?? 0;
        $scorePromedio = $monitoreos->avg('score_riesgo') ?? 0;

        // Obtener el nivel de riesgo más reciente
        $nivelRiesgoActual = $monitoreos->last()->nivel_riesgo ?? 'bajo';

        return [
            'tiempo_total' => $tiempoTotal,
            'eventos' => count($monitoreos),
            'progreso' => round($progresoPromedio, 2),
            'nivel_riesgo' => $nivelRiesgoActual,
            'score_riesgo' => round($scorePromedio, 2),
            'ultimas_actividades' => $monitoreos->take(-5)->pluck('evento')->toArray(),
        ];
    }

    /**
     * Detectar patrones problemáticos
     */
    public function detectarPatronesProblematicos(int $trabajoId): array
    {
        $monitoreos = RealTimeMonitoring::where('trabajo_id', $trabajoId)
            ->orderBy('timestamp', 'asc')
            ->get();

        $patrones = [];

        if ($monitoreos->count() < 2) {
            return $patrones;
        }

        // Patrón: ciclo constante de correcciones
        $correcciones = $monitoreos->where('evento', 'cambio_respuesta')->count();
        if ($correcciones > 8) {
            $patrones[] = [
                'tipo' => 'ciclo_correcciones',
                'severidad' => 'alta',
                'descripcion' => 'Estudiante está haciendo muchas correcciones, indicando inseguridad',
                'accion' => 'Proporcionar sugerencia o recurso explicativo',
            ];
        }

        // Patrón: muchas consultas
        $consultas = $monitoreos->sum('num_consultas') ?? 0;
        if ($consultas > 10) {
            $patrones[] = [
                'tipo' => 'dependencia_recursos',
                'severidad' => 'media',
                'descripcion' => 'Estudiante consulta recursos frecuentemente',
                'accion' => 'Sugerir material de estudio independiente',
            ];
        }

        // Patrón: bajo progreso con tiempo invertido
        $tiempoTotal = $monitoreos->sum('duracion_evento') ?? 0;
        $progresoFinal = $monitoreos->last()->progreso_estimado ?? 0;

        if ($progresoFinal < 30 && $tiempoTotal > 1200) {
            $patrones[] = [
                'tipo' => 'bajo_progreso_tiempo_alto',
                'severidad' => 'alta',
                'descripcion' => 'Invertir mucho tiempo pero poco progreso',
                'accion' => 'Intervención inmediata requerida',
            ];
        }

        return $patrones;
    }
}
