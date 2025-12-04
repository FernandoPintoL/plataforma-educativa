-- ============================================================================
-- SCRIPT DE VALIDACIÓN - COHERENCIA DE DATOS DEL DASHBOARD DEL PROFESOR
-- ============================================================================
-- Este script valida que todos los datos mostrados en el dashboard sean coherentes
-- con lo registrado en la base de datos.
-- ============================================================================

-- 1. VALIDAR EVALUACIONES ACTIVAS
-- Buscar evaluaciones que se cuentan como "activas" pero NO están publicadas
-- ============================================================================
SELECT 'PROBLEMA 1: Evaluaciones activas sin estado publicado' AS validacion;

SELECT
    e.id,
    c.titulo,
    c.estado,
    c.fecha_limite,
    u.name as profesor,
    'DEBE ESTAR PUBLICADA' as problema
FROM evaluaciones e
JOIN contenidos c ON e.contenido_id = c.id
JOIN cursos cu ON c.curso_id = cu.id
JOIN users u ON cu.profesor_id = u.id
WHERE c.estado != 'publicado'
  AND c.fecha_limite >= CURDATE()
LIMIT 20;

-- Mostrar resumen por profesor
SELECT
    u.name as profesor,
    COUNT(*) as evaluaciones_no_publicadas_activas,
    GROUP_CONCAT(c.titulo, ', ') as titulos
FROM evaluaciones e
JOIN contenidos c ON e.contenido_id = c.id
JOIN cursos cu ON c.curso_id = cu.id
JOIN users u ON cu.profesor_id = u.id
WHERE c.estado != 'publicado'
  AND c.fecha_limite >= CURDATE()
GROUP BY u.id, u.name;

-- ============================================================================
-- 2. VALIDAR ESTUDIANTES ACTIVOS
-- Buscar estudiantes contados como "activos" pero con estado inactivo/abandonado
-- ============================================================================
SELECT 'PROBLEMA 2: Estudiantes inactivos siendo contados' AS validacion;

SELECT
    cu.id as curso_id,
    cu.nombre as curso,
    u_prof.name as profesor,
    COUNT(CASE WHEN ce.estado = 'activo' THEN 1 END) as estudiantes_activos,
    COUNT(CASE WHEN ce.estado != 'activo' THEN 1 END) as estudiantes_inactivos,
    COUNT(*) as total_todos
FROM cursos cu
JOIN curso_estudiante ce ON cu.id = ce.curso_id
JOIN users u_prof ON cu.profesor_id = u_prof.id
GROUP BY cu.id, cu.nombre, u_prof.id, u_prof.name
HAVING estudiantes_inactivos > 0
ORDER BY profesor, curso;

-- ============================================================================
-- 3. VALIDAR TAREAS PENDIENTES DE REVISIÓN
-- Buscar tareas sin estado publicado que cuentan como pendientes
-- ============================================================================
SELECT 'PROBLEMA 3: Tareas pendientes sin validar estado del contenido' AS validacion;

SELECT
    t.id as trabajo_id,
    c.titulo as tarea,
    c.estado as contenido_estado,
    c.tipo,
    c.fecha_limite,
    t.estado as trabajo_estado,
    u_est.name as estudiante,
    u_prof.name as profesor,
    'DEBERÍA VALIDAR QUE CONTENIDO SEA PUBLICADO' as problema
FROM trabajos t
JOIN contenidos c ON t.contenido_id = c.id
JOIN cursos cu ON c.curso_id = cu.id
JOIN users u_est ON t.estudiante_id = u_est.id
JOIN users u_prof ON cu.profesor_id = u_prof.id
WHERE c.tipo = 'tarea'
  AND c.estado != 'publicado'
  AND t.estado = 'entregado'
  AND NOT EXISTS (SELECT 1 FROM calificaciones WHERE trabajo_id = t.id)
LIMIT 20;

-- ============================================================================
-- 4. VALIDAR TRABAJOS EN ESTADO 'calificado' SIN CALIFICACIÓN
-- Inconsistencia: trabajo dice estar calificado pero no tiene calificación
-- ============================================================================
SELECT 'PROBLEMA 4: Trabajos en estado calificado sin calificación' AS validacion;

SELECT
    t.id as trabajo_id,
    c.titulo,
    t.estado as trabajo_estado,
    u_est.name as estudiante,
    u_prof.name as profesor,
    'RIESGO: Trabajo dice estar calificado pero NO tiene registro de calificación' as problema,
    COUNT(cal.id) as calificaciones_registradas
FROM trabajos t
LEFT JOIN calificaciones cal ON t.id = cal.trabajo_id
JOIN contenidos c ON t.contenido_id = c.id
JOIN cursos cu ON c.curso_id = cu.id
JOIN users u_est ON t.estudiante_id = u_est.id
JOIN users u_prof ON cu.profesor_id = u_prof.id
WHERE t.estado = 'calificado'
  AND cal.id IS NULL
GROUP BY t.id, c.titulo, t.estado, u_est.name, u_prof.name
LIMIT 20;

-- ============================================================================
-- 5. VALIDAR INTEGRIDAD DE RELACIONES
-- Trabajos huérfanos, contenidos sin curso, etc.
-- ============================================================================
SELECT 'PROBLEMA 5: Trabajos sin contenido válido' AS validacion;

SELECT
    t.id as trabajo_id,
    t.contenido_id,
    u.name as estudiante,
    'RIESGO: Trabajo referencia contenido inexistente' as problema
FROM trabajos t
LEFT JOIN contenidos c ON t.contenido_id = c.id
JOIN users u ON t.estudiante_id = u.id
WHERE c.id IS NULL;

-- ============================================================================
-- 6. REPORTE DE SALUD DEL DASHBOARD
-- Mostrar números CORRECTOS vs números MOSTRADOS
-- ============================================================================
SELECT 'REPORTE DE SALUD - NÚMEROS CORRECTOS VS MOSTRADOS' AS seccion;

-- Por cada profesor
SELECT
    u.id,
    u.name as profesor,
    COUNT(DISTINCT cu.id) as total_cursos,
    COUNT(DISTINCT CASE WHEN ce.estado = 'activo' THEN ce.estudiante_id END) as estudiantes_realmente_activos,
    COUNT(DISTINCT ce.estudiante_id) as estudiantes_mostrados_actualmente,
    COUNT(DISTINCT CASE WHEN t.estado = 'entregado' AND cal.id IS NULL AND c.tipo = 'tarea' AND c.estado = 'publicado' THEN t.id END) as tareas_realmente_pendientes,
    COUNT(DISTINCT CASE WHEN e.id IS NOT NULL AND c.estado = 'publicado' AND c.fecha_limite >= CURDATE() THEN e.id END) as evaluaciones_realmente_activas
FROM users u
LEFT JOIN cursos cu ON u.id = cu.profesor_id
LEFT JOIN curso_estudiante ce ON cu.id = ce.curso_id
LEFT JOIN contenidos c ON cu.id = c.curso_id
LEFT JOIN trabajos t ON c.id = t.contenido_id
LEFT JOIN calificaciones cal ON t.id = cal.trabajo_id
LEFT JOIN evaluaciones e ON c.id = e.contenido_id
WHERE u.role = 'profesor' OR u.roles LIKE '%profesor%'
GROUP BY u.id, u.name
ORDER BY profesor;

-- ============================================================================
-- 7. AUDIT LOG - INCONSISTENCIAS CRÍTICAS
-- ============================================================================
SELECT 'INCONSISTENCIAS CRÍTICAS ENCONTRADAS' AS tipo;

-- Trabajos con fecha_entrega NULL pero estado 'entregado'
SELECT
    t.id,
    'Trabajo entregado sin fecha_entrega' as problema,
    u.name as estudiante
FROM trabajos t
JOIN users u ON t.estudiante_id = u.id
WHERE t.estado = 'entregado' AND t.fecha_entrega IS NULL;

-- Calificaciones sin evaluador
SELECT
    cal.id,
    'Calificación sin evaluador asignado' as problema,
    t.id as trabajo_id
FROM calificaciones cal
LEFT JOIN users u ON cal.evaluador_id = u.id
JOIN trabajos t ON cal.trabajo_id = t.id
WHERE u.id IS NULL;

-- Contenidos con fecha_limite pasada pero estado 'publicado'
SELECT
    c.id,
    c.titulo,
    c.fecha_limite,
    'Contenido expirado pero aún publicado' as problema,
    u.name as profesor
FROM contenidos c
JOIN users u ON c.creador_id = u.id
WHERE c.fecha_limite < CURDATE()
  AND c.estado = 'publicado'
  AND c.tipo IN ('tarea', 'evaluacion')
LIMIT 20;

-- ============================================================================
-- FIN DEL SCRIPT DE VALIDACIÓN
-- ============================================================================
