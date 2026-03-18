@echo off
echo ========================================
echo   MetroMed - Iniciando Aplicacion
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Iniciando Backend (Puerto 5000)...
start "MetroMed Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Frontend (Puerto 5173)...
start "MetroMed Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Aplicacion iniciada!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Presiona cualquier tecla para cerrar esta ventana
echo (Las ventanas del backend y frontend seguiran abiertas)
pause >nul
