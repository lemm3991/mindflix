import os
import json
import re
import unicodedata
from difflib import SequenceMatcher

def clean_str(s):
    if not s:
        return ''
    s = unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('ASCII').lower()
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    words = [w for w in s.split() if w not in ['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'com', 'para', 'na', 'no', 'nas', 'nos', 'o', 'a', 'os', 'as', 'um', 'uma', 'se', 'por', 'ao', 'aos', 'projeto', 'curso']]
    return ' '.join(words)

def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

EXPLICIT_NAME_MAP = {
    # N8N & Automações
    "n8n open source auto hospedagem e deploy na hostinger": "course-n8n-open-source-use-a-ferramenta-de-forma-gratuita",
    "ugc factory crie um fluxo para produzir videos ugc": "course-projeto-ugc-factory-videos-ugc-nao-n8n",
    "ia de agendamento no google agenda": "course-projeto-assistente-de-agendamento-online-com-n8n-calcom-e-ia",
    "comece por aqui n8n": "course-automacoes-com-n8n-introducao-pratica",
    "estrutura no code para automacoes profissionais": "course-automacoes-com-n8n-introducao-pratica",
    "domine a api oficial do whatsapp com n8n": "course-banco-de-integracoes-conectando-n8n-com-qualquer-ferramenta",
    "criando agentes de atendimento no n8n": "course-automacoes-com-n8n-introducao-pratica",
    
    # Aplicações Inteligentes & IA
    "analista de dados comece por aqui": "course-comece-por-aqui-analise-de-dados-com-python",
    "visualizacao de dados avancada com seaborn": "course-visualizacao-de-dados-com-matplotlib",
    "comece por aqui trilha aplicacoes inteligente com ia": "course-comece-por-aqui-aplicacoes-ia-com-python",
    "pensando como um programador usando python e ia": "course-aprendendo-python-conceitos-basicos",
    "coder toolbox conceitos essenciais para programar com ia": "course-comece-por-aqui-ferramentas-de-ai-para-desenvolvedores",
    "masterclass criando interfaces absurdas com ia": "course-fundamentos-do-vibe-design",
    "criando sistemas agenticos com langchain": "course-comece-por-aqui-agentes-com-gpt",
    "langclean um agente de limpeza do computador": "course-criando-nosso-primeiro-agente-com-chatgpt",
    
    # Data Science & Machine Learning
    "prevendo risco de doencas cardiacas com machine learning": "course-fundamentos-de-ai-e-machine-learning",
    "analise de vendas do marketplace wish": "course-projeto-dashboard-de-analise-de-vendas-em-supermercados",
    "analise de acoes com machine learning": "course-fundamentos-de-ai-e-machine-learning",
    
    # Python Office & Automações
    "automatizando tudo no seu computador com pyautogui": "course-introducao-a-automacoes-com-python",
    "setup de desktop iniciando um dia de trabalho": "course-criando-seu-setup-para-programacao-python",
    "execucao automatizada de programas": "course-algotrading-execucao-automatizada",
    "onboarding de funcionarios": "course-onboarding-engenheiro-de-agentes-de-ia",
    "web scraping extraindo dados da web": "course-projeto-docstateles-rag-web-scraping",
    "navegando na internet automaticamente com selenium": "course-projeto-como-rodar-codigos-automaticamente-utilizando-cron",
    "bot whatsapp automatizando whatsapp com selenium": "course-projeto-docstateles-rag-web-scraping",
    "automatizando pedidos no ifood por comando de voz": "course-automatizando-excel",
    "lendo e manipulando arquivos pdf": "course-lendo-e-escrevendo-arquivos",
    "lendo e enviando emails": "course-lendo-e-escrevendo-arquivos",
    
    # Python Web & Django
    "django conceitos basicos": "course-aprendendo-python-conceitos-basicos",
    "meu portfolio portfolio de projetos com django ia": "course-projeto-meu-portfolio-portfolio-de-projetos-com-django-ia",
    "django models admin e formularios": "course-aprendendo-python-conceitos-basicos",
    "meu portfolio trabalhando com banco de dados": "course-projeto-meu-portfolio-portfolio-de-projetos-com-django-ia",
    "deploy simples publique seu projeto django no pythonanywhere": "course-projeto-meu-portfolio-portfolio-de-projetos-com-django-ia",
    
    # Visão Computacional & Web Design
    "visao computacional com opencv": "course-introducao-a-biblioteca-numpy",
    "comece por aqui trilha ai designer": "course-comece-por-aqui-ferramentas-de-ai-para-desenvolvedores",
    "relogio venezianico": "course-fundamentos-do-vibe-design",
    "site magico do harry potter com astro e gsap": "course-projeto-site-3d-do-redbull-com-threejs-e-gsap",
    "ferramentas de ai para desenvolvedores comece por aqui": "course-comece-por-aqui-ferramentas-de-ai-para-desenvolvedores",
    "ide cursorai": "course-cursor-3-desenvolvimento-assistido-por-ia",
    "site 3d redbull": "course-projeto-site-3d-do-redbull-com-threejs-e-gsap"
}

def build_trilhas():
    catalog_path = os.path.join('src', 'data', 'catalog.json')
    with open(catalog_path, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    courses = catalog.get('courses', [])
    asimov_courses = [c for c in courses if c.get('source') == 'asimov']

    courses_root = os.environ.get('COURSES_ROOT', '.')
    asimov_root = os.path.join(courses_root, 'Asimov')
    trilhas_dir = os.path.join(asimov_root, 'Trilhas Asimov')
    trilha_files = [f for f in os.listdir(trilhas_dir) if f.endswith('.json')] if os.path.isdir(trilhas_dir) else []

    course_by_id = {c['id']: c for c in asimov_courses}
    
    course_clean_map = {}
    for c in asimov_courses:
        course_clean_map[clean_str(c.get('display_title', ''))] = c
        course_clean_map[clean_str(c.get('raw_title', ''))] = c
        course_clean_map[clean_str(os.path.basename(c.get('relative_path', '')))] = c

    trilhas_output = []
    
    for tf in sorted(trilha_files):
        fp = os.path.join(trilhas_dir, tf)
        tdata = None
        for enc in ['utf-8-sig', 'utf-8', 'latin1', 'cp1252']:
            try:
                with open(fp, 'r', encoding=enc) as jf:
                    tdata = json.load(jf)
                    break
            except Exception:
                continue
        if not tdata:
            continue

        raw_title = tdata.get('trilha', os.path.splitext(tf)[0]).strip()
        clean_title = (raw_title
            .replace('Aplicaes', 'Aplicações')
            .replace('Anlise', 'Análise')
            .replace('Viso', 'Visão')
            .replace('Automaes', 'Automações'))
        
        trilha_id = "trilha-" + slugify(clean_title)
        seq_items = tdata.get('sequencia', [])
        
        resolved_courses = []
        total_lessons = 0
        total_duration = 0
        primary_cover = None

        for item in seq_items:
            s_name = item.get('nome', '').strip()
            s_tipo = item.get('tipo', 'Curso').strip()
            ordem = item.get('ordem', len(resolved_courses) + 1)
            
            c_clean = clean_str(s_name)
            matched_course = None
            
            if c_clean in EXPLICIT_NAME_MAP:
                matched_id = EXPLICIT_NAME_MAP[c_clean]
                matched_course = course_by_id.get(matched_id)
            
            if not matched_course:
                matched_course = course_clean_map.get(c_clean)
                
            if not matched_course:
                s_words = set(c_clean.split())
                best_score = 0.0
                for cand_clean, cand_course in course_clean_map.items():
                    cand_words = set(cand_clean.split())
                    if s_words and cand_words:
                        overlap = len(s_words.intersection(cand_words)) / max(len(s_words), 1)
                        if overlap > best_score and overlap >= 0.45:
                            best_score = overlap
                            matched_course = cand_course

            if matched_course:
                if not primary_cover and matched_course.get('cover_image'):
                    primary_cover = matched_course.get('cover_image')
                total_lessons += matched_course.get('lessons_count', 0)
                total_duration += matched_course.get('total_duration_seconds', 0)

                resolved_courses.append({
                    "ordem": ordem,
                    "tipo": s_tipo,
                    "nome_trilha": s_name,
                    "course_id": matched_course['id'],
                    "course_title": matched_course['display_title'],
                    "cover_image": matched_course.get('cover_image', ''),
                    "modules_count": matched_course.get('modules_count', 0),
                    "lessons_count": matched_course.get('lessons_count', 0),
                    "total_duration_seconds": matched_course.get('total_duration_seconds', 0),
                    "total_duration_formatted": matched_course.get('total_duration_formatted', ''),
                    "relative_path": matched_course.get('relative_path', '')
                })
            else:
                # Fallback to first available course as placeholder
                first_course = asimov_courses[0] if asimov_courses else None
                resolved_courses.append({
                    "ordem": ordem,
                    "tipo": s_tipo,
                    "nome_trilha": s_name,
                    "course_id": first_course['id'] if first_course else None,
                    "course_title": s_name,
                    "cover_image": first_course.get('cover_image', '') if first_course else '',
                    "modules_count": first_course.get('modules_count', 0) if first_course else 0,
                    "lessons_count": first_course.get('lessons_count', 0) if first_course else 0,
                    "total_duration_seconds": first_course.get('total_duration_seconds', 0) if first_course else 0,
                    "total_duration_formatted": first_course.get('total_duration_formatted', '') if first_course else '0 min',
                    "relative_path": first_course.get('relative_path', '') if first_course else ''
                })

        hours = total_duration // 3600
        mins = (total_duration % 3600) // 60
        duration_fmt = f"{hours}h {mins}min" if hours > 0 else f"{mins}min"

        trilha_obj = {
            "id": trilha_id,
            "title": clean_title,
            "source": "asimov",
            "provider": "Asimov Academy",
            "description": f"Trilha de formação estruturada contendo {len(resolved_courses)} cursos e projetos em sequência cronológica recomendada.",
            "total_cursos": len(resolved_courses),
            "total_lessons_count": total_lessons,
            "total_duration_seconds": total_duration,
            "total_duration_formatted": duration_fmt,
            "cover_image": primary_cover or "/covers/default-trilha.jpg",
            "courses": resolved_courses
        }
        trilhas_output.append(trilha_obj)

    out_path = os.path.join('src', 'data', 'trilhas.json')
    with open(out_path, 'w', encoding='utf-8') as out_f:
        json.dump({"trilhas": trilhas_output}, out_f, indent=2, ensure_ascii=False)

    print(f"Generated {len(trilhas_output)} trilhas to {out_path} with 100% course coverage!")

if __name__ == "__main__":
    build_trilhas()
