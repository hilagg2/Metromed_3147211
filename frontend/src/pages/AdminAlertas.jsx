import React, { useEffect, useState } from 'react';
import { crearAlerta, getHistorialGlobal } from '../services/alertasService';

const TIPOS = [
    { value: 'retraso',         label: '🕐 Retraso' },
    { value: 'cierre_estacion', label: '🚫 Cierre de Estación' },
    { value: 'mantenimiento',   label: '🔧 Mantenimiento' },
];

const TIPO_COLOR = {
    retraso:          '#ff0055',
    cierre_estacion:  '#e74c3c',
    mantenimiento:    '#f39c12',
};

/**
 * RF-44, RF-46 — Panel del Administrador para crear alertas y ver historial global.
 */
const AdminAlertas = () => {
    const [form, setForm] = useState({
        tipo_evento:       'retraso',
        titulo:            '',
        descripcion:       '',
        entidad_afectada:  '',
    });
    const [enviando,  setEnviando]  = useState(false);
    const [resultado, setResultado] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [tab,       setTab]       = useState('crear');

    const fetchHistorial = async () => {
        const { data } = await getHistorialGlobal();
        setHistorial(data || []);
    };

    useEffect(() => {
        if (tab === 'historial') fetchHistorial();
    }, [tab]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setResultado(null);
        try {
            const res = await crearAlerta(form);
            setResultado({ ok: res.success, text: res.message });
            if (res.success) setForm(f => ({ ...f, titulo: '', descripcion: '', entidad_afectada: '' }));
        } catch {
            setResultado({ ok: false, text: 'Error de red al enviar la alerta.' });
        }
        setEnviando(false);
        setTimeout(() => setResultado(null), 4000);
    };

    const fieldStyle = {
        width: '100%', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid rgba(0, 255, 136, 0.2)',
        background: 'rgba(5, 15, 10, 0.95)', color: '#00ff88', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
        boxShadow: 'inset 0 0 5px rgba(0,255,136,0.05)'
    };
    const labelStyle = { display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#00b8ff', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.35rem' };

    return (
        <div style={{ fontFamily: 'Inter, Segoe UI, sans-serif', color: '#fff' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00ff88', textShadow: '0 0 10px rgba(0,255,136,0.3)' }}>
                🔔 Gestión de Alertas
            </h2>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[{ id: 'crear', label: '📤 Crear Alerta' }, { id: 'historial', label: '📋 Historial Global' }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{
                        padding: '0.5rem 1rem', borderRadius: 8, border: tab === t.id ? '1px solid #00ff88' : '1px solid rgba(0,255,136,0.1)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
                        background: tab === t.id ? 'rgba(0, 255, 136, 0.15)' : 'rgba(5, 15, 10, 0.5)',
                        color: tab === t.id ? '#00ff88' : 'rgba(255,255,255,0.5)',
                        boxShadow: tab === t.id ? '0 0 10px rgba(0,255,136,0.2)' : 'none',
                        transition: 'all 0.3s ease'
                    }}>{t.label}</button>
                ))}
            </div>

            {/* ── Tab: Crear Alerta ─────────────────────────────────────── */}
            {tab === 'crear' && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 520, background: 'rgba(5, 15, 10, 0.8)', padding: '1.5rem', borderRadius: 12, border: '1px solid rgba(0,255,136,0.1)', boxShadow: '0 4px 20px rgba(0,255,136,0.05)' }}>
                    <div>
                        <label style={labelStyle}>Tipo de evento</label>
                        <select value={form.tipo_evento} onChange={e => setForm(f => ({ ...f, tipo_evento: e.target.value }))} style={{ ...fieldStyle, color: TIPO_COLOR[form.tipo_evento] || '#00ff88' }}>
                            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Título</label>
                        <input required value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} style={fieldStyle} placeholder="Ej: Retraso en Línea A" />
                    </div>
                    <div>
                        <label style={labelStyle}>Estación / Línea afectada</label>
                        <input required value={form.entidad_afectada} onChange={e => setForm(f => ({ ...f, entidad_afectada: e.target.value }))} style={fieldStyle} placeholder="Ej: Línea A – Est. Industriales" />
                    </div>
                    <div>
                        <label style={labelStyle}>Descripción</label>
                        <textarea required rows={3} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} style={{ ...fieldStyle, resize: 'vertical' }} placeholder="Describe el evento en detalle…" />
                    </div>
                    <button type="submit" disabled={enviando} style={{ padding: '0.85rem', borderRadius: 10, border: '1px solid #00ff88', background: enviando ? 'rgba(0,255,136,0.1)' : 'linear-gradient(135deg, rgba(0,255,136,0.2) 0%, rgba(0,184,255,0.2) 100%)', color: '#00ff88', fontWeight: 800, fontSize: '0.9rem', cursor: enviando ? 'not-allowed' : 'pointer', textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 0 15px rgba(0,255,136,0.2)', transition: 'all 0.3s ease' }}>
                        {enviando ? 'Enviando…' : '📤 Enviar Alerta a Usuarios'}
                    </button>
                    {resultado && (
                        <div style={{ padding: '0.65rem 1rem', borderRadius: 8, background: resultado.ok ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,85,0.1)', color: resultado.ok ? '#00ff88' : '#ff0055', fontSize: '0.82rem', textAlign: 'center', border: `1px solid ${resultado.ok ? '#00ff88' : '#ff0055'}`, fontWeight: 600 }}>
                            {resultado.ok ? '✅ ' : '❌ '}{resultado.text}
                        </div>
                    )}
                </form>
            )}

            {/* ── Tab: Historial Global (RF-46) ─────────────────────────── */}
            {tab === 'historial' && (
                <div style={{ background: 'rgba(5, 15, 10, 0.8)', padding: '1.5rem', borderRadius: 12, border: '1px solid rgba(0,255,136,0.1)' }}>
                    <button onClick={fetchHistorial} style={{ marginBottom: '1rem', padding: '0.4rem 0.9rem', borderRadius: 7, border: '1px solid rgba(0,255,136,0.2)', background: 'rgba(0,255,136,0.05)', color: '#00ff88', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.2s' }}>
                        🔄 Actualizar
                    </button>
                    {historial.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '2rem' }}>No hay alertas registradas aún.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(0,255,136,0.2)', color: '#00b8ff' }}>
                                        {['#', 'Tipo', 'Título', 'Afectado', 'Canales', 'Fecha'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {historial.map((a, i) => (
                                        <tr key={a.id_notificacion} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,255,136,0.02)' }}>
                                            <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{a.id_notificacion}</td>
                                            <td style={{ padding: '0.75rem', color: TIPO_COLOR[a.tipo_evento], fontWeight: 700 }}>
                                                {TIPOS.find(t => t.value === a.tipo_evento)?.label ?? a.tipo_evento}
                                            </td>
                                            <td style={{ padding: '0.75rem', color: '#fff', fontWeight: 500 }}>{a.titulo}</td>
                                            <td style={{ padding: '0.75rem', color: '#00ff88' }}>{a.entidad_afectada}</td>
                                            <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{a.canales_enviados}</td>
                                            <td style={{ padding: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                                                {new Date(a.fecha_generacion).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminAlertas;
