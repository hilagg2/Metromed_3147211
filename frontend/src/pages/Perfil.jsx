import React from 'react';

const Perfil = ({ showSection }) => {
    return (
        <div className="game-card">
            <h2><i className="fas fa-user-circle"></i> Mi Perfil MetroMed</h2>

            <div className="profile-info">
                <div className="profile-header">
                    <div className="profile-avatar-large">U</div>
                    <div className="profile-name">
                        <h2>Usuario Metro</h2>
                        <p className="profile-email">usuario@metromed.com</p>
                    </div>
                </div>

                <div className="profile-details">
                    <div className="detail-item">
                        <span className="detail-label"><i className="fas fa-coins"></i> MetroCoins</span>
                        <span className="detail-value">1,250</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label"><i className="fas fa-calendar-alt"></i> Miembro desde</span>
                        <span className="detail-value">Enero 2024</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label"><i className="fas fa-level-up-alt"></i> Nivel</span>
                        <span className="detail-value">5 - MetroExperto</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label"><i className="fas fa-trophy"></i> Racha actual</span>
                        <span className="detail-value">7 días</span>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="action-btn">
                        <i className="fas fa-edit"></i> Editar Perfil
                    </button>
                    <button className="action-btn" onClick={() => showSection('configuracion')}>
                        <i className="fas fa-cog"></i> Configuración
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
