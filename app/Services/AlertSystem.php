<?php

namespace App\Services;

use App\Models\StudentAlert;
use App\Models\RealTimeMonitoring;
use Illuminate\Support\Facades\Log;

/**
 * AlertSystem
 *
 * Servicio para generar alertas inteligentes basadas en el monitoreo en tiempo real
 */
class AlertSystem
{
    protected FeedbackIntellicentService $feedbackService;
    protected StudentProgressMonitor $progressMonitor;

    public function __construct(
        FeedbackIntellicentService $feedbackService,
        StudentProgressMonitor $progressMonitor
    ) {
        $this->feedbackService = $feedbackService;
        $this->progressMonitor = $progressMonitor;
    }

    /**
     * Evaluar actividad y generar alertas si es necesario
     */
    public function evaluarYGenerarAlertas(RealTimeMonitoring $monitoring): ?StudentAlert
    {
        // Si ya se generó una alerta, no generar otra
        if ($monitoring->alerta_generada) {
            return null;
        }

        // Verificar si debe generarse una alerta
        if (!$monitoring->debeGenerarseAlerta()) {
            return null;
        }

        // Determinar tipo de alerta basado en la actividad
        $tipoAlerta = $this->determinarTipoAlerta($monitoring);

        if (!$tipoAlerta) {
            return null;
        }

        // Generar la alerta
        $alerta = $this->crearAlerta(
            $monitoring,
            $tipoAlerta['tipo'],
            $tipoAlerta['severidad'],
            $tipoAlerta['mensaje'],
            $tipoAlerta['recomendacion']
        );

        // Marcar en el monitoreo que se generó alerta
        $monitoring->update([
            'alerta_generada' => true,
            'alerta_id' => $alerta->id,
        ]);

        Log::info('Alerta generada', [
            'alerta_id' => $alerta->id,
            'tipo' => $alerta->tipo_alerta,
            'severidad' => $alerta->severidad,
            'estudiante_id' => $alerta->estudiante_id,
        ]);

        return $alerta;
    }

    /**
     * Determinar el tipo de alerta a generar
     */
    protected function determinarTipoAlerta(RealTimeMonitoring $monitoring): ?array
    {
        // Abandono probable
        if ($monitoring->evento === 'abandono') {
            return [
                'tipo' => 'riesgo_abandono',
                'severidad' => 'critica',
                'mensaje' => 'Se detectó que abandonaste el trabajo. ¿Necesitas ayuda?',
                'recomendacion' => 'Proporcionar motivación y desglosando la tarea en pasos más pequeños',
            ];
        }

        // Bajo progreso
        if ($monitoring->progreso_estimado !== null && $monitoring->progreso_estimado < 20) {
            if ($monitoring->tiempo_total_acumulado && $monitoring->tiempo_total_acumulado > 900) {
                return [
                    'tipo' => 'bajo_progreso',
                    'severidad' => 'alta',
                    'mensaje' => 'Llevas mucho tiempo trabajando pero poco progreso. ¿Hay algo que no entiendas?',
                    'recomendacion' => 'Ofrecer una sugerencia o recurso didáctico',
                ];
            }
        }

        // Dificultad conceptual
        if (count($monitoring->errores_detectados ?? []) > 2) {
            return [
                'tipo' => 'dificultad_conceptual',
                'severidad' => 'media',
                'mensaje' => 'Detectamos varios errores comunes en tu trabajo. Aquí hay un recurso que puede ayudarte.',
                'recomendacion' => 'Proporcionar recursos educativos específicos',
            ];
        }

        // Patrón de errores repetidos
        $monitoreos = RealTimeMonitoring::where('trabajo_id', $monitoring->trabajo_id)
            ->orderBy('timestamp', 'desc')
            ->take(5)
            ->get();

        $tiposErrores = [];
        foreach ($monitoreos as $m) {
            foreach ($m->errores_detectados ?? [] as $error) {
                $tiposErrores[$error] = ($tiposErrores[$error] ?? 0) + 1;
            }
        }

        foreach ($tiposErrores as $error => $count) {
            if ($count >= 3) {
                return [
                    'tipo' => 'patrones_error',
                    'severidad' => 'media',
                    'mensaje' => "Notamos que repites este error: '{$error}'. Aquí te explicamos cómo resolverlo.",
                    'recomendacion' => 'Explicación conceptual del error común',
                ];
            }
        }

        // Desempeño inconsistente
        if ($monitoring->num_correcciones > 8) {
            return [
                'tipo' => 'desempeño_inconsistente',
                'severidad' => 'media',
                'mensaje' => 'Parece que no estás seguro de tus respuestas. Revisa estos conceptos.',
                'recomendacion' => 'Revisar material de referencia',
            ];
        }

        // Inactividad prolongada
        if ($monitoring->evento === 'pausa') {
            if ($monitoring->tiempo_total_acumulado && $monitoring->tiempo_total_acumulado > 1200) {
                return [
                    'tipo' => 'inactividad',
                    'severidad' => 'baja',
                    'mensaje' => 'Hemos notado que llevas un tiempo sin actividad. ¿Necesitas un descanso?',
                    'recomendacion' => 'Sugerir pausa o continuación',
                ];
            }
        }

        return null;
    }

    /**
     * Crear una alerta en la base de datos
     */
    protected function crearAlerta(
        RealTimeMonitoring $monitoring,
        string $tipoAlerta,
        string $severidad,
        string $mensaje,
        string $recomendacion
    ): StudentAlert {

        $confianza = $monitoring->score_riesgo ?? 0.5;

        $alerta = StudentAlert::create([
            'trabajo_id' => $monitoring->trabajo_id,
            'estudiante_id' => $monitoring->estudiante_id,
            'monitoring_id' => $monitoring->id,
            'tipo_alerta' => $tipoAlerta,
            'severidad' => $severidad,
            'confianza' => $confianza,
            'mensaje' => $mensaje,
            'recomendacion' => $recomendacion,
            'detalles_alerta' => [
                'evento_triggers' => $monitoring->evento,
                'metricas_disparo' => $monitoring->obtenerResumenSesion(),
                'timestamp_generacion' => now()->toIso8601String(),
            ],
            'metricas_activacion' => [
                'progreso' => $monitoring->progreso_estimado,
                'tiempo_acumulado' => $monitoring->tiempo_total_acumulado,
                'errores' => count($monitoring->errores_detectados ?? []),
                'correcciones' => $monitoring->num_correcciones,
                'score_riesgo' => $monitoring->score_riesgo,
            ],
            'estado' => 'generada',
            'fecha_generacion' => now(),
        ]);

        // Notificar al estudiante
        $this->notificarEstudiante($alerta);

        return $alerta;
    }

    /**
     * Notificar al estudiante sobre la alerta
     */
    protected function notificarEstudiante(StudentAlert $alerta): void
    {
        \App\Models\Notificacion::crear(
            destinatario: $alerta->estudiante,
            tipo: 'alerta_academica',
            titulo: 'Alerta de progreso académico',
            contenido: $alerta->mensaje,
            datos_adicionales: [
                'alerta_id' => $alerta->id,
                'tipo_alerta' => $alerta->tipo_alerta,
                'recomendacion' => $alerta->recomendacion,
            ]
        );

        $alerta->update(['fecha_notificacion' => now(), 'estado' => 'notificada']);
    }

    /**
     * Obtener alertas pendientes de intervención
     */
    public function obtenerAlertasPendientes(int $estudianteId): array
    {
        return StudentAlert::where('estudiante_id', $estudianteId)
            ->whereIn('estado', ['generada', 'notificada'])
            ->with(['trabajo.contenido', 'trabajo.estudiante'])
            ->orderBy('severidad', 'desc')
            ->orderBy('fecha_generacion', 'desc')
            ->limit(10)
            ->get()
            ->toArray();
    }

    /**
     * Marcar alerta como intervenida
     */
    public function marcarComoIntervenida(int $alertaId, string $accion = null): void
    {
        $alerta = StudentAlert::find($alertaId);
        if ($alerta) {
            $alerta->marcarComoIntervenida($accion);
            Log::info('Alerta marcada como intervenida', ['alerta_id' => $alertaId]);
        }
    }

    /**
     * Registrar resolutivo de alerta
     */
    public function marcarComoResuelta(int $alertaId, bool $mejoro = false, ?float $impacto = null): void
    {
        $alerta = StudentAlert::find($alertaId);
        if ($alerta) {
            $alerta->marcarComoResuelta($mejoro, $impacto);
            Log::info('Alerta marcada como resuelta', [
                'alerta_id' => $alertaId,
                'mejoro' => $mejoro,
            ]);
        }
    }
}
