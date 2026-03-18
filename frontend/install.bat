@echo off
echo ========================================
echo   MetroMed React - Instalacion
echo ========================================
echo.
echo Instalando dependencias...
echo.

call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudieron instalar las dependencias
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Instalacion completada!
echo ========================================
echo.
echo Presiona cualquier tecla para continuar...
pause > nul
