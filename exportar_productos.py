"""
Exporta productos.json a productos_export.csv
Uso: python3 exportar_productos.py
"""
import json, csv, os

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, 'productos.json'), encoding='utf-8') as f:
    data = json.load(f)

COLUMNAS = [
    'categoria_id', 'grupo',
    'id', 'nombre', 'tipo', 'descripcion', 'imagen',
    'visible', 'disponible',
    'frutal', 'cremoso', 'vegano', 'sin_azucar', 'premium',
    'ingredientes', 'alergenos',
    'nutri_porcion', 'nutri_kcal', 'nutri_grasa', 'nutri_grasasat',
    'nutri_hc', 'nutri_azucares', 'nutri_proteina', 'nutri_sal',
]

def bool_str(v):
    if isinstance(v, bool):
        return 'true' if v else 'false'
    return str(v)

filas = []
for cat in data['categorias']:
    for grupo in cat['grupos']:
        for p in grupo['productos']:
            n = p.get('tablaNutricional') or {}
            fi = p.get('filtros') or {}
            filas.append({
                'categoria_id': cat['id'],
                'grupo':         grupo['titulo'],
                'id':            p['id'],
                'nombre':        p.get('nombre', ''),
                'tipo':          p.get('tipo', ''),
                'descripcion':   p.get('descripcion', ''),
                'imagen':        p.get('imagen') or '',
                'visible':       bool_str(p.get('visible', True)),
                'disponible':    bool_str(p.get('disponible', True)),
                'frutal':        bool_str(fi.get('frutal', False)),
                'cremoso':       bool_str(fi.get('cremoso', False)),
                'vegano':        bool_str(fi.get('vegano', False)),
                'sin_azucar':    bool_str(fi.get('sinAzucar', False)),
                'premium':       bool_str(fi.get('premium', False)),
                'ingredientes':  p.get('ingredientes', ''),
                'alergenos':     p.get('alergenos', ''),
                'nutri_porcion': n.get('porcion', ''),
                'nutri_kcal':    n.get('e', ''),
                'nutri_grasa':   n.get('g', ''),
                'nutri_grasasat':n.get('s', ''),
                'nutri_hc':      n.get('hc', ''),
                'nutri_azucares':n.get('az', ''),
                'nutri_proteina':n.get('p', ''),
                'nutri_sal':     n.get('sal', ''),
            })

salida = os.path.join(BASE, 'productos_export.csv')
with open(salida, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=COLUMNAS)
    writer.writeheader()
    writer.writerows(filas)

print(f"✓ {len(filas)} productos exportados → productos_export.csv")
