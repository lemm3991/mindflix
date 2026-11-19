import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const catalogPath = path.resolve('src/data/catalog.json');
const durationsPath = path.resolve('src/data/video_durations.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const durations = JSON.parse(fs.readFileSync(durationsPath, 'utf8'));

const coursesRoot = 'D:\\Projetos Antigravity\\Cursos Mindflix';

function getDuration(fullPath) {
  try {
    const out = JSON.parse(execSync(`ffprobe -v error -show_entries format=duration -of json "${fullPath}"`).toString());
    return Math.round(parseFloat(out.format.duration || 0));
  } catch (e) {
    return 0;
  }
}

function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// 1. Build Ciclo da Cura
console.log('--- Processing Ciclo da Cura ---');
const curaDir = path.join(coursesRoot, 'outros', 'Ciclo da cura - Evelyn Roos');
const curaFiles = [
  '01 o direito de existir - Ferida da Rejeição.mp4',
  '02 o vazio que pede colo - Ferida do Abandono.mp4',
  '03 a rigidez que protegeu - Ferida da Injustiça.mp4',
  '04 sair do trono do controle - Ferida da Traição.mp4',
  '05 seu ritmo de volta - Ferida da humilhação.mp4'
];

let curaTotalSec = 0;
const curaLessons = [];

curaFiles.forEach((file, idx) => {
  const full = path.join(curaDir, file);
  const dur = getDuration(full);
  curaTotalSec += dur;
  const rel = 'outros/Ciclo da cura - Evelyn Roos/' + file;

  let lessonTitle = file.replace(/\.mp4$/i, '');
  if (file.startsWith('01')) lessonTitle = '01 - O Direito de Existir: Ferida da Rejeição';
  if (file.startsWith('02')) lessonTitle = '02 - O Vazio que Pede Colo: Ferida do Abandono';
  if (file.startsWith('03')) lessonTitle = '03 - A Rigidez que Protegeu: Ferida da Injustiça';
  if (file.startsWith('04')) lessonTitle = '04 - Sair do Trono do Controle: Ferida da Traição';
  if (file.startsWith('05')) lessonTitle = '05 - Seu Ritmo de Volta: Ferida da Humilhação';

  const lessonId = 'course-ciclo-da-cura-evelyn-roos-mod-01-les-' + (idx + 1).toString().padStart(2, '0');

  durations[lessonId] = dur;
  durations[rel] = dur;
  durations[file] = dur;

  curaLessons.push({
    id: lessonId,
    lesson_id: lessonId,
    title: lessonTitle,
    display_title: lessonTitle,
    order: idx + 1,
    duration_seconds: dur,
    duration_formatted: formatDuration(dur),
    video_path: rel,
    relative_path: rel,
    materials: []
  });
});

const curaCourse = {
  id: 'course-ciclo-da-cura-evelyn-roos',
  slug: 'ciclo-da-cura-evelyn-roos',
  raw_title: 'Ciclo da cura - Evelyn Roos',
  display_title: 'Ciclo da Cura — Evelyn Roos',
  detected_title: 'Ciclo da Cura',
  description: 'Jornada profunda de autoconhecimento e transformação emocional com Evelyn Roos. Compreenda e cure as 5 feridas emocionais fundamentais: rejeição, abandono, injustiça, traição e humilhação.',
  provider: 'Evelyn Roos',
  categories: ['desenvolvimento-pessoal', 'saude-bem-estar'],
  detected_categories: ['desenvolvimento-pessoal', 'saude-bem-estar'],
  tags: ['Ciclo da Cura', 'Evelyn Roos', 'Feridas Emocionais', 'Autoconhecimento', 'Inteligência Emocional', 'Psicologia', 'Cura Interior'],
  detected_tags: ['Ciclo da Cura', 'Evelyn Roos', 'Desenvolvimento Pessoal'],
  relative_path: 'outros/Ciclo da cura - Evelyn Roos',
  modules_count: 1,
  lessons_count: curaLessons.length,
  total_duration_seconds: curaTotalSec,
  total_duration_formatted: formatDuration(curaTotalSec),
  cover_image: '/covers/cover-ciclo-da-cura-evelyn-roos.jpg',
  is_featured: true,
  is_project: false,
  is_comece_por_aqui: false,
  is_hidden: false,
  classification_source: 'manual',
  source: 'outros',
  modules: [
    {
      id: 'course-ciclo-da-cura-evelyn-roos-mod-01',
      module_id: 'course-ciclo-da-cura-evelyn-roos-mod-01',
      title: 'Módulo 01 - As 5 Feridas Emocionais',
      display_title: 'Módulo 01 - As 5 Feridas Emocionais',
      order: 1,
      lessons_count: curaLessons.length,
      duration_seconds: curaTotalSec,
      duration_formatted: formatDuration(curaTotalSec),
      lessons: curaLessons
    }
  ]
};

console.log('Ciclo da Cura ready:', curaCourse.lessons_count, 'lessons,', curaCourse.total_duration_formatted);

// 2. Build Viver de Renda - Bruno Perini (Edição Clássica)
console.log('--- Processing Viver de Renda (Edição Clássica) ---');
const vrDir = path.join(coursesRoot, 'outros', 'Viver de Renda - Bruno Perini');
const vrModulesDirs = [
  '0 - BEM VINDO',
  '1 - MENTALIDADE',
  '2 - POUPANÇA, ORÇAMENTO E GASTOS'
];

let vrTotalSec = 0;
let vrTotalLessons = 0;
const vrModules = [];

vrModulesDirs.forEach((modDirName, mIdx) => {
  const fullModDir = path.join(vrDir, modDirName);
  const files = fs.readdirSync(fullModDir);
  const vidFiles = files.filter(f => /\.(mp4|mkv|webm)$/i.test(f));
  const docFiles = files.filter(f => /\.(pdf|ppt|pptx|docx|xlsx|txt)$/i.test(f));

  vidFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  let modSec = 0;
  const modLessons = [];

  vidFiles.forEach((vFile, lIdx) => {
    const fullVid = path.join(fullModDir, vFile);
    const dur = getDuration(fullVid);
    modSec += dur;
    vrTotalSec += dur;
    vrTotalLessons++;

    const relVid = 'outros/Viver de Renda - Bruno Perini/' + modDirName + '/' + vFile;
    const lessonTitle = vFile.replace(/\.mp4$/i, '');
    const lessonId = 'course-viver-de-renda-bruno-perini-mod-' + (mIdx + 1).toString().padStart(2, '0') + '-les-' + (lIdx + 1).toString().padStart(2, '0');

    durations[lessonId] = dur;
    durations[relVid] = dur;
    durations[vFile] = dur;

    // Match materials
    const vBase = vFile.replace(/\.mp4$/i, '').trim();
    const prefix = vBase.split(' ')[0];
    const matchingDocs = docFiles.filter(df => {
      const dBase = df.replace(/\.[^/.]+$/, '').trim();
      return dBase === vBase || dBase.startsWith(vBase) || df.startsWith(prefix);
    });

    const materials = matchingDocs.map(df => {
      const ext = path.extname(df).slice(1).toLowerCase();
      const matRel = 'outros/Viver de Renda - Bruno Perini/' + modDirName + '/' + df;
      return {
        id: 'mat-' + slugify(df),
        title: df.replace(/\.[^/.]+$/, ''),
        type: ext,
        relative_path: matRel
      };
    });

    modLessons.push({
      id: lessonId,
      lesson_id: lessonId,
      title: lessonTitle,
      display_title: lessonTitle,
      order: lIdx + 1,
      duration_seconds: dur,
      duration_formatted: formatDuration(dur),
      video_path: relVid,
      relative_path: relVid,
      materials: materials
    });
  });

  let modTitle = modDirName;
  if (modDirName === '0 - BEM VINDO') modTitle = 'Módulo 00 - Boas-Vindas & Introdução';
  if (modDirName === '1 - MENTALIDADE') modTitle = 'Módulo 01 - Mentalidade Financeira & Hábitos';
  if (modDirName === '2 - POUPANÇA, ORÇAMENTO E GASTOS') modTitle = 'Módulo 02 - Poupança, Orçamento e Controle de Gastos';

  vrModules.push({
    id: 'course-viver-de-renda-bruno-perini-mod-' + (mIdx + 1).toString().padStart(2, '0'),
    module_id: 'course-viver-de-renda-bruno-perini-mod-' + (mIdx + 1).toString().padStart(2, '0'),
    title: modTitle,
    display_title: modTitle,
    order: mIdx + 1,
    lessons_count: modLessons.length,
    duration_seconds: modSec,
    duration_formatted: formatDuration(modSec),
    lessons: modLessons
  });
});

const vrCourse = {
  id: 'course-viver-de-renda-bruno-perini',
  slug: 'viver-de-renda-bruno-perini',
  raw_title: 'Viver de Renda - Bruno Perini',
  display_title: 'Viver de Renda (Edição Clássica) — Bruno Perini',
  detected_title: 'Viver de Renda (Edição Clássica)',
  description: 'Curso clássico de educação financeira e investimentos ministrado por Bruno Perini. Aborda mentalidade para o sucesso, criação de metas, orçamento pessoal, eliminação de dívidas e primeiros passos na jornada da independência financeira.',
  provider: 'Bruno Perini',
  categories: ['financas-investimentos', 'desenvolvimento-pessoal'],
  detected_categories: ['financas-investimentos'],
  tags: ['Viver de Renda', 'Bruno Perini', 'Finanças', 'Investimentos', 'Mentalidade', 'Poupança', 'Orçamento', 'Metas'],
  detected_tags: ['Investimentos', 'Finanças Pessoais', 'Bruno Perini'],
  relative_path: 'outros/Viver de Renda - Bruno Perini',
  modules_count: vrModules.length,
  lessons_count: vrTotalLessons,
  total_duration_seconds: vrTotalSec,
  total_duration_formatted: formatDuration(vrTotalSec),
  cover_image: '/covers/cover-viver-de-renda-bruno-perini.jpg',
  is_featured: false,
  is_project: false,
  is_comece_por_aqui: false,
  is_hidden: false,
  classification_source: 'manual',
  source: 'outros',
  modules: vrModules
};

console.log('Viver de Renda Clássico ready:', vrCourse.lessons_count, 'lessons,', vrCourse.total_duration_formatted);

// 3. Update catalog
catalog.courses = catalog.courses.filter(c =>
  c.id !== curaCourse.id && c.slug !== curaCourse.slug &&
  c.id !== vrCourse.id && c.slug !== vrCourse.slug &&
  c.id !== 'course-outros'
);

catalog.courses.push(curaCourse);
catalog.courses.push(vrCourse);

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
fs.writeFileSync(durationsPath, JSON.stringify(durations, null, 2), 'utf8');

console.log('Successfully updated catalog.json: Total courses =', catalog.courses.length);
console.log('Successfully updated video_durations.json: Total keys =', Object.keys(durations).length);
