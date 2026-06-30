import React, { useEffect, useRef, useState } from 'react';
import './Trafico.css';
import {
    getCongestionData,
    reportarCongestion,
    getSuscripcion,
    updateSuscripcion
} from '../services/congestionService';

const Trafico = ({ onBack }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [trafficLevel, setTrafficLevel] = useState('normal');
    const [updateTime, setUpdateTime] = useState(new Date());
    const [estaciones, setEstaciones] = useState(null);
    const [loading, setLoading] = useState(true);

    // Preferencias de Notificaciones (RF-24, RF-25)
    const [recibirCorreo, setRecibirCorreo] = useState(true);
    const [recibirPush, setRecibirPush] = useState(true);

    // Filtro de resumen de líneas (RF-22)
    const [activeSummaryLine, setActiveSummaryLine] = useState('lineaA'); // lineaA, lineaB, metrocable

    const fetchCongestionData = async () => {
        try {
            const data = await getCongestionData();
            setEstaciones(data.estaciones);
            setUpdateTime(new Date(data.updateTime));
            setTrafficLevel(data.isPeakHour ? 'alto' : 'normal');

            // Actualizar la estación seleccionada si está abierta para refrescar su estado
            if (selectedStation) {
                const todas = [...data.estaciones.lineaA, ...data.estaciones.lineaB, ...data.estaciones.metrocable];
                const actual = todas.find(e => e.nombre === selectedStation.nombre);
                if (actual) setSelectedStation(actual);
            }
        } catch (error) {
            console.error('Error fetching congestion:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuscripcionData = async () => {
        try {
            const sub = await getSuscripcion();
            setRecibirCorreo(sub.recibir_correo);
            setRecibirPush(sub.recibir_push);
        } catch (error) {
            console.error('Error fetching subscription:', error);
        }
    };

    useEffect(() => {
        fetchCongestionData();
        fetchSuscripcionData();
    }, []);

    useEffect(() => {
        if (!estaciones) return;

        // Cargar Leaflet.js de forma dinámica
        const loadLeaflet = () => {
            if (!document.getElementById('leaflet-css')) {
                const link = document.createElement('link');
                link.id = 'leaflet-css';
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            if (!window.L) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.async = true;
                script.onload = initMap;
                document.body.appendChild(script);
            } else {
                initMap();
            }
        };

        const initMap = () => {
            if (mapRef.current && !mapInstance.current && window.L) {
                const L = window.L;

                // Crear instancia del mapa centrada en Medellín
                const map = L.map(mapRef.current).setView([6.2476, -75.5658], 13);
                mapInstance.current = map;

                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    subdomains: 'abcd',
                    maxZoom: 20
                }).addTo(map);

                // Dibujar Línea A (Verde)
                const lineaAPath = estaciones.lineaA.map(est => [est.lat, est.lng]);
                L.polyline(lineaAPath, {
                    color: '#2ecc71',
                    weight: 5,
                    opacity: 0.8
                }).addTo(map);

                // Dibujar Línea B (Azul)
                const lineaBPath = estaciones.lineaB.map(est => [est.lat, est.lng]);
                L.polyline(lineaBPath, {
                    color: '#3498db',
                    weight: 5,
                    opacity: 0.8
                }).addTo(map);

                // Dibujar rutas de Metrocable (Punteadas)
                estaciones.metrocable.forEach((estacion, index) => {
                    if (index < estaciones.metrocable.length - 1 && 
                        estaciones.metrocable[index + 1].tipo === estacion.tipo) {
                        L.polyline([
                            [estacion.lat, estacion.lng],
                            [estaciones.metrocable[index + 1].lat, estaciones.metrocable[index + 1].lng]
                        ], {
                            color: '#9b59b6',
                            weight: 3,
                            dashArray: '6, 8',
                            opacity: 0.8
                        }).addTo(map);
                    }
                });

                // Función para añadir marcadores
                const addMarkers = (estacionesArray, lineaName) => {
                    estacionesArray.forEach(est => {
                        const color = est.estado === 'alto' ? '#e74c3c' : 
                                      est.estado === 'medio' ? '#f39c12' : '#2ecc71';
                        
                        const marker = L.circleMarker([est.lat, est.lng], {
                            radius: 8,
                            fillColor: color,
                            color: '#ffffff',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.9
                        }).addTo(map);

                        marker.bindPopup(`
                            <div style="color: #000; font-family: Arial, sans-serif; min-width: 150px; padding: 5px;">
                                <h4 style="margin: 0 0 6px 0; color: ${color}; font-size: 1.1em; font-weight: bold;">${est.nombre}</h4>
                                <p style="margin: 4px 0; font-size: 0.9em;"><strong>Línea:</strong> ${lineaName}</p>
                                <p style="margin: 4px 0; font-size: 0.9em;">
                                    <strong>Estado:</strong> 
                                    <span style="color: ${color}; font-weight: bold;">
                                        ${est.estado === 'alto' ? '🔴 Alta congestión' : 
                                          est.estado === 'medio' ? '🟡 Moderado' : '🟢 Fluido'}
                                    </span>
                                </p>
                            </div>
                        `);

                        marker.on('click', () => {
                            setSelectedStation(est);
                        });
                    });
                };

                addMarkers(estaciones.lineaA, 'Línea A');
                addMarkers(estaciones.lineaB, 'Línea B');
                addMarkers(estaciones.metrocable, 'Metrocable');
            }
        };

        loadLeaflet();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [estaciones]);

    const getEstadoGlobal = () => {
        if (!estaciones) return { nivel: 'bajo', texto: 'Cargando...', color: '#999' };
        const todasEstaciones = [...estaciones.lineaA, ...estaciones.lineaB, ...estaciones.metrocable];
        const countAlto = todasEstaciones.filter(e => e.estado === 'alto').length;
        const countMedio = todasEstaciones.filter(e => e.estado === 'medio').length;

        if (countAlto > 3) return { nivel: 'alto', texto: 'Alta congestión global', color: '#e74c3c' };
        if (countMedio > 5 || countAlto > 0) return { nivel: 'medio', texto: 'Retrasos moderados', color: '#f39c12' };
        return { nivel: 'bajo', texto: 'Flujo normal y ágil', color: '#2ecc71' };
    };

    const estadoGlobal = getEstadoGlobal();

    // Actualizar reporte de congestión en tiempo real (RF-21)
    const handleReport = async (estado) => {
        if (!selectedStation) return;
        try {
            const res = await reportarCongestion(selectedStation.nombre, estado);
            if (res.success) {
                alert(`¡Gracias! Has reportado congestión de nivel "${estado}" en la estación ${selectedStation.nombre}.`);
                fetchCongestionData(); // Recargar datos
            }
        } catch (err) {
            console.error(err);
            alert('Error al reportar congestión');
        }
    };

    // Cambiar configuración de suscripción (RF-25)
    const handleToggleSubscriptions = async (correoVal, pushVal) => {
        try {
            await updateSuscripcion(correoVal, pushVal);
            setRecibirCorreo(correoVal);
            setRecibirPush(pushVal);
        } catch (err) {
            console.error('Error al actualizar suscripciones:', err);
        }
    };

    if (loading) {
        return (
            <div className="wrapped-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#00ff88', flexDirection: 'column', gap: '1rem' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem' }}></i>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Cargando mapa en tiempo real...</p>
            </div>
        );
    }

    return (
        <div className="trafico-section">
            {/* Header con información */}
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
                    <p className="trafico-subtitle">Metro de Medellín</p>
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
                        <span className="control-label">Estaciones totales</span>
                        <span className="control-value">
                            {estaciones.lineaA.length + estaciones.lineaB.length + estaciones.metrocable.length}
                        </span>
                    </div>
                </div>

                <button className="btn-refresh" onClick={() => { setLoading(true); fetchCongestionData(); }}>
                    <i className="fas fa-sync-alt"></i>
                    Actualizar
                </button>
            </div>

            {/* Contenedor del mapa */}
            <div className="map-container-full">
                <div id="map-full" ref={mapRef}></div>

                {/* Panel lateral con leyenda, resumen y reportes */}
                <div className="trafico-sidebar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    
                    {/* Sección 1: Leyenda */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">
                            <i className="fas fa-info-circle"></i>
                            Leyenda de Congestión
                        </h3>
                        <div className="trafico-legend">
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: '#2ecc71' }}></div>
                                <div className="legend-text">
                                    <span className="legend-label" style={{ color: '#2ecc71' }}>Flujo Normal (Verde)</span>
                                </div>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: '#f39c12' }}></div>
                                <div className="legend-text">
                                    <span className="legend-label" style={{ color: '#f39c12' }}>Moderado (Amarillo)</span>
                                </div>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: '#e74c3c' }}></div>
                                <div className="legend-text">
                                    <span className="legend-label" style={{ color: '#e74c3c' }}>Alta Congestión (Rojo)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Suscripción a notificaciones (RF-24, RF-25) */}
                    <div className="sidebar-section subscription-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 className="sidebar-title">
                            <i className="fas fa-bell"></i>
                            Alertas y Suscripciones
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={recibirCorreo}
                                    onChange={(e) => handleToggleSubscriptions(e.target.checked, recibirPush)}
                                />
                                <span>Recibir alertas por correo</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={recibirPush}
                                    onChange={(e) => handleToggleSubscriptions(recibirCorreo, e.target.checked)}
                                />
                                <span>Notificaciones emergentes</span>
                            </label>
                        </div>
                    </div>

                    {/* Sección 3: Estación seleccionada & Reportar en tiempo real (RF-21) */}
                    {selectedStation ? (
                        <div className="sidebar-section station-detail" style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
                            <h3 className="sidebar-title">
                                <i className="fas fa-location-dot"></i>
                                Detalles de Estación
                            </h3>
                            <div className="station-detail-card">
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{selectedStation.nombre}</h4>
                                <div className="station-status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="status-dot" style={{
                                        display: 'inline-block',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: selectedStation.estado === 'alto' ? '#e74c3c' :
                                                   selectedStation.estado === 'medio' ? '#f39c12' : '#2ecc71'
                                    }}></span>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {selectedStation.estado === 'alto' ? '🔴 Alta congestión' :
                                         selectedStation.estado === 'medio' ? '🟡 Congestión moderada' : '🟢 Flujo normal'}
                                    </span>
                                </div>

                                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>¿Ves algo diferente? ¡Reporta como pasajero!</span>
                                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                                        <button
                                            onClick={() => handleReport('bajo')}
                                            style={{ flex: 1, padding: '0.4rem 0.2rem', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#2ecc71', color: '#000', fontWeight: 'bold', fontSize: '0.8rem' }}
                                        >
                                            Normal
                                        </button>
                                        <button
                                            onClick={() => handleReport('medio')}
                                            style={{ flex: 1, padding: '0.4rem 0.2rem', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#f39c12', color: '#000', fontWeight: 'bold', fontSize: '0.8rem' }}
                                        >
                                            Medio
                                        </button>
                                        <button
                                            onClick={() => handleReport('alto')}
                                            style={{ flex: 1, padding: '0.4rem 0.2rem', border: 'none', borderRadius: '4px', cursor: 'pointer', background: '#e74c3c', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem' }}
                                        >
                                            Alto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="sidebar-section" style={{ textAlign: 'center', padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                            <p>Haz clic en cualquier estación en el mapa para reportar tráfico o ver detalles.</p>
                        </div>
                    )}

                    {/* Sección 4: Resumen de congestión por líneas (RF-22) */}
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">
                            <i className="fas fa-route"></i>
                            Resumen de Líneas
                        </h3>
                        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                            <button
                                onClick={() => setActiveSummaryLine('lineaA')}
                                style={{ flex: 1, background: activeSummaryLine === 'lineaA' ? 'rgba(0,255,136,0.1)' : 'transparent', border: `1px solid ${activeSummaryLine === 'lineaA' ? '#00ff88' : 'rgba(255,255,255,0.05)'}`, color: '#fff', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                Línea A
                            </button>
                            <button
                                onClick={() => setActiveSummaryLine('lineaB')}
                                style={{ flex: 1, background: activeSummaryLine === 'lineaB' ? 'rgba(52,152,219,0.1)' : 'transparent', border: `1px solid ${activeSummaryLine === 'lineaB' ? '#3498db' : 'rgba(255,255,255,0.05)'}`, color: '#fff', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                Línea B
                            </button>
                            <button
                                onClick={() => setActiveSummaryLine('metrocable')}
                                style={{ flex: 1, background: activeSummaryLine === 'metrocable' ? 'rgba(155,89,182,0.1)' : 'transparent', border: `1px solid ${activeSummaryLine === 'metrocable' ? '#9b59b6' : 'rgba(255,255,255,0.05)'}`, color: '#fff', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                Cable
                            </button>
                        </div>

                        <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {estaciones[activeSummaryLine].map(est => {
                                const statusColor = est.estado === 'alto' ? '#e74c3c' :
                                                    est.estado === 'medio' ? '#f39c12' : '#2ecc71';
                                return (
                                    <div
                                        key={est.nombre}
                                        onClick={() => setSelectedStation(est)}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                                    >
                                        <span>{est.nombre}</span>
                                        <span style={{ color: statusColor, fontWeight: 'bold' }}>
                                            {est.estado === 'alto' ? 'Alto' : est.estado === 'medio' ? 'Medio' : 'Normal'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas inferiores */}
            <div className="trafico-stats">
                <div className="stat-box">
                    <div className="stat-icon" style={{ background: 'rgba(46, 204, 113, 0.2)' }}>
                        <i className="fas fa-check-circle" style={{ color: '#2ecc71' }}></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {estaciones.lineaA.filter(e => e.estado === 'bajo').length + 
                             estaciones.lineaB.filter(e => e.estado === 'bajo').length}
                        </div>
                        <div className="stat-label">Estaciones con flujo normal</div>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ background: 'rgba(243, 156, 18, 0.2)' }}>
                        <i className="fas fa-exclamation-circle" style={{ color: '#f39c12' }}></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {estaciones.lineaA.filter(e => e.estado === 'medio').length + 
                             estaciones.lineaB.filter(e => e.estado === 'medio').length}
                        </div>
                        <div className="stat-label">Con congestión moderada</div>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ background: 'rgba(231, 76, 60, 0.2)' }}>
                        <i className="fas fa-times-circle" style={{ color: '#e74c3c' }}></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">
                            {estaciones.lineaA.filter(e => e.estado === 'alto').length + 
                             estaciones.lineaB.filter(e => e.estado === 'alto').length}
                        </div>
                        <div className="stat-label">Con alta congestión</div>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ background: 'rgba(52, 152, 219, 0.2)' }}>
                        <i className="fas fa-clock" style={{ color: '#3498db' }}></i>
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">~5 min</div>
                        <div className="stat-label">Tiempo promedio de espera</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trafico;