# 📊 Datos de Ejemplo para Exposición

Seeder automatizado que crea datos realistas de un estudiante completo con perfil vocacional para presentaciones y demos.

---

## 📋 ¿Qué se crea?

El seeder **`DatosEjemploExposicionSeeder`** genera automáticamente:

### 👤 **ESTUDIANTE**
```
Nombre: Carlos Andrade Rodríguez
Email: carlos.andrade@estudiante.test
Usuario: carlos.andrade
Contraseña: password123
Grado: 6to de Secundaria, Sección A
Matrícula: 999001
Edad: 17 años
```

### 👨‍👩‍👧 **PADRE/TUTOR**
```
Nombre: Roberto Andrade López
Email: roberto.andrade@padre.test
Usuario: roberto.andrade
Contraseña: password123
Teléfono: +591 76123456
Relación: Padre del estudiante
```

### 👨‍🏫 **PROFESOR/ORIENTADOR**
```
Nombre: Laura Fernández García
Email: laura.fernandez@profesor.test
Usuario: laura.fernandez
Contraseña: password123
Especialidad: Orientación Vocacional
```

### 📋 **DATOS VOCACIONALES**
- ✅ **Test completado**: 60 respuestas coherentes
- ✅ **Perfil RIASEC**: Investigador (90%) + Social (85%)
- ✅ **Carrera predicha**: Ingeniería Informática (82% confianza)
- ✅ **Síntesis del agente**: Incluida y personalizada
- ✅ **Recomendaciones**: Tres carreras alternativas
- ✅ **Pasos siguientes**: Ruta de acción detallada
- ✅ **Fortalezas y áreas de mejora**: Identificadas

---

## 🚀 Cómo Ejecutar

### **OPCIÓN 1: Automático (Incluido en DatabaseSeeder)**

Se ejecuta automáticamente con el comando estándar:

```bash
php artisan migrate:fresh --seed
```

**Salida esperada:**
```
[6.5/6] Creando datos de ejemplo para exposición...
✓ Estudiante creado
✓ Padre creado
✓ Profesor creado
✓ Datos vocacionales listos
```

---

### **OPCIÓN 2: Manual (Ejecutar después)**

Si la base de datos ya está poblada y quieres crear/recrear solo estos datos:

```bash
php artisan db:seed --class=DatosEjemploExposicionSeeder
```

**Ventajas:**
- ✅ No afecta otros datos
- ✅ Se puede ejecutar múltiples veces (es idempotente)
- ✅ Rápido (< 5 segundos)

---

## 📱 Cómo Usar en la Exposición

### **1. Acceder como Estudiante**
```
URL: http://127.0.0.1:8000/vocacional
Email: carlos.andrade@estudiante.test
Contraseña: password123
```

**Qué verá:**
- Tab "Mi Perfil" → Síntesis completa del agente
- Tab "Recomendaciones" → 10 carreras recomendadas con análisis IA
- Tab "Resultados" → Detalle de test RIASEC completado

### **2. Acceder como Padre**
```
URL: http://127.0.0.1:8000/dashboard
Email: roberto.andrade@padre.test
Contraseña: password123
```

**Qué verá:**
- Panel de control del hijo (Carlos)
- Perfil vocacional del estudiante
- Historial de actividades

### **3. Acceder como Profesor**
```
URL: http://127.0.0.1:8000/dashboard
Email: laura.fernandez@profesor.test
Contraseña: password123
```

**Qué verá:**
- Panel de orientador
- Estudiantes a su cargo
- Análisis de perfiles vocacionales

---

## 🔄 Recrear Datos

Si necesitas resetear solo los datos de ejemplo (sin afectar otros registros):

```bash
# Opción 1: Eliminr y recrear solo este estudiante
php artisan tinker
# Dentro de tinker:
App\Models\User::where('email', 'carlos.andrade@estudiante.test')->delete();
exit;

# Luego ejecutar:
php artisan db:seed --class=DatosEjemploExposicionSeeder
```

```bash
# Opción 2: Recrear toda la BD (más limpio)
php artisan migrate:fresh --seed
```

---

## 📊 Estructura de Datos

### **Respuestas de Test**
Las respuestas están diseñadas para generar un perfil coherente:
- **Investigador**: 90% (Verdadero/Neutral)
- **Social**: 85% (Verdadero)
- **Emprendedor**: 70% (Neutral/Verdadero)
- **Convencional**: 50% (Neutral)
- **Artístico**: 30% (Falso)
- **Realista**: 40% (Falso/Neutral)

### **Habilidades Reflejadas**
```
- Razonamiento lógico: 85/100
- Comprensión verbal: 80/100
- Habilidades numéricas: 88/100
- Pensamiento crítico: 82/100
- Programación: 75/100
```

### **Personalidad**
```
- Analítico: Alto
- Líder: Medio-Alto
- Creativo: Bajo
- Detallista: Alto
- Flexible: Medio
```

---

## 💡 Tips para la Exposición

### **Puntos Destacables:**
1. **Síntesis Inteligente**: Muestra cómo la IA genera análisis personalizados
2. **Recomendaciones Contextualizadas**: El agente analiza cada carrera individualmente
3. **Datos Coherentes**: El perfil ML (82% confianza) se alinea con intereses
4. **Respuestas Reales**: Las 60 preguntas representan un test completo

### **Screenshots Recomendados:**
- ✅ Tab "Mi Perfil" con síntesis visible
- ✅ Tab "Recomendaciones" con cards de carreras
- ✅ Detalles de una carrera con justificación IA
- ✅ Gráficos de intereses RIASEC (si disponibles)

### **Script de Demostración:**
```
1. "Este es Carlos, estudiante de 6to de secundaria"
2. "Completó un test vocacional con 60 preguntas"
3. "La IA analizó sus respuestas y predijo Ingeniería Informática"
4. "Aquí está su síntesis personalizada..."
5. "Y estas son las 10 carreras recomendadas con justificaciones IA"
```

---

## 🛠️ Troubleshooting

### **Error: "Matrícula duplicada"**
- La matrícula 999001 ya existe
- Solución: Ejecutar `php artisan migrate:fresh --seed` o cambiar el número

### **Error: "Email ya existe"**
- El estudiante ya fue creado
- Solución: Es normal, el seeder es idempotente (no crea duplicados)

### **Error: "Test no encontrado"**
- No hay tests RIASEC en la BD
- Solución: Asegúrate que `migrate:fresh --seed` se ejecutó completamente

---

## 📝 Archivo del Seeder

**Ubicación:** `database/seeders/DatosEjemploExposicionSeeder.php`

**Métodos principales:**
- `crearEstudiante()` - Crea usuario estudiante
- `crearPadre()` - Crea usuario padre
- `crearProfesor()` - Crea usuario profesor
- `generarRespuestasCoherentes()` - Genera respuestas coherentes al test
- `crearResultadoTest()` - Almacena resultado del test
- `crearPerfilVocacional()` - Crea perfil con síntesis completa
- `mostrarResumen()` - Imprime resumen de lo creado

---

## ✅ Checklist para Exposición

- [ ] Ejecutar `php artisan migrate:fresh --seed`
- [ ] Verificar que se crearon los datos (ver consola)
- [ ] Acceder como estudiante carlos.andrade@estudiante.test
- [ ] Verificar tab "Mi Perfil" muestra síntesis
- [ ] Verificar tab "Recomendaciones" muestra 10 carreras
- [ ] Verificar que cada carrera tiene justificación IA
- [ ] Tomar screenshots de los puntos clave
- [ ] Preparar narrativa de la demostración

---

**¡Listo para la exposición! 🎓✨**

Creado: 2025-12-01
Última actualización: 2025-12-01
