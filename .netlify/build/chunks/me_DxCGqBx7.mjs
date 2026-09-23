import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { o as verifySessionToken, t as COOKIE_NAME } from "./auth_CCtkdeAP.mjs";
//#region src/pages/api/auth/me.ts
var me_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async ({ cookies }) => {
	const token = cookies.get(COOKIE_NAME)?.value;
	const session = verifySessionToken(token);
	if (!session) return new Response(JSON.stringify({ authenticated: false }), {
		status: 401,
		headers: { "Content-Type": "application/json" }
	});
	return new Response(JSON.stringify({
		authenticated: true,
		user: {
			id: session.uid,
			username: session.username,
			name: session.name
		}
	}), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/me@_@ts
var page = () => me_exports;
//#endregion
export { page };
