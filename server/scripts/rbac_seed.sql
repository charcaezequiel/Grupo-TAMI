-- ============================================
-- Seed RBAC - TAMI
-- ============================================
-- Roles base
INSERT INTO roles (name, description) VALUES
  ('superadmin', 'Administrador principal con acceso total'),
  ('editor', 'Gestor de contenido (cursos, alertas)'),
  ('analista', 'Solo lectura y exportación de datos/estadísticas'),
  ('moderador', 'Revisión y moderación de contenido'),
  ('usuario', 'Usuario final')
ON CONFLICT (name) DO NOTHING;

-- Permisos base
INSERT INTO permissions (code, module, action, description) VALUES
  ('usuarios.ver', 'usuarios', 'ver', 'Ver listado de usuarios'),
  ('usuarios.crear', 'usuarios', 'crear', 'Crear usuarios'),
  ('usuarios.editar', 'usuarios', 'editar', 'Editar usuarios'),
  ('usuarios.eliminar', 'usuarios', 'eliminar', 'Eliminar usuarios'),
  ('usuarios.asignar_rol', 'usuarios', 'asignar_rol', 'Asignar roles a usuarios'),
  ('contenidos.ver', 'contenidos', 'ver', 'Ver contenidos'),
  ('contenidos.crear', 'contenidos', 'crear', 'Crear contenidos'),
  ('contenidos.editar', 'contenidos', 'editar', 'Editar contenidos'),
  ('contenidos.publicar', 'contenidos', 'publicar', 'Publicar contenidos'),
  ('contenidos.eliminar', 'contenidos', 'eliminar', 'Eliminar contenidos'),
  ('datos.ver', 'datos', 'ver', 'Ver reportes y datos'),
  ('datos.exportar', 'datos', 'exportar', 'Exportar reportes'),
  ('auditoria.ver', 'auditoria', 'ver', 'Ver logs de auditoría'),
  ('config.ver', 'config', 'ver', 'Ver configuración'),
  ('config.editar', 'config', 'editar', 'Editar configuración')
ON CONFLICT (code) DO NOTHING;

-- Asignación de permisos a SuperAdmin (todos)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'superadmin'
ON CONFLICT DO NOTHING;

-- Asignación para Editor
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN ('contenidos.ver','contenidos.crear','contenidos.editar','contenidos.publicar')
WHERE r.name = 'editor'
ON CONFLICT DO NOTHING;

-- Asignación para Analista
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN ('datos.ver','datos.exportar','usuarios.ver')
WHERE r.name = 'analista'
ON CONFLICT DO NOTHING;

-- Asignación para Moderador
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN ('contenidos.ver')
WHERE r.name = 'moderador'
ON CONFLICT DO NOTHING;
