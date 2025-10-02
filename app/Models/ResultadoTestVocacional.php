<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ResultadoTestVocacional extends Model
{
    use HasFactory;

    protected $table = 'resultados_test_vocacional';

    protected $fillable = [
        'estudiante_id',
        'test_vocacional_id',
        'fecha',
        'puntajes_por_categoria',
    ];

    protected $casts = [
        'fecha' => 'datetime',
        'puntajes_por_categoria' => 'array',
    ];

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con el test vocacional
     */
    public function testVocacional(): BelongsTo
    {
        return $this->belongsTo(TestVocacional::class);
    }

    /**
     * Relación con el perfil vocacional
     */
    public function perfilVocacional(): HasOne
    {
        return $this->hasOne(PerfilVocacional::class);
    }

    /**
     * Generar perfil vocacional
     */
    public function generarPerfilVocacional(): PerfilVocacional
    {
        $perfil = PerfilVocacional::updateOrCreate(
            ['estudiante_id' => $this->estudiante_id],
            [
                'intereses' => $this->extraerIntereses(),
                'habilidades' => $this->extraerHabilidades(),
                'personalidad' => $this->extraerPersonalidad(),
                'aptitudes' => $this->extraerAptitudes(),
                'fecha_creacion' => $this->perfilVocacional?->fecha_creacion ?? now(),
                'fecha_actualizacion' => now(),
            ]
        );

        return $perfil;
    }

    /**
     * Extraer intereses del resultado
     */
    private function extraerIntereses(): array
    {
        $intereses = [];

        foreach ($this->puntajes_por_categoria as $categoriaId => $puntaje) {
            $categoria = CategoriaTest::find($categoriaId);
            if ($categoria) {
                $intereses[$categoria->nombre] = $puntaje;
            }
        }

        return $intereses;
    }

    /**
     * Extraer habilidades del resultado
     */
    private function extraerHabilidades(): array
    {
        // Mapear categorías a habilidades específicas
        $mapeoHabilidades = [
            'Matemáticas' => ['razonamiento_logico', 'analisis_numerico'],
            'Ciencias' => ['investigacion', 'pensamiento_critico'],
            'Artes' => ['creatividad', 'expresion_artistica'],
            'Deportes' => ['liderazgo', 'trabajo_equipo'],
            'Tecnología' => ['resolucion_problemas', 'adaptabilidad'],
        ];

        $habilidades = [];

        foreach ($this->puntajes_por_categoria as $categoriaId => $puntaje) {
            $categoria = CategoriaTest::find($categoriaId);
            if ($categoria && isset($mapeoHabilidades[$categoria->nombre])) {
                foreach ($mapeoHabilidades[$categoria->nombre] as $habilidad) {
                    $habilidades[$habilidad] = $puntaje;
                }
            }
        }

        return $habilidades;
    }

    /**
     * Extraer personalidad del resultado
     */
    private function extraerPersonalidad(): array
    {
        // Mapear categorías a rasgos de personalidad
        $mapeoPersonalidad = [
            'Liderazgo' => ['extroversion', 'confianza'],
            'Creatividad' => ['apertura', 'imaginacion'],
            'Análisis' => ['consciencia', 'metodicidad'],
            'Social' => ['amabilidad', 'empatia'],
            'Técnico' => ['estabilidad', 'persistencia'],
        ];

        $personalidad = [];

        foreach ($this->puntajes_por_categoria as $categoriaId => $puntaje) {
            $categoria = CategoriaTest::find($categoriaId);
            if ($categoria && isset($mapeoPersonalidad[$categoria->nombre])) {
                foreach ($mapeoPersonalidad[$categoria->nombre] as $rasgo) {
                    $personalidad[$rasgo] = $puntaje;
                }
            }
        }

        return $personalidad;
    }

    /**
     * Extraer aptitudes del resultado
     */
    private function extraerAptitudes(): array
    {
        // Mapear categorías a aptitudes específicas
        $mapeoAptitudes = [
            'Matemáticas' => ['calculo', 'geometria'],
            'Ciencias' => ['biologia', 'quimica', 'fisica'],
            'Artes' => ['dibujo', 'musica', 'literatura'],
            'Deportes' => ['coordinacion', 'resistencia'],
            'Tecnología' => ['programacion', 'diseno'],
        ];

        $aptitudes = [];

        foreach ($this->puntajes_por_categoria as $categoriaId => $puntaje) {
            $categoria = CategoriaTest::find($categoriaId);
            if ($categoria && isset($mapeoAptitudes[$categoria->nombre])) {
                foreach ($mapeoAptitudes[$categoria->nombre] as $aptitud) {
                    $aptitudes[$aptitud] = $puntaje;
                }
            }
        }

        return $aptitudes;
    }

    /**
     * Generar recomendaciones
     */
    public function generarRecomendaciones(): array
    {
        $recomendaciones = [];

        // Obtener carreras compatibles
        $carreras = Carrera::where('activo', true)->get();

        foreach ($carreras as $carrera) {
            $compatibilidad = $this->calcularCompatibilidadCarrera($carrera);

            if ($compatibilidad > 0.6) {
                $recomendaciones[] = [
                    'carrera' => $carrera,
                    'compatibilidad' => $compatibilidad,
                    'razones' => $this->generarRazonesCompatibilidad($carrera),
                ];
            }
        }

        // Ordenar por compatibilidad
        usort($recomendaciones, fn ($a, $b) => $b['compatibilidad'] <=> $a['compatibilidad']);

        return array_slice($recomendaciones, 0, 5); // Top 5 recomendaciones
    }

    /**
     * Calcular compatibilidad con una carrera
     */
    private function calcularCompatibilidadCarrera(Carrera $carrera): float
    {
        $perfilIdeal = $carrera->perfil_ideal;
        $compatibilidad = 0;
        $totalCriterios = 0;

        foreach ($perfilIdeal as $criterio => $puntajeRequerido) {
            $puntajeEstudiante = $this->obtenerPuntajeCriterio($criterio);
            if ($puntajeEstudiante > 0) {
                $compatibilidad += min(1, $puntajeEstudiante / $puntajeRequerido);
                $totalCriterios++;
            }
        }

        return $totalCriterios > 0 ? $compatibilidad / $totalCriterios : 0;
    }

    /**
     * Obtener puntaje de un criterio específico
     */
    private function obtenerPuntajeCriterio(string $criterio): float
    {
        $intereses = $this->extraerIntereses();
        $habilidades = $this->extraerHabilidades();
        $personalidad = $this->extraerPersonalidad();
        $aptitudes = $this->extraerAptitudes();

        return $intereses[$criterio] ??
        $habilidades[$criterio] ??
        $personalidad[$criterio] ??
        $aptitudes[$criterio] ?? 0;
    }

    /**
     * Generar razones de compatibilidad
     */
    private function generarRazonesCompatibilidad(Carrera $carrera): array
    {
        $razones = [];
        $perfilIdeal = $carrera->perfil_ideal;

        foreach ($perfilIdeal as $criterio => $puntajeRequerido) {
            $puntajeEstudiante = $this->obtenerPuntajeCriterio($criterio);

            if ($puntajeEstudiante >= $puntajeRequerido * 0.8) {
                $razones[] = "Fuerte en: {$criterio}";
            } elseif ($puntajeEstudiante >= $puntajeRequerido * 0.6) {
                $razones[] = "Bueno en: {$criterio}";
            }
        }

        return $razones;
    }

    /**
     * Exportar resultados
     */
    public function exportarResultados(): string
    {
        $datos = [
            'estudiante' => $this->estudiante->nombre_completo,
            'test' => $this->testVocacional->nombre,
            'fecha' => $this->fecha->format('d/m/Y H:i'),
            'puntajes_por_categoria' => $this->puntajes_por_categoria,
            'perfil_vocacional' => $this->perfilVocacional?->obtenerInformacion(),
            'recomendaciones' => $this->generarRecomendaciones(),
        ];

        return json_encode($datos, JSON_PRETTY_PRINT);
    }

    /**
     * Obtener resumen del resultado
     */
    public function obtenerResumen(): array
    {
        return [
            'id' => $this->id,
            'estudiante' => $this->estudiante->nombre_completo,
            'test' => $this->testVocacional->nombre,
            'fecha' => $this->fecha->format('d/m/Y H:i'),
            'total_categorias' => count($this->puntajes_por_categoria),
            'puntaje_promedio' => array_sum($this->puntajes_por_categoria) / count($this->puntajes_por_categoria),
            'categoria_mas_alta' => $this->obtenerCategoriaMasAlta(),
            'categoria_mas_baja' => $this->obtenerCategoriaMasBaja(),
        ];
    }

    /**
     * Obtener categoría con mayor puntaje
     */
    private function obtenerCategoriaMasAlta(): ?string
    {
        if (empty($this->puntajes_por_categoria)) {
            return null;
        }

        $categoriaId = array_search(max($this->puntajes_por_categoria), $this->puntajes_por_categoria);
        $categoria = CategoriaTest::find($categoriaId);

        return $categoria?->nombre;
    }

    /**
     * Obtener categoría con menor puntaje
     */
    private function obtenerCategoriaMasBaja(): ?string
    {
        if (empty($this->puntajes_por_categoria)) {
            return null;
        }

        $categoriaId = array_search(min($this->puntajes_por_categoria), $this->puntajes_por_categoria);
        $categoria = CategoriaTest::find($categoriaId);

        return $categoria?->nombre;
    }
}
