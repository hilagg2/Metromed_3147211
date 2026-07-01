-- ============================================================
-- Migración: Módulo de Apoyo Psicológico - MetroMed
-- Tablas: lineas_emergencia, centros_ayuda, faq_apoyo
-- ============================================================

-- ── Líneas de emergencia ────────────────────────────────────
CREATE TABLE IF NOT EXISTS lineas_emergencia (
    id_linea    SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    numero      VARCHAR(50)  NOT NULL,
    descripcion TEXT,
    tipo        VARCHAR(30)  NOT NULL DEFAULT 'emergencia'
                    CHECK (tipo IN ('emergencia','escucha','profesional')),
    horario     VARCHAR(100) DEFAULT '24 horas',
    activa      BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ── Centros de ayuda (con coordenadas para búsqueda por radio) ──
CREATE TABLE IF NOT EXISTS centros_ayuda (
    id_centro   SERIAL PRIMARY KEY,
    nombre      VARCHAR(150) NOT NULL,
    direccion   VARCHAR(255),
    latitud     DECIMAL(10,7) NOT NULL,
    longitud    DECIMAL(10,7) NOT NULL,
    telefono    VARCHAR(50),
    tipo        VARCHAR(50)  DEFAULT 'salud_mental',
    horario     VARCHAR(100) DEFAULT 'Lunes a Viernes 7:00-17:00',
    activo      BOOLEAN      NOT NULL DEFAULT TRUE
);

-- ── FAQ de apoyo psicológico ────────────────────────────────
CREATE TABLE IF NOT EXISTS faq_apoyo (
    id_faq          SERIAL PRIMARY KEY,
    categoria       VARCHAR(50)  NOT NULL,
    pregunta        TEXT         NOT NULL,
    respuesta       TEXT         NOT NULL,
    palabras_clave  TEXT
);

-- ============================================================
-- SEED DATA: Líneas de emergencia de Colombia / Medellín
-- ============================================================
INSERT INTO lineas_emergencia (nombre, numero, descripcion, tipo, horario)
VALUES
    ('Línea 106', '106',
     'Línea de atención psicológica gratuita. Escucha, orientación y apoyo emocional las 24 horas.',
     'escucha', '24 horas, todos los días'),

    ('Línea 123', '123',
     'Número único de emergencias de Colombia. Para cualquier situación de riesgo vital inmediato.',
     'emergencia', '24 horas, todos los días'),

    ('Línea de la Vida', '018000113113',
     'Línea gratuita nacional para prevención del suicidio y crisis emocionales.',
     'escucha', '24 horas, todos los días'),

    ('Bomberos', '119',
     'Cuerpo de Bomberos. Emergencias que pongan en riesgo la vida.',
     'emergencia', '24 horas, todos los días'),

    ('Secretaría de Salud de Medellín', '(604) 385 5555',
     'Atención y orientación en salud mental para habitantes de Medellín.',
     'profesional', 'Lunes a Viernes 7:00 - 17:00'),

    ('CRUE Medellín', '(604) 290 6666',
     'Centro Regulador de Urgencias y Emergencias de Medellín.',
     'emergencia', '24 horas, todos los días'),

    ('Línea Amiga Medellín', '(604) 444 4448',
     'Servicio de escucha y orientación psicológica de la Alcaldía de Medellín.',
     'escucha', 'Lunes a Viernes 7:00 - 22:00'),

    ('Policía Nacional', '112',
     'Línea de emergencia de la Policía Nacional de Colombia.',
     'emergencia', '24 horas, todos los días')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Centros de ayuda en Medellín (con coordenadas)
-- ============================================================
INSERT INTO centros_ayuda (nombre, direccion, latitud, longitud, telefono, tipo, horario)
VALUES
    ('ESE Metrosalud - Unidad Hospitalaria de San Javier',
     'Cra. 97 #42-48, Medellín',
     6.2569200, -75.6157300, '(604) 511 5600',
     'hospital', 'Urgencias 24h'),

    ('Hospital Mental de Antioquia (HOMO)',
     'Calle 50 #69-105, Medellín',
     6.2518400, -75.5937100, '(604) 384 8890',
     'salud_mental', 'Lunes a Viernes 7:00 - 16:00'),

    ('Centro de Salud Mental - Secretaría de Salud',
     'Calle 44 #52-165, Medellín',
     6.2476500, -75.5658300, '(604) 385 5555',
     'salud_mental', 'Lunes a Viernes 7:00 - 17:00'),

    ('IPS Universitaria - Clínica León XIII',
     'Calle 69 #51C-24, Medellín',
     6.2699000, -75.5644200, '(604) 516 7300',
     'hospital', 'Urgencias 24h'),

    ('Hospital General de Medellín',
     'Cra. 48 #32-102, Medellín',
     6.2371800, -75.5717500, '(604) 384 7300',
     'hospital', 'Urgencias 24h'),

    ('Centro de Atención en Salud Mental CARISMA',
     'Cra. 93 #34AA-01, Medellín',
     6.2438700, -75.6125400, '(604) 493 8282',
     'salud_mental', 'Lunes a Viernes 7:00 - 16:00'),

    ('Clínica Samein - Salud Mental',
     'Calle 33 #75A-73, Medellín',
     6.2385100, -75.5952300, '(604) 411 8000',
     'salud_mental', 'Lunes a Sábado 7:00 - 18:00'),

    ('ESE Metrosalud - Centro de Salud Manrique',
     'Cra. 45 #87-20, Medellín',
     6.2841500, -75.5492100, '(604) 511 5600',
     'hospital', 'Lunes a Viernes 7:00 - 16:00')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: FAQ de apoyo psicológico
-- ============================================================
INSERT INTO faq_apoyo (categoria, pregunta, respuesta, palabras_clave)
VALUES
    ('ansiedad',
     '¿Qué hago si tengo un ataque de ansiedad?',
     'Respira profundo: inhala 4 segundos, sostén 4 segundos, exhala 4 segundos. Busca 5 cosas que puedas ver, 4 que puedas tocar, 3 que puedas oír, 2 que puedas oler y 1 que puedas saborear. Si persiste, comunícate con la Línea 106.',
     'ansiedad,pánico,nervios,ataque,respirar,angustia'),

    ('tristeza',
     '¿Cómo puedo manejar la tristeza?',
     'La tristeza es una emoción natural. Permítete sentirla sin juzgarte. Habla con alguien de confianza, realiza actividad física suave y mantén una rutina. Si la tristeza persiste más de dos semanas, es recomendable buscar ayuda profesional.',
     'triste,tristeza,llorar,deprimido,solo,soledad'),

    ('estres',
     '¿Cómo manejar el estrés del transporte?',
     'El desplazamiento diario puede generar estrés. Prueba escuchar música relajante o podcasts durante el viaje, practica respiración consciente y planifica tus rutas con anticipación. El módulo de congestión de MetroMed te ayuda a evitar aglomeraciones.',
     'estrés,cansado,transporte,metro,trabajo,agotado'),

    ('profesional',
     '¿Cuándo debo buscar ayuda profesional?',
     'Busca ayuda profesional si: tus emociones interfieren con tu vida diaria por más de 2 semanas, tienes dificultad para dormir o comer, te sientes abrumado/a constantemente, o simplemente sientes que necesitas hablar con alguien. La Línea 106 es gratuita y confidencial.',
     'profesional,psicólogo,terapia,ayuda,consulta'),

    ('autoestima',
     '¿Cómo mejorar mi autoestima?',
     'Reconoce tus logros, por pequeños que sean. Rodéate de personas que te valoren. Establece metas realistas y celebra tus avances. Practica el autocuidado y evita compararte con otros. Si sientes que necesitas apoyo, los profesionales están para ayudarte.',
     'autoestima,valor,inseguro,confianza,inferior')
ON CONFLICT DO NOTHING;
