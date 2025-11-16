<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentCluster extends Model
{
    use HasFactory;

    protected $table = 'student_clusters';

    protected $fillable = [
        'estudiante_id',
        'cluster_id',
        'cluster_distance',
        'membership_probabilities',
        'cluster_profile',
        'cluster_interpretation',
        'modelo_tipo',
        'modelo_version',
        'n_clusters_usado',
        'fecha_asignacion',
        'creado_por',
    ];

    protected $casts = [
        'fecha_asignacion' => 'datetime',
        'cluster_distance' => 'float',
        'membership_probabilities' => 'array',
        'cluster_profile' => 'array',
    ];

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Obtener todos los clusters de un estudiante
     */
    public static function getParaEstudiante(User $estudiante): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('estudiante_id', $estudiante->id)
            ->orderBy('fecha_asignacion', 'desc')
            ->get();
    }

    /**
     * Obtener cluster más reciente de un estudiante
     */
    public static function getUltimoParaEstudiante(User $estudiante): ?self
    {
        return static::where('estudiante_id', $estudiante->id)
            ->latest('fecha_asignacion')
            ->first();
    }

    /**
     * Obtener todos los estudiantes de un cluster
     */
    public static function getEstudiantesDeCluster(int $cluster_id): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('cluster_id', $cluster_id)
            ->with('estudiante')
            ->latest('fecha_asignacion')
            ->get();
    }

    /**
     * Obtener distribución de estudiantes por cluster
     */
    public static function getDistribucionClusters(): array
    {
        return static::select('cluster_id')
            ->selectRaw('COUNT(*) as cantidad')
            ->selectRaw('ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM student_clusters), 2) as porcentaje')
            ->groupBy('cluster_id')
            ->orderBy('cluster_id')
            ->get()
            ->map(function ($item) {
                return [
                    'cluster_id' => $item->cluster_id,
                    'cantidad' => $item->cantidad,
                    'porcentaje' => $item->porcentaje,
                ];
            })
            ->toArray();
    }

    /**
     * Obtener información formateada del cluster
     */
    public function obtenerInformacion(): array
    {
        $probabilities = $this->membership_probabilities ?? [];

        return [
            'id' => $this->id,
            'estudiante_id' => $this->estudiante_id,
            'estudiante_nombre' => $this->estudiante?->name,
            'cluster_id' => $this->cluster_id,
            'cluster_distancia' => round($this->cluster_distance ?? 0, 4),
            'probabilidades_pertenencia' => $probabilities,
            'probabilidad_principal' => max($probabilities) ?? 0,
            'perfil_cluster' => $this->cluster_profile,
            'interpretacion' => $this->cluster_interpretation,
            'modelo_version' => $this->modelo_version,
            'fecha_asignacion' => $this->fecha_asignacion->format('d/m/Y H:i'),
        ];
    }

    /**
     * Obtener descripción del cluster
     */
    public function getDescripcionCluster(): string
    {
        $clusters = [
            0 => 'Estudiantes de Alto Desempeño',
            1 => 'Estudiantes de Desempeño Medio',
            2 => 'Estudiantes que Necesitan Apoyo',
            3 => 'Estudiantes con Bajo Engagement',
            4 => 'Estudiantes Inconsistentes',
        ];

        return $clusters[$this->cluster_id] ?? "Cluster {$this->cluster_id}";
    }

    /**
     * Obtener color del cluster
     */
    public function getColorCluster(): string
    {
        $colores = [
            0 => '#10B981', // Verde - Alto desempeño
            1 => '#3B82F6', // Azul - Medio
            2 => '#F59E0B', // Naranja - Necesita apoyo
            3 => '#EF4444', // Rojo - Bajo engagement
            4 => '#8B5CF6', // Púrpura - Inconsistente
        ];

        return $colores[$this->cluster_id] ?? '#6B7280';
    }

    /**
     * Obtener icono del cluster
     */
    public function getIconoCluster(): string
    {
        $iconos = [
            0 => '⭐', // Alto desempeño
            1 => '✅', // Medio
            2 => '⚠️', // Necesita apoyo
            3 => '❌', // Bajo engagement
            4 => '❓', // Inconsistente
        ];

        return $iconos[$this->cluster_id] ?? '📊';
    }

    /**
     * Obtener recomendaciones para el cluster
     */
    public function getRecomendaciones(): array
    {
        $recomendaciones = [
            0 => [
                'Mantener el nivel de desempeño',
                'Considerar roles de liderazgo',
                'Ofrecer desafíos adicionales',
                'Potencial para mentoría de pares',
            ],
            1 => [
                'Refuerzo en áreas débiles',
                'Seguimiento regular',
                'Apoyo académico selectivo',
                'Mejorar consistencia',
            ],
            2 => [
                'Apoyo académico intensivo',
                'Monitoreo cercano',
                'Involucrar a tutores/mentores',
                'Identificar barreras específicas',
            ],
            3 => [
                'Mejorar motivación y engagement',
                'Comunicación con familia',
                'Oportunidades de éxito rápido',
                'Revisar si hay problemas personales',
            ],
            4 => [
                'Analizar factores de inconsistencia',
                'Apoyo para regulación emocional',
                'Routine y estructura clara',
                'Identificar patrones de dificultad',
            ],
        ];

        return $recomendaciones[$this->cluster_id] ?? [];
    }

    /**
     * Obtener resumen de clusters
     */
    public static function obtenerResumen(): array
    {
        $distribucion = static::getDistribucionClusters();

        $resumen = [
            'total_estudiantes' => static::count(),
            'numero_clusters' => static::distinct('cluster_id')->count('cluster_id'),
            'distribucion' => $distribucion,
            'ultima_actualizacion' => static::latest('fecha_asignacion')->first()?->fecha_asignacion,
        ];

        // Agregar información por cluster
        foreach ($distribucion as $cluster) {
            $resumen["cluster_{$cluster['cluster_id']}_cantidad"] = $cluster['cantidad'];
            $resumen["cluster_{$cluster['cluster_id']}_porcentaje"] = $cluster['porcentaje'];
        }

        return $resumen;
    }

    /**
     * Obtener estudiantes por cluster con orden descendente
     */
    public static function getTopClustersBySize(int $limit = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = static::selectRaw('cluster_id, COUNT(*) as cantidad')
            ->groupBy('cluster_id')
            ->orderByDesc('cantidad');

        if ($limit) {
            $query->limit($limit);
        }

        return $query->get();
    }
}
