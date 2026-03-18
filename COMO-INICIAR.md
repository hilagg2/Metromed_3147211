# 🚀 Guía Rápida - Iniciar MetroMed

## Opción 1: Script Automático (Recomendado) ⚡

**Doble clic en:** `INICIAR-METROMED.bat`

Esto abrirá automáticamente:
- ✅ Backend en http://localhost:5000
- ✅ Frontend en http://localhost:5173

Se abrirán 2 ventanas de CMD (una para cada servicio).

---

## Opción 2: Manual (Dos ventanas de CMD)

### Ventana 1 - Backend
```bash
cd c:\Users\Usuario\Downloads\metro_medellin\backend
npm start
```

### Ventana 2 - Frontend  
```bash
cd c:\Users\Usuario\Downloads\metro_medellin\metromed-react
npm run dev
```

---

## 🧪 Probar la Aplicación

1. **Abre tu navegador** en: http://localhost:5173

2. **Prueba el Registro:**
   - Haz clic en "Crear Cuenta"
   - Llena el formulario con tu email real
   - Haz clic en "Registrarme"
   - Deberías ver: "¡Cuenta creada exitosamente!"

3. **Prueba el Login:**
   - Haz clic en "Iniciar Sesión"
   - Ingresa tu email y contraseña
   - Deberías ver: "¡Bienvenido [Tu Nombre]!"

4. **Prueba Recuperar Contraseña:**
   - En Login, haz clic en "¿Olvidaste tu contraseña?"
   - Ingresa tu email
   - **Revisa tu correo** (puede tardar unos segundos)
   - Ingresa el código de 6 dígitos
   - Crea tu nueva contraseña

---

## 📧 Sobre el Envío de Correos

El sistema enviará correos electrónicos con:
- ✅ Diseño profesional de MetroMed
- ✅ Código de 6 dígitos
- ✅ Advertencia de expiración (15 minutos)

**Nota:** Si no recibes el correo:
- Revisa la carpeta de SPAM
- Verifica que configuraste correctamente el `.env` del backend
- Puedes ver el código en la base de datos (tabla `codigosverificacion`)

---

## ⚠️ Para Detener los Servicios

Cierra las ventanas de CMD del backend y frontend, o presiona `Ctrl+C` en cada una.

---

## 🔧 Solución de Problemas

### Backend no inicia
- Verifica que XAMPP esté corriendo (MySQL)
- Verifica que la base de datos `metromedd` existe

### Frontend no inicia
- Ejecuta `npm install` en la carpeta `metromed-react`

### Puerto en uso
- Backend: Cambia `PORT` en `backend/.env`
- Frontend: Cambia puerto en `vite.config.js`

---

**¡Listo para probar! 🎉**
