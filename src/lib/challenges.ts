// src/lib/challenges.ts - Engine for AI Lesson and Module Challenges
import fs from 'node:fs';
import path from 'node:path';
import { getTranscriptManifest, getCoursesRoot } from './rag';
import { getCourseById } from './catalog';

export interface ChallengeQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  sourceLessonTitle?: string;
}

export interface ChallengeData {
  title: string;
  subtitle: string;
  mode: 'lesson' | 'module';
  count: number;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  hasTranscript: boolean;
  questions: ChallengeQuestion[];
}

/**
 * Gets clean transcript text for a specific lesson
 */
export function getLessonTranscriptText(courseId: string, lessonId: string): { text: string; hasTranscript: boolean } {
  const manifest = getTranscriptManifest();
  const root = getCoursesRoot();
  const item = manifest.find(m => m.courseId === courseId && m.lessonId === lessonId);

  if (!item) return { text: '', hasTranscript: false };

  const fullPath = path.join(root, item.transcriptPath);
  if (!fs.existsSync(fullPath)) return { text: '', hasTranscript: false };

  try {
    const rawText = fs.readFileSync(fullPath, 'utf8');
    const cleanText = rawText
      .replace(/\[\d{2}:\d{2}(?::\d{2})?\]/g, '')
      .replace(/#+.*?\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();

    return { text: cleanText, hasTranscript: cleanText.length > 50 };
  } catch {
    return { text: '', hasTranscript: false };
  }
}

/**
 * Gets combined clean transcript text for all lessons in a module
 */
export function getModuleTranscriptText(courseId: string, moduleId: string): { text: string; hasTranscript: boolean } {
  const course = getCourseById(courseId);
  if (!course) return { text: '', hasTranscript: false };

  const targetModule = course.modules.find(m => m.id === moduleId);
  if (!targetModule) return { text: '', hasTranscript: false };

  let combinedText = '';
  let foundCount = 0;

  for (const lesson of targetModule.lessons) {
    const { text, hasTranscript } = getLessonTranscriptText(courseId, lesson.id);
    if (hasTranscript && text) {
      foundCount++;
      combinedText += `\n--- Conteúdo da Aula: ${lesson.display_title} ---\n${text}\n`;
    }
  }

  return { text: combinedText, hasTranscript: foundCount > 0 };
}

/**
 * Smart local question generator fallback when API is offline or key missing
 */
function generateLocalFallbackQuestions(
  title: string,
  contextText: string,
  count: number,
  mode: 'lesson' | 'module'
): ChallengeQuestion[] {
  const sentences = contextText
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 30 && s.length < 180);

  const questions: ChallengeQuestion[] = [];
  const usedSentences = new Set<number>();

  for (let i = 0; i < count; i++) {
    let sentenceIdx = Math.floor(Math.random() * Math.max(1, sentences.length));
    let attempts = 0;
    while (usedSentences.has(sentenceIdx) && attempts < 20 && sentences.length > 0) {
      sentenceIdx = (sentenceIdx + 1) % sentences.length;
      attempts++;
    }
    usedSentences.add(sentenceIdx);

    const targetSentence = sentences[sentenceIdx] || `Compreensão dos principais conceitos apresentados sobre ${title}.`;
    
    // Extract key concept words
    const words = targetSentence.split(' ').filter(w => w.length > 5);
    const keyWord = words[Math.floor(Math.random() * Math.max(1, words.length))] || 'conceito chave';

    const questionText = mode === 'module'
      ? `Em relação aos assuntos integrados deste módulo (${title}), assinale a afirmativa correta:`
      : `De acordo com os conceitos apresentados na aula (${title}), qual das opções abaixo expressa a ideia correta?`;

    const correctOption = targetSentence.length > 15 
      ? targetSentence 
      : `O conceito de ${keyWord} é fundamental para a correta aplicação das técnicas estudadas.`;

    const distractor1 = `O conceito de ${keyWord} aplica-se exclusivamente a ambientes de testes sem impacto no resultado final.`;
    const distractor2 = `A abordagem sobre ${keyWord} foi descontinuada na prática moderna por apresentar alto custo relativo.`;
    const distractor3 = `O uso de ${keyWord} deve ser evitado sempre que houver necessidade de manter a consistência dos dados.`;

    // Shuffle options
    const options: [string, string, string, string] = [
      correctOption,
      distractor1,
      distractor2,
      distractor3
    ];

    // Simple deterministic shuffle per index
    const correctIndex = (i * 3 + 1) % 4;
    const temp = options[0];
    options[0] = options[correctIndex];
    options[correctIndex] = temp;

    questions.push({
      id: `q_${i + 1}`,
      question: questionText,
      options,
      correctIndex,
      explanation: `Esta afirmação baseia-se diretamente na explicação original do conteúdo: "${targetSentence.slice(0, 120)}..."`
    });
  }

  return questions;
}

/**
 * Main AI Challenge Generator
 */
export async function generateChallenge(params: {
  courseId: string;
  lessonId?: string;
  moduleId?: string;
  mode: 'lesson' | 'module';
  count: number;
  apiKey?: string;
}): Promise<ChallengeData> {
  const { courseId, lessonId, moduleId, mode, count, apiKey } = params;

  const course = getCourseById(courseId);
  if (!course) {
    throw new Error('Curso não encontrado.');
  }

  let targetLesson = lessonId ? course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId) : undefined;
  let targetModule = moduleId 
    ? course.modules.find(m => m.id === moduleId) 
    : (targetLesson ? course.modules.find(m => m.lessons.some(l => l.id === targetLesson?.id)) : undefined);

  if (!targetModule && course.modules.length > 0) {
    targetModule = course.modules[0];
  }

  const moduleTitle = targetModule?.display_title || 'Módulo Geral';
  const lessonTitle = targetLesson?.display_title || '';

  const challengeTitle = mode === 'module' 
    ? `Desafio do Módulo: ${moduleTitle}` 
    : `Desafio da Aula: ${lessonTitle || 'Aula'}`;

  const subtitle = mode === 'module'
    ? `Avalie seu conhecimento cobrindo todas as aulas do módulo "${moduleTitle}"`
    : `Teste a sua compreensão do conteúdo abordado na aula "${lessonTitle}"`;

  // Fetch transcript content
  let contextText = '';
  let hasTranscript = false;

  if (mode === 'module' && targetModule) {
    const modResult = getModuleTranscriptText(courseId, targetModule.id);
    contextText = modResult.text;
    hasTranscript = modResult.hasTranscript;
  } else if (targetLesson) {
    const lesResult = getLessonTranscriptText(courseId, targetLesson.id);
    contextText = lesResult.text;
    hasTranscript = lesResult.hasTranscript;
  }

  // Fallback context if transcript file not found on disk
  if (!contextText || contextText.length < 50) {
    contextText = `Curso: ${course.display_title}. Provider: ${course.provider}. Módulo: ${moduleTitle}. Aula: ${lessonTitle}. Descrição: ${course.description}. Tags: ${course.tags.join(', ')}.`;
  }

  const activeKey = apiKey || process.env.GEMINI_API_KEY || process.env.PUBLIC_GEMINI_API_KEY;

  if (activeKey && contextText) {
    try {
      const prompt = `Você é um professor pedagógico e especialista criando um questionário de avaliação para a plataforma de streaming educacional MindFlix.

Contexto didático de referência (${mode === 'module' ? `Módulo: ${moduleTitle}` : `Aula: ${lessonTitle}`}):
"""
${contextText.slice(0, 14000)}
"""

Sua tarefa:
Gere EXATAMENTE ${count} perguntas inéditas de múltipla escolha baseadas no conteúdo de referência acima.

Regras de qualidade:
1. Os enunciados devem ser claros, instigantes e testar COMPREENSÃO de conceitos (evite apenas decorar nomes ou palavras isoladas).
2. Cada pergunta deve possuir EXATAMENTE 4 alternativas de resposta (array de strings com 4 itens).
3. Apenas 1 alternativa deve ser a correta.
4. As 3 alternativas incorretas devem ser plausíveis e convincentes (evite opções absurdas ou com humor).
${mode === 'module' ? '5. Distribua as perguntas de forma equilibrada entre os assuntos das diferentes aulas do módulo.' : ''}
6. Inclua uma explicação concisa (1 a 2 frases) justificando o porquê da alternativa correta.

Retorne EXCLUSIVAMENTE um objeto JSON válido (sem tags markdown de código e sem texto adicional fora do JSON) no seguinte formato estrito:
{
  "questions": [
    {
      "id": "q1",
      "question": "Enunciado da pergunta em português?",
      "options": [
        "Opção A",
        "Opção B",
        "Opção C",
        "Opção D"
      ],
      "correctIndex": 0,
      "explanation": "Explicação sucinta do conceito."
    }
  ]
}`;

      const apiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 2500,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (apiRes.ok) {
        const jsonRes = await apiRes.json();
        const rawOutput = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        let parsed: any = null;
        try {
          parsed = JSON.parse(rawOutput);
        } catch {
          const match = rawOutput.match(/\{[\s\S]*\}/);
          if (match) {
            parsed = JSON.parse(match[0]);
          }
        }

        if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          const validQuestions: ChallengeQuestion[] = parsed.questions.slice(0, count).map((q: any, idx: number) => ({
            id: `q_${idx + 1}`,
            question: q.question || `Pergunta ${idx + 1}`,
            options: Array.isArray(q.options) && q.options.length === 4 
              ? [String(q.options[0]), String(q.options[1]), String(q.options[2]), String(q.options[3])]
              : ['Alternativa A', 'Alternativa B', 'Alternativa C', 'Alternativa D'],
            correctIndex: typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0,
            explanation: q.explanation || 'Alternativa fundamentada na aula.'
          }));

          return {
            title: challengeTitle,
            subtitle,
            mode,
            count: validQuestions.length,
            courseId: course.id,
            courseTitle: course.display_title,
            moduleId: targetModule?.id || '',
            moduleTitle,
            lessonId: targetLesson?.id,
            lessonTitle,
            hasTranscript,
            questions: validQuestions
          };
        }
      }
    } catch (err) {
      console.warn('Gemini challenge generation failed, using smart local fallback:', err);
    }
  }

  // Fallback generation if key is missing or call failed
  const fallbackQuestions = generateLocalFallbackQuestions(
    mode === 'module' ? moduleTitle : lessonTitle,
    contextText,
    count,
    mode
  );

  return {
    title: challengeTitle,
    subtitle,
    mode,
    count: fallbackQuestions.length,
    courseId: course.id,
    courseTitle: course.display_title,
    moduleId: targetModule?.id || '',
    moduleTitle,
    lessonId: targetLesson?.id,
    lessonTitle,
    hasTranscript,
    questions: fallbackQuestions
  };
}
