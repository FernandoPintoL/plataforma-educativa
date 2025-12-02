<?php

namespace App\Services;

use App\Models\AnalisisIADocumento;
use App\Models\Calificacion;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeteccionIAService
{
    private string $apiUrl = 'https://gateway-microservice-d5ccehh0ajaqgcd0.canadacentral-01.azurewebsites.net/upload-documento';

    /**
     * Analizar documento PDF en busca de contenido generado por IA
     */
    public function analizarDocumento(
        string $rutaArchivo,
        int $trabajoId,
        int $proyectoId = 1
    ): AnalisisIADocumento|null {
        try {
            // Obtener el archivo
            if (!Storage::exists($rutaArchivo)) {
                throw new \Exception("El archivo no existe: {$rutaArchivo}");
            }

            // Enviar el archivo al endpoint de detección
            $respuesta = $this->enviarDocumentoAlServicio($rutaArchivo, $proyectoId);

            if (!$respuesta) {
                throw new \Exception("No se recibió respuesta del servidor de IA");
            }

            // Procesar la respuesta
            return $this->procesarRespuesta($respuesta, $trabajoId);

        } catch (\Exception $e) {
            Log::error('Error en análisis de IA', [
                'trabajo_id' => $trabajoId,
                'archivo' => $rutaArchivo,
                'error' => $e->getMessage(),
            ]);

            // Registrar error en BD
            return $this->registrarError($trabajoId, $e->getMessage());
        }
    }

    /**
     * Enviar documento al servicio de detección de IA
     */
    private function enviarDocumentoAlServicio(string $rutaArchivo, int $proyectoId): array|null
    {
        try {
            // Obtener contenido del archivo
            $contenido = Storage::get($rutaArchivo);
            $nombreArchivo = basename($rutaArchivo);

            // Crear request con multipart form data
            $response = Http::timeout(60)
                ->attach('documento', $contenido, $nombreArchivo)
                ->post($this->apiUrl, [
                    'proyecto_id' => $proyectoId,
                ])
                ->json();

            return $response ?: null;

        } catch (\Exception $e) {
            Log::error('Error enviando documento al servicio de IA', [
                'error' => $e->getMessage(),
                'archivo' => $rutaArchivo,
            ]);

            return null;
        }
    }

    /**
     * Procesar respuesta del servicio de IA
     */
    private function procesarRespuesta(array $respuesta, int $trabajoId): AnalisisIADocumento|null
    {
        try {
            // Extraer porcentaje de IA de la respuesta
            // Ajusta esta lógica según la estructura real de la respuesta del endpoint
            $porcentajeIA = $this->extraerPorcentajeIA($respuesta);

            // Buscar o crear registro de análisis
            $analisisIA = AnalisisIADocumento::where('trabajo_id', $trabajoId)
                ->latest()
                ->first();

            if (!$analisisIA) {
                $analisisIA = new AnalisisIADocumento();
                $analisisIA->trabajo_id = $trabajoId;
            }

            // Actualizar datos
            $analisisIA->porcentaje_ia = $porcentajeIA;
            $analisisIA->detalles_analisis = $respuesta;
            $analisisIA->estado = 'completado';
            $analisisIA->fecha_analisis = now();
            $analisisIA->save();

            Log::info('Análisis de IA completado', [
                'trabajo_id' => $trabajoId,
                'porcentaje_ia' => $porcentajeIA,
            ]);

            return $analisisIA;

        } catch (\Exception $e) {
            Log::error('Error procesando respuesta de IA', [
                'trabajo_id' => $trabajoId,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Extraer porcentaje de IA de la respuesta
     * Ajusta esto según la estructura real de tu endpoint
     */
    private function extraerPorcentajeIA(array $respuesta): float
    {
        // Buscar en diferentes posibles ubicaciones de la respuesta
        if (isset($respuesta['porcentaje_ia'])) {
            return (float) $respuesta['porcentaje_ia'];
        }

        if (isset($respuesta['ia_percentage'])) {
            return (float) $respuesta['ia_percentage'];
        }

        if (isset($respuesta['score'])) {
            return (float) $respuesta['score'] * 100; // Si viene como decimal 0-1
        }

        if (isset($respuesta['resultado']['porcentaje'])) {
            return (float) $respuesta['resultado']['porcentaje'];
        }

        // Por defecto, asumir que no hay IA detectada
        return 0;
    }

    /**
     * Registrar error en análisis de IA
     */
    private function registrarError(int $trabajoId, string $mensaje): AnalisisIADocumento
    {
        $analisisIA = new AnalisisIADocumento();
        $analisisIA->trabajo_id = $trabajoId;
        $analisisIA->estado = 'error';
        $analisisIA->mensaje_error = $mensaje;
        $analisisIA->porcentaje_ia = 0;
        $analisisIA->save();

        return $analisisIA;
    }

    /**
     * Analizar documento desde una calificación existente
     */
    public function analizarDocumentoDeCalificacion(Calificacion $calificacion): AnalisisIADocumento|null
    {
        try {
            // Obtener el trabajo y sus archivos
            $trabajo = $calificacion->trabajo;

            // Si el trabajo tiene archivos adjuntos
            if ($trabajo->respuestas && isset($trabajo->respuestas['archivos'])) {
                // Buscar el primer PDF
                foreach ($trabajo->respuestas['archivos'] as $archivo) {
                    if (str_ends_with(strtolower($archivo['nombre']), '.pdf')) {
                        $rutaArchivo = $archivo['path'] ?? $archivo['nombre'];

                        // Crear registro de análisis vinculado a la calificación
                        $analisis = $this->analizarDocumento(
                            $rutaArchivo,
                            $trabajo->id
                        );

                        if ($analisis) {
                            // Vincular a la calificación
                            $analisis->calificacion_id = $calificacion->id;
                            $analisis->save();
                        }

                        return $analisis;
                    }
                }
            }

            throw new \Exception('No se encontró archivo PDF en la entrega');

        } catch (\Exception $e) {
            Log::error('Error analizando documento de calificación', [
                'calificacion_id' => $calificacion->id,
                'trabajo_id' => $calificacion->trabajo_id,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }
}
