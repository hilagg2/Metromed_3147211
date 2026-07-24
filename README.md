# MetroMed Project

Este proyecto ha sido reestructurado para facilitar su mantenimiento y ejecución.
Ahora contiene tanto el backend como el frontend en la raíz del proyecto.MetroMed es una plataforma web colaborativa desarrollada para mejorar la experiencia de los usuarios del Metro de Medellín. La aplicación permite a los pasajeros consultar e informar en tiempo real sobre los niveles de congestión en estaciones y trenes, recibir notificaciones oficiales sobre retrasos, noticias y alertas, acceder a líneas de ayuda y a un chatbot de apoyo psicológico, además de disfrutar de juegos interactivos durante su trayecto.

La plataforma también incorpora un sistema de estadísticas personalizadas tipo Wrapped , que muestra información sobre la actividad y el uso que cada usuario hace de la aplicación. Gracias a la participación de la comunidad

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
