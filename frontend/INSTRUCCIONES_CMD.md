# Instrucciones para Ejecutar MetroMed React desde CMD

## Opción 1: Usando los archivos .bat (MÁS FÁCIL)

### Paso 1: Instalar dependencias
1. Abre el **Explorador de Archivos**
2. Navega a: `c:\Users\Usuario\Downloads\metro_medellin\metromed-react`
3. Haz **doble clic** en `install.bat`
4. Espera a que termine la instalación (puede tardar 1-2 minutos)

### Paso 2: Ejecutar la aplicación
1. En la misma carpeta, haz **doble clic** en `start.bat`
2. Se abrirá una ventana de CMD con el servidor
3. Abre tu navegador y ve a: **http://localhost:5173**

### Para detener el servidor:
- Presiona `Ctrl + C` en la ventana de CMD
- O simplemente cierra la ventana

---

## Opción 2: Usando CMD manualmente

### Paso 1: Abrir CMD
1. Presiona `Windows + R`
2. Escribe `cmd` y presiona Enter

### Paso 2: Navegar al proyecto
```cmd
cd c:\Users\Usuario\Downloads\metro_medellin\metromed-react
```

### Paso 3: Instalar dependencias (solo la primera vez)
```cmd
npm install
```

### Paso 4: Ejecutar el servidor
```cmd
npm run dev
```

### Paso 5: Abrir en el navegador
Abre tu navegador y ve a: **http://localhost:5173**

---

## Solución de Problemas

### Si npm no funciona:
1. Verifica que Node.js esté instalado:
   ```cmd
   node --version
   ```
2. Si no está instalado, descárgalo de: https://nodejs.org

### Si aparece error de PowerShell:
- Usa los archivos `.bat` en lugar de comandos directos
- O abre PowerShell como Administrador y ejecuta:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

---

## ¿Qué verás?

Una vez que la aplicación esté corriendo, verás:
- ✅ Página principal con hero animado
- ✅ Cards de servicios interactivas
- ✅ Navbar con glassmorphism
- ✅ Formularios de Login y Registro
- ✅ Animaciones y efectos visuales

---

## Comandos Útiles

```cmd
# Ver la versión de Node.js
node --version

# Ver la versión de npm
npm --version

# Limpiar caché de npm (si hay problemas)
npm cache clean --force

# Reinstalar dependencias
rmdir /s /q node_modules
npm install

# Crear build de producción
npm run build
```
