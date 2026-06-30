import React, { useEffect, useRef, useState } from 'react';
import './Trafico.css';

const Trafico = ({ onBack }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [trafficLevel, setTrafficLevel] = useState('normal');
    const [updateTime, setUpdateTime] = useState(new Date());
    const [estaciones, setEstaciones] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCongestionData = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/congestion');
            if (!response.ok) throw new Error('Error al obtener datos de congestión');
            const data = await response.json();
            setEstaciones(data.estaciones);
            setUpdateTime(new Date(data.updateTime));
            setTrafficLevel(data.isPeakHour ? 'alto' : 'normal');
        } catch (error) {
            console.error('Error fetching congestion:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCongestionData();
    }, []);

    useEffect(() => {
        if (!estaciones) return;

        // Cargar Leaflet.js de forma dinámica
        const loadLeaflet = () => {
            // Cargar CSS
            if (!document.getElementById('leaflet-css')) {
                const link = document.createElement('link');
                link.id = 'leaflet-css';
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(link);
            }

            // Cargar JS
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

                // Cargar mapa base en modo oscuro (CartoDB Dark Matter)
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
                        
                        // Marcador circular de Leaflet
                        const marker = L.circleMarker([est.lat, est.lng], {
                            radius: 8,
                            fillColor: color,
                            color: '#ffffff',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.9
                        }).addTo(map);

                        // Popup del marcador
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

                        // Evento de clic
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
        const altoCount = todasEstaciones.filter(e => e.estado === 'alto').length;
        const medioCount = todasEstaciones.filter(e => e.estado === 'medio').length;
        
        if (altoCount > 5) return { nivel: 'alto', texto: 'Alta congestión', color: '#e74c3c' };
        if (medioCount > 8 || altoCount > 2) return { nivel: 'medio', texto: 'Congestión moderada', color: '#f39c12' };
        return { nivel: 'bajo', texto: 'Flujo normal', color: '#2ecc71' };
    };

    const estadoGlobal = getEstadoGlobal();

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

                {/* Panel lateral con leyenda */}
                <div className="trafico-sidebar">
                    <div className="sidebar-section">
                        <h3 className="sidebar-title">
                            <i className="fas fa-info-circle"></i>
                            Leyenda
                        </h3>
                        <div className="trafico-legend">
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: '#2ecc71' }}></div>
                                <div className="legend-text">
                                    <span className="legend-label">Flujo Normal</span>
                                    <span className="legend-desc">Sin retrasos</span>
                                </div>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: '#f39c12' }}></div>
                                <div className="legend-text">
                                    <span className="legend-label">Moderado</span>
                                    <span className="legend-desc">Algunos retrasos</span>
                                </div>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: '#e74c3c' }}></div>
                                <div className="legend-text">
                                    <span className="legend-label">Alta Congestión</span>
                                    <span className="legend-desc">Retrasos significativos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-section">
                        <h3 className="sidebar-title">
                            <i className="fas fa-route"></i>
                            Líneas
                        </h3>
                        <div className="lineas-info">
                            <div className="linea-badge" style={{ borderLeft: '4px solid #2ecc71' }}>
                                <div className="linea-name">Línea A</div>
                                <div className="linea-stations">{estaciones.lineaA.length} estaciones</div>
                            </div>
                            <div className="linea-badge" style={{ borderLeft: '4px solid #3498db' }}>
                                <div className="linea-name">Línea B</div>
                                <div className="linea-stations">{estaciones.lineaB.length} estaciones</div>
                            </div>
                            <div className="linea-badge" style={{ borderLeft: '4px solid #9b59b6' }}>
                                <div className="linea-name">Metrocable</div>
                                <div className="linea-stations">{estaciones.metrocable.length} estaciones</div>
                            </div>
                        </div>
                    </div>

                    {selectedStation && (
                        <div className="sidebar-section station-detail">
                            <h3 className="sidebar-title">
                                <i className="fas fa-location-dot"></i>
                                Estación Seleccionada
                            </h3>
                            <div className="station-detail-card">
                                <h4>{selectedStation.nombre}</h4>
                                <div className="station-status">
                                    <span className="status-dot" style={{
                                        background: selectedStation.estado === 'alto' ? '#e74c3c' :
                                                   selectedStation.estado === 'medio' ? '#f39c12' : '#2ecc71'
                                    }}></span>
                                    <span>
                                        {selectedStation.estado === 'alto' ? 'Alta congestión' :
                                         selectedStation.estado === 'medio' ? 'Congestión moderada' : 'Flujo normal'}
                                    </span>
                                </div>
                                <p className="station-update">
                                    Actualizado: {updateTime.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="sidebar-section alerts-section">
                        <h3 className="sidebar-title">
                            <i className="fas fa-exclamation-triangle"></i>
                            Alertas Activas
                        </h3>
                        <div className="alert-item warning">
                            <i className="fas fa-tools"></i>
                            <div className="alert-content">
                                <div className="alert-title">Mantenimiento programado</div>
                                <div className="alert-desc">Línea B - Retrasos de 5-10 min</div>
                            </div>
                        </div>
                        <div className="alert-item info">
                            <i className="fas fa-info-circle"></i>
                            <div className="alert-content">
                                <div className="alert-title">Hora pico</div>
                                <div className="alert-desc">Mayor afluencia de pasajeros</div>
                            </div>
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
                        <div className="stat-value">~8 min</div>
                        <div className="stat-label">Tiempo promedio de espera</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trafico;