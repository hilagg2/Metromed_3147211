import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/authService';
import {
    getJuegosConfig,
    updateJuegoConfig,
    registrarPartida,
    getHistorialPartidas,
    getRanking,
    getEstadisticas
} from '../services/juegoService';
import './Juegos.css';

const Juegos = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('juegos'); // juegos, ranking, historial, admin
    const [user, setUser] = useState(null);
    const [configs, setConfigs] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [ranking, setRanking] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Juego Activo
    const [activeGame, setActiveGame] = useState(null); // 'cartas', 'serpiente', 'ruleta', 'preguntas'
    const [gameCoinsEarned, setGameCoinsEarned] = useState(0);
    const [gameStatus, setGameStatus] = useState('idle'); // idle, playing, won, lost

    // --- ESTADO DETALLADO: JUEGO DE PREGUNTAS (TRIVIA) ---
    const triviaQuestions = [
        {
            question: "¿En qué año se inauguró el Metro de Medellín?",
            answers: ["1992", "1995", "1998", "2000"],
            correct: 1
        },
        {
            question: "¿Cuántas líneas de Metrocable tiene actualmente el sistema?",
            answers: ["4", "5", "6", "8"],
            correct: 2
        },
        {
            question: "¿Cómo se le conoce a la cultura de cuidado y comportamiento ciudadano en el sistema?",
            answers: ["Cultura Vial", "Cultura Metro", "Medellín Cuida", "Cultura Paisa"],
            correct: 1
        },
        {
            question: "¿Cuál es el principal medio de pago electrónico en el Metro de Medellín?",
            answers: ["Tarjeta Cívica", "Ticket Integrado", "MetroApp", "Tarjeta Medellín"],
            correct: 0
        },
        {
            question: "¿Qué módulo de MetroMed ofrece apoyo profesional de salud mental y técnicas de respiración?",
            answers: ["Chatbot Inteligente", "Estado de Congestión", "Apoyo Psicológico", "Wrapped Anual"],
            correct: 2
        }
    ];
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [triviaScore, setTriviaScore] = useState(0);

    // --- ESTADO DETALLADO: MEMORIA (CARTAS) ---
    const [memoryCards, setMemoryCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [memoryMoves, setMemoryMoves] = useState(0);
    const [memoryTimer, setMemoryTimer] = useState(60); // 60 segundos límite
    const memoryTimerRef = useRef(null);

    // --- ESTADO DETALLADO: SERPIENTE (SNAKE) ---
    const canvasRef = useRef(null);
    const [snakeScore, setSnakeScore] = useState(0);
    const [snakeDirection, setSnakeDirection] = useState('RIGHT');
    const snakeRef = useRef({
        body: [{ x: 10, y: 10 }],
        food: { x: 5, y: 5 },
        direction: 'RIGHT',
        speed: 150,
        running: false
    });

    // --- ESTADO DETALLADO: RULETA (ROULETTE) ---
    const wheelCanvasRef = useRef(null);
    const [rouletteSpinning, setRouletteSpinning] = useState(false);
    const [roulettePrize, setRoulettePrize] = useState(null);
    const rouletteAngleRef = useRef(0);

    useEffect(() => {
        loadData();
    }, []);

    // Cleanup de temporizadores
    useEffect(() => {
        return () => {
            if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
            snakeRef.current.running = false;
        };
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const userData = await getProfile();
            setUser(userData);
            
            const gameConfigs = await getJuegosConfig();
            setConfigs(gameConfigs);

            const rankData = await getRanking();
            setRanking(rankData);

            const histData = await getHistorialPartidas();
            setHistorial(histData);

            if (userData.id_rol === 1) { // Admin
                const statsData = await getEstadisticas();
                setStats(statsData);
            }
        } catch (error) {
            console.error('Error al cargar datos de juegos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePartida = async (idJuego, monedas) => {
        if (monedas <= 0) return;
        try {
            const res = await registrarPartida(idJuego, monedas);
            if (res.success) {
                // Actualizar saldo del usuario localmente
                setUser(prev => prev ? { ...prev, saldo_metrocoins: res.nuevo_saldo } : null);
                // Volver a cargar historial y ranking
                const histData = await getHistorialPartidas();
                setHistorial(histData);
                const rankData = await getRanking();
                setRanking(rankData);
                if (user.id_rol === 1) {
                    const statsData = await getEstadisticas();
                    setStats(statsData);
                }
            }
        } catch (err) {
            console.error('Error al registrar partida:', err);
        }
    };

    // --- CONTROL DE ACCESO A JUEGOS ---
    const handleStartGame = (idJuego) => {
        const conf = configs.find(c => c.id_juego === idJuego);
        if (!conf || !conf.habilitado) {
            alert('Este juego está deshabilitado temporalmente.');
            return;
        }

        setActiveGame(idJuego);
        setGameCoinsEarned(0);
        setGameStatus('playing');

        if (idJuego === 'preguntas') {
            setCurrentQuestionIndex(0);
            setSelectedOption(null);
            setTriviaScore(0);
        } else if (idJuego === 'cartas') {
            initMemoryGame();
        } else if (idJuego === 'serpiente') {
            initSnakeGame();
        } else if (idJuego === 'ruleta') {
            setRoulettePrize(null);
            setTimeout(() => drawWheel(), 50);
        }
    };

    const handleBack = () => {
        // Detener juegos si están corriendo
        if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
        snakeRef.current.running = false;
        setActiveGame(null);
        setGameStatus('idle');
    };

    // --- LÓGICA: TRIVIA ---
    const handleAnswerTrivia = (answerIndex) => {
        if (selectedOption !== null) return;
        setSelectedOption(answerIndex);

        const currentQ = triviaQuestions[currentQuestionIndex];
        const isCorrect = answerIndex === currentQ.correct;

        const configPreguntas = configs.find(c => c.id_juego === 'preguntas');
        const premioPorPregunta = configPreguntas ? configPreguntas.metrocoins_premio : 15;

        if (isCorrect) {
            setTriviaScore(prev => prev + 1);
            setGameCoinsEarned(prev => prev + premioPorPregunta);
        }

        setTimeout(() => {
            if (currentQuestionIndex + 1 < triviaQuestions.length) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                // Finalizó la trivia
                setGameStatus('won');
                const totalMonedas = triviaScore + (isCorrect ? 1 : 0);
                const ganadas = totalMonedas * premioPorPregunta;
                handleSavePartida('preguntas', ganadas);
            }
        }, 1500);
    };

    // --- LÓGICA: MEMORIA ---
    const initMemoryGame = () => {
        if (memoryTimerRef.current) clearInterval(memoryTimerRef.current);
        setMemoryTimer(60);

        const symbols = ['🚇', '🚊', '🚌', '🚲', '🚶‍♂️', '🚗', '✈️', '🛴'];
        const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

        const cardObjects = cards.map((symbol, index) => ({
            id: index,
            symbol,
            flipped: false,
            matched: false
        }));

        setMemoryCards(cardObjects);
        setFlippedCards([]);
        setMatchedCards([]);
        setMemoryMoves(0);

        memoryTimerRef.current = setInterval(() => {
            setMemoryTimer(prev => {
                if (prev <= 1) {
                    clearInterval(memoryTimerRef.current);
                    setGameStatus('lost');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleFlipCard = (card) => {
        if (flippedCards.length >= 2 || card.flipped || card.matched || gameStatus !== 'playing') return;

        const updatedCards = memoryCards.map(c =>
            c.id === card.id ? { ...c, flipped: true } : c
        );
        setMemoryCards(updatedCards);

        const newFlipped = [...flippedCards, card.id];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMemoryMoves(prev => prev + 1);
            const first = memoryCards.find(c => c.id === newFlipped[0]);
            const second = card;

            const configCartas = configs.find(c => c.id_juego === 'cartas');
            const premioPar = configCartas ? configCartas.metrocoins_premio : 10;

            if (first.symbol === second.symbol) {
                setTimeout(() => {
                    const matchedUpdated = updatedCards.map(c =>
                        c.id === first.id || c.id === second.id
                            ? { ...c, matched: true, flipped: false }
                            : c
                    );
                    setMemoryCards(matchedUpdated);
                    
                    const nextMatched = [...matchedCards, first.id, second.id];
                    setMatchedCards(nextMatched);
                    setFlippedCards([]);
                    setGameCoinsEarned(prev => prev + premioPar);

                    // Verificar victoria
                    if (nextMatched.length === memoryCards.length) {
                        clearInterval(memoryTimerRef.current);
                        setGameStatus('won');
                        const totalMonedas = (memoryCards.length / 2) * premioPar;
                        handleSavePartida('cartas', totalMonedas);
                    }
                }, 800);
            } else {
                setTimeout(() => {
                    const resetUpdated = updatedCards.map(c =>
                        newFlipped.includes(c.id) || c.id === second.id
                            ? { ...c, flipped: false }
                            : c
                    );
                    setMemoryCards(resetUpdated);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    // --- LÓGICA: SNAKE (SERPIENTE) ---
    const initSnakeGame = () => {
        const gridCount = 20;
        snakeRef.current = {
            body: [{ x: 10, y: 10 }],
            food: { x: 5, y: 5 },
            direction: 'RIGHT',
            speed: 150,
            running: true
        };
        setSnakeScore(0);
        setSnakeDirection('RIGHT');

        // Generar primera comida aleatoria
        spawnFood();

        setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            // Loop del juego
            const gameLoop = () => {
                if (!snakeRef.current.running) return;
                updateSnake();
                drawSnake(ctx);
                setTimeout(gameLoop, snakeRef.current.speed);
            };
            gameLoop();
        }, 50);
    };

    const spawnFood = () => {
        const gridCount = 20;
        let newFood;
        let collision = true;
        while (collision) {
            newFood = {
                x: Math.floor(Math.random() * gridCount),
                y: Math.floor(Math.random() * gridCount)
            };
            collision = snakeRef.current.body.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        }
        snakeRef.current.food = newFood;
    };

    const updateSnake = () => {
        const body = [...snakeRef.current.body];
        const head = { ...body[0] };

        switch (snakeRef.current.direction) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
        }

        const gridCount = 20;
        // Colisión con paredes o consigo mismo
        const hitWall = head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount;
        const hitSelf = body.some(segment => segment.x === head.x && segment.y === head.y);

        if (hitWall || hitSelf) {
            snakeRef.current.running = false;
            setGameStatus('lost');
            // Guardar monedas obtenidas
            const configSerpiente = configs.find(c => c.id_juego === 'serpiente');
            const premioComida = configSerpiente ? configSerpiente.metrocoins_premio : 5;
            const finalCoins = snakeScore * premioComida;
            if (finalCoins > 0) {
                handleSavePartida('serpiente', finalCoins);
            }
            return;
        }

        body.unshift(head);

        // Comer comida
        if (head.x === snakeRef.current.food.x && head.y === snakeRef.current.food.y) {
            const configSerpiente = configs.find(c => c.id_juego === 'serpiente');
            const premioComida = configSerpiente ? configSerpiente.metrocoins_premio : 5;
            
            setSnakeScore(prev => prev + 1);
            setGameCoinsEarned(prev => prev + premioComida);
            spawnFood();
            // Aumentar velocidad levemente
            if (snakeRef.current.speed > 70) snakeRef.current.speed -= 5;
        } else {
            body.pop();
        }

        snakeRef.current.body = body;
    };

    const drawSnake = (ctx) => {
        if (!ctx) return;
        const width = 400;
        const height = 300;
        const cellWidth = width / 20;
        const cellHeight = height / 20;

        ctx.fillStyle = '#0d0d18';
        ctx.fillRect(0, 0, width, height);

        // Dibujar cuadricula sutil
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellWidth, 0);
            ctx.lineTo(i * cellWidth, height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * cellHeight);
            ctx.lineTo(width, i * cellHeight);
            ctx.stroke();
        }

        // Dibujar comida (Manzana o vagón)
        ctx.fillStyle = '#ff007f';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff007f';
        ctx.beginPath();
        ctx.arc(
            snakeRef.current.food.x * cellWidth + cellWidth / 2,
            snakeRef.current.food.y * cellHeight + cellHeight / 2,
            cellWidth / 2.5,
            0,
            2 * Math.PI
        );
        ctx.fill();

        // Dibujar cuerpo de la serpiente (Estilo vagones de tren)
        snakeRef.current.body.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#00ff88' : '#00d9ff';
            ctx.shadowColor = index === 0 ? '#00ff88' : '#00d9ff';
            ctx.shadowBlur = index === 0 ? 8 : 4;
            
            ctx.fillRect(
                segment.x * cellWidth + 1,
                segment.y * cellHeight + 1,
                cellWidth - 2,
                cellHeight - 2
            );
        });

        ctx.shadowBlur = 0; // Reset
    };

    const handleSnakeDirection = (dir) => {
        const current = snakeRef.current.direction;
        if (dir === 'UP' && current !== 'DOWN') snakeRef.current.direction = 'UP';
        if (dir === 'DOWN' && current !== 'UP') snakeRef.current.direction = 'DOWN';
        if (dir === 'LEFT' && current !== 'RIGHT') snakeRef.current.direction = 'LEFT';
        if (dir === 'RIGHT' && current !== 'LEFT') snakeRef.current.direction = 'RIGHT';
        setSnakeDirection(snakeRef.current.direction);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeGame !== 'serpiente' || gameStatus !== 'playing') return;
            if (e.key === 'ArrowUp') handleSnakeDirection('UP');
            if (e.key === 'ArrowDown') handleSnakeDirection('DOWN');
            if (e.key === 'ArrowLeft') handleSnakeDirection('LEFT');
            if (e.key === 'ArrowRight') handleSnakeDirection('RIGHT');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeGame, gameStatus]);

    // --- LÓGICA: RULETA ---
    const roulettePrizes = [25, 50, 100, 200, 10, 75];
    const rouletteColors = ['#00ff88', '#00d9ff', '#ff007f', '#ffcc00', '#9d00ff', '#ff5722'];

    const drawWheel = () => {
        const canvas = wheelCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 320;
        const center = size / 2;
        
        ctx.clearRect(0, 0, size, size);

        const slicesCount = roulettePrizes.length;
        const arc = (2 * Math.PI) / slicesCount;

        roulettePrizes.forEach((prize, index) => {
            const angle = index * arc;
            ctx.fillStyle = rouletteColors[index];
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, center - 10, angle, angle + arc);
            ctx.lineTo(center, center);
            ctx.fill();

            // Dibujar texto del premio
            ctx.save();
            ctx.translate(center, center);
            ctx.rotate(angle + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px Outfit';
            ctx.fillText(`${prize} MC`, center - 25, 5);
            ctx.restore();
        });

        // Eje central de la ruleta
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(center, center, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    const handleSpinRoulette = () => {
        if (rouletteSpinning) return;
        setRouletteSpinning(true);
        setRoulettePrize(null);

        const spins = 5 + Math.floor(Math.random() * 5); // Entre 5 y 10 vueltas completas
        const extraDegrees = Math.random() * 360;
        const totalRotation = spins * 360 + extraDegrees;
        
        const canvas = wheelCanvasRef.current;
        if (canvas) {
            canvas.style.transform = `rotate(${totalRotation}deg)`;
        }

        setTimeout(() => {
            // Calcular qué opción quedó en la parte superior (270 grados en trig)
            const normalizedDegrees = (360 - (extraDegrees % 360)) % 360;
            const sliceSize = 360 / roulettePrizes.length;
            const prizeIndex = Math.floor(normalizedDegrees / sliceSize);
            const prizeCoins = roulettePrizes[prizeIndex];

            const configRuleta = configs.find(c => c.id_juego === 'ruleta');
            // Podemos dar un bono adicional si el administrador tiene un multiplicador,
            // pero sumamos las monedas que indica el gajo directamente.
            const valorFinal = prizeCoins;

            setRoulettePrize(valorFinal);
            setGameCoinsEarned(valorFinal);
            setGameStatus('won');
            setRouletteSpinning(false);
            
            handleSavePartida('ruleta', valorFinal);
        }, 4000);
    };

    // --- CONFIGURACIÓN ADMIN DE JUEGOS ---
    const handleToggleGame = async (idJuego, statusActual) => {
        const configToUpdate = configs.find(c => c.id_juego === idJuego);
        if (!configToUpdate) return;

        try {
            await updateJuegoConfig({
                id_juego: idJuego,
                habilitado: !statusActual,
                metrocoins_premio: configToUpdate.metrocoins_premio
            });
            // Recargar datos
            const updatedConfigs = await getJuegosConfig();
            setConfigs(updatedConfigs);
        } catch (err) {
            alert('Error al actualizar el estado del juego');
        }
    };

    const handleCoinChange = (idJuego, valor) => {
        const parsed = parseInt(valor, 10) || 0;
        setConfigs(prev => prev.map(c => 
            c.id_juego === idJuego ? { ...c, metrocoins_premio: parsed } : c
        ));
    };

    const handleSaveCoins = async (idJuego) => {
        const configToUpdate = configs.find(c => c.id_juego === idJuego);
        if (!configToUpdate) return;

        try {
            await updateJuegoConfig({
                id_juego: idJuego,
                habilitado: configToUpdate.habilitado,
                metrocoins_premio: configToUpdate.metrocoins_premio
            });
            alert('Premio de MetroCoins actualizado correctamente.');
            loadData();
        } catch (err) {
            alert('Error al actualizar el premio de MetroCoins');
        }
    };

    // --- RENDERIZACIÓN ---
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#00ff88', flexDirection: 'column', gap: '1rem' }}>
                <i className="fas fa-circle-notch fa-spin" style={{ fontSize: '3rem' }}></i>
                <p style={{ fontWeight: 'bold' }}>Cargando Arcade MetroMed...</p>
            </div>
        );
    }

    const metrocoins = user ? parseFloat(user.saldo_metrocoins) || 0 : 0;
    const userLevel = Math.max(1, Math.floor(metrocoins / 250) + 1);

    return (
        <div className="games-container">
            {/* Header del Arcade */}
            <div className="arcade-header">
                <div className="arcade-title">🎮 Arcade MetroMed</div>
                <div className="arcade-subtitle">Completa desafíos, adquiere conocimientos de transporte y gana MetroCoins para tus viajes</div>
            </div>

            {/* HUD de Usuario */}
            <div className="arcade-hud">
                <div className="hud-card coins">
                    <div className="hud-icon"><i className="fas fa-coins" /></div>
                    <div className="hud-info">
                        <h4>Saldo MetroCoins</h4>
                        <p>{metrocoins.toLocaleString()} MC</p>
                    </div>
                </div>
                <div className="hud-card level">
                    <div className="hud-icon"><i className="fas fa-level-up-alt" /></div>
                    <div className="hud-info">
                        <h4>Tu Nivel</h4>
                        <p>Nivel {userLevel}</p>
                    </div>
                </div>
                <div className="hud-card plays">
                    <div className="hud-icon"><i className="fas fa-history" /></div>
                    <div className="hud-info">
                        <h4>Partidas Jugadas</h4>
                        <p>{historial.length} Partidas</p>
                    </div>
                </div>
            </div>

            {/* Navegación por Pestañas */}
            <div className="arcade-tabs">
                <button className={`tab-btn ${activeTab === 'juegos' ? 'active' : ''}`} onClick={() => { setActiveTab('juegos'); handleBack(); }}>
                    <i className="fas fa-gamepad" /> Juegos Disponibles
                </button>
                <button className={`tab-btn ${activeTab === 'ranking' ? 'active' : ''}`} onClick={() => { setActiveTab('ranking'); handleBack(); }}>
                    <i className="fas fa-trophy" /> Ranking Global
                </button>
                <button className={`tab-btn ${activeTab === 'historial' ? 'active' : ''}`} onClick={() => { setActiveTab('historial'); handleBack(); }}>
                    <i className="fas fa-scroll" /> Mi Historial
                </button>
                {user && user.id_rol === 1 && (
                    <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => { setActiveTab('admin'); handleBack(); }}>
                        <i className="fas fa-cog" /> Administración
                    </button>
                )}
            </div>

            {/* Pestaña: JUEGOS DISPONIBLES */}
            {activeTab === 'juegos' && !activeGame && (
                <div className="games-grid">
                    {configs.map(game => (
                        <div key={game.id_juego} className="futuristic-card">
                            {!game.habilitado && <div className="disabled-badge">Deshabilitado</div>}
                            <div className="card-top">
                                <div className="game-icon-box">
                                    {game.id_juego === 'cartas' && <i className="fas fa-puzzle-piece" style={{ color: '#00d9ff' }} />}
                                    {game.id_juego === 'serpiente' && <i className="fas fa-subway" style={{ color: '#00ff88' }} />}
                                    {game.id_juego === 'ruleta' && <i className="fas fa-gift" style={{ color: '#ff007f' }} />}
                                    {game.id_juego === 'preguntas' && <i className="fas fa-brain" style={{ color: '#ffcc00' }} />}
                                </div>
                                <span className="game-coin-reward">
                                    <i className="fas fa-coins" /> {game.metrocoins_premio} MC
                                </span>
                            </div>
                            <div className="game-body">
                                <h3>{game.nombre}</h3>
                                <p>
                                    {game.id_juego === 'cartas' && "Encuentra las parejas de símbolos del transporte público antes de que se acabe el tiempo."}
                                    {game.id_juego === 'serpiente' && "Controla el tren del Metro. Recoge pasajeros sin chocar contra los límites o contra ti mismo."}
                                    {game.id_juego === 'ruleta' && "Gira la ruleta de premios virtuales diaria y obtén una cantidad aleatoria de MetroCoins al instante."}
                                    {game.id_juego === 'preguntas' && "Demuestra tus conocimientos sobre el sistema MetroMed y la red del Metro de Medellín."}
                                </p>
                            </div>
                            <button
                                className="futuristic-btn"
                                onClick={() => handleStartGame(game.id_juego)}
                                disabled={!game.habilitado}
                            >
                                {game.habilitado ? 'Jugar Ahora' : 'No Disponible'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* JUEGO ACTIVO: MEMORIA */}
            {activeTab === 'juegos' && activeGame === 'cartas' && (
                <div className="active-game-container">
                    <button className="game-back-btn" onClick={handleBack}>
                        <i className="fas fa-arrow-left" /> Salir del Juego
                    </button>
                    <div className="memory-game-wrap">
                        <h3>🧩 Memoria del Metro</h3>
                        <p style={{ color: '#94a3b8' }}>Encuentra las parejas iguales. Tiempo límite: 60 segundos.</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0' }}>
                            <span>Movimientos: <strong style={{ color: 'var(--neon-blue)' }}>{memoryMoves}</strong></span>
                            <span>Tiempo: <strong style={{ color: memoryTimer < 15 ? 'red' : 'var(--neon-green)' }}>{memoryTimer}s</strong></span>
                            <span>MetroCoins Ganados: <strong style={{ color: 'var(--neon-gold)' }}>{gameCoinsEarned} MC</strong></span>
                        </div>

                        {gameStatus === 'playing' && (
                            <div className="memory-board">
                                {memoryCards.map(card => (
                                    <div
                                        key={card.id}
                                        className={`card-3d ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                                        onClick={() => handleFlipCard(card)}
                                    >
                                        <div className="card-3d-inner">
                                            <div className="card-back">?</div>
                                            <div className="card-front">{card.symbol}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {gameStatus === 'won' && (
                            <div style={{ padding: '2rem' }}>
                                <h2 style={{ color: 'var(--neon-green)' }}>🎉 ¡Felicitaciones!</h2>
                                <p>Has completado el juego de memoria con éxito.</p>
                                <p>Ganaste un total de <strong>{gameCoinsEarned} MetroCoins</strong>.</p>
                                <button className="futuristic-btn" onClick={initMemoryGame}>Volver a Jugar</button>
                            </div>
                        )}

                        {gameStatus === 'lost' && (
                            <div style={{ padding: '2rem' }}>
                                <h2 style={{ color: '#ef4444' }}>⏳ ¡Se acabó el tiempo!</h2>
                                <p>No lograste resolver el tablero a tiempo.</p>
                                <p>MetroCoins consolados: <strong>{gameCoinsEarned} MC</strong>.</p>
                                <button className="futuristic-btn" onClick={initMemoryGame}>Intentar de Nuevo</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* JUEGO ACTIVO: SERPIENTE */}
            {activeTab === 'juegos' && activeGame === 'serpiente' && (
                <div className="active-game-container">
                    <button className="game-back-btn" onClick={handleBack}>
                        <i className="fas fa-arrow-left" /> Salir del Juego
                    </button>
                    <div className="snake-game-wrap">
                        <h3>🚇 Metro Snake Express</h3>
                        <p style={{ color: '#94a3b8' }}>Usa las flechas del teclado o los botones en pantalla para dirigir el tren.</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1rem 0' }}>
                            <span>Pasajeros Transportados: <strong style={{ color: 'var(--neon-green)' }}>{snakeScore}</strong></span>
                            <span>MetroCoins Acumulados: <strong style={{ color: 'var(--neon-gold)' }}>{gameCoinsEarned} MC</strong></span>
                        </div>

                        <div className="canvas-container">
                            <canvas ref={canvasRef} className="game-canvas" width="400" height="300" />
                        </div>

                        {gameStatus === 'lost' && (
                            <div style={{ margin: '1rem' }}>
                                <h3 style={{ color: '#ef4444' }}>💥 Choque detectado</h3>
                                <p>Has ganado un total de <strong>{gameCoinsEarned} MetroCoins</strong> por tus pasajeros.</p>
                                <button className="futuristic-btn" onClick={initSnakeGame}>Jugar de Nuevo</button>
                            </div>
                        )}

                        {/* Botones de Control para Móvil */}
                        <div className="mobile-controls">
                            <button className="control-btn up" onClick={() => handleSnakeDirection('UP')}><i className="fas fa-arrow-up" /></button>
                            <button className="control-btn left" onClick={() => handleSnakeDirection('LEFT')}><i className="fas fa-arrow-left" /></button>
                            <button className="control-btn right" onClick={() => handleSnakeDirection('RIGHT')}><i className="fas fa-arrow-right" /></button>
                            <button className="control-btn down" onClick={() => handleSnakeDirection('DOWN')}><i className="fas fa-arrow-down" /></button>
                        </div>
                    </div>
                </div>
            )}

            {/* JUEGO ACTIVO: RULETA */}
            {activeTab === 'juegos' && activeGame === 'ruleta' && (
                <div className="active-game-container">
                    <button className="game-back-btn" onClick={handleBack}>
                        <i className="fas fa-arrow-left" /> Salir del Juego
                    </button>
                    <div className="roulette-game-wrap">
                        <h3>🎁 Ruleta de MetroRewards</h3>
                        <p style={{ color: '#94a3b8' }}>¡Gira la ruleta una vez al día para ganar monedas instantáneas!</p>

                        <div className="wheel-outer">
                            <div className="wheel-pointer" />
                            <canvas ref={wheelCanvasRef} className="wheel-canvas" width="320" height="320" />
                        </div>

                        {roulettePrize !== null && (
                            <div style={{ margin: '1.5rem', animation: 'fadeIn 0.5s' }}>
                                <h2 style={{ color: 'var(--neon-gold)' }}>🏆 ¡Ganaste {roulettePrize} MetroCoins!</h2>
                                <p>Las monedas se han abonado automáticamente a tu saldo de viaje.</p>
                            </div>
                        )}

                        <button
                            className="futuristic-btn"
                            onClick={handleSpinRoulette}
                            disabled={rouletteSpinning || gameStatus === 'won'}
                        >
                            {rouletteSpinning ? 'Girando la Rueda...' : '¡Girar Ruleta!'}
                        </button>
                    </div>
                </div>
            )}

            {/* JUEGO ACTIVO: PREGUNTAS (TRIVIA) */}
            {activeTab === 'juegos' && activeGame === 'preguntas' && (
                <div className="active-game-container">
                    <button className="game-back-btn" onClick={handleBack}>
                        <i className="fas fa-arrow-left" /> Salir del Juego
                    </button>
                    <div className="trivia-game-wrap">
                        <h3>🧠 Quiz MetroExperto</h3>
                        <p style={{ color: '#94a3b8' }}>Pregunta {currentQuestionIndex + 1} de {triviaQuestions.length}</p>

                        <div className="trivia-progress-bar">
                            <div
                                className="trivia-progress-fill"
                                style={{ width: `${((currentQuestionIndex + 1) / triviaQuestions.length) * 100}%` }}
                            />
                        </div>

                        {gameStatus === 'playing' && (
                            <div className="question-card">
                                <div className="question-text">
                                    {triviaQuestions[currentQuestionIndex].question}
                                </div>
                                <div className="options-list">
                                    {triviaQuestions[currentQuestionIndex].answers.map((answer, index) => {
                                        let btnClass = '';
                                        if (selectedOption !== null) {
                                            if (index === triviaQuestions[currentQuestionIndex].correct) {
                                                btnClass = 'correct';
                                            } else if (index === selectedOption) {
                                                btnClass = 'incorrect';
                                            }
                                        }
                                        return (
                                            <button
                                                key={index}
                                                className={`option-btn ${btnClass}`}
                                                onClick={() => handleAnswerTrivia(index)}
                                                disabled={selectedOption !== null}
                                            >
                                                {answer}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {gameStatus === 'won' && (
                            <div style={{ textAlignment: 'center', padding: '2rem' }}>
                                <h2 style={{ color: 'var(--neon-green)' }}>🎯 Trivia Finalizada</h2>
                                <p>Has acertado <strong>{triviaScore} de {triviaQuestions.length}</strong> preguntas.</p>
                                <p>Tu premio asignado es de <strong>{gameCoinsEarned} MetroCoins</strong>.</p>
                                <button className="futuristic-btn" onClick={() => handleStartGame('preguntas')}>Jugar de Nuevo</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pestaña: RANKING GLOBAL */}
            {activeTab === 'ranking' && (
                <div className="ranking-table-container">
                    <h3 style={{ marginBottom: '1.5rem' }}><i className="fas fa-trophy" style={{ color: 'var(--neon-gold)' }} /> Líderes de la Comunidad</h3>
                    <table className="ranking-table">
                        <thead>
                            <tr>
                                <th>Puesto</th>
                                <th>Usuario</th>
                                <th>MetroCoins Acumulados</th>
                                <th>Nivel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ranking.map((player, index) => {
                                const rank = index + 1;
                                const lvl = Math.max(1, Math.floor(player.total_coins / 250) + 1);
                                return (
                                    <tr key={player.id_usuario} className="ranking-row">
                                        <td>
                                            <div className={`rank-badge rank-${rank <= 3 ? rank : 'other'}`}>
                                                {rank}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className="player-avatar">
                                                    {player.nombre ? player.nombre[0].toUpperCase() : 'U'}
                                                </div>
                                                <span>{player.nombre}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '700', color: 'var(--neon-gold)' }}>
                                            {parseFloat(player.total_coins).toLocaleString()} MC
                                        </td>
                                        <td>
                                            <span style={{ background: 'rgba(0, 217, 255, 0.1)', color: 'var(--neon-blue)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                                                Niv. {lvl}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pestaña: MI HISTORIAL */}
            {activeTab === 'historial' && (
                <div>
                    <h3 style={{ marginBottom: '1.5rem' }}><i className="fas fa-scroll" style={{ color: 'var(--neon-blue)' }} /> Tus Partidas Recientes</h3>
                    {historial.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Aún no has participado en ningún minijuego. ¡Empieza hoy mismo!</p>
                    ) : (
                        <div className="history-list">
                            {historial.map(item => (
                                <div key={item.id} className="history-item">
                                    <div className="history-details">
                                        <h5>{item.juego}</h5>
                                        <span>{new Date(item.fecha).toLocaleString('es-ES')}</span>
                                    </div>
                                    <div className="history-coins">
                                        +{item.cantidad} MC
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Pestaña: ADMINISTRACIÓN */}
            {activeTab === 'admin' && user && user.id_rol === 1 && (
                <div className="admin-settings-container">
                    <div className="admin-card">
                        <h3 style={{ marginBottom: '1.5rem' }}><i className="fas fa-sliders-h" style={{ color: 'var(--neon-green)' }} /> Configuración de Recompensas y Estado</h3>
                        <div>
                            {configs.map(game => (
                                <div key={game.id_juego} className="admin-game-row">
                                    <div className="admin-game-info">
                                        <h4>{game.nombre}</h4>
                                        <p>ID: {game.id_juego}</p>
                                    </div>
                                    <div className="admin-game-controls">
                                        <div className="coins-input-wrap">
                                            <span>Premio:</span>
                                            <input
                                                type="number"
                                                value={game.metrocoins_premio}
                                                onChange={(e) => handleCoinChange(game.id_juego, e.target.value)}
                                            />
                                            <span>MC</span>
                                            <button className="futuristic-btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSaveCoins(game.id_juego)}>
                                                Guardar
                                            </button>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={game.habilitado}
                                                onChange={() => handleToggleGame(game.id_juego, game.habilitado)}
                                            />
                                            <span className="slider" />
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="admin-card">
                        <h3 style={{ marginBottom: '1.5rem' }}><i className="fas fa-chart-bar" style={{ color: 'var(--neon-pink)' }} /> Estadísticas Generales</h3>
                        {stats ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Partidas Totales Jugadas</span>
                                    <h2 style={{ margin: '0.2rem 0', color: 'var(--neon-blue)' }}>{stats.total_partidas}</h2>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>MetroCoins Distribuidos</span>
                                    <h2 style={{ margin: '0.2rem 0', color: 'var(--neon-gold)' }}>{stats.total_coins} MC</h2>
                                </div>
                                <div>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Jugador Estrella</span>
                                    {stats.top_player ? (
                                        <p style={{ margin: '0.2rem 0', fontWeight: 'bold' }}>
                                            {stats.top_player.nombre} ({stats.top_player.total_partidas} partidas)
                                        </p>
                                    ) : (
                                        <p style={{ margin: '0.2rem 0', color: '#64748b' }}>Ninguno</p>
                                    )}
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>Participación por Juego</span>
                                    {stats.desglose.map(d => (
                                        <div key={d.juego} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '0.2rem' }}>
                                            <span>{d.juego}</span>
                                            <strong>{d.partidas} plays ({d.monedas} MC)</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: '#64748b' }}>Cargando estadísticas...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Juegos;