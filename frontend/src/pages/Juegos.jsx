import React, { useState, useRef, useEffect } from 'react';
import { registrarPartida } from '../services/juegosService';

const Juegos = () => {
    const [quizQuestions] = useState([
        {
            question: "¿En qué año se inauguró el Metro de Medellín?",
            answers: ["1992", "1995", "1998", "2000"],
            correct: 1
        },
        {
            question: "¿Cuántas líneas tiene actualmente el Metro?",
            answers: ["2", "3", "4", "5"],
            correct: 0
        },
        {
            question: "¿Cómo se llama el teleférico del Metro?",
            answers: ["Metrocable", "Telecable", "AereoMed", "CableMed"],
            correct: 0
        }
    ]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizResult, setQuizResult] = useState('');
    const [memoryCards, setMemoryCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const [rouletteSpinning, setRouletteSpinning] = useState(false);
    const [prizeResult, setPrizeResult] = useState('');
    const rouletteRef = useRef(null);

    const [activeGames, setActiveGames] = useState([]);
    
    // Snake Game State
    const [snakeScore, setSnakeScore] = useState(0);
    const [snakePlaying, setSnakePlaying] = useState(false);
    const snakeCanvasRef = useRef(null);

    useEffect(() => {
        fetchActiveGames();
        initMemoryGame();
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, []);

    const fetchActiveGames = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/juegos');
            const data = await res.json();
            if (data.success) {
                setActiveGames(data.juegos.map(j => j.identificador));
            }
        } catch (e) {
            console.error("Error fetching games", e);
            // Si falla, mostramos todos por defecto
            setActiveGames(['trivia', 'memory', 'snake', 'roulette']);
        }
    };

    useEffect(() => {
        if (timerInterval) {
            clearInterval(timerInterval);
        }

        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);

        setTimerInterval(interval);

        return () => clearInterval(interval);
    }, [memoryCards]);

    const checkAnswer = async (answerIndex) => {
        const isCorrect = answerIndex === quizQuestions[currentQuestionIndex].correct;
        if (isCorrect) {
            try {
                await registrarPartida('trivia', 50, 'Pregunta respondida correctamente');
                setQuizResult('¡Correcto! +50 MetroCoins añadidos a tu cuenta');
            } catch (error) {
                setQuizResult('¡Correcto! (Pero hubo un error al guardar los MetroCoins)');
            }
        } else {
            setQuizResult('Incorrecto. ¡Inténtalo la próxima vez!');
        }
    };

    const nextQuestion = () => {
        setCurrentQuestionIndex((prev) => (prev + 1) % quizQuestions.length);
        setQuizResult('');
    };

    const initMemoryGame = () => {
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
        setMoves(0);
        setTimer(0);
    };

    const flipCard = (card) => {
        if (flippedCards.length >= 2 || card.flipped || card.matched) return;

        const updatedCards = memoryCards.map(c =>
            c.id === card.id ? { ...c, flipped: true } : c
        );

        setMemoryCards(updatedCards);
        const newFlippedCards = [...flippedCards, card.id];
        setFlippedCards(newFlippedCards);

        if (newFlippedCards.length === 2) {
            setMoves(moves + 1);

            const firstCard = memoryCards.find(c => c.id === newFlippedCards[0]);
            const secondCard = memoryCards.find(c => c.id === card.id);

            if (firstCard.symbol === secondCard.symbol) {
                setTimeout(async () => {
                    const matchedUpdated = updatedCards.map(c =>
                        c.id === firstCard.id || c.id === secondCard.id
                            ? { ...c, matched: true, flipped: false }
                            : c
                    );

                    setMemoryCards(matchedUpdated);
                    const newMatched = [...matchedCards, firstCard.id, secondCard.id];
                    setMatchedCards(newMatched);
                    setFlippedCards([]);
                    
                    // Comprobar si ganó
                    if (newMatched.length === matchedUpdated.length) {
                        clearInterval(timerInterval);
                        try {
                            const coins = 100; // 100 monedas base por terminar
                            await registrarPartida('memory', coins, `Partida de memoria en ${timer}s y ${moves+1} movs`);
                            alert(`¡Juego Completado! Ganaste ${coins} MetroCoins.`);
                        } catch (e) {
                            alert('¡Juego Completado! (Error guardando progreso)');
                        }
                    }
                }, 1000);
            } else {
                setTimeout(() => {
                    const resetUpdated = updatedCards.map(c =>
                        newFlippedCards.includes(c.id) || c.id === card.id
                            ? { ...c, flipped: false }
                            : c
                    );

                    setMemoryCards(resetUpdated);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    const resetMemoryGame = () => {
        initMemoryGame();
    };

    const spinRoulette = () => {
        if (rouletteSpinning) return;

        setRouletteSpinning(true);
        setPrizeResult('');

        const randomDegrees = Math.floor(Math.random() * 360) + 1440;
        if (rouletteRef.current) {
            rouletteRef.current.style.transform = `rotate(${randomDegrees}deg)`;
        }

        setTimeout(async () => {
            const prizes = [
                { name: '50 MetroCoins', amount: 50 },
                { name: '100 MetroCoins', amount: 100 },
                { name: '¡Viaje Gratis!', amount: 0 },
                { name: '200 MetroCoins', amount: 200 },
                { name: '¡Gran Premio!', amount: 500 },
                { name: '25 MetroCoins', amount: 25 }
            ];
            const prizeIndex = Math.floor((360 - (randomDegrees % 360)) / 60);
            const prize = prizes[prizeIndex] || prizes[0];

            try {
                if (prize.amount > 0) {
                    await registrarPartida('roulette', prize.amount, `Premio de ruleta: ${prize.name}`);
                    setPrizeResult(`¡Ganaste: ${prize.name}! Las monedas han sido añadidas.`);
                } else {
                    await registrarPartida('roulette', 0, `Premio de ruleta: ${prize.name}`);
                    setPrizeResult(`¡Ganaste: ${prize.name}! (No otorga MetroCoins)`);
                }
            } catch (error) {
                setPrizeResult(`¡Ganaste: ${prize.name}! (Error al guardar recompensa)`);
            }
            
            setRouletteSpinning(false);
        }, 3000);
    };

    // --- LOGICA DE SNAKE ---
    const startSnake = () => {
        if (snakePlaying) return;
        setSnakePlaying(true);
        setSnakeScore(0);
        
        const canvas = snakeCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const grid = 16;
        let count = 0;
        let animationId;
        
        let snake = {
            x: 160, y: 160,
            dx: grid, dy: 0,
            cells: [], maxCells: 4
        };
        
        let apple = {
            x: 320, y: 320
        };

        const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

        const loop = () => {
            animationId = requestAnimationFrame(loop);
            if (++count < 6) return;
            count = 0;
            
            ctx.clearRect(0,0,canvas.width,canvas.height);
            snake.x += snake.dx;
            snake.y += snake.dy;
            
            // Paredes (muerte)
            if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
                endSnake(snake.maxCells - 4, animationId);
                return;
            }
            
            snake.cells.unshift({x: snake.x, y: snake.y});
            if (snake.cells.length > snake.maxCells) snake.cells.pop();
            
            ctx.fillStyle = 'red';
            ctx.fillRect(apple.x, apple.y, grid-1, grid-1);
            
            ctx.fillStyle = 'green';
            snake.cells.forEach(function(cell, index) {
                ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
                
                // Comer manzana
                if (cell.x === apple.x && cell.y === apple.y) {
                    snake.maxCells++;
                    setSnakeScore(prev => prev + 10);
                    apple.x = getRandomInt(0, 25) * grid;
                    apple.y = getRandomInt(0, 18) * grid;
                }
                
                // Chocar consigo mismo
                for (let i = index + 1; i < snake.cells.length; i++) {
                    if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                        endSnake(snake.maxCells - 4, animationId);
                        return;
                    }
                }
            });
        };

        const handleKey = (e) => {
            if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; }
            else if (e.which === 38 && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; }
            else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; }
            else if (e.which === 40 && snake.dy === 0) { snake.dy = grid; snake.dx = 0; }
        };
        
        document.addEventListener('keydown', handleKey);
        
        const endSnake = async (applesEaten, animId) => {
            cancelAnimationFrame(animId);
            document.removeEventListener('keydown', handleKey);
            setSnakePlaying(false);
            
            // Final del juego
            const finalScore = applesEaten * 10;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '20px sans-serif';
            ctx.fillText('Game Over', canvas.width/2 - 50, canvas.height/2);
            
            try {
                if (finalScore > 0) {
                    await registrarPartida('snake', finalScore, `Puntuación en Snake: ${finalScore}`);
                    alert(`¡Juego Terminado! Ganaste ${finalScore} MetroCoins.`);
                } else {
                    alert('¡Juego Terminado! Intenta comer más manzanas la próxima vez.');
                }
            } catch(e) {
                console.error("Error guardando score", e);
            }
        };

        requestAnimationFrame(loop);
    };

    return (
        <>
            <div className="games-header">
                <h1>
                    <i className="fas fa-gamepad"></i> Centro de Juegos MetroMed
                </h1>
                <p>Diviértete, aprende y gana recompensas mientras conoces más sobre el Metro de Medellín</p>
                {activeGames.length === 0 && <p style={{color: 'red'}}>Cargando juegos...</p>}
            </div>

            {activeGames.includes('trivia') && (
            <div className="game-card featured">
                <div className="game-badge">Popular</div>
                <h3><i className="fas fa-brain"></i> Quiz MetroExperto</h3>
                <p>¡Demuestra tu conocimiento sobre el Metro de Medellín!</p>
                <div className="quiz-container">
                    <div className="question">
                        {quizQuestions[currentQuestionIndex].question}
                    </div>
                    {quizQuestions[currentQuestionIndex].answers.map((answer, index) => (
                        <button
                            key={index}
                            className="quiz-btn"
                            onClick={() => checkAnswer(index)}
                        >
                            {answer}
                        </button>
                    ))}
                </div>
                {quizResult && <div className="quiz-result">{quizResult}</div>}
                <button className="action-btn" onClick={nextQuestion}>
                    Siguiente Pregunta
                </button>
            </div>
            )}

            {activeGames.includes('memory') && (
            <div className="game-card">
                <div className="game-badge">Nuevo</div>
                <h3><i className="fas fa-puzzle-piece"></i> Memoria del Metro</h3>
                <p>Encuentra las parejas de símbolos del transporte público</p>
                <div className="memory-grid">
                    {memoryCards.map(card => (
                        <div
                            key={card.id}
                            className={`memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
                            onClick={() => flipCard(card)}
                        >
                            {card.flipped || card.matched ? card.symbol : '?'}
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <span>Movimientos: <strong>{moves}</strong></span>
                    <span style={{ marginLeft: '2rem' }}>
                        Tiempo: <strong>
                            {Math.floor(timer / 60).toString().padStart(2, '0')}:
                            {(timer % 60).toString().padStart(2, '0')}
                        </strong>
                    </span>
                </div>
                <button className="action-btn" onClick={resetMemoryGame}>
                    Nuevo Juego
                </button>
            </div>
            )}

            {activeGames.includes('snake') && (
            <div className="game-card">
                <h3><i className="fas fa-gamepad"></i> Metro Snake</h3>
                <p>¡Guía el tren por las rutas sin chocar!</p>
                <div className="snake-container">
                    <canvas
                        ref={snakeCanvasRef}
                        className="game-canvas"
                        width="400"
                        height="300"
                        style={{ background: '#2c3e50', border: '2px solid var(--border)' }}
                    ></canvas>
                    <div style={{ marginTop: '1rem' }}>
                        <span>Puntuación: <strong>{snakeScore}</strong></span>
                        <button className="action-btn" onClick={startSnake} disabled={snakePlaying} style={{ marginLeft: '1rem' }}>
                            {snakePlaying ? 'Jugando...' : 'Iniciar Juego'}
                        </button>
                    </div>
                    <div style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>
                        Usa las flechas del teclado para moverte
                    </div>
                </div>
            </div>
            )}

            {activeGames.includes('roulette') && (
            <div className="game-card">
                <div className="game-badge">¡Premios!</div>
                <h3><i className="fas fa-gift"></i> Ruleta MetroRewards</h3>
                <p>¡Gira y gana premios increíbles!</p>
                <div style={{ textAlign: 'center' }}>
                    <div className="roulette-container">
                        <div
                            ref={rouletteRef}
                            className="roulette-wheel"
                        >
                            <div className="roulette-pointer"></div>
                        </div>
                    </div>
                    <button
                        className={`action-btn ${rouletteSpinning ? '' : 'pulse'}`}
                        onClick={spinRoulette}
                        disabled={rouletteSpinning}
                    >
                        {rouletteSpinning ? 'Girando...' : '¡Girar Ruleta!'}
                    </button>
                    {prizeResult && <div className="prize-result">{prizeResult}</div>}
                </div>
            </div>
            )}
        </>
    );
};

export default Juegos;