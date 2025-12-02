<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Detecta automáticamente el tema de preguntas existentes
     * basándose en keywords del enunciado.
     */
    public function up(): void
    {
        // Obtener todas las preguntas sin tema
        $preguntas = DB::table('preguntas')
            ->whereNull('tema')
            ->get();

        foreach ($preguntas as $pregunta) {
            $tema = $this->detectarTemaDesdeEnunciado($pregunta->enunciado);
            DB::table('preguntas')
                ->where('id', $pregunta->id)
                ->update(['tema' => $tema]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No hacer rollback del tema ya que es un backfill
        // Si se necesita, hacer rollback manual de la migración anterior
    }

    /**
     * Detecta el tema de una pregunta basándose en keywords del enunciado
     */
    private function detectarTemaDesdeEnunciado(string $enunciado): string
    {
        $lower = strtolower($enunciado);

        // Mapeo de keywords por concepto
        $keywords = [
            'Lógica' => ['if', 'else', 'condition', 'booleano', 'condicional', 'lógico'],
            'Bucles' => ['for', 'while', 'do', 'foreach', 'repetir', 'iteración', 'bucle'],
            'Funciones' => ['función', 'function', 'method', 'parámetro', 'return', 'llamada'],
            'Estructuras de Datos' => ['array', 'lista', 'estructura', 'variable', 'arreglo'],
            'Matemáticas' => ['suma', 'resta', 'multiplicación', 'división', 'ecuación', 'número'],
            'Strings' => ['cadena', 'string', 'texto', 'caracteres', 'concatenar', 'substring'],
            'Objetos' => ['clase', 'objeto', 'instancia', 'propiedad', 'atributo', 'método'],
            'Bases de Datos' => ['sql', 'consulta', 'tabla', 'relación', 'clave', 'foránea', 'database'],
            'Web' => ['html', 'css', 'javascript', 'dom', 'evento', 'formulario', 'http'],
            'Entrada/Salida' => ['input', 'output', 'lectura', 'escritura', 'archivo', 'stream'],
        ];

        // Buscar el primer keyword que matchee
        foreach ($keywords as $tema => $palabras) {
            foreach ($palabras as $palabra) {
                if (strpos($lower, $palabra) !== false) {
                    return $tema;
                }
            }
        }

        // Si no detecta nada, retornar 'General'
        return 'General';
    }
};
