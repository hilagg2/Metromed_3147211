import React from 'react';

const Configuracion = () => {
    return (
        <div className="game-card">
            <h2><i className="fas fa-cogs"></i> Configuración</h2>

            <div className="config-section">
                <div className="config-item">
                    <span>Notificaciones</span>
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
                <div className="config-item">
                    <span>Sonidos</span>
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
                <div className="config-item">
                    <span>Modo oscuro</span>
                    <label className="toggle-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className="action-btn">
                    <i className="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        </div>
    );
};

export default Configuracion;
