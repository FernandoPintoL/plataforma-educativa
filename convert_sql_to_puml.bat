@echo off
REM Script para convertir archivos SQL a PlantUML

setlocal enabledelayedexpansion

echo ======================================================================
echo Conversor de SQL a PlantUML - Diagrama de Base de Datos
echo ======================================================================

if "%~1"=="" (
    echo.
    echo Uso:
    echo   convert_sql_to_puml.bat archivo.sql [tipo]
    echo.
    echo Parametros:
    echo   archivo.sql  : Archivo SQL con CREATE TABLE statements
    echo   tipo         : 'entity' o 'class' ^(opcional, default: entity^)
    echo.
    echo Ejemplos:
    echo   convert_sql_to_puml.bat database.sql
    echo   convert_sql_to_puml.bat database.sql entity
    echo   convert_sql_to_puml.bat database.sql class
    pause
    exit /b 0
)

set SQL_FILE=%~1
set DIAGRAM_TYPE=entity

if not "%~2"=="" (
    set DIAGRAM_TYPE=%~2
)

if not exist "%SQL_FILE%" (
    echo [ERROR] Archivo no encontrado: %SQL_FILE%
    pause
    exit /b 1
)

echo.
echo Archivo SQL: %SQL_FILE%
echo Tipo diagrama: %DIAGRAM_TYPE%
echo ----------------------------------------------------------------------

REM Ejecutar script Python
python convert_sql_to_puml.py "%SQL_FILE%" -t %DIAGRAM_TYPE%

if errorlevel 1 (
    echo.
    echo [ERROR] Fallo la conversion
    pause
    exit /b 1
)

echo.
pause
