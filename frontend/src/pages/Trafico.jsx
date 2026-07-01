import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getEstaciones, enviarReporte, suscribirSSE, nivelToEstilo } from '../services/congestionService';
import './Trafico.css';

/**
 * Trafico.jsx — Mapa de Congestión en Tiempo Real
 *
 * Integra:
 *  - Datos reales desde la BD via GET /api/congestion/estaciones
 *  - Actualizaciones automáticas vía SSE (RN-19.2, RN-19.3, RN-22.2)
 *  - Panel de reporte para pasajeros (RN-19.1, RN-21.1)
 *  - Algoritmo de validación colectiva en backend (RN-21.2)
 *  - Colores Verde/Amarillo/Rojo uniformes (RN-20.3, RN-22.1, RN-22.3)
 */

// ─── Estructura Jerárquica de Estaciones (Orden Secuencial) ─────────────────
// RN-Geo: Definición de Nodos y líneas para trazar los paths correctamente
const estacionesMetro = {
    'A': [
        { id: 'Niquía', lat: 6.33785, lng: -75.54427 },
        { id: 'Bello', lat: 6.329933, lng: -75.553708 },
        { id: 'Madera', lat: 6.315850, lng: -75.555379 },
        { id: 'Acevedo', lat: 6.299843, lng: -75.558614 },
        { id: 'Tricentenario', lat: 6.290340, lng: -75.564717 },
        { id: 'Caribe', lat: 6.278236, lng: -75.569479 },
        { id: 'Universidad', lat: 6.269432, lng: -75.565903 },
        { id: 'Hospital', lat: 6.263926, lng: -75.563512 },
        { id: 'Prado', lat: 6.256779, lng: -75.566200 },
        { id: 'Parque Berrío', lat: 6.250452, lng: -75.568237 },
        { id: 'San Antonio', lat: 6.247133, lng: -75.569829 },
        { id: 'Alpujarra', lat: 6.242903, lng: -75.571435 },
        { id: 'Exposiciones', lat: 6.238359, lng: -75.573196 },
        { id: 'Industriales', lat: 6.229965, lng: -75.575637 },
        { id: 'Poblado', lat: 6.212682, lng: -75.578040 },
        { id: 'Aguacatala', lat: 6.193801, lng: -75.581841 },
        { id: 'Ayurá', lat: 6.186527, lng: -75.585438 },
        { id: 'Envigado', lat: 6.174664, lng: -75.597085 },
        { id: 'Itagüí', lat: 6.163239, lng: -75.605883 },
        { id: 'Sabaneta', lat: 6.157431, lng: -75.616758 },
        { id: 'La Estrella', lat: 6.152694, lng: -75.626479 }
    ],
    'B': [
        { id: 'San Antonio', lat: 6.247133, lng: -75.569829 },
        { id: 'Cisneros', lat: 6.248929, lng: -75.574847 },
        { id: 'Suramericana', lat: 6.252988, lng: -75.582943 },
        { id: 'Estadio', lat: 6.253308, lng: -75.588282 },
        { id: 'Floresta', lat: 6.258671, lng: -75.597782 },
        { id: 'Santa Lucía', lat: 6.258073, lng: -75.603772 },
        { id: 'San Javier', lat: 6.256966, lng: -75.613932 }
    ]
};

// Generamos un mapa rápido de coordenadas para mantener la compatibilidad con el resto del componente
const COORDS_ESTACIONES = {};
Object.entries(estacionesMetro).forEach(([linea, estaciones]) => {
    estaciones.forEach(est => {
        COORDS_ESTACIONES[est.id] = { lat: est.lat, lng: est.lng, linea };
    });
});

// Extrae el nombre base de la estación desde la BD (que tiene "Estación X")
const normalizarNombre = (nombreBD) =>
    nombreBD.replace(/^Estaci[oó]n\s+/i, '').trim();

// ─── Helpers Geometría (Haversine) ──────────────────────────────────────────
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Radio de la Tierra en metros
    const rad = Math.PI / 180;
    const φ1 = lat1 * rad, φ2 = lat2 * rad;
    const Δφ = (lat2 - lat1) * rad;
    const Δλ = (lon2 - lon1) * rad;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distancia en metros
};

// ─── Componente ───────────────────────────────────────────────────────────────

const getUser = () => {
    try {
        const u = localStorage.getItem('user');
        return u ? JSON.parse(u) : null;
    } catch { return null; }
};

// ─── Componente ───────────────────────────────────────────────────────────────

const Trafico = ({ onBack }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({});   // { id_estacion: google.maps.Marker }
    const sseRef = useRef(null);

    const [estaciones, setEstaciones] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [updateTime, setUpdateTime] = useState(new Date());
    const [sseConectado, setSseConectado] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Panel de reporte
    const [panelReporte, setPanelReporte] = useState(false);
    const [reporteEstacion, setReporteEstacion] = useState('');
    const [reporteNivel, setReporteNivel] = useState('MEDIO');
    const [enviandoReporte, setEnviandoReporte] = useState(false);
    const [mensajeReporte, setMensajeReporte] = useState(null);

    // Ubicación del usuario
    const [ubicacion, setUbicacion] = useState(null);
    const [distanciaCercana, setDistanciaCercana] = useState(null);
    const [distancias, setDistancias] = useState({}); // { id_estacion: distanciaEnMetros }

    const user = getUser();
    const esPasajero = user && Number(user.rol) === 2; // rol 2 es Usuario/Pasajero

    // ── Encontrar estación más cercana ─────────────────────────────────────
    const encontrarEstacionCercana = useCallback((lat, lng, listadoEstaciones) => {
        let minimaDistancia = Infinity;
        let estacionCercana = null;
        const mapaDistancias = {};

        listadoEstaciones.forEach(est => {
            const nombreNormal = normalizarNombre(est.nombre_estacion);
            const coords = COORDS_ESTACIONES[nombreNormal];
            if (coords) {
                const dist = calcularDistancia(lat, lng, coords.lat, coords.lng);
                mapaDistancias[est.id_estacion] = Math.round(dist);
                if (dist < minimaDistancia) {
                    minimaDistancia = dist;
                    estacionCercana = String(est.id_estacion);
                }
            }
        });

        setDistancias(mapaDistancias);

        if (estacionCercana) {
            setReporteEstacion(estacionCercana);
            setDistanciaCercana(Math.round(minimaDistancia));
        }
    }, []);

    // ── Actualizar marcador en el mapa ─────────────────────────────────────
    const actualizarMarcador = useCallback((idEstacion, nivel) => {
        const marker = markersRef.current[idEstacion];
        if (!marker) return;

        const estilo = nivelToEstilo(nivel);
        marker.setIcon({
            path: window.google?.maps?.SymbolPath?.CIRCLE,
            scale: 8,
            fillColor: estilo.color,
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2
        });
    }, []);

    // ── Actualizar una estación en el estado ───────────────────────────────
    const actualizarEstacionEnEstado = useCallback((update) => {
        setEstaciones(prev =>
            prev.map(est =>
                est.id_estacion === update.id_estacion
                    ? { ...est, nivel_congestion: update.nivel_nuevo, ultima_actualizacion: update.timestamp }
                    : est
            )
        );
        actualizarMarcador(update.id_estacion, update.nivel_nuevo);
        setUpdateTime(new Date());

        // Actualizar panel de detalle si esa estación está seleccionada
        setSelectedStation(prev =>
            prev && prev.id_estacion === update.id_estacion
                ? { ...prev, nivel_congestion: update.nivel_nuevo }
                : prev
        );
    }, [actualizarMarcador]);

    // ── Cargar datos iniciales y suscribir SSE ──────────────────────────────
    useEffect(() => {
        let mounted = true;

        const inicializar = async () => {
            try {
                setCargando(true);
                setError(null);

                // Cargar estaciones desde la BD
                const data = await getEstaciones();
                if (!mounted) return;
                
                // Filtramos solo las estaciones que están definidas en COORDS_ESTACIONES (Línea A y B)
                const estacionesFiltradas = data.filter(est => normalizarNombre(est.nombre_estacion) in COORDS_ESTACIONES);
                setEstaciones(estacionesFiltradas);
                setCargando(false);

                // Suscribir SSE para actualizaciones en tiempo real
                const sse = suscribirSSE(
                    // Snapshot inicial desde el servidor (estado completo)
                    (snapshotEstaciones) => {
                        if (!mounted) return;
                        const filtradasSnapshot = snapshotEstaciones.filter(est => normalizarNombre(est.nombre_estacion) in COORDS_ESTACIONES);
                        setEstaciones(filtradasSnapshot);
                        setSseConectado(true);
                        // Re-renderizar marcadores si el mapa ya está listo
                        filtradasSnapshot.forEach(est => {
                            actualizarMarcador(est.id_estacion, est.nivel_congestion);
                        });
                    },
                    // Actualización individual cuando cambia una estación
                    (update) => {
                        if (!mounted) return;
                        actualizarEstacionEnEstado(update);
                        setSseConectado(true);
                    },
                    // Error de conexión SSE
                    () => {
                        if (!mounted) return;
                        setSseConectado(false);
                    }
                );
                sseRef.current = sse;

            } catch (err) {
                if (!mounted) return;
                console.error('[Trafico] Error al cargar estaciones:', err);
                setError('No se pudo conectar con el servidor. Mostrando datos de caché.');
                setCargando(false);
                // Fallback: datos básicos estáticos
                setEstaciones(Object.entries(COORDS_ESTACIONES).slice(0, 26).map(([nombre, coords], i) => ({
                    id_estacion: i + 1,
                    nombre_estacion: `Estación ${nombre}`,
                    nivel_congestion: 'BAJO',
                    ultima_actualizacion: new Date().toISOString()
                })));
            }
        };

        inicializar();

        // ── Pedir ubicación al montar ─────────────────────────────────────────
        if (esPasajero && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                (err) => console.warn('[Geolocalización] No permitida o error:', err.message),
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        }

        return () => {
            mounted = false;
            if (sseRef.current) {
                sseRef.current.close();
                sseRef.current = null;
            }
        };
    }, [actualizarEstacionEnEstado, actualizarMarcador, esPasajero]);

    // Calcular la estación más cercana cuando ya tenemos las estaciones y la ubicación
    useEffect(() => {
        if (ubicacion && estaciones.length > 0) {
            encontrarEstacionCercana(ubicacion.lat, ubicacion.lng, estaciones);
        }
    }, [ubicacion, estaciones, encontrarEstacionCercana]);

    // ── Inicializar mapa de Google Maps ─────────────────────────────────────
    useEffect(() => {
        if (cargando || estaciones.length === 0) return;

        const initMap = () => {
            if (!mapRef.current || mapInstance.current || !window.google) return;

            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: 6.2476, lng: -75.5658 },
                zoom: 13,
                styles: [
                    { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
                    { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] },
                    { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }, { lightness: 13 }] },
                    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f3443' }] },
                    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a2a' }] },
                    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a3a3a' }] },
                ],
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true
            });

            // Construir mapa de nombre→estación para combinar con coordenadas
            const estacionMap = {};
            estaciones.forEach(est => {
                const nombre = normalizarNombre(est.nombre_estacion);
                estacionMap[nombre] = est;
            });

            // Trazado dinámico de líneas basado en la estructura secuencial 'estacionesMetro'

            // Trazar Línea A
            const lineaAPath = estacionesMetro['A'].map(est => ({ lat: est.lat, lng: est.lng }));
            new window.google.maps.Polyline({
                path: lineaAPath,
                geodesic: true,
                strokeColor: '#2ecc71',
                strokeOpacity: 0.8,
                strokeWeight: 5,
                map: mapInstance.current
            });

            // Trazar Línea B
            const lineaBPath = estacionesMetro['B'].map(est => ({ lat: est.lat, lng: est.lng }));
            new window.google.maps.Polyline({
                path: lineaBPath,
                geodesic: true,
                strokeColor: '#3498db',
                strokeOpacity: 0.8,
                strokeWeight: 5,
                map: mapInstance.current
            });

            // Agregar marcadores con nivel real de la BD
            const agregarMarcador = (nombre, coords, estacionData) => {
                if (!estacionData) return;

                const estilo = nivelToEstilo(estacionData.nivel_congestion);

                const marker = new window.google.maps.Marker({
                    position: { lat: coords.lat, lng: coords.lng },
                    map: mapInstance.current,
                    title: nombre,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: estilo.color,
                        fillOpacity: 0.9,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    }
                });

                // Guardar referencia para actualizaciones en tiempo real
                markersRef.current[estacionData.id_estacion] = marker;

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `
                        <div style="font-family: 'Inter', sans-serif; padding: 12px 4px 4px 4px; min-width: 220px; border-radius: 8px;">
                            <div style="display: flex; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${coords.linea === 'A' ? '#2ecc71' : '#3498db'}; margin-right: 8px;"></div>
                                <h3 style="margin: 0; font-size: 16px; color: #2c3e50; font-weight: 600;">${nombre}</h3>
                            </div>
                            <div style="background-color: ${estilo.color}15; padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 4px; border-left: 4px solid ${estilo.color};">
                                <span style="font-size: 12px; color: #7f8c8d; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">Nivel de Congestión</span>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <span style="font-size: 18px;">${estilo.emoji}</span>
                                    <span style="color: ${estilo.color}; font-weight: 700; font-size: 15px;">${estilo.texto}</span>
                                </div>
                            </div>
                        </div>
                    `
                });

                marker.addListener('click', () => {
                    infoWindow.open(mapInstance.current, marker);
                    setSelectedStation(estacionData);
                    // Pre-seleccionar en panel de reporte
                    setReporteEstacion(String(estacionData.id_estacion));
                });
            };

            // Agregar todos los marcadores que tengan coordenadas y datos de BD
            Object.entries(COORDS_ESTACIONES).forEach(([nombre, coords]) => {
                const estacionData = estacionMap[nombre];
                if (estacionData) {
                    agregarMarcador(nombre, coords, estacionData);
                }
            });
        };

        if (window.google && window.google.maps) {
            initMap();
        } else {
            const existingScript = document.getElementById('google-maps-script');
            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'google-maps-script';
                // Removemos ?key=YOUR_API_KEY_HERE& para evitar que Google rechace la petición duramente
                script.src = `https://maps.googleapis.com/maps/api/js?libraries=visualization`;
                script.async = true;
                script.defer = true;
                script.onload = initMap;
                document.head.appendChild(script);
            } else {
                existingScript.onload = initMap;
            }
        }
    }, [cargando, estaciones]);

    // ── Estado global calculado ────────────────────────────────────────────
    const getEstadoGlobal = () => {
        if (estaciones.length === 0) return { nivel: 'bajo', texto: 'Cargando...', color: '#95a5a6' };
        const altoCount = estaciones.filter(e => e.nivel_congestion === 'ALTO').length;
        const medioCount = estaciones.filter(e => e.nivel_congestion === 'MEDIO').length;
        if (altoCount > 5) return { nivel: 'alto', texto: 'Alta congestión', color: '#e74c3c' };
        if (medioCount > 8 || altoCount > 2) return { nivel: 'medio', texto: 'Congestión moderada', color: '#f39c12' };
        return { nivel: 'bajo', texto: 'Flujo normal', color: '#2ecc71' };
    };

    const estadoGlobal = getEstadoGlobal();

    // ── Enviar reporte de congestión ───────────────────────────────────────
    const handleEnviarReporte = async () => {
        if (!reporteEstacion) {
            setMensajeReporte({ tipo: 'error', texto: 'Selecciona una estación.' });
            return;
        }

        setEnviandoReporte(true);
        setMensajeReporte(null);

        try {
            const resultado = await enviarReporte(parseInt(reporteEstacion), reporteNivel);
            setMensajeReporte({
                tipo: 'success',
                texto: resultado.message
            });
            // Auto-limpiar mensaje en 5 segundos
            setTimeout(() => setMensajeReporte(null), 5000);
        } catch (err) {
            setMensajeReporte({ tipo: 'error', texto: err.message });
        } finally {
            setEnviandoReporte(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="trafico-section">
            {/* Header */}
            <div className="trafico-header">
                <button className="btn-back-dashboard" onClick={() => onBack('congestion')}>
                    <i className="fas fa-arrow-left"></i>
                    <span>Volver</span>
                </button>

                <div className="trafico-title-section">
                    <h1 className="trafico-main-title">
                        <i className="fas fa-subway"></i>
                        Monitoreo en Tiempo Real
                    </h1>
                    <p className="trafico-subtitle">
                        Metro de Medellín
                        {sseConectado && (
                            <span className="sse-badge" title="Actualizaciones en tiempo real activas">
                                <span className="sse-dot"></span> En vivo
                            </span>
                        )}
                    </p>
                </div>

                <div className="trafico-status-badge" style={{ borderColor: estadoGlobal.color }}>
                    <div className="status-indicator" style={{ background: estadoGlobal.color }}></div>
                    <div className="status-text">
                        <span className="status-label">Estado Global</span>
                        <span className="status-value" style={{ color: estadoGlobal.color }}>
                            {estadoGlobal.texto}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controles superiores */}
            <div className="trafico-controls-top">
                <div className="control-card">
                    <i className="fas fa-clock"></i>
                    <div className="control-info">
                        <span className="control-label">Última actualización</span>
                        <span className="control-value">{updateTime.toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="control-card">
                    <i className="fas fa-train"></i>
                    <div className="control-info">
                        <span className="control-label">Líneas operativas</span>
                        <span className="control-value">2 Líneas + Metrocable</span>
                    </div>
                </div>

                <div className="control-card">
                    <i className="fas fa-map-marker-alt"></i>
                    <div className="control-info">
                        <span className="control-label">Estaciones monitoreadas</span>
                        <span className="control-value">{estaciones.length}</span>
                    </div>
                </div>

                <div className="control-card">
                    <i className="fas fa-signal"></i>
                    <div className="control-info">
                        <span className="control-label">Canal en tiempo real</span>
                        <span className="control-value" style={{ color: sseConectado ? '#2ecc71' : '#e74c3c' }}>
                            {sseConectado ? '● Conectado' : '○ Conectando...'}
                        </span>
                    </div>
                </div>

                {/* Botón reporte (solo pasajeros) */}
                {esPasajero && (
                    <button className="btn-refresh" style={{ background: 'rgba(231,76,60,0.15)', borderColor: '#e74c3c', color: '#e74c3c' }}
                        onClick={() => setPanelReporte(p => !p)}>
                        <i className="fas fa-exclamation-triangle"></i>
                        {panelReporte ? 'Cerrar reporte' : 'Reportar congestión'}
                    </button>
                )}

                <button className="btn-refresh" onClick={async () => {
                    const data = await getEstaciones().catch(() => null);
                    if (data) { setEstaciones(data); setUpdateTime(new Date()); }
                }}>
                    <i className="fas fa-sync-alt"></i>
                    Actualizar
                </button>
            </div>

            {/* Panel de Reporte de Congestión (solo rol Pasajero) */}
            {esPasajero && panelReporte && (
                <div className="reporte-panel">
                    <h3 className="reporte-title">
                        <i className="fas fa-exclamation-circle"></i>
                        Reportar nivel de congestión
                    </h3>
                    <p className="reporte-desc">
                        Tu reporte contribuye al estado colaborativo del mapa.
                        Se requieren al menos <strong>3 reportes coincidentes</strong> en los últimos 5 minutos para actualizar el nivel.
                    </p>

                    <div className="reporte-form">
                        <div className="reporte-field">
                            <label>
                                Estación
                                {ubicacion && distanciaCercana !== null && (
                                    <span style={{ color: '#3498db', fontSize: '0.8em', marginLeft: '8px', textTransform: 'none' }}>
                                        <i className="fas fa-location-arrow"></i> A {distanciaCercana}m de ti
                                    </span>
                                )}
                            </label>
                            <select
                                value={reporteEstacion}
                                onChange={e => setReporteEstacion(e.target.value)}
                                className="reporte-select"
                            >
                                <option value="">— Selecciona una estación —</option>
                                {estaciones.map(est => {
                                    const dist = distancias[est.id_estacion];
                                    const distText = dist !== undefined ? ` (A ${dist > 1000 ? (dist/1000).toFixed(1) + 'km' : dist + 'm'})` : '';
                                    return (
                                        <option key={est.id_estacion} value={est.id_estacion}>
                                            {est.nombre_estacion}{distText}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div className="reporte-field">
                            <label>Nivel de congestión</label>
                            <div className="nivel-buttons">
                                {[
                                    { val: 'BAJO', label: '🟢 Flujo normal', color: '#2ecc71' },
                                    { val: 'MEDIO', label: '🟡 Moderado', color: '#f39c12' },
                                    { val: 'ALTO', label: '🔴 Alta congestión', color: '#e74c3c' },
                                ].map(opcion => (
                                    <button
                                        key={opcion.val}
                                        className={`nivel-btn ${reporteNivel === opcion.val ? 'active' : ''}`}
                                        style={reporteNivel === opcion.val
                                            ? { borderColor: opcion.color, background: `${opcion.color}22`, color: opcion.color }
                                            : {}}
                                        onClick={() => setReporteNivel(opcion.val)}
                                    >
                                        {opcion.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn-enviar-reporte"
                            onClick={handleEnviarReporte}
                            disabled={enviandoReporte || !reporteEstacion}
                        >
                            {enviandoReporte
                                ? <><i className="fas fa-spinner fa-spin"></i> Enviando...</>
                                : <><i className="fas fa-paper-plane"></i> Enviar reporte</>
                            }
                        </button>
                    </div>

                    {mensajeReporte && (
                        <div className={`reporte-mensaje ${mensajeReporte.tipo}`}>
                            <i className={`fas fa-${mensajeReporte.tipo === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i>
                            {mensajeReporte.texto}
                        </div>
                    )}
                </div>
            )}

            {/* Banner de error si no hay conexión con BD */}
            {error && (
                <div className="error-banner">
                    <i className="fas fa-wifi-slash"></i>
                    {error}
                </div>
            )}

            {/* Skeleton mientras carga */}
            {cargando && (
                <div className="loading-overlay">
                    <i className="fas fa-subway fa-spin" style={{ fontSize: '2rem', color: '#2ecc71' }}></i>
                    <p>Cargando datos del sistema...</p>
                </div>
            )}

            {/* Contenedor del mapa */}
            <div className="map-container-full">
                <div id="map-full" ref={mapRef}></div>

                {/* Panel lateral */}
                <div className="trafico-sidebar">
                    {/* Leyenda */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">
                            <i className="fas fa-info-circle"></i>
                            Leyenda
                        </h3>
                        <div className="trafico-legend">
                            {[
                                { color: '#2ecc71', label: 'Flujo Normal', desc: 'Sin retrasos', nivel: 'BAJO' },
                                { color: '#f39c12', label: 'Moderado', desc: 'Algunos retrasos', nivel: 'MEDIO' },
                                { color: '#e74c3c', label: 'Alta Congestión', desc: 'Retrasos significativos', nivel: 'ALTO' },
                            ].map(item => (
                                <div className="legend-item" key={item.nivel}>
                                    <div className="legend-color" style={{ background: item.color }}></div>
                                    <div className="legend-text">
                                        <span className="legend-label">{item.label}</span>
                                        <span className="legend-desc">{item.desc}</span>
                                        <span className="legend-count" style={{ color: item.color }}>
                                            {estaciones.filter(e => e.nivel_congestion === item.nivel).length} est.
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Líneas */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">
                            <i className="fas fa-route"></i>
                            Líneas
                        </h3>
                        <div className="lineas-info">
                            {[
                                { nombre: 'Línea A', color: '#2ecc71', filtro: e => normalizarNombre(e.nombre_estacion) in COORDS_ESTACIONES && COORDS_ESTACIONES[normalizarNombre(e.nombre_estacion)]?.linea === 'A' },
                                { nombre: 'Línea B', color: '#3498db', filtro: e => COORDS_ESTACIONES[normalizarNombre(e.nombre_estacion)]?.linea === 'B' },
                            ].map(linea => (
                                <div className="linea-badge" key={linea.nombre} style={{ borderLeft: `4px solid ${linea.color}` }}>
                                    <div className="linea-name">{linea.nombre}</div>
                                    <div className="linea-stations">
                                        {estaciones.filter(linea.filtro).length} estaciones
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detalle de estación seleccionada */}
                    {selectedStation && (() => {
                        const estilo = nivelToEstilo(selectedStation.nivel_congestion);
                        return (
                            <div className="sidebar-section station-detail">
                                <h3 className="sidebar-title">
                                    <i className="fas fa-location-dot"></i>
                                    Estación Seleccionada
                                </h3>
                                <div className="station-detail-card">
                                    <h4>{normalizarNombre(selectedStation.nombre_estacion)}</h4>
                                    <div className="station-status">
                                        <span className="status-dot" style={{ background: estilo.color }}></span>
                                        <span>{estilo.emoji} {estilo.texto}</span>
                                    </div>
                                    <p className="station-update">
                                        Actualizado: {new Date(selectedStation.ultima_actualizacion).toLocaleTimeString()}
                                    </p>
                                    {esPasajero && (
                                        <button
                                            className="btn-reporte-quick"
                                            onClick={() => {
                                                setReporteEstacion(String(selectedStation.id_estacion));
                                                setPanelReporte(true);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        >
                                            <i className="fas fa-flag"></i> Reportar esta estación
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Alertas activas */}
                    <div className="sidebar-section alerts-section">
                        <h3 className="sidebar-title">
                            <i className="fas fa-exclamation-triangle"></i>
                            Estaciones en Alerta
                        </h3>
                        {estaciones
                            .filter(e => e.nivel_congestion === 'ALTO')
                            .slice(0, 4)
                            .map(est => (
                                <div key={est.id_estacion} className="alert-item danger">
                                    <i className="fas fa-circle-exclamation"></i>
                                    <div className="alert-content">
                                        <div className="alert-title">{normalizarNombre(est.nombre_estacion)}</div>
                                        <div className="alert-desc">🔴 Alta congestión reportada</div>
                                    </div>
                                </div>
                            ))
                        }
                        {estaciones.filter(e => e.nivel_congestion === 'ALTO').length === 0 && (
                            <div className="alert-item info">
                                <i className="fas fa-check-circle"></i>
                                <div className="alert-content">
                                    <div className="alert-title">Sin alertas activas</div>
                                    <div className="alert-desc">Todas las estaciones operan con normalidad</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="trafico-stats">
                <div className="stat-box">
                    <div className="stat-icon" style={{ background: 'rgba(46, 204, 113, 0.2)' }}>
                        <i className="fas fa-check-circle" style={{ color: '#2ecc71' }}></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{estaciones.filter(e => e.nivel_congestion === 'BAJO').length}</div>
                        <div className="stat-label">Estaciones flujo normal</div>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ background: 'rgba(243, 156, 18, 0.2)' }}>
                        <i className="fas fa-exclamation-circle" style={{ color: '#f39c12' }}></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{estaciones.filter(e => e.nivel_congestion === 'MEDIO').length}</div>
                        <div className="stat-label">Con congestión moderada</div>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ background: 'rgba(231, 76, 60, 0.2)' }}>
                        <i className="fas fa-times-circle" style={{ color: '#e74c3c' }}></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{estaciones.filter(e => e.nivel_congestion === 'ALTO').length}</div>
                        <div className="stat-label">Con alta congestión</div>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ background: 'rgba(52, 152, 219, 0.2)' }}>
                        <i className="fas fa-users" style={{ color: '#3498db' }}></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{estaciones.length}</div>
                        <div className="stat-label">Estaciones monitoreadas</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trafico;