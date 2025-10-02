@echo off
REM Script para convertir archivos .puml a .xmi usando PlantUML
REM Requiere: Java instalado

setlocal enabledelayedexpansion

echo ============================================================
echo Conversor de archivos .puml a .xmi
echo ============================================================

REM Verificar si Java está instalado
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java no esta instalado o no esta en el PATH
    echo Por favor instala Java desde: https://www.java.com/
    pause
    exit /b 1
)
echo [OK] Java instalado

REM Descargar PlantUML si no existe
if not exist plantuml.jar (
    echo Descargando PlantUML...
    powershell -Command "Invoke-WebRequest -Uri 'https://github.com/plantuml/plantuml/releases/download/v1.2024.3/plantuml-1.2024.3.jar' -OutFile 'plantuml.jar'"
    if errorlevel 1 (
        echo [ERROR] No se pudo descargar PlantUML
        echo Descargalo manualmente desde: https://plantuml.com/download
        pause
        exit /b 1
    )
    echo [OK] PlantUML descargado
) else (
    echo [OK] plantuml.jar ya existe
)

echo.
echo Buscando archivos .puml...
set count=0

REM Contar archivos .puml
for %%f in (*.puml) do (
    set /a count+=1
)

if !count! equ 0 (
    echo No se encontraron archivos .puml en el directorio actual
    echo.
    echo Uso:
    echo   convert_puml_to_xmi.bat              : Convierte todos los .puml
    echo   convert_puml_to_xmi.bat archivo.puml : Convierte archivo especifico
    pause
    exit /b 0
)

echo Archivos encontrados: !count!
echo ------------------------------------------------------------

REM Convertir archivos
set success=0
set failed=0

if "%~1"=="" (
    REM Sin argumentos: convertir todos los .puml
    for %%f in (*.puml) do (
        echo Convirtiendo: %%f
        java -jar plantuml.jar -txmi "%%f"
        if errorlevel 1 (
            echo [ERROR] Fallo al convertir %%f
            set /a failed+=1
        ) else (
            echo [OK] Convertido exitosamente: %%~nf.xmi
            set /a success+=1
        )
        echo.
    )
) else (
    REM Con argumentos: convertir archivos especificados
    :loop
    if "%~1"=="" goto endloop

    if not exist "%~1" (
        echo [ERROR] Archivo no encontrado: %~1
        set /a failed+=1
    ) else (
        echo Convirtiendo: %~1
        java -jar plantuml.jar -txmi "%~1"
        if errorlevel 1 (
            echo [ERROR] Fallo al convertir %~1
            set /a failed+=1
        ) else (
            echo [OK] Convertido exitosamente: %~n1.xmi
            set /a success+=1
        )
    )
    echo.
    shift
    goto loop
    :endloop
)

REM Resumen
echo ============================================================
echo Resumen: !success! archivos convertidos exitosamente
if !failed! gtr 0 (
    echo          !failed! archivos fallaron
)
echo ============================================================
pause
