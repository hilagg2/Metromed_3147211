import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Reusing dashboard styles for consistency

const Ranking = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                // Asumiendo que la ruta base del backend es el puerto donde corra (ej. localhost:5000/api)
                // Usualmente en React con Vite se puede configurar un proxy, pero aquí usaremos la ruta directa
                const response = await axios.get('http://localhost:5000/api/juegos/ranking');
                if (response.data.success) {
                    setRanking(response.data.ranking);
                }
            } catch (error) {
                console.error('Error fetching ranking:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando ranking...</div>;
    }

    return (
        <div className="game-card">
            <h2><i className="fas fa-trophy" style={{ color: 'gold' }}></i> Ranking General</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Los mejores jugadores de MetroMedellín</p>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-light)' }}>
                            <th style={{ padding: '1rem' }}>Posición</th>
                            <th style={{ padding: '1rem' }}>Usuario</th>
                            <th style={{ padding: '1rem' }}>Nivel</th>
                            <th style={{ padding: '1rem' }}>MetroCoins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((user, index) => (
                            <tr key={user.id_usuario} style={{ borderBottom: '1px solid var(--border)', backgroundColor: index < 3 ? 'rgba(255, 215, 0, 0.05)' : 'transparent' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                    {index === 0 && <span style={{ color: 'gold', marginRight: '0.5rem' }}>1º</span>}
                                    {index === 1 && <span style={{ color: 'silver', marginRight: '0.5rem' }}>2º</span>}
                                    {index === 2 && <span style={{ color: '#cd7f32', marginRight: '0.5rem' }}>3º</span>}
                                    {index > 2 && `${index + 1}º`}
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ 
                                        width: '32px', height: '32px', borderRadius: '50%', 
                                        background: 'var(--primary)', color: 'white', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.8rem', fontWeight: 'bold'
                                    }}>
                                        {user.nombre.substring(0, 2).toUpperCase()}
                                    </div>
                                    {user.nombre}
                                </td>
                                <td style={{ padding: '1rem' }}>{user.nivel || 1}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                    {user.saldo_metrocoins} <i className="fas fa-coins" style={{ fontSize: '0.8rem' }}></i>
                                </td>
                            </tr>
                        ))}
                        {ranking.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    Aún no hay usuarios en el ranking. ¡Sé el primero en jugar!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Ranking;
