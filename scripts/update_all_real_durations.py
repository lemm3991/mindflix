#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/update_all_real_durations.py
Extrai durações REAIS e PRECISAS de todos os vídeos:
1. Varre em alta velocidade a Google Drive API (pageSize=1000) extraindo videoMediaMetadata.durationMillis
2. Para vídeos locais sem metadados do Drive, executa ffprobe ultra-rápido
3. Atualiza catalog.json, trilhas.json e video_durations.json
4. Recalcula tempo total de todos os módulos, cursos e trilhas
"""

import os
import json
import time
import subprocess
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
import sys
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
import drive_scanner
CATALOG_PATH = os.path.join(BASE_DIR, "src", "data", "catalog.json")
TRILHAS_PATH = os.path.join(BASE_DIR, "src", "data", "trilhas.json")
OUTPUT_DURATIONS_PATH = os.path.join(BASE_DIR, "src", "data", "video_durations.json")
LOCAL_ROOT = "G:/Meu Drive/Cursos/Cursos Mindflix"

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

DRIVE_CACHE_PATH = os.path.join(BASE_DIR, "src", "data", "drive_durations_cache.json")

def probe_local_file(rel_path):
    if not rel_path:
        return None
    full = os.path.normpath(os.path.join(LOCAL_ROOT, rel_path))
    if not os.path.isfile(full):
        return None
    try:
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", full]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, timeout=5)
        if res.returncode == 0 and res.stdout:
            raw_out = res.stdout.decode('utf-8', errors='ignore').strip()
            if raw_out:
                val = float(raw_out)
                if val > 0:
                    return int(round(val))
    except Exception:
        pass
    return None

def fetch_all_drive_durations():
    if os.path.exists(DRIVE_CACHE_PATH):
        try:
            with open(DRIVE_CACHE_PATH, "r", encoding="utf-8") as f:
                cached = json.load(f)
                if len(cached) > 3000:
                    print(f"Usando cache do Google Drive ({len(cached)} durações carregadas)...")
                    return cached
        except Exception:
            pass

    print("1. Conectando à Google Drive API...")
    print("1. Conectando à Google Drive API...")
    svc = drive_scanner.get_drive_service()
    if not svc:
        print("Aviso: Não foi possível autenticar na Google Drive API. Usando apenas arquivos locais.")
        return {}

    drive_durations = {}
    page_token = None
    page_num = 1
    total_found = 0

    print("2. Coletando metadados de duração da Google Drive API em lotes...")
    t0 = time.time()
    while True:
        try:
            res = svc.files().list(
                q="mimeType contains 'video' and trashed = false",
                fields="nextPageToken, files(id, name, videoMediaMetadata(durationMillis))",
                pageSize=1000,
                pageToken=page_token
            ).execute()
        except Exception as e:
            print(f"Erro ao buscar página {page_num}: {e}")
            break

        files = res.get('files', [])
        page_durations = 0
        for f in files:
            vmeta = f.get('videoMediaMetadata')
            if vmeta and vmeta.get('durationMillis'):
                ms = int(vmeta['durationMillis'])
                secs = int(round(ms / 1000.0))
                if secs > 0:
                    drive_durations[f['id']] = secs
                    page_durations += 1

        total_found += len(files)
        print(f"   Página {page_num}: {len(files)} vídeos processados ({page_durations} com duração precisa). Total acumulado: {len(drive_durations)}")

        page_token = res.get('nextPageToken')
        if not page_token:
            break
        page_num += 1

    print(f"Coleta do Google Drive finalizada em {time.time() - t0:.1f}s! Total de {len(drive_durations)} durações de vídeo obtidas.")
    return drive_durations

def main():
    drive_durations = fetch_all_drive_durations()

    print("\n3. Lendo catalog.json...")
    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    # Dicionário unificado para video_durations.json
    durations_map = {}
    updated_lessons = 0
    from_drive = 0
    from_local = 0
    total_lessons = 0

    print("4. Atualizando durações reais de cada aula...")
    for course in catalog.get("courses", []):
        course_secs = 0
        for module in course.get("modules", []):
            module_secs = 0
            for lesson in module.get("lessons", []):
                total_lessons += 1
                lesson_id = lesson.get("id")
                drive_id = lesson.get("drive_file_id")
                rel_path = lesson.get("relative_path")
                raw_title = lesson.get("raw_title")
                disp_title = lesson.get("display_title")

                real_secs = None

                # 1. Checa se o Google Drive tem a duração real
                if drive_id and drive_id in drive_durations:
                    real_secs = drive_durations[drive_id]
                    from_drive += 1

                # 2. Se não encontrou no Drive, tenta via ffprobe local
                if not real_secs and rel_path:
                    local_secs = probe_local_file(rel_path)
                    if local_secs:
                        real_secs = local_secs
                        from_local += 1

                # 3. Se obteve duração real, atualiza
                if real_secs and real_secs > 0:
                    lesson["duration_seconds"] = real_secs
                    lesson["duration_formatted"] = format_duration(real_secs)
                    updated_lessons += 1
                else:
                    # Mantém a duração existente ou formata adequadamente
                    cur_secs = lesson.get("duration_seconds", 0)
                    if cur_secs > 0:
                        lesson["duration_formatted"] = format_duration(cur_secs)

                final_secs = lesson.get("duration_seconds", 0)
                final_fmt = lesson.get("duration_formatted", "00:00")
                module_secs += final_secs

                # Indexa no durations_map para busca rápida por qualquer identificador
                dur_info = {
                    "duration_seconds": final_secs,
                    "duration_formatted": final_fmt
                }
                if lesson_id:
                    durations_map[lesson_id] = dur_info
                if drive_id:
                    durations_map[drive_id] = dur_info
                if rel_path:
                    durations_map[rel_path] = dur_info
                if raw_title:
                    durations_map[raw_title] = dur_info
                if disp_title:
                    durations_map[disp_title] = dur_info

            course_secs += module_secs

        # Atualiza totais do curso
        course["total_duration_seconds"] = course_secs
        course["total_duration_formatted"] = format_course_duration(course_secs)

    print(f"Total de aulas: {total_lessons}")
    print(f"Durações reais obtidas: {updated_lessons} (Drive: {from_drive}, Local/ffprobe: {from_local})")

    print("\n5. Salvando catalog.json...")
    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)

    print("6. Salvando video_durations.json...")
    with open(OUTPUT_DURATIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(durations_map, f, ensure_ascii=False, indent=2)

    print("\n7. Atualizando trilhas.json com durações recalculadas...")
    if os.path.exists(TRILHAS_PATH):
        with open(TRILHAS_PATH, "r", encoding="utf-8") as f:
            trilhas_data = json.load(f)

        course_map = {c["id"]: c for c in catalog.get("courses", [])}

        for trilha in trilhas_data.get("trilhas", []):
            trilha_total_secs = 0
            trilha_total_lessons = 0

            for tc in trilha.get("courses", []):
                c_id = tc.get("course_id")
                matched_c = course_map.get(c_id)
                if matched_c:
                    tc["total_duration_seconds"] = matched_c["total_duration_seconds"]
                    tc["total_duration_formatted"] = matched_c["total_duration_formatted"]
                    tc["lessons_count"] = matched_c.get("lessons_count", len([l for m in matched_c.get("modules", []) for l in m.get("lessons", [])]))
                    tc["modules_count"] = len(matched_c.get("modules", []))
                    trilha_total_secs += matched_c["total_duration_seconds"]
                    trilha_total_lessons += tc["lessons_count"]

            trilha["total_duration_seconds"] = trilha_total_secs
            trilha["total_duration_formatted"] = format_course_duration(trilha_total_secs)
            trilha["total_lessons_count"] = trilha_total_lessons

        with open(TRILHAS_PATH, "w", encoding="utf-8") as f:
            json.dump(trilhas_data, f, ensure_ascii=False, indent=2)
        print("trilhas.json atualizado com sucesso!")

    print("\nSUCESSO: Catálogo completo, trilhas e playlist atualizados com durações exatas!")

if __name__ == "__main__":
    main()
