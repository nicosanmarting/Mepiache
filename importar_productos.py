"""
Importa productos_export.csv y actualiza productos.json + productos.js
Uso: python3 importar_productos.py
"""
import json, csv, os, shutil
from datetime import datetime

BASE = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE, 'productos.json')
CSV_PATH  = os.path.join(BASE, 'productos_export.csv')
JS_PATH   = os.path.join(BASE, 'productos.js')

if not os.path.exists(CSV_PATH):
    print(f"✗ No se encontró {CSV_PATH}")
    raise SystemExit(1)

# ── Helpers ──────────────────────────────────────────────────────────────────

def parse_bool(v):
    if str(v).lower() == 'true':  return True
    if str(v).lower() == 'false': return False
    return str(v)  # string: 'encargo', 'temporada', 'disponible', etc.

def parse_num(v):
    if v == '' or v is None: return 0
    f = float(v)
    return int(f) if f == int(f) else f

# ── Leer CSV ──────────────────────────────────────────────────────────────────

with open(CSV_PATH, encoding='utf-8-sig', newline='') as f:
    filas_csv = {row['id']: row for row in csv.DictReader(f)}

print(f"CSV cargado: {len(filas_csv)} productos")

# ── Leer JSON ────────────────────────────────────────────────────────────────

with open(JSON_PATH, encoding='utf-8') as f:
    data = json.load(f)

# ── Backup silencioso ────────────────────────────────────────────────────────

ts = datetime.now().strftime('%Y%m%d_%H%M%S')
shutil.copy(JSON_PATH, JSON_PATH + f'.bak_{ts}')

# ── Actualizar productos ──────────────────────────────────────────────────────

actualizados, no_encontrados = 0, []

for cat in data['categorias']:
    for grupo in cat['grupos']:
        for p in grupo['productos']:
            pid = p['id']
            if pid not in filas_csv:
                no_encontrados.append(pid)
                continue
            r = filas_csv[pid]

            p['nombre']      = r['nombre']
            p['tipo']        = r['tipo']
            p['descripcion'] = r['descripcion']
            p['imagen']      = r['imagen'] if r['imagen'] else None
            p['visible']     = parse_bool(r['visible'])
            p['disponible']  = parse_bool(r['disponible'])
            p['filtros']     = {
                'frutal':    parse_bool(r['frutal']),
                'cremoso':   parse_bool(r['cremoso']),
                'vegano':    parse_bool(r['vegano']),
                'sinAzucar': parse_bool(r['sin_azucar']),
                'premium':   parse_bool(r['premium']),
            }
            p['ingredientes'] = r['ingredientes']
            p['alergenos']    = r['alergenos']
            p['tablaNutricional'] = {
                'porcion': r['nutri_porcion'],
                'e':   parse_num(r['nutri_kcal']),
                'g':   parse_num(r['nutri_grasa']),
                's':   parse_num(r['nutri_grasasat']),
                'hc':  parse_num(r['nutri_hc']),
                'az':  parse_num(r['nutri_azucares']),
                'p':   parse_num(r['nutri_proteina']),
                'sal': parse_num(r['nutri_sal']),
            }
            actualizados += 1

# ── Guardar JSON ──────────────────────────────────────────────────────────────

with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# ── Regenerar productos.js ────────────────────────────────────────────────────

with open(JSON_PATH, encoding='utf-8') as f:
    json_raw = f.read()

with open(JS_PATH, 'w', encoding='utf-8') as f:
    f.write('window.PRODUCTOS_DATA = ')
    f.write(json_raw)
    f.write(';\n')

# ── Reporte ───────────────────────────────────────────────────────────────────

print(f"✓ {actualizados} productos actualizados → productos.json + productos.js")
if no_encontrados:
    print(f"⚠ IDs en JSON pero no en CSV (no modificados): {', '.join(no_encontrados)}")
print(f"  Backup guardado: productos.json.bak_{ts}")
