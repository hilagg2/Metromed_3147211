@echo off
echo ========================================
echo   MetroMed Backend - Instalacion
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Instalando dependencias de Node.js...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: No se pudieron instalar las dependencias.
    echo Asegurate de tener Node.js instalado.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Instalacion completada exitosamente!
echo ========================================
echo.
echo Proximos pasos:
echo 1. Asegurate de que XAMPP este corriendo (MySQL)
echo 2. Verifica que la base de datos 'metromedd' exista
echo 3. Configura el archivo .env con tus credenciales
echo 4. Ejecuta 'start-backend.bat' para iniciar el servidor
echo.
pause
