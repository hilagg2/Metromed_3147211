const { pool } = require('./database');

const initDatabase = async () => {
    try {
        console.log('Initializing database tables for games and psychological support...');
        
        // 1. Crear tabla configuracion_juegos si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS configuracion_juegos (
                id_juego VARCHAR(50) PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                habilitado BOOLEAN DEFAULT TRUE,
                metrocoins_premio INT DEFAULT 10
            )
        `);

        // 2. Insertar juegos por defecto si no existen
        await pool.query(`
            INSERT INTO configuracion_juegos (id_juego, nombre, habilitado, metrocoins_premio) VALUES
            ('cartas', 'Cartas en Pareja', TRUE, 10),
            ('serpiente', 'Juego de la Serpiente', TRUE, 5),
            ('ruleta', 'Juego de la Ruleta', TRUE, 50),
            ('preguntas', 'Juego de Preguntas', TRUE, 15)
            ON CONFLICT (id_juego) DO NOTHING
        `);

        // 3. Crear tabla lineasayuda si no existe (PostgreSQL SERIAL syntax)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lineasayuda (
                id_linea SERIAL PRIMARY KEY,
                nombre_servicio VARCHAR(100) NOT NULL UNIQUE,
                telefono VARCHAR(20) NOT NULL,
                horario VARCHAR(100) NOT NULL,
                disponibilidad VARCHAR(50) DEFAULT 'Disponible'
            )
        `);

        // 4. Insertar líneas de ayuda básicas de salud mental si no existen
        await pool.query(`
            INSERT INTO lineasayuda (nombre_servicio, telefono, horario, disponibilidad) VALUES
            ('Línea Amiga Salud Mental', '106', '24 horas', 'Disponible'),
            ('Línea Antisuicidio y Acompañamiento', '1313131', '24 horas', 'Disponible'),
            ('Orientación Psicológica Alcaldía', '1717171', 'Lunes a Viernes 8:00-17:00', 'Disponible'),
            ('Línea de Emergencia y Ambulancia', '123', '24 horas', 'Disponible'),
            ('Atención Violencia de Género', '2121212', '24 horas', 'Disponible'),
            ('Apoyo Social y Familiar', '1818181', 'Lunes a Viernes 7:00-16:00', 'Ocupado')
            ON CONFLICT (nombre_servicio) DO NOTHING
        `);

        // 5. Crear tabla reportes si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reportes (
                id_reporte SERIAL PRIMARY KEY,
                id_usuario INT NOT NULL,
                tipo_reporte VARCHAR(100) NOT NULL,
                descripcion TEXT,
                fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 6. Crear tabla faqs_apoyo si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS faqs_apoyo (
                id_faq SERIAL PRIMARY KEY,
                pregunta VARCHAR(255) NOT NULL UNIQUE,
                respuesta TEXT NOT NULL
            )
        `);

        // 7. Insertar FAQs iniciales
        await pool.query(`
            INSERT INTO faqs_apoyo (pregunta, respuesta) VALUES
            ('¿Qué debo hacer en caso de una crisis de ansiedad en el Metro?', 'Si sientes ansiedad o pánico durante tu viaje, intenta bajarte en la próxima estación y busca al personal del Metro (chalecos verdes). Ellos están capacitados en primeros auxilios psicológicos y te guiarán a un lugar seguro para calmarte.'),
            ('¿Cómo funciona el servicio de orientación psicológica de MetroMed?', 'Ofrecemos acompañamiento virtual a través de nuestro chatbot de escucha empática, ejercicios prácticos de respiración (como la técnica 4-7-8) y canalización directa a las líneas oficiales de salud mental del departamento.'),
            ('¿Las líneas de ayuda tienen algún costo?', 'No, todas las líneas de ayuda recomendadas en la plataforma (como la Línea Amiga 106 y la Línea de Emergencias 123) son 100% gratuitas y de carácter confidencial.'),
            ('¿Dónde puedo encontrar grupos de apoyo emocional presenciales?', 'En la sección de recursos del panel de Apoyo Psicológico encontrarás un directorio de centros comunitarios de escucha en el área metropolitana de Medellín.')
            ON CONFLICT (pregunta) DO NOTHING
        `);

        console.log('✅ Database tables initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing database tables:', error);
    }
};

module.exports = { initDatabase };
