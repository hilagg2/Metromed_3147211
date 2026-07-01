const { pool } = require('../config/database');
const { sendCongestionNotification } = require('../utils/emailService');
const { broadcast, addClient, removeClient } = require('../services/sseService');

// Estaciones base con coordenadas para simulación original
const estacionesBase = {
    lineaA: [
        { nombre: "Niquía", lat: 6.3389, lng: -75.5431 },
        { nombre: "Bello", lat: 6.3378, lng: -75.5613 },
        { nombre: "Madera", lat: 6.3209, lng: -75.5639 },
        { nombre: "Acevedo", lat: 6.3005, lng: -75.5683 },
        { nombre: "Tricentenario", lat: 6.2803, lng: -75.5728 },
        { nombre: "Caribe", lat: 6.2725, lng: -75.5750 },
        { nombre: "Universidad", lat: 6.2678, lng: -75.5683 },
        { nombre: "Hospital", lat: 6.2621, lng: -75.5656 },
        { nombre: "Prado", lat: 6.2518, lng: -75.5667 },
        { nombre: "Parque Berrío", lat: 6.2515, lng: -75.5697 },
        { nombre: "San Antonio", lat: 6.2473, lng: -75.5696 },
        { nombre: "Alpujarra", lat: 6.2482, lng: -75.5746 },
        { nombre: "Exposiciones", lat: 6.2438, lng: -75.5800 },
        { nombre: "Industriales", lat: 6.2368, lng: -75.5890 },
        { nombre: "Poblado", lat: 6.2107, lng: -75.5722 },
        { nombre: "Aguacatala", lat: 6.1974, lng: -75.5768 },
        { nombre: "Ayurá", lat: 6.1807, lng: -75.5849 },
        { nombre: "Envigado", lat: 6.1692, lng: -75.5923 },
        { nombre: "Itagüí", lat: 6.1616, lng: -75.6086 },
        { nombre: "Sabaneta", lat: 6.1519, lng: -75.6161 },
        { nombre: "La Estrella", lat: 6.1362, lng: -75.6450 }
    ],
    lineaB: [
        { nombre: "San Antonio", lat: 6.2473, lng: -75.5696 },
        { nombre: "Cisneros", lat: 6.2513, lng: -75.5625 },
        { nombre: "San José", lat: 6.2589, lng: -75.5583 },
        { nombre: "Miraflores", lat: 6.2640, lng: -75.5540 },
        { nombre: "Floresta", lat: 6.2679, lng: -75.5510 }
    ],
    metrocable: [
        { nombre: "Acevedo", lat: 6.3005, lng: -75.5683, tipo: "K" },
        { nombre: "Santo Domingo", lat: 6.3178, lng: -75.5489, tipo: "K" },
        { nombre: "San Javier", lat: 6.2560, lng: -75.6216, tipo: "J" },
        { nombre: "Oriente", lat: 6.2789, lng: -75.5300, tipo: "L" }
    ]
};

// Historial en memoria de reportes de usuarios para persistir cambios en tiempo real
const userReports = {};

const getEstado = (nombre, isPeak) => {
    if (userReports[nombre]) {
        return userReports[nombre];
    }
    const principalStations = ["San Antonio", "Parque Berrío", "Poblado", "Acevedo", "Niquía", "Cisneros"];
    if (isPeak) {
        if (principalStations.includes(nombre)) return "alto";
        return Math.random() > 0.5 ? "medio" : "bajo";
    } else {
        if (principalStations.includes(nombre)) return "medio";
        return "bajo";
    }
};

// Obtener datos de congestión (RF-19, RF-20, RF-22)
const getCongestion = (req, res) => {
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const coTime = new Date(utc + (3600000 * -5)); // Hora Colombia (UTC-5)
    const hour = coTime.getHours();
    const isPeakHour = (hour >= 6 && hour < 9) || (hour >= 17 && hour < 20);

    const estacionesResponse = {
        lineaA: estacionesBase.lineaA.map(e => ({ ...e, estado: getEstado(e.nombre, isPeakHour) })),
        lineaB: estacionesBase.lineaB.map(e => ({ ...e, estado: getEstado(e.nombre, isPeakHour) })),
        metrocable: estacionesBase.metrocable.map(e => ({ ...e, estado: getEstado(e.nombre, isPeakHour) }))
    };

    res.json({
        isPeakHour,
        updateTime: coTime.toISOString(),
        estaciones: estacionesResponse
    });
};

// Reportar congestión (Pasajero) (RF-21)
const reportarCongestion = async (req, res) => {
    const { nombre_estacion, estado } = req.body;
    const id_usuario = req.user.id;

    if (!nombre_estacion || !estado) {
        return res.status(400).json({ success: false, message: 'Falta nombre de estación o estado de congestión' });
    }

    try {
        // Guardar reporte en el cache de memoria
        userReports[nombre_estacion] = estado;

        // Si el reporte es ALTO, generamos alertas/notificaciones
        if (estado === 'alto') {
            const mensajeAlerta = `Alerta de Tráfico: Se reporta congestión alta (🔴) en la estación ${nombre_estacion}.`;

            // 1. Obtener todos los usuarios del sistema para alertarlos
            const [users] = await pool.query('SELECT id_usuario, nombre, correo FROM usuarios');

            for (const user of users) {
                // Verificar si tiene suscripciones de notificaciones
                const [subs] = await pool.query(
                    'SELECT recibir_correo, recibir_push FROM suscripcion_notificaciones WHERE id_usuario = $1',
                    [user.id_usuario]
                );

                const receivesPush = subs.length === 0 || subs[0].recibir_push;
                const receivesEmail = subs.length === 0 || subs[0].recibir_correo;

                // Guardar en el historial de notificaciones si tiene push habilitado (RF-26)
                if (receivesPush) {
                    await pool.query(
                        'INSERT INTO historial_notificaciones (id_usuario, tipo, mensaje) VALUES ($1, $2, $3)',
                        [user.id_usuario, 'CONGESTION', mensajeAlerta]
                    );
                }

                // Enviar correo electrónico si tiene correo habilitado (RF-24)
                if (receivesEmail) {
                    try {
                        await sendCongestionNotification(user.correo, user.nombre, nombre_estacion);
                    } catch (mailError) {
                        console.error(`Error enviando correo a ${user.correo}:`, mailError.message);
                    }
                }
            }
        }

        res.json({
            success: true,
            message: 'Reporte registrado y enviado a la comunidad correctamente'
        });
    } catch (error) {
        console.error('Error al registrar reporte de congestión:', error);
        res.status(500).json({ success: false, message: 'Error al registrar reporte' });
    }
};

// Obtener notificaciones del usuario (RF-23, RF-26)
const getNotificaciones = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        const [rows] = await pool.query(
            'SELECT id_notificacion, tipo, mensaje, leida, fecha FROM historial_notificaciones WHERE id_usuario = $1 ORDER BY fecha DESC LIMIT 30',
            [id_usuario]
        );
        res.json({ success: true, notificaciones: rows });
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        res.status(500).json({ success: false, message: 'Error al obtener notificaciones' });
    }
};

// Marcar todas las notificaciones del usuario como leídas
const marcarLeidas = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        await pool.query(
            'UPDATE historial_notificaciones SET leida = TRUE WHERE id_usuario = $1 AND leida = FALSE',
            [id_usuario]
        );
        res.json({ success: true, message: 'Notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar notificaciones:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar notificaciones' });
    }
};

// Obtener preferencias de suscripción (RF-25)
const getSuscripcion = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        const [rows] = await pool.query(
            'SELECT recibir_correo, recibir_push FROM suscripcion_notificaciones WHERE id_usuario = $1',
            [id_usuario]
        );

        if (rows.length === 0) {
            return res.json({
                success: true,
                recibir_correo: true,
                recibir_push: true
            });
        }

        res.json({
            success: true,
            recibir_correo: !!rows[0].recibir_correo,
            recibir_push: !!rows[0].recibir_push
        });
    } catch (error) {
        console.error('Error al obtener suscripción:', error);
        res.status(500).json({ success: false, message: 'Error al obtener preferencias de suscripción' });
    }
};

// Actualizar o suscribirse/cancelar suscripción (RF-25)
const updateSuscripcion = async (req, res) => {
    const { recibir_correo, recibir_push } = req.body;
    const id_usuario = req.user.id;

    try {
        await pool.query(
            `INSERT INTO suscripcion_notificaciones (id_usuario, recibir_correo, recibir_push) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (id_usuario) 
             DO UPDATE SET recibir_correo = EXCLUDED.recibir_correo, recibir_push = EXCLUDED.recibir_push`,
            [id_usuario, recibir_correo, recibir_push]
        );

        res.json({
            success: true,
            message: 'Preferencias de suscripción actualizadas correctamente'
        });
    } catch (error) {
        console.error('Error al guardar suscripción:', error);
        res.status(500).json({ success: false, message: 'Error al guardar preferencias de suscripción' });
    }
};

// ─── Funcionalidades de Monitoreo en Tiempo Real (valeria) ────────────────────

// Configuración de umbrales
const VENTANA_MINUTOS = parseInt(process.env.CONGESTION_VENTANA_MIN, 10) || 5;
const UMBRAL_MINIMO = parseInt(process.env.CONGESTION_UMBRAL, 10) || 3;
const COOLDOWN_MINUTOS = parseInt(process.env.CONGESTION_COOLDOWN_MIN, 10) || 5;

const NIVEL_LABEL = {
    BAJO:  'Verde — Flujo normal',
    MEDIO: 'Amarillo — Congestión moderada',
    ALTO:  'Rojo — Alta congestión'
};

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

const suscribirSSE = async (req, res) => {
    res.set({
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection':    'keep-alive',
        'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();

    addClient(res);

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

    req.on('close', () => {
        removeClient(res);
    });
};

const recibirReporte = async (req, res) => {
    const { id_estacion, nivel_reportado } = req.body;
    const id_usuario = req.user.id;

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
        await ensureTable();

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

        await pool.query(`
            INSERT INTO reportes_congestion (id_usuario, id_estacion, nivel_reportado, fecha_reporte)
            VALUES ($1, $2, $3, NOW())
        `, [id_usuario, id_estacion, nivelNorm]);

        console.log(`[Congestión] Reporte recibido: Usuario=${id_usuario}, Estación=${id_estacion}, Nivel=${nivelNorm}`);

        const nuevoNivel = await calcularNivelCongestion(id_estacion);

        let actualizado = false;

        if (nuevoNivel && nuevoNivel !== estacion.nivel_congestion) {
            await pool.query(`
                UPDATE estaciones
                SET nivel_congestion = $1, ultima_actualizacion = NOW()
                WHERE id_estacion = $2
            `, [nuevoNivel, id_estacion]);

            actualizado = true;

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

    const votos = { BAJO: 0, MEDIO: 0, ALTO: 0 };
    rows.forEach(r => {
        votos[r.nivel_reportado] = parseInt(r.total, 10);
    });

    const totalVotos = votos.BAJO + votos.MEDIO + votos.ALTO;

    console.log(`[Validación Colectiva] Estación ${id_estacion} | Ventana: ${VENTANA_MINUTOS}min | Votos:`, votos);

    const prioridad = ['ALTO', 'MEDIO', 'BAJO'];

    let nivelGanador = null;
    let maxVotos = 0;

    prioridad.forEach(nivel => {
        if (votos[nivel] > maxVotos) {
            maxVotos = votos[nivel];
            nivelGanador = nivel;
        }
    });

    if (maxVotos < UMBRAL_MINIMO) {
        console.log(`[Validación Colectiva] Umbral no alcanzado (${maxVotos}/${UMBRAL_MINIMO}). Sin cambio.`);
        return null;
    }

    console.log(`[Validación Colectiva] Consenso alcanzado: ${nivelGanador} con ${maxVotos} votos de ${totalVotos} totales.`);
    return nivelGanador;
};

module.exports = {
    getCongestion,
    reportarCongestion,
    getNotificaciones,
    marcarLeidas,
    getSuscripcion,
    updateSuscripcion,
    getEstaciones,
    suscribirSSE,
    recibirReporte,
    calcularNivelCongestion
};
