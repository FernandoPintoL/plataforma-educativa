-- ==============================================================================
-- VALIDACIONES DE ARQUITECTURA DE ROLES Y MÓDULOS
-- ==============================================================================
--
-- Ejecuta estas queries para verificar que todo está configurado correctamente.
-- Copia y pega en: php artisan tinker o una herramienta SQL
--
-- ==============================================================================

-- ============================================
-- 1. VERIFICAR TABLA role_modulo_acceso
-- ============================================
SELECT
    COUNT(*) AS total_registros,
    COUNT(DISTINCT role_id) AS roles_unicos,
    COUNT(DISTINCT modulo_sidebar_id) AS modulos_unicos
FROM role_modulo_acceso;

-- Resultado esperado:
-- total_registros: 60+ (dependiendo de cantidad de módulos)
-- roles_unicos: 7 (admin, director, profesor, estudiante, padre, coordinador, tutor)
-- modulos_unicos: 15-20 (módulos principales + submódulos)


-- ============================================
-- 2. VER MÓDULOS VISIBLES POR CADA ROL
-- ============================================
SELECT
    r.name AS rol,
    COUNT(rma.id) AS modulos_visibles,
    GROUP_CONCAT(ms.titulo SEPARATOR ', ') AS modulos
FROM role_modulo_acceso rma
JOIN roles r ON rma.role_id = r.id
JOIN modulos_sidebar ms ON rma.modulo_sidebar_id = ms.id
WHERE rma.visible = true
GROUP BY r.id, r.name
ORDER BY modulos_visibles DESC;

-- Resultado esperado (matriz):
-- admin:       16+ (TODOS)
-- director:    11-12
-- profesor:    8-9
-- coordinador: 7-8
-- estudiante:  9
-- padre:       7
-- tutor:       6


-- ============================================
-- 3. MÓDULOS QUE VE ESTUDIANTE
-- ============================================
SELECT
    ms.titulo,
    ms.ruta,
    ms.descripcion,
    rma.visible
FROM role_modulo_acceso rma
JOIN roles r ON rma.role_id = r.id
JOIN modulos_sidebar ms ON rma.modulo_sidebar_id = ms.id
WHERE r.name = 'estudiante'
AND rma.visible = true
ORDER BY ms.orden;

-- Resultado esperado (debe INCLUIR):
-- ✓ Inicio
-- ✓ Mi Perfil
-- ✓ Mis Cursos
-- ✓ Tareas
-- ✓ Calificaciones
-- ✓ Evaluaciones
-- ✓ Contenido Educativo
-- ✓ Recursos
-- ✓ Entregas

-- Resultado esperado (debe EXCLUIR):
-- ✗ Gestionar Estudiantes
-- ✗ Gestionar Profesores
-- ✗ Administración


-- ============================================
-- 4. MÓDULOS QUE VE DIRECTOR
-- ============================================
SELECT
    ms.titulo,
    ms.ruta,
    rma.visible
FROM role_modulo_acceso rma
JOIN roles r ON rma.role_id = r.id
JOIN modulos_sidebar ms ON rma.modulo_sidebar_id = ms.id
WHERE r.name = 'director'
AND rma.visible = true
ORDER BY ms.orden;

-- Resultado esperado:
-- ✓ Gestionar Estudiantes (diferente a estudiante)
-- ✓ Gestionar Profesores (diferente a profesor)
-- ✓ Administración
-- ✓ Reportes


-- ============================================
-- 5. DIFERENCIA: MÓDULOS DIRECTOR vs ESTUDIANTE
-- ============================================
SELECT
    ms.titulo,
    'DIRECTOR' AS rol
FROM role_modulo_acceso rma
JOIN roles r ON rma.role_id = r.id
JOIN modulos_sidebar ms ON rma.modulo_sidebar_id = ms.id
WHERE r.name = 'director'
AND rma.visible = true
AND ms.id NOT IN (
    SELECT rma2.modulo_sidebar_id
    FROM role_modulo_acceso rma2
    JOIN roles r2 ON rma2.role_id = r2.id
    WHERE r2.name = 'estudiante'
    AND rma2.visible = true
)
ORDER BY ms.titulo;

-- Resultado esperado:
-- Gestionar Estudiantes
-- Gestionar Profesores
-- Administración
-- Reportes


-- ============================================
-- 6. PERMISOS DE ESTUDIANTE (Spatie)
-- ============================================
SELECT
    p.name AS permiso
FROM role_has_permissions rhp
JOIN roles r ON rhp.role_id = r.id
JOIN permissions p ON rhp.permission_id = p.id
WHERE r.name = 'estudiante'
ORDER BY p.name;

-- Resultado esperado (debe INCLUIR):
-- ✓ estudiantes.historial
-- ✓ estudiantes.inscripciones
-- ✓ tareas.entregar
-- ✓ tareas.index
-- ✓ tareas.show
-- ✓ cursos.index
-- ✓ calificaciones.index
-- ✓ contenido.ver
-- ✓ trabajos.entregar
-- ✓ recursos.descargar

-- Resultado esperado (debe EXCLUIR):
-- ✗ estudiantes.index        (NO ver listado de todos)
-- ✗ estudiantes.create       (NO crear estudiantes)
-- ✗ estudiantes.edit         (NO editar otros)
-- ✗ estudiantes.show         (NO ver detalles de otros)
-- ✗ tareas.create            (NO crear tareas)
-- ✗ tareas.calificar         (NO calificar)
-- ✗ trabajos.calificar       (NO calificar)


-- ============================================
-- 7. PERMISOS DE PROFESOR (Spatie)
-- ============================================
SELECT
    p.name AS permiso
FROM role_has_permissions rhp
JOIN roles r ON rhp.role_id = r.id
JOIN permissions p ON rhp.permission_id = p.id
WHERE r.name = 'profesor'
AND p.name LIKE 'estudiantes.%'
ORDER BY p.name;

-- Resultado esperado:
-- ✗ profesor NO tiene 'estudiantes.index'
-- ✗ profesor NO tiene 'estudiantes.create'
-- (profesor solo gestiona SUS estudiantes a través de cursos)


-- ============================================
-- 8. PERMISOS DIRECTOR vs ESTUDIANTE
-- ============================================
SELECT
    p.name AS permiso,
    CASE WHEN rhp2.id IS NOT NULL THEN 'SÍ' ELSE 'NO' END AS director,
    CASE WHEN rhp3.id IS NOT NULL THEN 'SÍ' ELSE 'NO' END AS estudiante
FROM permissions p
LEFT JOIN role_has_permissions rhp2 ON p.id = rhp2.permission_id
    AND rhp2.role_id = (SELECT id FROM roles WHERE name = 'director')
LEFT JOIN role_has_permissions rhp3 ON p.id = rhp3.permission_id
    AND rhp3.role_id = (SELECT id FROM roles WHERE name = 'estudiante')
WHERE p.name LIKE 'estudiantes.%'
ORDER BY p.name;

-- Resultado esperado:
-- Permiso                    | Director | Estudiante
-- estudiantes.create         | SÍ       | NO
-- estudiantes.destroy        | SÍ       | NO
-- estudiantes.edit           | SÍ       | NO
-- estudiantes.historial      | SÍ       | SÍ ✓
-- estudiantes.index          | SÍ       | NO
-- estudiantes.inscripciones  | SÍ       | SÍ ✓
-- estudiantes.show           | SÍ       | NO


-- ============================================
-- 9. VERIFICAR MÓDULOS NUEVOS CREADOS
-- ============================================
SELECT
    titulo,
    ruta,
    descripcion,
    orden
FROM modulos_sidebar
WHERE titulo IN ('Mi Perfil', 'Mis Cursos', 'Gestionar Estudiantes', 'Gestionar Profesores')
ORDER BY orden;

-- Resultado esperado:
-- ✓ Mi Perfil (nueva)
-- ✓ Mis Cursos (nueva)
-- ✓ Gestionar Estudiantes (renombrado de "Estudiantes")
-- ✓ Gestionar Profesores (renombrado de "Profesores")


-- ============================================
-- 10. USUARIOS DE PRUEBA
-- ============================================
SELECT
    u.id,
    u.name,
    u.email,
    u.tipo_usuario,
    r.name AS rol_spatie
FROM users u
JOIN model_has_roles mhr ON u.id = mhr.model_id
JOIN roles r ON mhr.role_id = r.id
WHERE u.tipo_usuario IN ('estudiante', 'director', 'profesor')
LIMIT 10;

-- Resultado esperado:
-- admin@paucara.test         | admin      | admin
-- director@paucara.test      | director   | director
-- estudiante1@paucara.test   | estudiante | estudiante
-- profesor1@paucara.test     | profesor   | profesor
-- padre1@paucara.test        | padre      | padre


-- ============================================
-- 11. VALIDAR INTEGRIDAD: NO HAY ORFANOS
-- ============================================
-- Verificar que no hay role_ids que no existan en roles
SELECT COUNT(*) AS orfanos_role_id
FROM role_modulo_acceso rma
LEFT JOIN roles r ON rma.role_id = r.id
WHERE r.id IS NULL;

-- Resultado esperado: 0

-- Verificar que no hay modulo_ids que no existan en modulos_sidebar
SELECT COUNT(*) AS orfanos_modulo_id
FROM role_modulo_acceso rma
LEFT JOIN modulos_sidebar ms ON rma.modulo_sidebar_id = ms.id
WHERE ms.id IS NULL;

-- Resultado esperado: 0


-- ============================================
-- 12. MATRIZ COMPLETA: QUÉ VE CADA ROL
-- ============================================
SELECT
    r.name AS rol,
    CASE WHEN rma1.id IS NOT NULL THEN 'SÍ' ELSE 'NO' END AS inicio,
    CASE WHEN rma2.id IS NOT NULL THEN 'SÍ' ELSE 'NO' END AS mi_perfil,
    CASE WHEN rma3.id IS NOT NULL THEN 'SÍ' ELSE 'NO' END AS mis_cursos,
    CASE WHEN rma4.id IS NOT NULL THEN 'SÍ' ELSE 'NO' END AS gestionar_estudiantes,
    CASE WHEN rma5.id IS NOT NULL THEN 'SÍ' ELSE 'NO' END AS administracion,
    CASE WHEN rma6.id IS NOT NULL THEN 'SÍ' ELSE 'NO' END AS reportes
FROM roles r
LEFT JOIN role_modulo_acceso rma1 ON r.id = rma1.role_id
    AND rma1.modulo_sidebar_id = (SELECT id FROM modulos_sidebar WHERE titulo = 'Inicio')
    AND rma1.visible = true
LEFT JOIN role_modulo_acceso rma2 ON r.id = rma2.role_id
    AND rma2.modulo_sidebar_id = (SELECT id FROM modulos_sidebar WHERE titulo = 'Mi Perfil')
    AND rma2.visible = true
LEFT JOIN role_modulo_acceso rma3 ON r.id = rma3.role_id
    AND rma3.modulo_sidebar_id = (SELECT id FROM modulos_sidebar WHERE titulo = 'Mis Cursos')
    AND rma3.visible = true
LEFT JOIN role_modulo_acceso rma4 ON r.id = rma4.role_id
    AND rma4.modulo_sidebar_id = (SELECT id FROM modulos_sidebar WHERE titulo = 'Gestionar Estudiantes')
    AND rma4.visible = true
LEFT JOIN role_modulo_acceso rma5 ON r.id = rma5.role_id
    AND rma5.modulo_sidebar_id = (SELECT id FROM modulos_sidebar WHERE titulo = 'Administración')
    AND rma5.visible = true
LEFT JOIN role_modulo_acceso rma6 ON r.id = rma6.role_id
    AND rma6.modulo_sidebar_id = (SELECT id FROM modulos_sidebar WHERE titulo = 'Reportes')
    AND rma6.visible = true
WHERE r.name IN ('admin', 'director', 'profesor', 'estudiante', 'padre', 'coordinador', 'tutor')
ORDER BY r.name;

-- Resultado esperado (Matriz):
-- Rol           | Inicio | Mi Perfil | Mis Cursos | Gest. Estud. | Admin | Reportes
-- admin         | SÍ     | SÍ        | SÍ         | SÍ           | SÍ    | SÍ
-- director      | SÍ     | SÍ        | SÍ         | SÍ           | SÍ    | SÍ
-- profesor      | SÍ     | SÍ        | SÍ         | NO           | NO    | SÍ
-- coordinador   | SÍ     | SÍ        | SÍ         | SÍ           | NO    | SÍ
-- estudiante    | SÍ     | SÍ        | SÍ         | NO           | NO    | NO ✓✓✓
-- padre         | SÍ     | SÍ        | NO         | NO           | NO    | NO
-- tutor         | SÍ     | SÍ        | NO         | NO           | NO    | NO


-- ============================================
-- 13. AUDITORÍA: QUIÉN TIENE ACCESO A QUÉ
-- ============================================
SELECT
    ms.titulo AS modulo,
    COUNT(DISTINCT r.id) AS cantidad_roles,
    GROUP_CONCAT(DISTINCT r.name SEPARATOR ', ') AS roles_con_acceso
FROM role_modulo_acceso rma
JOIN roles r ON rma.role_id = r.id
JOIN modulos_sidebar ms ON rma.modulo_sidebar_id = ms.id
WHERE rma.visible = true
GROUP BY ms.id, ms.titulo
ORDER BY ms.titulo;

-- Resultado esperado:
-- Módulo                  | Cantidad Roles | Roles
-- Administración          | 2              | admin, director
-- Calificaciones          | 5              | admin, coordinador, director, estudiante, padre, profesor, tutor
-- Contenido Educativo     | 7              | admin, coordinador, director, estudiante, padre, profesor, tutor
-- Entregas                | 6              | admin, coordinador, director, estudiante, padre, profesor
-- Evaluaciones            | 6              | admin, coordinador, director, estudiante, profesor, tutor
-- Gestionar Estudiantes   | 3              | admin, coordinador, director
-- Gestionar Profesores    | 2              | admin, director
-- Inicio                  | 7              | TODOS
-- etc...


-- ============================================
-- RESUMEN FINAL
-- ============================================
-- Si TODAS las queries anteriores devuelven resultados ESPERADOS:
-- ✅ ARQUITECTURA IMPLEMENTADA CORRECTAMENTE
-- ✅ SEPARACIÓN DE CAPAS FUNCIONANDO
-- ✅ PERMISOS Y MÓDULOS CONFIGURADOS CORRECTAMENTE
-- ✅ SISTEMA LISTO PARA PRODUCCIÓN

-- En caso de inconsistencias:
-- 1. Ejecutar: php artisan migrate:refresh --seed
-- 2. Revisar RoleModuloAccesoSeeder.php
-- 3. Revisar RolesAndPermissionsSeeder.php
