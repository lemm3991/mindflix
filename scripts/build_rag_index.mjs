// scripts/build_rag_index.mjs - Pre-indexes all course transcripts into a compact inverted index
import fs from 'node:fs';
import path from 'node:path';

const catalogPath = path.resolve('src/data/catalog.json');
const manifestPath = path.resolve('src/data/transcripts_manifest.json');
const outputPath = path.resolve('src/data/transcripts_index.json');

if (!fs.existsSync(catalogPath)) {
  console.error('Catalog not found at:', catalogPath);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const root = catalog.courses_root || path.resolve('..');

const STOP_WORDS = new Set([
  'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se',
  'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua',
  'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até',
  'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me',
  'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha',
  'têm', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles',
  'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'onde', 'sobre', 'posso', 'achar', 'encontrar', 'qual'
]);

function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

console.log(`[RAG Indexer] Scanning transcripts for root: ${root}`);
const startTime = Date.now();

// Build transcript manifest if needed
let manifest = [];
if (fs.existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    manifest = [];
  }
}

if (manifest.length === 0) {
  console.log('[RAG Indexer] Building transcripts manifest...');
  for (const c of catalog.courses || []) {
    for (const m of c.modules || []) {
      for (const l of m.lessons || []) {
        if (!l.relative_path) continue;
        const fullVid = path.join(root, l.relative_path);
        const dir = path.dirname(fullVid);
        const baseName = path.basename(l.relative_path, path.extname(l.relative_path));

        const candidates = [
          path.join(dir, `${baseName} - Transcricao.md`),
          path.join(dir, `${baseName}.srt`),
          path.join(dir, `${baseName}.vtt`),
          path.join(dir, `${baseName}.txt`),
          path.join(dir, `${baseName} - Artigo.md`)
        ];

        let foundPath = '';
        for (const cand of candidates) {
          if (fs.existsSync(cand)) {
            foundPath = path.relative(root, cand);
            break;
          }
        }

        if (foundPath) {
          manifest.push({
            courseId: c.id,
            courseTitle: c.display_title,
            courseProvider: c.provider || '',
            moduleId: m.id,
            moduleTitle: m.display_title,
            lessonId: l.id,
            lessonTitle: l.display_title,
            watchUrl: `/watch/${c.id}/${l.id}`,
            transcriptPath: foundPath
          });
        }
      }
    }
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
}

console.log(`[RAG Indexer] Indexing ${manifest.length} transcripts...`);

const docs = [];
const invertedIndex = new Map();

for (let i = 0; i < manifest.length; i++) {
  const item = manifest[i];
  const fullPath = path.join(root, item.transcriptPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = '';
  try {
    content = fs.readFileSync(fullPath, 'utf8');
  } catch {
    continue;
  }

  // Pre-extract chunks with timestamps
  const lines = content.split('\n');
  const chunks = [];
  let currentChunk = '';
  let currentTimestamp = undefined;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentChunk.length > 30) {
        chunks.push({
          t: currentTimestamp,
          s: currentChunk.trim().slice(0, 320)
        });
        currentChunk = '';
      }
      continue;
    }

    const tsMatch = trimmed.match(/\[(\d{2}:\d{2}(?::\d{2})?)\]/);
    if (tsMatch && !currentTimestamp) {
      currentTimestamp = tsMatch[1];
    }

    const cleanLine = trimmed
      .replace(/^#+\s*/, '')
      .replace(/^>\s*/, '')
      .replace(/\[\d{2}:\d{2}(?::\d{2})?\]/g, '')
      .trim();

    if (cleanLine) {
      currentChunk += (currentChunk ? ' ' : '') + cleanLine;
      if (currentChunk.length >= 260) {
        chunks.push({
          t: currentTimestamp,
          s: currentChunk.trim().slice(0, 320)
        });
        currentChunk = '';
        currentTimestamp = undefined;
      }
    }
  }

  if (currentChunk.length > 20) {
    chunks.push({
      t: currentTimestamp,
      s: currentChunk.trim().slice(0, 320)
    });
  }

  const docIdx = docs.length;
  docs.push({
    cId: item.courseId,
    cTitle: item.courseTitle,
    cProv: item.courseProvider,
    mId: item.moduleId,
    mTitle: item.moduleTitle,
    lId: item.lessonId,
    lTitle: item.lessonTitle,
    url: item.watchUrl,
    chunks: chunks.slice(0, 20)
  });

  const allText = [
    item.courseTitle,
    item.moduleTitle,
    item.lessonTitle,
    content
  ].join(' ');

  const norm = normalizeText(allText);
  const words = norm.split(/[^a-z0-9_-]+/).filter(w => w.length >= 2 && !STOP_WORDS.has(w));
  const uniqueWords = new Set(words);

  for (const word of uniqueWords) {
    let list = invertedIndex.get(word);
    if (!list) {
      list = [];
      invertedIndex.set(word, list);
    }
    list.push(docIdx);
  }
}

const indexObj = {
  version: 1,
  generatedAt: new Date().toISOString(),
  docs,
  index: Object.fromEntries(invertedIndex)
};

fs.writeFileSync(outputPath, JSON.stringify(indexObj), 'utf8');
const stat = fs.statSync(outputPath);
const duration = Date.now() - startTime;

console.log(`[RAG Indexer] Successfully indexed ${docs.length} transcripts in ${duration}ms!`);
console.log(`[RAG Indexer] Index size: ${(stat.size / 1024 / 1024).toFixed(2)} MB (${invertedIndex.size} keywords)`);
