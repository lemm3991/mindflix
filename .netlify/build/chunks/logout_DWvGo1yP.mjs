import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as COOKIE_NAME } from "./auth_CCtkdeAP.mjs";
//#region src/pages/api/auth/logout.ts
var logout_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var POST = async ({ cookies }) => {
	cookies.delete(COOKIE_NAME, { path: "/" });
	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
var GET = async ({ cookies, redirect }) => {
	cookies.delete(COOKIE_NAME, { path: "/" });
	return redirect("/login");
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/auth/logout@_@ts
var page = () => logout_exports;
//#endregion
export { page };
