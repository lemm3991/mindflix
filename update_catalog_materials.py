#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
update_catalog_materials.py - Associa arquivos de materiais (.zip, .pdf, .rar, .ipynb, .xlsx, etc.) 
presentes no Google Drive cache aos módulos e aulas correspondentes no catalog.json.
"""

import json
import os
import re

MINDFLIX_DIR = os.path.dirname(os.path.abspath(__file__))
CATALOG_PATH = os.path.join(MINDFLIX_DIR, "src", "data", "catalog.json")
DRIVE_CACHE_PATH = os.path.join(MINDFLIX_DIR, "drive_file_map_cache.json")

# Extensions considered complimentary materials
MATERIAL_EXTS = {
    ".zip", ".rar", ".7z", ".tar", ".gz",
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
    ".ipynb", ".pbix", ".csv", ".json", ".sql", ".py", ".r", ".txt"
}

IGNORE_KEYWORDS = [
    "transcricao", "transcrição", "transcript", "artigo", "article",
    "catalog.json", ".git", "scanner_cache.json"
]

def run():
    if not os.path.exists(CATALOG_PATH):
        print(f"Erro: catalog.json não encontrado em {CATALOG_PATH}")
        return
    if not os.path.exists(DRIVE_CACHE_PATH):
        print(f"Erro: drive_file_map_cache.json não encontrado em {DRIVE_CACHE_PATH}")
        return

    with open(DRIVE_CACHE_PATH, "r", encoding="utf-8") as f:
        cache = json.load(f)

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog_data = json.load(f)

    courses = catalog_data if isinstance(catalog_data, list) else catalog_data.get("courses", [])

    # Index material files from drive cache by normalized parent folder path
    folder_materials = {}
    for path_key, drive_id in cache.items():
        ext = os.path.splitext(path_key)[1].lower()
        if ext in MATERIAL_EXTS:
            filename = os.path.basename(path_key)
            if not any(ik in filename.lower() for ik in IGNORE_KEYWORDS):
                folder = os.path.dirname(path_key).lower().strip("/")
                folder_materials.setdefault(folder, []).append({
                    "raw_path": path_key,
                    "filename": filename,
                    "ext": ext,
                    "drive_file_id": drive_id
                })

    print(f"[Drive Cache] Pastas com materiais mapeadas: {len(folder_materials)}")

    total_lessons_updated = 0
    total_materials_added = 0

    for c in courses:
        c_rel = c.get("relative_path", "").lower().strip("/")
        c_mats = folder_materials.get(c_rel, [])

        for m in c.get("modules", []):
            m_rel = m.get("relative_path", "").lower().strip("/")
            m_mats = folder_materials.get(m_rel, []) or c_mats

            # Also check if subfolders of module contain materials
            if not m_mats and m_rel:
                for f_path, mats_list in folder_materials.items():
                    if f_path.startswith(m_rel + "/"):
                        m_mats.extend(mats_list)

            if not m_mats:
                continue

            lessons = m.get("lessons", [])
            for l in lessons:
                existing_mats = l.get("materials", [])
                
                # Filter out old transcripts/articles from materials list if needed
                clean_mats = [
                    mat for mat in existing_mats
                    if not any(ik in (mat.get("title", "") + mat.get("relative_path", "")).lower() for ik in ["transcr", "artigo", "transcript", "article"])
                ]

                # Match materials in module folder
                v_file = l.get("raw_title", "")
                v_prefix = os.path.splitext(v_file)[0][:10].lower() if v_file else ""

                # Check if any material is specific to this lesson
                spec_mats = [mat for mat in m_mats if v_prefix and mat["filename"].lower().startswith(v_prefix)]
                
                # If lesson specific materials exist, use them + general mats (00. / material / etc)
                if spec_mats:
                    general_mats = [mat for mat in m_mats if mat["filename"].lower().startswith("00.") or "material" in mat["filename"].lower()]
                    target_mats = spec_mats + [g for g in general_mats if g not in spec_mats]
                else:
                    target_mats = m_mats

                # Convert to catalog material objects
                new_mats = []
                seen_ids = set()

                for mat_info in target_mats:
                    drive_id = mat_info["drive_file_id"]
                    if drive_id in seen_ids:
                        continue
                    seen_ids.add(drive_id)

                    mat_id = f"{l['id']}-mat-{len(new_mats)+1}"
                    ext = mat_info["ext"].lstrip(".")
                    mat_type = "pdf" if ext == "pdf" else "zip" if ext in ["zip", "rar", "7z"] else ext

                    new_mats.append({
                        "id": mat_id,
                        "title": mat_info["filename"],
                        "type": mat_type,
                        "relative_path": f"drive:{drive_id}",
                        "drive_file_id": drive_id,
                        "drive_url": f"https://drive.google.com/file/d/{drive_id}/view"
                    })

                l["materials"] = new_mats
                if new_mats:
                    total_lessons_updated += 1
                    total_materials_added += len(new_mats)

    print(f"[Sucesso] {total_lessons_updated} aulas atualizadas com {total_materials_added} materiais.")

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog_data, f, ensure_ascii=False, indent=2)

    print(f"[Fim] {CATALOG_PATH} atualizado com sucesso!")

if __name__ == "__main__":
    run()
