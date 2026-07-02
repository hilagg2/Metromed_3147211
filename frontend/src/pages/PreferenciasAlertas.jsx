import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { getPreferencias, savePreferencias } from '../services/alertasService';

const PreferenciasAlertas = () => {
    const [prefs, setPrefs] = useState({
        canal_panel: true,
        canal_correo: false,
        alerta_retraso: true,
        alerta_cierre: true,
        alerta_mantenimiento: true,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                const res = await getPreferencias();
                if (res.success && res.data) {
                    setPrefs(res.data);
                }
            } catch (error) {
                toast.error('Error al cargar las preferencias');
            } finally {
                setLoading(false);
            }
        };
        fetchPrefs();
    }, []);

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setPrefs((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await savePreferencias(prefs);
            if (res.success) {
                toast.success('Preferencias actualizadas correctamente', {
                    style: { background: '#050a08', color: '#00ff88', border: '1px solid #00ff88' },
                    icon: '✅'
                });
                if (res.data) setPrefs(res.data);
            } else {
                toast.error(res.message || 'Error al guardar');
            }
        } catch (error) {
            toast.error('Error de conexión al guardar preferencias');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ color: '#00ff88', textAlign: 'center', padding: '2rem' }}>Cargando preferencias... <i className="fas fa-spinner fa-spin"></i></div>;
    }

    return (
        <div style={{
            background: 'rgba(5, 15, 10, 0.8)',
            border: '1px solid rgba(0,255,136,0.15)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: '#fff',
            marginTop: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}>
            <Toaster position="top-right" />
            <h3 style={{
                color: '#00ff88',
                borderBottom: '1px solid rgba(0,255,136,0.2)',
                paddingBottom: '0.8rem',
                marginBottom: '1.2rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <i className="fas fa-bell-slash"></i> Preferencias de Alertas
            </h3>
            
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Configura qué alertas deseas recibir y por cuáles canales. Estos cambios aplican de inmediato.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {/* Columna Canales */}
                <div>
                    <h4 style={{ color: '#00b8ff', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Canales de Recepción</h4>
                    
                    <div className="config-item" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                        <span>
                            <i className="fas fa-desktop" style={{ color: '#00ff88', marginRight: '8px' }}></i>
                            Panel Web (Tiempo Real)
                        </span>
                        <label className="toggle-switch">
                            <input type="checkbox" name="canal_panel" checked={prefs.canal_panel} onChange={handleChange} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="config-item" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px' }}>
                        <span>
                            <i className="fas fa-envelope" style={{ color: '#ffaa00', marginRight: '8px' }}></i>
                            Correo Electrónico
                        </span>
                        <label className="toggle-switch">
                            <input type="checkbox" name="canal_correo" checked={prefs.canal_correo} onChange={handleChange} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                {/* Columna Tipos */}
                <div>
                    <h4 style={{ color: '#00b8ff', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Tipos de Eventos</h4>
                    
                    <div className="config-item" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                        <span><span style={{ marginRight: '8px' }}>🕐</span> Retrasos</span>
                        <label className="toggle-switch">
                            <input type="checkbox" name="alerta_retraso" checked={prefs.alerta_retraso} onChange={handleChange} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="config-item" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px', marginBottom: '0.5rem' }}>
                        <span><span style={{ marginRight: '8px' }}>🚫</span> Cierres de Estación</span>
                        <label className="toggle-switch">
                            <input type="checkbox" name="alerta_cierre" checked={prefs.alerta_cierre} onChange={handleChange} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    <div className="config-item" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '8px' }}>
                        <span><span style={{ marginRight: '8px' }}>🔧</span> Mantenimientos</span>
                        <label className="toggle-switch">
                            <input type="checkbox" name="alerta_mantenimiento" checked={prefs.alerta_mantenimiento} onChange={handleChange} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    style={{
                        padding: '0.7rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #00ff88',
                        background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,184,255,0.1) 100%)',
                        color: '#00ff88',
                        fontWeight: 'bold',
                        cursor: saving ? 'wait' : 'pointer',
                        transition: 'all 0.3s'
                    }}
                >
                    {saving ? (
                        <><i className="fas fa-spinner fa-spin"></i> Guardando...</>
                    ) : (
                        <><i className="fas fa-save"></i> Guardar Preferencias</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PreferenciasAlertas;
