-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/05/2026 às 02:35
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `metromedd`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `administradores`
--

CREATE TABLE `administradores` (
  `id_admin` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `administradores`
--

INSERT INTO `administradores` (`id_admin`, `id_usuario`, `fecha_creacion`) VALUES
(1, 3, '2025-09-23 23:22:57'),
(2, 4, '2025-09-23 23:22:57'),
(3, 5, '2025-09-23 23:22:57'),
(6, 6, '2025-09-25 23:53:00'),
(7, 7, '2025-09-25 23:53:00'),
(8, 8, '2025-09-25 23:53:00'),
(9, 9, '2025-09-25 23:53:00'),
(10, 10, '2025-09-25 23:53:00'),
(11, 11, '2025-09-25 23:53:00'),
(12, 12, '2025-09-25 23:53:00'),
(13, 13, '2025-09-25 23:53:00'),
(14, 14, '2025-09-25 23:53:00'),
(15, 15, '2025-09-25 23:53:00'),
(16, 16, '2025-09-25 23:53:00'),
(17, 17, '2025-09-25 23:53:00'),
(18, 18, '2025-09-25 23:53:00'),
(19, 19, '2025-09-25 23:53:00'),
(20, 20, '2025-09-25 23:53:00'),
(21, 21, '2025-09-25 23:53:00'),
(22, 22, '2025-09-25 23:53:00'),
(23, 23, '2025-09-25 23:53:00'),
(24, 24, '2025-09-25 23:53:00'),
(25, 25, '2025-09-25 23:53:00'),
(26, 26, '2025-09-25 23:53:00'),
(27, 27, '2025-09-25 23:53:00'),
(28, 28, '2025-09-25 23:53:00'),
(29, 29, '2025-09-25 23:53:00'),
(30, 30, '2025-09-25 23:53:00'),
(31, 31, '2025-09-25 23:53:00'),
(32, 32, '2025-09-25 23:53:00'),
(33, 33, '2025-09-25 23:53:00'),
(34, 34, '2025-09-25 23:53:00'),
(35, 35, '2025-09-25 23:53:00'),
(36, 36, '2025-09-25 23:53:00'),
(37, 37, '2025-09-25 23:53:00'),
(38, 38, '2025-09-25 23:53:00'),
(39, 39, '2025-09-25 23:53:00'),
(40, 40, '2025-09-25 23:53:00'),
(41, 41, '2025-09-25 23:53:00'),
(42, 42, '2025-09-25 23:53:00'),
(43, 43, '2025-09-25 23:53:00'),
(44, 44, '2025-09-25 23:53:00'),
(45, 45, '2025-09-25 23:53:00'),
(46, 46, '2025-09-25 23:53:00'),
(47, 47, '2025-09-25 23:53:00'),
(48, 48, '2025-09-25 23:53:00'),
(49, 49, '2025-09-25 23:53:00'),
(50, 50, '2025-09-25 23:53:00'),
(51, 51, '2025-09-25 23:53:00'),
(52, 52, '2025-09-25 23:53:00'),
(53, 53, '2025-09-25 23:53:00'),
(54, 54, '2025-09-25 23:53:00'),
(55, 55, '2025-09-25 23:53:00'),
(56, 56, '2025-09-25 23:53:00'),
(57, 57, '2025-09-25 23:53:00'),
(58, 58, '2025-09-25 23:53:00'),
(59, 59, '2025-09-25 23:53:00'),
(60, 60, '2025-09-25 23:53:00'),
(61, 61, '2025-09-25 23:53:00'),
(62, 62, '2025-09-25 23:53:00'),
(63, 63, '2025-09-25 23:53:00'),
(64, 64, '2025-09-25 23:53:00'),
(65, 65, '2025-09-25 23:53:00'),
(66, 66, '2025-09-25 23:53:00'),
(67, 67, '2025-09-25 23:53:00'),
(68, 68, '2025-09-25 23:53:00'),
(69, 69, '2025-09-25 23:53:00'),
(70, 70, '2025-09-25 23:53:00'),
(71, 71, '2025-09-25 23:53:00'),
(72, 72, '2025-09-25 23:53:00'),
(73, 73, '2025-09-25 23:53:00'),
(74, 74, '2025-09-25 23:53:00'),
(75, 75, '2025-09-25 23:53:00'),
(76, 76, '2025-09-25 23:53:00'),
(77, 77, '2025-09-25 23:53:00'),
(78, 78, '2025-09-25 23:53:00'),
(79, 79, '2025-09-25 23:53:00'),
(80, 80, '2025-09-25 23:53:00'),
(81, 81, '2025-09-25 23:53:00'),
(82, 82, '2025-09-25 23:53:00'),
(83, 83, '2025-09-25 23:53:00'),
(84, 84, '2025-09-25 23:53:00'),
(85, 85, '2025-09-25 23:53:00'),
(86, 86, '2025-09-25 23:53:00'),
(87, 87, '2025-09-25 23:53:00'),
(88, 88, '2025-09-25 23:53:00'),
(89, 89, '2025-09-25 23:53:00'),
(90, 90, '2025-09-25 23:53:00'),
(91, 91, '2025-09-25 23:53:00'),
(92, 92, '2025-09-25 23:53:00'),
(93, 93, '2025-09-25 23:53:00'),
(94, 94, '2025-09-25 23:53:00'),
(95, 95, '2025-09-25 23:53:00'),
(96, 96, '2025-09-25 23:53:00'),
(97, 97, '2025-09-25 23:53:00'),
(98, 98, '2025-09-25 23:53:00'),
(99, 99, '2025-09-25 23:53:00'),
(100, 100, '2025-09-25 23:53:00'),
(101, 6, '2025-09-25 23:53:00'),
(102, 7, '2025-09-25 23:53:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `alertas`
--

CREATE TABLE `alertas` (
  `id_alerta` int(11) NOT NULL,
  `tipo_alerta` varchar(100) NOT NULL,
  `mensaje` text DEFAULT NULL,
  `fecha_alerta` timestamp NOT NULL DEFAULT current_timestamp(),
  `estacion_afectada` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `alertas`
--

INSERT INTO `alertas` (`id_alerta`, `tipo_alerta`, `mensaje`, `fecha_alerta`, `estacion_afectada`) VALUES
(1, 'MANTENIMIENTO', 'Mantenimiento programado en la estación', '2025-09-25 23:53:00', 1),
(2, 'RETRASO', 'Retraso de 10 minutos en el servicio', '2025-09-25 23:53:00', 2),
(3, 'EMERGENCIA', 'Evacuación temporal por emergencia médica', '2025-09-25 23:53:00', 3),
(4, 'CONGESTION', 'Alto nivel de congestión detectado', '2025-09-25 23:53:00', 4),
(5, 'CLIMA', 'Servicio afectado por condiciones climáticas', '2025-09-25 23:53:00', 5),
(6, 'MANTENIMIENTO', 'Revisión de escaleras mecánicas', '2025-09-25 23:53:00', 6),
(7, 'RETRASO', 'Demora por alta afluencia de pasajeros', '2025-09-25 23:53:00', 7),
(8, 'SEGURIDAD', 'Revisión de seguridad en curso', '2025-09-25 23:53:00', 8),
(9, 'EMERGENCIA', 'Atención médica en andén', '2025-09-25 23:53:00', 9),
(10, 'CONGESTION', 'Aglomeración en horas pico', '2025-09-25 23:53:00', 10),
(11, 'CLIMA', 'Lluvia intensa afecta accesos', '2025-09-25 23:53:00', 11),
(12, 'MANTENIMIENTO', 'Limpieza profunda de instalaciones', '2025-09-25 23:53:00', 12),
(13, 'RETRASO', 'Congestión vehicular en zona aledaña', '2025-09-25 23:53:00', 13),
(14, 'EMERGENCIA', 'Activación de protocolos de emergencia', '2025-09-25 23:53:00', 14),
(15, 'CONGESTION', 'Flujo masivo de usuarios', '2025-09-25 23:53:00', 15),
(16, 'CLIMA', 'Vientos fuertes en área de influencia', '2025-09-25 23:53:00', 16),
(17, 'MANTENIMIENTO', 'Actualización de sistemas de información', '2025-09-25 23:53:00', 17),
(18, 'RETRASO', 'Demora en conexiones intermodales', '2025-09-25 23:53:00', 18),
(19, 'SEGURIDAD', 'Inspección de seguridad completada', '2025-09-25 23:53:00', 19),
(20, 'EMERGENCIA', 'Situación controlada, servicio normalizado', '2025-09-25 23:53:00', 20),
(21, 'CONGESTION', 'Pico alto de usuarios matutino', '2025-09-25 23:53:00', 21),
(22, 'CLIMA', 'Neblina densa reduce visibilidad', '2025-09-25 23:53:00', 22),
(23, 'MANTENIMIENTO', 'Calibración de torniquetes', '2025-09-25 23:53:00', 23),
(24, 'RETRASO', 'Ajuste en frecuencia de trenes', '2025-09-25 23:53:00', 24),
(25, 'EMERGENCIA', 'Personal médico en estación', '2025-09-25 23:53:00', 25),
(26, 'CONGESTION', 'Evento masivo genera aglomeraciones', '2025-09-25 23:53:00', 26),
(27, 'CLIMA', 'Temperatura alta afecta equipos', '2025-09-25 23:53:00', 27),
(28, 'MANTENIMIENTO', 'Renovación de señalización', '2025-09-25 23:53:00', 28),
(29, 'RETRASO', 'Demora técnica solucionada', '2025-09-25 23:53:00', 29),
(30, 'SEGURIDAD', 'Patrullaje preventivo activo', '2025-09-25 23:53:00', 30),
(31, 'EMERGENCIA', 'Evacuación parcial por precaución', '2025-09-25 23:53:00', 31),
(32, 'CONGESTION', 'Flujo estudiantil elevado', '2025-09-25 23:53:00', 32),
(33, 'CLIMA', 'Granizo leve en zona externa', '2025-09-25 23:53:00', 33),
(34, 'MANTENIMIENTO', 'Revisión de sistema eléctrico', '2025-09-25 23:53:00', 34),
(35, 'RETRASO', 'Normalización progresiva del servicio', '2025-09-25 23:53:00', 35),
(36, 'EMERGENCIA', 'Bomberos en instalaciones', '2025-09-25 23:53:00', 36),
(37, 'CONGESTION', 'Hora pico vespertina activa', '2025-09-25 23:53:00', 37),
(38, 'CLIMA', 'Condiciones meteorológicas estables', '2025-09-25 23:53:00', 38),
(39, 'MANTENIMIENTO', 'Mantenimiento preventivo nocturno', '2025-09-25 23:53:00', 39),
(40, 'RETRASO', 'Sincronización de horarios', '2025-09-25 23:53:00', 40),
(41, 'SEGURIDAD', 'Cámaras de seguridad operativas', '2025-09-25 23:53:00', 41),
(42, 'EMERGENCIA', 'Cruz Roja en apoyo logístico', '2025-09-25 23:53:00', 42),
(43, 'CONGESTION', 'Afluencia normal de usuarios', '2025-09-25 23:53:00', 43),
(44, 'CLIMA', 'Sol intenso, hidratación recomendada', '2025-09-25 23:53:00', 44),
(45, 'MANTENIMIENTO', 'Limpieza de ductos de ventilación', '2025-09-25 23:53:00', 45),
(46, 'RETRASO', 'Tiempo de espera promedio normal', '2025-09-25 23:53:00', 46),
(47, 'EMERGENCIA', 'Simulacro de evacuación exitoso', '2025-09-25 23:53:00', 47),
(48, 'CONGESTION', 'Distribución equilibrada de pasajeros', '2025-09-25 23:53:00', 48),
(49, 'CLIMA', 'Brisa moderada, condiciones agradables', '2025-09-25 23:53:00', 49),
(50, 'MANTENIMIENTO', 'Inspección de rieles completada', '2025-09-25 23:53:00', 50),
(51, 'RETRASO', 'Servicio operando con normalidad', '2025-09-25 23:53:00', 51),
(52, 'SEGURIDAD', 'Personal de seguridad desplegado', '2025-09-25 23:53:00', 52),
(53, 'EMERGENCIA', 'Defensa Civil en coordinación', '2025-09-25 23:53:00', 53),
(54, 'CONGESTION', 'Flujo moderado de usuarios', '2025-09-25 23:53:00', 54),
(55, 'CLIMA', 'Cielo parcialmente nublado', '2025-09-25 23:53:00', 55),
(56, 'MANTENIMIENTO', 'Pruebas de sistema de audio', '2025-09-25 23:53:00', 56),
(57, 'RETRASO', 'Intervalos de servicio optimizados', '2025-09-25 23:53:00', 57),
(58, 'EMERGENCIA', 'Policía Nacional en patrullaje', '2025-09-25 23:53:00', 58),
(59, 'CONGESTION', 'Pico bajo, tránsito fluido', '2025-09-25 23:53:00', 59),
(60, 'CLIMA', 'Humedad relativa en niveles normales', '2025-09-25 23:53:00', 60),
(61, 'MANTENIMIENTO', 'Revisión de puertas automáticas', '2025-09-25 23:53:00', 61),
(62, 'RETRASO', 'Coordinación con buses alimentadores', '2025-09-25 23:53:00', 62),
(63, 'SEGURIDAD', 'Detectores de metales funcionando', '2025-09-25 23:53:00', 63),
(64, 'EMERGENCIA', 'Punto de hidratación disponible', '2025-09-25 23:53:00', 64),
(65, 'CONGESTION', 'Usuarios distribuidos uniformemente', '2025-09-25 23:53:00', 65),
(66, 'CLIMA', 'Viento suave, temperatura agradable', '2025-09-25 23:53:00', 66),
(67, 'MANTENIMIENTO', 'Actualización de mapas de ruta', '2025-09-25 23:53:00', 67),
(68, 'RETRASO', 'Conexiones sincronizadas correctamente', '2025-09-25 23:53:00', 68),
(69, 'EMERGENCIA', 'Botiquín de primeros auxilios verificado', '2025-09-25 23:53:00', 69),
(70, 'CONGESTION', 'Capacidad de estación al 60%', '2025-09-25 23:53:00', 70),
(71, 'CLIMA', 'Condiciones climáticas favorables', '2025-09-25 23:53:00', 71),
(72, 'MANTENIMIENTO', 'Iluminación LED funcionando', '2025-09-25 23:53:00', 72),
(73, 'RETRASO', 'Tiempos de viaje dentro de parámetros', '2025-09-25 23:53:00', 73),
(74, 'SEGURIDAD', 'Alarmas de emergencia probadas', '2025-09-25 23:53:00', 74),
(75, 'EMERGENCIA', 'Salidas de emergencia despejadas', '2025-09-25 23:53:00', 75),
(76, 'CONGESTION', 'Afluencia vespertina moderada', '2025-09-25 23:53:00', 76),
(77, 'CLIMA', 'Ausencia de precipitaciones', '2025-09-25 23:53:00', 77),
(78, 'MANTENIMIENTO', 'Sistema de ventilación óptimo', '2025-09-25 23:53:00', 78),
(79, 'RETRASO', 'Frecuencia de servicio estable', '2025-09-25 23:53:00', 79),
(80, 'EMERGENCIA', 'Personal capacitado en primeros auxilios', '2025-09-25 23:53:00', 80),
(81, 'CONGESTION', 'Distribución por andenes equilibrada', '2025-09-25 23:53:00', 81),
(82, 'CLIMA', 'Temperatura en rango confortable', '2025-09-25 23:53:00', 82),
(83, 'MANTENIMIENTO', 'Limpieza de cristales completada', '2025-09-25 23:53:00', 83),
(84, 'RETRASO', 'Información en tiempo real actualizada', '2025-09-25 23:53:00', 84),
(85, 'SEGURIDAD', 'Circuito cerrado de TV operativo', '2025-09-25 23:53:00', 85),
(86, 'EMERGENCIA', 'Extintores revisados y operativos', '2025-09-25 23:53:00', 86),
(87, 'CONGESTION', 'Flujo peatonal organizado', '2025-09-25 23:53:00', 87),
(88, 'CLIMA', 'Índice UV en nivel moderado', '2025-09-25 23:53:00', 88),
(89, 'MANTENIMIENTO', 'Escalones mecánicos lubricados', '2025-09-25 23:53:00', 89),
(90, 'RETRASO', 'Servicio prestado sin novedades', '2025-09-25 23:53:00', 90),
(91, 'EMERGENCIA', 'Rutas de evacuación señalizadas', '2025-09-25 23:53:00', 91),
(92, 'CONGESTION', 'Ocupación de vagones balanceada', '2025-09-25 23:53:00', 92),
(93, 'CLIMA', 'Presión atmosférica estable', '2025-09-25 23:53:00', 93),
(94, 'MANTENIMIENTO', 'Sensores de movimiento calibrados', '2025-09-25 23:53:00', 94),
(95, 'RETRASO', 'Operación dentro de estándares', '2025-09-25 23:53:00', 95),
(96, 'SEGURIDAD', 'Rondas de seguridad programadas', '2025-09-25 23:53:00', 96),
(97, 'EMERGENCIA', 'Kit de emergencia completo', '2025-09-25 23:53:00', 97),
(98, 'CONGESTION', 'Tránsito peatonal fluido', '2025-09-25 23:53:00', 98),
(99, 'CLIMA', 'Visibilidad excelente en toda la red', '2025-09-25 23:53:00', 99),
(100, 'MANTENIMIENTO', 'Mantenimiento general completado', '2025-09-25 23:53:00', 100);

-- --------------------------------------------------------

--
-- Estrutura para tabela `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` int(11) NOT NULL,
  `tabla_afectada` varchar(100) NOT NULL,
  `operacion` varchar(10) NOT NULL,
  `usuario_modificador` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `auditoria`
--

INSERT INTO `auditoria` (`id_auditoria`, `tabla_afectada`, `operacion`, `usuario_modificador`, `fecha`) VALUES
(1, 'usuarios', 'INSERT', 3, '2025-09-01 13:15:23'),
(2, 'estaciones', 'UPDATE', 4, '2025-09-01 13:45:12'),
(3, 'alertas', 'INSERT', 5, '2025-09-01 14:20:33'),
(4, 'usuarios', 'UPDATE', 3, '2025-09-01 15:35:44'),
(5, 'preferenciasusuario', 'INSERT', NULL, '2025-09-01 16:15:22'),
(6, 'mensajesmotivacionales', 'INSERT', 4, '2025-09-01 17:30:15'),
(7, 'lineasayuda', 'UPDATE', 5, '2025-09-01 18:45:28'),
(8, 'estaciones', 'UPDATE', 3, '2025-09-01 19:20:17'),
(9, 'alertas', 'DELETE', 4, '2025-09-01 20:35:33'),
(10, 'usuarios', 'UPDATE', NULL, '2025-09-01 21:50:22'),
(11, 'preferenciasusuario', 'UPDATE', NULL, '2025-09-02 12:25:15'),
(12, 'reportes', 'INSERT', 5, '2025-09-02 13:40:28'),
(13, 'estaciones', 'INSERT', 3, '2025-09-02 14:55:17'),
(14, 'usuarios', 'DELETE', 4, '2025-09-02 15:30:33'),
(15, 'alertas', 'UPDATE', 5, '2025-09-02 16:45:22'),
(16, 'mensajesmotivacionales', 'UPDATE', 3, '2025-09-02 17:20:44'),
(17, 'lineasayuda', 'INSERT', 4, '2025-09-02 18:35:15'),
(18, 'preferenciasusuario', 'DELETE', NULL, '2025-09-02 19:50:28'),
(19, 'usuarios', 'UPDATE', NULL, '2025-09-02 20:25:17'),
(20, 'estaciones', 'UPDATE', 5, '2025-09-02 21:40:33'),
(21, 'reportes', 'UPDATE', 3, '2025-09-03 13:15:22'),
(22, 'alertas', 'INSERT', 4, '2025-09-03 14:30:44'),
(23, 'usuarios', 'UPDATE', NULL, '2025-09-03 15:45:15'),
(24, 'mensajesmotivacionales', 'DELETE', 5, '2025-09-03 16:20:28'),
(25, 'estaciones', 'UPDATE', 3, '2025-09-03 17:35:17'),
(26, 'preferenciasusuario', 'INSERT', NULL, '2025-09-03 18:50:33'),
(27, 'lineasayuda', 'UPDATE', 4, '2025-09-03 19:25:22'),
(28, 'usuarios', 'INSERT', 5, '2025-09-03 20:40:44'),
(29, 'alertas', 'UPDATE', 3, '2025-09-03 21:55:15'),
(30, 'reportes', 'INSERT', 4, '2025-09-04 12:30:28'),
(31, 'estaciones', 'DELETE', 5, '2025-09-04 13:45:17'),
(32, 'usuarios', 'UPDATE', NULL, '2025-09-04 14:20:33'),
(33, 'mensajesmotivacionales', 'INSERT', 3, '2025-09-04 15:35:22'),
(34, 'preferenciasusuario', 'UPDATE', NULL, '2025-09-04 16:50:44'),
(35, 'alertas', 'DELETE', 4, '2025-09-04 17:25:15'),
(36, 'lineasayuda', 'INSERT', 5, '2025-09-04 18:40:28'),
(37, 'usuarios', 'UPDATE', 3, '2025-09-04 19:55:17'),
(38, 'estaciones', 'UPDATE', 4, '2025-09-04 20:30:33'),
(39, 'reportes', 'UPDATE', 5, '2025-09-04 21:45:22'),
(40, 'alertas', 'INSERT', 3, '2025-09-05 13:20:44'),
(41, 'usuarios', 'DELETE', 4, '2025-09-05 14:35:15'),
(42, 'preferenciasusuario', 'INSERT', NULL, '2025-09-05 15:50:28'),
(43, 'mensajesmotivacionales', 'UPDATE', 5, '2025-09-05 16:25:17'),
(44, 'estaciones', 'INSERT', 3, '2025-09-05 17:40:33'),
(45, 'lineasayuda', 'DELETE', 4, '2025-09-05 18:55:22'),
(46, 'usuarios', 'UPDATE', NULL, '2025-09-05 19:30:44'),
(47, 'alertas', 'UPDATE', 5, '2025-09-05 20:45:15'),
(48, 'reportes', 'INSERT', 3, '2025-09-05 21:20:28'),
(49, 'estaciones', 'UPDATE', 4, '2025-09-06 12:35:17'),
(50, 'preferenciasusuario', 'DELETE', NULL, '2025-09-06 13:50:33'),
(51, 'usuarios', 'INSERT', 5, '2025-09-06 14:25:22'),
(52, 'mensajesmotivacionales', 'UPDATE', 3, '2025-09-06 15:40:44'),
(53, 'alertas', 'INSERT', 4, '2025-09-06 16:55:15'),
(54, 'lineasayuda', 'UPDATE', 5, '2025-09-06 17:30:28'),
(55, 'estaciones', 'DELETE', 3, '2025-09-06 18:45:17'),
(56, 'usuarios', 'UPDATE', NULL, '2025-09-06 19:20:33'),
(57, 'reportes', 'UPDATE', 4, '2025-09-06 20:35:22'),
(58, 'preferenciasusuario', 'INSERT', NULL, '2025-09-06 21:50:44'),
(59, 'alertas', 'DELETE', 5, '2025-09-07 13:25:15'),
(60, 'mensajesmotivacionales', 'INSERT', 3, '2025-09-07 14:40:28'),
(61, 'usuarios', 'UPDATE', 4, '2025-09-07 15:55:17'),
(62, 'estaciones', 'UPDATE', 5, '2025-09-07 16:30:33'),
(63, 'lineasayuda', 'INSERT', 3, '2025-09-07 17:45:22'),
(64, 'preferenciasusuario', 'UPDATE', NULL, '2025-09-07 18:20:44'),
(65, 'alertas', 'INSERT', 4, '2025-09-07 19:35:15'),
(66, 'reportes', 'DELETE', 5, '2025-09-07 20:50:28'),
(67, 'usuarios', 'UPDATE', NULL, '2025-09-07 21:25:17'),
(68, 'estaciones', 'UPDATE', 3, '2025-09-08 12:40:33'),
(69, 'mensajesmotivacionales', 'DELETE', 4, '2025-09-08 13:55:22'),
(70, 'preferenciasusuario', 'INSERT', NULL, '2025-09-08 14:30:44'),
(71, 'alertas', 'UPDATE', 5, '2025-09-08 15:45:15'),
(72, 'lineasayuda', 'UPDATE', 3, '2025-09-08 16:20:28'),
(73, 'usuarios', 'INSERT', 4, '2025-09-08 17:35:17'),
(74, 'estaciones', 'DELETE', 5, '2025-09-08 18:50:33'),
(75, 'reportes', 'INSERT', 3, '2025-09-08 19:25:22'),
(76, 'preferenciasusuario', 'DELETE', NULL, '2025-09-08 20:40:44'),
(77, 'alertas', 'UPDATE', 4, '2025-09-08 21:55:15'),
(78, 'mensajesmotivacionales', 'INSERT', 5, '2025-09-09 13:30:28'),
(79, 'usuarios', 'UPDATE', NULL, '2025-09-09 14:45:17'),
(80, 'estaciones', 'UPDATE', 3, '2025-09-09 15:20:33'),
(81, 'lineasayuda', 'DELETE', 4, '2025-09-09 16:35:22'),
(82, 'preferenciasusuario', 'INSERT', NULL, '2025-09-09 17:50:44'),
(83, 'alertas', 'INSERT', 5, '2025-09-09 18:25:15'),
(84, 'reportes', 'UPDATE', 3, '2025-09-09 19:40:28'),
(85, 'usuarios', 'DELETE', 4, '2025-09-09 20:55:17'),
(86, 'estaciones', 'UPDATE', 5, '2025-09-09 21:30:33'),
(87, 'mensajesmotivacionales', 'UPDATE', 3, '2025-09-10 12:45:22'),
(88, 'preferenciasusuario', 'DELETE', NULL, '2025-09-10 13:20:44'),
(89, 'alertas', 'INSERT', 4, '2025-09-10 14:35:15'),
(90, 'lineasayuda', 'UPDATE', 5, '2025-09-10 15:50:28'),
(91, 'usuarios', 'UPDATE', NULL, '2025-09-10 16:25:17'),
(92, 'estaciones', 'INSERT', 3, '2025-09-10 17:40:33'),
(93, 'reportes', 'DELETE', 4, '2025-09-10 18:55:22'),
(94, 'preferenciasusuario', 'UPDATE', NULL, '2025-09-10 19:30:44'),
(95, 'alertas', 'UPDATE', 5, '2025-09-10 20:45:15'),
(96, 'mensajesmotivacionales', 'DELETE', 3, '2025-09-10 21:20:28'),
(97, 'usuarios', 'INSERT', 4, '2025-09-11 13:35:17'),
(98, 'estaciones', 'UPDATE', 5, '2025-09-11 14:50:33'),
(99, 'lineasayuda', 'INSERT', 3, '2025-09-11 15:25:22'),
(100, 'preferenciasusuario', 'INSERT', NULL, '2025-09-11 16:40:44'),
(101, 'alertas', 'DELETE', 4, '2025-09-11 17:55:15'),
(102, 'reportes', 'UPDATE', 5, '2025-09-11 18:30:28'),
(103, 'usuarios', 'UPDATE', NULL, '2025-09-11 19:45:17'),
(104, 'estaciones', 'UPDATE', 3, '2025-09-11 20:20:33'),
(105, 'mensajesmotivacionales', 'INSERT', 4, '2025-09-11 21:35:22'),
(106, 'preferenciasusuario', 'DELETE', NULL, '2025-09-11 22:50:44');

-- --------------------------------------------------------

--
-- Estrutura para tabela `codigosverificacion`
--

CREATE TABLE `codigosverificacion` (
  `id_codigo` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `codigo` varchar(6) NOT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `fecha_expiracion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `estaciones`
--

CREATE TABLE `estaciones` (
  `id_estacion` int(11) NOT NULL,
  `nombre_estacion` varchar(100) NOT NULL,
  `nivel_congestion` varchar(10) NOT NULL,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `estaciones`
--

INSERT INTO `estaciones` (`id_estacion`, `nombre_estacion`, `nivel_congestion`, `ultima_actualizacion`) VALUES
(1, 'Estación Niquía', 'BAJO', '2025-09-25 23:53:00'),
(2, 'Estación Bello', 'MEDIO', '2025-09-25 23:53:00'),
(3, 'Estación Madera', 'ALTO', '2025-09-25 23:53:00'),
(4, 'Estación Acevedo', 'BAJO', '2025-09-25 23:53:00'),
(5, 'Estación Tricentenario', 'MEDIO', '2025-09-25 23:53:00'),
(6, 'Estación Caribe', 'ALTO', '2025-09-25 23:53:00'),
(7, 'Estación Universidad', 'MEDIO', '2025-09-25 23:53:00'),
(8, 'Estación Hospital', 'BAJO', '2025-09-25 23:53:00'),
(9, 'Estación Prado', 'ALTO', '2025-09-25 23:53:00'),
(10, 'Estación Parque Berrío', 'MEDIO', '2025-09-25 23:53:00'),
(11, 'Estación San Antonio', 'ALTO', '2025-09-25 23:53:00'),
(12, 'Estación Alpujarra', 'MEDIO', '2025-09-25 23:53:00'),
(13, 'Estación Exposiciones', 'BAJO', '2025-09-25 23:53:00'),
(14, 'Estación Industriales', 'ALTO', '2025-09-25 23:53:00'),
(15, 'Estación Poblado', 'MEDIO', '2025-09-25 23:53:00'),
(16, 'Estación Aguacatala', 'BAJO', '2025-09-25 23:53:00'),
(17, 'Estación Ayurá', 'MEDIO', '2025-09-25 23:53:00'),
(18, 'Estación Envigado', 'ALTO', '2025-09-25 23:53:00'),
(19, 'Estación Itagüí', 'BAJO', '2025-09-25 23:53:00'),
(20, 'Estación Sabaneta', 'MEDIO', '2025-09-25 23:53:00'),
(21, 'Estación La Estrella', 'ALTO', '2025-09-25 23:53:00'),
(22, 'Estación Caldas', 'BAJO', '2025-09-25 23:53:00'),
(23, 'Estación Aranjuez', 'MEDIO', '2025-09-25 23:53:00'),
(24, 'Estación Manrique', 'ALTO', '2025-09-25 23:53:00'),
(25, 'Estación Santa Cruz', 'BAJO', '2025-09-25 23:53:00'),
(26, 'Estación Acevedo Norte', 'MEDIO', '2025-09-25 23:53:00'),
(27, 'Estación Buenos Aires', 'ALTO', '2025-09-25 23:53:00'),
(28, 'Estación Castilla', 'BAJO', '2025-09-25 23:53:00'),
(29, 'Estación 12 de Octubre', 'MEDIO', '2025-09-25 23:53:00'),
(30, 'Estación Tetuan', 'ALTO', '2025-09-25 23:53:00'),
(31, 'Estación Robledo', 'BAJO', '2025-09-25 23:53:00'),
(32, 'Estación San Javier', 'MEDIO', '2025-09-25 23:53:00'),
(33, 'Estación Santa Lucía', 'ALTO', '2025-09-25 23:53:00'),
(34, 'Estación El Volador', 'BAJO', '2025-09-25 23:53:00'),
(35, 'Estación Belén', 'MEDIO', '2025-09-25 23:53:00'),
(36, 'Estación Nueva Villa de Aburrá', 'ALTO', '2025-09-25 23:53:00'),
(37, 'Estación El Poblado Sur', 'BAJO', '2025-09-25 23:53:00'),
(38, 'Estación Guayabal', 'MEDIO', '2025-09-25 23:53:00'),
(39, 'Estación Estadio', 'ALTO', '2025-09-25 23:53:00'),
(40, 'Estación Suramericana', 'BAJO', '2025-09-25 23:53:00'),
(41, 'Estación Nutibara', 'MEDIO', '2025-09-25 23:53:00'),
(42, 'Estación Cisneros', 'ALTO', '2025-09-25 23:53:00'),
(43, 'Estación Berrio Norte', 'BAJO', '2025-09-25 23:53:00'),
(44, 'Estación Miraflores', 'MEDIO', '2025-09-25 23:53:00'),
(45, 'Estación Villa Hermosa', 'ALTO', '2025-09-25 23:53:00'),
(46, 'Estación Buenos Aires Norte', 'BAJO', '2025-09-25 23:53:00'),
(47, 'Estación Campo Valdés', 'MEDIO', '2025-09-25 23:53:00'),
(48, 'Estación Alejandro Echavarría', 'ALTO', '2025-09-25 23:53:00'),
(49, 'Estación Oriente', 'BAJO', '2025-09-25 23:53:00'),
(50, 'Estación Doce de Octubre Norte', 'MEDIO', '2025-09-25 23:53:00'),
(51, 'Estación Floresta', 'ALTO', '2025-09-25 23:53:00'),
(52, 'Estación Santa Elena', 'BAJO', '2025-09-25 23:53:00'),
(53, 'Estación Moravia', 'MEDIO', '2025-09-25 23:53:00'),
(54, 'Estación La Macarena', 'ALTO', '2025-09-25 23:53:00'),
(55, 'Estación Caicedo', 'BAJO', '2025-09-25 23:53:00'),
(56, 'Estación Girardot', 'MEDIO', '2025-09-25 23:53:00'),
(57, 'Estación Perpetuo Socorro', 'ALTO', '2025-09-25 23:53:00'),
(58, 'Estación Loreto', 'BAJO', '2025-09-25 23:53:00'),
(59, 'Estación Cuarta Brigada', 'MEDIO', '2025-09-25 23:53:00'),
(60, 'Estación Cerro Nutibara', 'ALTO', '2025-09-25 23:53:00'),
(61, 'Estación San Diego', 'BAJO', '2025-09-25 23:53:00'),
(62, 'Estación Parque Norte', 'MEDIO', '2025-09-25 23:53:00'),
(63, 'Estación Universidad Pontificia Bolivariana', 'ALTO', '2025-09-25 23:53:00'),
(64, 'Estación Centro Administrativo La Alpujarra', 'BAJO', '2025-09-25 23:53:00'),
(65, 'Estación Teatro Pablo Tobón Uribe', 'MEDIO', '2025-09-25 23:53:00'),
(66, 'Estación Plazuela Nutibara', 'ALTO', '2025-09-25 23:53:00'),
(67, 'Estación Centro', 'BAJO', '2025-09-25 23:53:00'),
(68, 'Estación La Candelaria', 'MEDIO', '2025-09-25 23:53:00'),
(69, 'Estación Villanueva', 'ALTO', '2025-09-25 23:53:00'),
(70, 'Estación Copacabana', 'BAJO', '2025-09-25 23:53:00'),
(71, 'Estación Girardota', 'MEDIO', '2025-09-25 23:53:00'),
(72, 'Estación Barbosa', 'ALTO', '2025-09-25 23:53:00'),
(73, 'Estación Santo Domingo', 'BAJO', '2025-09-25 23:53:00'),
(74, 'Estación Popular', 'MEDIO', '2025-09-25 23:53:00'),
(75, 'Estación Granizal', 'ALTO', '2025-09-25 23:53:00'),
(76, 'Estación Andalucía', 'BAJO', '2025-09-25 23:53:00'),
(77, 'Estación Villa Sierra', 'MEDIO', '2025-09-25 23:53:00'),
(78, 'Estación La Aurora', 'ALTO', '2025-09-25 23:53:00'),
(79, 'Estación San Cristóbal', 'BAJO', '2025-09-25 23:53:00'),
(80, 'Estación El Mirador', 'MEDIO', '2025-09-25 23:53:00'),
(81, 'Estación Juan XXIII', 'ALTO', '2025-09-25 23:53:00'),
(82, 'Estación Vallejuelos', 'BAJO', '2025-09-25 23:53:00'),
(83, 'Estación La Frontera', 'MEDIO', '2025-09-25 23:53:00'),
(84, 'Estación Zamora', 'ALTO', '2025-09-25 23:53:00'),
(85, 'Estación Arví', 'BAJO', '2025-09-25 23:53:00'),
(86, 'Estación Picacho', 'MEDIO', '2025-09-25 23:53:00'),
(87, 'Estación Cristo Rey', 'ALTO', '2025-09-25 23:53:00'),
(88, 'Estación 20 de Julio', 'BAJO', '2025-09-25 23:53:00'),
(89, 'Estación La Paz', 'MEDIO', '2025-09-25 23:53:00'),
(90, 'Estación El Salvador', 'ALTO', '2025-09-25 23:53:00'),
(91, 'Estación Enciso', 'BAJO', '2025-09-25 23:53:00'),
(92, 'Estación Ayacucho', 'MEDIO', '2025-09-25 23:53:00'),
(93, 'Estación Manzanares', 'ALTO', '2025-09-25 23:53:00'),
(94, 'Estación Campo Alegre', 'BAJO', '2025-09-25 23:53:00'),
(95, 'Estación Llanaditas', 'MEDIO', '2025-09-25 23:53:00'),
(96, 'Estación Los Alpes', 'ALTO', '2025-09-25 23:53:00'),
(97, 'Estación San Antonio de Prado', 'BAJO', '2025-09-25 23:53:00'),
(98, 'Estación Bethel', 'MEDIO', '2025-09-25 23:53:00'),
(99, 'Estación Altavista', 'ALTO', '2025-09-25 23:53:00'),
(100, 'Estación La Magnolia', 'BAJO', '2025-09-25 23:53:00'),
(101, 'Estación Pajarito', 'MEDIO', '2025-09-25 23:53:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `lineasayuda`
--

CREATE TABLE `lineasayuda` (
  `id_linea` int(11) NOT NULL,
  `nombre_servicio` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `horario` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `lineasayuda`
--

INSERT INTO `lineasayuda` (`id_linea`, `nombre_servicio`, `telefono`, `horario`) VALUES
(1, 'Línea de Emergencia Metro', '123', '24 horas'),
(2, 'Atención al Usuario', '4444444', 'Lunes a Viernes 6:00-22:00'),
(3, 'Soporte Técnico', '5555555', 'Lunes a Domingo 5:00-23:30'),
(4, 'Información General', '6666666', '24 horas'),
(5, 'Objetos Perdidos', '7777777', 'Lunes a Viernes 8:00-17:00'),
(6, 'Quejas y Reclamos', '8888888', 'Lunes a Sábado 7:00-19:00'),
(7, 'Asistencia Médica', '9999999', '24 horas'),
(8, 'Seguridad Ciudadana', '1010101', '24 horas'),
(9, 'Accesibilidad', '1111111', 'Lunes a Viernes 6:00-20:00'),
(10, 'Turismo', '1212121', 'Lunes a Domingo 8:00-18:00'),
(11, 'Línea Antisuicidio', '1313131', '24 horas'),
(12, 'Violencia Intrafamiliar', '1414141', '24 horas'),
(13, 'Salud Mental', '1515151', '24 horas'),
(14, 'Drogadicción', '1616161', '24 horas'),
(15, 'Orientación Psicológica', '1717171', 'Lunes a Viernes 8:00-17:00'),
(16, 'Apoyo Social', '1818181', 'Lunes a Viernes 7:00-16:00'),
(17, 'Tercera Edad', '1919191', 'Lunes a Viernes 8:00-17:00'),
(18, 'Juventud', '2020202', 'Lunes a Sábado 9:00-18:00'),
(19, 'Mujer', '2121212', '24 horas'),
(20, 'Niñez', '2222222', '24 horas'),
(21, 'Discapacidad', '2323232', 'Lunes a Viernes 8:00-17:00'),
(22, 'LGBTI+', '2424242', 'Lunes a Domingo 10:00-22:00'),
(23, 'Migración', '2525252', 'Lunes a Viernes 8:00-17:00'),
(24, 'Educación', '2626262', 'Lunes a Viernes 7:00-17:00'),
(25, 'Empleo', '2727272', 'Lunes a Viernes 8:00-17:00'),
(26, 'Salud', '2828282', '24 horas'),
(27, 'Bomberos', '119', '24 horas'),
(28, 'Policía', '112', '24 horas'),
(29, 'Cruz Roja', '132', '24 horas'),
(30, 'Defensa Civil', '144', '24 horas'),
(31, 'Fiscalía', '122', '24 horas'),
(32, 'Medicina Legal', '1958', 'Lunes a Viernes 7:00-17:00'),
(33, 'ICBF', '141', '24 horas'),
(34, 'Comisaría de Familia', '3030303', 'Lunes a Viernes 8:00-17:00'),
(35, 'Personería', '3131313', 'Lunes a Viernes 8:00-17:00'),
(36, 'Contraloría', '3232323', 'Lunes a Viernes 8:00-17:00'),
(37, 'Procuraduría', '3333333', 'Lunes a Viernes 8:00-17:00'),
(38, 'Defensoría del Pueblo', '3434343', 'Lunes a Viernes 8:00-17:00'),
(39, 'Registraduría', '3535353', 'Lunes a Viernes 8:00-17:00'),
(40, 'DANE', '3636363', 'Lunes a Viernes 8:00-17:00'),
(41, 'SENA', '3737373', 'Lunes a Viernes 7:00-17:00'),
(42, 'MinTIC', '3838383', 'Lunes a Viernes 8:00-17:00'),
(43, 'MinSalud', '3939393', 'Lunes a Viernes 8:00-17:00'),
(44, 'MinEducación', '4040404', 'Lunes a Viernes 8:00-17:00'),
(45, 'MinTrabajo', '4141414', 'Lunes a Viernes 8:00-17:00'),
(46, 'DIAN', '4242424', 'Lunes a Viernes 8:00-17:00'),
(47, 'Supersalud', '4343434', 'Lunes a Viernes 8:00-17:00'),
(48, 'Superservicios', '4444444', 'Lunes a Viernes 8:00-17:00'),
(49, 'Supercade', '4545454', 'Lunes a Sábado 8:00-16:00'),
(50, 'CAI Virtual', '4646464', '24 horas'),
(51, 'Línea 195', '195', '24 horas'),
(52, 'Línea 106', '106', '24 horas'),
(53, 'Línea 155', '155', '24 horas'),
(54, 'Bomberos Voluntarios', '4747474', '24 horas'),
(55, 'Emergencias Médicas', '4848484', '24 horas'),
(56, 'Ambulancia', '125', '24 horas'),
(57, 'Tránsito', '4949494', '24 horas'),
(58, 'Movilidad', '5050505', 'Lunes a Viernes 6:00-20:00'),
(59, 'Obras Públicas', '5151515', 'Lunes a Viernes 8:00-17:00'),
(60, 'Servicios Públicos', '5252525', '24 horas'),
(61, 'Gas Natural', '5353535', '24 horas'),
(62, 'Acueducto', '5454545', '24 horas'),
(63, 'Energía Eléctrica', '5555555', '24 horas'),
(64, 'Telecomunicaciones', '5656565', '24 horas'),
(65, 'Internet', '5757575', '24 horas'),
(66, 'Cable TV', '5858585', '24 horas'),
(67, 'Telefonía Móvil', '5959595', '24 horas'),
(68, 'Correos', '6060606', 'Lunes a Viernes 8:00-17:00'),
(69, 'Bancos', '6161616', 'Lunes a Viernes 8:00-16:30'),
(70, 'Seguros', '6262626', 'Lunes a Viernes 8:00-17:00'),
(71, 'Pensiones', '6363636', 'Lunes a Viernes 8:00-17:00'),
(72, 'Cesantías', '6464646', 'Lunes a Viernes 8:00-17:00'),
(73, 'EPS', '6565656', 'Lunes a Viernes 7:00-17:00'),
(74, 'ARL', '6666666', 'Lunes a Viernes 8:00-17:00'),
(75, 'Caja de Compensación', '6767676', 'Lunes a Viernes 8:00-17:00'),
(76, 'Cooperativas', '6868686', 'Lunes a Viernes 8:00-17:00'),
(77, 'Fundaciones', '6969696', 'Lunes a Viernes 8:00-17:00'),
(78, 'ONG', '7070707', 'Lunes a Viernes 9:00-17:00'),
(79, 'Iglesias', '7171717', 'Lunes a Domingo 6:00-20:00'),
(80, 'Centros Culturales', '7272727', 'Martes a Domingo 9:00-17:00'),
(81, 'Bibliotecas', '7373737', 'Lunes a Sábado 8:00-18:00'),
(82, 'Museos', '7474747', 'Martes a Domingo 9:00-17:00'),
(83, 'Parques', '7575757', 'Lunes a Domingo 6:00-18:00'),
(84, 'Deportes', '7676767', 'Lunes a Domingo 6:00-22:00'),
(85, 'Recreación', '7777777', 'Lunes a Domingo 8:00-18:00'),
(86, 'Eventos', '7878787', 'Lunes a Domingo 9:00-22:00'),
(87, 'Espectáculos', '7979797', 'Lunes a Domingo 10:00-22:00'),
(88, 'Cine', '8080808', 'Lunes a Domingo 10:00-23:00'),
(89, 'Teatro', '8181818', 'Martes a Domingo 10:00-22:00'),
(90, 'Conciertos', '8282828', 'Lunes a Domingo 10:00-22:00'),
(91, 'Festivales', '8383838', 'Lunes a Domingo 8:00-22:00'),
(92, 'Ferias', '8484848', 'Lunes a Domingo 8:00-20:00'),
(93, 'Mercados', '8585858', 'Lunes a Domingo 5:00-18:00'),
(94, 'Centros Comerciales', '8686868', 'Lunes a Domingo 10:00-22:00'),
(95, 'Restaurantes', '8787878', 'Lunes a Domingo 10:00-23:00'),
(96, 'Hoteles', '8888888', '24 horas'),
(97, 'Turismo Rural', '8989898', 'Lunes a Domingo 7:00-18:00'),
(98, 'Ecoturismo', '9090909', 'Lunes a Domingo 6:00-18:00'),
(99, 'Aventura', '9191919', 'Lunes a Domingo 7:00-17:00'),
(100, 'Senderismo', '9292929', 'Lunes a Domingo 6:00-18:00'),
(101, 'Ciclismo', '9393939', 'Lunes a Domingo 5:00-19:00'),
(102, 'Natación', '9494949', 'Lunes a Domingo 6:00-22:00'),
(103, 'Gimnasios', '9595959', 'Lunes a Domingo 5:00-23:00'),
(104, 'Yoga', '9696969', 'Lunes a Domingo 6:00-21:00'),
(105, 'Meditación', '9797979', 'Lunes a Domingo 6:00-20:00'),
(106, 'Terapias', '9898989', 'Lunes a Sábado 8:00-18:00'),
(107, 'Spa', '9999999', 'Lunes a Domingo 9:00-20:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensajesmotivacionales`
--

CREATE TABLE `mensajesmotivacionales` (
  `id_mensaje` int(11) NOT NULL,
  `texto` text NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `fecha_creacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `mensajesmotivacionales`
--

INSERT INTO `mensajesmotivacionales` (`id_mensaje`, `texto`, `categoria`, `fecha_creacion`) VALUES
(1, 'Cada viaje en metro es una oportunidad para conectar con tu ciudad', 'MOTIVACION', '2025-01-01'),
(2, 'Tu tranquilidad es nuestro compromiso diario', 'BIENESTAR', '2025-01-02'),
(3, 'Juntos construimos una ciudad más sostenible', 'SOSTENIBILIDAD', '2025-01-03'),
(4, 'El respeto mutuo hace que cada viaje sea mejor', 'CONVIVENCIA', '2025-01-04'),
(5, 'Tu seguridad es nuestra prioridad número uno', 'SEGURIDAD', '2025-01-05'),
(6, 'Cada día es una nueva oportunidad para crecer', 'MOTIVACION', '2025-01-06'),
(7, 'Cuidar el medio ambiente está en tus manos', 'SOSTENIBILIDAD', '2025-01-07'),
(8, 'La cortesía hace la diferencia en cada viaje', 'CONVIVENCIA', '2025-01-08'),
(9, 'Respira profundo y disfruta el trayecto', 'BIENESTAR', '2025-01-09'),
(10, 'Mantente alerta y cuida tus pertenencias', 'SEGURIDAD', '2025-01-10'),
(11, 'Tu sonrisa puede alegrar el día de alguien más', 'MOTIVACION', '2025-01-11'),
(12, 'Usar transporte público es cuidar el planeta', 'SOSTENIBILIDAD', '2025-01-12'),
(13, 'Cede el asiento, comparte la amabilidad', 'CONVIVENCIA', '2025-01-13'),
(14, 'Mantén una actitud positiva todo el día', 'BIENESTAR', '2025-01-14'),
(15, 'Reporta cualquier situación sospechosa', 'SEGURIDAD', '2025-01-15'),
(16, 'Cada meta alcanzada es un nuevo comienzo', 'MOTIVACION', '2025-01-16'),
(17, 'Reduce tu huella de carbono viajando en metro', 'SOSTENIBILIDAD', '2025-01-17'),
(18, 'La paciencia es la clave de la armonía', 'CONVIVENCIA', '2025-01-18'),
(19, 'Cuida tu salud mental con pequeños descansos', 'BIENESTAR', '2025-01-19'),
(20, 'Las salidas de emergencia están señalizadas', 'SEGURIDAD', '2025-01-20'),
(21, 'Persiste y alcanzarás tus sueños', 'MOTIVACION', '2025-01-21'),
(22, 'Cada viaje compartido es aire más limpio', 'SOSTENIBILIDAD', '2025-01-22'),
(23, 'Un gesto amable multiplica la felicidad', 'CONVIVENCIA', '2025-01-23'),
(24, 'La gratitud transforma tu perspectiva', 'BIENESTAR', '2025-01-24'),
(25, 'Conoce las rutas de evacuación de la estación', 'SEGURIDAD', '2025-01-25'),
(26, 'Los obstáculos son oportunidades disfrazadas', 'MOTIVACION', '2025-01-26'),
(27, 'Tu elección de transporte impacta el futuro', 'SOSTENIBILIDAD', '2025-01-27'),
(28, 'Escucha música con audífonos, respeta el silencio', 'CONVIVENCIA', '2025-01-28'),
(29, 'Una alimentación balanceada te da energía', 'BIENESTAR', '2025-01-29'),
(30, 'Mantén distancia de la línea amarilla', 'SEGURIDAD', '2025-01-30'),
(31, 'La constancia es el camino hacia el éxito', 'MOTIVACION', '2025-01-31'),
(32, 'Menos carros, más vida para la ciudad', 'SOSTENIBILIDAD', '2025-02-01'),
(33, 'Ayuda a quien lo necesite sin que te lo pidan', 'CONVIVENCIA', '2025-02-02'),
(34, 'El ejercicio regular mejora tu estado de ánimo', 'BIENESTAR', '2025-02-03'),
(35, 'Guarda el equilibrio al subir y bajar', 'SEGURIDAD', '2025-02-04'),
(36, 'Cada nuevo día trae nuevas posibilidades', 'MOTIVACION', '2025-02-05'),
(37, 'El metro conecta personas y reduce emisiones', 'SOSTENIBILIDAD', '2025-02-06'),
(38, 'Mantén un tono de voz moderado', 'CONVIVENCIA', '2025-02-07'),
(39, 'Hidrátate bien durante todo el día', 'BIENESTAR', '2025-02-08'),
(40, 'Usa los pasamanos para mayor estabilidad', 'SEGURIDAD', '2025-02-09'),
(41, 'La disciplina te llevará lejos', 'MOTIVACION', '2025-02-10'),
(42, 'Movilidad sostenible para un futuro mejor', 'SOSTENIBILIDAD', '2025-02-11'),
(43, 'Ofrece ayuda a personas con discapacidad', 'CONVIVENCIA', '2025-02-12'),
(44, 'Duerme bien para rendir mejor', 'BIENESTAR', '2025-02-13'),
(45, 'Espera que los pasajeros salgan antes de entrar', 'SEGURIDAD', '2025-02-14'),
(46, 'Tu actitud determina tu altitud', 'MOTIVACION', '2025-02-15'),
(47, 'Cada kilómetro en metro es un respiro para la Tierra', 'SOSTENIBILIDAD', '2025-02-16'),
(48, 'Respeta los espacios preferenciales', 'CONVIVENCIA', '2025-02-17'),
(49, 'La risa es el mejor medicamento', 'BIENESTAR', '2025-02-18'),
(50, 'Mantente alejado de los bordes del andén', 'SEGURIDAD', '2025-02-19'),
(51, 'Los sueños grandes requieren pasos pequeños', 'MOTIVACION', '2025-02-20'),
(52, 'Transporte público inteligente para ciudades inteligentes', 'SOSTENIBILIDAD', '2025-02-21'),
(53, 'Una disculpa sincera abre muchas puertas', 'CONVIVENCIA', '2025-02-22'),
(54, 'Medita unos minutos para encontrar paz interior', 'BIENESTAR', '2025-02-23'),
(55, 'Sujétate bien durante el recorrido', 'SEGURIDAD', '2025-02-24'),
(56, 'La paciencia y el tiempo lo pueden todo', 'MOTIVACION', '2025-02-25'),
(57, 'Elige verde, elige metro, elige futuro', 'SOSTENIBILIDAD', '2025-02-26'),
(58, 'Mantén limpio tu espacio y el de todos', 'CONVIVENCIA', '2025-02-27'),
(59, 'Una alimentación consciente nutre cuerpo y alma', 'BIENESTAR', '2025-02-28'),
(60, 'Respeta las señales de seguridad', 'SEGURIDAD', '2025-03-01'),
(61, 'El éxito es la suma de pequeños esfuerzos', 'MOTIVACION', '2025-03-02'),
(62, 'Movilidad limpia para generaciones futuras', 'SOSTENIBILIDAD', '2025-03-03'),
(63, 'Da las gracias, es un gesto que vale mucho', 'CONVIVENCIA', '2025-03-04'),
(64, 'Conecta con la naturaleza para recargar energías', 'BIENESTAR', '2025-03-05'),
(65, 'Ten precaución en escaleras mecánicas', 'SEGURIDAD', '2025-03-06'),
(66, 'Cada día es una página en blanco para escribir', 'MOTIVACION', '2025-03-07'),
(67, 'Tu viaje consciente contribuye al planeta', 'SOSTENIBILIDAD', '2025-03-08'),
(68, 'Sé puntual, respeta el tiempo de otros', 'CONVIVENCIA', '2025-03-09'),
(69, 'Practica la respiración profunda para relajarte', 'BIENESTAR', '2025-03-10'),
(70, 'Utiliza correctamente los sistemas de emergencia', 'SEGURIDAD', '2025-03-11'),
(71, 'La perseverancia vence cualquier resistencia', 'MOTIVACION', '2025-03-12'),
(72, 'Menos tráfico, más calidad de aire', 'SOSTENIBILIDAD', '2025-03-13'),
(73, 'Comparte tu paraguas en días lluviosos', 'CONVIVENCIA', '2025-03-14'),
(74, 'Una actitud positiva atrae experiencias positivas', 'BIENESTAR', '2025-03-15'),
(75, 'Mantén tus pertenencias seguras y a la vista', 'SEGURIDAD', '2025-03-16'),
(76, 'Los grandes logros empiezan con la decisión de intentarlo', 'MOTIVACION', '2025-03-17'),
(77, 'El metro: tu aliado contra el cambio climático', 'SOSTENIBILIDAD', '2025-03-18'),
(78, 'Saluda con una sonrisa, contagia alegría', 'CONVIVENCIA', '2025-03-19'),
(79, 'El autocuidado no es egoísmo, es necesidad', 'BIENESTAR', '2025-03-20'),
(80, 'Conoce los números de emergencia', 'SEGURIDAD', '2025-03-21'),
(81, 'La confianza en ti mismo abre caminos', 'MOTIVACION', '2025-03-22'),
(82, 'Cada usuario consciente hace la diferencia', 'SOSTENIBILIDAD', '2025-03-23'),
(83, 'Ofrece tu lugar a embarazadas y adultos mayores', 'CONVIVENCIA', '2025-03-24'),
(84, 'Celebra los pequeños triunfos de cada día', 'BIENESTAR', '2025-03-25'),
(85, 'Reporta objetos abandonados sospechosos', 'SEGURIDAD', '2025-03-26'),
(86, 'El fracaso es el primer paso hacia el éxito', 'MOTIVACION', '2025-03-27'),
(87, 'Viaja verde, piensa en el mañana', 'SOSTENIBILIDAD', '2025-03-28'),
(88, 'Una palabra amable puede cambiar un día completo', 'CONVIVENCIA', '2025-03-29'),
(89, 'Encuentra belleza en los momentos simples', 'BIENESTAR', '2025-03-30'),
(90, 'Mantente informado sobre protocolos de seguridad', 'SEGURIDAD', '2025-03-31'),
(91, 'Tu potencial es infinito, solo necesitas creerlo', 'MOTIVACION', '2025-04-01'),
(92, 'Movilidad sostenible: decisión inteligente', 'SOSTENIBILIDAD', '2025-04-02'),
(93, 'Respeta el espacio personal de los demás', 'CONVIVENCIA', '2025-04-03'),
(94, 'La gratitud es la llave de la felicidad', 'BIENESTAR', '2025-04-04'),
(95, 'Colabora con las autoridades cuando sea necesario', 'SEGURIDAD', '2025-04-05'),
(96, 'Cada desafío superado te hace más fuerte', 'MOTIVACION', '2025-04-06'),
(97, 'Tu elección de transporte es tu voto por el planeta', 'SOSTENIBILIDAD', '2025-04-07'),
(98, 'Practica la empatía en cada interacción', 'CONVIVENCIA', '2025-04-08'),
(99, 'Cuida tu salud mental con la misma importancia que la física', 'BIENESTAR', '2025-04-09'),
(100, 'Mantente alerta pero relajado durante el viaje', 'SEGURIDAD', '2025-04-10'),
(101, 'El optimismo es un imán para los milagros', 'MOTIVACION', '2025-04-11'),
(102, 'Metro: conectando personas, cuidando el ambiente', 'SOSTENIBILIDAD', '2025-04-12'),
(103, 'Un pequeño acto de bondad puede iluminar el mundo', 'CONVIVENCIA', '2025-04-13'),
(104, 'La paz interior se refleja en tu entorno', 'BIENESTAR', '2025-04-14'),
(105, 'Tu seguridad y la de otros está en tus manos', 'SEGURIDAD', '2025-04-15');

-- --------------------------------------------------------

--
-- Estrutura para tabela `metrocoins`
--

CREATE TABLE `metrocoins` (
  `id_movimiento` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_movimiento` enum('ganado','gastado','bono') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `metrocoins`
--

INSERT INTO `metrocoins` (`id_movimiento`, `id_usuario`, `tipo_movimiento`, `cantidad`, `fecha`, `descripcion`) VALUES
(1, 1, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(2, 2, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(3, 3, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(4, 4, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(5, 5, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(6, 6, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(7, 7, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(8, 8, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(9, 9, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(10, 10, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(11, 11, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(12, 12, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(13, 13, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(14, 14, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(15, 15, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(16, 16, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(17, 17, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(18, 18, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(19, 19, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(20, 20, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(21, 21, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(22, 22, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(23, 23, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(24, 24, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(25, 25, 'bono', 50, '2025-10-02 04:27:16', 'Bono de bienvenida por registro'),
(32, 1, 'ganado', 20, '2025-10-02 04:27:16', 'Ganó partida en trivia MetroMed'),
(33, 2, 'ganado', 15, '2025-10-02 04:27:16', 'Completó reto de rutas'),
(34, 3, 'gastado', 30, '2025-10-02 04:27:16', 'Canjeó monedas por descuento en pasaje'),
(35, 4, 'ganado', 40, '2025-10-02 04:27:16', 'Participó en minijuego de rapidez'),
(36, 5, 'gastado', 10, '2025-10-02 04:27:16', 'Canjeó monedas por sticker virtual'),
(37, 10, 'ganado', 25, '2025-10-02 04:27:16', 'Ganó trivia sobre movilidad'),
(38, 12, 'gastado', 20, '2025-10-02 04:27:16', 'Canjeó monedas en tienda virtual'),
(39, 15, 'ganado', 50, '2025-10-02 04:27:16', 'Bono extra por actividad frecuente'),
(40, 20, 'ganado', 30, '2025-10-02 04:27:16', 'Ganó minijuego de rapidez'),
(41, 25, 'gastado', 15, '2025-10-02 04:27:16', 'Canjeó monedas por ítem especial');

-- --------------------------------------------------------

--
-- Estrutura para tabela `preferenciasusuario`
--

CREATE TABLE `preferenciasusuario` (
  `id_preferencia` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_alerta` varchar(100) NOT NULL,
  `estacion_interes` int(11) DEFAULT NULL,
  `medio_envio` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `preferenciasusuario`
--

INSERT INTO `preferenciasusuario` (`id_preferencia`, `id_usuario`, `tipo_alerta`, `estacion_interes`, `medio_envio`) VALUES
(1, 1, 'MANTENIMIENTO', 1, 'EMAIL'),
(2, 2, 'RETRASO', 2, 'SMS'),
(3, 3, 'EMERGENCIA', 3, 'PUSH'),
(4, 4, 'CONGESTION', 4, 'EMAIL'),
(5, 5, 'CLIMA', 5, 'SMS'),
(6, 6, 'MANTENIMIENTO', 6, 'PUSH'),
(7, 7, 'RETRASO', 7, 'EMAIL'),
(8, 8, 'SEGURIDAD', 8, 'SMS'),
(9, 9, 'EMERGENCIA', 9, 'PUSH'),
(10, 10, 'CONGESTION', 10, 'EMAIL'),
(11, 11, 'CLIMA', 11, 'SMS'),
(12, 12, 'MANTENIMIENTO', 12, 'PUSH'),
(13, 13, 'RETRASO', 13, 'EMAIL'),
(14, 14, 'EMERGENCIA', 14, 'SMS'),
(15, 15, 'CONGESTION', 15, 'PUSH'),
(16, 16, 'CLIMA', 16, 'EMAIL'),
(17, 17, 'MANTENIMIENTO', 17, 'SMS'),
(18, 18, 'RETRASO', 18, 'PUSH'),
(19, 19, 'SEGURIDAD', 19, 'EMAIL'),
(20, 20, 'EMERGENCIA', 20, 'SMS'),
(21, 21, 'CONGESTION', 21, 'PUSH'),
(22, 22, 'CLIMA', 22, 'EMAIL'),
(23, 23, 'MANTENIMIENTO', 23, 'SMS'),
(24, 24, 'RETRASO', 24, 'PUSH'),
(25, 25, 'EMERGENCIA', 25, 'EMAIL'),
(26, 26, 'CONGESTION', 26, 'SMS'),
(27, 27, 'CLIMA', 27, 'PUSH'),
(28, 28, 'MANTENIMIENTO', 28, 'EMAIL'),
(29, 29, 'RETRASO', 29, 'SMS'),
(30, 30, 'SEGURIDAD', 30, 'PUSH'),
(31, 31, 'EMERGENCIA', 31, 'EMAIL'),
(32, 32, 'CONGESTION', 32, 'SMS'),
(33, 33, 'CLIMA', 33, 'PUSH'),
(34, 34, 'MANTENIMIENTO', 34, 'EMAIL'),
(35, 35, 'RETRASO', 35, 'SMS'),
(36, 36, 'EMERGENCIA', 36, 'PUSH'),
(37, 37, 'CONGESTION', 37, 'EMAIL'),
(38, 38, 'CLIMA', 38, 'SMS'),
(39, 39, 'MANTENIMIENTO', 39, 'PUSH'),
(40, 40, 'RETRASO', 40, 'EMAIL'),
(41, 41, 'SEGURIDAD', 41, 'SMS'),
(42, 42, 'EMERGENCIA', 42, 'PUSH'),
(43, 43, 'CONGESTION', 43, 'EMAIL'),
(44, 44, 'CLIMA', 44, 'SMS'),
(45, 45, 'MANTENIMIENTO', 45, 'PUSH'),
(46, 46, 'RETRASO', 46, 'EMAIL'),
(47, 47, 'EMERGENCIA', 47, 'SMS'),
(48, 48, 'CONGESTION', 48, 'PUSH'),
(49, 49, 'CLIMA', 49, 'EMAIL'),
(50, 50, 'MANTENIMIENTO', 50, 'SMS'),
(51, 51, 'RETRASO', 51, 'PUSH'),
(52, 52, 'SEGURIDAD', 52, 'EMAIL'),
(53, 53, 'EMERGENCIA', 53, 'SMS'),
(54, 54, 'CONGESTION', 54, 'PUSH'),
(55, 55, 'CLIMA', 55, 'EMAIL'),
(56, 56, 'MANTENIMIENTO', 56, 'SMS'),
(57, 57, 'RETRASO', 57, 'PUSH'),
(58, 58, 'EMERGENCIA', 58, 'EMAIL'),
(59, 59, 'CONGESTION', 59, 'SMS'),
(60, 60, 'CLIMA', 60, 'PUSH'),
(61, 61, 'MANTENIMIENTO', 61, 'EMAIL'),
(62, 62, 'RETRASO', 62, 'SMS'),
(63, 63, 'SEGURIDAD', 63, 'PUSH'),
(64, 64, 'EMERGENCIA', 64, 'EMAIL'),
(65, 65, 'CONGESTION', 65, 'SMS'),
(66, 66, 'CLIMA', 66, 'PUSH'),
(67, 67, 'MANTENIMIENTO', 67, 'EMAIL'),
(68, 68, 'RETRASO', 68, 'SMS'),
(69, 69, 'EMERGENCIA', 69, 'PUSH'),
(70, 70, 'CONGESTION', 70, 'EMAIL'),
(71, 71, 'CLIMA', 71, 'SMS'),
(72, 72, 'MANTENIMIENTO', 72, 'PUSH'),
(73, 73, 'RETRASO', 73, 'EMAIL'),
(74, 74, 'SEGURIDAD', 74, 'SMS'),
(75, 75, 'EMERGENCIA', 75, 'PUSH'),
(76, 76, 'CONGESTION', 76, 'EMAIL'),
(77, 77, 'CLIMA', 77, 'SMS'),
(78, 78, 'MANTENIMIENTO', 78, 'PUSH'),
(79, 79, 'RETRASO', 79, 'EMAIL'),
(80, 80, 'EMERGENCIA', 80, 'SMS'),
(81, 81, 'CONGESTION', 81, 'PUSH'),
(82, 82, 'CLIMA', 82, 'EMAIL'),
(83, 83, 'MANTENIMIENTO', 83, 'SMS'),
(84, 84, 'RETRASO', 84, 'PUSH'),
(85, 85, 'SEGURIDAD', 85, 'EMAIL'),
(86, 86, 'EMERGENCIA', 86, 'SMS'),
(87, 87, 'CONGESTION', 87, 'PUSH'),
(88, 88, 'CLIMA', 88, 'EMAIL'),
(89, 89, 'MANTENIMIENTO', 89, 'SMS'),
(90, 90, 'RETRASO', 90, 'PUSH'),
(91, 91, 'EMERGENCIA', 91, 'EMAIL'),
(92, 92, 'CONGESTION', 92, 'SMS'),
(93, 93, 'CLIMA', 93, 'PUSH'),
(94, 94, 'MANTENIMIENTO', 94, 'EMAIL'),
(95, 95, 'RETRASO', 95, 'SMS'),
(96, 96, 'SEGURIDAD', 96, 'PUSH'),
(97, 97, 'EMERGENCIA', 97, 'EMAIL'),
(98, 98, 'CONGESTION', 98, 'SMS'),
(99, 99, 'CLIMA', 99, 'PUSH'),
(100, 100, 'MANTENIMIENTO', 100, 'EMAIL');

-- --------------------------------------------------------

--
-- Estrutura para tabela `reportes`
--

CREATE TABLE `reportes` (
  `id_reporte` int(11) NOT NULL,
  `id_admin` int(11) DEFAULT NULL,
  `tipo` varchar(20) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `reportes`
--

INSERT INTO `reportes` (`id_reporte`, `id_admin`, `tipo`, `descripcion`, `fecha`) VALUES
(1, 1, 'congestion', 'Alto nivel de congestión detectado en hora pico matutina. Se implementaron medidas de control de flujo.', '2025-09-01 11:30:00'),
(2, 2, 'mantenimiento', 'Mantenimiento preventivo realizado en torniquetes de entrada. Sistema funcionando correctamente.', '2025-09-01 15:15:00'),
(3, 3, 'incidente', 'Reporte de usuario con crisis de ansiedad atendido por personal de primeros auxilios.', '2025-09-01 19:45:00'),
(4, 1, 'estadistica', 'Análisis semanal: 15% reducción en niveles de estrés reportados tras implementación de mensajes motivacionales.', '2025-09-02 13:00:00'),
(5, 2, 'alerta', 'Sistema de alertas activado por sobrecarga en plataforma durante evento deportivo.', '2025-09-03 01:30:00'),
(6, 3, 'mejora', 'Propuesta de instalación de dispensadores de agua en zonas de alta afluencia aprobada.', '2025-09-03 14:00:00'),
(7, 1, 'congestion', 'Congestión moderada en hora valle. Flujo normal de pasajeros mantenido.', '2025-09-03 16:30:00'),
(8, 2, 'incidente', 'Usuario reportó ataque de pánico. Protocolo de apoyo emocional activado exitosamente.', '2025-09-03 20:20:00'),
(9, 3, 'mantenimiento', 'Actualización de software en sistema de monitoreo de congestión completada.', '2025-09-04 08:00:00'),
(10, 1, 'estadistica', 'Reporte mensual: 8,500 usuarios utilizaron líneas de ayuda psicológica.', '2025-09-04 15:00:00'),
(11, 2, 'alerta', 'Alerta preventiva por manifestación cercana. Rutas alternativas comunicadas.', '2025-09-04 21:45:00'),
(12, 3, 'mejora', 'Implementación de música relajante en áreas de espera durante horas pico.', '2025-09-05 12:30:00'),
(13, 1, 'congestion', 'Niveles críticos de congestión por falla técnica en tren. Medidas de contingencia aplicadas.', '2025-09-05 23:00:00'),
(14, 2, 'incidente', 'Tres usuarios con crisis de claustrofobia atendidos durante congestión severa.', '2025-09-05 23:30:00'),
(15, 3, 'mantenimiento', 'Limpieza profunda y desinfección de vagones realizada según protocolo.', '2025-09-06 07:00:00'),
(16, 1, 'estadistica', 'Análisis: Viernes presenta 40% más casos de estrés que otros días laborales.', '2025-09-06 19:00:00'),
(17, 2, 'alerta', 'Sistema de ventilación mejorado en respuesta a quejas de usuarios.', '2025-09-07 14:00:00'),
(18, 3, 'mejora', 'Capacitación en primeros auxilios psicológicos para 50 empleados completada.', '2025-09-07 16:00:00'),
(19, 1, 'congestion', 'Flujo normal durante fin de semana. Sin incidentes reportados.', '2025-09-07 22:00:00'),
(20, 2, 'incidente', 'Usuario con crisis hipertensiva trasladado a centro médico. Protocolo ejecutado correctamente.', '2025-09-08 15:30:00'),
(21, 3, 'mantenimiento', 'Revisión de cámaras de seguridad y sistemas de comunicación completada.', '2025-09-09 04:00:00'),
(22, 1, 'estadistica', 'Reporte semanal: 92% satisfacción con mensajes motivacionales implementados.', '2025-09-09 13:00:00'),
(23, 2, 'alerta', 'Alerta amarilla por pronóstico de lluvia intensa. Personal adicional desplegado.', '2025-09-09 17:00:00'),
(24, 3, 'mejora', 'Nuevos asientos ergonómicos instalados en áreas de espera principales.', '2025-09-09 20:00:00'),
(25, 1, 'congestion', 'Congestión severa por partido de fútbol. Operativo especial implementado exitosamente.', '2025-09-11 00:00:00'),
(26, 2, 'incidente', 'Cinco usuarios con ataques de ansiedad durante aglomeración. Todos atendidos adecuadamente.', '2025-09-11 00:45:00'),
(27, 3, 'mantenimiento', 'Actualización de señalética con información de líneas de ayuda psicológica.', '2025-09-11 15:00:00'),
(28, 1, 'estadistica', 'Análisis comparativo: 25% reducción en incidentes de estrés vs mes anterior.', '2025-09-11 19:00:00'),
(29, 2, 'alerta', 'Sistema de alertas tempranas funcionando al 98% de eficiencia.', '2025-09-12 13:30:00'),
(30, 3, 'mejora', 'Implementación de aromaterapia sutil en vagones durante hora pico matutina.', '2025-09-12 11:00:00'),
(31, 1, 'congestion', 'Niveles normales de ocupación. Sin reportes de malestar en usuarios.', '2025-09-12 17:00:00'),
(32, 2, 'incidente', 'Usuario con síndrome de burnout identificado y referido a servicios de apoyo.', '2025-09-13 14:15:00'),
(33, 3, 'mantenimiento', 'Mantenimiento correctivo en sistema de aire acondicionado completado.', '2025-09-13 08:00:00'),
(34, 1, 'estadistica', 'Viernes 13: Incremento del 15% en niveles de ansiedad detectados. Medidas preventivas activadas.', '2025-09-13 21:00:00'),
(35, 2, 'alerta', 'Alerta por concierto masivo. Refuerzo de personal y protocolos anti-estrés.', '2025-09-14 22:00:00'),
(36, 3, 'mejora', 'Instalación de pantallas con contenido relajante en plataformas completada.', '2025-09-14 16:00:00'),
(37, 1, 'congestion', 'Sábado con flujo moderado. Ambiente general tranquilo reportado.', '2025-09-15 01:00:00'),
(38, 2, 'incidente', 'Dos usuarios con crisis de pánico atendidos. Recuperación satisfactoria.', '2025-09-15 18:30:00'),
(39, 3, 'mantenimiento', 'Calibración de sensores de monitoreo de congestión realizada.', '2025-09-15 09:00:00'),
(40, 1, 'estadistica', 'Domingo: Día con menores índices de estrés registrados en el mes.', '2025-09-15 23:00:00'),
(41, 2, 'alerta', 'Preparación para semana laboral. Protocolos de hora pico actualizados.', '2025-09-16 10:00:00'),
(42, 3, 'mejora', 'Nuevo sistema de comunicación para reportes de bienestar implementado.', '2025-09-16 14:00:00'),
(43, 1, 'congestion', 'Lunes crítico: Congestión extrema en hora pico matutina. Medidas ejecutadas.', '2025-09-16 12:30:00'),
(44, 2, 'incidente', 'Ocho usuarios con síntomas de estrés laboral identificados y asistidos.', '2025-09-16 13:00:00'),
(45, 3, 'mantenimiento', 'Limpieza especializada de filtros de aire para mejorar calidad ambiental.', '2025-09-17 07:00:00'),
(46, 1, 'estadistica', 'Reporte quincenal: 11,000 usuarios beneficiados con programa de bienestar.', '2025-09-17 15:00:00'),
(47, 2, 'alerta', 'Alerta naranja por manifestación. Rutas alternativas y apoyo psicológico disponible.', '2025-09-17 19:00:00'),
(48, 3, 'mejora', 'Espacios de meditación habilitados en estaciones principales.', '2025-09-18 13:00:00'),
(49, 1, 'congestion', 'Congestión controlada mediante sistema de acceso escalonado.', '2025-09-18 23:30:00'),
(50, 2, 'incidente', 'Usuario con ataque de agorafobia asistido por equipo especializado.', '2025-09-18 17:15:00'),
(51, 3, 'mantenimiento', 'Actualización de protocolos de emergencia psicológica completada.', '2025-09-19 14:00:00'),
(52, 1, 'estadistica', 'Jueves: Segundo día con más reportes de fatiga mental en usuarios.', '2025-09-19 20:00:00'),
(53, 2, 'alerta', 'Sistema predictivo indica posible congestión para mañana. Medidas preventivas activas.', '2025-09-20 01:00:00'),
(54, 3, 'mejora', 'Iluminación LED con temperatura de color relajante instalada en pasillos.', '2025-09-20 15:00:00'),
(55, 1, 'congestion', 'Viernes con congestión severa. Protocolo de gestión de multitudes exitoso.', '2025-09-20 22:45:00'),
(56, 2, 'incidente', 'Cuatro usuarios con crisis de ansiedad social atendidos durante hora pico.', '2025-09-20 23:00:00'),
(57, 3, 'mantenimiento', 'Revisión completa de sistemas de megafonía y comunicación de emergencia.', '2025-09-21 08:00:00'),
(58, 1, 'estadistica', 'Análisis semanal: Efectividad del 87% en reducción de estrés con intervenciones.', '2025-09-21 14:00:00'),
(59, 2, 'alerta', 'Fin de semana festivo. Personal adicional y recursos de apoyo desplegados.', '2025-09-21 17:00:00'),
(60, 3, 'mejora', 'Aplicación móvil de bienestar mental lanzada para usuarios del metro.', '2025-09-21 19:00:00'),
(61, 1, 'congestion', 'Sábado festivo con alta afluencia pero flujo controlado satisfactoriamente.', '2025-09-22 00:00:00'),
(62, 2, 'incidente', 'Tres usuarios con mareos por calor atendidos. Hidratación proporcionada.', '2025-09-22 19:30:00'),
(63, 3, 'mantenimiento', 'Mantenimiento preventivo de escaleras eléctricas y ascensores completado.', '2025-09-22 10:00:00'),
(64, 1, 'estadistica', 'Domingo: 95% usuarios reportan sentirse más tranquilos con nuevas medidas.', '2025-09-22 22:00:00'),
(65, 2, 'alerta', 'Preparación para nueva semana laboral. Recursos optimizados.', '2025-09-23 11:00:00'),
(66, 3, 'mejora', 'Zona de descompresión con plantas y agua implementada en estación central.', '2025-09-23 15:00:00'),
(67, 1, 'congestion', 'Inicio de semana con congestión moderada. Flujo mejorado vs semanas anteriores.', '2025-09-23 12:45:00'),
(68, 2, 'incidente', 'Usuario con episodio depresivo grave referido a servicios especializados.', '2025-09-23 16:20:00'),
(69, 3, 'mantenimiento', 'Sistema de climatización optimizado para reducir sensación de agobio.', '2025-09-24 07:30:00'),
(70, 1, 'estadistica', 'Reporte especial: 30% reducción en quejas relacionadas con estrés este mes.', '2025-09-24 14:00:00'),
(71, 2, 'alerta', 'Alerta preventiva por evento masivo próximo. Coordinación con autoridades.', '2025-09-24 18:00:00'),
(72, 3, 'mejora', 'Programa de mindfulness para empleados iniciado con 100 participantes.', '2025-09-24 20:00:00'),
(73, 1, 'congestion', 'Martes con flujo normal. Sin incidentes de congestión reportados.', '2025-09-24 23:00:00'),
(74, 2, 'incidente', 'Dos usuarios con ataques de pánico leves. Técnicas de respiración aplicadas exitosamente.', '2025-09-24 21:45:00'),
(75, 3, 'mantenimiento', 'Actualización de software de monitoreo de bienestar de usuarios.', '2025-09-25 09:00:00'),
(76, 1, 'estadistica', 'Miércoles: Pico de uso de líneas de ayuda psicológica con 450 llamadas.', '2025-09-25 17:00:00'),
(77, 2, 'alerta', 'Sistema funcionando óptimamente. Niveles de estrés dentro de parámetros normales.', '2025-09-25 19:00:00'),
(78, 3, 'mejora', 'Señalización mejorada con códigos de colores para reducir ansiedad.', '2025-09-25 13:30:00'),
(79, 1, 'congestion', 'Hora pico vespertina con congestión controlada mediante acceso regulado.', '2025-09-25 22:30:00'),
(80, 2, 'incidente', 'Usuario con crisis hipertensiva estabilizado. Traslado médico coordinado.', '2025-09-26 00:00:00'),
(81, 3, 'mantenimiento', 'Inspección rutinaria de equipos de primeros auxilios completada.', '2025-09-26 03:00:00'),
(82, 1, 'estadistica', 'Evaluación diaria: 88% de efectividad en protocolos de gestión emocional.', '2025-09-26 01:00:00'),
(83, 2, 'alerta', 'Pronóstico favorable para mañana. Sistemas operando normalmente.', '2025-09-26 02:00:00'),
(84, 3, 'mejora', 'Capacitación en inteligencia emocional para supervisores completada.', '2025-09-25 21:00:00'),
(85, 1, 'congestion', 'Análisis predictivo sugiere congestión moderada para próximas 48 horas.', '2025-09-26 04:00:00'),
(86, 2, 'incidente', 'Un usuario con síndrome de estrés postraumático asistido adecuadamente.', '2025-09-25 20:30:00'),
(87, 3, 'mantenimiento', 'Limpieza y sanitización nocturna de todas las instalaciones.', '2025-09-26 06:00:00'),
(88, 1, 'estadistica', 'Resumen: 15,000 usuarios beneficiados con programa integral de bienestar.', '2025-09-26 04:30:00'),
(89, 2, 'alerta', 'Todos los sistemas de alerta temprana funcionando correctamente.', '2025-09-26 04:45:00'),
(90, 3, 'mejora', 'Plan de expansión de zonas de confort aprobado para Q4 2025.', '2025-09-26 03:30:00'),
(91, 1, 'congestion', 'Proyección: Reducción esperada del 20% en congestión con nuevas medidas.', '2025-09-26 04:50:00'),
(92, 2, 'incidente', 'Cero incidentes graves en últimas 6 horas. Tendencia positiva.', '2025-09-26 04:55:00'),
(93, 3, 'mantenimiento', 'Programa de mantenimiento preventivo para octubre finalizado y aprobado.', '2025-09-26 04:58:00'),
(94, 1, 'estadistica', 'Cierre del día: Todos los KPIs de bienestar dentro de objetivos establecidos.', '2025-09-26 04:59:00');

-- --------------------------------------------------------

--
-- Estrutura para tabela `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(2, 'Administrador'),
(1, 'Usuario');

-- --------------------------------------------------------

--
-- Estrutura para tabela `trazabilidad`
--

CREATE TABLE `trazabilidad` (
  `id_traza` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `accion` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `trazabilidad`
--

INSERT INTO `trazabilidad` (`id_traza`, `id_usuario`, `accion`, `descripcion`, `fecha`) VALUES
(1, 1, 'Login', 'Usuario inició sesión desde la aplicación móvil', '2025-09-01 13:15:23'),
(2, 2, 'Consulta Estación', 'Consultó estado de estación San Antonio', '2025-09-01 13:30:45'),
(3, 3, 'Configurar Alerta', 'Administrador configuró nueva alerta de congestión', '2025-09-01 14:00:12'),
(4, 1, 'Logout', 'Usuario cerró sesión', '2025-09-01 14:45:33'),
(5, 4, 'Login', 'Administrador inició sesión desde panel web', '2025-09-01 15:15:22'),
(6, 2, 'Actualizar Perfil', 'Usuario actualizó información de contacto', '2025-09-01 16:20:15'),
(7, 5, 'Generar Reporte', 'Administrador generó reporte mensual de usuarios', '2025-09-01 17:30:44'),
(8, 1, 'Suscribir Alerta', 'Usuario se suscribió a alertas de estación Poblado', '2025-09-01 18:15:28'),
(9, 3, 'Modificar Usuario', 'Administrador modificó permisos de usuario', '2025-09-01 19:22:17'),
(10, 2, 'Consulta Horarios', 'Usuario consultó horarios de operación', '2025-09-01 20:10:33'),
(11, 4, 'Crear Mensaje', 'Administrador creó mensaje motivacional', '2025-09-01 21:45:21'),
(12, 1, 'Login', 'Usuario inició sesión desde navegador web', '2025-09-02 12:20:15'),
(13, 5, 'Revisar Alertas', 'Administrador revisó alertas pendientes', '2025-09-02 13:30:22'),
(14, 2, 'Cambiar Preferencias', 'Usuario cambió preferencias de notificaciones', '2025-09-02 14:15:44'),
(15, 1, 'Consulta Mapa', 'Usuario consultó mapa de estaciones', '2025-09-02 15:22:11'),
(16, 3, 'Desactivar Usuario', 'Administrador desactivó cuenta de usuario', '2025-09-02 16:35:29'),
(17, 4, 'Login', 'Administrador inició sesión', '2025-09-02 17:10:17'),
(18, 2, 'Reportar Incidente', 'Usuario reportó incidente en estación', '2025-09-02 18:25:33'),
(19, 5, 'Actualizar Estación', 'Administrador actualizó estado de estación', '2025-09-02 19:40:22'),
(20, 1, 'Logout', 'Usuario cerró sesión', '2025-09-02 20:55:18'),
(21, 3, 'Crear Línea Ayuda', 'Administrador agregó nueva línea de ayuda', '2025-09-02 21:20:25'),
(22, 2, 'Login', 'Usuario inició sesión', '2025-09-03 13:05:12'),
(23, 4, 'Eliminar Alerta', 'Administrador eliminó alerta obsoleta', '2025-09-03 14:15:33'),
(24, 1, 'Consulta Historial', 'Usuario consultó historial de viajes', '2025-09-03 15:30:44'),
(25, 5, 'Backup Base Datos', 'Administrador ejecutó respaldo de base de datos', '2025-09-03 16:45:22'),
(26, 2, 'Actualizar Contraseña', 'Usuario cambió su contraseña', '2025-09-03 17:20:15'),
(27, 3, 'Login', 'Administrador inició sesión', '2025-09-03 18:35:28'),
(28, 1, 'Consulta Tarifas', 'Usuario consultó información de tarifas', '2025-09-03 19:50:17'),
(29, 4, 'Modificar Estación', 'Administrador modificó datos de estación', '2025-09-03 20:25:33'),
(30, 2, 'Suscribir Notificaciones', 'Usuario activó notificaciones push', '2025-09-03 21:40:21'),
(31, 5, 'Generar Estadísticas', 'Administrador generó estadísticas de uso', '2025-09-04 13:10:15'),
(32, 1, 'Login', 'Usuario inició sesión desde tablet', '2025-09-04 14:25:22'),
(33, 3, 'Crear Usuario', 'Administrador creó nueva cuenta de usuario', '2025-09-04 15:40:33'),
(34, 2, 'Consulta Rutas', 'Usuario consultó rutas disponibles', '2025-09-04 16:55:44'),
(35, 4, 'Actualizar Sistema', 'Administrador aplicó actualización de sistema', '2025-09-04 17:30:11'),
(36, 1, 'Logout', 'Usuario cerró sesión', '2025-09-04 18:45:28'),
(37, 5, 'Revisar Logs', 'Administrador revisó logs de seguridad', '2025-09-04 19:20:17'),
(38, 2, 'Cambiar Idioma', 'Usuario cambió idioma de la aplicación', '2025-09-04 20:35:33'),
(39, 3, 'Login', 'Administrador inició sesión', '2025-09-04 21:50:22'),
(40, 1, 'Consulta Tiempo Real', 'Usuario consultó información en tiempo real', '2025-09-05 12:15:15'),
(41, 4, 'Configurar Backup', 'Administrador configuró respaldo automático', '2025-09-05 13:30:21'),
(42, 2, 'Actualizar Foto Perfil', 'Usuario actualizó foto de perfil', '2025-09-05 14:45:33'),
(43, 5, 'Login', 'Administrador inició sesión', '2025-09-05 15:20:44'),
(44, 1, 'Descargar App', 'Usuario descargó aplicación móvil', '2025-09-05 16:35:22'),
(45, 3, 'Eliminar Usuario', 'Administrador eliminó cuenta inactiva', '2025-09-05 17:50:15'),
(46, 2, 'Consulta Promociones', 'Usuario consultó promociones vigentes', '2025-09-05 18:25:28'),
(47, 4, 'Crear Promoción', 'Administrador creó nueva promoción', '2025-09-05 19:40:17'),
(48, 1, 'Login', 'Usuario inició sesión', '2025-09-05 20:55:33'),
(49, 5, 'Generar Informe', 'Administrador generó informe de incidentes', '2025-09-06 13:10:22'),
(50, 2, 'Logout', 'Usuario cerró sesión', '2025-09-06 14:25:15'),
(51, 3, 'Actualizar Permisos', 'Administrador actualizó permisos de rol', '2025-09-06 15:40:28'),
(52, 1, 'Consulta FAQ', 'Usuario consultó preguntas frecuentes', '2025-09-06 16:55:17'),
(53, 4, 'Login', 'Administrador inició sesión', '2025-09-06 17:30:33'),
(54, 2, 'Activar 2FA', 'Usuario activó autenticación de dos factores', '2025-09-06 18:45:22'),
(55, 5, 'Mantenimiento', 'Administrador ejecutó mantenimiento programado', '2025-09-06 19:20:44'),
(56, 1, 'Consulta Contacto', 'Usuario consultó información de contacto', '2025-09-06 20:35:15'),
(57, 3, 'Crear Backup', 'Administrador creó respaldo manual', '2025-09-06 21:50:28'),
(58, 2, 'Login', 'Usuario inició sesión', '2025-09-07 12:25:17'),
(59, 4, 'Actualizar Mensaje', 'Administrador actualizó mensaje del sistema', '2025-09-07 13:40:33'),
(60, 1, 'Consulta Noticias', 'Usuario consultó noticias del sistema', '2025-09-07 14:55:22'),
(61, 5, 'Login', 'Administrador inició sesión', '2025-09-07 15:30:44'),
(62, 2, 'Cambiar Tema', 'Usuario cambió tema visual de la aplicación', '2025-09-07 16:45:15'),
(63, 3, 'Revisar Auditoría', 'Administrador revisó logs de auditoría', '2025-09-07 17:20:28'),
(64, 1, 'Logout', 'Usuario cerró sesión', '2025-09-07 18:35:17'),
(65, 4, 'Optimizar BD', 'Administrador optimizó base de datos', '2025-09-07 19:50:33'),
(66, 2, 'Consulta Tutorial', 'Usuario accedió a tutorial de uso', '2025-09-07 20:25:22'),
(67, 5, 'Crear Respaldo', 'Administrador creó respaldo de seguridad', '2025-09-07 21:40:44'),
(68, 1, 'Login', 'Usuario inició sesión', '2025-09-08 13:15:15'),
(69, 3, 'Actualizar Política', 'Administrador actualizó política de privacidad', '2025-09-08 14:30:28'),
(70, 2, 'Consulta Términos', 'Usuario consultó términos y condiciones', '2025-09-08 15:45:17'),
(71, 4, 'Login', 'Administrador inició sesión', '2025-09-08 16:20:33'),
(72, 1, 'Sincronizar Datos', 'Usuario sincronizó datos con la nube', '2025-09-08 17:35:22'),
(73, 5, 'Monitorear Sistema', 'Administrador monitoreó estado del sistema', '2025-09-08 18:50:44'),
(74, 2, 'Logout', 'Usuario cerró sesión', '2025-09-08 19:25:15'),
(75, 3, 'Configurar Alerta', 'Administrador configuró alerta de mantenimiento', '2025-09-08 20:40:28'),
(76, 1, 'Consulta Ayuda', 'Usuario accedió al centro de ayuda', '2025-09-08 21:55:17'),
(77, 4, 'Actualizar Servidor', 'Administrador actualizó configuración del servidor', '2025-09-09 12:30:33'),
(78, 2, 'Login', 'Usuario inició sesión', '2025-09-09 13:45:22'),
(79, 5, 'Generar Token', 'Administrador generó token de acceso API', '2025-09-09 14:20:44'),
(80, 1, 'Consulta API', 'Usuario consultó documentación de API', '2025-09-09 15:35:15'),
(81, 3, 'Login', 'Administrador inició sesión', '2025-09-09 16:50:28'),
(82, 2, 'Exportar Datos', 'Usuario exportó sus datos personales', '2025-09-09 17:25:17'),
(83, 4, 'Importar Datos', 'Administrador importó datos de estaciones', '2025-09-09 18:40:33'),
(84, 1, 'Logout', 'Usuario cerró sesión', '2025-09-09 19:55:22'),
(85, 5, 'Validar Integridad', 'Administrador validó integridad de datos', '2025-09-09 20:30:44'),
(86, 2, 'Consulta Estadísticas', 'Usuario consultó sus estadísticas de uso', '2025-09-09 21:45:15'),
(87, 3, 'Crear Política', 'Administrador creó nueva política de seguridad', '2025-09-10 13:20:28'),
(88, 1, 'Login', 'Usuario inició sesión', '2025-09-10 14:35:17'),
(89, 4, 'Ejecutar Script', 'Administrador ejecutó script de mantenimiento', '2025-09-10 15:50:33'),
(90, 2, 'Actualizar Ubicación', 'Usuario actualizó su ubicación preferida', '2025-09-10 16:25:22'),
(91, 5, 'Login', 'Administrador inició sesión', '2025-09-10 17:40:44'),
(92, 1, 'Consulta Ubicación', 'Usuario consultó ubicación de estaciones cercanas', '2025-09-10 18:55:15'),
(93, 3, 'Revisar Incidentes', 'Administrador revisó incidentes reportados', '2025-09-10 19:30:28'),
(94, 2, 'Logout', 'Usuario cerró sesión', '2025-09-10 20:45:17'),
(95, 4, 'Actualizar Firmware', 'Administrador actualizó firmware de dispositivos', '2025-09-10 21:20:33'),
(96, 1, 'Consulta Versión', 'Usuario consultó versión actual de la aplicación', '2025-09-11 12:35:22'),
(97, 5, 'Crear Índice', 'Administrador creó índice para optimización', '2025-09-11 13:50:44'),
(98, 2, 'Login', 'Usuario inició sesión', '2025-09-11 14:25:15'),
(99, 3, 'Configurar SSL', 'Administrador configuró certificados SSL', '2025-09-11 15:40:28'),
(100, 1, 'Descargar Reporte', 'Usuario descargó reporte personal', '2025-09-11 16:55:17'),
(101, 4, 'Login', 'Administrador inició sesión', '2025-09-11 17:30:33');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL DEFAULT 1,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL COMMENT 'Guardar hash seguro (bcrypt, argon2)',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `saldo_metrocoins` int(11) DEFAULT 0,
  `verificado` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nombre`, `correo`, `contrasena`, `fecha_registro`, `saldo_metrocoins`, `verificado`) VALUES
(1, 1, 'Carlos Gómez', 'carlosgomez@example.com', 'hash_contrasena1', '2025-09-23 23:22:57', 50, 0),
(2, 1, 'María Pérez', 'mariaperez@example.com', 'hash_contrasena2', '2025-09-23 23:22:57', 50, 0),
(3, 2, 'Juan Rodríguez', 'juanrodriguez@example.com', 'hash_contrasena3', '2025-09-23 23:22:57', 50, 0),
(4, 2, 'Ana López', 'analopez@example.com', 'hash_contrasena4', '2025-09-23 23:22:57', 50, 0),
(5, 2, 'Pedro Martínez', 'pedromartinez@example.com', 'hash_contrasena5', '2025-09-23 23:22:57', 50, 0),
(6, 1, 'Alejandra Ruiz', 'alejandraruiz@example.com', 'hash_contrasena6', '2025-09-25 23:53:00', 50, 0),
(7, 1, 'Roberto Silva', 'robertosilva@example.com', 'hash_contrasena7', '2025-09-25 23:53:00', 50, 0),
(8, 1, 'Carmen Vargas', 'carmenvargas@example.com', 'hash_contrasena8', '2025-09-25 23:53:00', 50, 0),
(9, 1, 'Diego Morales', 'diegomorales@example.com', 'hash_contrasena9', '2025-09-25 23:53:00', 50, 0),
(10, 1, 'Patricia Jiménez', 'patriciajimenez@example.com', 'hash_contrasena10', '2025-09-25 23:53:00', 50, 0),
(11, 2, 'Fernando Castro', 'fernandocastro@example.com', 'hash_contrasena11', '2025-09-25 23:53:00', 50, 0),
(12, 2, 'Lucía Herrera', 'luciaherrera@example.com', 'hash_contrasena12', '2025-09-25 23:53:00', 50, 0),
(13, 1, 'Manuel Reyes', 'manuelreyes@example.com', 'hash_contrasena13', '2025-09-25 23:53:00', 50, 0),
(14, 1, 'Sofía Medina', 'sofiamedina@example.com', 'hash_contrasena14', '2025-09-25 23:53:00', 50, 0),
(15, 1, 'Gabriel Torres', 'gabrieltorres@example.com', 'hash_contrasena15', '2025-09-25 23:53:00', 50, 0),
(16, 1, 'Valentina Cruz', 'valentinacruz@example.com', 'hash_contrasena16', '2025-09-25 23:53:00', 50, 0),
(17, 2, 'Andrés Ramírez', 'andresramirez@example.com', 'hash_contrasena17', '2025-09-25 23:53:00', 50, 0),
(18, 1, 'Isabella Santos', 'isabellasantos@example.com', 'hash_contrasena18', '2025-09-25 23:53:00', 50, 0),
(19, 1, 'Santiago Flores', 'santiagoflores@example.com', 'hash_contrasena19', '2025-09-25 23:53:00', 50, 0),
(20, 1, 'Camila Guerrero', 'camilaguerrero@example.com', 'hash_contrasena20', '2025-09-25 23:53:00', 50, 0),
(21, 1, 'Nicolás Mendoza', 'nicolasmendoza@example.com', 'hash_contrasena21', '2025-09-25 23:53:00', 50, 0),
(22, 2, 'Victoria Rivera', 'victoriarivera@example.com', 'hash_contrasena22', '2025-09-25 23:53:00', 50, 0),
(23, 1, 'Sebastián Aguilar', 'sebastianaguilar@example.com', 'hash_contrasena23', '2025-09-25 23:53:00', 50, 0),
(24, 1, 'Emilia Rojas', 'emiliarojas@example.com', 'hash_contrasena24', '2025-09-25 23:53:00', 50, 0),
(25, 1, 'Mateo Ortiz', 'mateoortiz@example.com', 'hash_contrasena25', '2025-09-25 23:53:00', 50, 0),
(26, 1, 'Martina Vega', 'martinavega@example.com', 'hash_contrasena26', '2025-09-25 23:53:00', 0, 0),
(27, 2, 'Lucas Romero', 'lucasromero@example.com', 'hash_contrasena27', '2025-09-25 23:53:00', 0, 0),
(28, 1, 'Antonia Muñoz', 'antoniamuñoz@example.com', 'hash_contrasena28', '2025-09-25 23:53:00', 0, 0),
(29, 1, 'Tomás Peña', 'tomaspeña@example.com', 'hash_contrasena29', '2025-09-25 23:53:00', 0, 0),
(30, 1, 'Renata Soto', 'renatasoto@example.com', 'hash_contrasena30', '2025-09-25 23:53:00', 0, 0),
(31, 1, 'Joaquín Moreno', 'joaquinmoreno@example.com', 'hash_contrasena31', '2025-09-25 23:53:00', 0, 0),
(32, 2, 'Catalina Herrera', 'catalinaherrera@example.com', 'hash_contrasena32', '2025-09-25 23:53:00', 0, 0),
(33, 1, 'Iker Delgado', 'ikerdelgado@example.com', 'hash_contrasena33', '2025-09-25 23:53:00', 0, 0),
(34, 1, 'Amparo Ruiz', 'amparoruiz@example.com', 'hash_contrasena34', '2025-09-25 23:53:00', 0, 0),
(35, 1, 'Emilio Castro', 'emiliocastro@example.com', 'hash_contrasena35', '2025-09-25 23:53:00', 0, 0),
(36, 1, 'Daniela Vargas', 'danielavargas@example.com', 'hash_contrasena36', '2025-09-25 23:53:00', 0, 0),
(37, 2, 'Hugo Jiménez', 'hugojimenez@example.com', 'hash_contrasena37', '2025-09-25 23:53:00', 0, 0),
(38, 1, 'Florencia Morales', 'florenciamorales@example.com', 'hash_contrasena38', '2025-09-25 23:53:00', 0, 0),
(39, 1, 'Adrián Reyes', 'adrianreyes@example.com', 'hash_contrasena39', '2025-09-25 23:53:00', 0, 0),
(40, 1, 'Alma Torres', 'almatorres@example.com', 'hash_contrasena40', '2025-09-25 23:53:00', 0, 0),
(41, 1, 'Ricardo Medina', 'ricardomedina@example.com', 'hash_contrasena41', '2025-09-25 23:53:00', 0, 0),
(42, 2, 'Esperanza Cruz', 'esperanzacruz@example.com', 'hash_contrasena42', '2025-09-25 23:53:00', 0, 0),
(43, 1, 'César Ramírez', 'cesarramirez@example.com', 'hash_contrasena43', '2025-09-25 23:53:00', 0, 0),
(44, 1, 'Paloma Santos', 'palomasantos@example.com', 'hash_contrasena44', '2025-09-25 23:53:00', 0, 0),
(45, 1, 'Álvaro Flores', 'alvaroflores@example.com', 'hash_contrasena45', '2025-09-25 23:53:00', 0, 0),
(46, 1, 'Remedios Guerrero', 'remediosguerrero@example.com', 'hash_contrasena46', '2025-09-25 23:53:00', 0, 0),
(47, 2, 'Guillermo Mendoza', 'guillermomendoza@example.com', 'hash_contrasena47', '2025-09-25 23:53:00', 0, 0),
(48, 1, 'Pilar Rivera', 'pilarrivera@example.com', 'hash_contrasena48', '2025-09-25 23:53:00', 0, 0),
(49, 1, 'Ignacio Aguilar', 'ignacioaguilar@example.com', 'hash_contrasena49', '2025-09-25 23:53:00', 0, 0),
(50, 1, 'Rocío Rojas', 'rociorojas@example.com', 'hash_contrasena50', '2025-09-25 23:53:00', 0, 0),
(51, 1, 'Patricio Ortiz', 'patricioortiz@example.com', 'hash_contrasena51', '2025-09-25 23:53:00', 0, 0),
(52, 2, 'Consolación Vega', 'consolacionvega@example.com', 'hash_contrasena52', '2025-09-25 23:53:00', 0, 0),
(53, 1, 'Esteban Romero', 'estebanromero@example.com', 'hash_contrasena53', '2025-09-25 23:53:00', 0, 0),
(54, 1, 'Milagros Muñoz', 'milagrosmuñoz@example.com', 'hash_contrasena54', '2025-09-25 23:53:00', 0, 0),
(55, 1, 'Clemente Peña', 'clementepeña@example.com', 'hash_contrasena55', '2025-09-25 23:53:00', 0, 0),
(56, 1, 'Concepción Soto', 'concepcionsoto@example.com', 'hash_contrasena56', '2025-09-25 23:53:00', 0, 0),
(57, 2, 'Aurelio Moreno', 'aureliomoreno@example.com', 'hash_contrasena57', '2025-09-25 23:53:00', 0, 0),
(58, 1, 'Encarnación Silva', 'encarnacionsilva@example.com', 'hash_contrasena58', '2025-09-25 23:53:00', 0, 0),
(59, 1, 'Teodoro Delgado', 'teodorodelgado@example.com', 'hash_contrasena59', '2025-09-25 23:53:00', 0, 0),
(60, 1, 'Asunción López', 'asuncionlopez@example.com', 'hash_contrasena60', '2025-09-25 23:53:00', 0, 0),
(61, 1, 'Leopoldo Ruiz', 'leopoldoruiz@example.com', 'hash_contrasena61', '2025-09-25 23:53:00', 0, 0),
(62, 2, 'Inmaculada Castro', 'inmaculadacastro@example.com', 'hash_contrasena62', '2025-09-25 23:53:00', 0, 0),
(63, 1, 'Hipólito Vargas', 'hipolitovargas@example.com', 'hash_contrasena63', '2025-09-25 23:53:00', 0, 0),
(64, 1, 'Presentación Jiménez', 'presentacionjimenez@example.com', 'hash_contrasena64', '2025-09-25 23:53:00', 0, 0),
(65, 1, 'Bautista Morales', 'bautistamorales@example.com', 'hash_contrasena65', '2025-09-25 23:53:00', 0, 0),
(66, 1, 'Ascensión Reyes', 'ascensionreyes@example.com', 'hash_contrasena66', '2025-09-25 23:53:00', 0, 0),
(67, 2, 'Cristóbal Torres', 'cristobaltorres@example.com', 'hash_contrasena67', '2025-09-25 23:53:00', 0, 0),
(68, 1, 'Visitación Medina', 'visitacionmedina@example.com', 'hash_contrasena68', '2025-09-25 23:53:00', 0, 0),
(69, 1, 'Bartolomé Cruz', 'bartolomecruz@example.com', 'hash_contrasena69', '2025-09-25 23:53:00', 0, 0),
(70, 1, 'Purificación Ramírez', 'purificacionramirez@example.com', 'hash_contrasena70', '2025-09-25 23:53:00', 0, 0),
(71, 1, 'Anastasio Santos', 'anastasiosantos@example.com', 'hash_contrasena71', '2025-09-25 23:53:00', 0, 0),
(72, 2, 'Angustias Flores', 'angustiasflores@example.com', 'hash_contrasena72', '2025-09-25 23:53:00', 0, 0),
(73, 1, 'Evaristo Guerrero', 'evaristoguerrero@example.com', 'hash_contrasena73', '2025-09-25 23:53:00', 0, 0),
(74, 1, 'Soledad Mendoza', 'soledadmendoza@example.com', 'hash_contrasena74', '2025-09-25 23:53:00', 0, 0),
(75, 1, 'Pantaleón Rivera', 'pantaleonrivera@example.com', 'hash_contrasena75', '2025-09-25 23:53:00', 0, 0),
(76, 1, 'Dolores Aguilar', 'doloresaguilar@example.com', 'hash_contrasena76', '2025-09-25 23:53:00', 0, 0),
(77, 2, 'Saturnino Rojas', 'saturninorojas@example.com', 'hash_contrasena77', '2025-09-25 23:53:00', 0, 0),
(78, 1, 'Mercedes Ortiz', 'mercedesortiz@example.com', 'hash_contrasena78', '2025-09-25 23:53:00', 0, 0),
(79, 1, 'Policarpo Vega', 'policarpovega@example.com', 'hash_contrasena79', '2025-09-25 23:53:00', 0, 0),
(80, 1, 'Amparo Romero', 'amparoromero@example.com', 'hash_contrasena80', '2025-09-25 23:53:00', 0, 0),
(81, 1, 'Casimiro Muñoz', 'casimiromuñoz@example.com', 'hash_contrasena81', '2025-09-25 23:53:00', 0, 0),
(82, 2, 'Desamparados Peña', 'desamparadospeña@example.com', 'hash_contrasena82', '2025-09-25 23:53:00', 0, 0),
(83, 1, 'Hermenegildo Soto', 'hermenegildosoto@example.com', 'hash_contrasena83', '2025-09-25 23:53:00', 0, 0),
(84, 1, 'Nieves Moreno', 'nievesmoreno@example.com', 'hash_contrasena84', '2025-09-25 23:53:00', 0, 0),
(85, 1, 'Abundio Silva', 'abundiosilva@example.com', 'hash_contrasena85', '2025-09-25 23:53:00', 0, 0),
(86, 1, 'Angelines Delgado', 'angelinesdelgado@example.com', 'hash_contrasena86', '2025-09-25 23:53:00', 0, 0),
(87, 2, 'Hermógenes López', 'hermogeneslopez@example.com', 'hash_contrasena87', '2025-09-25 23:53:00', 0, 0),
(88, 1, 'Virtudes Ruiz', 'virtudesruiz@example.com', 'hash_contrasena88', '2025-09-25 23:53:00', 0, 0),
(89, 1, 'Gumersindo Castro', 'gumersindocastro@example.com', 'hash_contrasena89', '2025-09-25 23:53:00', 0, 0),
(90, 1, 'Caridad Vargas', 'caridadvargas@example.com', 'hash_contrasena90', '2025-09-25 23:53:00', 0, 0),
(91, 1, 'Hermenegildo Jiménez', 'hermenegildojimenez@example.com', 'hash_contrasena91', '2025-09-25 23:53:00', 0, 0),
(92, 2, 'Felicidad Morales', 'felicidadmorales@example.com', 'hash_contrasena92', '2025-09-25 23:53:00', 0, 0),
(93, 1, 'Telesforo Reyes', 'telesfororeyes@example.com', 'hash_contrasena93', '2025-09-25 23:53:00', 0, 0),
(94, 1, 'Consuelo Torres', 'consuelotorres@example.com', 'hash_contrasena94', '2025-09-25 23:53:00', 0, 0),
(95, 1, 'Apolinar Medina', 'apolinarmedina@example.com', 'hash_contrasena95', '2025-09-25 23:53:00', 0, 0),
(96, 1, 'Esperanza Cruz', 'esperanzacruz2@example.com', 'hash_contrasena96', '2025-09-25 23:53:00', 0, 0),
(97, 2, 'Herminio Ramírez', 'herminioramirez@example.com', 'hash_contrasena97', '2025-09-25 23:53:00', 0, 0),
(98, 1, 'Luz Santos', 'luzsantos@example.com', 'hash_contrasena98', '2025-09-25 23:53:00', 0, 0),
(99, 1, 'Maximiliano Flores', 'maximilianoflores@example.com', 'hash_contrasena99', '2025-09-25 23:53:00', 0, 0),
(100, 1, 'Fe Guerrero', 'feguerrero@example.com', 'hash_contrasena100', '2025-09-25 23:53:00', 0, 0),
(101, 1, 'hilarie andrade', 'hilarie@metro.com', '$2b$10$mCFH0zw183oyOZdoyPti6.6ghVzuuvaAUQzYU9ZyMQhGhd0zLekYm', '2025-11-17 23:33:03', 0, 0),
(102, 1, 'Hilag', 'hilaggamez@gmail.cocm', '$2b$10$OHaVWdwSUDsrR7ropyisR.JfFtWY28KwoVA6xBNiXkyS3PY9GshUq', '2026-04-07 22:24:27', 0, 0),
(103, 1, 'alexa', 'alexandraandradehg@gmail.com', '$2b$10$BkJ/IB5c87rU.YLJAlfrp.v0Ithl61FGVRUsVAZEPOKsETkrIjRKK', '2026-04-07 22:25:31', 0, 0);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id_admin`),
  ADD KEY `fk_admin_usuario` (`id_usuario`);

--
-- Índices de tabela `alertas`
--
ALTER TABLE `alertas`
  ADD PRIMARY KEY (`id_alerta`),
  ADD KEY `fk_alertas_estacion` (`estacion_afectada`);

--
-- Índices de tabela `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`),
  ADD KEY `fk_auditoria_usuarios` (`usuario_modificador`);

--
-- Índices de tabela `codigosverificacion`
--
ALTER TABLE `codigosverificacion`
  ADD PRIMARY KEY (`id_codigo`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Índices de tabela `estaciones`
--
ALTER TABLE `estaciones`
  ADD PRIMARY KEY (`id_estacion`);

--
-- Índices de tabela `lineasayuda`
--
ALTER TABLE `lineasayuda`
  ADD PRIMARY KEY (`id_linea`);

--
-- Índices de tabela `mensajesmotivacionales`
--
ALTER TABLE `mensajesmotivacionales`
  ADD PRIMARY KEY (`id_mensaje`);

--
-- Índices de tabela `metrocoins`
--
ALTER TABLE `metrocoins`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `fk_usuario_metrocoins` (`id_usuario`);

--
-- Índices de tabela `preferenciasusuario`
--
ALTER TABLE `preferenciasusuario`
  ADD PRIMARY KEY (`id_preferencia`),
  ADD KEY `fk_preferencias_usuario` (`id_usuario`),
  ADD KEY `fk_preferencias_estacion` (`estacion_interes`);

--
-- Índices de tabela `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `fk_reportes_admin` (`id_admin`);

--
-- Índices de tabela `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Índices de tabela `trazabilidad`
--
ALTER TABLE `trazabilidad`
  ADD PRIMARY KEY (`id_traza`),
  ADD KEY `fk_trazabilidad_usuarios` (`id_usuario`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `idx_usuarios_nombre` (`nombre`),
  ADD KEY `idx_usuarios_fecha` (`fecha_registro`),
  ADD KEY `fk_usuarios_roles` (`id_rol`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT de tabela `alertas`
--
ALTER TABLE `alertas`
  MODIFY `id_alerta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de tabela `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT de tabela `codigosverificacion`
--
ALTER TABLE `codigosverificacion`
  MODIFY `id_codigo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `estaciones`
--
ALTER TABLE `estaciones`
  MODIFY `id_estacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT de tabela `lineasayuda`
--
ALTER TABLE `lineasayuda`
  MODIFY `id_linea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT de tabela `mensajesmotivacionales`
--
ALTER TABLE `mensajesmotivacionales`
  MODIFY `id_mensaje` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT de tabela `metrocoins`
--
ALTER TABLE `metrocoins`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de tabela `preferenciasusuario`
--
ALTER TABLE `preferenciasusuario`
  MODIFY `id_preferencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de tabela `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT de tabela `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `trazabilidad`
--
ALTER TABLE `trazabilidad`
  MODIFY `id_traza` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `administradores`
--
ALTER TABLE `administradores`
  ADD CONSTRAINT `fk_administradores_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `alertas`
--
ALTER TABLE `alertas`
  ADD CONSTRAINT `fk_alertas_estaciones` FOREIGN KEY (`estacion_afectada`) REFERENCES `estaciones` (`id_estacion`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `fk_auditoria_usuarios` FOREIGN KEY (`usuario_modificador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `codigosverificacion`
--
ALTER TABLE `codigosverificacion`
  ADD CONSTRAINT `codigosverificacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `metrocoins`
--
ALTER TABLE `metrocoins`
  ADD CONSTRAINT `fk_usuario_metrocoins` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `preferenciasusuario`
--
ALTER TABLE `preferenciasusuario`
  ADD CONSTRAINT `fk_preferencias_estacion` FOREIGN KEY (`estacion_interes`) REFERENCES `estaciones` (`id_estacion`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_preferencias_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `fk_reportes_admin` FOREIGN KEY (`id_admin`) REFERENCES `administradores` (`id_admin`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `trazabilidad`
--
ALTER TABLE `trazabilidad`
  ADD CONSTRAINT `fk_trazabilidad_usuarios` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuarios_roles` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
