import React, { useState } from 'react';
import { crearReporte } from '../services/reportesService';
import toast from 'react-hot-toast';

const UserReportes = () => {
    const [form, setForm] = useState({ tipo: 'problema_tecnico', descripcion: '' });
    const [saving, setSaving] = useState(false);

    const showToast = (msg, ok = true) => {
        toast(msg, {
            icon: ok ? '✅' : '❌',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    const handleCrear = async (e) => {
        e.preventDefault();
        if (!form.descripcion.trim()) {
            showToast('La descripción es obligatoria', false);
            return;
        }
        setSaving(true);
        try {
            const res = await crearReporte(form);
            if (res.success) {
                showToast('Reporte enviado correctamente');
                setForm({ tipo: 'problema_tecnico', descripcion: '' });
            } else {
                showToast(res.message || 'Error al enviar reporte', false);
            }
        } catch {
            showToast('Error de red', false);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>
                <i className="fas fa-flag" style={{ color: 'var(--primary)', marginRight: '0.5rem' }} />
                Enviar Reporte
            </h2>
            <p style={{ color: '#aaa', marginBottom: '2rem' }}>
                ¿Tuviste algún inconveniente o tienes alguna sugerencia? Envíanos tu reporte y nuestro equipo administrativo lo revisará.
            </p>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <form onSubmit={handleCrear}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#ccc' }}>
                            Tipo de Reporte
                        </label>
                        <select
                            value={form.tipo}
                            onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid #444', borderRadius: '8px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                        >
                            <option value="problema_tecnico">🐛 Problema Técnico</option>
                            <option value="sugerencia">💡 Sugerencia</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#ccc' }}>
                            Descripción
                        </label>
                        <textarea
                            rows={6}
                            required
                            value={form.descripcion}
                            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                            placeholder="Describe detalladamente el problema o sugerencia..."
                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)', border: '1px solid #444', borderRadius: '8px', color: '#fff', fontSize: '1rem', resize: 'vertical', outline: 'none' }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={saving}
                        style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--primary)', color: '#000', fontWeight: 700, fontSize: '1.1rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: '0.2s' }}
                    >
                        {saving ? (
                            <><i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }} /> Enviando...</>
                        ) : (
                            <><i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }} /> Enviar Reporte</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserReportes;
