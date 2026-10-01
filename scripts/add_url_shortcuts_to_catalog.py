#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/add_url_shortcuts_to_catalog.py
Varre atalhos da internet (.url e .webloc) no acervo, extrai o link de destino e
adiciona como material complementar (tipo 'link') nas aulas e módulos correspondentes.
"""

import os
import re
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(BASE_DIR, "src", "data", "catalog.json")
LOCAL_ROOT = "G:/Meu Drive/Cursos/Cursos Mindflix"

def extract_url_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.url':
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                for line in f:
                    line = line.strip()
                    if line.upper().startswith('URL='):
                        return line[4:].strip()
        except Exception as e:
            print(f"Erro lendo {file_path}: {e}")
    elif ext == '.webloc':
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                m = re.search(r'<string>(https?://[^<]+)</string>', content)
                if m:
                    return m.group(1).strip()
        except Exception as e:
            print(f"Erro lendo webloc {file_path}: {e}")
    return None

def clean_shortcut_title(filename):
    name = os.path.splitext(filename)[0]
    # Remove leading aula X / Xo passo
    name = re.sub(r'^[Aa]ula\s*\d+\s*[-_]?\s*', '', name)
    name = re.sub(r'^\d+\s*[-_º°]?\s*', '', name)
    name = name.strip()
    return name if name else filename

def main():
    print("1. Procurando atalhos de internet (.url e .webloc)...")
    if not os.path.isdir(LOCAL_ROOT):
        print(f"Pasta raiz {LOCAL_ROOT} não encontrada!")
        return

    shortcuts = []
    for dirpath, _, filenames in os.walk(LOCAL_ROOT):
        for f in filenames:
            if f.lower().endswith(('.url', '.webloc')):
                full_path = os.path.join(dirpath, f)
                rel_path = os.path.relpath(full_path, LOCAL_ROOT).replace('\\', '/')
                target_url = extract_url_from_file(full_path)
                if target_url:
                    shortcuts.append({
                        'filename': f,
                        'full_path': full_path,
                        'relative_path': rel_path,
                        'target_url': target_url,
                        'dir_rel': os.path.dirname(rel_path)
                    })

    print(f"   Encontrados {len(shortcuts)} atalhos válidos.")
    for s in shortcuts:
        print(f"   - {s['filename']} -> {s['target_url']}")

    print("\n2. Carregando catalog.json...")
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    added_count = 0

    print("3. Vinculando atalhos aos módulos e aulas...")
    for s in shortcuts:
        dir_rel = s['dir_rel'].lower()
        file_lower = s['filename'].lower()
        target_url = s['target_url']
        display_title = clean_shortcut_title(s['filename'])

        # Cria slug para ID único
        slug = re.sub(r'[^a-z0-9]+', '-', s['filename'].lower()).strip('-')
        mat_id = f"link-{slug}"

        material_obj = {
            "id": mat_id,
            "title": display_title,
            "type": "link",
            "relative_path": s['relative_path'],
            "target_url": target_url,
            "url": target_url,
            "is_link": True
        }

        # Procura em qual módulo ou aula se encaixa
        matched = False
        for course in catalog.get("courses", []):
            for module in course.get("modules", []):
                mod_rel = (module.get("relative_path") or "").replace('\\', '/').lower()
                # Verifica se o arquivo está na pasta do módulo
                if mod_rel and (dir_rel.endswith(mod_rel) or mod_rel.endswith(dir_rel) or dir_rel == mod_rel):
                    # Tenta associar a uma aula específica
                    # Ex: se o nome do arquivo contém 'aula 2', 'aula 3'
                    m_aula = re.search(r'aula\s*(\d+|extra)', file_lower)
                    target_lesson_num = m_aula.group(1) if m_aula else None

                    attached_to_specific = False
                    if target_lesson_num:
                        for lesson in module.get("lessons", []):
                            les_title = (lesson.get("display_title") or lesson.get("raw_title") or "").lower()
                            les_rel = (lesson.get("relative_path") or "").lower()
                            if f"aula {target_lesson_num}" in les_title or f"aula {target_lesson_num}" in les_rel or f"passo" in les_title and f"0{target_lesson_num}" in les_title:
                                mats = lesson.setdefault("materials", [])
                                if not any(m.get("relative_path") == s['relative_path'] or m.get("target_url") == target_url for m in mats):
                                    mats.append(material_obj)
                                    added_count += 1
                                    attached_to_specific = True
                                    matched = True
                                    print(f"   [VINCULADO] {s['filename']} -> Aula: {lesson.get('display_title')}")
                                    break

                    if not attached_to_specific:
                        # Associa à primeira aula ou a todas as aulas do módulo
                        for lesson in module.get("lessons", []):
                            mats = lesson.setdefault("materials", [])
                            if not any(m.get("relative_path") == s['relative_path'] or m.get("target_url") == target_url for m in mats):
                                mats.append(material_obj)
                                added_count += 1
                                matched = True
                        print(f"   [VINCULADO MÓDULO] {s['filename']} -> Módulo: {module.get('display_title')}")

        if not matched:
            print(f"   [AVISO] Não foi possível vincular automaticamente: {s['relative_path']}")

    print(f"\nTotal de vínculos de atalhos criados em aulas: {added_count}")

    # Salva catalog.json de forma atômica
    tmp_path = CATALOG_PATH + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, CATALOG_PATH)
    print("catalog.json salvo com sucesso!")

if __name__ == "__main__":
    main()
