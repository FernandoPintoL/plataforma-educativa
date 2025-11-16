<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // ==================== ML TRAINING SCHEDULE ====================
        // Entrenar modelos ML diariamente a las 2:00 AM
        $schedule->command('ml:train --limit=50')
            ->dailyAt('02:00')
            ->description('Entrenamiento diario de modelos ML')
            ->withoutOverlapping()
            ->onOneServer();

        // Entrenar modelos ML semanalmente con más datos (los domingos)
        $schedule->command('ml:train --limit=100')
            ->weeklyOn(0, '03:00') // Domingo a las 3:00 AM
            ->description('Entrenamiento semanal completo de modelos ML')
            ->withoutOverlapping()
            ->onOneServer();

        // ==================== CLEANUP & MAINTENANCE ====================
        // Limpiar predicciones antiguas (mayores a 90 días)
        $schedule->call(function () {
            \App\Models\PrediccionRiesgo::where('created_at', '<', now()->subDays(90))
                ->forceDelete();
            \App\Models\PrediccionCarrera::where('created_at', '<', now()->subDays(90))
                ->forceDelete();
            \App\Models\PrediccionTendencia::where('created_at', '<', now()->subDays(90))
                ->forceDelete();
        })->weeklyOn(6, '04:00') // Sábado a las 4:00 AM
            ->description('Limpiar predicciones antiguas');

        // ==================== MONITORING ====================
        // Verificar salud del sistema
        $schedule->call(function () {
            $totalPred = \App\Models\PrediccionRiesgo::count();
            $riesgoAlto = \App\Models\PrediccionRiesgo::where('risk_level', 'alto')->count();

            if ($totalPred === 0) {
                \Log::warning('Advertencia: No hay predicciones en BD');
            }

            if ($riesgoAlto > 20) {
                \Log::info("Alerta: {$riesgoAlto} estudiantes con riesgo alto");
            }
        })->everyFiveMinutes()
            ->description('Monitoreo de predicciones');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
