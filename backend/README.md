# MetroMed Backend API

Backend de Node.js + Express + MySQL para el sistema MetroMed.

## 🚀 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MySQL (XAMPP o instalación local)
- npm o yarn

### Pasos de instalación

1. **Instalar dependencias**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar base de datos**
   - Asegúrate de que XAMPP esté corriendo (Apache y MySQL)
   - Abre phpMyAdmin: `http://localhost/phpmyadmin`
   - Verifica que la base de datos `metromedd` exista
   - Ejecuta el script SQL: `database/init.sql` (opcional, solo si las tablas no existen)

3. **Configurar variables de entorno**
   - Edita el archivo `.env`
   - Configura las credenciales de MySQL:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=          # Deja vacío si no tienes contraseña en XAMPP
     DB_NAME=metromedd
     ```
   - Configura el email (opcional, para recuperación de contraseña):
     ```
     EMAIL_USER=tu_email@gmail.com
     EMAIL_PASSWORD=tu_password_de_aplicacion
     ```

4. **Iniciar servidor**
   ```bash
   npm start
   # O para desarrollo con auto-reload:
   npm run dev
   ```

El servidor estará corriendo en: `http://localhost:5000`

---

## 📡 Endpoints de la API

### Base URL
```
http://localhost:5000/api/auth
```

### 1. Registro de Usuario
**POST** `/register`

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contrasena": "password123"
}
```

**Validaciones:**
- Contraseña mínimo 8 caracteres
- Email válido y único
- Nombre requerido

---

### 2. Inicio de Sesión
**POST** `/login`

**Body:**
```json
{
  "correo": "juan@example.com",
  "contrasena": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_aqui",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "rol": 1
  }
}
```

---

### 3. Olvidé mi Contraseña
**POST** `/forgot-password`

**Body:**
```json
{
  "correo": "juan@example.com"
}
```

Envía un código de 6 dígitos al email (válido por 15 minutos).

---

### 4. Verificar Código
**POST** `/verify-code`

**Body:**
```json
{
  "correo": "juan@example.com",
  "codigo": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "resetToken": "token_temporal"
}
```

---

### 5. Resetear Contraseña
**POST** `/reset-password`

**Body:**
```json
{
  "resetToken": "token_temporal",
  "nuevaContrasena": "newpassword123"
}
```

**Validaciones:**
- Nueva contraseña diferente a la anterior
- Mínimo 8 caracteres

---

## 🗂️ Estructura del Proyecto

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
│   └── init.sql             # Script de inicialización
├── .env                     # Variables de entorno
├── .gitignore
├── package.json
├── README.md
└── server.js                # Punto de entrada
```

---

## 🔒 Seguridad

- ✅ Contraseñas encriptadas con bcrypt (salt rounds: 10)
- ✅ Autenticación con JWT (expiración: 24h)
- ✅ Validación de inputs con express-validator
- ✅ CORS configurado para React frontend
- ✅ Códigos de verificación con expiración de 15 minutos

---

## 🧪 Pruebas

### Usando Thunder Client / Postman

1. **Registrar usuario**
   - POST `http://localhost:5000/api/auth/register`
   - Body: JSON con nombre, correo, contraseña

2. **Iniciar sesión**
   - POST `http://localhost:5000/api/auth/login`
   - Body: JSON con correo, contraseña
   - Guarda el token recibido

3. **Recuperar contraseña**
   - POST `http://localhost:5000/api/auth/forgot-password`
   - POST `http://localhost:5000/api/auth/verify-code`
   - POST `http://localhost:5000/api/auth/reset-password`

---

## ⚠️ Solución de Problemas

### Error de conexión a MySQL
- Verifica que XAMPP esté corriendo
- Verifica las credenciales en `.env`
- Asegúrate de que la base de datos `metromedd` existe

### Error al enviar emails
- Configura correctamente `EMAIL_USER` y `EMAIL_PASSWORD` en `.env`
- Para Gmail, usa una "Contraseña de aplicación" (no tu contraseña normal)
- Activa "Acceso de aplicaciones menos seguras" si es necesario

### Puerto 5000 en uso
- Cambia el puerto en `.env`: `PORT=3001`

---

## 📦 Dependencias Principales

- **express**: Framework web
- **mysql2**: Cliente MySQL con soporte para promesas
- **bcrypt**: Encriptación de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **nodemailer**: Envío de emails
- **express-validator**: Validación de inputs
- **cors**: Manejo de CORS
- **dotenv**: Variables de entorno

---

## 🔄 Próximos Pasos

- [ ] Implementar refresh tokens
- [ ] Agregar rate limiting
- [ ] Implementar logging
- [ ] Agregar más roles de usuario
- [ ] Implementar verificación de email
- [ ] Agregar tests unitarios

---

**Desarrollado para MetroMed** 🚇
