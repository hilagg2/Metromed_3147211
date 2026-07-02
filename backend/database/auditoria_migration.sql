CREATE TABLE IF NOT EXISTS auditoria_admin (
    id_auditoria SERIAL PRIMARY KEY,
    id_admin INT NOT NULL,
    accion VARCHAR(50) NOT NULL,
    entidad VARCHAR(50) NOT NULL,
    entidad_id VARCHAR(50),
    detalles JSONB,
    fecha_accion TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_auditoria_admin FOREIGN KEY (id_admin) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria_admin(fecha_accion DESC);
