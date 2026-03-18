import React, { useEffect, useRef, useState } from 'react';
import './Trafico.css';

const Trafico = ({ onBack }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [selectedStation, setSelectedStation] = useState(null);
    const [trafficLevel, setTrafficLevel] = useState('normal');
    const [updateTime, setUpdateTime] = useState(new Date());

    // Estaciones del Metro de Medellín con coordenadas reales
    const estaciones = {
        lineaA: [
            { nombre: "Niquía", lat: 6.3389, lng: -75.5431, estado: "bajo" },
            { nombre: "Bello", lat: 6.3378, lng: -75.5613, estado: "bajo" },
            { nombre: "Madera", lat: 6.3209, lng: -75.5639, estado: "medio" },
            { nombre: "Acevedo", lat: 6.3005, lng: -75.5683, estado: "medio" },
            { nombre: "Tricentenario", lat: 6.2803, lng: -75.5728, estado: "bajo" },
            { nombre: "Caribe", lat: 6.2725, lng: -75.5750, estado: "bajo" },
            { nombre: "Universidad", lat: 6.2678, lng: -75.5683, estado: "alto" },
            { nombre: "Hospital", lat: 6.2621, lng: -75.5656, estado: "medio" },
            { nombre: "Prado", lat: 6.2518, lng: -75.5667, estado: "medio" },
            { nombre: "Parque Berrío", lat: 6.2515, lng: -75.5697, estado: "alto" },
            { nombre: "San Antonio", lat: 6.2473, lng: -75.5696, estado: "alto" },
            { nombre: "Alpujarra", lat: 6.2482, lng: -75.5746, estado: "medio" },
            { nombre: "Exposiciones", lat: 6.2438, lng: -75.5800, estado: "medio" },
            { nombre: "Industriales", lat: 6.2368, lng: -75.5890, estado: "bajo" },
            { nombre: "Poblado", lat: 6.2107, lng: -75.5722, estado: "medio" },
            { nombre: "Aguacatala", lat: 6.1974, lng: -75.5768, estado: "bajo" },
            { nombre: "Ayurá", lat: 6.1807, lng: -75.5849, estado: "bajo" },
            { nombre: "Envigado", lat: 6.1692, lng: -75.5923, estado: "bajo" },
            { nombre: "Itagüí", lat: 6.1616, lng: -75.6086, estado: "bajo" },
            { nombre: "Sabaneta", lat: 6.1519, lng: -75.6161, estado: "bajo" },
            { nombre: "La Estrella", lat: 6.1362, lng: -75.6450, estado: "bajo" }
        ],
        lineaB: [
            { nombre: "San Antonio", lat: 6.2473, lng: -75.5696, estado: "alto" },
            { nombre: "Cisneros", lat: 6.2513, lng: -75.5625, estado: "medio" },
            { nombre: "San José", lat: 6.2589, lng: -75.5583, estado: "medio" },
            { nombre: "Miraflores", lat: 6.2640, lng: -75.5540, estado: "bajo" },
            { nombre: "Floresta", lat: 6.2679, lng: -75.5510, estado: "bajo" }
        ],
        metrocable: [
            { nombre: "Acevedo", lat: 6.3005, lng: -75.5683, estado: "medio", tipo: "K" },
            { nombre: "Santo Domingo", lat: 6.3178, lng: -75.5489, estado: "bajo", tipo: "K" },
            { nombre: "San Javier", lat: 6.2560, lng: -75.6216, estado: "medio", tipo: "J" },
            { nombre: "Oriente", lat: 6.2789, lng: -75.5300, estado: "bajo", tipo: "L" }
        ]
    };

    useEffect(() => {
        // Función para cargar Google Maps
        const loadGoogleMaps = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=visualization`;
            script.async = true;
            script.defer = true;
            script.onload = initMap;
            document.head.appendChild(script);
        };

        const initMap = () => {
            if (mapRef.current && !mapInstance.current && window.google) {
                // Configuración del mapa
                mapInstance.current = new window.google.maps.Map(mapRef.current, {
                    center: { lat: 6.2476, lng: -75.5658 },
                    zoom: 13,
                    styles: [
                        {
                            "featureType": "all",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#1a1a1a" }]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#ffffff" }]
                        },
                        {
                            "featureType": "all",
                            "elementType": "labels.text.stroke",
                            "stylers": [{ "color": "#000000" }, { "lightness": 13 }]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#0f3443" }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#2a2a2a" }]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#3a3a3a" }]
                        }
                    ],
                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: true
                });

                // Dibujar Línea A
                const lineaAPath = estaciones.lineaA.map(est => ({ lat: est.lat, lng: est.lng }));
                new window.google.maps.Polyline({
                    path: lineaAPath,
                    geodesic: true,
                    strokeColor: '#2ecc71',
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                    map: mapInstance.current
                });

                // Dibujar Línea B
                const lineaBPath = estaciones.lineaB.map(est => ({ lat: est.lat, lng: est.lng }));
                new window.google.maps.Polyline({
                    path: lineaBPath,
                    geodesic: true,
                    strokeColor: '#3498db',
                    strokeOpacity: 0.8,
                    strokeWeight: 5,
                    map: mapInstance.current
                });

                // Añadir marcadores para todas las estaciones
                const addMarkers = (estacionesArray, linea) => {
                    estacionesArray.forEach(estacion => {
                        const color = estacion.estado === 'alto' ? '#e74c3c' : 
                                     estacion.estado === 'medio' ? '#f39c12' : '#2ecc71';
                        
                        const marker = new window.google.maps.Marker({
                            position: { lat: estacion.lat, lng: estacion.lng },
                            map: mapInstance.current,
                            title: estacion.nombre,
                            icon: {
                                path: window.google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: color,
                                fillOpacity: 0.9,
                                strokeColor: '#ffffff',
                                strokeWeight: 2
                            }
                        });

                        const infoWindow = new window.google.maps.InfoWindow({
                            content: `
                                <div style="color: #000; padding: 10px;">
                                    <h3 style="margin: 0 0 8px 0; color: ${color};">${estacion.nombre}</h3>
                                    <p style="margin: 5px 0;">
                                        <strong>Línea:</strong> ${linea}
                                    </p>
                                    <p style="margin: 5px 0;">
                                        <strong>Estado:</strong> 
                                        <span style="color: ${color}; font-weight: bold;">
                                            ${estacion.estado === 'alto' ? '🔴 Alta congestión' : 
                                              estacion.estado === 'medio' ? '🟡 Moderado' : '🟢 Fluido'}
                                        </span>
                                    </p>
                                    <p style="margin: 5px 0; font-size: 0.9em; color: #666;">
                                        Actualizado: ${updateTime.toLocaleTimeString()}
                                    </p>
                                </div>
                            `
                        });

                        marker.addListener('click', () => {
                            infoWindow.open(mapInstance.current, marker);
                            setSelectedStation(estacion);
                        });
                    });
                };

                addMarkers(estaciones.lineaA, 'Línea A');
                addMarkers(estaciones.lineaB, 'Línea B');
                addMarkers(estaciones.metrocable, 'Metrocable');

                // Dibujar rutas de Metrocable con líneas punteadas
                estaciones.metrocable.forEach((estacion, index) => {
                    if (index < estaciones.metrocable.length - 1 && 
                        estaciones.metrocable[index + 1].tipo === estacion.tipo) {
                        new window.google.maps.Polyline({
                            path: [
                                { lat: estacion.lat, lng: estacion.lng },
                                { lat: estaciones.metrocable[index + 1].lat, lng: estaciones.metrocable[index + 1].lng }
                            ],
                            geodesic: true,
                            strokeColor: '#9b59b6',
                            strokeOpacity: 0,
                            strokeWeight: 0,
                            icons: [{
                                icon: {
                                    path: 'M 0,-1 0,1',
                                    strokeOpacity: 1,
                                    scale: 3
                                },
                                offset: '0',
                                repeat: '20px'
                            }],
                            map: mapInstance.current
                        });
                    }
                });
            }
        };

        // Verificar si Google Maps ya está cargado
        if (window.google && window.google.maps) {
            initMap();
        } else {
            loadGoogleMaps();
        }

        // Actualizar hora cada minuto
        const interval = setInterval(() => {
            setUpdateTime(new Date());
        }, 60000);

        return () => {
            clearInterval(interval);
            if (mapInstance.current) {
                mapInstance.current = null;
            }
        };
    }, []);

    const getEstadoGlobal = () => {
        const todasEstaciones = [...estaciones.lineaA, ...estaciones.lineaB, ...estaciones.metrocable];
        const altoCount = todasEstaciones.filter(e => e.estado === 'alto').length;
        const medioCount = todasEstaciones.filter(e => e.estado === 'medio').length;
        
        if (altoCount > 5) return { nivel: 'alto', texto: 'Alta congestión', color: '#e74c3c' };
        if (medioCount > 8 || altoCount > 2) return { nivel: 'medio', texto: 'Congestión moderada', color: '#f39c12' };
        return { nivel: 'bajo', texto: 'Flujo normal', color: '#2ecc71' };
    };

    const estadoGlobal = getEstadoGlobal();

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

                <button className="btn-refresh" onClick={() => setUpdateTime(new Date())}>
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