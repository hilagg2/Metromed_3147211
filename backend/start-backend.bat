@echo off
echo ========================================
echo   MetroMed Backend - Servidor
echo ========================================
echo.

cd /d "%~dp0"

echo Iniciando servidor en http://localhost:5000
echo Presiona Ctrl+C para detener el servidor
echo.

call npm start

pause
