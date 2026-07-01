/**
 * congestionController.js
 * Módulo de Congestión Colaborativa MetroMed — RN-19.1 a RN-22.3
 *
 * Responsabilidades:
 *  - Recibir reportes de pasajeros con autenticación JWT (RN-19.1, RN-21.1)
 *  - Algoritmo de Validación Colectiva (RN-21.2, RN-20.1, RN-20.2)
 *  - Cooldown anti-spam por usuario/estación (RN-21.3)
 *  - Actualización en tiempo real vía SSE broadcast (RN-19.2, RN-19.3, RN-22.2)
 *  - Representación uniforme en Verde/Amarillo/Rojo (RN-20.3, RN-22.1, RN-22.3)
 */

const { pool } = require('../config/database');
const { broadcast } = require('../services/sseService');
const { addClient, removeClient } = require('../services/sseService');

// ─── Configuración de umbrales ────────────────────────────────────────────────
// Ventana temporal para contar reportes (en minutos)
const VENTANA_MINUTOS = parseInt(process.env.CONGESTION_VENTANA_MIN, 10) || 5;

// Reportes coincidentes mínimos para cambiar el nivel
const UMBRAL_MINIMO = parseInt(process.env.CONGESTION_UMBRAL, 10) || 3;

// Cooldown entre reportes del mismo usuario en la misma estación (en minutos)
const COOLDOWN_MINUTOS = parseInt(process.env.CONGESTION_COOLDOWN_MIN, 10) || 5;

// Mapeo de nivel a etiqueta amigable (RN-20.3)
const NIVEL_LABEL = {
    BAJO:  'Verde — Flujo normal',
    MEDIO: 'Amarillo — Congestión moderada',
    ALTO:  'Rojo — Alta congestión'
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Asegura que la tabla reportes_congestion existe antes de cualquier operación.
 * Si ya existe, la instrucción no hace nada (idempotente).
 */
const ensureTable = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS reportes_congestion (
            id_reporte      SERIAL PRIMARY KEY,
            id_usuario      INT NOT NULL,
            id_estacion     INT NOT NULL,
            nivel_reportado VARCHAR(10) NOT NULL
                                CHECK (nivel_reportado IN ('BAJO','MEDIO','ALTO')),
            fecha_reporte   TIMESTAMP NOT NULL DEFAULT NOW()
        )
    `);
};

// ─── Controladores ────────────────────────────────────────────────────────────

/**
 * GET /api/congestion/estaciones
 * Retorna todas las estaciones con su nivel de congestión actual desde la BD.
 * Público — no requiere autenticación.
 * Cumple: RN-22.1 (representación visual uniforme)
 */
const getEstaciones = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                id_estacion,
                nombre_estacion,
                nivel_congestion,
                ultima_actualizacion
            FROM estaciones
            ORDER BY id_estacion ASC
        `);

        return res.json({
            success: true,
            timestamp: new Date().toISOString(),
            estaciones: rows
        });
    } catch (error) {
        console.error('[Congestión] Error en getEstaciones:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener estaciones'
        });
    }
};

/**
 * GET /api/congestion/eventos
 * Endpoint SSE — el cliente se suscribe y recibe actualizaciones automáticas.
 * Público — cualquier cliente puede escuchar.
 * Cumple: RN-19.2, RN-19.3, RN-22.2
 */
const suscribirSSE = async (req, res) => {
    // Cabeceras estándar para SSE
    res.set({
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection':    'keep-alive',
        'X-Accel-Buffering': 'no'      // Nginx: deshabilitar buffering
    });
    res.flushHeaders();

    // Registrar cliente
    addClient(res);

    // Enviar estado actual al nuevo suscriptor (snapshot inicial)
    try {
        const [rows] = await pool.query(`
            SELECT id_estacion, nombre_estacion, nivel_congestion, ultima_actualizacion
            FROM estaciones ORDER BY id_estacion ASC
        `);
        const snapshot = `event: snapshot\ndata: ${JSON.stringify({
            timestamp: new Date().toISOString(),
            estaciones: rows
        })}\n\n`;
        res.write(snapshot);
    } catch (err) {
        console.warn('[SSE] No se pudo enviar snapshot inicial:', err.message);
    }

    // Limpiar cuando el cliente cierra la conexión
    req.on('close', () => {
        removeClient(res);
    });
};

/**
 * POST /api/congestion/reporte
 * Recibe un reporte de congestión de un pasajero autenticado.
 *
 * Body: { id_estacion: number, nivel_reportado: 'BAJO'|'MEDIO'|'ALTO' }
 *
 * Flujo:
 *  1. Validar parámetros
 *  2. Verificar cooldown anti-spam (RN-21.3)
 *  3. Guardar reporte en `reportes_congestion`
 *  4. Ejecutar algoritmo de Validación Colectiva (RN-21.2)
 *  5. Si umbral alcanzado → actualizar `estaciones` + broadcast SSE
 *
 * Requiere: JWT válido + rol=1 (Pasajero) — middleware verifyToken + requireRole
 * Cumple: RN-19.1, RN-21.1, RN-21.2, RN-20.1, RN-20.2, RN-21.3
 */
const recibirReporte = async (req, res) => {
    const { id_estacion, nivel_reportado } = req.body;
    const id_usuario = req.user.id; // Inyectado por verifyToken middleware

    // ── 1. Validación de entrada ──────────────────────────────────────────────
    if (!id_estacion || !nivel_reportado) {
        return res.status(400).json({
            success: false,
            message: 'Se requieren id_estacion y nivel_reportado'
        });
    }

    const nivelesValidos = ['BAJO', 'MEDIO', 'ALTO'];
    const nivelNorm = String(nivel_reportado).toUpperCase();
    if (!nivelesValidos.includes(nivelNorm)) {
        return res.status(400).json({
            success: false,
            message: `nivel_reportado debe ser uno de: ${nivelesValidos.join(', ')}`
        });
    }

    try {
        // Asegurar tabla (primera ejecución)
        await ensureTable();

        // ── 2. Cooldown anti-spam (RN-21.3) ──────────────────────────────────
        const [cooldownCheck] = await pool.query(`
            SELECT id_reporte, fecha_reporte
            FROM reportes_congestion
            WHERE id_usuario   = $1
              AND id_estacion  = $2
              AND fecha_reporte >= NOW() - INTERVAL '${COOLDOWN_MINUTOS} minutes'
            ORDER BY fecha_reporte DESC
            LIMIT 1
        `, [id_usuario, id_estacion]);

        if (cooldownCheck.length > 0) {
            const ultimoReporte = new Date(cooldownCheck[0].fecha_reporte);
            const minutosRestantes = COOLDOWN_MINUTOS - Math.floor(
                (Date.now() - ultimoReporte.getTime()) / 60000
            );
            return res.status(429).json({
                success: false,
                message: `Ya reportaste esta estación recientemente. Espera ${minutosRestantes} minuto(s) más.`
            });
        }

        // ── 3. Verificar que la estación existe ───────────────────────────────
        const [estacionRows] = await pool.query(
            'SELECT id_estacion, nombre_estacion, nivel_congestion FROM estaciones WHERE id_estacion = $1',
            [id_estacion]
        );
        if (estacionRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Estación ${id_estacion} no encontrada`
            });
        }
        const estacion = estacionRows[0];

        // ── 4. Guardar reporte ────────────────────────────────────────────────
        await pool.query(`
            INSERT INTO reportes_congestion (id_usuario, id_estacion, nivel_reportado, fecha_reporte)
            VALUES ($1, $2, $3, NOW())
        `, [id_usuario, id_estacion, nivelNorm]);

        console.log(`[Congestión] Reporte recibido: Usuario=${id_usuario}, Estación=${id_estacion}, Nivel=${nivelNorm}`);

        // ── 5. Algoritmo de Validación Colectiva (RN-21.2, RN-20.1, RN-20.2) ─
        const nuevoNivel = await calcularNivelCongestion(id_estacion);

        let actualizado = false;

        if (nuevoNivel && nuevoNivel !== estacion.nivel_congestion) {
            // Actualizar nivel en tabla `estaciones` (no borra ni altera otros datos)
            await pool.query(`
                UPDATE estaciones
                SET nivel_congestion = $1, ultima_actualizacion = NOW()
                WHERE id_estacion = $2
            `, [nuevoNivel, id_estacion]);

            actualizado = true;

            // ── 6. Broadcast SSE a todos los clientes (RN-22.2, RN-22.1, RN-22.3) ──
            broadcast('congestion_update', {
                timestamp:      new Date().toISOString(),
                id_estacion:    parseInt(id_estacion),
                nombre_estacion: estacion.nombre_estacion,
                nivel_anterior: estacion.nivel_congestion,
                nivel_nuevo:    nuevoNivel,
                label:          NIVEL_LABEL[nuevoNivel]
            });

            console.log(`[Congestión] Nivel actualizado: ${estacion.nombre_estacion} → ${nuevoNivel}`);
        }

        return res.status(201).json({
            success: true,
            message: actualizado
                ? `Reporte procesado. Nivel actualizado a ${NIVEL_LABEL[nuevoNivel]}`
                : 'Reporte registrado. Aún no hay consenso suficiente para cambiar el nivel.',
            id_estacion: parseInt(id_estacion),
            nivel_reportado: nivelNorm,
            nivel_actual: nuevoNivel || estacion.nivel_congestion,
            actualizado
        });

    } catch (error) {
        console.error('[Congestión] Error en recibirReporte:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al procesar el reporte',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// ─── Algoritmo de Validación Colectiva ────────────────────────────────────────

/**
 * Analiza los reportes recientes de una estación y determina el nuevo
 * nivel de congestión si se alcanza el umbral estadístico.
 *
 * Lógica (RN-20.1, RN-20.2, RN-21.2):
 *  - Toma todos los reportes de los últimos VENTANA_MINUTOS minutos
 *  - Agrupa por nivel_reportado y cuenta votos
 *  - El nivel con más votos "gana" (mayoría simple)
 *  - Solo cambia si el nivel ganador tiene >= UMBRAL_MINIMO reportes
 *  - Prioridad de desempate: ALTO > MEDIO > BAJO (seguridad ante congestión)
 *
 * @param {number} id_estacion
 * @returns {string|null} Nuevo nivel ('BAJO'|'MEDIO'|'ALTO') o null si no hay consenso
 */
const calcularNivelCongestion = async (id_estacion) => {
    const [rows] = await pool.query(`
        SELECT
            nivel_reportado,
            COUNT(*) AS total
        FROM reportes_congestion
        WHERE id_estacion   = $1
          AND fecha_reporte >= NOW() - INTERVAL '${VENTANA_MINUTOS} minutes'
        GROUP BY nivel_reportado
        ORDER BY total DESC, nivel_reportado DESC
    `, [id_estacion]);

    if (rows.length === 0) return null;

    // Votos por nivel
    const votos = { BAJO: 0, MEDIO: 0, ALTO: 0 };
    rows.forEach(r => {
        votos[r.nivel_reportado] = parseInt(r.total, 10);
    });

    const totalVotos = votos.BAJO + votos.MEDIO + votos.ALTO;

    // Log para diagnóstico
    console.log(`[Validación Colectiva] Estación ${id_estacion} | Ventana: ${VENTANA_MINUTOS}min | Votos:`, votos);

    // Orden de prioridad en desempate: ALTO > MEDIO > BAJO
    const prioridad = ['ALTO', 'MEDIO', 'BAJO'];

    // Encontrar el nivel con más votos (respetando prioridad de desempate)
    let nivelGanador = null;
    let maxVotos = 0;

    prioridad.forEach(nivel => {
        if (votos[nivel] > maxVotos) {
            maxVotos = votos[nivel];
            nivelGanador = nivel;
        } else if (votos[nivel] === maxVotos && nivelGanador !== null) {
            // En empate, el nivel de mayor gravedad tiene prioridad (ya está primero en prioridad[])
            // No hacemos nada — el primero encontrado (mayor gravedad) permanece
        }
    });

    // Solo actualiza si hay consenso suficiente
    if (maxVotos < UMBRAL_MINIMO) {
        console.log(`[Validación Colectiva] Umbral no alcanzado (${maxVotos}/${UMBRAL_MINIMO}). Sin cambio.`);
        return null;
    }

    console.log(`[Validación Colectiva] Consenso alcanzado: ${nivelGanador} con ${maxVotos} votos de ${totalVotos} totales.`);
    return nivelGanador;
};

module.exports = {
    getEstaciones,
    suscribirSSE,
    recibirReporte,
    calcularNivelCongestion
};
