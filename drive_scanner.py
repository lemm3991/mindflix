#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
drive_scanner.py - Módulo de Varredura e Sincronização com Google Drive API (v3)
Permite ao Mindflix catalogar cursos e vídeos hospedados no Google Drive
sem baixar arquivos de vídeo, extraindo metadados e gerando links de streaming.
"""

import os
import io
import re
import json
import unicodedata
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

DRIVE_READONLY_SCOPE = ['https://www.googleapis.com/auth/drive.readonly']
DEFAULT_DRIVE_FOLDER_ID = '1BFljfXrOGVTgiFXg3jmNcYcWlaafrxOz'

VIDEO_EXTS = {".mp4", ".mkv", ".webm", ".mov", ".avi", ".m4v", ".ts"}
DOC_EXTS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".zip", ".rar", ".7z", ".tar", ".gz", ".ipynb", ".pbix", ".csv", ".sql", ".py", ".r"}
IMAGE_NAMES = {"cover.jpg", "cover.png", "capa.jpg", "capa.png", "thumb.jpg", "thumb.png"}

def resolve_credentials_path(custom_path=None):
    if custom_path and os.path.isfile(custom_path):
        return os.path.abspath(custom_path)
    
    env_path = os.environ.get("GOOGLE_CREDENTIALS_PATH")
    if env_path and os.path.isfile(env_path):
        return os.path.abspath(env_path)
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(current_dir, "drive-credentials.json"),
        os.path.join(current_dir, "credentials.json"),
        os.path.join(current_dir, "service_account.json"),
    ]
    for c in candidates:
        if os.path.isfile(c):
            return c
    return None

def resolve_drive_folder_id(custom_id=None):
    if custom_id:
        return custom_id.strip()
    env_id = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
    if env_id:
        return env_id.strip()
    return DEFAULT_DRIVE_FOLDER_ID

import httplib2
import google_auth_httplib2

def get_drive_service(creds_path=None):
    path = resolve_credentials_path(creds_path)
    if not path:
        return None
    try:
        creds = service_account.Credentials.from_service_account_file(
            path,
            scopes=DRIVE_READONLY_SCOPE
        )
        http = httplib2.Http(disable_ssl_certificate_validation=True)
        authed = google_auth_httplib2.AuthorizedHttp(creds, http=http)
        service = build('drive', 'v3', http=authed, cache_discovery=False)
        return service
    except Exception as e:
        print(f"[Drive] Erro ao inicializar servico do Google Drive: {e}")
        return None

def list_drive_folder(service, folder_id):
    """Lista todos os arquivos e subpastas de uma pasta específica no Google Drive."""
    items = []
    page_token = None
    query = f"'{folder_id}' in parents and trashed = false"
    fields = "nextPageToken, files(id, name, mimeType, size, videoMediaMetadata, modifiedTime, webViewLink)"
    
    while True:
        try:
            res = service.files().list(
                q=query,
                fields=fields,
                pageSize=100,
                pageToken=page_token
            ).execute()
            items.extend(res.get('files', []))
            page_token = res.get('nextPageToken')
            if not page_token:
                break
        except Exception as e:
            print(f"[Drive] Erro ao listar pasta {folder_id}: {e}")
            break
            
    return items

def download_drive_file(service, file_id, dest_path):
    """Faz download de um arquivo pequeno (como imagem de capa) do Google Drive."""
    try:
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        request = service.files().get_media(fileId=file_id)
        with open(dest_path, "wb") as fh:
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
        return True
    except Exception as e:
        print(f"[Drive] Falha ao baixar arquivo {file_id} para {dest_path}: {e}")
        return False

def scan_google_drive(
    service,
    root_folder_id,
    overrides=None,
    clean_display_title=None,
    clean_module_title=None,
    slugify=None,
    infer_provider=None,
    classify_course=None,
    natural_sort_key=None,
    covers_dir=None,
    verbose=False
):
    """Varre a estrutura de pastas e cursos no Google Drive."""
    if overrides is None:
        overrides = {}
    if clean_display_title is None:
        clean_display_title = lambda x: x
    if clean_module_title is None:
        clean_module_title = lambda x: x
    if slugify is None:
        slugify = lambda x: x.lower().replace(' ', '-')
    if infer_provider is None:
        infer_provider = lambda *args, **kwargs: "Online"
    if classify_course is None:
        classify_course = lambda *args: (["ia"], ["online"])
    if natural_sort_key is None:
        natural_sort_key = lambda x: x

    print(f"\n[Drive] Iniciando varredura no Google Drive (Raiz ID: {root_folder_id})...")
    root_items = list_drive_folder(service, root_folder_id)
    root_items = sorted(root_items, key=lambda x: natural_sort_key(x['name']))

    course_candidates = []
    for item in root_items:
        if item['mimeType'] != 'application/vnd.google-apps.folder':
            continue

        raw_name = item['name']
        folder_id = item['id']

        # Verificar se é contêiner multi-cursos (como Asimov, SCTEC, Outros, Hashtag, AI LAB, etc.)
        sub_items = list_drive_folder(service, folder_id)
        sub_items = sorted(sub_items, key=lambda x: natural_sort_key(x['name']))
        sub_folders = [sc for sc in sub_items if sc['mimeType'] == 'application/vnd.google-apps.folder']

        if raw_name.lower() in {'asimov', 'sctec', 'asimov skills', 'outros', 'outra', 'outras', 'hashtag', 'ai lab', 'ai-lab', 'diversos'} or len(sub_folders) > 0:
            container_name = raw_name
            is_asimov = 'asimov' in container_name.lower()
            for sc in sub_folders:
                sc_name_lower = sc['name'].lower()
                if sc_name_lower in {'cursos', 'asimov skills', 'trilhas asimov', 'projetos', 'soft skills', 'especialização soft skills', 'especializacao soft skills'}:
                    sub_sub_items = list_drive_folder(service, sc['id'])
                    sub_sub_folders = [ssc for ssc in sub_sub_items if ssc['mimeType'] == 'application/vnd.google-apps.folder']
                    for ssc in sub_sub_folders:
                        course_candidates.append({
                            "raw_name": ssc['name'],
                            "folder_id": ssc['id'],
                            "rel_path": f"{container_name}/{sc['name']}/{ssc['name']}",
                            "is_asimov": is_asimov,
                            "container": container_name
                        })
                else:
                    course_candidates.append({
                        "raw_name": sc['name'],
                        "folder_id": sc['id'],
                        "rel_path": f"{container_name}/{sc['name']}",
                        "is_asimov": is_asimov,
                        "container": container_name
                    })
        else:
            course_candidates.append({
                "raw_name": raw_name,
                "folder_id": folder_id,
                "rel_path": raw_name,
                "is_asimov": False,
                "container": None
            })

    print(f"[Drive] Total de cursos encontrados no Drive: {len(course_candidates)}")
    scanned_courses = []

    for c_cand in course_candidates:
        raw_name = c_cand["raw_name"]
        folder_id = c_cand["folder_id"]
        rel_path = c_cand["rel_path"]
        is_asimov = c_cand["is_asimov"]

        clean_title = clean_display_title(raw_name)
        slug = slugify(clean_title)
        course_id = f"course-{slug}"

        provider = infer_provider(raw_name, rel_path, is_asimov=is_asimov)
        categories, tags = classify_course(clean_title, raw_name, rel_path)

        if verbose:
            print(f"  [Drive] Processando curso: {clean_title}...")

        # Listar conteúdo da pasta do curso
        course_items = list_drive_folder(service, folder_id)
        course_items = sorted(course_items, key=lambda x: natural_sort_key(x['name']))

        # Procurar capa do curso
        cover_image = None
        local_cover_path = os.path.join(covers_dir, f"{course_id}.jpg") if covers_dir else None
        
        # Verificar se já existe capa local
        if local_cover_path and os.path.isfile(local_cover_path):
            cover_image = f"/covers/{course_id}.jpg"
        else:
            # Procurar imagem no Drive para baixar como capa
            for f in course_items:
                name_lower = f['name'].lower()
                is_img = f['mimeType'].startswith('image/') or name_lower in IMAGE_NAMES
                if is_img:
                    if local_cover_path:
                        success = download_drive_file(service, f['id'], local_cover_path)
                        if success:
                            cover_image = f"/covers/{course_id}.jpg"
                            break
                    if not cover_image:
                        cover_image = f"https://drive.google.com/uc?export=view&id={f['id']}"

        def get_subfolder_media(folder_id):
            """Coleta recursivamente todos os vídeos e documentos dentro de uma pasta de módulo."""
            v_list = []
            d_list = []
            items = list_drive_folder(service, folder_id)
            items = sorted(items, key=lambda x: natural_sort_key(x['name']))
            
            for item in items:
                m_type = item.get('mimeType', '')
                f_name = item.get('name', '')
                ext = os.path.splitext(f_name)[1].lower()
                
                if m_type == 'application/vnd.google-apps.folder':
                    sub_v, sub_d = get_subfolder_media(item['id'])
                    v_list.extend(sub_v)
                    d_list.extend(sub_d)
                elif m_type.startswith('video/') or ext in VIDEO_EXTS:
                    v_list.append(item)
                elif ext in DOC_EXTS or ext == '.zip':
                    d_list.append(item)
                    
            return v_list, d_list

        subfolders = [f for f in course_items if f['mimeType'] == 'application/vnd.google-apps.folder']
        modules = []

        if subfolders:
            # Curso com módulos em subpastas (com suporte a subpastas aninhadas)
            for mod_idx, sub in enumerate(subfolders, 1):
                clean_m_title = clean_module_title(sub['name'])
                m_slug = slugify(sub['name'])
                m_id = f"{course_id}-mod-{m_slug}" if m_slug else f"{course_id}-mod-{mod_idx:02d}"

                video_files, other_files = get_subfolder_media(sub['id'])
                video_files = sorted(video_files, key=lambda x: natural_sort_key(x['name']))

                matching_mats = {}
                general_mats = []
                for o in other_files:
                    matched_v_id = None
                    for v in video_files:
                        b_name = os.path.splitext(v['name'])[0][:10]
                        if o['name'].startswith(b_name):
                            matched_v_id = v['id']
                            break
                    mat_obj = {
                        "id": f"{course_id}-mat-{o['id']}",
                        "title": clean_display_title(o['name']),
                        "type": "pdf" if o['name'].lower().endswith('.pdf') else "document",
                        "relative_path": f"drive:{o['id']}",
                        "drive_file_id": o['id'],
                        "drive_url": f"https://drive.google.com/file/d/{o['id']}/view"
                    }
                    if matched_v_id:
                        matching_mats.setdefault(matched_v_id, []).append(mat_obj)
                    else:
                        general_mats.append(mat_obj)

                lessons = []
                for idx, v in enumerate(video_files, 1):
                    raw_v_name = v['name']
                    # Limpar caracteres unicode especiais (ex: \uf03a usado para dois-pontos em nomes do Windows)
                    clean_v_name = raw_v_name.replace('\uf03a', ':').replace('\uf022', '"').replace('\uf02f', '/')
                    clean_v_name = unicodedata.normalize('NFC', clean_v_name).strip()
                    v_id = v['id']
                    les_slug = slugify(os.path.splitext(clean_v_name)[0])
                    les_id = f"{m_id}-les-{les_slug}"

                    dur_ms = v.get('videoMediaMetadata', {}).get('durationMillis', 0)
                    dur_sec = round(int(dur_ms) / 1000) if dur_ms else 300
                    dur_fmt = f"{dur_sec // 60:02d}:{dur_sec % 60:02d}"

                    mats = (matching_mats.get(v_id) or []) + general_mats

                    lessons.append({
                        "id": les_id,
                        "order_index": idx,
                        "raw_title": clean_v_name,
                        "display_title": clean_display_title(clean_v_name),
                        "relative_path": f"drive:{v_id}",
                        "drive_file_id": v_id,
                        "drive_url": f"https://drive.google.com/file/d/{v_id}/preview",
                        "type": "video",
                        "duration_seconds": dur_sec,
                        "duration_formatted": dur_fmt,
                        "materials": mats
                    })

                if lessons:
                    modules.append({
                        "id": m_id,
                        "order_index": mod_idx,
                        "raw_title": sub['name'],
                        "display_title": clean_m_title,
                        "relative_path": f"{rel_path}/{sub['name']}",
                        "lessons": lessons
                    })
        else:
            # Vídeos diretos na pasta do curso
            video_files = [f for f in course_items if f['mimeType'].startswith('video/') or os.path.splitext(f['name'])[1].lower() in VIDEO_EXTS]
            other_files = [f for f in course_items if os.path.splitext(f['name'])[1].lower() in DOC_EXTS]

            matching_mats = {}
            general_mats = []
            for o in other_files:
                matched_v_id = None
                for v in video_files:
                    b_name = os.path.splitext(v['name'])[0][:10]
                    if o['name'].startswith(b_name):
                        matched_v_id = v['id']
                        break
                mat_obj = {
                    "id": f"{course_id}-mat-{o['id']}",
                    "title": clean_display_title(o['name']),
                    "type": "pdf" if o['name'].lower().endswith('.pdf') else "document",
                    "relative_path": f"drive:{o['id']}",
                    "drive_file_id": o['id'],
                    "drive_url": f"https://drive.google.com/file/d/{o['id']}/view"
                }
                if matched_v_id:
                    matching_mats.setdefault(matched_v_id, []).append(mat_obj)
                else:
                    general_mats.append(mat_obj)

            if video_files or other_files:
                m_id = f"{course_id}-mod-01"
                lessons = []
                for idx, v in enumerate(video_files, 1):
                    raw_v_name = v['name']
                    clean_v_name = raw_v_name.replace('\uf03a', ':').replace('\uf022', '"').replace('\uf02f', '/')
                    clean_v_name = unicodedata.normalize('NFC', clean_v_name).strip()
                    v_id = v['id']
                    les_slug = slugify(os.path.splitext(clean_v_name)[0])
                    dur_ms = v.get('videoMediaMetadata', {}).get('durationMillis', 0)
                    dur_sec = round(int(dur_ms) / 1000) if dur_ms else 300
                    dur_fmt = f"{dur_sec // 60:02d}:{dur_sec % 60:02d}"

                    mats = (matching_mats.get(v_id) or []) + general_mats

                    lessons.append({
                        "id": f"{m_id}-les-{les_slug}",
                        "order_index": idx,
                        "raw_title": clean_v_name,
                        "display_title": clean_display_title(clean_v_name),
                        "relative_path": f"drive:{v_id}",
                        "drive_file_id": v_id,
                        "drive_url": f"https://drive.google.com/file/d/{v_id}/preview",
                        "type": "video",
                        "duration_seconds": dur_sec,
                        "duration_formatted": dur_fmt,
                        "materials": mats
                    })
                modules.append({
                    "id": m_id,
                    "order_index": 1,
                    "raw_title": raw_name,
                    "display_title": "Aulas Principais",
                    "relative_path": rel_path,
                    "lessons": lessons
                })

        total_lessons = sum(len(m["lessons"]) for m in modules)
        total_seconds = sum(l["duration_seconds"] for m in modules for l in m["lessons"])
        total_hours = total_seconds // 3600
        total_mins = (total_seconds % 3600) // 60

        desc = (f"Curso sobre {clean_title}, ministrado por {provider}. "
                f"Contém {len(modules)} módulos e {total_lessons} aulas ({total_hours}h {total_mins:02d}m) hospedado no Google Drive.")

        # Aplicar manual overrides
        override = overrides.get(course_id, {})
        final_title = override.get("display_title", clean_title)
        final_desc = override.get("description", desc)
        final_provider = override.get("provider", provider)
        final_cats = override.get("categories", categories)
        final_tags = override.get("tags", tags)
        final_cover = override.get("cover_image", cover_image)
        is_hidden = override.get("is_hidden", False)
        is_featured = override.get("is_featured", clean_title in [
            "Dominando o Ecossistema Claude",
            "Aplicações de IA com Python",
            "Supabase Impressionador — Backend Moderno",
            "Criando Agentes de Atendimento no n8n",
            "Lovable Impressionador — Apps com IA",
            "Agentes de IA e n8n Impressionador"
        ])

        course_record = {
            "id": course_id,
            "slug": slug,
            "raw_title": raw_name,
            "display_title": final_title,
            "detected_title": clean_title,
            "description": final_desc,
            "provider": final_provider,
            "categories": final_cats,
            "detected_categories": categories,
            "tags": final_tags,
            "detected_tags": tags,
            "relative_path": rel_path,
            "source": "drive",
            "drive_folder_id": folder_id,
            "modules_count": len(modules),
            "lessons_count": total_lessons,
            "total_duration_seconds": total_seconds,
            "total_duration_formatted": f"{total_hours}h {total_mins:02d}m",
            "cover_image": final_cover,
            "is_featured": is_featured,
            "is_hidden": is_hidden,
            "classification_source": "manual" if course_id in overrides else "drive_scanner",
            "classification_confidence": 0.95 if course_id in overrides else 0.88,
            "discovered_at": datetime.now().astimezone().isoformat(),
            "last_scanned_at": datetime.now().astimezone().isoformat(),
            "modules": modules
        }

        scanned_courses.append(course_record)
        print(f"  [OK] {final_title}: {len(modules)} módulos, {total_lessons} aulas ({total_hours}h {total_mins:02d}m)")

    return scanned_courses
