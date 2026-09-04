// src/lib/rag.ts - Transcripts RAG Engine & AI Subject Search
import fs from 'node:fs';
import path from 'node:path';

export interface TranscriptEntry {
  courseId: string;
  courseTitle: string;
  courseProvider: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  watchUrl: string;
  transcriptPath: string;
}

export interface TranscriptMatch {
  courseId: string;
  courseTitle: string;
  courseProvider: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  watchUrl: string;
  timestamp?: string;
  snippet: string;
  highlightWords: string[];
  score: number;
}

export interface AiSearchResponse {
  query: string;
  summary: string;
  matches: TranscriptMatch[];
  totalMatches: number;
  hasGeminiKey: boolean;
  searchTimeMs: number;
}

const STOP_WORDS = new Set([
  'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se',
  'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua',
  'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até',
  'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me',
  'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha',
  'têm', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles',
  'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'onde', 'sobre', 'posso', 'achar', 'encontrar', 'qual'
]);

let cachedEntries: TranscriptEntry[] | null = null;
let coursesRootCache: string = '';

export function getCoursesRoot(): string {
  if (coursesRootCache) return coursesRootCache;
  const catalogPath = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');
  if (fs.existsSync(catalogPath)) {
    try {
      const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      coursesRootCache = catalog.courses_root || path.resolve(process.cwd(), '..');
    } catch {
      coursesRootCache = path.resolve(process.cwd(), '..');
    }
  } else {
    coursesRootCache = path.resolve(process.cwd(), '..');
  }
  return coursesRootCache;
}

/**
 * Builds or retrieves the in-memory transcript catalog manifest.
 */
export function getTranscriptManifest(): TranscriptEntry[] {
  if (cachedEntries && cachedEntries.length > 0) {
    return cachedEntries;
  }

  const manifestPath = path.resolve(process.cwd(), 'src', 'data', 'transcripts_manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      cachedEntries = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (cachedEntries && cachedEntries.length > 0) {
        return cachedEntries;
      }
    } catch {
      // Fall through to rebuild
    }
  }

  const catalogPath = path.resolve(process.cwd(), 'src', 'data', 'catalog.json');
  if (!fs.existsSync(catalogPath)) return [];

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const root = getCoursesRoot();
  const entries: TranscriptEntry[] = [];

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
          entries.push({
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

  cachedEntries = entries;

  // Persist manifest for zero-startup overhead
  try {
    fs.writeFileSync(manifestPath, JSON.stringify(entries, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not cache transcripts manifest:', err);
  }

  return entries;
}

export interface IndexedChunk {
  t?: string;
  s: string;
}

export interface IndexedDoc {
  cId: string;
  cTitle: string;
  cProv: string;
  mId: string;
  mTitle: string;
  lId: string;
  lTitle: string;
  url: string;
  chunks: IndexedChunk[];
}

export interface TranscriptsIndexData {
  version: number;
  generatedAt: string;
  docs: IndexedDoc[];
  index: Record<string, number[]>;
}

let cachedIndexData: TranscriptsIndexData | null = null;

export function getTranscriptsIndex(): TranscriptsIndexData | null {
  if (cachedIndexData) {
    return cachedIndexData;
  }

  const indexPath = path.resolve(process.cwd(), 'src', 'data', 'transcripts_index.json');
  if (fs.existsSync(indexPath)) {
    try {
      cachedIndexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      return cachedIndexData;
    } catch (err) {
      console.warn('Could not load transcripts_index.json:', err);
    }
  }

  return null;
}

/**
 * Normalizes text for semantic search.
 */
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Performs ultra-fast semantic & keyword retrieval over transcript index (<15ms).
 */
export function searchSubjectInTranscripts(query: string, maxResults = 8): { matches: TranscriptMatch[]; totalMatches: number } {
  const normQuery = normalizeText(query);
  const rawWords = normQuery.split(/[^a-z0-9_-]+/).filter(w => w.length >= 2);
  const keywords = rawWords.filter(w => !STOP_WORDS.has(w));
  
  if (keywords.length === 0) {
    return { matches: [], totalMatches: 0 };
  }

  const indexData = getTranscriptsIndex();

  // High-performance Inverted Index Path (In-Memory RAM)
  if (indexData && indexData.docs && indexData.index) {
    const docs = indexData.docs;
    const invertedMap = indexData.index;

    // docIdx -> candidate info
    const candidateMap = new Map<number, { matchedKeywords: Set<string>; score: number }>();

    for (const kw of keywords) {
      const directDocs = invertedMap[kw] || [];
      for (const docIdx of directDocs) {
        let entry = candidateMap.get(docIdx);
        if (!entry) {
          entry = { matchedKeywords: new Set<string>(), score: 0 };
          candidateMap.set(docIdx, entry);
        }
        entry.matchedKeywords.add(kw);
        entry.score += 20;
      }

      // If keyword length >= 4 and direct matches are scarce, check prefix matches
      if (kw.length >= 4 && directDocs.length < 5) {
        for (const otherKey in invertedMap) {
          if (otherKey !== kw && otherKey.startsWith(kw)) {
            const prefixDocs = invertedMap[otherKey];
            for (const docIdx of prefixDocs.slice(0, 15)) {
              let entry = candidateMap.get(docIdx);
              if (!entry) {
                entry = { matchedKeywords: new Set<string>(), score: 0 };
                candidateMap.set(docIdx, entry);
              }
              entry.matchedKeywords.add(kw);
              entry.score += 10;
            }
          }
        }
      }
    }

    const minRequired = keywords.length >= 3 ? 2 : 1;
    const scoredCandidates: Array<{ doc: IndexedDoc; score: number; highlightWords: string[] }> = [];

    for (const [docIdx, { matchedKeywords, score }] of candidateMap.entries()) {
      if (matchedKeywords.size < minRequired) continue;

      const doc = docs[docIdx];
      if (!doc) continue;

      let totalScore = score;
      const highlightWords = Array.from(matchedKeywords);

      const normLesson = normalizeText(doc.lTitle);
      const normModule = normalizeText(doc.mTitle);
      const normCourse = normalizeText(doc.cTitle);

      for (const kw of keywords) {
        if (normLesson.includes(kw)) {
          totalScore += 35;
          highlightWords.push(kw);
        }
        if (normModule.includes(kw)) {
          totalScore += 20;
          highlightWords.push(kw);
        }
        if (normCourse.includes(kw)) {
          totalScore += 12;
          highlightWords.push(kw);
        }
      }

      // Bonus for matching all search keywords
      if (matchedKeywords.size === keywords.length) {
        totalScore += 50;
      }

      scoredCandidates.push({
        doc,
        score: totalScore,
        highlightWords: Array.from(new Set(highlightWords))
      });
    }

    scoredCandidates.sort((a, b) => b.score - a.score);

    const matches: TranscriptMatch[] = scoredCandidates.slice(0, maxResults).map(({ doc, score, highlightWords }) => {
      // Find chunk with highest keyword concentration
      let bestChunk = doc.chunks[0] || { s: `${doc.cTitle} - ${doc.lTitle}`, t: undefined };
      let maxHits = -1;

      for (const ch of doc.chunks) {
        const normChunk = normalizeText(ch.s);
        let hits = 0;
        for (const kw of highlightWords) {
          if (normChunk.includes(kw)) hits++;
        }
        if (hits > maxHits) {
          maxHits = hits;
          bestChunk = ch;
        }
      }

      return {
        courseId: doc.cId,
        courseTitle: doc.cTitle,
        courseProvider: doc.cProv,
        moduleId: doc.mId,
        moduleTitle: doc.mTitle,
        lessonId: doc.lId,
        lessonTitle: doc.lTitle,
        watchUrl: doc.url,
        timestamp: bestChunk.t,
        snippet: bestChunk.s,
        highlightWords,
        score
      };
    });

    return {
      matches,
      totalMatches: scoredCandidates.length
    };
  }

  // Resilient Fallback to disk scan if index is missing
  const manifest = getTranscriptManifest();
  const root = getCoursesRoot();
  const matches: TranscriptMatch[] = [];

  for (const item of manifest) {
    const fullTranscriptPath = path.join(root, item.transcriptPath);
    if (!fs.existsSync(fullTranscriptPath)) continue;

    let text = '';
    try {
      text = fs.readFileSync(fullTranscriptPath, 'utf8');
    } catch {
      continue;
    }

    const normText = normalizeText(text);
    const normLesson = normalizeText(item.lessonTitle);
    const normModule = normalizeText(item.moduleTitle);
    const normCourse = normalizeText(item.courseTitle);

    let score = 0;
    let termsMatchedCount = 0;
    const highlightWords: string[] = [];

    for (const kw of keywords) {
      let kwScore = 0;
      if (normLesson.includes(kw)) {
        kwScore += 25;
        highlightWords.push(kw);
      }
      if (normModule.includes(kw)) {
        kwScore += 15;
        highlightWords.push(kw);
      }
      if (normCourse.includes(kw)) {
        kwScore += 10;
        highlightWords.push(kw);
      }

      const count = (normText.match(new RegExp(`\\b${kw}`, 'g')) || []).length;
      if (count > 0) {
        kwScore += Math.min(count * 2.5, 30);
        highlightWords.push(kw);
      }

      if (kwScore > 0) {
        termsMatchedCount++;
        score += kwScore;
      }
    }

    const minRequired = keywords.length >= 3 ? 2 : 1;
    if (termsMatchedCount < minRequired || score <= 0) continue;

    if (termsMatchedCount === keywords.length) {
      score += 40;
    }

    let bestWindowStart = 0;
    let maxLocalHits = 0;
    const windowSize = 260;

    for (const kw of keywords) {
      let pos = normText.indexOf(kw);
      while (pos !== -1 && pos < normText.length) {
        const winStart = Math.max(0, pos - 80);
        const winText = normText.slice(winStart, winStart + windowSize);
        let localHits = 0;
        for (const otherKw of keywords) {
          if (winText.includes(otherKw)) localHits++;
        }
        if (localHits > maxLocalHits) {
          maxLocalHits = localHits;
          bestWindowStart = winStart;
        }
        pos = normText.indexOf(kw, pos + windowSize);
      }
    }

    const rawSnippet = text.slice(bestWindowStart, bestWindowStart + windowSize);
    const tsMatch = rawSnippet.match(/\[(\d{2}:\d{2}(?::\d{2})?)\]/);
    const timestamp = tsMatch ? tsMatch[1] : undefined;

    const cleanSnippet = rawSnippet
      .replace(/#+.*?\n/g, ' ')
      .replace(/>.*?\n/g, ' ')
      .replace(/\[\d{2}:\d{2}(?::\d{2})?\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    matches.push({
      courseId: item.courseId,
      courseTitle: item.courseTitle,
      courseProvider: item.courseProvider,
      moduleId: item.moduleId,
      moduleTitle: item.moduleTitle,
      lessonId: item.lessonId,
      lessonTitle: item.lessonTitle,
      watchUrl: item.watchUrl,
      timestamp,
      snippet: cleanSnippet.length > 20 ? cleanSnippet : text.slice(0, 180).replace(/\s+/g, ' ').trim(),
      highlightWords: Array.from(new Set(highlightWords)),
      score
    });
  }

  matches.sort((a, b) => b.score - a.score);
  return {
    matches: matches.slice(0, maxResults),
    totalMatches: matches.length
  };
}

/**
 * Synthesizes AI Summary using Gemini API or Structured Local Digest.
 */
export async function synthesizeAiAnswer(
  query: string,
  matches: TranscriptMatch[],
  geminiApiKey?: string
): Promise<{ summary: string; hasGeminiKey: boolean }> {
  const activeKey = geminiApiKey || process.env.GEMINI_API_KEY || process.env.PUBLIC_GEMINI_API_KEY;

  if (activeKey && matches.length > 0) {
    try {
      const topContext = matches.slice(0, 5).map((m, idx) => `
[Aula ${idx + 1}]
Curso: ${m.courseTitle} (${m.courseProvider})
Módulo: ${m.moduleTitle}
Aula: ${m.lessonTitle}
${m.timestamp ? `Tempo: ${m.timestamp}` : ''}
Trecho da transcrição: "${m.snippet}"
`).join('\n');

      const prompt = `Você é o assistente inteligente de busca e tutoria do Mindflix.
O usuário perguntou sobre o acervo de cursos: "${query}".
Abaixo estão os trechos mais relevantes encontrados nas transcrições das aulas reais do acervo:

${topContext}

Sua tarefa:
1. Responda diretamente e de forma organizada à dúvida do usuário em 2 a 3 parágrafos objetivos.
2. Diga com clareza em quais cursos e módulos esse assunto é abordado com maior profundidade.
3. Indique qual é a aula ideal recomendada para ele começar a assistir agora.
4. Mantenha um tom profissional, acolhedor e direto ao ponto. Use negrito nos pontos-chave. Não crie links HTML ou markdown que não foram passados.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 600
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText) {
          return { summary: aiText.trim(), hasGeminiKey: true };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local synthesis:', err);
    }
  }

  // Local structured synthesis fallback
  if (matches.length === 0) {
    return {
      summary: `Não localizamos nenhuma menção direta ao tema **"${query}"** nas transcrições do acervo. Tente pesquisar por termos sinônimos ou conceitos relacionados.`,
      hasGeminiKey: Boolean(activeKey)
    };
  }

  const primary = matches[0];
  const distinctCourses = Array.from(new Set(matches.map(m => m.courseTitle)));
  const courseListStr = distinctCourses.slice(0, 3).map(c => `**${c}**`).join(', ');

  const summary = `O tema **"${query}"** é abordado diretamente no seu acervo, principalmente no curso ${courseListStr}.

A melhor aula para começar a estudar este conteúdo é **"${primary.lessonTitle}"** (do curso **${primary.courseTitle}**, módulo *${primary.moduleTitle}*)${primary.timestamp ? `, onde o assunto é detalhado a partir do minuto **${primary.timestamp}**` : ''}.

Abaixo você encontra as aulas com as citações e trechos exatos extraídos das transcrições para assistir diretamente no player:`;

  return { summary, hasGeminiKey: Boolean(activeKey) };
}
