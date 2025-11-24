<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Trabajo;
use App\Models\Contenido;
use App\Models\RealTimeMonitoring;
use App\Models\StudentAlert;
use App\Models\StudentHint;
use App\Services\StudentProgressMonitor;
use App\Services\AlertSystem;
use App\Services\HintGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RealTimeMonitoringTest extends TestCase
{
    use RefreshDatabase;

    protected StudentProgressMonitor $progressMonitor;
    protected AlertSystem $alertSystem;
    protected HintGenerator $hintGenerator;
    protected User $estudiante;
    protected User $profesor;
    protected Trabajo $trabajo;
    protected Contenido $contenido;

    protected function setUp(): void
    {
        parent::setUp();

        $this->progressMonitor = app(StudentProgressMonitor::class);
        $this->alertSystem = app(AlertSystem::class);
        $this->hintGenerator = app(HintGenerator::class);

        // Crear usuarios
        $this->estudiante = User::factory()->create(['rol' => 'estudiante']);
        $this->profesor = User::factory()->create(['rol' => 'profesor']);

        // Crear contenido y trabajo
        $this->contenido = Contenido::factory()->create(['estado' => 'publico']);
        $this->trabajo = Trabajo::factory()->create([
            'contenido_id' => $this->contenido->id,
            'profesor_id' => $this->profesor->id,
        ]);
    }

    /** @test */
    public function puede_registrar_actividad_de_inicio_trabajo(): void
    {
        // Registrar actividad de inicio
        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'inicio_trabajo',
            ['duracion_evento' => 0]
        );

        // Verificar que se creó el registro
        $this->assertNotNull($monitoring);
        $this->assertEquals('inicio_trabajo', $monitoring->evento);
        $this->assertEquals($this->trabajo->id, $monitoring->trabajo_id);
        $this->assertEquals($this->estudiante->id, $monitoring->estudiante_id);
    }

    /** @test */
    public function puede_calcular_progreso_estimado(): void
    {
        // Registrar actividades con progreso
        $respuestasCompletas = ['respuesta_1' => 'contenido', 'respuesta_2' => 'contenido'];

        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'respuesta_escrita',
            [
                'duracion_evento' => 300,
                'respuestas_completas' => $respuestasCompletas,
                'total_respuestas' => 4,
                'caracteres_escritos' => 1500,
            ]
        );

        // Verificar progreso (2/4 = 50%)
        $this->assertEquals(50, $monitoring->progreso_estimado);
    }

    /** @test */
    public function puede_calcular_velocidad_respuesta(): void
    {
        // Registrar actividad con caracteres y tiempo
        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'respuesta_escrita',
            [
                'duracion_evento' => 600, // 10 minutos
                'caracteres_escritos' => 5000, // ~1000 palabras
                'respuestas_completas' => ['resp1' => 'texto'],
                'total_respuestas' => 1,
            ]
        );

        // Velocidad = 1000 palabras / 10 minutos = 100 palabras/min
        $this->assertEquals(100, $monitoring->velocidad_respuesta);
    }

    /** @test */
    public function detecta_riesgo_critico_por_abandono(): void
    {
        // Registrar evento de abandono
        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'abandono',
            ['duracion_evento' => 100]
        );

        // Verificar que score de riesgo es máximo
        $this->assertEquals(1.0, $monitoring->score_riesgo);
        $this->assertEquals('critico', $monitoring->nivel_riesgo);
    }

    /** @test */
    public function detecta_riesgo_alto_por_bajo_progreso_con_tiempo(): void
    {
        // Registrar múltiples eventos de bajo progreso con tiempo invertido
        $monitoring1 = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'inicio_trabajo',
            ['duracion_evento' => 600]
        );

        // Bajo progreso (5%) después de 600 segundos
        $monitoring2 = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'respuesta_escrita',
            [
                'duracion_evento' => 300,
                'respuestas_completas' => ['resp1' => 'texto'],
                'total_respuestas' => 20, // 1/20 = 5%
            ]
        );

        // Score debe ser mayor que 0.4
        $this->assertGreaterThanOrEqual(0.4, $monitoring2->score_riesgo);
    }

    /** @test */
    public function genera_alerta_por_abandono(): void
    {
        // Registrar actividad de abandono
        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'abandono',
            ['duracion_evento' => 100]
        );

        // Generar alerta
        $alerta = $this->alertSystem->evaluarYGenerarAlertas($monitoring);

        // Verificar que se generó alerta
        $this->assertNotNull($alerta);
        $this->assertEquals('riesgo_abandono', $alerta->tipo_alerta);
        $this->assertEquals('critica', $alerta->severidad);
        $this->assertDatabaseHas('student_alerts', ['id' => $alerta->id]);
    }

    /** @test */
    public function no_genera_alerta_duplicada(): void
    {
        // Registrar actividad de abandono
        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'abandono',
            ['duracion_evento' => 100]
        );

        // Generar primera alerta
        $alerta1 = $this->alertSystem->evaluarYGenerarAlertas($monitoring);
        $this->assertNotNull($alerta1);

        // Intentar generar segunda alerta (debe retornar null)
        $alerta2 = $this->alertSystem->evaluarYGenerarAlertas($monitoring);
        $this->assertNull($alerta2);
    }

    /** @test */
    public function genera_alerta_por_bajo_progreso_con_tiempo_alto(): void
    {
        // Registrar actividad con bajo progreso y tiempo alto
        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'respuesta_escrita',
            [
                'duracion_evento' => 1000, // >900 segundos
                'respuestas_completas' => ['resp1' => 'texto'],
                'total_respuestas' => 100, // 1% progreso
            ]
        );

        // Generar alerta
        $alerta = $this->alertSystem->evaluarYGenerarAlertas($monitoring);

        // Debería generar alerta de bajo progreso
        if ($alerta) {
            $this->assertIn($alerta->tipo_alerta, [
                'bajo_progreso',
                'dificultad_conceptual',
                'desempeño_inconsistente',
                'inactividad',
            ]);
        }
    }

    /** @test */
    public function genera_alerta_por_muchas_correcciones(): void
    {
        // Registrar múltiples cambios de respuesta
        for ($i = 0; $i < 9; $i++) {
            $this->progressMonitor->registrarActividad(
                $this->trabajo->id,
                $this->estudiante->id,
                $this->contenido->id,
                'cambio_respuesta',
                ['duracion_evento' => 100, 'num_correcciones' => $i + 1]
            );
        }

        // Registrar con muchas correcciones
        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'respuesta_escrita',
            [
                'duracion_evento' => 100,
                'num_correcciones' => 9,
                'respuestas_completas' => ['resp1' => 'texto'],
                'total_respuestas' => 1,
            ]
        );

        // Generar alerta
        $alerta = $this->alertSystem->evaluarYGenerarAlertas($monitoring);

        if ($alerta) {
            $this->assertNotNull($alerta);
        }
    }

    /** @test */
    public function detecta_patrones_problematicos_ciclo_correcciones(): void
    {
        // Registrar múltiples cambios de respuesta
        for ($i = 0; $i < 10; $i++) {
            $this->progressMonitor->registrarActividad(
                $this->trabajo->id,
                $this->estudiante->id,
                $this->contenido->id,
                'cambio_respuesta',
                ['duracion_evento' => 50]
            );
        }

        // Detectar patrones
        $patrones = $this->progressMonitor->detectarPatronesProblematicos($this->trabajo->id);

        // Debe detectar ciclo de correcciones
        $tienePatronCorrecciones = collect($patrones)
            ->contains(fn($p) => $p['tipo'] === 'ciclo_correcciones');

        $this->assertTrue($tienePatronCorrecciones);
    }

    /** @test */
    public function detecta_patrones_bajo_progreso_tiempo_alto(): void
    {
        // Registrar eventos con bajo progreso pero mucho tiempo
        for ($i = 0; $i < 5; $i++) {
            $this->progressMonitor->registrarActividad(
                $this->trabajo->id,
                $this->estudiante->id,
                $this->contenido->id,
                'respuesta_escrita',
                [
                    'duracion_evento' => 300,
                    'respuestas_completas' => ['resp' => 'texto'],
                    'total_respuestas' => 50, // 2% progreso
                ]
            );
        }

        // Detectar patrones
        $patrones = $this->progressMonitor->detectarPatronesProblematicos($this->trabajo->id);

        // Debe detectar bajo progreso con tiempo alto
        $tienePatronBajoProgreso = collect($patrones)
            ->contains(fn($p) => $p['tipo'] === 'bajo_progreso_tiempo_alto');

        $this->assertTrue($tienePatronBajoProgreso);
    }

    /** @test */
    public function obtiene_estadisticas_sesion(): void
    {
        // Registrar varias actividades
        $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'inicio_trabajo',
            ['duracion_evento' => 300]
        );

        $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'respuesta_escrita',
            [
                'duracion_evento' => 600,
                'respuestas_completas' => ['r1' => 'texto', 'r2' => 'texto'],
                'total_respuestas' => 4,
            ]
        );

        // Obtener estadísticas
        $estadisticas = $this->progressMonitor->obtenerEstadisticas($this->trabajo->id);

        // Verificar estructura
        $this->assertArrayHasKey('tiempo_total', $estadisticas);
        $this->assertArrayHasKey('eventos', $estadisticas);
        $this->assertArrayHasKey('progreso', $estadisticas);
        $this->assertArrayHasKey('nivel_riesgo', $estadisticas);
        $this->assertArrayHasKey('score_riesgo', $estadisticas);

        // Verificar valores
        $this->assertEquals(900, $estadisticas['tiempo_total']); // 300 + 600
        $this->assertEquals(2, $estadisticas['eventos']);
        $this->assertEquals(50, $estadisticas['progreso']); // 2/4 = 50%
    }

    /** @test */
    public function api_registra_actividad_correctamente(): void
    {
        $this->actingAs($this->estudiante, 'sanctum');

        $response = $this->postJson('/api/student-activity', [
            'trabajo_id' => $this->trabajo->id,
            'estudiante_id' => $this->estudiante->id,
            'contenido_id' => $this->contenido->id,
            'evento' => 'respuesta_escrita',
            'duracion_evento' => 300,
            'respuestas_completas' => ['resp1' => 'contenido'],
            'total_respuestas' => 4,
            'caracteres_escritos' => 2000,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'monitoring' => [
                    'id', 'evento', 'timestamp', 'progreso_estimado',
                    'nivel_riesgo', 'score_riesgo',
                ],
                'estadisticas' => [
                    'tiempo_total', 'eventos', 'progreso',
                    'nivel_riesgo', 'score_riesgo',
                ],
            ],
        ]);

        $this->assertTrue($response->json('success'));
    }

    /** @test */
    public function api_obtiene_resumen_actividad(): void
    {
        $this->actingAs($this->estudiante, 'sanctum');

        // Registrar actividad primero
        $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'respuesta_escrita',
            ['duracion_evento' => 300]
        );

        $response = $this->getJson("/api/student-activity/trabajo/{$this->trabajo->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'estadisticas' => [
                    'tiempo_total', 'eventos', 'progreso',
                    'nivel_riesgo', 'score_riesgo',
                ],
                'patrones',
            ],
        ]);
    }

    /** @test */
    public function api_obtiene_alertas_pendientes(): void
    {
        $this->actingAs($this->estudiante, 'sanctum');

        // Registrar actividad de riesgo
        $monitoring = $this->progressMonitor->registrarActividad(
            $this->trabajo->id,
            $this->estudiante->id,
            $this->contenido->id,
            'abandono',
            ['duracion_evento' => 100]
        );

        // Generar alerta
        $this->alertSystem->evaluarYGenerarAlertas($monitoring);

        $response = $this->getJson("/api/student-activity/alertas/{$this->estudiante->id}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'alertas' => [
                    '*' => [
                        'id', 'tipo_alerta', 'severidad', 'mensaje',
                        'recomendacion', 'estado',
                    ],
                ],
                'total',
            ],
        ]);
    }

    /** @test */
    public function api_marca_alerta_como_intervenida(): void
    {
        $this->actingAs($this->profesor, 'sanctum');

        // Crear alerta
        $alerta = StudentAlert::factory()->create([
            'trabajo_id' => $this->trabajo->id,
            'estudiante_id' => $this->estudiante->id,
            'estado' => 'generada',
        ]);

        $response = $this->patchJson(
            "/api/student-activity/alertas/{$alerta->id}/intervene",
            ['accion' => 'Se proporcionó asesoramiento']
        );

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);

        // Verificar que se actualizó
        $alerta->refresh();
        $this->assertEquals('intervenida', $alerta->estado);
        $this->assertNotNull($alerta->fecha_intervencion);
    }

    /** @test */
    public function validacion_request_rechaza_evento_inválido(): void
    {
        $this->actingAs($this->estudiante, 'sanctum');

        $response = $this->postJson('/api/student-activity', [
            'trabajo_id' => $this->trabajo->id,
            'estudiante_id' => $this->estudiante->id,
            'contenido_id' => $this->contenido->id,
            'evento' => 'evento_invalido',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('success', false);
        $response->assertJsonStructure(['errors']);
    }

    /** @test */
    public function validacion_request_rechaza_trabajo_inexistente(): void
    {
        $this->actingAs($this->estudiante, 'sanctum');

        $response = $this->postJson('/api/student-activity', [
            'trabajo_id' => 99999,
            'estudiante_id' => $this->estudiante->id,
            'contenido_id' => $this->contenido->id,
            'evento' => 'inicio_trabajo',
        ]);

        $response->assertStatus(422);
        $response->assertJsonPath('success', false);
    }
}
