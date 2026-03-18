# MetroMed React - Aplicación Moderna

Aplicación React moderna para MetroMed, el sistema de información del Metro de Medellín.

## 🚀 Características

- ✨ **Diseño Premium**: Interfaz moderna con gradientes, glassmorphism y animaciones fluidas
- 🎨 **Altamente Visual**: Efectos hover, transiciones suaves y micro-interacciones
- 📱 **Responsive**: Diseño adaptable a todos los dispositivos
- ⚡ **Rápido**: Construido con Vite para desarrollo y builds ultra-rápidos
- 🎯 **React Router**: Navegación entre páginas sin recargas

## 📦 Instalación

### Opción 1: Usando npm (Recomendado)

```bash
cd metromed-react
npm install
npm run dev
```

### Opción 2: Usando yarn

```bash
cd metromed-react
yarn install
yarn dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
metromed-react/
├── public/
│   └── img/                    # Imágenes y assets
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   └── ServiceCard.jsx
│   ├── pages/                  # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.jsx                 # Componente principal con rutas
│   ├── main.jsx                # Punto de entrada
│   └── index.css               # Estilos globales y sistema de diseño
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Sistema de Diseño

### Colores Principales
- **Verde MetroMed**: `#00a86b` (Primary)
- **Amarillo**: `#ffaa00` (Secondary)
- **Azul Claro**: `#81d4fa` (Accent)

### Efectos Visuales
- Glassmorphism con `backdrop-filter: blur()`
- Gradientes dinámicos
- Animaciones CSS (fadeIn, slideUp, scaleIn)
- Hover effects con transformaciones 3D
- Sombras suaves y profundidad

## 📄 Páginas Disponibles

- **/** - Página principal con hero y servicios
- **/login** - Formulario de inicio de sesión
- **/registro** - Formulario de registro

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea el build de producción
- `npm run preview` - Previsualiza el build de producción

## 🔧 Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite 5** - Build tool y dev server
- **React Router 6** - Navegación
- **CSS3** - Estilos con variables CSS y animaciones

## 📝 Notas

- Las imágenes deben estar en la carpeta `public/img/`
- Los formularios tienen validación básica (expandible para backend)
- El diseño es completamente responsive
- Todas las animaciones son optimizadas para rendimiento

## 🚧 Próximos Pasos

1. Conectar con el backend Node.js + Express
2. Implementar autenticación real
3. Agregar más páginas (Dashboard, Perfil, etc.)
4. Implementar las funcionalidades de Tráfico, Juegos y Wrapped

---

**Desarrollado para MetroMed** 🚇
