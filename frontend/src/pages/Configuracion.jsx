import React from 'react';
import PreferenciasAlertas from './PreferenciasAlertas';

const Configuracion = () => {
    return (
        <div className="game-card">
            <h2><i className="fas fa-cogs"></i> Configuración</h2>

            <div className="config-section">
                <div className="config-item">
                    <span>Sonidos de la Interfaz</span>
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

            {/* Módulo RF-41, RF-42 */}
            <PreferenciasAlertas />
        </div>
    );
};

export default Configuracion;
