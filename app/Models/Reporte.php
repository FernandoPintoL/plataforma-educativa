<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reporte extends Model
{
    use HasFactory;

    protected $fillable = [
        'tipo',
        'datos',
        'fecha_generacion',
        'destinatarios',
    ];

    protected $casts = [
        'datos' => 'array',
        'fecha_generacion' => 'datetime',
        'destinatarios' => 'array',
    ];

    /**
     * Relación con los destinatarios
     */
    public function usuariosDestinatarios(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'reporte_usuario', 'reporte_id', 'usuario_id');
    }

    /**
     * Relación con el generador del reporte
     */
    public function generador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generador_id');
    }

    /**
     * Exportar el reporte
     */
    public function exportar(string $formato): string
    {
        switch (strtolower($formato)) {
            case 'pdf':
                return $this->exportarPdf();
            case 'excel':
                return $this->exportarExcel();
            case 'csv':
                return $this->exportarCsv();
            default:
                return $this->exportarJson();
        }
    }

    /**
     * Exportar a PDF
     */
    private function exportarPdf(): string
    {
        // Implementar exportación a PDF
        // Por ahora, retornar ruta temporal
        return 'reporte_' . $this->id . '.pdf';
    }

    /**
     * Exportar a Excel
     */
    private function exportarExcel(): string
    {
        // Implementar exportación a Excel
        // Por ahora, retornar ruta temporal
        return 'reporte_' . $this->id . '.xlsx';
    }

    /**
     * Exportar a CSV
     */
    private function exportarCsv(): string
    {
        // Implementar exportación a CSV
        // Por ahora, retornar ruta temporal
        return 'reporte_' . $this->id . '.csv';
    }

    /**
     * Exportar a JSON
     */
    private function exportarJson(): string
    {
        return json_encode($this->datos, JSON_PRETTY_PRINT);
    }

    /**
     * Enviar el reporte
     */
    public function enviar(): bool
    {
        try {
            // Implementar lógica de envío
            // Por ejemplo, enviar por email a los destinatarios
            
            foreach ($this->destinatarios as $destinatarioId) {
                $usuario = User::find($destinatarioId);
                if ($usuario) {
                    // Enviar notificación o email
                    $this->enviarNotificacion($usuario);
                }
            }

            return true;
        } catch (\Exception $e) {
            \Log::error('Error enviando reporte: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Enviar notificación al usuario
     */
    private function enviarNotificacion(User $usuario): void
    {
        // Implementar envío de notificación
        // Por ejemplo, crear una notificación en la base de datos
    }

    /**
     * Obtener resumen del reporte
     */
    public function obtenerResumen(): array
    {
        return [
            'id' => $this->id,
            'tipo' => $this->tipo,
            'fecha_generacion' => $this->fecha_generacion->format('d/m/Y H:i'),
            'total_destinatarios' => count($this->destinatarios ?? []),
            'datos_principales' => $this->extraerDatosPrincipales(),
        ];
    }

    /**
     * Extraer datos principales del reporte
     */
    private function extraerDatosPrincipales(): array
    {
        if (!$this->datos) {
            return [];
        }

        $datosPrincipales = [];

        switch ($this->tipo) {
            case 'rendimiento_curso':
                $datosPrincipales = [
                    'promedio_general' => $this->datos['promedio_general'] ?? 0,
                    'total_estudiantes' => $this->datos['total_estudiantes'] ?? 0,
                    'porcentaje_aprobacion' => $this->datos['porcentaje_aprobacion'] ?? 0,
                ];
                break;
            
            case 'rendimiento_estudiante':
                $datosPrincipales = [
                    'promedio_estudiante' => $this->datos['promedio'] ?? 0,
                    'total_materias' => $this->datos['total_materias'] ?? 0,
                    'tendencia' => $this->datos['tendencia'] ?? 'estable',
                ];
                break;
            
            case 'estadisticas_vocacionales':
                $datosPrincipales = [
                    'total_tests' => $this->datos['total_tests'] ?? 0,
                    'carreras_populares' => $this->datos['carreras_populares'] ?? [],
                    'areas_interes' => $this->datos['areas_interes'] ?? [],
                ];
                break;
        }

        return $datosPrincipales;
    }

    /**
     * Verificar si el reporte es reciente
     */
    public function esReciente(int $dias = 7): bool
    {
        return $this->fecha_generacion->diffInDays(now()) <= $dias;
    }

    /**
     * Obtener formato de archivo recomendado
     */
    public function getFormatoRecomendado(): string
    {
        switch ($this->tipo) {
            case 'rendimiento_curso':
            case 'rendimiento_estudiante':
                return 'pdf';
            case 'estadisticas_vocacionales':
                return 'excel';
            default:
                return 'json';
        }
    }
}
