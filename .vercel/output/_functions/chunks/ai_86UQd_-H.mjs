import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import fs from "node:fs";
import nodePath from "node:path";
//#region src/lib/rag.ts
var STOP_WORDS = /* @__PURE__ */ new Set([
	"de",
	"a",
	"o",
	"que",
	"e",
	"do",
	"da",
	"em",
	"um",
	"para",
	"é",
	"com",
	"não",
	"uma",
	"os",
	"no",
	"se",
	"na",
	"por",
	"mais",
	"as",
	"dos",
	"como",
	"mas",
	"foi",
	"ao",
	"ele",
	"das",
	"tem",
	"à",
	"seu",
	"sua",
	"ou",
	"ser",
	"quando",
	"muito",
	"há",
	"nos",
	"já",
	"está",
	"eu",
	"também",
	"só",
	"pelo",
	"pela",
	"até",
	"isso",
	"ela",
	"entre",
	"era",
	"depois",
	"sem",
	"mesmo",
	"aos",
	"ter",
	"seus",
	"quem",
	"nas",
	"me",
	"esse",
	"eles",
	"estão",
	"você",
	"tinha",
	"foram",
	"essa",
	"num",
	"nem",
	"suas",
	"meu",
	"às",
	"minha",
	"têm",
	"numa",
	"pelos",
	"elas",
	"havia",
	"seja",
	"qual",
	"será",
	"nós",
	"tenho",
	"lhe",
	"deles",
	"essas",
	"esses",
	"pelas",
	"este",
	"fosse",
	"dele",
	"onde",
	"sobre",
	"posso",
	"achar",
	"encontrar",
	"qual"
]);
var cachedEntries = null;
var coursesRootCache = "";
function getCoursesRoot() {
	if (coursesRootCache) return coursesRootCache;
	const catalogPath = nodePath.resolve(process.cwd(), "src", "data", "catalog.json");
	if (fs.existsSync(catalogPath)) try {
		coursesRootCache = JSON.parse(fs.readFileSync(catalogPath, "utf8")).courses_root || nodePath.resolve(process.cwd(), "..");
	} catch {
		coursesRootCache = nodePath.resolve(process.cwd(), "..");
	}
	else coursesRootCache = nodePath.resolve(process.cwd(), "..");
	return coursesRootCache;
}
/**
* Builds or retrieves the in-memory transcript catalog manifest.
*/
function getTranscriptManifest() {
	if (cachedEntries && cachedEntries.length > 0) return cachedEntries;
	const manifestPath = nodePath.resolve(process.cwd(), "src", "data", "transcripts_manifest.json");
	if (fs.existsSync(manifestPath)) try {
		cachedEntries = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
		if (cachedEntries && cachedEntries.length > 0) return cachedEntries;
	} catch {}
	const catalogPath = nodePath.resolve(process.cwd(), "src", "data", "catalog.json");
	if (!fs.existsSync(catalogPath)) return [];
	const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
	const root = getCoursesRoot();
	const entries = [];
	for (const c of catalog.courses || []) for (const m of c.modules || []) for (const l of m.lessons || []) {
		if (!l.relative_path) continue;
		const fullVid = nodePath.join(root, l.relative_path);
		const dir = nodePath.dirname(fullVid);
		const baseName = nodePath.basename(l.relative_path, nodePath.extname(l.relative_path));
		const candidates = [
			nodePath.join(dir, `${baseName} - Transcricao.md`),
			nodePath.join(dir, `${baseName}.srt`),
			nodePath.join(dir, `${baseName}.vtt`),
			nodePath.join(dir, `${baseName}.txt`),
			nodePath.join(dir, `${baseName} - Artigo.md`)
		];
		let foundPath = "";
		for (const cand of candidates) if (fs.existsSync(cand)) {
			foundPath = nodePath.relative(root, cand);
			break;
		}
		if (foundPath) entries.push({
			courseId: c.id,
			courseTitle: c.display_title,
			courseProvider: c.provider || "",
			moduleId: m.id,
			moduleTitle: m.display_title,
			lessonId: l.id,
			lessonTitle: l.display_title,
			watchUrl: `/watch/${c.id}/${l.id}`,
			transcriptPath: foundPath
		});
	}
	cachedEntries = entries;
	try {
		fs.writeFileSync(manifestPath, JSON.stringify(entries, null, 2), "utf8");
	} catch (err) {
		console.warn("Could not cache transcripts manifest:", err);
	}
	return entries;
}
var cachedIndexData = null;
function getTranscriptsIndex() {
	if (cachedIndexData) return cachedIndexData;
	const indexPath = nodePath.resolve(process.cwd(), "src", "data", "transcripts_index.json");
	if (fs.existsSync(indexPath)) try {
		cachedIndexData = JSON.parse(fs.readFileSync(indexPath, "utf8"));
		return cachedIndexData;
	} catch (err) {
		console.warn("Could not load transcripts_index.json:", err);
	}
	return null;
}
/**
* Normalizes text for semantic search.
*/
function normalizeText(text) {
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
/**
* Performs ultra-fast semantic & keyword retrieval over transcript index (<15ms).
*/
function searchSubjectInTranscripts(query, maxResults = 8) {
	const keywords = normalizeText(query).split(/[^a-z0-9_-]+/).filter((w) => w.length >= 2).filter((w) => !STOP_WORDS.has(w));
	if (keywords.length === 0) return {
		matches: [],
		totalMatches: 0
	};
	const indexData = getTranscriptsIndex();
	if (indexData && indexData.docs && indexData.index) {
		const docs = indexData.docs;
		const invertedMap = indexData.index;
		const candidateMap = /* @__PURE__ */ new Map();
		for (const kw of keywords) {
			const directDocs = invertedMap[kw] || [];
			for (const docIdx of directDocs) {
				let entry = candidateMap.get(docIdx);
				if (!entry) {
					entry = {
						matchedKeywords: /* @__PURE__ */ new Set(),
						score: 0
					};
					candidateMap.set(docIdx, entry);
				}
				entry.matchedKeywords.add(kw);
				entry.score += 20;
			}
			if (kw.length >= 4 && directDocs.length < 5) {
				for (const otherKey in invertedMap) if (otherKey !== kw && otherKey.startsWith(kw)) {
					const prefixDocs = invertedMap[otherKey];
					for (const docIdx of prefixDocs.slice(0, 15)) {
						let entry = candidateMap.get(docIdx);
						if (!entry) {
							entry = {
								matchedKeywords: /* @__PURE__ */ new Set(),
								score: 0
							};
							candidateMap.set(docIdx, entry);
						}
						entry.matchedKeywords.add(kw);
						entry.score += 10;
					}
				}
			}
		}
		const minRequired = keywords.length >= 3 ? 2 : 1;
		const scoredCandidates = [];
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
			if (matchedKeywords.size === keywords.length) totalScore += 50;
			scoredCandidates.push({
				doc,
				score: totalScore,
				highlightWords: Array.from(new Set(highlightWords))
			});
		}
		scoredCandidates.sort((a, b) => b.score - a.score);
		return {
			matches: scoredCandidates.slice(0, maxResults).map(({ doc, score, highlightWords }) => {
				let bestChunk = doc.chunks[0] || {
					s: `${doc.cTitle} - ${doc.lTitle}`,
					t: void 0
				};
				let maxHits = -1;
				for (const ch of doc.chunks) {
					const normChunk = normalizeText(ch.s);
					let hits = 0;
					for (const kw of highlightWords) if (normChunk.includes(kw)) hits++;
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
			}),
			totalMatches: scoredCandidates.length
		};
	}
	const manifest = getTranscriptManifest();
	const root = getCoursesRoot();
	const matches = [];
	for (const item of manifest) {
		const fullTranscriptPath = nodePath.join(root, item.transcriptPath);
		if (!fs.existsSync(fullTranscriptPath)) continue;
		let text = "";
		try {
			text = fs.readFileSync(fullTranscriptPath, "utf8");
		} catch {
			continue;
		}
		const normText = normalizeText(text);
		const normLesson = normalizeText(item.lessonTitle);
		const normModule = normalizeText(item.moduleTitle);
		const normCourse = normalizeText(item.courseTitle);
		let score = 0;
		let termsMatchedCount = 0;
		const highlightWords = [];
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
			const count = (normText.match(new RegExp(`\\b${kw}`, "g")) || []).length;
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
		if (termsMatchedCount === keywords.length) score += 40;
		let bestWindowStart = 0;
		let maxLocalHits = 0;
		const windowSize = 260;
		for (const kw of keywords) {
			let pos = normText.indexOf(kw);
			while (pos !== -1 && pos < normText.length) {
				const winStart = Math.max(0, pos - 80);
				const winText = normText.slice(winStart, winStart + windowSize);
				let localHits = 0;
				for (const otherKw of keywords) if (winText.includes(otherKw)) localHits++;
				if (localHits > maxLocalHits) {
					maxLocalHits = localHits;
					bestWindowStart = winStart;
				}
				pos = normText.indexOf(kw, pos + windowSize);
			}
		}
		const rawSnippet = text.slice(bestWindowStart, bestWindowStart + windowSize);
		const tsMatch = rawSnippet.match(/\[(\d{2}:\d{2}(?::\d{2})?)\]/);
		const timestamp = tsMatch ? tsMatch[1] : void 0;
		const cleanSnippet = rawSnippet.replace(/#+.*?\n/g, " ").replace(/>.*?\n/g, " ").replace(/\[\d{2}:\d{2}(?::\d{2})?\]/g, "").replace(/\s+/g, " ").trim();
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
			snippet: cleanSnippet.length > 20 ? cleanSnippet : text.slice(0, 180).replace(/\s+/g, " ").trim(),
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
async function synthesizeAiAnswer(query, matches, geminiApiKey) {
	const activeKey = geminiApiKey || process.env.GEMINI_API_KEY || process.env.PUBLIC_GEMINI_API_KEY;
	if (activeKey && matches.length > 0) try {
		const prompt = `Você é o assistente inteligente de busca e tutoria do Mindflix.
O usuário perguntou sobre o acervo de cursos: "${query}".
Abaixo estão os trechos mais relevantes encontrados nas transcrições das aulas reais do acervo:

${matches.slice(0, 5).map((m, idx) => `
[Aula ${idx + 1}]
Curso: ${m.courseTitle} (${m.courseProvider})
Módulo: ${m.moduleTitle}
Aula: ${m.lessonTitle}
${m.timestamp ? `Tempo: ${m.timestamp}` : ""}
Trecho da transcrição: "${m.snippet}"
`).join("\n")}

Sua tarefa:
1. Responda diretamente e de forma organizada à dúvida do usuário em 2 a 3 parágrafos objetivos.
2. Diga com clareza em quais cursos e módulos esse assunto é abordado com maior profundidade.
3. Indique qual é a aula ideal recomendada para ele começar a assistir agora.
4. Mantenha um tom profissional, acolhedor e direto ao ponto. Use negrito nos pontos-chave. Não crie links HTML ou markdown que não foram passados.`;
		const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
				generationConfig: {
					temperature: .2,
					maxOutputTokens: 600
				}
			})
		});
		if (response.ok) {
			const aiText = (await response.json())?.candidates?.[0]?.content?.parts?.[0]?.text;
			if (aiText) return {
				summary: aiText.trim(),
				hasGeminiKey: true
			};
		}
	} catch (err) {
		console.warn("Gemini API call failed, falling back to local synthesis:", err);
	}
	if (matches.length === 0) return {
		summary: `Não localizamos nenhuma menção direta ao tema **"${query}"** nas transcrições do acervo. Tente pesquisar por termos sinônimos ou conceitos relacionados.`,
		hasGeminiKey: Boolean(activeKey)
	};
	const primary = matches[0];
	return {
		summary: `O tema **"${query}"** é abordado diretamente no seu acervo, principalmente no curso ${Array.from(new Set(matches.map((m) => m.courseTitle))).slice(0, 3).map((c) => `**${c}**`).join(", ")}.

A melhor aula para começar a estudar este conteúdo é **"${primary.lessonTitle}"** (do curso **${primary.courseTitle}**, módulo *${primary.moduleTitle}*)${primary.timestamp ? `, onde o assunto é detalhado a partir do minuto **${primary.timestamp}**` : ""}.

Abaixo você encontra as aulas com as citações e trechos exatos extraídos das transcrições para assistir diretamente no player:`,
		hasGeminiKey: Boolean(activeKey)
	};
}
//#endregion
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
		const apiKey = body.apiKey || request.headers.get("x-gemini-api-key") || void 0;
		if (!query) return new Response(JSON.stringify({ error: "Parâmetro query é obrigatório." }), {
			status: 400,
			headers: { "Content-Type": "application/json" }
		});
		const { matches, totalMatches } = searchSubjectInTranscripts(query, 8);
		const { summary, hasGeminiKey } = await synthesizeAiAnswer(query, matches, apiKey);
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
	const apiKey = url.searchParams.get("apiKey") || request.headers.get("x-gemini-api-key") || void 0;
	if (!query.trim()) return new Response(JSON.stringify({ error: "Parâmetro q ou query é obrigatório." }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const startTime = Date.now();
	const { matches, totalMatches } = searchSubjectInTranscripts(query.trim(), 8);
	const { summary, hasGeminiKey } = await synthesizeAiAnswer(query.trim(), matches, apiKey);
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
