#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/apply_durations_to_catalog.py
Aplica as durações exatas de video_durations.json para catalog.json e trilhas.json de forma atômica e segura.
"""

import os
import json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(BASE_DIR, "src", "data", "catalog.json")
DURATIONS_PATH = os.path.join(BASE_DIR, "src", "data", "video_durations.json")
TRILHAS_PATH = os.path.join(BASE_DIR, "src", "data", "trilhas.json")

def format_duration(seconds):
    secs = int(round(seconds))
    hrs = secs // 3600
    mins = (secs % 3600) // 60
    s = secs % 60
    if hrs > 0:
        return f"{hrs:02d}:{mins:02d}:{s:02d}"
    return f"{mins:02d}:{s:02d}"

def format_course_duration(seconds):
    secs = int(round(seconds))
    hrs = secs // 3600
    mins = (secs % 3600) // 60
    if hrs > 0:
        return f"{hrs}h {mins:02d}m"
    return f"{mins} min"

def main():
    print("1. Carregando video_durations.json...")
    with open(DURATIONS_PATH, "r", encoding="utf-8") as f:
        durs = json.load(f)

    print("2. Carregando catalog.json...")
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    matched = 0
    total_lessons = 0
    course_durations = {}

    print("3. Atualizando aulas, módulos e cursos...")
    for course in catalog.get("courses", []):
        c_secs = 0
        c_id = course.get("id")
        for module in course.get("modules", []):
            m_secs = 0
            for lesson in module.get("lessons", []):
                total_lessons += 1
                l_id = lesson.get("id")
                drive_id = lesson.get("drive_file_id")
                rel_path = lesson.get("relative_path")

                info = (
                    durs.get(l_id)
                    or (durs.get(drive_id) if drive_id else None)
                    or (durs.get(rel_path) if rel_path else None)
                )

                if info and info.get("duration_seconds", 0) > 0:
                    lesson["duration_seconds"] = info["duration_seconds"]
                    lesson["duration_formatted"] = info["duration_formatted"]
                    matched += 1
                elif lesson.get("duration_seconds", 0) > 0:
                    lesson["duration_formatted"] = format_duration(lesson["duration_seconds"])

                m_secs += lesson.get("duration_seconds", 0)

            module["total_duration_seconds"] = m_secs
            module["total_duration_formatted"] = format_course_duration(m_secs)
            c_secs += m_secs

        course["total_duration_seconds"] = c_secs
        course["total_duration_formatted"] = format_course_duration(c_secs)
        course_durations[c_id] = {
            "total_duration_seconds": c_secs,
            "total_duration_formatted": course["total_duration_formatted"]
        }

    print(f"   Durações aplicadas: {matched}/{total_lessons} aulas ({matched/total_lessons*100:.1f}%)")

    # Salva catalog.json de forma atômica
    tmp_catalog = CATALOG_PATH + ".tmp"
    with open(tmp_catalog, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    os.replace(tmp_catalog, CATALOG_PATH)
    print(f"   catalog.json salvo com sucesso! ({os.path.getsize(CATALOG_PATH)} bytes)")

    # Atualiza trilhas.json
    print("4. Atualizando trilhas.json...")
    with open(TRILHAS_PATH, "r", encoding="utf-8") as f:
        trilhas_data = json.load(f)

    for trilha in trilhas_data.get("trilhas", []):
        t_secs = 0
        for item in trilha.get("courses", []):
            cid = item.get("course_id")
            if cid in course_durations:
                item["total_duration_seconds"] = course_durations[cid]["total_duration_seconds"]
                item["total_duration_formatted"] = course_durations[cid]["total_duration_formatted"]
            t_secs += item.get("total_duration_seconds", 0)
        trilha["total_duration_seconds"] = t_secs
        trilha["total_duration_formatted"] = format_course_duration(t_secs)

    tmp_trilhas = TRILHAS_PATH + ".tmp"
    with open(tmp_trilhas, "w", encoding="utf-8") as f:
        json.dump(trilhas_data, f, ensure_ascii=False, indent=2)
    os.replace(tmp_trilhas, TRILHAS_PATH)
    print(f"   trilhas.json salvo com sucesso! ({os.path.getsize(TRILHAS_PATH)} bytes)")
    print("Concluído!")

if __name__ == "__main__":
    main()
