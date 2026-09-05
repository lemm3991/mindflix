#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scan_library.py - Motor de Escaneamento, Metadados e Sincronização Inteligente do Mindflix
100% Somente-Leitura sobre a biblioteca física.
Preserva caminhos originais, IDs determinísticos, ordenação natural e overrides manuais.
"""

import os
import sys
import json
import re
import unicodedata
import subprocess
import argparse
from datetime import datetime

try:
    import drive_scanner
except ImportError:
    drive_scanner = None

# Path resolution
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MINDFLIX_DIR = CURRENT_DIR

# Read COURSES_ROOT from env or .env file, default to parent directory
def resolve_courses_root():
    env_root = os.environ.get("COURSES_ROOT")
    if env_root and os.path.isdir(env_root):
        return os.path.abspath(env_root)
    
    # Try reading .env file in mindflix
    env_file = os.path.join(MINDFLIX_DIR, ".env")
    if os.path.isfile(env_file):
        with open(env_file, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if line.startswith("COURSES_ROOT=") and not line.startswith("#"):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    candidate = os.path.abspath(os.path.join(MINDFLIX_DIR, val))
                    if os.path.isdir(candidate):
                        return candidate

    return os.path.abspath(os.path.join(MINDFLIX_DIR, ".."))

COURSES_ROOT = resolve_courses_root()
OUTPUT_CATALOG = os.path.join(MINDFLIX_DIR, "src", "data", "catalog.json")
OVERRIDES_PATH = os.path.join(MINDFLIX_DIR, "src", "data", "manual_overrides.json")
CATEGORIES_OVERRIDES_PATH = os.path.join(MINDFLIX_DIR, "src", "data", "categories_overrides.json")
CACHE_PATH = os.path.join(MINDFLIX_DIR, "scanner_cache.json")
SUMMARY_PATH = os.path.join(MINDFLIX_DIR, "src", "data", "catalog_summary.json")
COVERS_DIR = os.path.join(MINDFLIX_DIR, "public", "covers")

def load_categories_overrides():
    if os.path.isfile(CATEGORIES_OVERRIDES_PATH):
        try:
            with open(CATEGORIES_OVERRIDES_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list): return data
                if isinstance(data, dict) and "categories" in data: return data["categories"]
        except Exception as e:
            print(f"Warning: could not load categories overrides: {e}")
    return None

# Supported extensions
VIDEO_EXTS = {".mp4", ".mkv", ".webm", ".mov", ".avi", ".m4v"}
AUDIO_EXTS = {".mp3", ".m4a", ".wav", ".ogg"}
DOC_EXTS = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".md"}
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

DEFAULT_IGNORE = {
    ".git", "node_modules", "__pycache__", "mindflix", ".vscode", 
    "$recycle.bin", "system volume information", "desktop.ini"
}

# Categories catalog definition
CATEGORIES = [
    {
        "id": "ia",
        "name": "Inteligência Artificial",
        "icon": "sparkles",
        "description": "Modelos de linguagem, visão computacional, LLMs, Claude, GPT e ferramentas assistidas por IA."
    },
    {
        "id": "automacao-agentes",
        "name": "Automação & Agentes",
        "icon": "cpu",
        "description": "Criação de agentes autônomos, integrações com n8n, Make, fluxos de automação e atendimento."
    },
    {
        "id": "programacao-dev",
        "name": "Programação & Desenvolvimento",
        "icon": "terminal",
        "description": "Fundamentos e práticas de desenvolvimento moderno de software, engenharia e ferramentas."
    },
    {
        "id": "web-vibe-coding",
        "name": "Web, Apps & Vibe Coding",
        "icon": "layout",
        "description": "Criação de sites e aplicações modernas com Lovable, Astro, Three.js e front-end com IA."
    },
    {
        "id": "backend-infra",
        "name": "Backend, Banco de Dados & Infraestrutura",
        "icon": "database",
        "description": "Supabase, PostgreSQL, APIs, Docker, Linux, pipelines e arquitetura de dados escalável."
    },
    {
        "id": "dados-datascience",
        "name": "Dados & Data Science",
        "icon": "bar-chart-2",
        "description": "Análise de dados, dashboards, visualização analítica, machine learning e estatística aplicada."
    },
    {
        "id": "python",
        "name": "Python",
        "icon": "code",
        "description": "Especialização completa em Python: automação, manipulação com Pandas, Streamlit e scripts."
    },
    {
        "id": "trading",
        "name": "Trading & Mercado Financeiro",
        "icon": "trending-up",
        "description": "Algotrading, backtesting quantitativo, bots financeiros e análise técnica com código."
    },
    {
        "id": "negocios",
        "name": "Negócios & Empreendedorismo",
        "icon": "briefcase",
        "description": "Carreira tech, negociação, leilões, estratégias comerciais e soft skills para profissionais."
    },
    {
        "id": "saude-lifestyle",
        "name": "Saúde & Bem-Estar",
        "icon": "heart",
        "description": "Nutrição funcional, marmitas saudáveis e massoterapia anti-stress."
    },
    {
        "id": "musica",
        "name": "Música",
        "icon": "music",
        "description": "Teoria e prática musical, harmonia funcional e método tríade para violão."
    },
    {
        "id": "formacoes-trilhas",
        "name": "Formações & Trilhas",
        "icon": "compass",
        "description": "Jornadas completas e trilhas multi-curso para formação profissional acelerada."
    }
]

CATEGORY_RULES = {
    "ia": [
        "ia", "inteligência artificial", "inteligencia artificial", "claude", "gpt", "chatgpt", 
        "gemini", "llm", "deep learning", "visão computacional", "prompt", "openai", "anthropic", 
        "agente", "agentes", "openclaw"
    ],
    "automacao-agentes": [
        "agente", "agentes", "n8n", "make", "automação", "automacao", "automatizada", 
        "workflow", "atendimento", "hermes", "bot"
    ],
    "programacao-dev": [
        "programação", "programacao", "desenvolvimento", "dev", "código", "front-end", 
        "back-end", "api", "git", "docker", "software", "ciclo"
    ],
    "web-vibe-coding": [
        "lovable", "vibe coding", "sites", "estáticos", "estaticos", "web apps", "web", "html", "css"
    ],
    "backend-infra": [
        "supabase", "banco de dados", "postgres", "postgresql", "sql", "backend", "infraestrutura", "docker"
    ],
    "dados-datascience": [
        "dados", "data science", "ciência de dados", "analytics", "dashboards", "análise de dados", 
        "analise de dados", "machine learning"
    ],
    "python": [
        "python", "pandas", "streamlit", "numpy"
    ],
    "trading": [
        "trading", "algotrading", "backtesting", "financeiro", "leilão", "leilao", "lotes", "lucro"
    ],
    "negocios": [
        "carreira", "soft skills", "leilão", "leilao", "fipe", "anúncio", "vender"
    ],
    "saude-lifestyle": [
        "marmita", "marmitas", "fit", "nutri", "massagem", "stress", "saudável", "funcional"
    ],
    "musica": [
        "violão", "violo", "violao", "música", "musica", "harmonia", "percepção", "tríade"
    ],
    "formacoes-trilhas": [
        "trilha", "formação", "especialização", "ciclo", "onboarding", "projeto 60 dias"
    ]
}

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

TITLE_OVERRIDES = {
    "Algotrading - Execuo Automatizada": "Algotrading — Execução Automatizada",
    "Anlise de Dados com IA": "Análise de Dados com Inteligência Artificial",
    "Anlise de Dados com Python": "Análise de Dados com Python",
    "Aplicaes IA - Comece por aqui": "Aplicações de IA — Comece por Aqui",
    "Aplicaes de IA com Python": "Aplicações de IA com Python",
    "Backtesting - Avaliando Estratgias de Trading com Dados Histricos": "Backtesting — Avaliando Estratégias de Trading",
    "Como migrar de carreira para Anlise de Dados": "Como Migrar de Carreira para Análise de Dados",
    "Construindo Base de Dados para Trading": "Construindo Base de Dados para Trading",
    "Construindo sites estticos de alto nvel com IA": "Construindo Sites Estáticos de Alto Nível com IA",
    "Criando Agentes Pessoais com Hermes Agent": "Criando Agentes Pessoais com Hermes Agent",
    "Criando Agentes de Atendimento no n8n": "Criando Agentes de Atendimento no n8n",
    "Criando nosso primeiro agente com ChatGPT": "Criando Nosso Primeiro Agente com ChatGPT",
    "Dashboards Interativos com Python": "Dashboards Interativos com Python",
    "Data Science e Machine Learning": "Data Science e Machine Learning",
    "Dominando OpenClaw": "Dominando OpenClaw",
    "Dominando o Ecossistema Claude": "Dominando o Ecossistema Claude",
    "Engenharia de Dados com Python": "Engenharia de Dados com Python",
    "Ferramentas de IA para Desenvolvedores": "Ferramentas de IA para Desenvolvedores",
    "Integrando Python e Bancos de Dados": "Integrando Python e Bancos de Dados",
    "Integrando Python e Excel": "Integrando Python e Excel",
    "Onboarding - Engenheiro de Agentes de IA": "Onboarding — Engenheiro de Agentes de IA",
    "Web Apps de Dados com Python": "Web Apps de Dados com Python",
    "Agentes de IA e N8N Impressionador": "Agentes de IA e n8n Impressionador",
    "Carros de Leilao Michael Alves Faria 2023": "Carros de Leilão — Expert 2023",
    "Claude Impressionador": "Claude Impressionador",
    "Especialização Soft Skills": "Especialização em Soft Skills & Liderança",
    "Fit.Da.Nutri.Curso.Com.10.Marmitas.Fit.e.Funcional": "Fit da Nutri — 10 Marmitas Fit e Funcionais",
    "Inteligência Artificial Impressionador": "Inteligência Artificial Impressionador",
    "Lovable Impressionador": "Lovable Impressionador — Apps com IA",
    "MARMITAS FIT CONGELADA": "Marmitas Fit Congeladas — Prática e Sabor",
    "Massagem Anti-Stress - Thiago Nishida": "Massagem Anti-Stress — Método Thiago Nishida",
    "Practitioner em PNL - Otavio Castanho": "Practitioner em PNL — Otavio Castanho",
    "Projeto 60 Dias": "Projeto 60 Dias — Transformação Completa",
    "SCTEC": "SCTEC — Formação em Data & Tech",
    "Supabase Impressionador": "Supabase Impressionador — Backend Moderno",
    "TRILHA NOCODE - IA": "Trilha NoCode com Inteligência Artificial",
    "Violão Método Tríade Mais que Música-Heitor Castro": "Violão Método Tríade — Heitor Castro"
}

def clean_display_title(raw_title):
    if raw_title in TITLE_OVERRIDES:
        return TITLE_OVERRIDES[raw_title]

    title = raw_title
    # Fix common encoding glitches or weird characters
    replacements = {
        "Execuo": "Execução",
        "Anlise": "Análise",
        "Aplicaes": "Aplicações",
        "Estratgias": "Estratégias",
        "Histricos": "Históricos",
        "estticos": "estáticos",
        "nvel": "nível",
        "Especializao": "Especialização",
        "Inteligncia": "Inteligência",
        "Violo": "Violão",
        "Mtodo": "Método",
        "Trade": "Tríade",
        "Msica": "Música",
        "Mdulo": "Módulo",
        "Comear": "Começar",
        "informao": "informação",
        "udios": "áudios",
        "Nmero": "Número"
    }
    for k, v in replacements.items():
        title = title.replace(k, v)
        
    # Clean leading numbers like "01. " or "01 - " or "1. "
    title = re.sub(r'^\d+[\.\-_]\s*', '', title)
    for ext in VIDEO_EXTS | AUDIO_EXTS | DOC_EXTS:
        title = title.replace(ext, "")
        title = title.replace(ext.upper(), "")

    # Dot replacement for titles like Fit.Da.Nutri.Curso...
    if title.count(".") >= 3:
        title = title.replace(".", " ")

    return title.strip()

def clean_module_title(raw_name):
    clean = raw_name
    replacements = {
        "Mdulo": "Módulo",
        "Comear": "Começar",
        "udios": "áudios",
        "informao": "informação",
        "Execuo": "Execução"
    }
    for k, v in replacements.items():
        clean = clean.replace(k, v)
    return clean.strip()

def load_cache():
    if os.path.isfile(CACHE_PATH):
        try:
            with open(CACHE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_cache(cache_data):
    try:
        with open(CACHE_PATH, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Warning: could not save cache: {e}")

def load_manual_overrides():
    if os.path.isfile(OVERRIDES_PATH):
        try:
            with open(OVERRIDES_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: could not load overrides: {e}")
            return {}
    return {}

def probe_media_file(full_path, cache, deep=False):
    """Extracts duration and metadata with fast estimation and optional ffprobe deep inspection."""
    if not os.path.isfile(full_path):
        return 900, "15:00", {}
    
    stat = os.stat(full_path)
    cache_key = f"{full_path}:{stat.st_size}:{stat.st_mtime}"
    if cache_key in cache:
        return cache[cache_key]["duration"], cache[cache_key]["duration_formatted"], cache[cache_key].get("meta", {})

    duration = 900
    meta = {"size_bytes": stat.st_size}

    if deep:
        try:
            cmd = [
                "ffprobe", "-v", "error", "-show_entries", 
                "format=duration,size,bit_rate:stream=width,height,codec_name", 
                "-of", "json", full_path
            ]
            res = subprocess.run(cmd, capture_output=True, text=True, timeout=3)
            if res.returncode == 0:
                info = json.loads(res.stdout)
                fmt = info.get("format", {})
                if "duration" in fmt:
                    duration = max(60, int(float(fmt["duration"])))
                
                streams = info.get("streams", [])
                if streams:
                    first_v = next((s for s in streams if "width" in s), None)
                    if first_v:
                        meta["width"] = first_v.get("width")
                        meta["height"] = first_v.get("height")
                        meta["codec"] = first_v.get("codec_name")
        except Exception:
            pass
    else:
        # Fast estimation based on video bitrate (~192 KB/sec)
        if stat.st_size > 0:
            est_seconds = int(stat.st_size / (192 * 1024))
            duration = max(180, min(est_seconds, 7200))

    mins = duration // 60
    secs = duration % 60
    dur_formatted = f"{mins:02d}:{secs:02d}"

    cache[cache_key] = {
        "duration": duration,
        "duration_formatted": dur_formatted,
        "meta": meta
    }
    return duration, dur_formatted, meta

def extract_thumbnail_if_needed(video_full_path, course_id, cache):
    """Extracts a frame at ~15% into public/covers/{course_id}.jpg if not already present."""
    os.makedirs(COVERS_DIR, exist_ok=True)
    out_path = os.path.join(COVERS_DIR, f"{course_id}.jpg")
    web_cover_url = f"/covers/{course_id}.jpg"

    if os.path.isfile(out_path):
        return web_cover_url

    try:
        # Extract frame at 15s or 15% using ffmpeg
        cmd = [
            "ffmpeg", "-y", "-ss", "00:00:15", "-i", video_full_path,
            "-vframes", "1", "-q:v", "3", out_path
        ]
        subprocess.run(cmd, capture_output=True, timeout=8)
        if os.path.isfile(out_path) and os.path.getsize(out_path) > 1000:
            return web_cover_url
    except Exception:
        pass
    return None

def infer_provider(raw_folder, rel_path, is_asimov=False):
    lower = (raw_folder + " " + rel_path).lower()
    if is_asimov or "asimov" in lower:
        return "Asimov Academy"
    if "sctec" in lower:
        return "SCTEC"
    if "impressionador" in lower or "hashtag" in lower:
        return "Hashtag Treinamentos"
    if "thiago nishida" in lower:
        return "Thiago Nishida"
    if "otavio castanho" in lower or "castanho" in lower:
        return "Otavio Castanho"
    if "heitor castro" in lower:
        return "Heitor Castro"
    if "michael alves" in lower or "leilao" in lower or "leilão" in lower:
        return "Michael Alves Faria"
    if "fit da nutri" in lower or "fit.da.nutri" in lower:
        return "Fit da Nutri"
    return "Especialista Mindflix"

def classify_course(display_title, raw_name, rel_path):
    corpus = f"{display_title} {raw_name} {rel_path}".lower()
    matched_cats = []

    for cat_id, keywords in CATEGORY_RULES.items():
        if any(kw in corpus for kw in keywords):
            matched_cats.append(cat_id)

    if not matched_cats:
        matched_cats.append("programacao-dev")

    # Generate tags
    tag_candidates = [
        "IA", "Claude", "ChatGPT", "GPT", "Gemini", "n8n", "Supabase", "Python", 
        "Pandas", "Streamlit", "Trading", "Algotrading", "Backtesting", "Excel", 
        "Machine Learning", "Data Science", "Agentes", "RAG", "LLM", "Full Stack", 
        "PNL", "Saúde", "Música", "Violão", "Marmitas", "Leilão", "Soft Skills", "Lovable"
    ]
    tags = [t for t in tag_candidates if t.lower() in corpus]
    if not tags:
        tags = ["Treinamento", "Prático"]

    return matched_cats[:3], tags

def scan_library(courses_root, dry_run=False, deep=False, verbose=False, scan_drive=True, drive_folder_id=None, drive_creds=None):
    print(f"=== MINDFLIX INTELLIGENT SCANNER ===")
    print(f"Courses Root: {courses_root}")
    print(f"Mode: {'DRY RUN (Simulação de Alterações)' if dry_run else 'APPLY (Atualização do Catálogo)'}")
    if deep:
        print("Deep Media Probing: ATIVADO (ffprobe completo)")
    if scan_drive:
        print("Google Drive Sync: ATIVADO")

    cache = load_cache()
    overrides = load_manual_overrides()

    # Load previous catalog for diff calculation
    old_catalog = {}
    if os.path.isfile(OUTPUT_CATALOG):
        try:
            with open(OUTPUT_CATALOG, "r", encoding="utf-8") as f:
                old_catalog = json.load(f)
        except Exception:
            old_catalog = {}

    old_courses_map = {c["id"]: c for c in old_catalog.get("courses", [])}
    old_lessons_set = set()
    for c in old_catalog.get("courses", []):
        for m in c.get("modules", []):
            for l in m.get("lessons", []):
                old_lessons_set.add(l["id"])

    course_candidates = []

    # 1. Asimov directory courses
    asimov_dir = os.path.join(courses_root, "Asimov")
    if os.path.isdir(asimov_dir):
        for entry in sorted(os.listdir(asimov_dir), key=natural_sort_key):
            full = os.path.join(asimov_dir, entry)
            if os.path.isdir(full) and entry.lower() not in DEFAULT_IGNORE:
                course_candidates.append({
                    "raw_name": entry,
                    "rel_path": f"Asimov/{entry}",
                    "full_path": full,
                    "is_asimov": True
                })

    # 2. SCTEC directory courses
    sctec_dir = os.path.join(courses_root, "SCTEC")
    if os.path.isdir(sctec_dir):
        for entry in sorted(os.listdir(sctec_dir), key=natural_sort_key):
            full = os.path.join(sctec_dir, entry)
            if os.path.isdir(full) and entry.lower() not in DEFAULT_IGNORE:
                course_candidates.append({
                    "raw_name": entry,
                    "rel_path": f"SCTEC/{entry}",
                    "full_path": full,
                    "is_asimov": False
                })

    # 3. Root directory courses
    for entry in sorted(os.listdir(courses_root), key=natural_sort_key):
        if entry.lower() in DEFAULT_IGNORE or entry in {"Asimov", "SCTEC"}:
            continue
        full = os.path.join(courses_root, entry)
        if os.path.isdir(full):
            course_candidates.append({
                "raw_name": entry,
                "rel_path": entry,
                "full_path": full,
                "is_asimov": False
            })

    print(f"Total Course Candidates Found: {len(course_candidates)}")

    scanned_courses = []
    new_courses_count = 0
    new_lessons_count = 0
    missing_files_count = 0
    possible_duplicates = []

    for item in course_candidates:
        raw_name = item["raw_name"]
        rel_path = item["rel_path"]
        full_path = item["full_path"]
        is_asimov = item["is_asimov"]

        clean_title = clean_display_title(raw_name)
        slug = slugify(clean_title)
        course_id = f"course-{slug}"

        provider = infer_provider(raw_name, rel_path, is_asimov=is_asimov)
        categories, tags = classify_course(clean_title, raw_name, rel_path)

        # Check local cover image in folder
        local_cover = None
        for img_name in ["cover.jpg", "cover.png", "capa.jpg", "capa.png", "thumb.jpg"]:
            candidate_cover = os.path.join(full_path, img_name)
            if os.path.isfile(candidate_cover):
                local_cover = f"/api/video?path={rel_path}/{img_name}"
                break

        # Scan modules and lessons
        modules = []
        entries = sorted(os.listdir(full_path), key=natural_sort_key)
        
        # Determine if root contains files directly or subfolder modules
        has_subdirs = any(os.path.isdir(os.path.join(full_path, e)) for e in entries if e.lower() not in DEFAULT_IGNORE)
        
        first_video_for_thumb = None

        if has_subdirs:
            mod_idx = 1
            for m_entry in entries:
                if m_entry.lower() in DEFAULT_IGNORE:
                    continue
                m_full = os.path.join(full_path, m_entry)
                if not os.path.isdir(m_full):
                    continue

                clean_m_title = clean_module_title(m_entry)
                # Stable Module ID based on relative path hash/slug
                m_slug = slugify(m_entry)
                m_id = f"{course_id}-mod-{m_slug}" if m_slug else f"{course_id}-mod-{mod_idx:02d}"

                lessons = []
                m_files = sorted(os.listdir(m_full), key=natural_sort_key)
                
                # Check for sub-nested folders (like Mês 1 / Curso de Violão Popular...)
                sub_subdirs = [s for s in m_files if os.path.isdir(os.path.join(m_full, s)) and s.lower() not in DEFAULT_IGNORE]
                if sub_subdirs:
                    # Deep hierarchy: traverse sub-subdirs
                    for sub_dir in sub_subdirs:
                        sub_full = os.path.join(m_full, sub_dir)
                        sub_files = sorted(os.listdir(sub_full), key=natural_sort_key)
                        for f in sub_files:
                            f_path = os.path.join(sub_full, f)
                            f_ext = os.path.splitext(f)[1].lower()
                            if f_ext in VIDEO_EXTS or f_ext in DOC_EXTS or f_ext in AUDIO_EXTS:
                                les_slug = slugify(os.path.splitext(f)[0])
                                les_id = f"{m_id}-les-{slugify(sub_dir)}-{les_slug}"
                                dur, dur_fmt, meta = (probe_media_file(f_path, cache, deep=deep) if f_ext in VIDEO_EXTS 
                                                      else (300, "05:00", {}))
                                if f_ext in VIDEO_EXTS and not first_video_for_thumb:
                                    first_video_for_thumb = f_path

                                lessons.append({
                                    "id": les_id,
                                    "order_index": len(lessons) + 1,
                                    "raw_title": f,
                                    "display_title": clean_display_title(f),
                                    "relative_path": f"{rel_path}/{m_entry}/{sub_dir}/{f}",
                                    "type": "video" if f_ext in VIDEO_EXTS else "pdf" if f_ext == ".pdf" else "audio" if f_ext in AUDIO_EXTS else "article",
                                    "duration_seconds": dur,
                                    "duration_formatted": dur_fmt,
                                    "materials": []
                                })
                else:
                    # Standard module
                    video_files = [f for f in m_files if os.path.splitext(f)[1].lower() in VIDEO_EXTS]
                    other_files = [f for f in m_files if os.path.splitext(f)[1].lower() in DOC_EXTS or os.path.splitext(f)[1].lower() in AUDIO_EXTS]

                    for idx, v_file in enumerate(video_files, 1):
                        v_full = os.path.join(m_full, v_file)
                        v_rel = f"{rel_path}/{m_entry}/{v_file}"
                        les_slug = slugify(os.path.splitext(v_file)[0])
                        les_id = f"{m_id}-les-{les_slug}"
                        
                        dur, dur_fmt, meta = probe_media_file(v_full, cache, deep=deep)
                        if not first_video_for_thumb:
                            first_video_for_thumb = v_full

                        # Check for matching materials (strictly excluding articles and transcripts)
                        base_v_name = os.path.splitext(v_file)[0][:10]
                        mats = []
                        for o_file in other_files:
                            o_lower = o_file.lower()
                            if any(k in o_lower for k in ["artigo", "transcricao", "transcrição", "transcript", "article"]):
                                continue
                            if o_file.startswith(base_v_name):
                                mats.append({
                                    "id": f"{les_id}-mat-{len(mats)+1}",
                                    "title": clean_display_title(o_file),
                                    "type": "pdf" if o_file.endswith(".pdf") else "document",
                                    "relative_path": f"{rel_path}/{m_entry}/{o_file}"
                                })

                        lessons.append({
                            "id": les_id,
                            "order_index": idx,
                            "raw_title": v_file,
                            "display_title": clean_display_title(v_file),
                            "relative_path": v_rel,
                            "type": "video",
                            "duration_seconds": dur,
                            "duration_formatted": dur_fmt,
                            "materials": mats
                        })

                    # If no videos, treat docs/audio as lessons (excluding standalone articles and transcripts)
                    if not video_files:
                        clean_other_files = [f for f in other_files if not any(k in f.lower() for k in ["artigo", "transcricao", "transcrição", "transcript", "article"])]
                        for idx, o_file in enumerate(clean_other_files, 1):
                            o_ext = os.path.splitext(o_file)[1].lower()
                            les_slug = slugify(os.path.splitext(o_file)[0])
                            les_id = f"{m_id}-doc-{les_slug}"
                            lessons.append({
                                "id": les_id,
                                "order_index": idx,
                                "raw_title": o_file,
                                "display_title": clean_display_title(o_file),
                                "relative_path": f"{rel_path}/{m_entry}/{o_file}",
                                "type": "pdf" if o_ext == ".pdf" else "audio" if o_ext in AUDIO_EXTS else "article",
                                "duration_seconds": 300,
                                "duration_formatted": "05:00",
                                "materials": []
                            })

                if lessons:
                    modules.append({
                        "id": m_id,
                        "order_index": mod_idx,
                        "raw_title": m_entry,
                        "display_title": clean_m_title,
                        "relative_path": f"{rel_path}/{m_entry}",
                        "lessons": lessons
                    })
                    mod_idx += 1
        else:
            # Single-folder course (videos directly in root)
            video_files = [f for f in entries if os.path.splitext(f)[1].lower() in VIDEO_EXTS]
            other_files = [f for f in entries if os.path.splitext(f)[1].lower() in DOC_EXTS]
            if video_files or other_files:
                m_id = f"{course_id}-mod-01"
                lessons = []
                for idx, v_file in enumerate(video_files, 1):
                    v_full = os.path.join(full_path, v_file)
                    dur, dur_fmt, meta = probe_media_file(v_full, cache, deep=deep)
                    if not first_video_for_thumb:
                        first_video_for_thumb = v_full
                    lessons.append({
                        "id": f"{m_id}-les-{slugify(os.path.splitext(v_file)[0])}",
                        "order_index": idx,
                        "raw_title": v_file,
                        "display_title": clean_display_title(v_file),
                        "relative_path": f"{rel_path}/{v_file}",
                        "type": "video",
                        "duration_seconds": dur,
                        "duration_formatted": dur_fmt,
                        "materials": []
                    })
                modules.append({
                    "id": m_id,
                    "order_index": 1,
                    "raw_title": raw_name,
                    "display_title": "Aulas Principais",
                    "relative_path": rel_path,
                    "lessons": lessons
                })

        # Calculate totals
        total_lessons = sum(len(m["lessons"]) for m in modules)
        total_seconds = sum(l["duration_seconds"] for m in modules for l in m["lessons"])
        total_hours = total_seconds // 3600
        total_mins = (total_seconds % 3600) // 60

        # Thumbnail extraction if no local cover
        cover_image = local_cover
        if not cover_image and first_video_for_thumb and not dry_run:
            cover_image = extract_thumbnail_if_needed(first_video_for_thumb, course_id, cache)

        desc = (f"Curso prático sobre {clean_title}, ministrado por {provider}. "
                f"Contém {len(modules)} módulos e {total_lessons} aulas ({total_hours}h {total_mins:02d}m).")

        # Read description.txt if present
        desc_file = os.path.join(full_path, "description.txt")
        if os.path.isfile(desc_file):
            try:
                with open(desc_file, "r", encoding="utf-8", errors="ignore") as df:
                    file_desc = df.read().strip()
                    if file_desc:
                        desc = file_desc[:350] + "..." if len(file_desc) > 350 else file_desc
            except Exception:
                pass

        # Apply manual overrides if present
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
            "Lovable Impressionador — Apps com IA"
        ])

        # Track diffs
        if course_id not in old_courses_map:
            new_courses_count += 1
            if verbose:
                print(f"  [+] Novo Curso Detectado: {final_title} ({course_id})")

        for m in modules:
            for l in m["lessons"]:
                if l["id"] not in old_lessons_set:
                    new_lessons_count += 1

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
            "modules_count": len(modules),
            "lessons_count": total_lessons,
            "total_duration_seconds": total_seconds,
            "total_duration_formatted": f"{total_hours}h {total_mins:02d}m",
            "cover_image": final_cover,
            "is_featured": is_featured,
            "is_hidden": is_hidden,
            "classification_source": "manual" if course_id in overrides else "rule",
            "classification_confidence": 0.95 if course_id in overrides else 0.85,
            "discovered_at": old_courses_map.get(course_id, {}).get("discovered_at", datetime.now().astimezone().isoformat()),
            "last_scanned_at": datetime.now().astimezone().isoformat(),
            "modules": modules
        }
        scanned_courses.append(course_record)

    # 4. Google Drive integration and synchronization
    drive_courses = []
    if scan_drive and drive_scanner:
        creds_file = drive_scanner.resolve_credentials_path(drive_creds)
        if creds_file:
            service = drive_scanner.get_drive_service(creds_file)
            if service:
                f_id = drive_scanner.resolve_drive_folder_id(drive_folder_id)
                if f_id:
                    try:
                        drive_courses = drive_scanner.scan_google_drive(
                            service=service,
                            root_folder_id=f_id,
                            overrides=overrides,
                            clean_display_title=clean_display_title,
                            clean_module_title=clean_module_title,
                            slugify=slugify,
                            infer_provider=infer_provider,
                            classify_course=classify_course,
                            natural_sort_key=natural_sort_key,
                            covers_dir=COVERS_DIR,
                            verbose=verbose
                        )
                    except Exception as e:
                        print(f"[Drive] Erro ao sincronizar com Google Drive: {e}")
            else:
                if verbose:
                    print("[Drive] Não foi possível autenticar o serviço Google Drive.")
        else:
            if verbose:
                print("[Drive] Arquivo de credenciais do Google Drive não encontrado. Ignorando sincronização com nuvem.")

    # Merge Drive courses with local courses
    if drive_courses:
        print(f"\n[Drive] Sincronizando {len(drive_courses)} cursos do Google Drive com a biblioteca...")
        local_courses_map = {c["id"]: c for c in scanned_courses}
        final_scanned = []

        for d_c in drive_courses:
            c_id = d_c["id"]
            if c_id in local_courses_map:
                # Merge: enrich local course with Drive streaming links
                loc_c = local_courses_map[c_id]
                loc_c["drive_folder_id"] = d_c.get("drive_folder_id")
                loc_c["source"] = "hybrid"

                # Map drive lessons by slug and lower raw_title
                d_lessons_map = {}
                for dm in d_c.get("modules", []):
                    for dl in dm.get("lessons", []):
                        d_lessons_map[slugify(dl["raw_title"])] = dl
                        d_lessons_map[dl["raw_title"].lower().strip()] = dl

                for lm in loc_c.get("modules", []):
                    for ll in lm.get("lessons", []):
                        slug_k = slugify(ll["raw_title"])
                        raw_k = ll["raw_title"].lower().strip()
                        match_dl = d_lessons_map.get(slug_k) or d_lessons_map.get(raw_k)
                        if match_dl:
                            ll["drive_file_id"] = match_dl.get("drive_file_id")
                            ll["drive_url"] = match_dl.get("drive_url")
                            if not ll.get("duration_seconds") and match_dl.get("duration_seconds"):
                                ll["duration_seconds"] = match_dl.get("duration_seconds")
                                ll["duration_formatted"] = match_dl.get("duration_formatted")

                final_scanned.append(loc_c)
                del local_courses_map[c_id]
            else:
                # Course present exclusively on Google Drive
                final_scanned.append(d_c)
                if c_id not in old_courses_map:
                    new_courses_count += 1
                for dm in d_c.get("modules", []):
                    for dl in dm.get("lessons", []):
                        if dl["id"] not in old_lessons_set:
                            new_lessons_count += 1

        # Add remaining local-only courses
        for rem_c in local_courses_map.values():
            final_scanned.append(rem_c)

        scanned_courses = final_scanned

    total_modules_all = sum(c["modules_count"] for c in scanned_courses)
    total_lessons_all = sum(c["lessons_count"] for c in scanned_courses)

    # Check for missing courses (were in catalog before but now missing from disk)
    scanned_ids = {c["id"] for c in scanned_courses}
    missing_courses = []
    for old_id, old_c in old_courses_map.items():
        if old_id not in scanned_ids:
            missing_c = dict(old_c)
            missing_c["missing"] = True
            missing_courses.append(missing_c)
            missing_files_count += missing_c.get("lessons_count", 0)

    all_courses_result = scanned_courses + missing_courses

    # Build summary
    summary = {
        "last_scan_at": datetime.now().astimezone().isoformat(),
        "courses_root": courses_root,
        "total_courses": len(all_courses_result),
        "total_modules": total_modules_all,
        "total_lessons": total_lessons_all,
        "new_courses": new_courses_count,
        "new_lessons": new_lessons_count,
        "missing_courses": len(missing_courses),
        "missing_lessons": missing_files_count,
        "dry_run": dry_run,
        "status": "success"
    }

    print("\n--- RESUMO DA VARREDURA ---")
    print(f"Total Cursos: {summary['total_courses']} (+{new_courses_count} novos)")
    print(f"Total Módulos: {summary['total_modules']}")
    print(f"Total Aulas: {summary['total_lessons']} (+{new_lessons_count} novas)")
    print(f"Cursos Ausentes: {summary['missing_courses']}")

    if not dry_run:
        save_cache(cache)
        catalog_output = {
            "generated_at": datetime.now().astimezone().isoformat(),
            "courses_root": courses_root,
            "total_courses": len(all_courses_result),
            "total_modules": total_modules_all,
            "total_lessons": total_lessons_all,
            "categories": load_categories_overrides() or CATEGORIES,
            "courses": all_courses_result
        }

        with open(OUTPUT_CATALOG, "w", encoding="utf-8") as f:
            json.dump(catalog_output, f, ensure_ascii=False, indent=2)

        with open(SUMMARY_PATH, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)

        print(f"\n[OK] Catálogo gravado com sucesso em {OUTPUT_CATALOG}")
    else:
        print("\n[DRY RUN] Nenhuma alteração gravada em disco.")

    return summary

def main():
    parser = argparse.ArgumentParser(description="Mindflix Intelligent Course Library Scanner")
    parser.add_argument("--dry-run", action="store_true", help="Simula o scan sem salvar alterações no catálogo")
    parser.add_argument("--apply", action="store_true", help="Aplica as alterações e atualiza catalog.json")
    parser.add_argument("--root", type=str, help="Caminho personalizado da pasta raiz de cursos")
    parser.add_argument("--deep", action="store_true", help="Executa ffprobe completo para metadados de mídia")
    parser.add_argument("--verbose", action="store_true", help="Exibe logs detalhados de cada arquivo")
    parser.add_argument("--drive", dest="drive", action="store_true", default=True, help="Habilita sincronização com Google Drive")
    parser.add_argument("--no-drive", dest="drive", action="store_false", help="Desabilita sincronização com Google Drive")
    parser.add_argument("--drive-id", type=str, help="ID da pasta raiz no Google Drive")
    parser.add_argument("--drive-creds", type=str, help="Caminho do arquivo JSON de credenciais do Drive")
    args = parser.parse_args()

    root = os.path.abspath(args.root) if args.root else COURSES_ROOT
    dry_run = not args.apply if args.dry_run else False

    scan_library(
        root,
        dry_run=dry_run,
        deep=args.deep,
        verbose=args.verbose,
        scan_drive=args.drive,
        drive_folder_id=args.drive_id,
        drive_creds=args.drive_creds
    )

if __name__ == "__main__":
    main()
