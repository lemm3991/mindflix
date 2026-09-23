import os
import json
import re
import unicodedata

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CATALOG_PATH = os.path.join(BASE_DIR, "src", "data", "catalog.json")
TRILHAS_PATH = os.path.join(BASE_DIR, "src", "data", "trilhas.json")
AI_LAB_ROOT = "G:/Meu Drive/Cursos/Cursos Mindflix/AI LAB"

def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

def clean_display_title(raw_title):
    title = raw_title
    replacements = {
        "Execuo": "Execução", "Anlise": "Análise", "Aplicaes": "Aplicações",
        "Estratgias": "Estratégias", "Histricos": "Históricos", "estticos": "estáticos",
        "nvel": "nível", "Especializao": "Especialização", "Inteligncia": "Inteligência",
        "Violo": "Violão", "Mtodo": "Método", "Trade": "Tríade", "Msica": "Música",
        "Mdulo": "Módulo", "Comear": "Começar", "informao": "informação",
        "udios": "áudios", "Nmero": "Número", "Ciuncia": "Ciência", "Formaao": "Formação",
        "Pus": "Pós", "Produao": "Produção", "FotogrUfico": "Fotográfico", "Apresentaao": "Apresentação",
        "Bunas": "Bônus", "Introduao": "Introdução"
    }
    for k, v in replacements.items():
        title = title.replace(k, v)
    title = re.sub(r'^\d+[\.\-_]\s*', '', title)
    title = title.replace(".mp4", "").replace(".mkv", "").replace(".webm", "")
    return title.strip()

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

def norm(s):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', s).lower())

def scan_folder_as_course(full_path, rel_path, display_name):
    slug = slugify(display_name)
    course_id = f"course-{slug}"
    
    modules = []
    if os.path.exists(full_path):
        mod_entries = sorted([m for m in os.listdir(full_path) if os.path.isdir(os.path.join(full_path, m))], key=natural_sort_key)
        mod_idx = 1
        for m_entry in mod_entries:
            m_full = os.path.join(full_path, m_entry)
            clean_m_name = clean_display_title(m_entry)
            m_id = f"{course_id}-mod-{mod_idx:02d}"
            
            lessons = []
            l_idx = 1
            for root_dir, dirs, files in os.walk(m_full):
                dirs.sort(key=natural_sort_key)
                files_sorted = sorted([f for f in files if f.lower().endswith(('.mp4', '.mkv', '.webm'))], key=natural_sort_key)
                for vf in files_sorted:
                    vf_full = os.path.join(root_dir, vf)
                    sub_rel = os.path.relpath(vf_full, full_path).replace("\\", "/")
                    vf_rel = f"{rel_path}/{sub_rel}"
                    lesson_id = f"{m_id}-les-{l_idx:02d}"
                    lessons.append({
                        "id": lesson_id,
                        "order_index": l_idx,
                        "raw_title": vf,
                        "display_title": clean_display_title(vf),
                        "relative_path": vf_rel,
                        "type": "video",
                        "duration_seconds": 370,
                        "duration_formatted": "06:10",
                        "materials": []
                    })
                    l_idx += 1
                
            if lessons:
                modules.append({
                    "id": m_id,
                    "order_index": mod_idx,
                    "raw_title": m_entry,
                    "display_title": clean_m_name,
                    "relative_path": f"{rel_path}/{m_entry}",
                    "lessons": lessons
                })
                mod_idx += 1

    total_lessons = sum(len(m["lessons"]) for m in modules)
    total_secs = sum(l["duration_seconds"] for m in modules for l in m["lessons"])
    hrs = total_secs // 3600
    mins = (total_secs % 3600) // 60
    
    return {
        "id": course_id,
        "slug": slug,
        "raw_title": os.path.basename(full_path),
        "display_title": display_name,
        "description": f"Curso de {display_name} integrante do ecossistema AI LAB.",
        "provider": "AI LAB",
        "categories": ["ia", "formacoes-trilhas"],
        "tags": ["AI LAB", "IA", "Design", "Artista AI"],
        "relative_path": rel_path,
        "modules_count": len(modules),
        "lessons_count": total_lessons,
        "total_duration_seconds": total_secs,
        "total_duration_formatted": f"{hrs}h {mins:02d}m" if hrs > 0 else f"{mins} min",
        "modules": modules,
        "is_hidden": False,
        "source": "ailab"
    }

def main():
    print("Building AI LAB Trilhas & Courses...", flush=True)

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        catalog_data = json.load(f)

    courses = catalog_data.get("courses", [])

    # Identify existing subfolders of Criando influencer digital and mark them hidden
    for c in courses:
        rel = (c.get("relative_path") or "").replace("\\", "/")
        if rel.startswith("AI LAB/0") or rel.startswith("AI LAB/1"):
            c["is_hidden"] = True

    # Scan Artista AI subfolders
    artista_ai_dir = os.path.join(AI_LAB_ROOT, "Artista AI")
    artista_subcourses = [
        ("Color Grading Cinematográfico", False),
        ("Formação Artista AI", False),
        ("Photoshop Starter", False),
        ("Pós Produção de CGI", False),
        ("Retoque de Produto", False),
        ("Retoque Fotográfico", False),
        ("Apresentação", True),
        ("Bônus - Exclusivo", True)
    ]

    entries = os.listdir(artista_ai_dir) if os.path.exists(artista_ai_dir) else []
    new_artista_courses = []
    for display_name, is_hidden in artista_subcourses:
        target_norm = norm(display_name)
        match_folder = next((e for e in entries if norm(e) == target_norm), None)
        if not match_folder:
            print(f"Warning: could not find folder for {display_name}")
            continue
        
        cand_path = os.path.join(artista_ai_dir, match_folder)
        rel_p = f"AI LAB/Artista AI/{match_folder}"
        c_obj = scan_folder_as_course(cand_path, rel_p, display_name)
        c_obj["is_hidden"] = is_hidden
        
        # Remove existing course with same ID if any
        courses = [c for c in courses if c["id"] != c_obj["id"]]
        courses.append(c_obj)
        if not is_hidden:
            new_artista_courses.append(c_obj)

    catalog_data["courses"] = courses
    catalog_data["total_courses"] = len(courses)

    with open(CATALOG_PATH, "w", encoding="utf-8") as f:
        json.dump(catalog_data, f, ensure_ascii=False, indent=2)
    print(f"Updated {CATALOG_PATH} with Artista AI courses!")

    # Build / Update trilhas.json
    with open(TRILHAS_PATH, "r", encoding="utf-8") as f:
        trilhas_data = json.load(f)

    existing_trilhas = trilhas_data.get("trilhas", [])

    # 1. Trilha Criando influencer digital
    influencer_course = next((c for c in courses if c["id"] == "course-criando-influencer-digital"), None)
    trilha_influencer = {
        "id": "trilha-criando-influencer-digital",
        "title": "Criando Influencer Digital",
        "source": "ailab",
        "provider": "AI LAB",
        "description": "Trilha completa de formação em criação e monetização de influenciadores virtuais de IA do zero com ComfyUI, ElevenLabs, Claude Code e ferramentas avançadas.",
        "total_cursos": 1,
        "total_lessons_count": influencer_course.get("lessons_count", 75) if influencer_course else 75,
        "total_duration_seconds": influencer_course.get("total_duration_seconds", 27000) if influencer_course else 27000,
        "total_duration_formatted": influencer_course.get("total_duration_formatted", "7h 30min") if influencer_course else "7h 30min",
        "cover_image": "/covers/course-criando-influencer-digital.jpg",
        "courses": [
            {
                "ordem": 1,
                "tipo": "Trilha",
                "nome_trilha": "Criando Influencer Digital",
                "course_id": "course-criando-influencer-digital",
                "course_title": "Criando Influencer Digital — Formação Completa",
                "cover_image": "/covers/course-criando-influencer-digital.jpg",
                "modules_count": influencer_course.get("modules_count", 16) if influencer_course else 16,
                "lessons_count": influencer_course.get("lessons_count", 75) if influencer_course else 75,
                "total_duration_seconds": influencer_course.get("total_duration_seconds", 27000) if influencer_course else 27000,
                "total_duration_formatted": influencer_course.get("total_duration_formatted", "7h 30min") if influencer_course else "7h 30min",
                "relative_path": "AI LAB/Criando influencer digital"
            }
        ]
    }

    # 2. Trilha Artista AI
    artista_courses_list = [c for c in courses if (c.get("relative_path") or "").startswith("AI LAB/Artista AI/")]
    artista_courses_list.sort(key=lambda c: c["display_title"])
    
    trilha_artista_items = []
    for idx, c in enumerate(artista_courses_list, 1):
        trilha_artista_items.append({
            "ordem": idx,
            "tipo": "Curso",
            "nome_trilha": c["display_title"],
            "course_id": c["id"],
            "course_title": c["display_title"],
            "cover_image": f"/covers/{c['id']}.jpg",
            "modules_count": c.get("modules_count", 1),
            "lessons_count": c.get("lessons_count", 1),
            "total_duration_seconds": c.get("total_duration_seconds", 0),
            "total_duration_formatted": c.get("total_duration_formatted", ""),
            "relative_path": c.get("relative_path", "")
        })

    tot_artista_lessons = sum(c["lessons_count"] for c in artista_courses_list)
    tot_artista_secs = sum(c["total_duration_seconds"] for c in artista_courses_list)
    a_hrs = tot_artista_secs // 3600
    a_mins = (tot_artista_secs % 3600) // 60

    trilha_artista = {
        "id": "trilha-artista-ai",
        "title": "Artista AI",
        "source": "ailab",
        "provider": "AI LAB",
        "description": "Trilha de formação completa para Artistas Visuais com IA: Formação Artista AI, Color Grading Cinematográfico, Photoshop Starter, Pós-Produção de CGI, Retoque de Produto e Retoque Fotográfico High-End.",
        "total_cursos": len(trilha_artista_items),
        "total_lessons_count": tot_artista_lessons,
        "total_duration_seconds": tot_artista_secs,
        "total_duration_formatted": f"{a_hrs}h {a_mins}min" if a_hrs > 0 else f"{a_mins}min",
        "cover_image": "/covers/trilha-artista-ai.jpg",
        "courses": trilha_artista_items
    }

    # Replace or append in trilhas_data
    final_trilhas = [t for t in existing_trilhas if t["id"] not in ["trilha-criando-influencer-digital", "trilha-artista-ai"]]
    final_trilhas.insert(0, trilha_artista)
    final_trilhas.insert(0, trilha_influencer)

    trilhas_data["trilhas"] = final_trilhas

    with open(TRILHAS_PATH, "w", encoding="utf-8") as f:
        json.dump(trilhas_data, f, ensure_ascii=False, indent=2)
    print(f"Updated {TRILHAS_PATH} with AI LAB Trilhas (Criando influencer digital & Artista AI)!")

if __name__ == "__main__":
    main()
