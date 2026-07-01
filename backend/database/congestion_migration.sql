-- ============================================================
-- Migración: Módulo de Congestión Colaborativa MetroMed
-- RN-19.1 a RN-22.3
-- Ejecutar en la base de datos: metromedd (Supabase/PostgreSQL)
-- IMPORTANTE: No modifica ninguna tabla existente.
-- ============================================================

-- Tabla para almacenar los reportes de congestión enviados por pasajeros
CREATE TABLE IF NOT EXISTS reportes_congestion (
    id_reporte       SERIAL PRIMARY KEY,
    id_usuario       INT NOT NULL,
    id_estacion      INT NOT NULL,
    nivel_reportado  VARCHAR(10) NOT NULL 
                       CHECK (nivel_reportado IN ('BAJO', 'MEDIO', 'ALTO')),
    fecha_reporte    TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Integridad referencial
    CONSTRAINT fk_rc_usuario   FOREIGN KEY (id_usuario)  REFERENCES usuarios(id_usuario)   ON DELETE CASCADE,
    CONSTRAINT fk_rc_estacion  FOREIGN KEY (id_estacion) REFERENCES estaciones(id_estacion) ON DELETE CASCADE
);

-- Índices para consultas de rendimiento (ventana de tiempo y por estación)
CREATE INDEX IF NOT EXISTS idx_rc_estacion_fecha
    ON reportes_congestion (id_estacion, fecha_reporte DESC);

CREATE INDEX IF NOT EXISTS idx_rc_usuario_estacion
    ON reportes_congestion (id_usuario, id_estacion, fecha_reporte DESC);

-- Comentarios de documentación
COMMENT ON TABLE reportes_congestion IS
    'Reportes de nivel de congestión enviados por pasajeros (id_rol=1). '
    'Fuente para el algoritmo de validación colectiva (RN-20.1, RN-20.2, RN-21.2).';

COMMENT ON COLUMN reportes_congestion.nivel_reportado IS
    'BAJO=Verde (flujo normal), MEDIO=Amarillo (moderado), ALTO=Rojo (alta congestión)';

SELECT 'Tabla reportes_congestion creada/verificada correctamente' AS resultado;
