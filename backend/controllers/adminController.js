/**
 * adminController.js
 * Dashboard de estadísticas y auditoría general para administradores.
 */

const { pool } = require('../config/mysqlPool');

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/dashboard — Estadísticas del panel
// ─────────────────────────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
    try {
        // Contadores en paralelo para eficiencia
        const [
            [totalUsuarios],
            [usuariosActivos],
            [usuariosInactivos],
            [totalReportes],
            [reportesPendientes],
            [totalNotificaciones],
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) AS total FROM usuarios'),
            pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE estado = 'activo'"),
            pool.query("SELECT COUNT(*) AS total FROM usuarios WHERE estado = 'inactivo'"),
            pool.query('SELECT COUNT(*) AS total FROM reportes'),
            pool.query("SELECT COUNT(*) AS total FROM reportes WHERE estado = 'pendiente'"),
            pool.query('SELECT COUNT(*) AS total FROM notificaciones_globales'),
        ]);

        // Juegos activos — intentar desde MySQL si existe la tabla
        let juegosActivos = 0;
        try {
            const [rowsJuegos] = await pool.query(
                "SELECT COUNT(*) AS total FROM juegos WHERE activo = 1"
            );
            juegosActivos = rowsJuegos[0].total;
        } catch {
            // La tabla juegos puede estar en Supabase; devolver 0 en ese caso
        }

        res.json({
            success: true,
            data: {
                total_usuarios:        totalUsuarios[0].total,
                usuarios_activos:      usuariosActivos[0].total,
                usuarios_inactivos:    usuariosInactivos[0].total,
                total_reportes:        totalReportes[0].total,
                reportes_pendientes:   reportesPendientes[0].total,
                juegos_activos:        juegosActivos,
                notificaciones_totales: totalNotificaciones[0].total,
            }
        });
    } catch (error) {
        console.error('Error al obtener stats del dashboard:', error);
        res.status(500).json({ success: false, message: 'Error al obtener estadísticas' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/auditoria — Registro unificado de auditorías
// Query: modulo = 'usuarios' | 'reportes' | 'juegos' | undefined (todos)
// ─────────────────────────────────────────────────────────────────────────────
const getAuditoriaGeneral = async (req, res) => {
    const { modulo } = req.query;

    try {
        const results = [];

        // ── Auditoría de usuarios ─────────────────────────────────────────
        if (!modulo || modulo === 'usuarios') {
            const [rows] = await pool.query(
                `SELECT
                    'usuarios'        AS modulo,
                    au.id_auditoria,
                    ua.nombre         AS administrador,
                    uaf.nombre        AS entidad_afectada,
                    au.accion,
                    au.descripcion,
                    DATE_FORMAT(au.fecha, '%Y-%m-%d %H:%i:%s') AS fecha
                 FROM auditoria_usuarios au
                 JOIN usuarios ua  ON ua.id_usuario  = au.id_administrador
                 JOIN usuarios uaf ON uaf.id_usuario = au.id_usuario_afectado
                 ORDER BY au.fecha DESC
                 LIMIT 100`
            );
            results.push(...rows);
        }

        // ── Auditoría de reportes ─────────────────────────────────────────
        if (!modulo || modulo === 'reportes') {
            const [rows] = await pool.query(
                `SELECT
                    'reportes'        AS modulo,
                    ar.id_auditoria,
                    u.nombre          AS administrador,
                    ar.id_reporte     AS entidad_id,
                    ar.accion,
                    ar.descripcion,
                    DATE_FORMAT(ar.fecha, '%Y-%m-%d %H:%i:%s') AS fecha
                 FROM auditoria_reportes ar
                 JOIN usuarios u ON u.id_usuario = ar.id_administrador
                 ORDER BY ar.fecha DESC
                 LIMIT 100`
            );
            results.push(...rows.map(r => ({
                ...r,
                entidad_afectada: `Reporte #${r.entidad_id}`
            })));
        }

        // ── Auditoría de juegos ───────────────────────────────────────────
        if (!modulo || modulo === 'juegos') {
            const [rows] = await pool.query(
                `SELECT
                    'juegos'          AS modulo,
                    aj.id_auditoria,
                    u.nombre          AS administrador,
                    aj.id_juego       AS entidad_id,
                    aj.accion,
                    aj.valor_anterior,
                    aj.valor_nuevo,
                    DATE_FORMAT(aj.fecha, '%Y-%m-%d %H:%i:%s') AS fecha
                 FROM auditoria_juegos aj
                 JOIN usuarios u ON u.id_usuario = aj.id_administrador
                 ORDER BY aj.fecha DESC
                 LIMIT 100`
            );
            results.push(...rows.map(r => ({
                ...r,
                entidad_afectada: `Juego #${r.entidad_id}`,
                descripcion: `${r.valor_anterior || '—'} → ${r.valor_nuevo || '—'}`
            })));
        }

        // Ordenar todo por fecha descendente
        results.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

        res.json({ success: true, data: results });
    } catch (error) {
        console.error('Error al obtener auditoría general:', error);
        res.status(500).json({ success: false, message: 'Error al obtener auditoría' });
    }
};

module.exports = { getDashboardStats, getAuditoriaGeneral };
