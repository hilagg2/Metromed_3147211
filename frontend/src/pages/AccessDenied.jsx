import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#0a0a0a',
            color: '#f0f0f0',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '3rem', color: '#e74c3c', marginBottom: '1rem' }}>
                <i className="fas fa-exclamation-triangle"></i> Acceso Denegado
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                No tienes acceso a este archivo.
            </p>
            <Link to="/" style={{
                padding: '1rem 2rem',
                backgroundColor: '#00ff88',
                color: '#0a0a0a',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                transition: 'transform 0.3s'
            }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
                Volver al Inicio
            </Link>
        </div>
    );
};

export default AccessDenied;
