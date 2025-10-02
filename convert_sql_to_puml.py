#!/usr/bin/env python3
"""
Script para convertir archivos SQL (CREATE TABLE) a diagramas PlantUML
Soporta: PostgreSQL, MySQL, SQL Server, SQLite
"""

import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple


class SQLtoPUMLConverter:
    def __init__(self):
        self.tables = {}
        self.relationships = []

    def parse_sql_file(self, sql_file: str) -> str:
        """Lee y parsea un archivo SQL"""
        try:
            with open(sql_file, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        except Exception as e:
            print(f"Error al leer archivo: {e}")
            return ""

    def extract_tables(self, sql_content: str):
        """Extrae las tablas y sus columnas del SQL"""
        # Patrón para encontrar CREATE TABLE (incluyendo schema.table)
        pattern = r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:[\w]+\.)?`?(\w+)`?\s*\((.*?)\);'

        matches = re.finditer(pattern, sql_content, re.IGNORECASE | re.DOTALL)

        for match in matches:
            table_name = match.group(1)
            columns_section = match.group(2)

            columns = self.parse_columns(columns_section, table_name)
            self.tables[table_name] = columns

        # Extraer ALTER TABLE FOREIGN KEYs
        self.extract_alter_table_fks(sql_content)

    def parse_columns(self, columns_section: str, table_name: str) -> List[Dict]:
        """Parsea las columnas de una tabla"""
        columns = []

        # Dividir por comas (pero no las que están dentro de paréntesis)
        lines = self.split_columns(columns_section)

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Ignorar constraints de tabla (PRIMARY KEY, FOREIGN KEY, etc.)
            if re.match(r'(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE|INDEX|KEY|CONSTRAINT)', line, re.IGNORECASE):
                self.parse_constraint(line, table_name)
                continue

            # Parsear columna individual
            column = self.parse_column(line)
            if column:
                columns.append(column)

        return columns

    def split_columns(self, text: str) -> List[str]:
        """Divide columnas respetando paréntesis"""
        result = []
        current = ""
        paren_count = 0

        for char in text:
            if char == '(':
                paren_count += 1
            elif char == ')':
                paren_count -= 1
            elif char == ',' and paren_count == 0:
                result.append(current)
                current = ""
                continue
            current += char

        if current.strip():
            result.append(current)

        return result

    def parse_column(self, line: str) -> Dict:
        """Parsea una columna individual"""
        # Patrón básico: nombre tipo [constraints]
        match = re.match(r'`?(\w+)`?\s+([\w\(\),\s]+)(.*)?', line, re.IGNORECASE)

        if not match:
            return None

        column_name = match.group(1)
        column_type = match.group(2).strip()
        constraints = match.group(3).strip() if match.group(3) else ""

        # Limpiar tipo (remover extras)
        column_type = re.sub(r'\s+', ' ', column_type)

        # Determinar si es PK, FK, nullable, etc.
        is_pk = bool(re.search(r'PRIMARY\s+KEY', constraints, re.IGNORECASE))
        is_fk = bool(re.search(r'REFERENCES\s+', constraints, re.IGNORECASE))
        is_nullable = not bool(re.search(r'NOT\s+NULL', constraints, re.IGNORECASE))
        is_unique = bool(re.search(r'UNIQUE', constraints, re.IGNORECASE))

        return {
            'name': column_name,
            'type': column_type,
            'is_pk': is_pk,
            'is_fk': is_fk,
            'is_nullable': is_nullable,
            'is_unique': is_unique,
            'constraints': constraints
        }

    def parse_constraint(self, line: str, table_name: str):
        """Parsea constraints de tabla (FOREIGN KEY, etc.)"""
        # FOREIGN KEY (column) REFERENCES other_table(other_column)
        fk_match = re.search(
            r'FOREIGN\s+KEY\s*\(`?(\w+)`?\)\s*REFERENCES\s+`?(\w+)`?\s*\(`?(\w+)`?\)',
            line,
            re.IGNORECASE
        )

        if fk_match:
            from_column = fk_match.group(1)
            to_table = fk_match.group(2)
            to_column = fk_match.group(3)

            self.relationships.append({
                'from_table': table_name,
                'from_column': from_column,
                'to_table': to_table,
                'to_column': to_column,
                'type': 'foreign_key'
            })

    def extract_alter_table_fks(self, sql_content: str):
        """Extrae FOREIGN KEYs de sentencias ALTER TABLE"""
        # ALTER TABLE table_name ADD CONSTRAINT ... FOREIGN KEY (column) REFERENCES other_table(other_column)
        pattern = r'ALTER\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:[\w]+\.)?`?(\w+)`?\s+ADD\s+CONSTRAINT\s+\w+\s+FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s+(?:[\w]+\.)?`?(\w+)`?\s*\((\w+)\)'

        matches = re.finditer(pattern, sql_content, re.IGNORECASE | re.DOTALL)

        for match in matches:
            from_table = match.group(1)
            from_column = match.group(2)
            to_table = match.group(3)
            to_column = match.group(4)

            # Marcar la columna como FK en la tabla si existe
            if from_table in self.tables:
                for col in self.tables[from_table]:
                    if col['name'] == from_column:
                        col['is_fk'] = True
                        break

            self.relationships.append({
                'from_table': from_table,
                'from_column': from_column,
                'to_table': to_table,
                'to_column': to_column,
                'type': 'foreign_key'
            })

    def generate_puml(self, output_file: str = None, diagram_type: str = 'entity'):
        """Genera el código PlantUML"""
        puml = ["@startuml"]

        # Configuración de estilo
        puml.extend([
            "",
            "' Configuración de estilo",
            "skinparam classAttributeIconSize 0",
            "skinparam classFontSize 12",
            "skinparam classBackgroundColor #F5F5F5",
            "skinparam classBorderColor #666666",
            "skinparam arrowColor #333333",
            "",
        ])

        # Generar entidades
        for table_name, columns in self.tables.items():
            if diagram_type == 'entity':
                puml.append(f'entity "{table_name}" as {table_name} {{')
            else:
                puml.append(f'class {table_name} {{')

            # Agrupar columnas por tipo
            pk_columns = [c for c in columns if c['is_pk']]
            fk_columns = [c for c in columns if c['is_fk'] and not c['is_pk']]
            regular_columns = [c for c in columns if not c['is_pk'] and not c['is_fk']]

            # Primary Keys
            if pk_columns:
                for col in pk_columns:
                    symbol = '+' if diagram_type == 'entity' else '#'
                    puml.append(f'  {symbol} {col["name"]} : {col["type"]}')

            # Separador
            if pk_columns and (fk_columns or regular_columns):
                puml.append('  --')

            # Foreign Keys
            for col in fk_columns:
                symbol = '#' if diagram_type == 'entity' else '-'
                puml.append(f'  {symbol} {col["name"]} : {col["type"]} <<FK>>')

            # Columnas regulares
            for col in regular_columns:
                nullable = '?' if col['is_nullable'] else ''
                unique = ' <<U>>' if col['is_unique'] else ''
                puml.append(f'  {col["name"]} : {col["type"]}{nullable}{unique}')

            puml.append('}')
            puml.append('')

        # Generar relaciones
        if self.relationships:
            puml.append("' Relaciones")
            for rel in self.relationships:
                from_table = rel['from_table']
                to_table = rel['to_table']
                # Relación muchos a uno (N:1)
                puml.append(f'{from_table} }}o--|| {to_table}')
            puml.append('')

        puml.append("@enduml")

        # Guardar o retornar
        puml_content = '\n'.join(puml)

        if output_file:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(puml_content)
            print(f"Archivo PlantUML generado: {output_file}")

        return puml_content


def main():
    print("=" * 70)
    print("Conversor de SQL a PlantUML - Diagrama de Base de Datos")
    print("=" * 70)

    # Verificar argumentos
    if len(sys.argv) < 2:
        print("\nUso:")
        print("  python convert_sql_to_puml.py archivo.sql [opciones]")
        print("\nOpciones:")
        print("  -o, --output    Nombre del archivo de salida (default: input_name.puml)")
        print("  -t, --type      Tipo de diagrama: 'entity' o 'class' (default: entity)")
        print("\nEjemplos:")
        print("  python convert_sql_to_puml.py database.sql")
        print("  python convert_sql_to_puml.py database.sql -o diagrama.puml")
        print("  python convert_sql_to_puml.py database.sql -t class")
        sys.exit(0)

    # Parsear argumentos
    sql_file = sys.argv[1]
    output_file = None
    diagram_type = 'entity'

    for i in range(2, len(sys.argv)):
        if sys.argv[i] in ['-o', '--output'] and i + 1 < len(sys.argv):
            output_file = sys.argv[i + 1]
        elif sys.argv[i] in ['-t', '--type'] and i + 1 < len(sys.argv):
            diagram_type = sys.argv[i + 1]

    # Archivo de salida por defecto
    if not output_file:
        sql_path = Path(sql_file)
        output_file = sql_path.with_suffix('.puml')

    # Verificar archivo existe
    if not Path(sql_file).exists():
        print(f"Error: Archivo no encontrado: {sql_file}")
        sys.exit(1)

    print(f"\nArchivo SQL: {sql_file}")
    print(f"Archivo salida: {output_file}")
    print(f"Tipo diagrama: {diagram_type}")
    print("-" * 70)

    # Convertir
    converter = SQLtoPUMLConverter()
    sql_content = converter.parse_sql_file(sql_file)

    if not sql_content:
        print("Error: No se pudo leer el archivo SQL")
        sys.exit(1)

    converter.extract_tables(sql_content)

    if not converter.tables:
        print("Advertencia: No se encontraron tablas en el archivo SQL")
        print("Asegurate de que el archivo contenga sentencias CREATE TABLE")
        sys.exit(1)

    print(f"\nTablas encontradas: {len(converter.tables)}")
    for table_name in converter.tables.keys():
        print(f"  - {table_name} ({len(converter.tables[table_name])} columnas)")

    print(f"\nRelaciones encontradas: {len(converter.relationships)}")
    for rel in converter.relationships:
        print(f"  - {rel['from_table']}.{rel['from_column']} -> {rel['to_table']}.{rel['to_column']}")

    # Generar PlantUML
    converter.generate_puml(str(output_file), diagram_type)

    print("\n" + "=" * 70)
    print("Conversion completada exitosamente!")
    print("=" * 70)


if __name__ == "__main__":
    main()
