import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import './Wrapped.css';

const Wrapped = () => {
    const doughnutChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const wrappedCardRef = useRef(null);
    const chartInstances = useRef([]);

    const [wrappedData, setWrappedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [periodo, setPeriodo] = useState('anual');

    // Obtener ID de usuario logueado
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser.id_usuario || storedUser.id || 1;

    useEffect(() => {
        const fetchWrappedData = async () => {
            setLoading(true);
            try {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${baseUrl}/api/usuarios/${userId}/wrapped?periodo=${periodo}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del Wrapped');
                }
                const result = await response.json();
                setWrappedData(result);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWrappedData();
    }, [userId, periodo]);

    // Inicializar gráficos y contadores cuando se carguen los datos
    useEffect(() => {
        if (!wrappedData) return;

        const initCharts = () => {
            // Limpiar gráficos anteriores
            chartInstances.current.forEach(chart => chart.destroy());
            chartInstances.current = [];

            // Doughnut Chart
            const doughnutCtx = document.getElementById('doughnutChart');
            if (doughnutCtx) {
                const doughnutChart = new Chart(doughnutCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Bajo', 'Medio', 'Alto'],
                        datasets: [{
                            data: [wrappedData.congestion.bajo, wrappedData.congestion.medio, wrappedData.congestion.alto],
                            backgroundColor: ['#00ff88', '#f1c40f', '#e74c3c'],
                            hoverOffset: 4,
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return `${context.label}: ${context.raw}%`;
                                    }
                                }
                            }
                        }
                    }
                });
                chartInstances.current.push(doughnutChart);
            }

            // Line Chart
            const lineCtx = document.getElementById('lineChart');
            if (lineCtx) {
                const lineChart = new Chart(lineCtx, {
                    type: 'line',
                    data: {
                        labels: ['6d', '5d', '4d', '3d', '2d', '1d', 'Hoy'],
                        datasets: [{
                            label: 'Actividad',
                            data: wrappedData.last7,
                            fill: true,
                            backgroundColor: 'rgba(0, 255, 136, 0.12)',
                            borderColor: '#00ff88',
                            tension: 0.3,
                            borderWidth: 2,
                            pointBackgroundColor: '#00ff88',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 5
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            },
                            x: {
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                },
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.7)'
                                }
                            }
                        }
                    }
                });
                chartInstances.current.push(lineChart);
            }
        };

        initCharts();

        // Animación de números
        const animateNumbers = () => {
            const countUp = (elementId, target, duration = 700) => {
                const element = document.getElementById(elementId);
                if (!element) return;

                let start = 0;
                const step = Math.ceil(target / (duration / 20));
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) {
                        start = target;
                        clearInterval(timer);
                    }
                    element.innerText = start;
                }, 20);
            };

            countUp('totalSessions', wrappedData.totalSessions);
            countUp('entriesCount', wrappedData.entries);
            countUp('alertsCount', wrappedData.alertsViewed);
            countUp('daysActive', wrappedData.daysActive);
            countUp('chatInteractions', wrappedData.chatInteractions);
        };

        setTimeout(animateNumbers, 500);

        // Generar heatmap
        const generateHeatmap = () => {
            const heatEl = document.getElementById('heatmap');
            if (!heatEl) return;

            heatEl.innerHTML = '';
            const morning = wrappedData.last7.slice(0, 3).reduce((a, b) => a + b, 0);
            const midday = wrappedData.last7.slice(3, 5).reduce((a, b) => a + b, 0);
            const evening = wrappedData.last7.slice(5, 7).reduce((a, b) => a + b, 0);

            const arr = [
                { label: 'Mañana', v: morning },
                { label: 'Tarde', v: midday },
                { label: 'Noche', v: evening }
            ];

            const maxVal = Math.max(...arr.map(x => x.v), 1);

            arr.forEach(x => {
                const el = document.createElement('div');
                const intensity = Math.round((x.v / maxVal) * 220);
                el.className = 'heat-cell';
                el.style.background = `linear-gradient(135deg, 
            rgba(40, ${120 + Math.round(intensity / 2)}, 40, 0.2), 
            rgba(${20 + Math.round(intensity / 3)}, ${60 + Math.round(intensity / 3)}, 20, 0.3)
          )`;
                el.innerHTML = `
            <div style="font-weight:700">${x.label}</div>
            <div class="small-muted">${x.v} activ.</div>
          `;
                heatEl.appendChild(el);
            });
        };

        generateHeatmap();

        // Limpiar gráficos al desmontar
        return () => {
            chartInstances.current.forEach(chart => chart.destroy());
        };
    }, [wrappedData]);

    // Descargar como imagen
    const downloadAsImage = async () => {
        if (!wrappedCardRef.current) return;

        // Efecto de confeti
        for (let i = 0; i < 20; i++) {
            const el = document.createElement('div');
            const s = Math.random() * 8 + 4;
            el.style.position = 'fixed';
            el.style.left = (window.innerWidth / 2 + (Math.random() * 300 - 150)) + 'px';
            el.style.top = (window.innerHeight / 2 + (Math.random() * 200 - 100)) + 'px';
            el.style.width = s + 'px';
            el.style.height = s + 'px';
            el.style.background = ['#00ff88', '#00a86b', '#f1c40f', '#e74c3c'][Math.floor(Math.random() * 4)];
            el.style.opacity = '0.95';
            el.style.borderRadius = '50%';
            el.style.zIndex = '9999';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 900 + Math.random() * 800);
        }

        try {
            const canvas = await html2canvas(wrappedCardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0a0a0a'
            });
            const data = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = data;
            link.download = `wrapped_metro_${userId || 'user'}.png`;
            link.click();
        } catch (error) {
            console.error('Error al descargar la imagen:', error);
        }
    };

    // Compartir
    const shareWrapped = async () => {
        if (!wrappedCardRef.current) return;

        try {
            const canvas = await html2canvas(wrappedCardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0a0a0a'
            });
            const data = canvas.toDataURL('image/png');

            // Convertir data URL a blob
            const response = await fetch(data);
            const blob = await response.blob();

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [blob] })) {
                const file = new File([blob], 'wrapped_metro.png', { type: 'image/png' });
                await navigator.share({
                    files: [file],
                    title: 'Mi Wrapped MetroMed',
                    text: '¡Mira mi resumen del Metro de Medellín! 🚇'
                });
            } else {
                // Fallback: descargar
                downloadAsImage();
            }
        } catch (error) {
            console.error('Error al compartir:', error);
            downloadAsImage();
        }
    };

    // Datos de chat
    const chatMessages = [
        { who: 'Usuario', text: '¿Hay retrasos hoy?' },
        { who: 'Asistente', text: 'No hay alertas críticas en este momento.' },
        { who: 'Usuario', text: 'Muéstrame líneas de ayuda.' },
        { who: 'Asistente', text: 'Línea 123 (24/7) - Tel: 604-1234567' }
    ];

    // Insignias
    const badges = [
        { title: 'Explorador', desc: 'Usaste el chatbot 5 veces', color: '#00ff88' },
        { title: 'Alerta Atenta', desc: 'Leíste 3 alertas', color: '#f1c40f' },
        { title: 'Constante', desc: '8 días activos', color: '#00a86b' }
    ];

    if (loading) {
        return (
            <div className="wrapped-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#00ff88', flexDirection: 'column', gap: '1rem' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem' }}></i>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Cargando tu Wrapped de MetroMed...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wrapped-error" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: '#e74c3c', flexDirection: 'column', gap: '1rem' }}>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Error: {error}</p>
            </div>
        );
    }

    return (
        <div id="wrapped" className="wrapped-section">
            <div className="wrapped" id="wrappedCard" ref={wrappedCardRef}>
                {/* HERO */}
                <div className="wrapped-hero mb-4">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="small-muted">Wrapped de {wrappedData?.nombre} — Metro de Medellín</span>
                            <select
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}
                                className="form-select form-select-sm period-select"
                                style={{ width: 'auto', background: '#112233', color: '#fff', border: '1px solid #00ff88', fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                <option value="anual">Resumen Anual</option>
                                <option value="mensual">Resumen Mensual</option>
                            </select>
                        </div>
                        <div className="big-num" id="totalSessions">0</div>
                        <div className="small-muted">{periodo === 'mensual' ? 'Sesiones este mes' : 'Sesiones este año'}</div>
                    </div>

                    <div className="hero-right">
                        <div className="badges">
                            <span className="badge-metro">Usuario Activo</span>
                            <span className="badge-metro">Explorador</span>
                            <span className="badge-metro">Constante</span>
                        </div>
                        <div className="hero-actions">
                            <button
                                id="shareBtn"
                                className="share-btn me-2"
                                onClick={shareWrapped}
                            >
                                <i className="fas fa-share-alt"></i> Compartir
                            </button>
                            <button
                                id="downloadBtn"
                                className="btn-outline-light"
                                onClick={downloadAsImage}
                            >
                                <i className="fas fa-download"></i> Descargar
                            </button>
                        </div>
                    </div>
                </div>

                {/* TOP ROW */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                        <div className="chart-card">
                            <h6 className="mb-3">Distribución de congestión</h6>
                            <div style={{ height: '220px' }}>
                                <canvas id="doughnutChart"></canvas>
                            </div>
                            <div className="d-flex justify-content-between mt-3 small-muted">
                                <div><span style={{ color: '#00ff88' }}>●</span> Bajo</div>
                                <div><span style={{ color: '#f1c40f' }}>●</span> Medio</div>
                                <div><span style={{ color: '#e74c3c' }}>●</span> Alto</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="kpi">
                                    <div className="h5" id="entriesCount">0</div>
                                    <div className="small-muted">Reportes hechos</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="kpi">
                                    <div className="h5" id="alertsCount">0</div>
                                    <div className="small-muted">Alertas vistas</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="kpi">
                                    <div className="h5" id="daysActive">0</div>
                                    <div className="small-muted">Días activos</div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="kpi">
                                    <div className="h5" id="chatInteractions">0</div>
                                    <div className="small-muted">Interacciones bot</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MIDDLE ROW */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-lg-8">
                        <div className="chart-card">
                            <h6 className="mb-3">Actividad últimos 7 días</h6>
                            <div style={{ height: '140px' }}>
                                <canvas id="lineChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-4">
                        <div className="chart-card">
                            <h6 className="mb-3">Horas pico (resumen)</h6>
                            <div id="heatmap" style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '10px' }}></div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="row g-3">
                    <div className="col-12 col-md-7">
                        <div className="chart-card" style={{ minHeight: '140px' }}>
                            <h6 className="mb-3">Interacciones recientes con el Asistente</h6>
                            <div id="chatTimeline">
                                {chatMessages.map((msg, index) => (
                                    <div key={index} className="chat-snippet">
                                        <strong>{msg.who}:</strong> {msg.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-5">
                        <div className="chart-card">
                            <h6 className="mb-3">Logros</h6>
                            <div id="badgesList">
                                {badges.map((badge, index) => (
                                    <div key={index} className="badge-item">
                                        <div style={{ fontWeight: '700', color: badge.color }}>{badge.title}</div>
                                        <div className="small-muted">{badge.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="wrapped-footer mt-4">
                    <p className="small-muted text-center mb-0">
                        *Datos actualizados al {new Date().toLocaleDateString('es-MX')}
                    </p>
                    <p className="text-center mb-0">
                        <small>Gracias por usar MetroMed. 🚇</small>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Wrapped;