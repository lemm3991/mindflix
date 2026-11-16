// scripts/scan_and_update_all_courses.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const BASE_COURSES = 'D:\\Projetos Antigravity\\Cursos Mindflix';
const CATALOG_PATH = path.resolve('src/data/catalog.json');
const TRILHAS_PATH = path.resolve('src/data/trilhas.json');
const DURATIONS_PATH = path.resolve('src/data/video_durations.json');
const COVERS_DIR = path.resolve('public/covers');

if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

// Load existing catalog and durations
const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
let durations = {};
if (fs.existsSync(DURATIONS_PATH)) {
  durations = JSON.parse(fs.readFileSync(DURATIONS_PATH, 'utf8'));
}

function slugify(text) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '-');
}

function cleanTitle(raw) {
  let t = raw.replace(/\.(mp4|mkv|webm|ts|avi|mov)$/i, '');
  // Remove trailing transcript indicators
  t = t.replace(/\s*-\s*Transcri[cç][aã]o$/i, '');
  // Remove leading numbers like "01 - ", "Aula 01 - ", "1. ", "#01 "
  t = t.replace(/^#?\d+[\.\-_]\s*/i, '');
  t = t.replace(/^Aula\s+\d+[\s\.\-_]*/i, '');
  return t.trim() || raw;
}

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function formatDuration(totalSecs) {
  const s = Math.round(totalSecs || 0);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatTotalCourseDuration(totalSecs) {
  const s = Math.round(totalSecs || 0);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  if (hrs > 0) {
    return `${hrs}h ${String(mins).padStart(2, '0')}m`;
  }
  return `${mins} min`;
}

function probeDuration(filePath, relPath) {
  const normKey = relPath.replace(/\\/g, '/');
  if (durations[normKey] && durations[normKey] > 0) {
    return durations[normKey];
  }

  try {
    const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
    const out = execSync(cmd, { encoding: 'utf8', timeout: 8000 }).trim();
    const val = parseFloat(out);
    if (!isNaN(val) && val > 0) {
      durations[normKey] = Math.round(val);
      return Math.round(val);
    }
  } catch {}

  durations[normKey] = 300; // 5 min fallback
  return 300;
}

function generateCover(videoPath, courseId) {
  const coverTarget = path.join(COVERS_DIR, `${courseId}.jpg`);
  if (fs.existsSync(coverTarget)) {
    return `/covers/${courseId}.jpg`;
  }

  try {
    const cmd = `ffmpeg -y -ss 00:00:08 -i "${videoPath}" -vframes 1 -q:v 2 "${coverTarget}"`;
    execSync(cmd, { stdio: 'ignore', timeout: 10000 });
    if (fs.existsSync(coverTarget)) {
      console.log(`[Cover Generated] ${coverTarget}`);
      return `/covers/${courseId}.jpg`;
    }
  } catch (err) {
    console.warn(`Could not generate cover for ${courseId}:`, err.message);
  }

  return `/covers/${courseId}.jpg`;
}

// Helper to recursively collect files and build module
function scanModule(dirPath, relModPath, modId, orderIdx, modTitle) {
  const files = [];
  const materials = [];

  function walk(d) {
    const entries = fs.readdirSync(d, { withFileTypes: true });
    // Sort entries naturally
    entries.sort((a, b) => naturalSort(a.name, b.name));

    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'desktop.ini') continue;
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else {
        const ext = path.extname(e.name).toLowerCase();
        if (['.mp4', '.mkv', '.webm', '.ts'].includes(ext)) {
          files.push({ full, name: e.name });
        } else if (['.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.zip'].includes(ext)) {
          // Exclude subtitle/transcription files from downloads list
          if (!e.name.toLowerCase().endsWith('.vtt') && 
              !e.name.toLowerCase().endsWith('.srt') && 
              !e.name.toLowerCase().includes('transcri')) {
            const relMat = path.relative(BASE_COURSES, full).replace(/\\/g, '/');
            materials.push({
              id: `mat-${slugify(e.name)}`,
              title: e.name.replace(ext, ''),
              type: ext.replace('.', '').toLowerCase(),
              relative_path: relMat
            });
          }
        }
      }
    }
  }

  walk(dirPath);

  // Sort video files naturally
  files.sort((a, b) => naturalSort(a.name, b.name));

  const lessons = [];
  let modSecs = 0;

  files.forEach((vf, lIdx) => {
    const lOrder = lIdx + 1;
    const lSlug = slugify(cleanTitle(vf.name));
    const lId = `${modId}-les-${String(lOrder).padStart(2, '0')}-${lSlug}`;
    const relVideo = path.relative(BASE_COURSES, vf.full).replace(/\\/g, '/');
    const durSecs = probeDuration(vf.full, relVideo);
    modSecs += durSecs;

    // Filter materials relevant to this lesson or share module materials
    const lessonBase = vf.name.replace(/\.(mp4|mkv|webm|ts)$/i, '').toLowerCase();
    const specificMats = materials.filter(m => m.title.toLowerCase().includes(lessonBase));
    const lessonMaterials = specificMats.length > 0 ? specificMats : (lIdx === 0 ? materials : []);

    lessons.push({
      id: lId,
      order_index: lOrder,
      raw_title: vf.name,
      display_title: cleanTitle(vf.name),
      relative_path: relVideo,
      type: 'video',
      duration_seconds: durSecs,
      duration_formatted: formatDuration(durSecs),
      materials: lessonMaterials
    });
  });

  return {
    id: modId,
    order_index: orderIdx,
    raw_title: path.basename(dirPath),
    display_title: modTitle || cleanTitle(path.basename(dirPath)),
    relative_path: relModPath.replace(/\\/g, '/'),
    lessons,
    total_duration_seconds: modSecs,
    total_duration_formatted: formatTotalCourseDuration(modSecs)
  };
}

// Scans an entire course folder
function scanCourse(config) {
  const {
    id,
    display_title,
    provider,
    categories,
    tags,
    description,
    rel_folder
  } = config;

  console.log(`\n========================================`);
  console.log(`[Scanning Course] ${display_title} (${rel_folder})`);
  const fullCoursePath = path.join(BASE_COURSES, rel_folder);
  if (!fs.existsSync(fullCoursePath)) {
    console.error(`Folder not found: ${fullCoursePath}`);
    return null;
  }

  const entries = fs.readdirSync(fullCoursePath, { withFileTypes: true });
  entries.sort((a, b) => naturalSort(a.name, b.name));

  const dirEntries = entries.filter(e => e.isDirectory() && !e.name.startsWith('.'));
  const rootFiles = entries.filter(e => !e.isDirectory() && e.name.match(/\.(mp4|mkv|webm|ts)$/i));

  const modules = [];
  let modCounter = 1;

  if (dirEntries.length > 0) {
    for (const d of dirEntries) {
      const modPath = path.join(fullCoursePath, d.name);
      const modSlug = slugify(cleanTitle(d.name));
      const modId = `${id}-mod-${String(modCounter).padStart(2, '0')}-${modSlug}`;
      const relMod = path.relative(BASE_COURSES, modPath).replace(/\\/g, '/');

      // Special handling for courses with a single wrapper subdirectory (e.g. "curso" or "Maestria das Unhas")
      const subDirs = fs.readdirSync(modPath, { withFileTypes: true }).filter(x => x.isDirectory() && !x.name.startsWith('.'));
      const hasSubDirs = subDirs.length > 0;
      const hasDirectVideos = fs.readdirSync(modPath).some(x => x.match(/\.(mp4|mkv|webm|ts)$/i));

      if (hasSubDirs && !hasDirectVideos) {
        subDirs.sort((a, b) => naturalSort(a.name, b.name));
        for (const sd of subDirs) {
          const subModPath = path.join(modPath, sd.name);
          const subModSlug = slugify(cleanTitle(sd.name));
          const subModId = `${id}-mod-${String(modCounter).padStart(2, '0')}-${subModSlug}`;
          const subRelMod = path.relative(BASE_COURSES, subModPath).replace(/\\/g, '/');
          const modObj = scanModule(subModPath, subRelMod, subModId, modCounter, cleanTitle(sd.name));
          if (modObj.lessons.length > 0) {
            modules.push(modObj);
            modCounter++;
          }
        }
      } else {
        const modObj = scanModule(modPath, relMod, modId, modCounter, cleanTitle(d.name));
        if (modObj.lessons.length > 0) {
          modules.push(modObj);
          modCounter++;
        }
      }
    }
  }

  // If there are also videos in root
  if (rootFiles.length > 0) {
    const rootModId = `${id}-mod-01-aulas-principais`;
    const modObj = scanModule(fullCoursePath, rel_folder, rootModId, modCounter, 'Aulas Principais');
    if (modObj.lessons.length > 0 && modules.length === 0) {
      modules.push(modObj);
    }
  }

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalSecs = modules.reduce((sum, m) => sum + m.total_duration_seconds, 0);

  // Find first video for cover generation
  let firstVideo = null;
  for (const m of modules) {
    if (m.lessons.length > 0) {
      firstVideo = path.join(BASE_COURSES, m.lessons[0].relative_path);
      break;
    }
  }

  const coverUrl = firstVideo ? generateCover(firstVideo, id) : `/covers/${id}.jpg`;

  console.log(`-> Found ${modules.length} modules, ${totalLessons} lessons, total duration: ${formatTotalCourseDuration(totalSecs)}`);

  return {
    id,
    slug: id.replace('course-', ''),
    raw_title: path.basename(fullCoursePath),
    display_title,
    detected_title: display_title,
    description: description || `Curso completo sobre ${display_title}, ministrado por ${provider}. Contém ${modules.length} módulos e ${totalLessons} aulas (${formatTotalCourseDuration(totalSecs)}).`,
    provider,
    categories,
    detected_categories: categories,
    tags,
    detected_tags: tags,
    relative_path: rel_folder.replace(/\\/g, '/'),
    modules_count: modules.length,
    lessons_count: totalLessons,
    total_duration_seconds: totalSecs,
    total_duration_formatted: formatTotalCourseDuration(totalSecs),
    cover_image: coverUrl,
    is_featured: false,
    is_project: false,
    is_comece_por_aqui: false,
    is_hidden: false,
    classification_source: 'manual',
    source: 'server',
    modules
  };
}

// COURSE DEFINITIONS TO PROCESS
const coursesToProcess = [
  {
    id: 'course-clone-ai-pro',
    display_title: 'Clone AI PRO',
    provider: 'AI LAB',
    categories: ['ia-llms', 'agentes-automacao', 'design-artes'],
    tags: ['AI LAB', 'Clonagem IA', 'HeyGen', 'ElevenLabs', 'Influencer de IA', 'Vídeo'],
    description: 'Formação completa em clonagem humana com inteligência artificial, criação de influencers digitais, roteiros virais e monetização de conteúdo pelo ecossistema AI LAB.',
    rel_folder: 'AI LAB/Clone AI PRO'
  },
  {
    id: 'course-defiverso',
    display_title: 'DefiVerso — Academia Completa de DeFi e Criptoeconomia',
    provider: 'DefiVerso',
    categories: ['negocios-financas', 'backend-infra'],
    tags: ['DeFi', 'Cripto', 'Blockchain', 'Liquidez', 'Smart Contracts', 'Web3'],
    description: 'Formação completa em Finanças Descentralizadas (DeFi), protocolos de liquidez, análise on-chain, macroeconomia, segurança e inteligência artificial aplicada ao mercado cripto.',
    rel_folder: 'outros/DefiVerso'
  },
  {
    id: 'course-efeito-fenix-massagem-tantrica-para-todos',
    display_title: 'Efeito Fênix — Massagem Tântrica para Todos',
    provider: 'outros',
    categories: ['saude-bem-estar', 'carreira-pessoal'],
    tags: ['Massagem', 'Tantra', 'Bem-Estar', 'Relacionamento'],
    description: 'Curso completo de Massagem Tântrica com técnicas, kundalini, chakras, atmosfera de atendimento e desenvolvimento pessoal.',
    rel_folder: 'outros/Efeito Fênix - Massagem Tântrica para Todos'
  },
  {
    id: 'course-ginastica-pelvica-masculina-catia-damasceno',
    display_title: 'Ginástica Pélvica Masculina — Segredo do Vigor Masculino',
    provider: 'Cátia Damasceno',
    categories: ['saude-bem-estar', 'carreira-pessoal'],
    tags: ['Saúde', 'Ginástica Pélvica', 'Cátia Damasceno', 'Vigor Masculino'],
    description: 'Treinamento completo de fortalecimento da musculatura pélvica e vigor com a especialista Cátia Damasceno.',
    rel_folder: 'outros/Ginástica Pélvica Masculina Segredo do Vigor Masculino - Cátia Damasceno-20210113T123948Z-002'
  },
  {
    id: 'course-licores-artesanais-clair-saraiva',
    display_title: 'Licores Artesanais — Clair Saraiva',
    provider: 'Clair Saraiva',
    categories: ['saude-bem-estar', 'negocios-financas'],
    tags: ['Culinária', 'Licores', 'Artesanal', 'Bebidas'],
    description: 'Curso prático de produção artesanal de licores finos, cremosos, cristalizados e técnicas de comercialização com Clair Saraiva.',
    rel_folder: 'outros/Licores artesanais - Clair Saraiva'
  },
  {
    id: 'course-maestria-das-unhas-graziela-brum',
    display_title: 'Maestria das Unhas — Graziela Brum',
    provider: 'Graziela Brum',
    categories: ['saude-bem-estar', 'negocios-financas'],
    tags: ['Beleza', 'Manicure', 'Unhas', 'Graziela Brum', 'Negócio'],
    description: 'Formação profissional completa em manicure, cutilagem, esmaltação perfeita, películas, pedrarias e marketing para manicures com Graziela Brum.',
    rel_folder: 'outros/Maestria Das Unhas - Graziela Brum-20210119T130418Z-005'
  },
  {
    id: 'course-viver-de-renda-2-0-bruno-perini',
    display_title: 'Viver de Renda 2.0 — Bruno Perini',
    provider: 'Bruno Perini',
    categories: ['negocios-financas'],
    tags: ['Investimentos', 'Finanças', 'Renda Fixa', 'Ações', 'Exterior', 'Bruno Perini'],
    description: 'O consagrado treinamento Viver de Renda 2.0 por Bruno Perini: mentalidade financeira, poupança, renda fixa, renda variável, investimento global e liberdade financeira.',
    rel_folder: 'outros/Viver.de.Renda.2.0'
  },
  {
    id: 'course-ia-na-pratica-fundamentos',
    display_title: 'IA na Prática - Fundamentos',
    provider: 'SCTEC',
    categories: ['ia-llms'],
    tags: ['IA', 'SCTEC', 'Inteligência Artificial'],
    description: 'Curso prático sobre fundamentos da inteligência artificial, teorias, setores e transformação do futuro.',
    rel_folder: 'SCTEC/IA na Prática - Fundamentos'
  },
  {
    id: 'course-fundamentos-de-trading-quantitativo',
    display_title: 'Fundamentos de Trading Quantitativo',
    provider: 'Asimov Academy',
    categories: ['negocios-financas', 'programacao-python', 'dados-ml'],
    tags: ['Trading', 'Quant', 'Python', 'Finanças', 'Asimov'],
    description: 'Fundamentos essenciais da análise quantitativa de mercados financeiros com Python.',
    rel_folder: 'Asimov/Cursos/Fundamentos de Trading Quantitativo'
  },
  {
    id: 'course-construindo-base-de-dados-para-trading',
    display_title: 'Construindo Base de Dados para Trading',
    provider: 'Asimov Academy',
    categories: ['negocios-financas', 'backend-infra', 'programacao-python'],
    tags: ['Trading', 'Bancos de Dados', 'Python', 'Finanças', 'Asimov'],
    description: 'Coleta, estruturação e armazenamento de bases de dados históricas e em tempo real para estratégias de trading.',
    rel_folder: 'Asimov/Cursos/Construindo Base de Dados para Trading'
  },
  {
    id: 'course-backtesting-avaliando-estrategias-de-trading-com-dados-historicos',
    display_title: 'Backtesting - Avaliando Estratégias de Trading com Dados Históricos',
    provider: 'Asimov Academy',
    categories: ['negocios-financas', 'dados-ml', 'programacao-python'],
    tags: ['Trading', 'Backtest', 'Python', 'Finanças', 'Asimov'],
    description: 'Como testar e validar hipóteses de investimento e algoritmos de trading contra dados históricos reais.',
    rel_folder: 'Asimov/Cursos/Backtesting - Avaliando Estratégias de Trading com Dados Históricos'
  },
  {
    id: 'course-algotrading-execucao-automatizada',
    display_title: 'Algotrading - Execução Automatizada',
    provider: 'Asimov Academy',
    categories: ['negocios-financas', 'agentes-automacao', 'programacao-python'],
    tags: ['Algotrading', 'Automação', 'Python', 'Finanças', 'Asimov'],
    description: 'Desenvolvimento e implementação de robôs de execução de ordens e trading automatizado com Python.',
    rel_folder: 'Asimov/Cursos/Algotrading - Execução Automatizada'
  }
];

// Special updater for course-especializacao-no-code to add the missing 02 module
function updateEspecializacaoNoCode(existingCourse) {
  const mod2Path = path.join(BASE_COURSES, 'Hashtag/especialização no CODE/02. Fundamentos de Low-NoCode e IA');
  if (fs.existsSync(mod2Path)) {
    const hasMod2 = existingCourse.modules.some(m => m.display_title.includes('Fundamentos de Low-NoCode'));
    if (!hasMod2) {
      console.log('\n[Updating] Adding module 02 to course-especializacao-no-code');
      const modObj = scanModule(
        mod2Path,
        'Hashtag/especialização no CODE/02. Fundamentos de Low-NoCode e IA',
        `${existingCourse.id}-mod-02-fundamentos-low-nocode-e-ia`,
        2,
        '02. Fundamentos de Low-NoCode e IA'
      );
      // Insert in order
      existingCourse.modules.push(modObj);
      existingCourse.modules.sort((a, b) => naturalSort(a.display_title, b.display_title));
      // Re-index order
      existingCourse.modules.forEach((m, idx) => { m.order_index = idx + 1; });
      existingCourse.modules_count = existingCourse.modules.length;
      existingCourse.lessons_count = existingCourse.modules.reduce((s, m) => s + m.lessons.length, 0);
      existingCourse.total_duration_seconds = existingCourse.modules.reduce((s, m) => s + m.total_duration_seconds, 0);
      existingCourse.total_duration_formatted = formatTotalCourseDuration(existingCourse.total_duration_seconds);
      console.log(`-> course-especializacao-no-code updated to ${existingCourse.lessons_count} lessons!`);
    }
  }
}

// EXECUTE
console.log('Starting full catalog update with new courses...');
let updatedCourses = [...catalog.courses];

for (const cfg of coursesToProcess) {
  const scanned = scanCourse(cfg);
  if (scanned && scanned.lessons_count > 0) {
    const idx = updatedCourses.findIndex(c => c.id === scanned.id);
    if (idx >= 0) {
      console.log(`[Replacing existing entry] ${scanned.id}`);
      updatedCourses[idx] = scanned;
    } else {
      console.log(`[Adding new course entry] ${scanned.id}`);
      updatedCourses.push(scanned);
    }
  }
}

// Update especialização no code
const noCodeCourse = updatedCourses.find(c => c.id === 'course-especializacao-no-code');
if (noCodeCourse) {
  updateEspecializacaoNoCode(noCodeCourse);
}

// Update catalog stats
catalog.courses = updatedCourses;
catalog.total_courses = updatedCourses.length;
catalog.updated_at = new Date().toISOString();

fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`\nSuccessfully wrote ${CATALOG_PATH} with ${updatedCourses.length} courses!`);

// Save updated video durations
fs.writeFileSync(DURATIONS_PATH, JSON.stringify(durations, null, 2), 'utf8');
console.log(`Successfully saved ${DURATIONS_PATH} with ${Object.keys(durations).length} durations!`);

// Update trilhas.json
console.log('\nUpdating trilhas.json...');
const trilhasData = JSON.parse(fs.readFileSync(TRILHAS_PATH, 'utf8'));
const trilhasList = trilhasData.trilhas || trilhasData;

// 1. Trilha Clone AI PRO
const cloneCourse = updatedCourses.find(c => c.id === 'course-clone-ai-pro');
if (cloneCourse && !trilhasList.some(t => t.id === 'trilha-clone-ai-pro')) {
  trilhasList.push({
    id: 'trilha-clone-ai-pro',
    title: 'Clone AI PRO',
    source: 'ailab',
    provider: 'AI LAB',
    description: 'Formação completa em clonagem humana com inteligência artificial, criação de influencers digitais, roteiros virais e monetização de conteúdo.',
    total_cursos: 1,
    total_lessons_count: cloneCourse.lessons_count,
    total_duration_seconds: cloneCourse.total_duration_seconds,
    total_duration_formatted: cloneCourse.total_duration_formatted,
    cover_image: cloneCourse.cover_image,
    courses: [
      {
        ordem: 1,
        tipo: 'Curso',
        nome_trilha: 'Clone AI PRO',
        course_id: cloneCourse.id,
        course_title: cloneCourse.display_title,
        cover_image: cloneCourse.cover_image,
        modules_count: cloneCourse.modules_count,
        lessons_count: cloneCourse.lessons_count,
        total_duration_seconds: cloneCourse.total_duration_seconds,
        total_duration_formatted: cloneCourse.total_duration_formatted,
        relative_path: cloneCourse.relative_path
      }
    ]
  });
  console.log('[Trilha Added] trilha-clone-ai-pro');
}

// 2. Trilha DefiVerso
const defiCourse = updatedCourses.find(c => c.id === 'course-defiverso');
if (defiCourse && !trilhasList.some(t => t.id === 'trilha-defiverso')) {
  trilhasList.push({
    id: 'trilha-defiverso',
    title: 'DefiVerso — Cripto & DeFi',
    source: 'outros',
    provider: 'DefiVerso',
    description: 'Formação completa em Finanças Descentralizadas (DeFi), protocolos de liquidez, análise on-chain, macroeconomia, segurança e inteligência artificial no ecossistema cripto.',
    total_cursos: 1,
    total_lessons_count: defiCourse.lessons_count,
    total_duration_seconds: defiCourse.total_duration_seconds,
    total_duration_formatted: defiCourse.total_duration_formatted,
    cover_image: defiCourse.cover_image,
    courses: [
      {
        ordem: 1,
        tipo: 'Curso',
        nome_trilha: 'DefiVerso',
        course_id: defiCourse.id,
        course_title: defiCourse.display_title,
        cover_image: defiCourse.cover_image,
        modules_count: defiCourse.modules_count,
        lessons_count: defiCourse.lessons_count,
        total_duration_seconds: defiCourse.total_duration_seconds,
        total_duration_formatted: defiCourse.total_duration_formatted,
        relative_path: defiCourse.relative_path
      }
    ]
  });
  console.log('[Trilha Added] trilha-defiverso');
}

// 3. Update trilha-trading-quantitativo
const quantTrilha = trilhasList.find(t => t.id === 'trilha-trading-quantitativo');
if (quantTrilha) {
  let totalL = 0;
  let totalS = 0;
  quantTrilha.courses = quantTrilha.courses.map(item => {
    const found = updatedCourses.find(c => c.id === item.course_id);
    if (found) {
      totalL += found.lessons_count;
      totalS += found.total_duration_seconds;
      return {
        ...item,
        modules_count: found.modules_count,
        lessons_count: found.lessons_count,
        total_duration_seconds: found.total_duration_seconds,
        total_duration_formatted: found.total_duration_formatted
      };
    }
    return item;
  });
  quantTrilha.total_lessons_count = totalL;
  quantTrilha.total_duration_seconds = totalS;
  quantTrilha.total_duration_formatted = formatTotalCourseDuration(totalS);
  console.log(`[Trilha Updated] trilha-trading-quantitativo (${totalL} aulas, ${quantTrilha.total_duration_formatted})`);
}

if (trilhasData.trilhas) {
  trilhasData.trilhas = trilhasList;
}
fs.writeFileSync(TRILHAS_PATH, JSON.stringify(trilhasData, null, 2), 'utf8');
console.log(`Successfully wrote ${TRILHAS_PATH}!`);

console.log('\n=== ALL DONE! ===');
