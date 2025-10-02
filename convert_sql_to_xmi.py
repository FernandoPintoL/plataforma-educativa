#!/usr/bin/env python3
"""
Script para convertir archivos SQL directamente a XMI con relaciones
"""

import sys
import uuid
from pathlib import Path
from convert_sql_to_puml import SQLtoPUMLConverter


class XMIGenerator:
    def __init__(self):
        self.xmi_id_map = {}

    def generate_xmi_id(self, prefix=""):
        """Genera un ID único para XMI"""
        return f"{prefix}_{uuid.uuid4().hex[:8]}"

    def generate_xmi(self, tables: dict, relationships: list, output_file: str):
        """Genera archivo XMI compatible con Enterprise Architect"""

        xmi = ['<?xml version="1.0" encoding="UTF-8"?>']
        xmi.append('<xmi:XMI xmi:version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.1" xmlns:xmi="http://schema.omg.org/spec/XMI/2.1">')

        # Modelo principal
        model_id = self.generate_xmi_id("model")
        xmi.append(f'  <uml:Model xmi:type="uml:Model" xmi:id="{model_id}" name="DatabaseModel">')

        # Generar clases (tablas)
        for table_name, columns in tables.items():
            class_id = self.generate_xmi_id("class")
            self.xmi_id_map[table_name] = class_id

            xmi.append(f'    <packagedElement xmi:type="uml:Class" xmi:id="{class_id}" name="{table_name}">')

            # Atributos (columnas)
            for col in columns:
                attr_id = self.generate_xmi_id("attr")
                col_name = col['name']
                col_type = self.clean_type(col['type'])

                # Visibilidad
                visibility = 'public'

                xmi.append(f'      <ownedAttribute xmi:type="uml:Property" xmi:id="{attr_id}" name="{col_name}" visibility="{visibility}">')

                # Tipo primitivo
                type_id = self.generate_xmi_id("type")
                xmi.append(f'        <type xmi:type="uml:PrimitiveType" xmi:id="{type_id}" name="{col_type}"/>')

                xmi.append('      </ownedAttribute>')

            xmi.append('    </packagedElement>')

        # Generar asociaciones (relaciones)
        for rel in relationships:
            assoc_id = self.generate_xmi_id("assoc")
            from_table = rel['from_table']
            to_table = rel['to_table']

            if from_table in self.xmi_id_map and to_table in self.xmi_id_map:
                from_id = self.xmi_id_map[from_table]
                to_id = self.xmi_id_map[to_table]

                xmi.append(f'    <packagedElement xmi:type="uml:Association" xmi:id="{assoc_id}" name="{from_table}_to_{to_table}">')

                # Extremo origen (muchos)
                member_end1_id = self.generate_xmi_id("member")
                xmi.append(f'      <ownedEnd xmi:type="uml:Property" xmi:id="{member_end1_id}" name="{from_table.lower()}" type="{from_id}" association="{assoc_id}">')
                xmi.append('        <lowerValue xmi:type="uml:LiteralInteger" xmi:id="{}" value="0"/>'.format(self.generate_xmi_id("lit")))
                xmi.append('        <upperValue xmi:type="uml:LiteralUnlimitedNatural" xmi:id="{}" value="*"/>'.format(self.generate_xmi_id("lit")))
                xmi.append('      </ownedEnd>')

                # Extremo destino (uno)
                member_end2_id = self.generate_xmi_id("member")
                xmi.append(f'      <ownedEnd xmi:type="uml:Property" xmi:id="{member_end2_id}" name="{to_table.lower()}" type="{to_id}" association="{assoc_id}">')
                xmi.append('        <lowerValue xmi:type="uml:LiteralInteger" xmi:id="{}" value="1"/>'.format(self.generate_xmi_id("lit")))
                xmi.append('        <upperValue xmi:type="uml:LiteralInteger" xmi:id="{}" value="1"/>'.format(self.generate_xmi_id("lit")))
                xmi.append('      </ownedEnd>')

                xmi.append('    </packagedElement>')

        xmi.append('  </uml:Model>')
        xmi.append('</xmi:XMI>')

        # Guardar archivo
        xmi_content = '\n'.join(xmi)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(xmi_content)

        print(f"[OK] Archivo XMI generado: {output_file}")
        return xmi_content

    def clean_type(self, sql_type: str) -> str:
        """Convierte tipos SQL a tipos UML primitivos"""
        sql_type_lower = sql_type.lower()

        if any(t in sql_type_lower for t in ['int', 'serial', 'bigint', 'smallint']):
            return 'Integer'
        elif any(t in sql_type_lower for t in ['varchar', 'char', 'text', 'character']):
            return 'String'
        elif any(t in sql_type_lower for t in ['bool']):
            return 'Boolean'
        elif any(t in sql_type_lower for t in ['float', 'double', 'decimal', 'numeric', 'real', 'precision']):
            return 'Real'
        elif any(t in sql_type_lower for t in ['date', 'time', 'timestamp']):
            return 'String'
        elif any(t in sql_type_lower for t in ['json', 'jsonb']):
            return 'String'
        else:
            return 'String'


def main():
    print("=" * 70)
    print("Conversor de SQL a XMI - Con relaciones completas")
    print("=" * 70)

    if len(sys.argv) < 2:
        print("\nUso:")
        print("  python convert_sql_to_xmi.py archivo.sql [output.xmi]")
        print("\nEjemplo:")
        print("  python convert_sql_to_xmi.py database.sql")
        print("  python convert_sql_to_xmi.py database.sql modelo.xmi")
        sys.exit(0)

    sql_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else Path(sql_file).with_suffix('.xmi')

    if not Path(sql_file).exists():
        print(f"[ERROR] Archivo no encontrado: {sql_file}")
        sys.exit(1)

    print(f"\nArchivo SQL: {sql_file}")
    print(f"Archivo XMI: {output_file}")
    print("-" * 70)

    # Parsear SQL usando el conversor existente
    converter = SQLtoPUMLConverter()
    sql_content = converter.parse_sql_file(sql_file)

    if not sql_content:
        print("[ERROR] No se pudo leer el archivo SQL")
        sys.exit(1)

    converter.extract_tables(sql_content)

    if not converter.tables:
        print("[ERROR] No se encontraron tablas en el archivo SQL")
        sys.exit(1)

    print(f"\n[OK] Tablas encontradas: {len(converter.tables)}")
    print(f"[OK] Relaciones encontradas: {len(converter.relationships)}")
    print()

    # Generar XMI
    xmi_gen = XMIGenerator()
    xmi_gen.generate_xmi(converter.tables, converter.relationships, str(output_file))

    print("\n" + "=" * 70)
    print("Conversion completada exitosamente!")
    print("El archivo XMI incluye todas las relaciones.")
    print("=" * 70)


if __name__ == "__main__":
    main()
