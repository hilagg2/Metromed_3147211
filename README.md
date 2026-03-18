# MetroMed Project

Este proyecto ha sido reestructurado para facilitar su mantenimiento y ejecución.
Ahora contiene tanto el backend como el frontend en la raíz del proyecto.

## Estructura del Proyecto

- `backend/`: Código del servidor (Node.js/Express)
- `frontend/`: Código del cliente (React/Vite)
- `INICIAR-METROMED.bat`: Script para iniciar ambos servicios automáticamente en Windows.

## Cómo Iniciar

### Opción 1: Rápida (Windows)
Simplemente haz doble clic en `INICIAR-METROMED.bat`.

### Opción 2: Manual
Necesitas dos terminales:

1. **Terminal 1 (Backend)**
   ```bash
   cd backend
   npm install  # (solo la primera vez)
   npm start
   ```

2. **Terminal 2 (Frontend)**
   ```bash
   cd frontend
   npm install  # (solo la primera vez)
   npm run dev
   ```

## Requisitos Previos

- Node.js instalado
- Base de datos MySQL configurada (ver `backend/.env` o instrucciones anteriores)

## Notas

- El backend corre en el puerto 5000.
- El frontend corre en el puerto 5173.
