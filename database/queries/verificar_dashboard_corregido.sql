-- ============================================================================
-- QUERIES DE VERIFICACIÓN POST-CORRECCIÓN
-- Estas queries permiten verificar que el dashboard muestra datos coherentes
-- ============================================================================

-- ============================================================================
-- VERIFICACIÓN 1: ESTUDIANTES ACTIVOS VS MOSTRADOS
-- Compara lo que el dashboard debería mostrar vs datos reales
-- ============================================================================
SELECT
    'VERIFICACIÓN 1: Estudiantes Activos Correctos' AS tipo;

SELECT
    u.name as profesor,
    cu.nombre as curso,
    COUNT(DISTINCT CASE WHEN ce.estado = 'activo' THEN ce.estudiante_id END) as estudiantes_activos_correcto,
    COUNT(DISTINCT ce.estudiante_id) as estudiantes_totales_erroneo
FROM users u
LEFT JOIN cursos cu ON u.id = cu.profesor_id
LEFT JOIN curso_estudiante ce ON cu.id = ce.curso_id
WHERE u.id IN (SELECT DISTINCT profesor_id FROM cursos)
GROUP BY u.id, cu.id, u.name, cu.nombre
ORDER BY u.name, cu.nombre;

-- ============================================================================
-- VERIFICACIÓN 2: TAREAS PENDIENTES - VALIDAR COHERENCIA
-- Mostrar EXACTAMENTE qué tareas se cuentan como pendientes
-- ============================================================================
SELECT
    'VERIFICACIÓN 2: Tareas Pendientes Coherentes' AS tipo;

SELECT
    u.name as profesor,
    cu.nombre as curso,
    c.titulo as tarea,
    COUNT(DISTINCT CASE
        WHEN c.tipo = 'tarea'
        AND c.estado = 'publicado'
        AND t.estado = 'entregado'
        AND cal.id IS NULL
        THEN t.id
    END) as tareas_pendientes_revision,
    COUNT(DISTINCT t.id) as total_trabajos
FROM users u
LEFT JOIN cursos cu ON u.id = cu.profesor_id
LEFT JOIN contenidos c ON cu.id = c.curso_id
LEFT JOIN trabajos t ON c.id = t.contenido_id
LEFT JOIN calificaciones cal ON t.id = cal.trabajo_id
WHERE u.id IN (SELECT DISTINCT profesor_id FROM cursos)
GROUP BY u.id, cu.id, c.id, u.name, cu.nombre, c.titulo
HAVING tareas_pendientes_revision > 0
ORDER BY u.name, cu.nombre;

-- ============================================================================
-- VERIFICACIÓN 3: EVALUACIONES ACTIVAS - VALIDAR QUE SEAN PUBLICADAS
-- ============================================================================
SELECT
    'VERIFICACIÓN 3: Evaluaciones Activas Publicadas' AS tipo;

SELECT
    u.name as profesor,
    cu.nombre as curso,
    c.titulo as evaluacion,
    c.estado as contenido_estado,
    c.fecha_limite,
    COUNT(DISTINCT e.id) as evaluaciones_contadas
FROM users u
LEFT JOIN cursos cu ON u.id = cu.profesor_id
LEFT JOIN contenidos c ON cu.id = c.curso_id
LEFT JOIN evaluaciones e ON c.id = e.contenido_id
WHERE u.id IN (SELECT DISTINCT profesor_id FROM cursos)
  AND c.tipo = 'evaluacion'
  AND c.estado = 'publicado'
  AND c.fecha_limite >= CURDATE()
GROUP BY u.id, cu.id, c.id, u.name, cu.nombre, c.titulo, c.estado, c.fecha_limite
ORDER BY u.name, cu.nombre;

-- ============================================================================
-- VERIFICACIÓN 4: TRABAJOS CALIFICADOS - ÚLTIMOS 7 DÍAS
-- Mostrar trabajos que tienen calificación (método correcto)
-- ============================================================================
SELECT
    'VERIFICACIÓN 4: Trabajos Calificados Últimos 7 Días' AS tipo;

SELECT
    u.name as profesor,
    COUNT(DISTINCT CASE
        WHEN cal.id IS NOT NULL
        AND cal.updated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        THEN t.id
    END) as trabajos_calificados_7dias,
    COUNT(DISTINCT t.id) as total_trabajos_profesor
FROM users u
LEFT JOIN contenidos c ON u.id = c.creador_id
LEFT JOIN trabajos t ON c.id = t.contenido_id
LEFT JOIN calificaciones cal ON t.id = cal.trabajo_id
WHERE u.id IN (SELECT DISTINCT profesor_id FROM cursos)
GROUP BY u.id, u.name
ORDER BY profesor;

-- ============================================================================
-- VERIFICACIÓN 5: RESUMEN COMPLETO POR PROFESOR
-- Dashboard correcto para cada profesor
-- ============================================================================
SELECT
    'VERIFICACIÓN 5: Resumen Completo - Dashboard Correcto' AS tipo;

SELECT
    u.id,
    u.name as profesor,
    -- Estadísticas correctas
    COUNT(DISTINCT cu.id) as total_cursos_correcto,
    COUNT(DISTINCT CASE WHEN ce.estado = 'activo' THEN ce.estudiante_id END) as total_estudiantes_activos,
    COUNT(DISTINCT CASE
        WHEN c.tipo = 'tarea'
        AND c.estado = 'publicado'
        AND t.estado = 'entregado'
        AND cal.id IS NULL
        THEN t.id
    END) as tareas_pendientes_revision,
    COUNT(DISTINCT CASE
        WHEN c.tipo = 'evaluacion'
        AND c.estado = 'publicado'
        AND c.fecha_limite >= CURDATE()
        THEN e.id
    END) as evaluaciones_activas,
    COUNT(DISTINCT CASE
        WHEN cal.id IS NOT NULL
        AND cal.updated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        THEN t.id
    END) as trabajos_calificados_7dias,
    COUNT(DISTINCT CASE
        WHEN c.tipo = 'tarea'
        AND c.estado = 'publicado'
        AND tar.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        THEN c.id
    END) as tareas_creadas_7dias
FROM users u
LEFT JOIN cursos cu ON u.id = cu.profesor_id
LEFT JOIN curso_estudiante ce ON cu.id = ce.curso_id
LEFT JOIN contenidos c ON cu.id = c.curso_id
LEFT JOIN trabajos t ON c.id = t.contenido_id
LEFT JOIN calificaciones cal ON t.id = cal.trabajo_id
LEFT JOIN evaluaciones e ON c.id = e.contenido_id AND c.tipo = 'evaluacion'
LEFT JOIN tareas tar ON c.id = tar.contenido_id
WHERE u.id IN (SELECT DISTINCT profesor_id FROM cursos)
GROUP BY u.id, u.name
ORDER BY profesor;

-- ============================================================================
-- VERIFICACIÓN 6: ALERTAS DE INCONSISTENCIAS CRÍTICAS
-- Mostrar datos que podrían causar problemas
-- ============================================================================
SELECT
    'VERIFICACIÓN 6: Alertas - Datos Inconsistentes' AS tipo;

-- A. Trabajos sin fecha_entrega pero entregados
SELECT
    'ALERTA: Trabajo entregado sin fecha_entrega' as alerta,
    t.id as trabajo_id,
    u.name as estudiante,
    c.titulo as tarea
FROM trabajos t
JOIN users u ON t.estudiante_id = u.id
JOIN contenidos c ON t.contenido_id = c.id
WHERE t.estado = 'entregado' AND t.fecha_entrega IS NULL
LIMIT 10;

-- B. Calificaciones sin evaluador
SELECT
    'ALERTA: Calificación sin evaluador' as alerta,
    cal.id as calificacion_id,
    t.id as trabajo_id
FROM calificaciones cal
LEFT JOIN users u ON cal.evaluador_id = u.id
JOIN trabajos t ON cal.trabajo_id = t.id
WHERE u.id IS NULL
LIMIT 10;

-- C. Contenidos sin curso
SELECT
    'ALERTA: Contenido sin curso asignado' as alerta,
    c.id as contenido_id,
    c.titulo
FROM contenidos c
LEFT JOIN cursos cu ON c.curso_id = cu.id
WHERE cu.id IS NULL
LIMIT 10;

-- ============================================================================
-- VERIFICACIÓN 7: REPORTE DE CALIDAD DE DATOS
-- ============================================================================
SELECT
    'VERIFICACIÓN 7: Reporte de Calidad de Datos' AS tipo;

SELECT
    'Total Profesores' as metrica,
    COUNT(DISTINCT profesor_id) as valor
FROM cursos
UNION ALL
SELECT 'Total Cursos', COUNT(*) FROM cursos
UNION ALL
SELECT 'Total Estudiantes Registrados', COUNT(DISTINCT estudiante_id) FROM curso_estudiante
UNION ALL
SELECT 'Total Estudiantes Activos', COUNT(*) FROM curso_estudiante WHERE estado = 'activo'
UNION ALL
SELECT 'Total Contenidos', COUNT(*) FROM contenidos
UNION ALL
SELECT 'Total Trabajos', COUNT(*) FROM trabajos
UNION ALL
SELECT 'Total Trabajos Entregados', COUNT(*) FROM trabajos WHERE estado = 'entregado'
UNION ALL
SELECT 'Total Calificaciones', COUNT(*) FROM calificaciones
UNION ALL
SELECT 'Total Evaluaciones', COUNT(*) FROM evaluaciones
UNION ALL
SELECT 'Contenidos Publicados', COUNT(*) FROM contenidos WHERE estado = 'publicado'
UNION ALL
SELECT 'Contenidos Borrador', COUNT(*) FROM contenidos WHERE estado = 'borrador'
UNION ALL
SELECT 'Trabajos Sin Calificar', COUNT(*) FROM trabajos t
    WHERE estado = 'entregado' AND NOT EXISTS (SELECT 1 FROM calificaciones WHERE trabajo_id = t.id);

-- ============================================================================
-- FIN DEL SCRIPT DE VERIFICACIÓN
-- ============================================================================
