import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { a as synthesizeAiAnswer, i as searchSubjectInTranscripts, t as decryptSensitiveData } from "./crypto_Dmlq_QM2.mjs";
//#region src/pages/api/search/ai.ts
var ai_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var POST = async ({ request }) => {
	const startTime = Date.now();
	try {
		const body = await request.json().catch(() => ({}));
		const query = (body.query || body.q || "").trim();
		const rawKey = body.apiKey || request.headers.get("x-gemini-api-key") || void 0;
		const resolvedKey = rawKey ? decryptSensitiveData(rawKey) || rawKey : process.env.GEMINI_API_KEY || void 0;
		if (!query) return new Response(JSON.stringify({ error: "Parâmetro query é obrigatório." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const { matches, totalMatches } = searchSubjectInTranscripts(query, 8);
		const { summary, hasGeminiKey } = await synthesizeAiAnswer(query, matches, resolvedKey);
		const responseData = {
			query,
			summary,
			matches,
			totalMatches,
			hasGeminiKey,
			searchTimeMs: Date.now() - startTime
		};
		return new Response(JSON.stringify(responseData), {
			status: 200,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store"
			}
		});
	} catch (err) {
		console.error("Error in /api/search/ai:", err);
		return new Response(JSON.stringify({
			error: err?.message || "Falha ao processar a busca com IA.",
			searchTimeMs: Date.now() - startTime
		}), {
			status: 500,
			headers: { "Content-Type": "application/json" }
		});
	}
};
var GET = async ({ url, request }) => {
	const query = url.searchParams.get("q") || url.searchParams.get("query") || "";
	const rawKey = url.searchParams.get("apiKey") || request.headers.get("x-gemini-api-key") || void 0;
	const resolvedKey = rawKey ? decryptSensitiveData(rawKey) || rawKey : process.env.GEMINI_API_KEY || void 0;
	if (!query.trim()) return new Response(JSON.stringify({ error: "Parâmetro q ou query é obrigatório." }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
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
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store"
		}
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/search/ai@_@ts
var page = () => ai_exports;
//#endregion
export { page };
