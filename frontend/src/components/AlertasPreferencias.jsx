import React, { useEffect, useState } from 'react';
import { getPreferencias, savePreferencias } from '../services/alertasService';

const Toggle = ({ id, label, checked, onChange, disabled }) => (
    <label htmlFor={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
        <span style={{ fontSize: '0.88rem', color: '#c0cfdf' }}>{label}</span>
        <div
            onClick={() => !disabled && onChange(!checked)}
            style={{
                width: 42, height: 22, borderRadius: 11,
                background: checked ? '#2ecc71' : '#2a3d55',
                position: 'relative', transition: 'background 0.25s', flexShrink: 0,
                boxShadow: checked ? '0 0 8px rgba(46,204,113,0.4)' : 'none',
            }}
        >
            <div style={{
                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3, left: checked ? 23 : 3,
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            }} />
        </div>
    </label>
);

/**
 * RF-41, RF-42 — Panel de preferencias de alertas del usuario.
 */
const AlertasPreferencias = () => {
    const [prefs,    setPrefs]   = useState(null);
    const [saving,   setSaving]  = useState(false);
    const [mensaje,  setMensaje] = useState(null);

    useEffect(() => {
        getPreferencias().then(({ data }) => setPrefs(data));
    }, []);

    const handleChange = (key, value) => {
        setPrefs(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMensaje(null);
        const { success, message } = await savePreferencias(prefs);
        setSaving(false);
        setMensaje({ ok: success, text: message }); // RN-41.3, RN-42.3
        setTimeout(() => setMensaje(null), 3000);
    };

    if (!prefs) return <div style={{ color: '#5d7a9a', padding: '2rem', textAlign: 'center' }}>Cargando preferencias…</div>;

    return (
        <div style={{ maxWidth: 480, margin: '0 auto', background: '#0f1929', borderRadius: 14, padding: '1.5rem', color: '#e0e6f0', fontFamily: 'Inter, Segoe UI, sans-serif' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚙️ Preferencias de Alertas
            </h3>

            {/* Canales (RF-41, RN-41.2) */}
            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#3a5470', marginBottom: '0.5rem' }}>Canales de recepción</p>
            <Toggle id="canal_panel"   label="🖥️ Panel de la aplicación" checked={!!prefs.canal_panel}   onChange={v => handleChange('canal_panel', v)} />
            <Toggle id="canal_correo"  label="📧 Correo electrónico"      checked={!!prefs.canal_correo}  onChange={v => handleChange('canal_correo', v)} />

            {/* Tipos (RF-42, RN-42.1) */}
            <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#3a5470', marginBottom: '0.5rem', marginTop: '1.5rem' }}>Tipos de alerta</p>
            <Toggle id="alerta_retraso"       label="🕐 Retrasos"            checked={!!prefs.alerta_retraso}       onChange={v => handleChange('alerta_retraso', v)} />
            <Toggle id="alerta_cierre"        label="🚫 Cierres de estación"  checked={!!prefs.alerta_cierre}        onChange={v => handleChange('alerta_cierre', v)} />
            <Toggle id="alerta_mantenimiento" label="🔧 Mantenimiento"        checked={!!prefs.alerta_mantenimiento} onChange={v => handleChange('alerta_mantenimiento', v)} />

            {/* Guardar */}
            <button
                onClick={handleSave}
                disabled={saving}
                style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', borderRadius: 10, border: 'none', background: saving ? '#1e3a5f' : '#1a6ec4', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            >
                {saving ? 'Guardando…' : 'Guardar preferencias'}
            </button>

            {/* Confirmación (RN-41.3, RN-42.3) */}
            {mensaje && (
                <div style={{ marginTop: '0.75rem', padding: '0.6rem 1rem', borderRadius: 8, background: mensaje.ok ? 'rgba(46,204,113,0.12)' : 'rgba(231,76,60,0.12)', color: mensaje.ok ? '#2ecc71' : '#e74c3c', fontSize: '0.82rem', textAlign: 'center', transition: 'opacity 0.3s' }}>
                    {mensaje.ok ? '✅ ' : '❌ '}{mensaje.text}
                </div>
            )}
        </div>
    );
};

export default AlertasPreferencias;
