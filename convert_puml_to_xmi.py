#!/usr/bin/env python3
"""
Script para convertir archivos .puml a .xmi usando PlantUML
Requiere: Java instalado y plantuml.jar descargado
"""

import os
import subprocess
import sys
from pathlib import Path

# URL de descarga de PlantUML (ajustar versión si es necesario)
PLANTUML_URL = "https://github.com/plantuml/plantuml/releases/download/v1.2024.3/plantuml-1.2024.3.jar"
PLANTUML_JAR = "plantuml.jar"


def check_java():
    """Verifica si Java está instalado"""
    try:
        result = subprocess.run(
            ["java", "-version"],
            capture_output=True,
            text=True
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False


def download_plantuml():
    """Descarga PlantUML si no existe"""
    if os.path.exists(PLANTUML_JAR):
        print(f"✓ {PLANTUML_JAR} ya existe")
        return True

    print(f"Descargando PlantUML desde {PLANTUML_URL}...")
    try:
        import urllib.request
        urllib.request.urlretrieve(PLANTUML_URL, PLANTUML_JAR)
        print(f"✓ {PLANTUML_JAR} descargado exitosamente")
        return True
    except Exception as e:
        print(f"✗ Error al descargar PlantUML: {e}")
        return False


def convert_puml_to_xmi(puml_file):
    """Convierte un archivo .puml a .xmi"""
    puml_path = Path(puml_file)

    if not puml_path.exists():
        print(f"✗ Archivo no encontrado: {puml_file}")
        return False

    if puml_path.suffix.lower() != '.puml':
        print(f"✗ El archivo debe tener extensión .puml: {puml_file}")
        return False

    print(f"Convirtiendo: {puml_file}")

    try:
        # Ejecutar PlantUML con opción -txmi
        result = subprocess.run(
            ["java", "-jar", PLANTUML_JAR, "-txmi", str(puml_path)],
            capture_output=True,
            text=True
        )

        xmi_file = puml_path.with_suffix('.xmi')

        if result.returncode == 0 and xmi_file.exists():
            print(f"✓ Convertido exitosamente: {xmi_file}")
            return True
        else:
            print(f"✗ Error al convertir {puml_file}")
            if result.stderr:
                print(f"  Error: {result.stderr}")
            return False

    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    """Función principal"""
    print("=" * 60)
    print("Conversor de archivos .puml a .xmi")
    print("=" * 60)

    # Verificar Java
    if not check_java():
        print("✗ Java no está instalado o no está en el PATH")
        print("  Instala Java desde: https://www.java.com/")
        sys.exit(1)

    print("✓ Java instalado")

    # Descargar PlantUML si es necesario
    if not download_plantuml():
        sys.exit(1)

    # Obtener argumentos
    if len(sys.argv) > 1:
        # Convertir archivos específicos pasados como argumentos
        files = sys.argv[1:]
    else:
        # Buscar todos los archivos .puml en el directorio actual
        files = list(Path('.').glob('*.puml'))
        if not files:
            print("\nNo se encontraron archivos .puml en el directorio actual")
            print("\nUso:")
            print("  python convert_puml_to_xmi.py              # Convierte todos los .puml")
            print("  python convert_puml_to_xmi.py archivo.puml # Convierte archivo específico")
            print("  python convert_puml_to_xmi.py *.puml       # Convierte múltiples archivos")
            sys.exit(0)

    print(f"\nArchivos a convertir: {len(files)}")
    print("-" * 60)

    # Convertir archivos
    success_count = 0
    for file in files:
        if convert_puml_to_xmi(file):
            success_count += 1
        print()

    # Resumen
    print("=" * 60)
    print(f"Resumen: {success_count}/{len(files)} archivos convertidos exitosamente")
    print("=" * 60)


if __name__ == "__main__":
    main()
