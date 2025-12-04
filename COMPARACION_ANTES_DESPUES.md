# 🔄 Comparación Visual: Antes vs Después

## ReportesController::reportesRiesgo() - Línea 311-360

### ❌ ANTES (Incorrecto)

```php
public function reportesRiesgo()
{
    try {
        $modulosSidebar = $this->getMenuItems();

        // ❌ PROBLEMA: Obtener TODOS los estudiantes
        $estudiantes = User::where('tipo_usuario', 'estudiante')->get();

        $predicciones_riesgo = [];
        $estudiantes_mayor_riesgo = [];
        $anomalias_por_estudiante = [];

        // ❌ PROBLEMA: Iterar y generar predicciones ON-DEMAND
        foreach ($estudiantes as $estudiante) {
            try {
                // ❌ PROBLEMA: Llamar a servicio externo para cada estudiante
                $pred = $this->mlService->predictStudent($estudiante);

                if ($pred['success'] && isset($pred['predictions']['risk'])) {
                    $riesgo = $pred['predictions']['risk'];
                    $score = $riesgo['score_riesgo'] ?? 0;
                    $nivel = $riesgo['nivel_riesgo'] ?? 'medio';

                    $predicciones_riesgo[] = [
                        'estudiante_id' => $estudiante->id,
                        'nombre' => $estudiante->nombre_completo,
                        'score_riesgo' => round($score, 3),
                        'nivel_riesgo' => $nivel,
                        'confianza' => round($riesgo['confianza'] ?? 0, 3),
                        'escalado_anomalia' => $riesgo['anomaly_escalation'] ?? false,
                        'razon_escalada' => $riesgo['escalation_reason'] ?? null,
                    ];

                    if ($nivel === 'alto') {
                        $estudiantes_mayor_riesgo[] = [...];
                    }
                }
                // ❌ PROBLEMA: Si falla, no hay registro del error
                // El array se queda vacío silenciosamente
            } catch (\Exception $e) {
                Log::warning("Error prediciendo riesgo para estudiante {$estudiante->id}: {$e->getMessage()}");
                // ❌ Continúa iterando pero sin retornar nada
            }
        }
```

**Problemas:**
- Itera TODOS los estudiantes (ineficiente)
- Genera predicciones on-demand para CADA uno
- Si falla el servicio → array vacío
- Fallos silenciosos → usuario ve nada
- O(n) complejidad de tiempo

---

### ✅ DESPUÉS (Correcto)

```php
public function reportesRiesgo()
{
    try {
        $modulosSidebar = $this->getMenuItems();

        // ✅ SOLUCIÓN: Leer DIRECTAMENTE de PrediccionRiesgo
        // Una sola query que trae todos los datos que necesitamos
        $predicciones_bd = \App\Models\PrediccionRiesgo::with('estudiante')
            ->orderBy('score_riesgo', 'desc')
            ->get();

        $predicciones_riesgo = [];
        $estudiantes_mayor_riesgo = [];

        // ✅ SOLUCIÓN: Iterar predicciones que YA EXISTEN en BD
        foreach ($predicciones_bd as $pred) {
            $estudiante = $pred->estudiante;

            // ✅ Validar que estudiante existe
            if (!$estudiante) {
                continue;
            }

            // ✅ Leer directamente de BD, no generar
            $score = $pred->score_riesgo ?? 0;
            $nivel = $pred->nivel_riesgo ?? 'medio';

            $predicciones_riesgo[] = [
                'estudiante_id' => $estudiante->id,
                'nombre' => $estudiante->nombre_completo,
                'score_riesgo' => round($score, 3),
                'nivel_riesgo' => $nivel,
                'confianza' => round($pred->confianza ?? 0, 3),
                'escalado_anomalia' => false,
                'razon_escalada' => null,
            ];

            // ✅ Detectar estudiantes de alto riesgo
            if ($nivel === 'alto') {
                $estudiantes_mayor_riesgo[] = [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->nombre_completo,
                    'score_riesgo' => round($score, 3),
                    'confianza' => round($pred->confianza ?? 0, 3),
                    'razon' => 'Riesgo detectado por modelo supervisado',
                ];
            }
        }
```

**Ventajas:**
- ✅ Una sola query a BD
- ✅ Datos garantizados si existen
- ✅ No depende de servicios externos
- ✅ Más rápido (O(1) en BD)
- ✅ Mantenible (acoplamiento reducido)

---

## 📊 Diferencias Clave

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Fuente de Datos** | MLIntegrationService (on-demand) | PrediccionRiesgo (BD) |
| **Número de Queries** | Potencialmente N+1 (N estudiantes + N servicios) | 1 query |
| **Confiabilidad** | Depende de servicio externo | Garantizado si existe en BD |
| **Eficiencia** | O(n) predicciones | O(1) lectura de BD |
| **Mantenibilidad** | Acoplado a MLIntegrationService | Independiente |
| **Resultado si Falla** | Array vacío (fallo silencioso) | Retorna lo que existe en BD |
| **Datos Mostrados** | 0 (si falla el servicio) | 88 (los que existen) |

---

## 🔄 Flujo Completo Comparado

### Antes ❌
```
Navegador accede a /reportes/riesgo
    ↓
ReportesController::reportesRiesgo()
    ↓
User::where('tipo_usuario', 'estudiante')->get()  [N estudiantes]
    ↓
FOR EACH estudiante:
    ├─ mlService->predictStudent($estudiante)  [SERVICIO EXTERNO]
    └─ IF falla → error silencioso → array vacío
    ↓
React recibe datos = []
    ↓
Pantalla VACÍA ❌
```

### Después ✅
```
Navegador accede a /reportes/riesgo
    ↓
ReportesController::reportesRiesgo()
    ↓
PrediccionRiesgo::with('estudiante')->get()  [1 QUERY]
    ↓
FOR EACH predicción en BD:
    ├─ Lee score_riesgo ✓
    ├─ Lee nivel_riesgo ✓
    ├─ Lee confianza ✓
    └─ Lee data del estudiante via relación ✓
    ↓
React recibe datos = 88 predicciones
    ↓
Pantalla LLENA DE DATOS ✅
```

---

## 🧮 Ejemplo de Ejecución

### Antes ❌
```
Estudiantes en BD: 1000
PrediccionRiesgo en BD: 88

Ejecución:
1. User::where('tipo_usuario', 'estudiante') → 1000 registros
2. Itera 1000 estudiantes
3. Para cada uno llama MLService->predictStudent()
4. MLService intenta generar predicciones
5. Si falla en paso 3,4,5 → error → array vacío
6. React recibe: [] (vacío)
7. Usuario ve: NADA
```

### Después ✅
```
Estudiantes en BD: 1000
PrediccionRiesgo en BD: 88

Ejecución:
1. PrediccionRiesgo::with('estudiante')->get() → 88 registros
2. Itera 88 predicciones
3. Extrae datos de cada una
4. React recibe: 88 predicciones con todos los datos
5. Usuario ve: GRÁFICOS LLENOS
```

---

## 🎯 El Cambio Crítico

**Una línea cambió TODO:**

❌ Antes:
```php
$pred = $this->mlService->predictStudent($estudiante);
```

✅ Después:
```php
$predicciones_bd = \App\Models\PrediccionRiesgo::with('estudiante')->get();
```

De "generar dinámicamente" → "leer de BD"

---

## ✅ Validación

Ambas versiones tienen el MISMO OUTPUT esperado:
```php
return Inertia::render('reportes/ReportesRiesgo', [
    'estadisticas_riesgo' => [...],
    'distribucion_riesgo' => [...],
    'tendencias' => [...],
    'estudiantes_mayor_riesgo' => [...],
    'modulosSidebar' => [...],
]);
```

Pero:
- ❌ **Antes:** props vacíos porque la lógica fallaba
- ✅ **Después:** props llenos porque lee directamente de BD

---

**Conclusión:**
El problema no era la estructura de datos ni el React.
El problema era que el controlador intentaba generar algo que YA EXISTÍA en la BD en lugar de simplemente LEERLO.

