const { pool } = require('../config/database');
const { sendCongestionNotification } = require('../utils/emailService');

// Estaciones base con coordenadas
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

                // Enviar por email si tiene habilitado (RF-24)
                if (receivesEmail) {
                    try {
                        await sendCongestionNotification(user.correo, nombre_estacion, 'Alta', user.nombre);
                    } catch (emailErr) {
                        console.error(`Error enviando correo a ${user.correo}:`, emailErr);
                    }
                }
            }
        }

        res.json({
            success: true,
            message: `Reporte de congestión (${estado}) registrado correctamente para la estación ${nombre_estacion}.`
        });
    } catch (error) {
        console.error('Error al reportar congestión:', error);
        res.status(500).json({ success: false, message: 'Error interno al registrar reporte' });
    }
};

// Obtener historial de notificaciones recibidas (RF-26)
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

// Marcar notificaciones como leídas (RF-23, RF-26)
const marcarLeidas = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        await pool.query(
            'UPDATE historial_notificaciones SET leida = TRUE WHERE id_usuario = $1',
            [id_usuario]
        );
        res.json({ success: true, message: 'Notificaciones marcadas como leídas' });
    } catch (error) {
        console.error('Error al marcar notificaciones:', error);
        res.status(500).json({ success: false, message: 'Error al marcar notificaciones' });
    }
};

// Obtener suscripción a notificaciones (RF-25)
const getSuscripcion = async (req, res) => {
    const id_usuario = req.user.id;
    try {
        const [rows] = await pool.query(
            'SELECT recibir_correo, recibir_push FROM suscripcion_notificaciones WHERE id_usuario = $1',
            [id_usuario]
        );

        if (rows.length === 0) {
            // Por defecto, suscrito a ambos
            return res.json({
                success: true,
                recibir_correo: true,
                recibir_push: true
            });
        }

        res.json({
            success: true,
            recibir_correo: rows[0].recibir_correo,
            recibir_push: rows[0].recibir_push
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

module.exports = {
    getCongestion,
    reportarCongestion,
    getNotificaciones,
    marcarLeidas,
    getSuscripcion,
    updateSuscripcion
};
