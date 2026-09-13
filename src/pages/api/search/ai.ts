import type { APIRoute } from 'astro';
import { searchSubjectInTranscripts, synthesizeAiAnswer, type AiSearchResponse } from '../../../lib/rag';
import { decryptSensitiveData } from '../../../lib/server/crypto';

export const POST: APIRoute = async ({ request }) => {
  const startTime = Date.now();
  try {
    const body = await request.json().catch(() => ({}));
    const query = (body.query || body.q || '').trim();
    const rawKey = body.apiKey || request.headers.get('x-gemini-api-key') || undefined;
    const resolvedKey = rawKey ? (decryptSensitiveData(rawKey) || rawKey) : (process.env.GEMINI_API_KEY || undefined);

    if (!query) {
      return new Response(JSON.stringify({ error: 'Parâmetro query é obrigatório.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Perform semantic retrieval over transcript corpus
    const { matches, totalMatches } = searchSubjectInTranscripts(query, 8);

    // Synthesize structured AI answer (Gemini if key provided, otherwise smart local digest)
    const { summary, hasGeminiKey } = await synthesizeAiAnswer(query, matches, resolvedKey);

    const searchTimeMs = Date.now() - startTime;

    const responseData: AiSearchResponse = {
      query,
      summary,
      matches,
      totalMatches,
      hasGeminiKey,
      searchTimeMs
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  } catch (err: any) {
    console.error('Error in /api/search/ai:', err);
    return new Response(JSON.stringify({
      error: err?.message || 'Falha ao processar a busca com IA.',
      searchTimeMs: Date.now() - startTime
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url, request }) => {
  const query = url.searchParams.get('q') || url.searchParams.get('query') || '';
  const rawKey = url.searchParams.get('apiKey') || request.headers.get('x-gemini-api-key') || undefined;
  const resolvedKey = rawKey ? (decryptSensitiveData(rawKey) || rawKey) : (process.env.GEMINI_API_KEY || undefined);

  if (!query.trim()) {
    return new Response(JSON.stringify({ error: 'Parâmetro q ou query é obrigatório.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const startTime = Date.now();
  const { matches, totalMatches } = searchSubjectInTranscripts(query.trim(), 8);
  const { summary, hasGeminiKey } = await synthesizeAiAnswer(query.trim(), matches, resolvedKey);

  return new Response(JSON.stringify({
    query: query.trim(),
    summary,
    matches,
    totalMatches,
    hasGeminiKey,
    searchTimeMs: Date.now() - startTime
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
};
