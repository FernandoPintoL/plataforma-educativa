<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Institucion extends Model
{
    use HasFactory;

    protected $table = 'instituciones';

    protected $fillable = [
        'nombre',
        'tipo',
        'ubicacion',
        'sitio_web',
        'contacto',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /**
     * Relación con las carreras que ofrece
     */
    public function carreras(): BelongsToMany
    {
        return $this->belongsToMany(Carrera::class);
    }

    /**
     * Obtener información de admisión
     */
    public function obtenerInformacionAdmision(): array
    {
        return [
            'requisitos_generales' => $this->obtenerRequisitosGenerales(),
            'proceso_admision' => $this->obtenerProcesoAdmision(),
            'fechas_importantes' => $this->obtenerFechasImportantes(),
            'documentos_requeridos' => $this->obtenerDocumentosRequeridos(),
            'costos' => $this->obtenerCostos(),
        ];
    }

    /**
     * Obtener requisitos generales de admisión
     */
    private function obtenerRequisitosGenerales(): array
    {
        $requisitos = [
            'bachillerato' => 'Título de bachillerato o equivalente',
            'documentos' => 'Documentos de identidad y académicos',
            'examen' => 'Examen de admisión (según la institución)',
        ];

        // Agregar requisitos específicos según el tipo de institución
        switch ($this->tipo) {
            case 'universidad_publica':
                $requisitos['examen_nacional'] = 'Examen nacional de admisión';
                break;
            case 'universidad_privada':
                $requisitos['entrevista'] = 'Entrevista personal';
                break;
            case 'instituto_tecnico':
                $requisitos['practica'] = 'Práctica profesional previa (opcional)';
                break;
        }

        return $requisitos;
    }

    /**
     * Obtener proceso de admisión
     */
    private function obtenerProcesoAdmision(): array
    {
        return [
            'inscripcion' => 'Registro en línea o presencial',
            'documentacion' => 'Entrega de documentos requeridos',
            'evaluacion' => 'Evaluación académica y/o entrevista',
            'seleccion' => 'Proceso de selección',
            'matricula' => 'Matrícula y pago de aranceles',
        ];
    }

    /**
     * Obtener fechas importantes
     */
    private function obtenerFechasImportantes(): array
    {
        $anoActual = date('Y');

        return [
            'inscripciones_inicio' => "01 de enero de {$anoActual}",
            'inscripciones_fin' => "31 de marzo de {$anoActual}",
            'examen_admision' => "15 de abril de {$anoActual}",
            'resultados' => "30 de abril de {$anoActual}",
            'matricula_inicio' => "01 de mayo de {$anoActual}",
            'matricula_fin' => "31 de mayo de {$anoActual}",
            'inicio_clases' => "01 de agosto de {$anoActual}",
        ];
    }

    /**
     * Obtener documentos requeridos
     */
    private function obtenerDocumentosRequeridos(): array
    {
        return [
            'identificacion' => 'Cédula de identidad o pasaporte',
            'titulo_bachillerato' => 'Título de bachillerato legalizado',
            'certificados' => 'Certificados de calificaciones',
            'fotografias' => 'Fotografías tamaño carnet',
            'comprobante_pago' => 'Comprobante de pago de aranceles',
        ];
    }

    /**
     * Obtener costos
     */
    private function obtenerCostos(): array
    {
        $costos = [
            'inscripcion' => 0,
            'matricula' => 0,
            'mensualidad' => 0,
        ];

        // Establecer costos según el tipo de institución
        switch ($this->tipo) {
            case 'universidad_publica':
                $costos['inscripcion'] = 50;
                $costos['matricula'] = 100;
                $costos['mensualidad'] = 0;
                break;
            case 'universidad_privada':
                $costos['inscripcion'] = 200;
                $costos['matricula'] = 500;
                $costos['mensualidad'] = 300;
                break;
            case 'instituto_tecnico':
                $costos['inscripcion'] = 100;
                $costos['matricula'] = 200;
                $costos['mensualidad'] = 150;
                break;
        }

        return $costos;
    }

    /**
     * Mostrar ranking
     */
    public function mostrarRanking(): array
    {
        return [
            'nacional' => $this->obtenerRankingNacional(),
            'regional' => $this->obtenerRankingRegional(),
            'por_area' => $this->obtenerRankingPorArea(),
        ];
    }

    /**
     * Obtener ranking nacional
     */
    private function obtenerRankingNacional(): array
    {
        // Simular ranking nacional
        $rankings = [
            'universidad_publica' => rand(1, 10),
            'universidad_privada' => rand(1, 15),
            'instituto_tecnico' => rand(1, 20),
        ];

        return [
            'posicion' => $rankings[$this->tipo] ?? rand(1, 25),
            'total_instituciones' => 100,
            'categoria' => $this->obtenerCategoriaRanking(),
        ];
    }

    /**
     * Obtener ranking regional
     */
    private function obtenerRankingRegional(): array
    {
        return [
            'posicion' => rand(1, 10),
            'total_instituciones' => 25,
            'region' => $this->ubicacion,
        ];
    }

    /**
     * Obtener ranking por área
     */
    private function obtenerRankingPorArea(): array
    {
        $areas = ['ingenieria', 'medicina', 'derecho', 'administracion', 'educacion'];
        $rankings = [];

        foreach ($areas as $area) {
            $rankings[$area] = [
                'posicion' => rand(1, 20),
                'total_instituciones' => 50,
            ];
        }

        return $rankings;
    }

    /**
     * Obtener categoría de ranking
     */
    private function obtenerCategoriaRanking(): string
    {
        $categorias = [
            'universidad_publica' => 'Universidad Pública',
            'universidad_privada' => 'Universidad Privada',
            'instituto_tecnico' => 'Instituto Técnico',
        ];

        return $categorias[$this->tipo] ?? 'Institución Educativa';
    }

    /**
     * Obtener tipo formateado
     */
    public function getTipoFormateado(): string
    {
        $tipos = [
            'universidad_publica' => 'Universidad Pública',
            'universidad_privada' => 'Universidad Privada',
            'instituto_tecnico' => 'Instituto Técnico',
            'instituto_profesional' => 'Instituto Profesional',
            'centro_formacion' => 'Centro de Formación',
        ];

        return $tipos[$this->tipo] ?? ucfirst(str_replace('_', ' ', $this->tipo));
    }

    /**
     * Obtener información de la institución
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'tipo' => $this->tipo,
            'tipo_formateado' => $this->getTipoFormateado(),
            'ubicacion' => $this->ubicacion,
            'sitio_web' => $this->sitio_web,
            'contacto' => $this->contacto,
            'activo' => $this->activo,
            'total_carreras' => $this->carreras()->count(),
            'informacion_admision' => $this->obtenerInformacionAdmision(),
            'ranking' => $this->mostrarRanking(),
        ];
    }

    /**
     * Obtener estadísticas de la institución
     */
    public function obtenerEstadisticas(): array
    {
        return [
            'total_carreras' => $this->carreras()->count(),
            'carreras_activas' => $this->carreras()->where('activo', true)->count(),
            'promedio_duracion' => $this->carreras()->avg('duracion_anos') ?? 0,
            'niveles_educativos' => $this->carreras()
                ->selectRaw('nivel_educativo, COUNT(*) as count')
                ->groupBy('nivel_educativo')
                ->pluck('count', 'nivel_educativo')
                ->toArray(),
        ];
    }

    /**
     * Buscar instituciones por tipo
     */
    public static function buscarPorTipo(string $tipo): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->where('tipo', $tipo)
            ->get();
    }

    /**
     * Buscar instituciones por ubicación
     */
    public static function buscarPorUbicacion(string $ubicacion): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->where('ubicacion', 'like', "%{$ubicacion}%")
            ->get();
    }

    /**
     * Obtener instituciones más populares
     */
    public static function getMasPopulares(int $limite = 10): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('activo', true)
            ->withCount('carreras')
            ->orderBy('carreras_count', 'desc')
            ->limit($limite)
            ->get();
    }
}
