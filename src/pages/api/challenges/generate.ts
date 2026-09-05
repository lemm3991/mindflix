// src/pages/api/challenges/generate.ts - API endpoint for generating AI lesson & module challenges
import type { APIRoute } from 'astro';
import { generateChallenge } from '../../../lib/challenges';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const courseId = (body.courseId || '').trim();
    const lessonId = body.lessonId ? String(body.lessonId).trim() : undefined;
    const moduleId = body.moduleId ? String(body.moduleId).trim() : undefined;
    const mode = body.mode === 'module' ? 'module' : 'lesson';
    const count = parseInt(body.count || '5', 10);
    const apiKey = body.apiKey || request.headers.get('x-gemini-api-key') || undefined;

    if (!courseId) {
      return new Response(JSON.stringify({ error: 'Parâmetro courseId é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const challengeData = await generateChallenge({
      courseId,
      lessonId,
      moduleId,
      mode,
      count: isNaN(count) ? 5 : Math.max(1, Math.min(20, count)),
      apiKey
    });

    return new Response(JSON.stringify(challengeData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err: any) {
    console.error('Error in /api/challenges/generate:', err);
    return new Response(JSON.stringify({
      error: err?.message || 'Falha ao gerar o desafio.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
