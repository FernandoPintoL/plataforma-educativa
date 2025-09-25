<?php

namespace App\Http\Controllers;

use App\Models\AperturaCaja;
use App\Models\Caja;
use App\Models\CierreCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CajaController extends Controller
{
    /**
     * Mostrar dashboard de cajas
     */
    public function index()
    {
        $user = Auth::user();

        // Obtener cajas disponibles
        $cajas = Caja::activas()->get();

        // Verificar si el usuario tiene caja abierta hoy
        $cajaAbiertaHoy = AperturaCaja::where('user_id', $user->id)
            ->whereDate('fecha', today())
            ->with(['caja', 'cierre'])
            ->first();

        // Obtener movimientos del día si hay caja abierta
        $movimientosHoy = [];
        if ($cajaAbiertaHoy) {
            $movimientosHoy = MovimientoCaja::where('caja_id', $cajaAbiertaHoy->caja_id)
                ->where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->with('tipoOperacion')
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('Cajas/Index', [
            'cajas' => $cajas,
            'cajaAbiertaHoy' => $cajaAbiertaHoy,
            'movimientosHoy' => $movimientosHoy,
            'totalMovimientos' => $movimientosHoy ? $movimientosHoy->sum('monto') : 0,
        ]);
    }

    /**
     * Abrir caja para el día actual
     */
    public function abrirCaja(Request $request)
    {
        $request->validate([
            'caja_id' => 'required|exists:cajas,id',
            'monto_apertura' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            // Verificar que no tenga caja abierta hoy
            $cajaExistente = AperturaCaja::where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->first();

            if ($cajaExistente) {
                return back()->withErrors([
                    'caja' => 'Ya tienes una caja abierta para el día de hoy.',
                ]);
            }

            // Verificar que la caja esté disponible
            $caja = Caja::findOrFail($request->caja_id);
            if (! $caja->activa) {
                return back()->withErrors([
                    'caja' => 'La caja seleccionada no está activa.',
                ]);
            }

            // Crear apertura de caja
            $apertura = AperturaCaja::create([
                'caja_id' => $request->caja_id,
                'user_id' => $user->id,
                'fecha' => now(),
                'monto_apertura' => $request->monto_apertura,
                'observaciones' => $request->observaciones,
            ]);

            // Crear movimiento inicial si hay monto de apertura
            if ($request->monto_apertura > 0) {
                $tipoOperacion = TipoOperacionCaja::where('codigo', 'APERTURA')->first();

                if ($tipoOperacion) {
                    MovimientoCaja::create([
                        'caja_id' => $request->caja_id,
                        'tipo_operacion_id' => $tipoOperacion->id,
                        'numero_documento' => 'APERTURA-'.date('Ymd').'-'.$user->id,
                        'descripcion' => 'Apertura de caja - '.$caja->nombre,
                        'monto' => $request->monto_apertura,
                        'fecha' => now(),
                        'user_id' => $user->id,
                    ]);
                }
            }

            DB::commit();

            Log::info('Caja abierta exitosamente', [
                'user_id' => $user->id,
                'caja_id' => $request->caja_id,
                'monto_apertura' => $request->monto_apertura,
            ]);

            return back()->with('success', 'Caja abierta exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error abriendo caja: '.$e->getMessage());

            return back()->withErrors([
                'caja' => 'Error al abrir la caja. Intenta nuevamente.',
            ]);
        }
    }

    /**
     * Cerrar caja del día actual
     */
    public function cerrarCaja(Request $request)
    {
        $request->validate([
            'monto_real' => 'required|numeric|min:0',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            // Buscar apertura de caja del día
            $apertura = AperturaCaja::where('user_id', $user->id)
                ->whereDate('fecha', today())
                ->whereDoesntHave('cierre')
                ->first();

            if (! $apertura) {
                return back()->withErrors([
                    'caja' => 'No tienes una caja abierta para cerrar hoy.',
                ]);
            }

            // Calcular monto esperado
            $montoEsperado = $this->calcularMontoEsperado($apertura);

            // Calcular diferencia
            $diferencia = $request->monto_real - $montoEsperado;

            // Crear cierre de caja
            $cierre = CierreCaja::create([
                'caja_id' => $apertura->caja_id,
                'user_id' => $user->id,
                'apertura_caja_id' => $apertura->id,
                'fecha' => now(),
                'monto_esperado' => $montoEsperado,
                'monto_real' => $request->monto_real,
                'diferencia' => $diferencia,
                'observaciones' => $request->observaciones,
            ]);

            // Si hay diferencia, crear movimiento de ajuste
            if ($diferencia != 0) {
                $tipoOperacion = TipoOperacionCaja::where('codigo', 'AJUSTE')->first();

                if ($tipoOperacion) {
                    MovimientoCaja::create([
                        'caja_id' => $apertura->caja_id,
                        'tipo_operacion_id' => $tipoOperacion->id,
                        'numero_documento' => 'AJUSTE-'.date('Ymd').'-'.$user->id,
                        'descripcion' => 'Ajuste por diferencia en cierre - '.($diferencia > 0 ? 'Sobrante' : 'Faltante'),
                        'monto' => $diferencia,
                        'fecha' => now(),
                        'user_id' => $user->id,
                    ]);
                }
            }

            DB::commit();

            Log::info('Caja cerrada exitosamente', [
                'user_id' => $user->id,
                'caja_id' => $apertura->caja_id,
                'monto_esperado' => $montoEsperado,
                'monto_real' => $request->monto_real,
                'diferencia' => $diferencia,
            ]);

            return back()->with('success', 'Caja cerrada exitosamente. Diferencia: '.number_format($diferencia, 2).' Bs.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error cerrando caja: '.$e->getMessage());

            return back()->withErrors([
                'caja' => 'Error al cerrar la caja. Intenta nuevamente.',
            ]);
        }
    }

    /**
     * Obtener estado actual de cajas
     */
    public function estadoCajas()
    {
        $cajas = Caja::activas()
            ->with(['aperturas' => function ($query) {
                $query->whereDate('fecha', today())
                    ->with(['usuario', 'cierre']);
            }])
            ->get()
            ->map(function ($caja) {
                $aperturaHoy = $caja->aperturas->first();

                return [
                    'id' => $caja->id,
                    'nombre' => $caja->nombre,
                    'ubicacion' => $caja->ubicacion,
                    'esta_abierta' => $aperturaHoy && ! $aperturaHoy->cierre,
                    'usuario_actual' => $aperturaHoy?->usuario?->name,
                    'monto_apertura' => $aperturaHoy?->monto_apertura,
                    'hora_apertura' => $aperturaHoy?->created_at?->format('H:i'),
                    'hora_cierre' => $aperturaHoy?->cierre?->created_at?->format('H:i'),
                ];
            });

        return response()->json($cajas);
    }

    /**
     * Obtener movimientos de caja del día
     */
    public function movimientosDia(Request $request)
    {
        $user = Auth::user();
        $fecha = $request->get('fecha', today());

        $apertura = AperturaCaja::where('user_id', $user->id)
            ->whereDate('fecha', $fecha)
            ->first();

        if (! $apertura) {
            return response()->json([
                'movimientos' => [],
                'total' => 0,
                'apertura' => null,
            ]);
        }

        $movimientos = MovimientoCaja::where('caja_id', $apertura->caja_id)
            ->where('user_id', $user->id)
            ->whereDate('fecha', $fecha)
            ->with('tipoOperacion')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'movimientos' => $movimientos,
            'total' => $movimientos->sum('monto'),
            'apertura' => $apertura,
        ]);
    }

    /**
     * Calcular monto esperado en caja
     */
    private function calcularMontoEsperado(AperturaCaja $apertura): float
    {
        // Monto inicial
        $montoEsperado = $apertura->monto_apertura;

        // Sumar todos los movimientos del día
        $totalMovimientos = MovimientoCaja::where('caja_id', $apertura->caja_id)
            ->where('user_id', $apertura->user_id)
            ->whereDate('fecha', $apertura->fecha)
            ->sum('monto');

        return $montoEsperado + $totalMovimientos;
    }
}
