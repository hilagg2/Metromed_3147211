# Instrucciones de Instalación y Configuración - Backend MetroMed

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. ✅ **Node.js** (v14 o superior) - [Descargar aquí](https://nodejs.org/)
2. ✅ **XAMPP** con MySQL - [Descargar aquí](https://www.apachefriends.org/)
3. ✅ La base de datos **metromedd** debe existir en MySQL

---

## 🚀 Instalación Rápida

### Opción 1: Usando el script automático (Recomendado)

1. **Doble clic en** `install-backend.bat`
2. Espera a que se instalen todas las dependencias
3. Continúa con la configuración (ver abajo)

### Opción 2: Manual

Abre CMD en la carpeta `backend` y ejecuta:

```bash
npm install
```

---

## ⚙️ Configuración

### 1. Configurar Base de Datos

1. **Inicia XAMPP** y asegúrate de que MySQL esté corriendo (botón "Start")
2. **Abre phpMyAdmin**: http://localhost/phpmyadmin
3. **Verifica que existe la base de datos** `metromedd`
4. **(Opcional)** Si las tablas no existen, ejecuta el script:
   - Ve a la pestaña "SQL" en phpMyAdmin
   - Copia y pega el contenido de `backend/database/init.sql`
   - Haz clic en "Continuar"

### 2. Configurar Variables de Entorno

Edita el archivo `.env` en la carpeta `backend`:

```env
# Configuración de MySQL (XAMPP por defecto)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=              # Déjalo vacío si no tienes contraseña
DB_NAME=metromedd
DB_PORT=3306

# JWT Secret (cámbialo por algo más seguro)
JWT_SECRET=tu_clave_secreta_muy_segura_cambiala_en_produccion

# Email (opcional, solo para recuperación de contraseña)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion
```

> **Nota sobre Email**: Si no configuras el email, la recuperación de contraseña no funcionará, pero el registro y login sí.

---

## ▶️ Iniciar el Servidor

### Opción 1: Script automático

**Doble clic en** `start-backend.bat`

### Opción 2: Manual

Abre CMD en la carpeta `backend` y ejecuta:

```bash
npm start
```

El servidor estará corriendo en: **http://localhost:5000**

---

## ✅ Verificar que Funciona

### 1. Prueba básica

Abre tu navegador y ve a: http://localhost:5000

Deberías ver:
```json
{
  "message": "API de MetroMed funcionando correctamente",
  "version": "1.0.0"
}
```

### 2. Probar endpoints con Thunder Client / Postman

#### Registrar un usuario

- **Método**: POST
- **URL**: `http://localhost:5000/api/auth/register`
- **Body** (JSON):
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contrasena": "password123"
}
```

#### Iniciar sesión

- **Método**: POST
- **URL**: `http://localhost:5000/api/auth/login`
- **Body** (JSON):
```json
{
  "correo": "juan@example.com",
  "contrasena": "password123"
}
```

---

## 🔧 Solución de Problemas

### ❌ Error: "Cannot find module 'express'"

**Solución**: Ejecuta `npm install` en la carpeta backend

### ❌ Error: "Error al conectar con MySQL"

**Soluciones**:
1. Verifica que XAMPP esté corriendo
2. Verifica que MySQL esté iniciado en XAMPP
3. Verifica las credenciales en `.env`
4. Asegúrate de que la base de datos `metromedd` existe

### ❌ Error: "Port 5000 already in use"

**Solución**: Cambia el puerto en `.env`:
```env
PORT=3001
```

### ❌ Error al enviar emails

**Soluciones**:
1. Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` estén correctos
2. Para Gmail, usa una "Contraseña de aplicación":
   - Ve a tu cuenta de Google → Seguridad
   - Activa "Verificación en 2 pasos"
   - Genera una "Contraseña de aplicación"
   - Usa esa contraseña en `.env`

---

## 📁 Estructura de Archivos

```
backend/
├── config/
│   └── database.js          # Configuración MySQL
├── controllers/
│   └── authController.js    # Lógica de autenticación
├── middleware/
│   ├── auth.js              # Middleware JWT
│   └── validator.js         # Validaciones
├── routes/
│   └── authRoutes.js        # Rutas de autenticación
├── utils/
│   ├── emailService.js      # Servicio de email
│   └── generateCode.js      # Generador de códigos
├── database/
│   └── init.sql             # Script SQL
├── .env                     # Variables de entorno ⚙️
├── server.js                # Servidor principal
├── package.json
├── install-backend.bat      # Script de instalación
└── start-backend.bat        # Script para iniciar
```

---

## 🎯 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/forgot-password` | Solicitar código de recuperación |
| POST | `/api/auth/verify-code` | Verificar código |
| POST | `/api/auth/reset-password` | Resetear contraseña |

---

## 📞 Próximos Pasos

Una vez que el backend esté funcionando:

1. ✅ Integrar el frontend React con la API
2. ✅ Probar el flujo completo de registro y login
3. ✅ Configurar el email para recuperación de contraseña
4. ✅ Implementar las demás funcionalidades de MetroMed

---

**¿Necesitas ayuda?** Revisa el archivo `README.md` para más detalles técnicos.
