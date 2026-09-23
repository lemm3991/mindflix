import { D as MiddlewareNotAResponse, E as MiddlewareNoDataOrNextCalled, G as SessionStorageInitError, H as ReservedSlotName, K as SessionStorageSaveError, N as NoManifestAvailable, Q as AstroError, T as LocalsReassigned, U as ResponseSentError, Z as i18nNoLocaleFoundInPath, a as ClientAddressNotAvailable, et as isAstroError, i as CacheNotEnabled, n as ActionsReturnedInvalidDataError, p as ForbiddenRewrite, q as StaticClientAddressNotAvailable, r as AstroResponseHeadersReassigned, t as ActionNotFoundError, w as LocalsNotAnObject, z as PrerenderClientAddressNotAvailable } from "./chunks/errors-data_BTJkX44o.mjs";
import { $ as normalizeThePath, A as isRenderTemplateResult, C as renderPage, Ct as decodeKey, D as chunkToString, G as getCustom404Route, J as routeHasHtmlExtension, K as getCustom500Route, L as isRenderInstruction, Q as normalizeTheLocale, R as normalizeCspResourceEntry, St as defineMiddleware, U as createAsyncManifestMemo, V as renderEndpoint, W as createManifestMemo, X as isRoute500, Y as isRoute404, Z as getErrorRoutePath, _ as DEFAULT_404_ROUTE, _t as clientAddressSymbol, a as getRouteGenerator, at as isInternalPath, b as readBodyWithLimit, bt as responseSentSymbol$1, ct as prependForwardSlash, d as getEnvironment, dt as removeTrailingForwardSlash, et as pathHasLocale, f as copyRequest, ft as stripRequestBase, g as validateAndDecodePathname, gt as REROUTABLE_STATUS_CODES, h as MultiLevelEncodingError, ht as REDIRECT_STATUS_CODES, i as getRouteCache, it as hasFileExtension, k as renderSlotToString, l as AstroIntegrationLogger, lt as removeLeadingForwardSlash, m as setOriginPathname, mt as ASTRO_GENERATOR, n as getParams, nt as collapseDuplicateSlashes, o as getLogger, p as getOriginPathname, pt as ASTRO_ERROR_HEADER, q as getDefaultStatusCode, r as getProps, rt as collapseDuplicateTrailingSlashes, s as getResolvedLogger, st as joinPaths, t as sequence, tt as appendForwardSlash, u as astroToRuntimeLogger, v as SERVER_ISLAND_COMPONENT, vt as fetchStateSymbol, w as renderJSX, wt as generateCspDigest, xt as shouldAppendForwardSlash, y as BodySizeLimitError, yt as originPathnameSymbol, z as pushDirective } from "./chunks/sequence_BzZU-fGI.mjs";
import { n as matchPattern } from "./chunks/remote_BgpFkaRQ.mjs";
import { parse, stringify, unflatten } from "devalue";
import colors from "piccolore";
import { parseCookie, stringifySetCookie } from "cookie";
import { escape } from "html-escaper";
import { createStorage } from "unstorage";
//#endregion
//#region node_modules/astro/dist/core/middleware/noop-middleware.js
var NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
	return await next();
};
//#endregion
//#region node_modules/astro/dist/core/app/manifest.js
function deserializeManifest(serializedManifest, routesList) {
	const routes = [];
	if (serializedManifest.routes) for (const serializedRoute of serializedManifest.routes) routes.push({
		...serializedRoute,
		routeData: deserializeRouteData(serializedRoute.routeData)
	});
	if (routesList) for (const route of routesList?.routes) routes.push({
		file: "",
		links: [],
		scripts: [],
		styles: [],
		routeData: route
	});
	const assets = new Set(serializedManifest.assets);
	const componentMetadata = new Map(serializedManifest.componentMetadata);
	const inlinedScripts = new Map(serializedManifest.inlinedScripts);
	const clientDirectives = new Map(serializedManifest.clientDirectives);
	const key = decodeKey(serializedManifest.key);
	return {
		middleware() {
			return { onRequest: NOOP_MIDDLEWARE_FN };
		},
		...serializedManifest,
		rootDir: new URL(serializedManifest.rootDir),
		srcDir: new URL(serializedManifest.srcDir),
		publicDir: new URL(serializedManifest.publicDir),
		outDir: new URL(serializedManifest.outDir),
		cacheDir: new URL(serializedManifest.cacheDir),
		buildClientDir: new URL(serializedManifest.buildClientDir),
		buildServerDir: new URL(serializedManifest.buildServerDir),
		assets,
		componentMetadata,
		inlinedScripts,
		clientDirectives,
		routes,
		key
	};
}
function deserializeRouteData(rawRouteData) {
	return {
		route: rawRouteData.route,
		type: rawRouteData.type,
		pattern: new RegExp(rawRouteData.pattern),
		params: rawRouteData.params,
		component: rawRouteData.component,
		pathname: rawRouteData.pathname || void 0,
		segments: rawRouteData.segments,
		prerender: rawRouteData.prerender,
		redirect: rawRouteData.redirect,
		redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
		fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
			return deserializeRouteData(fallback);
		}),
		isIndex: rawRouteData.isIndex,
		origin: rawRouteData.origin,
		distURL: rawRouteData.distURL
	};
}
function deserializeRouteInfo(rawRouteInfo) {
	return {
		styles: rawRouteInfo.styles,
		file: rawRouteInfo.file,
		links: rawRouteInfo.links,
		scripts: rawRouteInfo.scripts,
		routeData: deserializeRouteData(rawRouteInfo.routeData)
	};
}
//#endregion
//#region \0virtual:astro:renderers
var renderers = [];
[
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"type": "page",
			"component": "_server-islands.astro",
			"params": ["name"],
			"segments": [[{
				"content": "_server-islands",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "name",
				"dynamic": true,
				"spread": false
			}]],
			"pattern": "^\\/_server-islands\\/([^/]+?)\\/?$",
			"prerender": false,
			"isIndex": false,
			"fallbackRoutes": [],
			"route": "/_server-islands/[name]",
			"origin": "internal",
			"distURL": [],
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/_image",
			"component": "node_modules/astro/dist/assets/endpoint/generic.js",
			"params": [],
			"pathname": "/_image",
			"pattern": "^\\/_image\\/?$",
			"segments": [[{
				"content": "_image",
				"dynamic": false,
				"spread": false
			}]],
			"type": "endpoint",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"isIndex": false,
			"origin": "internal",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/404",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/404\\/?$",
			"segments": [[{
				"content": "404",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/404.astro",
			"pathname": "/404",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/anotacoes",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/anotacoes\\/?$",
			"segments": [[{
				"content": "anotacoes",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/anotacoes.astro",
			"pathname": "/anotacoes",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/auth/change-password",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/auth\\/change-password\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "change-password",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/auth/change-password.ts",
			"pathname": "/api/auth/change-password",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/auth/login",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/auth\\/login\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "login",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/auth/login.ts",
			"pathname": "/api/auth/login",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/auth/logout",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/auth\\/logout\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "logout",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/auth/logout.ts",
			"pathname": "/api/auth/logout",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/auth/me",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/auth\\/me\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "auth",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "me",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/auth/me.ts",
			"pathname": "/api/auth/me",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/challenges/generate",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/challenges\\/generate\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "challenges",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "generate",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/challenges/generate.ts",
			"pathname": "/api/challenges/generate",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/library/backup",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/library\\/backup\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "library",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "backup",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/library/backup.ts",
			"pathname": "/api/library/backup",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/library/categories",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/library\\/categories\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "library",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "categories",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/library/categories.ts",
			"pathname": "/api/library/categories",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/library/scan",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/library\\/scan\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "library",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "scan",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/library/scan.ts",
			"pathname": "/api/library/scan",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/library/update-course",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/library\\/update-course\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "library",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "update-course",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/library/update-course.ts",
			"pathname": "/api/library/update-course",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/search/ai",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/search\\/ai\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "search",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "ai",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/search/ai.ts",
			"pathname": "/api/search/ai",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/security/ban",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/security\\/ban\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "security",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "ban",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/security/ban.ts",
			"pathname": "/api/security/ban",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/security/clear-logs",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/security\\/clear-logs\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "security",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "clear-logs",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/security/clear-logs.ts",
			"pathname": "/api/security/clear-logs",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/security/settings",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/security\\/settings\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "security",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "settings",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/security/settings.ts",
			"pathname": "/api/security/settings",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/security/simulate",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/security\\/simulate\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "security",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "simulate",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/security/simulate.ts",
			"pathname": "/api/security/simulate",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/security/stats",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/security\\/stats\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "security",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "stats",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/security/stats.ts",
			"pathname": "/api/security/stats",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/security/whitelist",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/security\\/whitelist\\/?$",
			"segments": [
				[{
					"content": "api",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "security",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "whitelist",
					"dynamic": false,
					"spread": false
				}]
			],
			"params": [],
			"component": "src/pages/api/security/whitelist.ts",
			"pathname": "/api/security/whitelist",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/api/video",
			"isIndex": false,
			"type": "endpoint",
			"pattern": "^\\/api\\/video\\/?$",
			"segments": [[{
				"content": "api",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "video",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/api/video.ts",
			"pathname": "/api/video",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/course/[id]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/course\\/([^/]+?)\\/?$",
			"segments": [[{
				"content": "course",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "id",
				"dynamic": true,
				"spread": false
			}]],
			"params": ["id"],
			"component": "src/pages/course/[id].astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/courses",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/courses\\/?$",
			"segments": [[{
				"content": "courses",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/courses.astro",
			"pathname": "/courses",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/fonte/[id]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/fonte\\/([^/]+?)\\/?$",
			"segments": [[{
				"content": "fonte",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "id",
				"dynamic": true,
				"spread": false
			}]],
			"params": ["id"],
			"component": "src/pages/fonte/[id].astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/library",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/library\\/?$",
			"segments": [[{
				"content": "library",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/library.astro",
			"pathname": "/library",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/login",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/login\\/?$",
			"segments": [[{
				"content": "login",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/login.astro",
			"pathname": "/login",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/my-list",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/my-list\\/?$",
			"segments": [[{
				"content": "my-list",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/my-list.astro",
			"pathname": "/my-list",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/profile",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/profile\\/?$",
			"segments": [[{
				"content": "profile",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/profile.astro",
			"pathname": "/profile",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/register",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/register\\/?$",
			"segments": [[{
				"content": "register",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/register.astro",
			"pathname": "/register",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/security-monitor",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/security-monitor\\/?$",
			"segments": [[{
				"content": "security-monitor",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/security-monitor.astro",
			"pathname": "/security-monitor",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/settings",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/settings\\/?$",
			"segments": [[{
				"content": "settings",
				"dynamic": false,
				"spread": false
			}]],
			"params": [],
			"component": "src/pages/settings.astro",
			"pathname": "/settings",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/source/[id]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/source\\/([^/]+?)\\/?$",
			"segments": [[{
				"content": "source",
				"dynamic": false,
				"spread": false
			}], [{
				"content": "id",
				"dynamic": true,
				"spread": false
			}]],
			"params": ["id"],
			"component": "src/pages/source/[id].astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/watch/trilha/[trilhaId]/[lessonId]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/watch\\/trilha\\/([^/]+?)\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "watch",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "trilha",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "trilhaId",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "lessonId",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["trilhaId", "lessonId"],
			"component": "src/pages/watch/trilha/[trilhaId]/[lessonId].astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/watch/[courseId]/[lessonId]",
			"isIndex": false,
			"type": "page",
			"pattern": "^\\/watch\\/([^/]+?)\\/([^/]+?)\\/?$",
			"segments": [
				[{
					"content": "watch",
					"dynamic": false,
					"spread": false
				}],
				[{
					"content": "courseId",
					"dynamic": true,
					"spread": false
				}],
				[{
					"content": "lessonId",
					"dynamic": true,
					"spread": false
				}]
			],
			"params": ["courseId", "lessonId"],
			"component": "src/pages/watch/[courseId]/[lessonId].astro",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	},
	{
		"file": "",
		"links": [],
		"scripts": [],
		"styles": [],
		"routeData": {
			"route": "/",
			"isIndex": true,
			"type": "page",
			"pattern": "^\\/$",
			"segments": [],
			"params": [],
			"component": "src/pages/index.astro",
			"pathname": "/",
			"prerender": false,
			"fallbackRoutes": [],
			"distURL": [],
			"origin": "project",
			"_meta": { "trailingSlash": "ignore" }
		}
	}
].map(deserializeRouteInfo);
//#endregion
//#region \0virtual:astro:pages
var _page0 = () => import("./chunks/generic_KPw-3bEX.mjs").then((n) => n.t);
var _page1 = () => import("./chunks/404_Dp6JLwa7.mjs");
var _page2 = () => import("./chunks/anotacoes_DMHJae9O.mjs");
var _page3 = () => import("./chunks/change-password_Ced4--GR.mjs");
var _page4 = () => import("./chunks/login_DUp7vmEV.mjs");
var _page5 = () => import("./chunks/logout_DWvGo1yP.mjs");
var _page6 = () => import("./chunks/me_DxCGqBx7.mjs");
var _page7 = () => import("./chunks/generate_DK4ij-43.mjs");
var _page8 = () => import("./chunks/backup_CtYcNRzj.mjs");
var _page9 = () => import("./chunks/categories_CCAYKM6B.mjs");
var _page10 = () => import("./chunks/scan_C2bTbmAa.mjs");
var _page11 = () => import("./chunks/update-course_vmdEdHAc.mjs");
var _page12 = () => import("./chunks/ai_DMU0_Mn5.mjs");
var _page13 = () => import("./chunks/ban_Bn7WTgkv.mjs");
var _page14 = () => import("./chunks/clear-logs_6ykecwT4.mjs");
var _page15 = () => import("./chunks/settings_B-QMREwn.mjs");
var _page16 = () => import("./chunks/simulate_EDArjS_x.mjs");
var _page17 = () => import("./chunks/stats_CeW-qwAM.mjs");
var _page18 = () => import("./chunks/whitelist_eR-x2joB.mjs");
var _page19 = () => import("./chunks/video_0TThjCS2.mjs");
var _page20 = () => import("./chunks/_id__BYDhOhn1.mjs");
var _page21 = () => import("./chunks/courses_Bgp3YIVh.mjs");
var _page22 = () => import("./chunks/_id__DifB__ju.mjs");
var _page23 = () => import("./chunks/library__fxlEC0z.mjs");
var _page24 = () => import("./chunks/login_8QMk5_yW.mjs");
var _page25 = () => import("./chunks/my-list_B2ClxBgH.mjs");
var _page26 = () => import("./chunks/profile_B0k258jH.mjs");
var _page27 = () => import("./chunks/register_DlommvkL.mjs");
var _page28 = () => import("./chunks/security-monitor_B4qrKcjx.mjs");
var _page29 = () => import("./chunks/settings_BlLIfThr.mjs");
var _page30 = () => import("./chunks/_id__DBBlb9Aw.mjs");
var _page31 = () => import("./chunks/_lessonId__b18gBERE.mjs");
var _page32 = () => import("./chunks/_lessonId__R8R8t-Wt.mjs");
var _page33 = () => import("./chunks/index_Dtbi9m2R.mjs");
var pageMap = /* @__PURE__ */ new Map([
	["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
	["src/pages/404.astro", _page1],
	["src/pages/anotacoes.astro", _page2],
	["src/pages/api/auth/change-password.ts", _page3],
	["src/pages/api/auth/login.ts", _page4],
	["src/pages/api/auth/logout.ts", _page5],
	["src/pages/api/auth/me.ts", _page6],
	["src/pages/api/challenges/generate.ts", _page7],
	["src/pages/api/library/backup.ts", _page8],
	["src/pages/api/library/categories.ts", _page9],
	["src/pages/api/library/scan.ts", _page10],
	["src/pages/api/library/update-course.ts", _page11],
	["src/pages/api/search/ai.ts", _page12],
	["src/pages/api/security/ban.ts", _page13],
	["src/pages/api/security/clear-logs.ts", _page14],
	["src/pages/api/security/settings.ts", _page15],
	["src/pages/api/security/simulate.ts", _page16],
	["src/pages/api/security/stats.ts", _page17],
	["src/pages/api/security/whitelist.ts", _page18],
	["src/pages/api/video.ts", _page19],
	["src/pages/course/[id].astro", _page20],
	["src/pages/courses.astro", _page21],
	["src/pages/fonte/[id].astro", _page22],
	["src/pages/library.astro", _page23],
	["src/pages/login.astro", _page24],
	["src/pages/my-list.astro", _page25],
	["src/pages/profile.astro", _page26],
	["src/pages/register.astro", _page27],
	["src/pages/security-monitor.astro", _page28],
	["src/pages/settings.astro", _page29],
	["src/pages/source/[id].astro", _page30],
	["src/pages/watch/trilha/[trilhaId]/[lessonId].astro", _page31],
	["src/pages/watch/[courseId]/[lessonId].astro", _page32],
	["src/pages/index.astro", _page33]
]);
//#endregion
//#region \0virtual:astro:manifest
var _manifest = deserializeManifest({"rootDir":"file:///D:/projetos%20antigravity/mindflix/","cacheDir":"file:///D:/projetos%20antigravity/mindflix/node_modules/.astro/","outDir":"file:///D:/projetos%20antigravity/mindflix/dist/","srcDir":"file:///D:/projetos%20antigravity/mindflix/src/","publicDir":"file:///D:/projetos%20antigravity/mindflix/public/","buildClientDir":"file:///D:/projetos%20antigravity/mindflix/dist/","buildServerDir":"file:///D:/projetos%20antigravity/mindflix/.netlify/build/","adapterName":"@astrojs/netlify","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/_image","component":"node_modules/astro/dist/assets/endpoint/generic.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":".notfound-container[data-astro-cid-ibpinaeu]{justify-content:center;align-items:center;padding-top:140px;padding-bottom:5rem;display:flex}.notfound-card[data-astro-cid-ibpinaeu]{text-align:center;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);max-width:500px;padding:3rem 2rem}.error-code[data-astro-cid-ibpinaeu]{font-size:5rem;font-weight:900;font-family:var(--font-display);background:var(--grad-primary);-webkit-text-fill-color:transparent;-webkit-background-clip:text;margin-bottom:1rem;line-height:1;display:block}.error-title[data-astro-cid-ibpinaeu]{margin-bottom:.5rem;font-size:1.75rem}.error-desc[data-astro-cid-ibpinaeu]{color:var(--text-secondary);margin-bottom:2rem;font-size:.9375rem;line-height:1.5}.error-actions[data-astro-cid-ibpinaeu]{justify-content:center;gap:1rem;display:flex}\n"},{"type":"external","src":"_astro/Layout.tRcOv5CN.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/anotacoes.6CiJS4IF.css"},{"type":"external","src":"_astro/Layout.tRcOv5CN.css"}],"routeData":{"route":"/anotacoes","isIndex":false,"type":"page","pattern":"^\\/anotacoes\\/?$","segments":[[{"content":"anotacoes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/anotacoes.astro","pathname":"/anotacoes","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/change-password","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/change-password\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"change-password","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/change-password.ts","pathname":"/api/auth/change-password","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/login.ts","pathname":"/api/auth/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/logout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/logout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/logout.ts","pathname":"/api/auth/logout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/auth/me","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/auth\\/me\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"me","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/auth/me.ts","pathname":"/api/auth/me","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/challenges/generate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/challenges\\/generate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"challenges","dynamic":false,"spread":false}],[{"content":"generate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/challenges/generate.ts","pathname":"/api/challenges/generate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/library/backup","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/library\\/backup\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"library","dynamic":false,"spread":false}],[{"content":"backup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/library/backup.ts","pathname":"/api/library/backup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/library/categories","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/library\\/categories\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"library","dynamic":false,"spread":false}],[{"content":"categories","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/library/categories.ts","pathname":"/api/library/categories","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/library/scan","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/library\\/scan\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"library","dynamic":false,"spread":false}],[{"content":"scan","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/library/scan.ts","pathname":"/api/library/scan","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/library/update-course","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/library\\/update-course\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"library","dynamic":false,"spread":false}],[{"content":"update-course","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/library/update-course.ts","pathname":"/api/library/update-course","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/search/ai","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/search\\/ai\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"ai","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/search/ai.ts","pathname":"/api/search/ai","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/security/ban","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/security\\/ban\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"security","dynamic":false,"spread":false}],[{"content":"ban","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/security/ban.ts","pathname":"/api/security/ban","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/security/clear-logs","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/security\\/clear-logs\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"security","dynamic":false,"spread":false}],[{"content":"clear-logs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/security/clear-logs.ts","pathname":"/api/security/clear-logs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/security/settings","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/security\\/settings\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"security","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/security/settings.ts","pathname":"/api/security/settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/security/simulate","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/security\\/simulate\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"security","dynamic":false,"spread":false}],[{"content":"simulate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/security/simulate.ts","pathname":"/api/security/simulate","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/security/stats","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/security\\/stats\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"security","dynamic":false,"spread":false}],[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/security/stats.ts","pathname":"/api/security/stats","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/security/whitelist","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/security\\/whitelist\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"security","dynamic":false,"spread":false}],[{"content":"whitelist","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/security/whitelist.ts","pathname":"/api/security/whitelist","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/video","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/video\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"video","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/video.ts","pathname":"/api/video","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"inline","content":".course-redirect-container[data-astro-cid-ocvgnvsc]{justify-content:center;align-items:center;min-height:80vh;padding:2rem;display:flex}.redirect-card[data-astro-cid-ocvgnvsc]{background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-xl);text-align:center;max-width:460px;box-shadow:var(--shadow-xl);backdrop-filter:blur(16px);flex-direction:column;align-items:center;gap:1.25rem;padding:3rem 2.5rem;display:flex}.spinner-ring[data-astro-cid-ocvgnvsc]{border:3px solid #00f2fe26;border-top-color:var(--accent-cyan);border-radius:50%;width:48px;height:48px;animation:.8s linear infinite spin}@keyframes spin{to{transform:rotate(360deg)}}.redirect-title[data-astro-cid-ocvgnvsc]{color:var(--text-primary);font-size:1.25rem;font-weight:700}.redirect-subtitle[data-astro-cid-ocvgnvsc]{color:var(--text-muted);font-size:.9rem}\n"}],"routeData":{"route":"/course/[id]","isIndex":false,"type":"page","pattern":"^\\/course\\/([^/]+?)\\/?$","segments":[[{"content":"course","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/course/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/CourseCard.DwVfnjdf.css"},{"type":"external","src":"_astro/TrilhaCard.CFRX-bvL.css"},{"type":"external","src":"_astro/courses.B0jC90aW.css"},{"type":"inline","content":".empty-state-wrapper[data-astro-cid-72cpth5s]{text-align:center;background:var(--bg-card);border:1px dashed var(--border-subtle);border-radius:var(--radius-lg);flex-direction:column;justify-content:center;align-items:center;margin:2rem 0;padding:4rem 2rem;display:flex}.empty-state-icon[data-astro-cid-72cpth5s]{width:64px;height:64px;color:var(--text-muted);background:#ffffff0d;border-radius:50%;justify-content:center;align-items:center;margin-bottom:1.25rem;display:flex}.empty-state-title[data-astro-cid-72cpth5s]{color:var(--text-primary);margin-bottom:.5rem;font-size:1.25rem}.empty-state-desc[data-astro-cid-72cpth5s]{color:var(--text-secondary);max-width:420px;margin-bottom:1.5rem;font-size:.9375rem;line-height:1.5}.btn-empty-action[data-astro-cid-72cpth5s]{padding:.65rem 1.5rem}\n"}],"routeData":{"route":"/courses","isIndex":false,"type":"page","pattern":"^\\/courses\\/?$","segments":[[{"content":"courses","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/courses.astro","pathname":"/courses","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/fonte/[id]","isIndex":false,"type":"page","pattern":"^\\/fonte\\/([^/]+?)\\/?$","segments":[[{"content":"fonte","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/fonte/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/library.COqNvVCF.css"}],"routeData":{"route":"/library","isIndex":false,"type":"page","pattern":"^\\/library\\/?$","segments":[[{"content":"library","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/library.astro","pathname":"/library","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":".auth-page-container[data-astro-cid-sjqh5bze]{justify-content:center;align-items:center;min-height:100vh;padding:2rem;display:flex}.auth-card[data-astro-cid-sjqh5bze]{background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);width:100%;max-width:420px;padding:2.5rem;box-shadow:0 16px 48px #00000080}.auth-brand[data-astro-cid-sjqh5bze]{justify-content:center;margin-bottom:2rem;display:flex}.brand-logo[data-astro-cid-sjqh5bze]{align-items:center;gap:.6rem;text-decoration:none;display:flex}.logo-icon[data-astro-cid-sjqh5bze]{background:var(--grad-primary);color:#0b0d13;border-radius:8px;justify-content:center;align-items:center;width:34px;height:34px;display:flex}.logo-text[data-astro-cid-sjqh5bze]{font-family:var(--font-display);letter-spacing:.08em;color:#fff;font-size:1.5rem;font-weight:800}.logo-text[data-astro-cid-sjqh5bze] span[data-astro-cid-sjqh5bze]{background:var(--grad-primary);-webkit-text-fill-color:transparent;-webkit-background-clip:text}.auth-title[data-astro-cid-sjqh5bze]{text-align:center;margin-bottom:.35rem;font-size:1.5rem;font-weight:700}.auth-subtitle[data-astro-cid-sjqh5bze]{color:var(--text-secondary);text-align:center;margin-bottom:2rem;font-size:.875rem;line-height:1.5}.auth-form[data-astro-cid-sjqh5bze]{flex-direction:column;gap:1.25rem;display:flex}.form-group[data-astro-cid-sjqh5bze]{flex-direction:column;gap:.4rem;display:flex}.form-label[data-astro-cid-sjqh5bze]{color:var(--text-secondary);font-size:.8125rem;font-weight:600}.form-input[data-astro-cid-sjqh5bze]{background:var(--bg-surface-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);height:44px;color:var(--text-primary);transition:border-color var(--transition-fast);outline:none;padding:0 1rem;font-size:.9375rem}.form-input[data-astro-cid-sjqh5bze]:focus{border-color:var(--accent-cyan)}.auth-error-msg[data-astro-cid-sjqh5bze]{color:#fda4af;border-radius:var(--radius-sm);background:#f43f5e26;border:1px solid #f43f5e4d;padding:.65rem 1rem;font-size:.8125rem;line-height:1.4}.btn-submit[data-astro-cid-sjqh5bze]{height:46px;margin-top:.5rem;font-weight:600}\n"},{"type":"external","src":"_astro/Layout.tRcOv5CN.css"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"inline","content":".empty-state-wrapper[data-astro-cid-72cpth5s]{text-align:center;background:var(--bg-card);border:1px dashed var(--border-subtle);border-radius:var(--radius-lg);flex-direction:column;justify-content:center;align-items:center;margin:2rem 0;padding:4rem 2rem;display:flex}.empty-state-icon[data-astro-cid-72cpth5s]{width:64px;height:64px;color:var(--text-muted);background:#ffffff0d;border-radius:50%;justify-content:center;align-items:center;margin-bottom:1.25rem;display:flex}.empty-state-title[data-astro-cid-72cpth5s]{color:var(--text-primary);margin-bottom:.5rem;font-size:1.25rem}.empty-state-desc[data-astro-cid-72cpth5s]{color:var(--text-secondary);max-width:420px;margin-bottom:1.5rem;font-size:.9375rem;line-height:1.5}.btn-empty-action[data-astro-cid-72cpth5s]{padding:.65rem 1.5rem}\n"},{"type":"external","src":"_astro/CourseCard.DwVfnjdf.css"},{"type":"inline","content":".my-list-page[data-astro-cid-7ui6v2kp]{padding-top:110px;padding-bottom:5rem}.page-header[data-astro-cid-7ui6v2kp]{margin-bottom:2.5rem}.page-title[data-astro-cid-7ui6v2kp]{margin-bottom:.5rem;font-size:2.25rem;font-weight:800}.page-subtitle[data-astro-cid-7ui6v2kp]{color:var(--text-secondary);font-size:1.0625rem}.courses-grid[data-astro-cid-7ui6v2kp]{perspective:1200px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem;display:grid}.my-list-item[data-astro-cid-7ui6v2kp]{perspective:1000px;height:100%}\n"}],"routeData":{"route":"/my-list","isIndex":false,"type":"page","pattern":"^\\/my-list\\/?$","segments":[[{"content":"my-list","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/my-list.astro","pathname":"/my-list","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/profile.BxRq6LwY.css"}],"routeData":{"route":"/profile","isIndex":false,"type":"page","pattern":"^\\/profile\\/?$","segments":[[{"content":"profile","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/profile.astro","pathname":"/profile","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/register","isIndex":false,"type":"page","pattern":"^\\/register\\/?$","segments":[[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/register.astro","pathname":"/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/security-monitor.CVIBqxkj.css"}],"routeData":{"route":"/security-monitor","isIndex":false,"type":"page","pattern":"^\\/security-monitor\\/?$","segments":[[{"content":"security-monitor","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/security-monitor.astro","pathname":"/security-monitor","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/settings.D2XDOCEV.css"}],"routeData":{"route":"/settings","isIndex":false,"type":"page","pattern":"^\\/settings\\/?$","segments":[[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/settings.astro","pathname":"/settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/TrilhasRow.ChMW8x0m.css"},{"type":"external","src":"_astro/TrilhaCard.CFRX-bvL.css"},{"type":"external","src":"_astro/CourseCard.DwVfnjdf.css"},{"type":"external","src":"_astro/_id_.5MSx7u1S.css"}],"routeData":{"route":"/source/[id]","isIndex":false,"type":"page","pattern":"^\\/source\\/([^/]+?)\\/?$","segments":[[{"content":"source","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/source/[id].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/LessonNotes.Bkqtn3KP.css"},{"type":"external","src":"_astro/_lessonId_.CvR8fgX_.css"}],"routeData":{"route":"/watch/trilha/[trilhaId]/[lessonId]","isIndex":false,"type":"page","pattern":"^\\/watch\\/trilha\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"watch","dynamic":false,"spread":false}],[{"content":"trilha","dynamic":false,"spread":false}],[{"content":"trilhaId","dynamic":true,"spread":false}],[{"content":"lessonId","dynamic":true,"spread":false}]],"params":["trilhaId","lessonId"],"component":"src/pages/watch/trilha/[trilhaId]/[lessonId].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/LessonNotes.Bkqtn3KP.css"},{"type":"external","src":"_astro/_lessonId_.BAk_bY4z.css"}],"routeData":{"route":"/watch/[courseId]/[lessonId]","isIndex":false,"type":"page","pattern":"^\\/watch\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"watch","dynamic":false,"spread":false}],[{"content":"courseId","dynamic":true,"spread":false}],[{"content":"lessonId","dynamic":true,"spread":false}]],"params":["courseId","lessonId"],"component":"src/pages/watch/[courseId]/[lessonId].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.tRcOv5CN.css"},{"type":"external","src":"_astro/TrilhasRow.ChMW8x0m.css"},{"type":"external","src":"_astro/TrilhaCard.CFRX-bvL.css"},{"type":"external","src":"_astro/index.DLJmRmNm.css"},{"type":"external","src":"_astro/CourseCard.DwVfnjdf.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","base":"/","trailingSlash":"ignore","compressHTML":"jsx","componentMetadata":[["D:/projetos antigravity/mindflix/src/pages/404.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/anotacoes.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/course/[id].astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/courses.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/library.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/login.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/my-list.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/profile.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/security-monitor.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/settings.astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/source/[id].astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/watch/[courseId]/[lessonId].astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/watch/trilha/[trilhaId]/[lessonId].astro",{"propagation":"in-tree","containsHead":true}],["D:/projetos antigravity/mindflix/src/pages/register.astro",{"propagation":"none","containsHead":true}],["D:/projetos antigravity/mindflix/src/components/Navbar.astro",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/src/layouts/Layout.astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/404@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:pages",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:manifest",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/app/entrypoints/virtual/prod.js",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:app",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/app/entrypoints/virtual/index.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/@astrojs/netlify/dist/ssr-function.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/manifest/ambient.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/fetch/default-handler.js",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:fetchable",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/app/base.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/app/app.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/middleware/index.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/middleware/astro-middleware.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/errors/default-handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/errors/build-handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/errors/handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/errors/dev-handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/pages/handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/rewrites/handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/fetch/fetch-state.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/actions/runtime/server.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/actions/handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/routing/handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/actions/utils.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/i18n/index.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/i18n/fallback.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/core/i18n/handler.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/i18n/middleware.js",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/node_modules/astro/dist/i18n/utils.js",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/anotacoes@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/course/[id]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/courses@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/library@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/login@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/my-list@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/profile@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/security-monitor@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/settings@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/source/[id]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/watch/[courseId]/[lessonId]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/watch/trilha/[trilhaId]/[lessonId]@_@astro",{"propagation":"in-tree","containsHead":false}],["D:/projetos antigravity/mindflix/src/components/InteractiveBackground.astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000virtual:astro:middleware":"virtual_astro_middleware.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_UK25_e1N.mjs","\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_Z3zFhrGC.mjs","@astrojs/netlify/ssr-function.js":"entry.mjs","\u0000virtual:astro:page:src/pages/404@_@astro":"chunks/404_Dp6JLwa7.mjs","\u0000virtual:astro:page:src/pages/course/[id]@_@astro":"chunks/_id__BYDhOhn1.mjs","\u0000virtual:astro:page:src/pages/source/[id]@_@astro":"chunks/_id__DBBlb9Aw.mjs","\u0000virtual:astro:page:src/pages/fonte/[id]@_@astro":"chunks/_id__DifB__ju.mjs","\u0000virtual:astro:page:src/pages/watch/[courseId]/[lessonId]@_@astro":"chunks/_lessonId__R8R8t-Wt.mjs","\u0000virtual:astro:page:src/pages/watch/trilha/[trilhaId]/[lessonId]@_@astro":"chunks/_lessonId__b18gBERE.mjs","\u0000virtual:astro:page:src/pages/api/search/ai@_@ts":"chunks/ai_DMU0_Mn5.mjs","\u0000virtual:astro:page:src/pages/anotacoes@_@astro":"chunks/anotacoes_DMHJae9O.mjs","\u0000virtual:astro:page:src/pages/api/library/backup@_@ts":"chunks/backup_CtYcNRzj.mjs","\u0000virtual:astro:page:src/pages/api/security/ban@_@ts":"chunks/ban_Bn7WTgkv.mjs","\u0000virtual:astro:page:src/pages/api/library/categories@_@ts":"chunks/categories_CCAYKM6B.mjs","\u0000virtual:astro:page:src/pages/api/auth/change-password@_@ts":"chunks/change-password_Ced4--GR.mjs","\u0000virtual:astro:page:src/pages/api/security/clear-logs@_@ts":"chunks/clear-logs_6ykecwT4.mjs","\u0000virtual:astro:page:src/pages/courses@_@astro":"chunks/courses_Bgp3YIVh.mjs","\u0000virtual:astro:page:src/pages/api/challenges/generate@_@ts":"chunks/generate_DK4ij-43.mjs","\u0000virtual:astro:page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_KPw-3bEX.mjs","D:/projetos antigravity/mindflix/node_modules/@astrojs/netlify/dist/image-service.js":"chunks/image-service_UsrzkfCR.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_Dtbi9m2R.mjs","\u0000virtual:astro:page:src/pages/library@_@astro":"chunks/library__fxlEC0z.mjs","\u0000virtual:astro:page:src/pages/login@_@astro":"chunks/login_8QMk5_yW.mjs","\u0000virtual:astro:page:src/pages/api/auth/login@_@ts":"chunks/login_DUp7vmEV.mjs","\u0000virtual:astro:page:src/pages/api/auth/logout@_@ts":"chunks/logout_DWvGo1yP.mjs","\u0000virtual:astro:page:src/pages/api/auth/me@_@ts":"chunks/me_DxCGqBx7.mjs","\u0000virtual:astro:page:src/pages/my-list@_@astro":"chunks/my-list_B2ClxBgH.mjs","\u0000virtual:astro:page:src/pages/profile@_@astro":"chunks/profile_B0k258jH.mjs","\u0000virtual:astro:page:src/pages/register@_@astro":"chunks/register_DlommvkL.mjs","\u0000virtual:astro:page:src/pages/api/library/scan@_@ts":"chunks/scan_C2bTbmAa.mjs","\u0000virtual:astro:page:src/pages/security-monitor@_@astro":"chunks/security-monitor_B4qrKcjx.mjs","\u0000virtual:astro:page:src/pages/api/security/settings@_@ts":"chunks/settings_B-QMREwn.mjs","\u0000virtual:astro:page:src/pages/settings@_@astro":"chunks/settings_BlLIfThr.mjs","\u0000virtual:astro:page:src/pages/api/security/simulate@_@ts":"chunks/simulate_EDArjS_x.mjs","\u0000virtual:astro:page:src/pages/api/security/stats@_@ts":"chunks/stats_CeW-qwAM.mjs","\u0000virtual:astro:page:src/pages/api/library/update-course@_@ts":"chunks/update-course_vmdEdHAc.mjs","\u0000virtual:astro:page:src/pages/api/video@_@ts":"chunks/video_0TThjCS2.mjs","\u0000virtual:astro:page:src/pages/api/security/whitelist@_@ts":"chunks/whitelist_eR-x2joB.mjs","D:/projetos antigravity/mindflix/src/components/ChallengeModal.astro?astro&type=script&index=0&lang.ts":"_astro/ChallengeModal.astro_astro_type_script_index_0_lang.Jb2A1JkZ.js","D:/projetos antigravity/mindflix/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.CYDbzu1r.js","D:/projetos antigravity/mindflix/src/components/CourseCard.astro?astro&type=script&index=0&lang.ts":"_astro/CourseCard.astro_astro_type_script_index_0_lang.Cnrp7y79.js","D:/projetos antigravity/mindflix/src/components/CourseDetailModal.astro?astro&type=script&index=0&lang.ts":"_astro/CourseDetailModal.astro_astro_type_script_index_0_lang.DVubk-gp.js","D:/projetos antigravity/mindflix/src/components/CourseRow.astro?astro&type=script&index=0&lang.ts":"_astro/CourseRow.astro_astro_type_script_index_0_lang.CTnMKg55.js","D:/projetos antigravity/mindflix/src/components/FocusMode.astro?astro&type=script&index=0&lang.ts":"_astro/FocusMode.astro_astro_type_script_index_0_lang.DaDsxnmN.js","D:/projetos antigravity/mindflix/src/components/HeroCourse.astro?astro&type=script&index=0&lang.ts":"_astro/HeroCourse.astro_astro_type_script_index_0_lang.BKpKhKpb.js","D:/projetos antigravity/mindflix/src/components/InteractiveBackground.astro?astro&type=script&index=0&lang.ts":"_astro/InteractiveBackground.astro_astro_type_script_index_0_lang.C9fbFFis.js","D:/projetos antigravity/mindflix/src/components/LessonItem.astro?astro&type=script&index=0&lang.ts":"_astro/LessonItem.astro_astro_type_script_index_0_lang.ejRBlLx1.js","D:/projetos antigravity/mindflix/src/components/LessonNotes.astro?astro&type=script&index=0&lang.ts":"_astro/LessonNotes.astro_astro_type_script_index_0_lang.BwXGaitC.js","D:/projetos antigravity/mindflix/src/components/ModuleAccordion.astro?astro&type=script&index=0&lang.ts":"_astro/ModuleAccordion.astro_astro_type_script_index_0_lang.BIKU3W2H.js","D:/projetos antigravity/mindflix/src/components/Navbar.astro?astro&type=script&index=0&lang.ts":"_astro/Navbar.astro_astro_type_script_index_0_lang.CO_IHqIE.js","D:/projetos antigravity/mindflix/src/components/PlaylistSidebar.astro?astro&type=script&index=0&lang.ts":"_astro/PlaylistSidebar.astro_astro_type_script_index_0_lang.cv7tABsE.js","D:/projetos antigravity/mindflix/src/components/SearchBar.astro?astro&type=script&index=0&lang.ts":"_astro/SearchBar.astro_astro_type_script_index_0_lang.BBhCfPID.js","D:/projetos antigravity/mindflix/src/components/Toast.astro?astro&type=script&index=0&lang.ts":"_astro/Toast.astro_astro_type_script_index_0_lang.DJahjDbV.js","D:/projetos antigravity/mindflix/src/components/TrilhasRow.astro?astro&type=script&index=0&lang.ts":"_astro/TrilhasRow.astro_astro_type_script_index_0_lang._qo5CuKs.js","D:/projetos antigravity/mindflix/src/components/VideoPlayer.astro?astro&type=script&index=0&lang.ts":"_astro/VideoPlayer.astro_astro_type_script_index_0_lang.Byoe6W15.js","D:/projetos antigravity/mindflix/src/pages/course/[id].astro?astro&type=script&index=0&lang.ts":"_astro/_id_.astro_astro_type_script_index_0_lang.KeFskOLA.js","D:/projetos antigravity/mindflix/src/pages/watch/trilha/[trilhaId]/[lessonId].astro?astro&type=script&index=0&lang.ts":"_astro/_lessonId_.astro_astro_type_script_index_0_lang.Bl6JgJEQ.js","D:/projetos antigravity/mindflix/src/pages/watch/[courseId]/[lessonId].astro?astro&type=script&index=0&lang.ts":"_astro/_lessonId_.astro_astro_type_script_index_0_lang.CuA0pvRv.js","D:/projetos antigravity/mindflix/src/pages/anotacoes.astro?astro&type=script&index=0&lang.ts":"_astro/anotacoes.astro_astro_type_script_index_0_lang.bbel5PBF.js","D:/projetos antigravity/mindflix/src/pages/courses.astro?astro&type=script&index=0&lang.ts":"_astro/courses.astro_astro_type_script_index_0_lang.BG60Ecq2.js","D:/projetos antigravity/mindflix/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.BW5eGel9.js","D:/projetos antigravity/mindflix/src/pages/library.astro?astro&type=script&index=0&lang.ts":"_astro/library.astro_astro_type_script_index_0_lang.DLEn20TN.js","D:/projetos antigravity/mindflix/src/pages/login.astro?astro&type=script&index=0&lang.ts":"_astro/login.astro_astro_type_script_index_0_lang.B3wvV182.js","D:/projetos antigravity/mindflix/src/pages/my-list.astro?astro&type=script&index=0&lang.ts":"_astro/my-list.astro_astro_type_script_index_0_lang.B4bHOlWK.js","D:/projetos antigravity/mindflix/src/pages/profile.astro?astro&type=script&index=0&lang.ts":"_astro/profile.astro_astro_type_script_index_0_lang.WrYTo-QW.js","D:/projetos antigravity/mindflix/src/pages/security-monitor.astro?astro&type=script&index=0&lang.ts":"_astro/security-monitor.astro_astro_type_script_index_0_lang.ClPi0HJQ.js","D:/projetos antigravity/mindflix/src/pages/settings.astro?astro&type=script&index=0&lang.ts":"_astro/settings.astro_astro_type_script_index_0_lang.CsKzvaE8.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["D:/projetos antigravity/mindflix/src/components/SearchBar.astro?astro&type=script&index=0&lang.ts","var e=document.getElementById(`global-search-input`),t=document.getElementById(`clear-search-btn`),n=document.getElementById(`trigger-ai-modal-btn`),r=document.querySelectorAll(`.quick-filter-chip`);if(e&&t){let n=()=>{t.style.display=e.value.trim().length>0?`flex`:`none`};e.addEventListener(`input`,n),n(),t.addEventListener(`click`,()=>{e.value=``,n(),e.focus(),e.dispatchEvent(new Event(`input`,{bubbles:!0}))});let r=()=>{let t=e.value.trim();typeof window.openSearchModal==`function`?window.openSearchModal(`all`,t):window.dispatchEvent(new CustomEvent(`mindflix:open-search`,{detail:{type:`all`,query:t}}))};e.addEventListener(`click`,r),e.addEventListener(`focus`,r),document.querySelector(`.search-input-wrapper`)?.addEventListener(`click`,e=>{let t=e.target;t?.closest(`#clear-search-btn`)||t?.closest(`#trigger-ai-modal-btn`)||r()})}n?.addEventListener(`click`,()=>{let t=e?.value.trim()||``;typeof window.openSearchModal==`function`?window.openSearchModal(`ai`,t):window.dispatchEvent(new CustomEvent(`mindflix:open-search`,{detail:{type:`ai`,query:t}}))}),r.forEach(t=>{t.addEventListener(`click`,()=>{r.forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`);let n=t.getAttribute(`data-type`)||`all`,i=e?.value.trim()||``;n===`ai`?typeof window.openSearchModal==`function`?window.openSearchModal(`ai`,i):window.dispatchEvent(new CustomEvent(`mindflix:open-search`,{detail:{type:`ai`,query:i}})):n===`module`||n===`lesson`?typeof window.openSearchModal==`function`?window.openSearchModal(n,i):window.dispatchEvent(new CustomEvent(`mindflix:open-search`,{detail:{type:n,query:i}})):window.dispatchEvent(new CustomEvent(`mindflix:catalog-filter-type`,{detail:{type:n}}))})});"],["D:/projetos antigravity/mindflix/src/components/Toast.astro?astro&type=script&index=0&lang.ts","var e=document.getElementById(`toast-container`);window.addEventListener(`mindflix:toast`,(t=>{if(!e)return;let{message:n,type:r=`success`,duration:i=3e3}=t.detail,a=document.createElement(`div`);a.className=`toast-item toast-${r}`;let o=``;o=r===`success`?`<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>`:r===`warning`?`<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"8\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"16\" x2=\"12.01\" y2=\"16\"></line></svg>`:`<svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"12\" y1=\"16\" x2=\"12\" y2=\"12\"></line><line x1=\"12\" y1=\"8\" x2=\"12.01\" y2=\"8\"></line></svg>`,a.innerHTML=`\n      <span class=\"toast-icon\">${o}</span>\n      <span class=\"toast-text\">${n}</span>\n    `,e.appendChild(a),requestAnimationFrame(()=>{a.classList.add(`visible`)}),setTimeout(()=>{a.classList.remove(`visible`),a.classList.add(`leaving`),setTimeout(()=>{a.remove()},250)},i)}));"],["D:/projetos antigravity/mindflix/src/pages/watch/trilha/[trilhaId]/[lessonId].astro?astro&type=script&index=0&lang.ts","document.querySelectorAll(`.btn-challenge-trigger`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-challenge-mode`)||`lesson`,n=e.getAttribute(`data-course-id`)||``,r=e.getAttribute(`data-lesson-id`)||void 0,i=e.getAttribute(`data-lesson-title`)||void 0;window.dispatchEvent(new CustomEvent(`mindflix:open-challenge`,{detail:{mode:t,courseId:n,lessonId:r,lessonTitle:i}}))})});"],["D:/projetos antigravity/mindflix/src/pages/watch/[courseId]/[lessonId].astro?astro&type=script&index=0&lang.ts","var e=document.getElementById(`btn-watch-grade-modal`);e&&e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-course-id`);t&&window.openCourseModal&&window.openCourseModal(t)}),document.querySelectorAll(`.btn-challenge-trigger`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-challenge-mode`)||`lesson`,n=e.getAttribute(`data-course-id`)||``,r=e.getAttribute(`data-lesson-id`)||void 0,i=e.getAttribute(`data-module-id`)||void 0,a=e.getAttribute(`data-lesson-title`)||void 0,o=e.getAttribute(`data-module-title`)||void 0;window.dispatchEvent(new CustomEvent(`mindflix:open-challenge`,{detail:{mode:t,courseId:n,lessonId:r,moduleId:i,lessonTitle:a,moduleTitle:o}}))})});"]],"assets":["/favicon.ico","/favicon.svg","/covers/course-10-marmitas-fit-e-funcionais.jpg","/covers/course-abre-a-camera.jpg","/covers/course-agentes-de-ia-e-n8n-impressionador.jpg","/covers/course-airflow-na-pratica-etl-profissional-com-containers-nao-docker-compose.jpg","/covers/course-analisando-dados-com-pandas-sql.jpg","/covers/course-analise-de-dados-em-10-minutos-com-claude-code.jpg","/covers/course-analise-exploratoria-de-dados.jpg","/covers/course-apis-para-iniciantes-http-requests-e-apis-com-python.jpg","/covers/course-aplicacoes-ia-comece-por-aqui.jpg","/covers/course-aplicacoes-ia.jpg","/covers/course-aprendendo-python-conceitos-basicos.jpg","/covers/course-arvores-de-decisao-e-ensemble-learning.jpg","/covers/course-autoconhecimento-e-conexao-com-o-outro.jpg","/covers/course-automacoes-com-n8n-introducao-pratica.jpg","/covers/course-automatizando-excel.jpg","/covers/course-banco-de-integracoes-conectando-n8n-com-qualquer-ferramenta.jpg","/covers/course-bullet-journal-sistema-de-organizacao-no-papel.jpg","/covers/course-carros-de-leilao.jpg","/covers/course-ciclo-1-carreira-tech-despertar.jpg","/covers/course-claude-desktop-e-cowork.jpg","/covers/course-claude-impressionador.jpg","/covers/course-cnv-comunicacao-nao-violenta.jpg","/covers/course-comece-aqui-nivel-intermediario-engenheiros-de-agentes-de-ia.jpg","/covers/course-comece-por-aqui-agentes-com-gpt.jpg","/covers/course-comece-por-aqui-aplicacoes-ia-com-python.jpg","/covers/course-comece-por-aqui-criando-agentes-pessoais-com-hermes-agent.jpg","/covers/course-comece-por-aqui-dominando-o-ecossistema-claude.jpg","/covers/course-comece-por-aqui-ferramentas-de-ai-para-desenvolvedores.jpg","/covers/course-comece-por-aqui-trilha-sites-profissionais-com-ia.jpg","/covers/course-como-estudar-e-pensar-de-forma-inteligente.jpg","/covers/course-como-migrar-de-carreira-para-analise-de-dados.jpg","/covers/course-como-vender-seu-codigo-comunique-seu-valor-e-atraia-oportunidades.jpg","/covers/course-comunicacao-com-impacto-e-seguranca.jpg","/covers/course-conceitos-de-engenharia-de-dados.jpg","/covers/course-construindo-sites-estaticos-de-alto-nivel-com-ia.jpg","/covers/course-construindo-sites-profissionais-com-astro.jpg","/covers/course-consumindo-apis-com-n8n.jpg","/covers/course-criando-agentes-com-agno.jpg","/covers/course-criando-agentes-de-atendimento-profissionais-nao-whatsapp.jpg","/covers/course-criando-aplicativos-web-com-streamlit.jpg","/covers/course-criando-influencer-digital.jpg","/covers/course-criando-nosso-primeiro-agente-com-chatgpt.jpg","/covers/course-criando-seu-setup-para-programacao-python.jpg","/covers/course-cursor-3-desenvolvimento-assistido-por-ia.jpg","/covers/course-cursorai-ganhe-10x-mais-produtividade-com-a-ide-de-ia.jpg","/covers/course-cv-linkedin-e-entrevista-guia-completo-para-processos-seletivos.jpg","/covers/course-dashboards-com-dash.jpg","/covers/course-docker-do-zero-como-usar-e-criar-containers-rodando-python.jpg","/covers/course-dominando-automacoes-com-n8n.jpg","/covers/course-dominando-o-antigravity.jpg","/covers/course-dominando-o-openclaw.jpg","/covers/course-engenharia-de-prompt-para-analistas.jpg","/covers/course-engenharia-de-prompts.jpg","/covers/course-especializacao-no-code.jpg","/covers/course-estatistica-para-iniciantes-aprenda-a-pensar-como-um-analista.jpg","/covers/course-fundamentos-da-ia-generativa.jpg","/covers/course-fundamentos-de-ai-e-machine-learning.jpg","/covers/course-fundamentos-de-alta-performance-pessoal.jpg","/covers/course-fundamentos-de-analise-de-dados-com-ia.jpg","/covers/course-fundamentos-do-vibe-design.jpg","/covers/course-gerando-imagens-profissionais-com-ia.jpg","/covers/course-gestao-de-tempo-o-minimo-para-nao-viver-no-caos.jpg","/covers/course-git-e-github-controle-de-versao-e-colaboracao.jpg","/covers/course-graficos-interativos-com-plotly.jpg","/covers/course-hermes-agent.jpg","/covers/course-ingles-para-desenvolvedores.jpg","/covers/course-inteligencia-artificial-impressionador.jpg","/covers/course-introducao-a-automacoes-com-python.jpg","/covers/course-introducao-a-biblioteca-numpy.jpg","/covers/course-introducao-a-inteligencia-artificial.jpg","/covers/course-introducao-a-logica-de-programacao.jpg","/covers/course-introducao-a-programacao-orientada-a-objetos-com-python.jpg","/covers/course-introducao-a-python-para-empresas.jpg","/covers/course-introducao-a-python-para-web.jpg","/covers/course-introducao-ao-data-science.jpg","/covers/course-leitura-e-memoria.jpg","/covers/course-lendo-e-escrevendo-arquivos.jpg","/covers/course-lideranca-e-inteligencia-emocional.jpg","/covers/course-linux-na-pratica-so-mais-utilizado-nao-mercado.jpg","/covers/course-lovable-impressionador-apps-com-ia.jpg","/covers/course-marmitas-fit-congelada.jpg","/covers/course-massagem-anti-stress.jpg","/covers/course-masterclass-claude-code.jpg","/covers/course-masterclass-claude-design.jpg","/covers/course-matematica-para-analise-de-dados.jpg","/covers/course-metodo-triade-mais-que-musica.jpg","/covers/course-modelos-de-classificacao-e-regressao.jpg","/covers/course-modelos-nao-supervisionados.jpg","/covers/course-modernizando-sites-antigos-com-design-systems.jpg","/covers/course-n8n-open-source-use-a-ferramenta-de-forma-gratuita.jpg","/covers/course-onboarding-engenheiro-de-agentes-de-ia.jpg","/covers/course-oratoria-e-a-arte-da-transmissao.jpg","/covers/course-pao-sem-gluten-panificacao-saudavel.jpg","/covers/course-por-dentro-das-llms.jpg","/covers/course-practitioner-em-pnl.jpg","/covers/course-produtividade-nao-e-sobre-fazer-mais.jpg","/covers/course-programacao-front-end-e-back-end.jpg","/covers/course-projeto-60-dias-transformacao-completa.jpg","/covers/course-projeto-agente-de-curadoria-de-noticias.jpg","/covers/course-projeto-agente-de-ia-para-criacao-de-conteudo.jpg","/covers/course-projeto-analisando-dados-de-facebook-ads-com-dashboards.jpg","/covers/course-projeto-analise-de-dados-da-fifa-com-streamlit.jpg","/covers/course-projeto-analise-de-dados-de-obesidade-e-pib.jpg","/covers/course-projeto-analise-dos-precos-da-gasolina-nao-brasil.jpg","/covers/course-projeto-appferias-webapp-para-gestao-de-ferias-de-funcionarios.jpg","/covers/course-projeto-asimessenger-desenvolvendo-um-sistema-de-chat-com-streamlit.jpg","/covers/course-projeto-asimov-associates-webapp-para-gestao-de-escritorio-de-advocacia.jpg","/covers/course-projeto-asimov-transcripts-transcrevendo-aaudios-com-chatgpt.jpg","/covers/course-projeto-asimovgpt-recriando-o-chatgpt-em-streamlit.jpg","/covers/course-projeto-assistente-de-agendamento-online-com-n8n-calcom-e-ia.jpg","/covers/course-projeto-assistente-financeiro-no-telegram-com-n8n.jpg","/covers/course-projeto-auto-retoucher-criando-uma-ai-para-fotografos.jpg","/covers/course-projeto-auto-retoucher.jpg","/covers/course-projeto-avaliador-de-curriculos.jpg","/covers/course-projeto-browser-use-na-pratica-webscraping-com-agentes.jpg","/covers/course-projeto-calendar-app-criando-um-calendario-com-dash.jpg","/covers/course-projeto-chat-deepseek-rodando-localmente.jpg","/covers/course-projeto-claude-code-na-pratica-evoluindo-um-projeto-com-ia.jpg","/covers/course-projeto-como-rodar-codigos-automaticamente-utilizando-cron.jpg","/covers/course-projeto-construa-sua-pagina-web-com-n8n.jpg","/covers/course-projeto-criacao-de-folhetos-educativos.jpg","/covers/course-projeto-criador-de-roteiro-de-entrevista.jpg","/covers/course-projeto-criando-base-de-dados-com-sqlalchemy-um-crud-completo.jpg","/covers/course-projeto-criando-tela-de-registro-e-login-em-dash.jpg","/covers/course-projeto-criando-um-assistente-pessoal-com-openclaw.jpg","/covers/course-projeto-criando-um-planner-editavel-em-pdf-com-python.jpg","/covers/course-projeto-dash-covid-analise-de-dados-da-covid-19.jpg","/covers/course-projeto-dashboard-de-analise-de-vendas-em-supermercados.jpg","/covers/course-projeto-dashboard-de-desempenho-esportivo.jpg","/covers/course-projeto-dashboard-para-gestao-de-hospitais.jpg","/covers/course-projeto-deploy-com-streamlit-cloud.jpg","/covers/course-projeto-deploy-na-google-cloud-platform-gcp-usando-cloud-run.jpg","/covers/course-projeto-docstoteles-rag-web-scraping.jpg","/covers/course-projeto-etl-basico-acessando-api-de-aeroporto-com-python-e-postman.jpg","/covers/course-projeto-extraindo-dados-de-mercado-financeiro-com-metatriader.jpg","/covers/course-projeto-extraindo-e-analisando-dados-do-brasileirao.jpg","/covers/course-projeto-filmpro-agente-para-recomendacao-de-filmes.jpg","/covers/course-projeto-funil-de-captacao-com-clone-de-voz-elevenlabs-whatsapp.jpg","/covers/course-projeto-game-analysis-dashboard-de-vendas-de-videogames.jpg","/covers/course-projeto-gerador-de-avaliacoes-com-claude.jpg","/covers/course-projeto-gerador-de-cv.jpg","/covers/course-projeto-gerador-de-plano-de-aula-com-claude.jpg","/covers/course-projeto-gerador-de-slides-com-claude.jpg","/covers/course-projeto-gerando-relatorios-pdf-via-excel.jpg","/covers/course-projeto-ia-para-faq-atendimento-automatico-no-whatsapp.jpg","/covers/course-projeto-lendo-boletos-com-python.jpg","/covers/course-projeto-lista-de-compras-inteligente.jpg","/covers/course-projeto-montando-seu-primeiro-relatorio-profissional-em-dados.jpg","/covers/course-projeto-mybudget-web-app-de-gestao-financeira.jpg","/covers/course-projeto-newsletter-financeira-com-agno.jpg","/covers/course-projeto-nyc-sales-dashboard-de-vendas-de-imoveis.jpg","/covers/course-projeto-pdftools-webapp-para-manipulacao-de-pdfs.jpg","/covers/course-projeto-planejador-alimentar.jpg","/covers/course-projeto-portfolio-com-vibe-design.jpg","/covers/course-projeto-rclone-e-cron-backup-automatico-dos-seus-arquivos.jpg","/covers/course-projeto-regressao-logistica-em-dados-de-publicidade.jpg","/covers/course-projeto-sales-analysis-dashboard-de-vendas-de-call-center.jpg","/covers/course-projeto-salesapp-webapp-para-controle-e-analise-de-vendas.jpg","/covers/course-projeto-site-3d-do-redbull-com-threejs-e-gsap.jpg","/covers/course-projeto-stocks-monitor-monitorando-carteiras-de-investimento-com-dash.jpg","/covers/course-projeto-stocksgpt-criando-um-consultor-financeiro-com-chatgpt.jpg","/covers/course-projeto-tela-de-login-autenticacao-com-streamlit.jpg","/covers/course-projeto-ugc-factory-videos-ugc-no-n8n.jpg","/covers/course-projeto-videos-360-de-produtos-com-ia.jpg","/covers/course-python-para-dados-do-zero-a-analise-completa.jpg","/covers/course-python-para-dados.jpg","/covers/course-python-para-usuarios-de-excel.jpg","/covers/course-python-starter.jpg","/covers/course-sql-na-pratica-domine-bancos-de-dados-postgresql-e-pgadmin.jpg","/covers/course-supabase-impressionador-backend-moderno.jpg","/covers/course-visualizacao-de-dados-com-matplotlib.jpg","/_astro/anotacoes.astro_astro_type_script_index_0_lang.bbel5PBF.js","/_astro/auth.Bm3wANqh.js","/_astro/catalog.CGanxVI8.js","/_astro/ChallengeModal.astro_astro_type_script_index_0_lang.Jb2A1JkZ.js","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.CYDbzu1r.js","/_astro/CourseCard.astro_astro_type_script_index_0_lang.Cnrp7y79.js","/_astro/CourseDetailModal.astro_astro_type_script_index_0_lang.DVubk-gp.js","/_astro/CourseRow.astro_astro_type_script_index_0_lang.CTnMKg55.js","/_astro/courses.astro_astro_type_script_index_0_lang.BG60Ecq2.js","/_astro/FocusMode.astro_astro_type_script_index_0_lang.DaDsxnmN.js","/_astro/HeroCourse.astro_astro_type_script_index_0_lang.BKpKhKpb.js","/_astro/index.astro_astro_type_script_index_0_lang.BW5eGel9.js","/_astro/InteractiveBackground.astro_astro_type_script_index_0_lang.C9fbFFis.js","/_astro/LessonItem.astro_astro_type_script_index_0_lang.ejRBlLx1.js","/_astro/LessonNotes.astro_astro_type_script_index_0_lang.BwXGaitC.js","/_astro/library.astro_astro_type_script_index_0_lang.DLEn20TN.js","/_astro/login.astro_astro_type_script_index_0_lang.B3wvV182.js","/_astro/ModuleAccordion.astro_astro_type_script_index_0_lang.BIKU3W2H.js","/_astro/my-list.astro_astro_type_script_index_0_lang.B4bHOlWK.js","/_astro/Navbar.astro_astro_type_script_index_0_lang.CO_IHqIE.js","/_astro/notes.Ef4bhgPe.js","/_astro/PlaylistSidebar.astro_astro_type_script_index_0_lang.cv7tABsE.js","/_astro/profile.astro_astro_type_script_index_0_lang.WrYTo-QW.js","/_astro/progress.IsXEU7Ct.js","/_astro/security-monitor.astro_astro_type_script_index_0_lang.ClPi0HJQ.js","/_astro/settings.astro_astro_type_script_index_0_lang.CsKzvaE8.js","/_astro/sources.Bq5TPNE9.js","/_astro/supabase.Bl39ucec.js","/_astro/theme.CsQVhIHL.js","/_astro/toast.db1DsUwS.js","/_astro/TrilhasRow.astro_astro_type_script_index_0_lang._qo5CuKs.js","/_astro/VideoPlayer.astro_astro_type_script_index_0_lang.Byoe6W15.js","/_astro/_id_.astro_astro_type_script_index_0_lang.KeFskOLA.js","/_astro/CourseCard.DwVfnjdf.css","/_astro/Layout.tRcOv5CN.css","/_astro/LessonNotes.Bkqtn3KP.css","/_astro/TrilhaCard.CFRX-bvL.css","/_astro/TrilhasRow.ChMW8x0m.css","/_astro/anotacoes.6CiJS4IF.css","/_astro/courses.B0jC90aW.css","/_astro/index.DLJmRmNm.css","/_astro/library.COqNvVCF.css","/_astro/profile.BxRq6LwY.css","/_astro/security-monitor.CVIBqxkj.css","/_astro/settings.D2XDOCEV.css","/_astro/_id_.5MSx7u1S.css","/_astro/_lessonId_.BAk_bY4z.css","/_astro/_lessonId_.CvR8fgX_.css"],"buildFormat":"directory","checkOrigin":true,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"8YycK0CVdImLwgdZRWONrGZvkDa+yWLdlMGBetnben8=","sessionConfig":{"driver":"unstorage/drivers/netlify-blobs","options":{"name":"astro-sessions","consistency":"strong"}},"image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false});
var manifestRoutes = _manifest.routes;
var manifest = Object.assign(_manifest, {
	renderers,
	actions: () => import("./chunks/noop-entrypoint_Z3zFhrGC.mjs"),
	middleware: () => import("./virtual_astro_middleware.mjs"),
	sessionDriver: () => import("./chunks/_virtual_astro_session-driver_UK25_e1N.mjs"),
	serverIslandMappings: () => import("./chunks/_virtual_astro_server-island-manifest_C1Q2srgE.mjs"),
	routes: manifestRoutes,
	pageMap
});
function getAmbientManifest() {
	const manifest$1 = manifest;
	if (!manifest$1) throw new AstroError(NoManifestAvailable);
	return manifest$1;
}
//#endregion
//#region node_modules/astro/dist/core/app/render-options.js
var renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
function getRenderOptions(request) {
	return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
	Reflect.set(request, renderOptionsSymbol, options);
}
//#endregion
//#region node_modules/astro/dist/core/app/origin-check.js
var FORM_CONTENT_TYPES = [
	"application/x-www-form-urlencoded",
	"multipart/form-data",
	"text/plain"
];
var SAFE_METHODS = [
	"GET",
	"HEAD",
	"OPTIONS"
];
function isForbiddenCrossOriginRequest(request, url, isPrerendered) {
	if (isPrerendered) return false;
	if (SAFE_METHODS.includes(request.method)) return false;
	const isSameOrigin = request.headers.get("origin") === url.origin;
	if (request.headers.has("content-type")) return hasFormLikeHeader(request.headers.get("content-type")) && !isSameOrigin;
	return !isSameOrigin;
}
function createCrossOriginForbiddenResponse(request) {
	return new Response(`Cross-site ${request.method} form submissions are forbidden`, { status: 403 });
}
function createOriginCheckMiddleware() {
	return defineMiddleware((context, next) => {
		const { request, url, isPrerendered } = context;
		if (isForbiddenCrossOriginRequest(request, url, isPrerendered)) return createCrossOriginForbiddenResponse(request);
		return next();
	});
}
function hasFormLikeHeader(contentType) {
	if (contentType) {
		for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) return true;
	}
	return false;
}
//#endregion
//#region node_modules/astro/dist/core/fetch/features.js
var FetchFeatures = {
	redirects: 1,
	sessions: 2,
	actions: 4,
	middleware: 8,
	i18n: 16,
	cache: 32
};
var ALL_FETCH_FEATURES = FetchFeatures.redirects | FetchFeatures.sessions | FetchFeatures.actions | FetchFeatures.middleware | FetchFeatures.i18n | FetchFeatures.cache;
var usedFeatures = /* @__PURE__ */ new WeakMap();
function markFeatureUsed(manifest, feature) {
	const entry = usedFeatures.get(manifest);
	if (entry) entry.bits |= feature;
	else usedFeatures.set(manifest, { bits: feature });
}
function getUsedFeatures(manifest) {
	return usedFeatures.get(manifest)?.bits ?? 0;
}
var ACTION_QUERY_PARAMS = {
	actionName: "_action",
	actionPayload: "_astroActionPayload"
};
//#endregion
//#region node_modules/astro/dist/actions/runtime/client.js
var codeToStatusMap = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	CONTENT_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_CONTENT: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NETWORK_AUTHENTICATION_REQUIRED: 511
};
var statusToCodeMap = Object.fromEntries(Object.entries(codeToStatusMap).map(([key, value]) => [value, key]));
var ActionError = class ActionError extends Error {
	type = "AstroActionError";
	code = "INTERNAL_SERVER_ERROR";
	status = 500;
	constructor(params) {
		super(params.message);
		this.code = params.code;
		this.status = ActionError.codeToStatus(params.code);
		if (params.stack) this.stack = params.stack;
	}
	static codeToStatus(code) {
		return codeToStatusMap[code];
	}
	static statusToCode(status) {
		return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
	}
	static fromJson(body) {
		if (isInputError(body)) return new ActionInputError(body.issues);
		if (isActionError(body)) return new ActionError(body);
		return new ActionError({ code: "INTERNAL_SERVER_ERROR" });
	}
};
function isActionError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionError";
}
function isInputError(error) {
	return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionInputError" && "issues" in error && Array.isArray(error.issues);
}
var ActionInputError = class extends ActionError {
	type = "AstroActionInputError";
	issues;
	fields;
	constructor(issues) {
		super({
			message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
			code: "BAD_REQUEST"
		});
		this.issues = issues;
		this.fields = {};
		for (const issue of issues) if (issue.path.length > 0) {
			const key = issue.path[0].toString();
			this.fields[key] ??= [];
			this.fields[key]?.push(issue.message);
		}
	}
};
function deserializeActionResult(res) {
	if (res.type === "error") {
		let json;
		try {
			json = JSON.parse(res.body);
		} catch {
			return {
				data: void 0,
				error: new ActionError({
					message: res.body,
					code: "INTERNAL_SERVER_ERROR"
				})
			};
		}
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, { OS: "Windows_NT" })?.PROD) return {
			error: ActionError.fromJson(json),
			data: void 0
		};
		else {
			const error = ActionError.fromJson(json);
			error.stack = actionResultErrorStack.get();
			return {
				error,
				data: void 0
			};
		}
	}
	if (res.type === "empty") return {
		data: void 0,
		error: void 0
	};
	return {
		data: parse(res.body, { URL: (href) => new URL(href) }),
		error: void 0
	};
}
var actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
	let errorStack;
	return {
		set(stack) {
			errorStack = stack;
		},
		get() {
			return errorStack;
		}
	};
})();
function getActionQueryString(name) {
	return `?${new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name }).toString()}`;
}
//#endregion
//#region node_modules/astro/dist/actions/utils.js
function hasActionPayload(locals) {
	return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
	return (actionFn) => {
		if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) return;
		return deserializeActionResult(locals._actionPayload.actionResult);
	};
}
function createCallAction(context) {
	return (baseAction, input) => {
		Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
		return baseAction.bind(context)(input);
	};
}
//#endregion
//#region node_modules/astro/dist/core/cookies/cookies.js
var DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
var DELETED_VALUE = "deleted";
var responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
var identity = (value) => value;
var AstroCookie = class {
	value;
	constructor(value) {
		this.value = value;
	}
	json() {
		if (this.value === void 0) throw new Error(`Cannot convert undefined to an object.`);
		return JSON.parse(this.value);
	}
	number() {
		return Number(this.value);
	}
	boolean() {
		if (this.value === "false") return false;
		if (this.value === "0") return false;
		return Boolean(this.value);
	}
};
var AstroCookies = class {
	#request;
	#requestValues;
	#outgoing;
	#consumed;
	#logger;
	constructor(request, logger) {
		this.#request = request;
		this.#requestValues = null;
		this.#outgoing = null;
		this.#consumed = false;
		this.#logger = logger;
	}
	/**
	* Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
	* in a Set-Cookie header added to the response.
	* @param key The cookie to delete
	* @param options Options related to this deletion, such as the path of the cookie.
	*/
	delete(key, options) {
		this.#ensureOutgoingMap().set(key, [
			DELETED_VALUE,
			stringifySetCookie({
				...options,
				name: key,
				value: DELETED_VALUE,
				expires: DELETED_EXPIRATION,
				maxAge: void 0
			}),
			false
		]);
	}
	/**
	* Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
	* request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
	* from that set call, overriding any values already part of the request.
	* @param key The cookie to get.
	* @returns An object containing the cookie value as well as convenience methods for converting its value.
	*/
	get(key, options = void 0) {
		if (this.#outgoing?.has(key)) {
			let [serializedValue, , isSetValue] = this.#outgoing.get(key);
			if (isSetValue) return new AstroCookie(serializedValue);
			else return;
		}
		const decode = options?.decode ?? decodeURIComponent;
		const values = this.#ensureParsed();
		if (key in values) {
			const value = values[key];
			if (value) {
				let decodedValue;
				try {
					decodedValue = decode(value);
				} catch (_error) {
					decodedValue = value;
				}
				return new AstroCookie(decodedValue);
			}
		}
	}
	/**
	* Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
	* part of the initial request or set via Astro.cookies.set(key)
	* @param key The cookie to check for.
	* @param _options This parameter is no longer used.
	* @returns
	*/
	has(key, _options) {
		if (this.#outgoing?.has(key)) {
			let [, , isSetValue] = this.#outgoing.get(key);
			return isSetValue;
		}
		return this.#ensureParsed()[key] !== void 0;
	}
	/**
	* Astro.cookies.set(key, value) is used to set a cookie's value. If provided
	* an object it will be stringified via JSON.stringify(value). Additionally you
	* can provide options customizing how this cookie will be set, such as setting httpOnly
	* in order to prevent the cookie from being read in client-side JavaScript.
	* @param key The name of the cookie to set.
	* @param value A value, either a string or other primitive or an object.
	* @param options Options for the cookie, such as the path and security settings.
	*/
	set(key, value, options) {
		if (this.#consumed) this.#logger.warn("SKIP_FORMAT", "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page.");
		let serializedValue;
		if (typeof value === "string") serializedValue = value;
		else {
			let toStringValue = value.toString();
			if (toStringValue === Object.prototype.toString.call(value)) serializedValue = JSON.stringify(value);
			else serializedValue = toStringValue;
		}
		const { encode, ...attributes } = options ?? {};
		this.#ensureOutgoingMap().set(key, [
			serializedValue,
			stringifySetCookie({
				...attributes,
				name: key,
				value: serializedValue
			}, { encode }),
			true
		]);
		if (this.#request[responseSentSymbol]) throw new AstroError({ ...ResponseSentError });
	}
	/**
	* Merges a new AstroCookies instance into the current instance. Any new cookies
	* will be added to the current instance, overwriting any existing cookies with the same name.
	*/
	merge(cookies) {
		const outgoing = cookies.#outgoing;
		if (outgoing) for (const [key, value] of outgoing) this.#ensureOutgoingMap().set(key, value);
	}
	/**
	* Astro.cookies.header() returns an iterator for the cookies that have previously
	* been set by either Astro.cookies.set() or Astro.cookies.delete().
	* This method is primarily used by adapters to set the header on outgoing responses.
	* @returns
	*/
	*headers() {
		if (this.#outgoing == null) return;
		for (const [, value] of this.#outgoing) yield value[1];
	}
	/**
	* Marks the cookies as consumed and returns the header values.
	* After consumption, any subsequent `set()` calls will warn.
	*/
	consume() {
		this.#consumed = true;
		return this.headers();
	}
	/**
	* @deprecated Use the instance method `cookies.consume()` instead.
	* Kept for backward compatibility with adapters.
	*/
	static consume(cookies) {
		return cookies.consume();
	}
	#ensureParsed() {
		if (!this.#requestValues) this.#parse();
		if (!this.#requestValues) this.#requestValues = /* @__PURE__ */ Object.create(null);
		return this.#requestValues;
	}
	#ensureOutgoingMap() {
		if (!this.#outgoing) this.#outgoing = /* @__PURE__ */ new Map();
		return this.#outgoing;
	}
	#parse() {
		const raw = this.#request.headers.get("cookie");
		if (!raw) return;
		this.#requestValues = parseCookie(raw, { decode: identity });
	}
};
//#endregion
//#region node_modules/astro/dist/core/cookies/response.js
var astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
	Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
	let cookies = Reflect.get(response, astroCookiesSymbol);
	if (cookies != null) return cookies;
	else return;
}
function* getSetCookiesFromResponse(response) {
	const cookies = getCookiesFromResponse(response);
	if (!cookies) return [];
	for (const headerValue of cookies.consume()) yield headerValue;
	return [];
}
//#endregion
//#region node_modules/astro/dist/core/routing/pattern.js
function getPattern(segments, base, addTrailingSlash) {
	const pathname = segments.map((segment) => {
		if (segment.length === 1 && segment[0].spread) return "(?:\\/(.*?))?";
		else return "\\/" + segment.map((part) => {
			if (part.spread) return "(.*?)";
			else if (part.dynamic) return "([^/]+?)";
			else return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}).join("");
	}).join("");
	const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
	let initial = "\\/";
	if (addTrailingSlash === "never" && base !== "/" && pathname !== "") initial = "";
	return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
	if (addTrailingSlash === "always") return "\\/$";
	if (addTrailingSlash === "never") return "$";
	return "\\/?$";
}
//#endregion
//#region node_modules/astro/dist/core/render/slots.js
function getFunctionExpression(slot) {
	if (!slot) return;
	const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false || isRenderTemplateResult(e));
	if (expressions?.length !== 1) return;
	const expression = expressions[0];
	if (isRenderTemplateResult(expression)) return getFunctionExpression(expression);
	return expression;
}
var Slots = class {
	#result;
	#slots;
	#logger;
	constructor(result, slots, logger) {
		this.#result = result;
		this.#slots = slots;
		this.#logger = logger;
		if (slots) for (const key of Object.keys(slots)) {
			if (this[key] !== void 0) throw new AstroError({
				...ReservedSlotName,
				message: ReservedSlotName.message(key)
			});
			Object.defineProperty(this, key, {
				get() {
					return true;
				},
				enumerable: true
			});
		}
	}
	has(name) {
		if (!this.#slots) return false;
		return Boolean(this.#slots[name]);
	}
	async render(name, args = []) {
		if (!this.#slots || !this.has(name)) return;
		const result = this.#result;
		if (!Array.isArray(args)) this.#logger.warn(null, `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`);
		else if (args.length > 0) {
			const slotValue = this.#slots[name];
			const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
			const expression = getFunctionExpression(component);
			if (expression) {
				const slot = async () => typeof expression === "function" ? expression(...args) : expression;
				return await renderSlotToString(result, slot).then((res) => {
					return res;
				});
			}
			if (typeof component === "function") return await renderJSX(result, component(...args)).then((res) => res != null ? String(res) : res);
		}
		const content = await renderSlotToString(result, this.#slots[name]);
		return chunkToString(result, content);
	}
};
//#endregion
//#region node_modules/astro/dist/i18n/fallback.js
function computeFallbackRoute(options) {
	const { pathname, responseStatus, fallback, fallbackType, locales, defaultLocale, strategy, base } = options;
	if (responseStatus !== 404) return { type: "none" };
	if (!fallback || Object.keys(fallback).length === 0) return { type: "none" };
	const urlLocale = pathname.split("/").find((segment) => {
		for (const locale of locales) if (typeof locale === "string") {
			if (locale === segment) return true;
		} else if (locale.path === segment) return true;
		return false;
	});
	if (!urlLocale) return { type: "none" };
	if (!Object.keys(fallback).includes(urlLocale)) return { type: "none" };
	const fallbackLocale = fallback[urlLocale];
	const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
	let newPathname;
	if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
		if (pathname.includes(`${base}`)) newPathname = pathname.replace(`/${urlLocale}`, ``);
		else newPathname = pathname.replace(`/${urlLocale}`, `/`);
	} else newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
	return {
		type: fallbackType,
		pathname: newPathname
	};
}
//#endregion
//#region node_modules/astro/dist/i18n/router.js
var I18nRouter = class {
	#strategy;
	#defaultLocale;
	#locales;
	#base;
	#domains;
	constructor(options) {
		this.#strategy = options.strategy;
		this.#defaultLocale = options.defaultLocale;
		this.#locales = options.locales;
		this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
		this.#domains = options.domains;
	}
	/**
	* Evaluate routing strategy for a pathname.
	* Returns decision object (not HTTP Response).
	*/
	match(pathname, context) {
		if (this.shouldSkipProcessing(pathname, context)) return { type: "continue" };
		switch (this.#strategy) {
			case "manual": return { type: "continue" };
			case "pathname-prefix-always": return this.matchPrefixAlways(pathname, context);
			case "domains-prefix-always":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlways(pathname, context);
			case "pathname-prefix-other-locales": return this.matchPrefixOtherLocales(pathname, context);
			case "domains-prefix-other-locales":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixOtherLocales(pathname, context);
			case "pathname-prefix-always-no-redirect": return this.matchPrefixAlwaysNoRedirect(pathname, context);
			case "domains-prefix-always-no-redirect":
				if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) return { type: "continue" };
				return this.matchPrefixAlwaysNoRedirect(pathname, context);
			default: return { type: "continue" };
		}
	}
	/**
	* Check if i18n processing should be skipped for this request
	*/
	shouldSkipProcessing(pathname, context) {
		if (pathname.includes("/404") || pathname.includes("/500")) return true;
		if (pathname.includes("/_server-islands/")) return true;
		if (context.isReroute) return true;
		if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") return true;
		return false;
	}
	/**
	* Strategy: pathname-prefix-always
	* All locales must have a prefix, including the default locale.
	*/
	matchPrefixAlways(pathname, _context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return {
			type: "redirect",
			location: `${this.#base === "/" ? "" : this.#base}/${this.#defaultLocale}`
		};
		if (!pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-other-locales
	* Default locale has no prefix, other locales must have a prefix.
	*/
	matchPrefixOtherLocales(pathname, _context) {
		let pathnameContainsDefaultLocale = false;
		for (const segment of pathname.split("/")) if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
			pathnameContainsDefaultLocale = true;
			break;
		}
		if (pathnameContainsDefaultLocale) return {
			type: "notFound",
			location: pathname.replace(`/${this.#defaultLocale}`, "")
		};
		return { type: "continue" };
	}
	/**
	* Strategy: pathname-prefix-always-no-redirect
	* Like prefix-always but allows root to serve instead of redirecting
	*/
	matchPrefixAlwaysNoRedirect(pathname, _context) {
		if (pathname === this.#base + "/" || pathname === this.#base) return { type: "continue" };
		if (!pathHasLocale(pathname, this.#locales)) return { type: "notFound" };
		return { type: "continue" };
	}
	/**
	* Check if the current locale doesn't belong to the configured domain.
	* Used for domain-based routing strategies.
	*/
	localeHasntDomain(currentLocale, currentDomain) {
		if (!this.#domains || !currentDomain) return false;
		if (!currentLocale) return false;
		const localesForDomain = this.#domains[currentDomain];
		if (!localesForDomain) return true;
		return !localesForDomain.includes(currentLocale);
	}
};
//#endregion
//#region node_modules/astro/dist/core/i18n/handler.js
function compileI18n(i18n, base, trailingSlash, format) {
	return {
		config: i18n,
		base,
		trailingSlash,
		format,
		router: new I18nRouter({
			strategy: i18n.strategy,
			defaultLocale: i18n.defaultLocale,
			locales: i18n.locales,
			base,
			domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce((acc, domain) => {
				const locale = i18n.domainLookupTable[domain];
				if (!acc[domain]) acc[domain] = [];
				acc[domain].push(locale);
				return acc;
			}, {}) : void 0
		})
	};
}
var i18nMemo = createManifestMemo((manifest) => {
	const config = manifest.i18n;
	return config && config.strategy !== "manual" ? compileI18n(config, manifest.base, manifest.trailingSlash, manifest.buildFormat) : null;
});
function getI18n(manifest) {
	return i18nMemo.get(manifest);
}
async function finalizeI18n(compiled, state, response) {
	markFeatureUsed(state.manifest, FetchFeatures.i18n);
	const i18n = compiled.config;
	if (state.skipErrorReroute && typeof i18n.fallback === "undefined") return response;
	if (state.responseRouteType !== "page" && state.responseRouteType !== "fallback") return response;
	const url = state.url;
	const currentLocale = state.computeCurrentLocale();
	const isPrerendered = state.routeData.prerender;
	const routerContext = {
		currentLocale,
		currentDomain: url.hostname,
		routeType: state.responseRouteType,
		isReroute: false
	};
	const routeDecision = compiled.router.match(url.pathname, routerContext);
	switch (routeDecision.type) {
		case "redirect": {
			let location = routeDecision.location;
			if (shouldAppendForwardSlash(compiled.trailingSlash, compiled.format)) location = appendForwardSlash(location);
			return new Response(null, {
				status: routeDecision.status ?? 302,
				headers: { Location: location }
			});
		}
		case "notFound": {
			if (isPrerendered) {
				const prerenderedRes = new Response(response.body, {
					status: 404,
					headers: response.headers
				});
				state.skipErrorReroute = true;
				if (routeDecision.location) prerenderedRes.headers.set("Location", routeDecision.location);
				return prerenderedRes;
			}
			const headers = new Headers();
			if (routeDecision.location) headers.set("Location", routeDecision.location);
			return new Response(null, {
				status: 404,
				headers
			});
		}
	}
	if (i18n.fallback && i18n.fallbackType) {
		const effectiveStatus = state.responseRouteType === "fallback" ? 404 : response.status;
		const fallbackDecision = computeFallbackRoute({
			pathname: url.pathname,
			responseStatus: effectiveStatus,
			currentLocale,
			fallback: i18n.fallback,
			fallbackType: i18n.fallbackType,
			locales: i18n.locales,
			defaultLocale: i18n.defaultLocale,
			strategy: i18n.strategy,
			base: compiled.base
		});
		switch (fallbackDecision.type) {
			case "redirect": return new Response(null, {
				status: 302,
				headers: { Location: fallbackDecision.pathname + url.search }
			});
			case "rewrite": try {
				return await state.rewrite(fallbackDecision.pathname + url.search);
			} catch {
				break;
			}
		}
	}
	return response;
}
//#endregion
//#region node_modules/astro/dist/i18n/index.js
function getPathByLocale(locale, locales) {
	for (const loopLocale of locales) if (typeof loopLocale === "string") {
		if (loopLocale === locale) return loopLocale;
	} else for (const code of loopLocale.codes) if (code === locale) return loopLocale.path;
	throw new AstroError(i18nNoLocaleFoundInPath);
}
function getAllCodes(locales) {
	const result = [];
	for (const loopLocale of locales) if (typeof loopLocale === "string") result.push(loopLocale);
	else result.push(...loopLocale.codes);
	return result;
}
//#endregion
//#region node_modules/astro/dist/i18n/utils.js
function parseLocale(header) {
	if (header === "*") return [{
		locale: header,
		qualityValue: void 0
	}];
	const result = [];
	const localeValues = header.split(",").map((str) => str.trim());
	for (const localeValue of localeValues) {
		const split = localeValue.split(";").map((str) => str.trim());
		const localeName = split[0];
		const qualityValue = split[1];
		if (!split) continue;
		if (qualityValue && qualityValue.startsWith("q=")) {
			const qualityValueAsFloat = Number.parseFloat(qualityValue.slice(2));
			if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) result.push({
				locale: localeName,
				qualityValue: void 0
			});
			else result.push({
				locale: localeName,
				qualityValue: qualityValueAsFloat
			});
		} else result.push({
			locale: localeName,
			qualityValue: void 0
		});
	}
	return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
	const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
	return browserLocaleList.filter((browserLocale) => {
		if (browserLocale.locale !== "*") return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
		return true;
	}).sort((a, b) => {
		const qa = a.locale === "*" ? a.qualityValue ?? 0 : a.qualityValue ?? 1;
		return (b.locale === "*" ? b.qualityValue ?? 0 : b.qualityValue ?? 1) - qa;
	});
}
function computePreferredLocale(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = void 0;
	if (acceptHeader) {
		const firstResult = sortAndFilterLocales(parseLocale(acceptHeader), locales).at(0);
		if (firstResult && firstResult.locale !== "*") {
			outer: for (const currentLocale of locales) if (typeof currentLocale === "string") {
				if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
					result = currentLocale;
					break;
				}
			} else for (const currentCode of currentLocale.codes) if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
				result = currentCode;
				break outer;
			}
		}
	}
	return result;
}
function computePreferredLocaleList(request, locales) {
	const acceptHeader = request.headers.get("Accept-Language");
	let result = [];
	if (acceptHeader) {
		const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
		if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") return getAllCodes(locales);
		else if (browserLocaleList.length > 0) {
			for (const browserLocale of browserLocaleList) for (const loopLocale of locales) if (typeof loopLocale === "string") {
				if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) result.push(loopLocale);
			} else for (const code of loopLocale.codes) if (code === browserLocale.locale) result.push(code);
		}
	}
	return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
	for (const segment of pathname.split("/").map(normalizeThePath)) for (const locale of locales) if (typeof locale === "string") {
		if (!segment.includes(locale)) continue;
		if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) return locale;
	} else if (locale.path === segment) return locale.codes.at(0);
	else for (const code of locale.codes) if (normalizeTheLocale(code) === normalizeTheLocale(segment)) return code;
	for (const locale of locales) if (typeof locale === "string") {
		if (locale === defaultLocale) return locale;
	} else if (locale.path === defaultLocale) return locale.codes.at(0);
}
function computeCurrentLocaleFromParams(params, locales) {
	const byNormalizedCode = /* @__PURE__ */ new Map();
	const byPath = /* @__PURE__ */ new Map();
	for (const locale of locales) if (typeof locale === "string") byNormalizedCode.set(normalizeTheLocale(locale), locale);
	else {
		byPath.set(locale.path, locale.codes[0]);
		for (const code of locale.codes) byNormalizedCode.set(normalizeTheLocale(code), code);
	}
	for (const value of Object.values(params)) {
		if (!value) continue;
		const pathMatch = byPath.get(value);
		if (pathMatch) return pathMatch;
		const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
		if (codeMatch) return codeMatch;
	}
}
//#endregion
//#region node_modules/astro/dist/core/app/prepare-response.js
function prepareResponse(response, { addCookieHeader }) {
	if (addCookieHeader) for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) response.headers.append("set-cookie", setCookieHeaderValue);
	Reflect.set(response, responseSentSymbol$1, true);
}
//#endregion
//#region node_modules/astro/dist/core/pages/handler.js
var EMPTY_SLOTS = Object.freeze({});
async function handlePages(state, ctx) {
	const { logger, streaming } = state;
	state.resetResponseMetadata();
	let response;
	const componentInstance = await state.loadComponentInstance();
	switch (state.routeData.type) {
		case "endpoint":
			response = await renderEndpoint(componentInstance, ctx, state.routeData.prerender, logger, state);
			break;
		case "page": {
			const props = await state.getProps();
			const actionApiContext = state.getActionAPIContext();
			const result = await state.createResult(componentInstance, actionApiContext);
			try {
				response = await renderPage(result, componentInstance?.default, props, state.slots ?? EMPTY_SLOTS, streaming, state.routeData);
			} catch (e) {
				result.cancelled = true;
				throw e;
			}
			state.responseRouteType = "page";
			if (state.routeData.route === "/404" || state.routeData.route === "/500") state.skipErrorReroute = true;
			break;
		}
		case "redirect": return new Response(null, {
			status: 404,
			headers: { [ASTRO_ERROR_HEADER]: "true" }
		});
		case "fallback":
			state.responseRouteType = "fallback";
			return new Response(null, { status: 500 });
	}
	const responseCookies = getCookiesFromResponse(response);
	if (responseCookies) state.cookies.merge(responseCookies);
	state.response = response;
	return response;
}
//#endregion
//#region node_modules/astro/dist/core/routing/match.js
function matchRoute$1(pathname, manifest) {
	if (isRoute404(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute404(route.route));
		if (errorRoute) return errorRoute;
	}
	if (isRoute500(pathname)) {
		const errorRoute = manifest.routes.find((route) => isRoute500(route.route));
		if (errorRoute) return errorRoute;
	}
	return manifest.routes.find((route) => {
		return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
	});
}
function isRoute404or500(route) {
	return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
	return route.component === SERVER_ISLAND_COMPONENT;
}
//#endregion
//#region node_modules/astro/dist/core/routing/astro-designed-error-pages.js
function ensure404Route(manifest) {
	if (!manifest.routes.some((route) => route.route === "/404")) manifest.routes.push(DEFAULT_404_ROUTE);
	return manifest;
}
//#endregion
//#region node_modules/astro/dist/core/routing/priority.js
function routeComparator(a, b) {
	const commonLength = Math.min(a.segments.length, b.segments.length);
	for (let index = 0; index < commonLength; index++) {
		const aSegment = a.segments[index];
		const bSegment = b.segments[index];
		const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
		const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
		if (aIsStatic && bIsStatic) {
			const aContent = aSegment.map((part) => part.content).join("");
			const bContent = bSegment.map((part) => part.content).join("");
			if (aContent !== bContent) return aContent.localeCompare(bContent);
		}
		if (aIsStatic !== bIsStatic) return aIsStatic ? -1 : 1;
		const aAllDynamic = aSegment.every((part) => part.dynamic);
		if (aAllDynamic !== bSegment.every((part) => part.dynamic)) return aAllDynamic ? 1 : -1;
		const aHasSpread = aSegment.some((part) => part.spread);
		if (aHasSpread !== bSegment.some((part) => part.spread)) return aHasSpread ? 1 : -1;
	}
	const aLength = a.segments.length;
	const bLength = b.segments.length;
	if (aLength !== bLength) {
		const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
		const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
		if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
			if (aLength > bLength && aEndsInRest) return 1;
			if (bLength > aLength && bEndsInRest) return -1;
		}
		return aLength > bLength ? -1 : 1;
	}
	if (a.type === "endpoint" !== (b.type === "endpoint")) return a.type === "endpoint" ? -1 : 1;
	return a.route.localeCompare(b.route);
}
//#endregion
//#region node_modules/astro/dist/core/routing/router.js
var Router = class {
	#routes;
	#base;
	#baseWithoutTrailingSlash;
	#buildFormat;
	#trailingSlash;
	constructor(routes, options) {
		this.#routes = [...routes].sort(routeComparator);
		this.#base = normalizeBase(options.base);
		this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
		this.#buildFormat = options.buildFormat;
		this.#trailingSlash = options.trailingSlash;
	}
	/**
	* Match an input pathname against the route list.
	* If allowWithoutBase is true, a non-base-prefixed path is still considered.
	*/
	match(inputPathname, { allowWithoutBase = false } = {}) {
		const normalized = getRedirectForPathname(inputPathname);
		if (normalized.redirect) return {
			type: "redirect",
			location: normalized.redirect,
			status: 301
		};
		if (this.#base !== "/") {
			const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
			if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) return {
				type: "redirect",
				location: baseWithSlash,
				status: 301
			};
			if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) return {
				type: "redirect",
				location: this.#baseWithoutTrailingSlash,
				status: 301
			};
		}
		const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
		if (!baseResult) {
			if (!allowWithoutBase) return {
				type: "none",
				reason: "outside-base"
			};
		}
		let pathname = baseResult ?? normalized.pathname;
		if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
		const route = this.#routes.find((candidate) => {
			if (candidate.pattern.test(pathname)) return true;
			return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
		});
		if (!route) return {
			type: "none",
			reason: "no-match"
		};
		return {
			type: "match",
			route,
			params: getParams(route, pathname),
			pathname
		};
	}
	/**
	* Returns all routes that match the given pathname, in priority order.
	* Used when the first match (e.g. a prerendered route) cannot serve
	* the request and subsequent matches need to be tried.
	*/
	matchAll(inputPathname, { allowWithoutBase = false } = {}) {
		const normalized = getRedirectForPathname(inputPathname);
		if (normalized.redirect) return [];
		const baseResult = stripBase(normalized.pathname, this.#base, this.#baseWithoutTrailingSlash, this.#trailingSlash);
		if (!baseResult && !allowWithoutBase) return [];
		let pathname = baseResult ?? normalized.pathname;
		if (this.#buildFormat === "file") pathname = normalizeFileFormatPathname(pathname);
		return this.#routes.filter((candidate) => {
			if (candidate.pattern.test(pathname)) return true;
			return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
		});
	}
};
function normalizeBase(base) {
	if (!base) return "/";
	if (base === "/") return base;
	return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
	let value = prependForwardSlash(pathname);
	if (value.startsWith("//")) return {
		pathname: value,
		redirect: `/${value.replace(/^\/+/, "")}`
	};
	return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
	if (base === "/") return pathname;
	const baseWithSlash = `${baseWithoutTrailingSlash}/`;
	if (pathname === baseWithoutTrailingSlash || pathname === base) return trailingSlash === "always" ? null : "/";
	if (pathname === baseWithSlash) return trailingSlash === "never" ? null : "/";
	if (pathname.startsWith(baseWithSlash)) return pathname.slice(baseWithoutTrailingSlash.length);
	return null;
}
function normalizeFileFormatPathname(pathname) {
	if (pathname.endsWith("/index.html")) {
		const trimmed = pathname.slice(0, -11);
		return trimmed === "" ? "/" : trimmed;
	}
	if (pathname.endsWith(".html")) {
		const trimmed = pathname.slice(0, -5);
		return trimmed === "" ? "/" : trimmed;
	}
	return pathname;
}
//#endregion
//#region node_modules/astro/dist/core/routing/route-table.js
function compileRouteTable(manifest, routes) {
	const routesList = ensure404Route({ routes });
	const router = new Router(routesList.routes, {
		base: manifest.base,
		trailingSlash: manifest.trailingSlash,
		buildFormat: manifest.buildFormat
	});
	return {
		routes: routesList.routes,
		router
	};
}
var routeTables = createManifestMemo((manifest) => compileRouteTable(manifest, (manifest.routes ?? []).map((route) => route.routeData)));
function getRouteTable(manifest) {
	return routeTables.get(manifest);
}
function updateRouteTable(manifest, routes) {
	routeTables.set(manifest, compileRouteTable(manifest, [...routes]));
}
function matchRoute(manifest, pathname) {
	const match = getRouteTable(manifest).router.match(pathname, { allowWithoutBase: true });
	if (match.type !== "match") return void 0;
	return match.route;
}
function matchAllRoutes(manifest, pathname) {
	return getRouteTable(manifest).router.matchAll(pathname, { allowWithoutBase: true });
}
//#endregion
//#region node_modules/astro/dist/core/session/driver.js
var sessionDriverMemo = createAsyncManifestMemo(async (manifest) => {
	if (manifest.sessionDriver) return (await manifest.sessionDriver())?.default || null;
	return null;
});
function getSessionDriver(manifest) {
	return sessionDriverMemo.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/session/runtime.js
var PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
var DEFAULT_COOKIE_NAME = "astro-session";
var VALID_COOKIE_REGEX = /^[\w-]+$/;
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
var unflatten$1 = (parsed, _) => {
	return unflatten(parsed, { URL: (href) => new URL(href) });
};
var stringify$1 = (data, _) => {
	return stringify(data, { URL: (val) => val instanceof URL && val.href });
};
var AstroSession = class AstroSession {
	#cookies;
	#config;
	#cookieConfig;
	#cookieName;
	#storage;
	#data;
	#sessionID;
	#toDestroy = /* @__PURE__ */ new Set();
	#toDelete = /* @__PURE__ */ new Set();
	#dirty = false;
	#cookieSet = false;
	#sessionIDFromCookie = false;
	#partial = true;
	#logger;
	#driverFactory;
	static #sharedStorage = /* @__PURE__ */ new Map();
	constructor({ cookies, config, runtimeMode, driverFactory, mockStorage, logger }) {
		this.#logger = logger;
		if (!config) throw new AstroError({
			...SessionStorageInitError,
			message: SessionStorageInitError.message("No driver was defined in the session configuration and the adapter did not provide a default driver.")
		});
		this.#cookies = cookies;
		this.#driverFactory = driverFactory;
		const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config;
		let cookieConfigObject;
		if (typeof cookieConfig === "object") {
			const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
			this.#cookieName = name;
			cookieConfigObject = rest;
		} else this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
		this.#cookieConfig = {
			sameSite: "lax",
			secure: runtimeMode === "production",
			path: "/",
			...cookieConfigObject,
			httpOnly: true
		};
		this.#config = configRest;
		if (mockStorage) this.#storage = mockStorage;
	}
	/**
	* Gets a session value. Returns `undefined` if the session or value does not exist.
	*/
	async get(key) {
		return (await this.#ensureData()).get(key)?.data;
	}
	/**
	* Checks if a session value exists.
	*/
	async has(key) {
		return (await this.#ensureData()).has(key);
	}
	/**
	* Gets all session values.
	*/
	async keys() {
		return (await this.#ensureData()).keys();
	}
	/**
	* Gets all session values.
	*/
	async values() {
		return [...(await this.#ensureData()).values()].map((entry) => entry.data);
	}
	/**
	* Gets all session entries.
	*/
	async entries() {
		return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
	}
	/**
	* Deletes a session value.
	*/
	delete(key) {
		this.#data ??= /* @__PURE__ */ new Map();
		this.#data.delete(key);
		if (this.#partial) this.#toDelete.add(key);
		this.#dirty = true;
	}
	/**
	* Sets a session value. The session is created if it does not exist.
	*/
	set(key, value, { ttl } = {}) {
		if (!key) throw new AstroError({
			...SessionStorageSaveError,
			message: "The session key was not provided."
		});
		let cloned;
		try {
			cloned = unflatten$1(JSON.parse(stringify$1(value)));
		} catch (err) {
			throw new AstroError({
				...SessionStorageSaveError,
				message: `The session data for ${key} could not be serialized.`,
				hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
			}, { cause: err });
		}
		if (!this.#cookieSet) {
			this.#setCookie();
			this.#cookieSet = true;
		}
		this.#data ??= /* @__PURE__ */ new Map();
		const lifetime = ttl ?? this.#config.ttl;
		const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
		this.#data.set(key, {
			data: cloned,
			expires
		});
		this.#dirty = true;
	}
	/**
	* Destroys the session, clearing the cookie and storage if it exists.
	*/
	destroy() {
		const cookieValue = this.#cookies.get(this.#cookieName)?.value;
		const sessionId = this.#sessionID ?? (cookieValue && UUID_REGEX.test(cookieValue) ? cookieValue : void 0);
		if (sessionId) this.#toDestroy.add(sessionId);
		this.#cookies.delete(this.#cookieName, this.#cookieConfig);
		this.#sessionID = void 0;
		this.#data = void 0;
		this.#dirty = true;
	}
	/**
	* Regenerates the session, creating a new session ID. The existing session data is preserved.
	*/
	async regenerate() {
		let data = /* @__PURE__ */ new Map();
		try {
			data = await this.#ensureData();
		} catch (err) {
			this.#logger.error("session", `Failed to load session data during regeneration: ${err}`);
			this.#partial = false;
		}
		const oldSessionId = this.#sessionID;
		this.#sessionID = crypto.randomUUID();
		this.#sessionIDFromCookie = false;
		this.#data = data;
		this.#dirty = true;
		await this.#setCookie();
		if (oldSessionId && this.#storage) this.#storage.removeItem(oldSessionId).catch((err) => {
			this.#logger.error("session", `Failed to remove old session ${oldSessionId}: ${err}`);
		});
	}
	async [PERSIST_SYMBOL]() {
		if (!this.#dirty && !this.#toDestroy.size) return;
		const storage = await this.#ensureStorage();
		if (this.#dirty && this.#data) {
			const data = await this.#ensureData();
			this.#toDelete.forEach((key2) => data.delete(key2));
			const key = this.#ensureSessionID();
			let serialized;
			try {
				serialized = stringify$1(data);
			} catch (err) {
				throw new AstroError({
					...SessionStorageSaveError,
					message: SessionStorageSaveError.message("The session data could not be serialized.", this.#config.driver)
				}, { cause: err });
			}
			await storage.setItem(key, serialized);
			this.#dirty = false;
		}
		if (this.#toDestroy.size > 0) {
			const cleanupPromises = [...this.#toDestroy].map((sessionId) => storage.removeItem(sessionId).catch((err) => {
				this.#logger.error("session", `Failed to remove session ${sessionId}: ${err}`);
			}));
			await Promise.all(cleanupPromises);
			this.#toDestroy.clear();
		}
	}
	get sessionID() {
		return this.#sessionID;
	}
	/**
	* Loads a session from storage with the given ID, and replaces the current session.
	* Any changes made to the current session will be lost.
	* This is not normally needed, as the session is automatically loaded using the cookie.
	* However it can be used to restore a session where the ID has been recorded somewhere
	* else (e.g. in a database).
	*/
	async load(sessionID) {
		this.#sessionID = sessionID;
		this.#data = void 0;
		await this.#setCookie();
		await this.#ensureData();
	}
	/**
	* Sets the session cookie.
	*/
	async #setCookie() {
		if (!VALID_COOKIE_REGEX.test(this.#cookieName)) throw new AstroError({
			...SessionStorageSaveError,
			message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
		});
		const value = this.#ensureSessionID();
		this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
	}
	/**
	* Attempts to load the session data from storage, or creates a new data object if none exists.
	* If there is existing partial data, it will be merged into the new data object.
	*/
	async #ensureData() {
		if (this.#data && !this.#partial) return this.#data;
		this.#data ??= /* @__PURE__ */ new Map();
		if (!this.#sessionID && !this.#cookies.get(this.#cookieName)?.value) {
			this.#partial = false;
			return this.#data;
		}
		const raw = await (await this.#ensureStorage()).get(this.#ensureSessionID());
		if (!raw) {
			if (this.#sessionIDFromCookie) {
				this.#sessionID = crypto.randomUUID();
				this.#sessionIDFromCookie = false;
				if (this.#cookieSet) await this.#setCookie();
			}
			return this.#data;
		}
		try {
			const storedMap = unflatten$1(raw);
			if (!(storedMap instanceof Map)) {
				this.destroy();
				throw new AstroError({
					...SessionStorageInitError,
					message: SessionStorageInitError.message("The session data was an invalid type.", this.#config.driver)
				});
			}
			const now = Date.now();
			for (const [key, value] of storedMap) {
				const expired = typeof value.expires === "number" && value.expires < now;
				if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) this.#data.set(key, value);
			}
			this.#partial = false;
			return this.#data;
		} catch (err) {
			this.destroy();
			if (err instanceof AstroError) throw err;
			throw new AstroError({
				...SessionStorageInitError,
				message: SessionStorageInitError.message("The session data could not be parsed.", this.#config.driver)
			}, { cause: err });
		}
	}
	/**
	* Returns the session ID, generating a new one if it does not exist.
	*/
	#ensureSessionID() {
		if (!this.#sessionID) {
			const cookieValue = this.#cookies.get(this.#cookieName)?.value;
			if (cookieValue && UUID_REGEX.test(cookieValue)) {
				this.#sessionID = cookieValue;
				this.#sessionIDFromCookie = true;
			} else this.#sessionID = crypto.randomUUID();
		}
		return this.#sessionID;
	}
	/**
	* Ensures the storage is initialized.
	* This is called automatically when a storage operation is needed.
	*/
	async #ensureStorage() {
		if (this.#storage) return this.#storage;
		if (AstroSession.#sharedStorage.has(this.#config.driver)) {
			this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
			return this.#storage;
		}
		if (!this.#driverFactory) throw new AstroError({
			...SessionStorageInitError,
			message: SessionStorageInitError.message("Astro could not load the driver correctly. Does it exist?", this.#config.driver)
		});
		const driver = this.#driverFactory;
		try {
			this.#storage = createStorage({ driver: {
				...driver(this.#config.options),
				hasItem() {
					return false;
				},
				getKeys() {
					return [];
				}
			} });
			AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
			return this.#storage;
		} catch (err) {
			throw new AstroError({
				...SessionStorageInitError,
				message: SessionStorageInitError.message("Unknown error", this.#config.driver)
			}, { cause: err });
		}
	}
};
//#endregion
//#region node_modules/astro/dist/core/session/handler.js
var SESSION_KEY = "session";
function provideSession(state) {
	markFeatureUsed(state.manifest, FetchFeatures.sessions);
	const config = state.manifest.sessionConfig;
	if (!config) return;
	return provideSessionAsync(state, config);
}
async function provideSessionAsync(state, config) {
	const driverFactory = await getSessionDriver(state.manifest);
	if (!driverFactory) return;
	state.provide(SESSION_KEY, {
		create() {
			const cookies = state.cookies;
			return new AstroSession({
				cookies,
				config,
				runtimeMode: getEnvironment(state.manifest).runtimeMode,
				driverFactory,
				mockStorage: null,
				logger: state.logger
			});
		},
		finalize(session) {
			return session[PERSIST_SYMBOL]();
		}
	});
}
//#endregion
//#region node_modules/astro/dist/core/app/validate-headers.js
function getFirstForwardedValue(multiValueHeader) {
	return multiValueHeader?.toString().split(",").map((e) => e.trim())[0];
}
function sanitizeHost(hostname) {
	if (!hostname) return void 0;
	if (/[/\\]/.test(hostname)) return void 0;
	return hostname;
}
function parseHost(host) {
	const parts = host.split(":");
	if (parts.length > 2) return void 0;
	return {
		hostname: parts[0],
		port: parts[1]
	};
}
function matchesAllowedDomains(hostname, protocol, port, allowedDomains) {
	const urlString = `${protocol}://${port ? `${hostname}:${port}` : hostname}`;
	if (!URL.canParse(urlString)) return false;
	const testUrl = new URL(urlString);
	return allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
}
function validateHost(host, protocol, allowedDomains) {
	if (!host || host.length === 0) return void 0;
	if (!allowedDomains || allowedDomains.length === 0) return void 0;
	const sanitized = sanitizeHost(host);
	if (!sanitized) return void 0;
	const parsed = parseHost(sanitized);
	if (!parsed) return void 0;
	const { hostname, port } = parsed;
	if (matchesAllowedDomains(hostname, protocol, port, allowedDomains)) return sanitized;
}
function validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
	const result = {};
	if (forwardedProtocol) {
		if (allowedDomains && allowedDomains.length > 0) {
			if (allowedDomains.some((pattern) => pattern.protocol !== void 0)) try {
				const testUrl = new URL(`${forwardedProtocol}://example.com`);
				if (allowedDomains.some((pattern) => matchPattern(testUrl, { protocol: pattern.protocol }))) result.protocol = forwardedProtocol;
			} catch {}
			else if (/^https?$/.test(forwardedProtocol)) result.protocol = forwardedProtocol;
		}
	}
	if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
		if (allowedDomains.some((pattern) => pattern.port !== void 0)) {
			if (allowedDomains.some((pattern) => pattern.port === forwardedPort)) result.port = forwardedPort;
		}
	}
	if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
		const protoForValidation = result.protocol || "https";
		const sanitized = sanitizeHost(forwardedHost);
		const parsed = sanitized ? parseHost(sanitized) : void 0;
		if (sanitized && parsed) {
			const { hostname, port: portFromHost } = parsed;
			if (matchesAllowedDomains(hostname, protoForValidation, result.port || portFromHost, allowedDomains)) result.host = sanitized;
		}
	}
	return result;
}
//#endregion
//#region node_modules/astro/dist/core/output-filename.js
var STATUS_CODE_PAGES = /* @__PURE__ */ new Set(["/404", "/500"]);
function getOutputFilename(buildFormat, name, routeData) {
	if (routeData.type === "endpoint") return name;
	if (name === "/" || name === "") return name === "" ? "index.html" : "/index.html";
	if (buildFormat === "file" || STATUS_CODE_PAGES.has(name)) return `${removeTrailingForwardSlash(name || "index")}.html`;
	if (buildFormat === "preserve" && !routeData.isIndex) return `${removeTrailingForwardSlash(name || "index")}.html`;
	return `${removeTrailingForwardSlash(name)}/index.html`;
}
//#endregion
//#region node_modules/astro/dist/core/errors/default-handler.js
async function renderDefaultError(manifest, request, { status, response: originalResponse, skipMiddleware = false, error, pathname, ...resolvedRenderOptions }) {
	const resolvedPathname = pathname ?? new FetchState(manifest, request).pathname;
	const routeTable = getRouteTable(manifest);
	const errorRouteData = matchRoute$1(getErrorRoutePath(resolvedPathname, status, routeTable.routes, manifest.i18n?.locales, manifest.trailingSlash === "always"), routeTable);
	const url = new URL(request.url);
	if (errorRouteData) {
		if (errorRouteData.prerender) {
			const allowedDomains = manifest.allowedDomains;
			const safeOrigin = validateHost(url.host, url.protocol.replace(":", ""), allowedDomains) ? url.origin : `${url.protocol}//localhost`;
			const statusURL = new URL(`${removeTrailingForwardSlash(manifest.base)}${getOutputFilename(manifest.buildFormat, errorRouteData.route, errorRouteData)}`, safeOrigin);
			if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) try {
				const newResponse = mergeResponses(await resolvedRenderOptions.prerenderedErrorPageFetch(statusURL.toString()), originalResponse, {
					status,
					removeContentEncodingHeaders: true
				});
				prepareResponse(newResponse, resolvedRenderOptions);
				return newResponse;
			} catch {
				const response2 = mergeResponses(new Response(null, { status }), originalResponse);
				prepareResponse(response2, resolvedRenderOptions);
				return response2;
			}
		}
		const mod = await getEnvironment(manifest).getComponentByRoute(manifest, errorRouteData);
		const errorState = new FetchState(manifest, request);
		errorState.skipMiddleware = skipMiddleware;
		errorState.clientAddress = resolvedRenderOptions.clientAddress;
		errorState.routeData = errorRouteData;
		errorState.pathname = resolvedPathname;
		errorState.status = status;
		errorState.componentInstance = mod;
		errorState.locals = resolvedRenderOptions.locals ?? {};
		errorState.initialProps = { error };
		try {
			await provideSession(errorState);
			const response2 = await handleMiddleware(errorState, handlePages);
			if (rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, errorState.routeData, response2)) return renderDefaultError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				response: originalResponse,
				skipMiddleware: true,
				pathname: resolvedPathname
			});
			const newResponse = mergeResponses(response2, originalResponse);
			prepareResponse(newResponse, resolvedRenderOptions);
			return newResponse;
		} catch {
			if (skipMiddleware === false) return renderDefaultError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				response: originalResponse,
				skipMiddleware: true,
				pathname: resolvedPathname
			});
		} finally {
			await errorState.finalizeAll();
		}
	}
	const response = mergeResponses(new Response(null, { status }), originalResponse);
	prepareResponse(response, resolvedRenderOptions);
	return response;
}
function mergeResponses(newResponse, originalResponse, override) {
	let newResponseHeaders = newResponse.headers;
	if (override?.removeContentEncodingHeaders) {
		newResponseHeaders = new Headers(newResponseHeaders);
		newResponseHeaders.delete("Content-Encoding");
		newResponseHeaders.delete("Content-Length");
	}
	if (!originalResponse) {
		if (override !== void 0) return new Response(newResponse.body, {
			status: override.status,
			statusText: newResponse.statusText,
			headers: newResponseHeaders
		});
		return newResponse;
	}
	const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
	try {
		originalResponse.headers.delete("Content-type");
		originalResponse.headers.delete("Content-Length");
		originalResponse.headers.delete("Transfer-Encoding");
	} catch {}
	const newHeaders = new Headers();
	const seen = /* @__PURE__ */ new Set();
	for (const [name, value] of originalResponse.headers) {
		newHeaders.append(name, value);
		seen.add(name.toLowerCase());
	}
	for (const [name, value] of newResponseHeaders) {
		const lower = name.toLowerCase();
		if (!seen.has(lower) || lower === "set-cookie") newHeaders.append(name, value);
	}
	const mergedResponse = new Response(newResponse.body, {
		status,
		statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
		headers: newHeaders
	});
	const originalCookies = getCookiesFromResponse(originalResponse);
	const newCookies = getCookiesFromResponse(newResponse);
	if (originalCookies) {
		if (newCookies) originalCookies.merge(newCookies);
		attachCookiesToResponse(mergedResponse, originalCookies);
	} else if (newCookies) attachCookiesToResponse(mergedResponse, newCookies);
	return mergedResponse;
}
//#endregion
//#region node_modules/astro/dist/core/errors/build-handler.js
async function renderBuildError(manifest, request, options) {
	if (options.status === 500) {
		if (options.response) return options.response;
		throw options.error;
	}
	return renderDefaultError(manifest, request, {
		...options,
		prerenderedErrorPageFetch: void 0
	});
}
//#endregion
//#region node_modules/astro/dist/core/errors/dev-handler.js
async function renderDevError(manifest, request, { skipMiddleware = false, error, status, response: _response, pathname, ...resolvedRenderOptions }, { shouldInjectCspMetaTags }) {
	if (isAstroError(error) && [MiddlewareNoDataOrNextCalled.name, MiddlewareNotAResponse.name].includes(error.name)) throw error;
	const resolvedPathname = pathname ?? new FetchState(manifest, request).pathname;
	const renderRoute = async (routeData) => {
		try {
			const preloadedComponent = await getEnvironment(manifest).getComponentByRoute(manifest, routeData);
			const errorState = new FetchState(manifest, request);
			errorState.skipMiddleware = skipMiddleware;
			errorState.clientAddress = resolvedRenderOptions.clientAddress;
			errorState.shouldInjectCspMetaTags = shouldInjectCspMetaTags ? !!manifest.csp : false;
			errorState.routeData = routeData;
			errorState.pathname = resolvedPathname;
			errorState.status = status;
			errorState.componentInstance = preloadedComponent;
			errorState.locals = resolvedRenderOptions.locals ?? {};
			errorState.initialProps = { error };
			const response = await handleMiddleware(errorState, handlePages);
			if (rewroteToEmptyErrorResponse(skipMiddleware, routeData, errorState.routeData, response)) return renderDevError(manifest, request, {
				...resolvedRenderOptions,
				status,
				error,
				skipMiddleware: true,
				pathname: resolvedPathname
			}, { shouldInjectCspMetaTags });
			if (error) getLogger(manifest).error("router", error.stack || error.message);
			return response;
		} catch (_err) {
			if (skipMiddleware === false) return renderDevError(manifest, request, {
				...resolvedRenderOptions,
				status: 500,
				skipMiddleware: true,
				error: _err,
				pathname: resolvedPathname
			}, { shouldInjectCspMetaTags });
			throw _err;
		}
	};
	if (status === 404) {
		const custom404 = getCustom404Route(getRouteTable(manifest));
		if (custom404) return renderRoute(custom404);
	}
	const custom500 = getCustom500Route(getRouteTable(manifest));
	if (!custom500) throw error;
	else return renderRoute(custom500);
}
//#endregion
//#region node_modules/astro/dist/core/errors/handler.js
function renderErrorPage(manifest, request, options) {
	const env = getEnvironment(manifest);
	switch (env.errorStrategy) {
		case "dev": return renderDevError(manifest, request, options, { shouldInjectCspMetaTags: env.injectCspMetaTagsOnErrorPages });
		case "build": return renderBuildError(manifest, request, options);
		case "default": return renderDefaultError(manifest, request, options);
	}
}
function renderErrorFromState(state, request, options) {
	if (state.renderError) return state.renderError(request, options);
	return renderErrorPage(state.manifest, request, options);
}
function rewroteToEmptyErrorResponse(skipMiddleware, errorRouteData, renderedRouteData, response) {
	return skipMiddleware === false && renderedRouteData !== errorRouteData && response.body === null && REROUTABLE_STATUS_CODES.includes(response.status);
}
//#endregion
//#region node_modules/astro/dist/core/middleware/callMiddleware.js
async function callMiddleware(onRequest, apiContext, responseFunction) {
	let nextCalled = false;
	let responseFunctionPromise = void 0;
	const next = async (payload) => {
		nextCalled = true;
		responseFunctionPromise = responseFunction(apiContext, payload);
		return responseFunctionPromise;
	};
	const middlewarePromise = onRequest(apiContext, next);
	return await Promise.resolve(middlewarePromise).then(async (value) => {
		if (nextCalled) {
			if (typeof value !== "undefined") {
				if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
				return value;
			} else if (responseFunctionPromise) return responseFunctionPromise;
			else throw new AstroError(MiddlewareNotAResponse);
		} else if (typeof value === "undefined") throw new AstroError(MiddlewareNoDataOrNextCalled);
		else if (value instanceof Response === false) throw new AstroError(MiddlewareNotAResponse);
		else return value;
	});
}
//#endregion
//#region node_modules/astro/dist/core/middleware/load.js
var resolvedMiddleware = /* @__PURE__ */ new WeakMap();
var middlewareMemo = createAsyncManifestMemo(async (manifest) => {
	let handler;
	if (manifest.middleware) {
		const internalMiddlewares = [(await manifest.middleware()).onRequest ?? NOOP_MIDDLEWARE_FN];
		if (manifest.checkOrigin) internalMiddlewares.unshift(createOriginCheckMiddleware());
		handler = sequence(...internalMiddlewares);
	} else handler = NOOP_MIDDLEWARE_FN;
	resolvedMiddleware.set(manifest, handler);
	return handler;
});
function getMiddleware(manifest) {
	return middlewareMemo.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/cache/runtime/noop.js
var EMPTY_OPTIONS = Object.freeze({ tags: [] });
var NoopAstroCache = class {
	enabled = false;
	set() {}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {}
};
var hasWarned = false;
var DisabledAstroCache = class {
	enabled = false;
	#logger;
	constructor(logger) {
		this.#logger = logger;
	}
	#warn() {
		if (!hasWarned) {
			hasWarned = true;
			this.#logger?.warn("cache", "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `cache` to enable caching.");
		}
	}
	set() {
		this.#warn();
	}
	get tags() {
		return [];
	}
	get options() {
		return EMPTY_OPTIONS;
	}
	async invalidate() {
		throw new AstroError(CacheNotEnabled);
	}
};
//#endregion
//#region node_modules/astro/dist/core/middleware/astro-middleware.js
async function handleMiddleware(state, renderRouteCallback) {
	markFeatureUsed(state.manifest, FetchFeatures.middleware);
	await state.getProps();
	const apiContext = state.getAPIContext();
	state.counter++;
	if (state.counter === 4) return new Response("Loop Detected", {
		status: 508,
		statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
	});
	const next = async (ctx, payload) => {
		if (payload) {
			state.logger.debug("router", "Called rewriting to:", payload);
			applyRewriteToState(state, payload, await getEnvironment(state.manifest).tryRewrite(state.manifest, payload, state.request));
		}
		return renderRouteCallback(state, ctx);
	};
	let response;
	if (state.skipMiddleware) response = await next(apiContext);
	else {
		const middleware = await getMiddleware(state.manifest);
		response = await callMiddleware(sequence(middleware), apiContext, next);
	}
	attachCookiesToResponse(response, state.cookies);
	state.response = response;
	return response;
}
//#endregion
//#region node_modules/astro/dist/core/util/normalized-url.js
function createNormalizedUrl(requestUrl) {
	return normalizeUrl(new URL(requestUrl));
}
function setPathname(url, pathname) {
	if (url.pathname !== pathname) url.pathname = pathname;
}
function normalizeUrl(url) {
	try {
		setPathname(url, validateAndDecodePathname(url.pathname));
	} catch {
		try {
			setPathname(url, decodeURI(url.pathname));
		} catch {}
	}
	setPathname(url, collapseDuplicateSlashes(url.pathname));
	return url;
}
//#endregion
//#region node_modules/astro/dist/core/rewrites/handler.js
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
	const oldPathname = state.pathname;
	const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
	if (state.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) throw new AstroError({
		...ForbiddenRewrite,
		message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
		hint: ForbiddenRewrite.hint(routeData.component)
	});
	state.routeData = routeData;
	state.componentInstance = componentInstance;
	if (payload instanceof Request) state.request = payload;
	else state.request = copyRequest(newUrl, state.request, routeData.prerender, state.logger, state.routeData.route);
	state.url = createNormalizedUrl(state.request.url);
	if (mergeCookies) {
		const newCookies = new AstroCookies(state.request, state.logger);
		if (state.cookies) newCookies.merge(state.cookies);
		state.cookies = newCookies;
	}
	state.params = getParams(routeData, pathname);
	state.pathname = pathname;
	state.isRewriting = true;
	state.status = 200;
	setOriginPathname(state.request, oldPathname, state.manifest.trailingSlash, state.manifest.buildFormat);
	state.invalidateContexts();
}
async function executeRewrite(state, payload) {
	state.logger.debug("router", "Calling rewrite: ", payload);
	applyRewriteToState(state, payload, await getEnvironment(state.manifest).tryRewrite(state.manifest, payload, state.request), { mergeCookies: true });
	return handleMiddleware(state, handlePages);
}
//#endregion
//#region node_modules/astro/dist/core/i18n/domain.js
function computePathnameFromDomain(request, url, i18n, base, trailingSlash, logger, pathnameFromRequest) {
	let pathname = void 0;
	if (i18n && (i18n.strategy === "domains-prefix-always" || i18n.strategy === "domains-prefix-other-locales" || i18n.strategy === "domains-prefix-always-no-redirect")) {
		let host = request.headers.get("X-Forwarded-Host");
		let protocol = request.headers.get("X-Forwarded-Proto");
		if (protocol) protocol = protocol + ":";
		else protocol = url.protocol;
		if (!host) host = request.headers.get("Host");
		if (host && protocol) {
			host = host.split(":")[0];
			try {
				let locale;
				const hostAsUrl = new URL(`${protocol}//${host}`);
				for (const [domainKey, localeValue] of Object.entries(i18n.domainLookupTable)) {
					const domainKeyAsUrl = new URL(domainKey);
					if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
						locale = localeValue;
						break;
					}
				}
				if (locale) {
					const requestPathname = pathnameFromRequest ?? stripRequestBase(url.pathname, base);
					pathname = prependForwardSlash(joinPaths(normalizeTheLocale(locale), requestPathname));
					if (trailingSlash === "always") pathname = appendForwardSlash(pathname);
					else if (trailingSlash === "never") pathname = removeTrailingForwardSlash(pathname);
					else if (url.pathname.endsWith("/")) pathname = appendForwardSlash(pathname);
				}
			} catch (e) {
				logger.error("router", `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`);
				logger.error("router", `Error: ${e}`);
			}
		}
	}
	return pathname;
}
//#endregion
//#region node_modules/astro/dist/core/manifest/derived.js
var sites = createManifestMemo((manifest) => manifest.site ? new URL(manifest.site) : void 0);
function getSite(manifest) {
	return sites.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/server-islands/mappings.js
async function getServerIslands(manifest) {
	if (manifest.serverIslandMappings) return manifest.serverIslandMappings();
	return {
		serverIslandMap: /* @__PURE__ */ new Map(),
		serverIslandNameMap: /* @__PURE__ */ new Map()
	};
}
//#endregion
//#region node_modules/astro/dist/core/fetch/fetch-state.js
function getFetchStateFromAPIContext(context) {
	const state = context[fetchStateSymbol];
	if (!state) throw new Error("FetchState not found on APIContext. This is an internal error — the context was not created through Astro's request pipeline.");
	return state;
}
var FetchState = class {
	/** The manifest — the single ambient source of static, build-time data. */
	manifest;
	/** The manifest's identity-stable logger, captured once at construction. */
	logger;
	/**
	* Whether page renders stream. From the facade hooks on the fast path,
	* else the environment's default.
	*/
	streaming;
	/**
	* Internal facade hook: late-bound `app.renderError` dispatch. Undefined on
	* bare and custom-handler paths — those fall through to the environment's
	* error strategy (`renderErrorPage`).
	*/
	renderError;
	/**
	* Internal facade hook: late-bound `app.logThisRequest` dispatch. Undefined
	* on bare and custom-handler paths — those fall through to the
	* environment's `logRequest` behavior.
	*/
	logRequest;
	/**
	* The request to render. Mutated during rewrites so subsequent renders
	* see the rewritten URL.
	*/
	request;
	routeData;
	/**
	* The pathname to use for routing and rendering. Starts out as the raw,
	* base-stripped, decoded pathname from the request. May be further
	* normalized by `handleRequest` after routeData is known (in dev, when
	* the matched route has no `.html` extension, `.html` / `/index.html`
	* suffixes are stripped).
	*/
	pathname;
	/** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
	renderOptions;
	/** When the request started, used to log duration. */
	timeStart;
	/**
	* The route's loaded component module. Set before middleware runs; may
	* be swapped during in-flight rewrites from inside the middleware chain.
	*/
	componentInstance;
	/**
	* Slot overrides supplied by the container API. `undefined` for HTTP
	* requests — `PagesHandler` coalesces to `{}` on read so we don't
	* allocate an empty object per request.
	*/
	slots;
	/**
	* The `Response` produced by handlers, if any. Set after page
	* rendering or middleware completes.
	*/
	response;
	/**
	* Default HTTP status for the rendered response. Callers override
	* before rendering runs (e.g. `handleRequest` sets this from
	* `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
	*/
	status = 200;
	/** Whether user middleware should be skipped for this request. */
	skipMiddleware = false;
	/**
	* Set to `true` when the request path was encoded too many times to fully
	* decode (see {@link validateAndDecodePathname}). These requests are
	* rejected with a `400` before middleware or routing run.
	*/
	invalidEncoding = false;
	/** A flag that tells the render content if the rewriting was triggered. */
	isRewriting = false;
	/** A safety net in case of loops (rewrite counter). */
	counter = 0;
	/** Cookies for this request. Created lazily on first access. */
	cookies;
	/** Route params derived from routeData + pathname. Computed lazily. */
	#params;
	get params() {
		if (!this.#params && this.routeData) this.#params = getParams(this.routeData, this.pathname);
		return this.#params;
	}
	set params(value) {
		this.#params = value;
	}
	/** Normalized URL for this request. */
	url;
	/** Client address for this request. */
	clientAddress;
	/** Whether this is a partial render (container API). */
	partial;
	/** Internal metadata about the current response route type. */
	responseRouteType;
	/** Internal flag to prevent rerouting this response to an error page. */
	skipErrorReroute = false;
	/** Whether to inject CSP meta tags. */
	shouldInjectCspMetaTags;
	/** Request-scoped locals object, shared with user middleware. */
	locals = {};
	/**
	* Memoized `props` (see `getProps`). `null` means "not yet computed"
	* — using `null` (rather than `undefined`) keeps the hidden class
	* stable and distinct from a valid-but-empty result.
	*/
	props = null;
	/** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
	actionApiContext = null;
	/** Memoized `APIContext` (see `getAPIContext`). */
	apiContext = null;
	/** Registered context providers keyed by name. Lazy-initialized on first provide(). */
	#providers;
	/** Cached values from resolved providers. Lazy-initialized on first resolve(). */
	#providersResolvedValues;
	/** Cached promise for lazy component instance loading. */
	#componentInstancePromise;
	/** SSR result for the current page render. */
	result;
	/** Initial props (from container/error handler). */
	initialProps = {};
	/** Memoized Astro page partial. */
	#astroPagePartial;
	/**
	* Locale-prefixed pathname derived from the Host header for domain-based
	* i18n routing (e.g. `/en/boats/1/foo`), or `undefined` when the request
	* isn't served from a locale-mapped domain. When set, `this.pathname` is
	* derived from it so locale/param resolution match the route pattern.
	*/
	#domainPathname;
	/** Memoized current locale. */
	#currentLocale;
	/** Memoized preferred locale. */
	#preferredLocale;
	/** Memoized preferred locale list. */
	#preferredLocaleList;
	constructor(manifest, request, options, hooks) {
		this.manifest = manifest;
		this.logger = getLogger(manifest);
		this.streaming = hooks?.streaming ?? getEnvironment(manifest).defaultStreaming(manifest);
		this.renderError = hooks?.renderError;
		this.logRequest = hooks?.logRequest;
		this.request = request;
		options ??= getRenderOptions(request);
		this.routeData = options?.routeData;
		const self = this;
		this.renderOptions = {
			...options ?? {
				addCookieHeader: false,
				clientAddress: void 0,
				prerenderedErrorPageFetch: fetch,
				routeData: void 0,
				waitUntil: void 0
			},
			get locals() {
				return self.locals;
			}
		};
		this.componentInstance = void 0;
		this.slots = void 0;
		const url = new URL(request.url);
		const publicPathname = this.#normalizePathname(url.pathname);
		const pathname = this.#computePathname(publicPathname);
		setPathname(url, publicPathname);
		setPathname(url, collapseDuplicateSlashes(url.pathname));
		const domainPathname = computePathnameFromDomain(request, url, manifest.i18n, manifest.base, manifest.trailingSlash, this.logger, pathname);
		if (domainPathname) {
			this.#domainPathname = domainPathname;
			this.pathname = domainPathname;
		} else this.pathname = pathname;
		this.timeStart = performance.now();
		this.clientAddress = options?.clientAddress;
		this.locals = options?.locals ?? {};
		this.url = url;
		this.cookies = new AstroCookies(request, this.logger);
		if (manifest.allowedDomains && manifest.allowedDomains.length > 0 && !this.routeData?.prerender) this.#applyForwardedHeaders();
		if (!Reflect.get(this.request, originPathnameSymbol)) setOriginPathname(this.request, this.pathname, manifest.trailingSlash, manifest.buildFormat);
		this.#resolveRouteData();
	}
	/**
	* Triggers a rewrite. Delegates to the rewrites handler module.
	*/
	rewrite(payload) {
		return executeRewrite(this, payload);
	}
	/**
	* Creates the SSR result for the current page render.
	*/
	async createResult(mod, ctx) {
		const manifest = this.manifest;
		const env = getEnvironment(manifest);
		const { clientDirectives, inlinedScripts, compressHTML } = manifest;
		const renderers = env.getRenderers(manifest);
		const resolve = (specifier) => env.resolve(manifest, specifier);
		const routeData = this.routeData;
		const { links, scripts, styles } = await env.headElements(manifest, routeData);
		const extraStyleHashes = [];
		const extraScriptHashes = [];
		const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest.shouldInjectCspMetaTags;
		const cspAlgorithm = manifest.csp?.algorithm ?? "SHA-256";
		if (shouldInjectCspMetaTags) {
			for (const style of styles) extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
			for (const script of scripts) extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
		}
		const componentMetadata = await env.componentMetadata(manifest, routeData) ?? manifest.componentMetadata;
		const headers = new Headers({ "Content-Type": "text/html" });
		const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
		const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
		const status = this.status;
		const response = {
			status: actionResult?.error ? actionResult?.error.status : status,
			statusText: actionResult?.error ? actionResult?.error.type : "OK",
			get headers() {
				return headers;
			},
			set headers(_) {
				throw new AstroError(AstroResponseHeadersReassigned);
			}
		};
		const state = this;
		const result = {
			base: manifest.base,
			userAssetsBase: manifest.userAssetsBase,
			cancelled: false,
			clientDirectives,
			inlinedScripts,
			componentMetadata,
			compressHTML,
			cookies: this.cookies,
			createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
			links,
			params: this.params,
			partial,
			pathname: this.pathname,
			renderers,
			resolve,
			response,
			request: this.request,
			scripts,
			styles,
			actionResult,
			async getServerIslandNameMap() {
				return (await getServerIslands(manifest)).serverIslandNameMap ?? /* @__PURE__ */ new Map();
			},
			key: manifest.key,
			trailingSlash: manifest.trailingSlash,
			_metadata: {
				hasHydrationScript: false,
				rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
				hasRenderedHead: false,
				renderedScripts: /* @__PURE__ */ new Set(),
				hasDirectives: /* @__PURE__ */ new Set(),
				hasRenderedServerIslandRuntime: false,
				headInTree: false,
				extraHead: [],
				extraStyleHashes,
				extraScriptHashes,
				propagators: /* @__PURE__ */ new Set(),
				routeHasPropagation: false,
				pendingSlotEvaluations: [],
				templateDepth: 0
			},
			cspDestination: manifest.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
			shouldInjectCspMetaTags,
			cspAlgorithm,
			directives: manifest.csp?.directives ? [...manifest.csp.directives] : [],
			scriptHashes: manifest.csp?.scriptHashes ? [...manifest.csp.scriptHashes] : [],
			scriptResources: manifest.csp?.scriptResources ? [...manifest.csp.scriptResources] : [],
			styleHashes: manifest.csp?.styleHashes ? [...manifest.csp.styleHashes] : [],
			styleResources: manifest.csp?.styleResources ? [...manifest.csp.styleResources] : [],
			isStrictDynamic: manifest.csp?.isStrictDynamic ?? false,
			scriptDirective: {
				resources: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.resources] : [],
				hashes: manifest.csp?.scriptDirective ? [...manifest.csp.scriptDirective.hashes] : [],
				strictDynamic: manifest.csp?.scriptDirective?.strictDynamic ?? false
			},
			styleDirective: {
				resources: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.resources] : [],
				hashes: manifest.csp?.styleDirective ? [...manifest.csp.styleDirective.hashes] : []
			},
			speculationRulesContent: manifest.csp?.speculationRulesContent,
			internalFetchHeaders: manifest.internalFetchHeaders
		};
		this.result = result;
		return result;
	}
	/**
	* Creates the Astro global object for a component render.
	*/
	createAstro(result, props, slotValues, apiContext) {
		let astroPagePartial;
		if (this.isRewriting) this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
		this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
		astroPagePartial = this.#astroPagePartial;
		const astroComponentPartial = {
			props,
			self: null
		};
		const Astro = Object.assign(Object.create(astroPagePartial), astroComponentPartial);
		let _slots;
		Object.defineProperty(Astro, "slots", { get: () => {
			if (!_slots) _slots = new Slots(result, slotValues, this.logger);
			return _slots;
		} });
		return Astro;
	}
	/**
	* Creates the Astro page-level partial (prototype for Astro global).
	*/
	createAstroPagePartial(result, apiContext) {
		const state = this;
		const { cookies, locals, params, logger, url } = this;
		const { response } = result;
		const redirect = (path, status = 302) => {
			if (state.request[responseSentSymbol$1]) throw new AstroError({ ...ResponseSentError });
			return new Response(null, {
				status,
				headers: { Location: path }
			});
		};
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		const callAction = createCallAction(apiContext);
		const partial = {
			generator: ASTRO_GENERATOR,
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			cookies,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			locals,
			redirect,
			rewrite,
			request: this.request,
			response,
			site: getSite(this.manifest),
			getActionResult: createGetActionResult(locals),
			get callAction() {
				return callAction;
			},
			url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return astroToRuntimeLogger(logger);
			}
		};
		this.defineProviderGetters(partial);
		return partial;
	}
	getClientAddress() {
		const { clientAddress } = this;
		const routeData = this.routeData;
		if (routeData.prerender) throw new AstroError({
			...PrerenderClientAddressNotAvailable,
			message: PrerenderClientAddressNotAvailable.message(routeData.component)
		});
		if (clientAddress) return clientAddress;
		if (this.manifest.adapterName) throw new AstroError({
			...ClientAddressNotAvailable,
			message: ClientAddressNotAvailable.message(this.manifest.adapterName)
		});
		throw new AstroError(StaticClientAddressNotAvailable);
	}
	getCookies() {
		return this.cookies;
	}
	getCsp() {
		const state = this;
		if (!this.manifest.csp) {
			if (getEnvironment(this.manifest).runtimeMode === "production") this.logger.warn("csp", `context.csp was used when rendering the route ${colors.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`);
			return;
		}
		const warnedFallback = /* @__PURE__ */ new Set();
		const warnFallback = (family, kind) => {
			if (kind === "default" || !state.result) return;
			const defaultResources = (family === "script" ? state.result.scriptDirective : state.result.styleDirective).resources.map(normalizeCspResourceEntry).filter((entry) => entry.kind === "default").map((entry) => entry.resource);
			if (defaultResources.length === 0) return;
			const key = `${family}:${kind}`;
			if (warnedFallback.has(key)) return;
			warnedFallback.add(key);
			const general = `${family}-src`;
			const specific = `${general}-${kind === "element" ? "elem" : "attr"}`;
			state.logger.warn("csp", `A resource was added to \`${specific}\`, but \`${general}\` also defines custom resources (${defaultResources.join(" ")}). Because \`${specific}\` overrides \`${general}\` for its scope (browsers do not fall back), those resources will not apply there. Add them to \`${specific}\` as well if needed.`);
		};
		return {
			insertDirective(payload) {
				if (state.result) state.result.directives = pushDirective(state.result.directives, payload);
			},
			insertScriptResource(payload) {
				if (!state.result) return;
				warnFallback("script", normalizeCspResourceEntry(payload).kind);
				state.result.scriptDirective.resources.push(payload);
			},
			insertStyleResource(payload) {
				if (!state.result) return;
				warnFallback("style", normalizeCspResourceEntry(payload).kind);
				state.result.styleDirective.resources.push(payload);
			},
			insertStyleHash(payload) {
				state.result?.styleDirective.hashes.push(payload);
			},
			insertScriptHash(payload) {
				state.result?.scriptDirective.hashes.push(payload);
			}
		};
	}
	computeCurrentLocale() {
		const { url, manifest: { i18n }, routeData } = this;
		if (!i18n || !routeData) return;
		const { defaultLocale, locales, strategy } = i18n;
		const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
		if (this.#currentLocale) return this.#currentLocale;
		let computedLocale;
		if (isRouteServerIsland(routeData)) {
			let referer = this.request.headers.get("referer");
			if (referer) {
				if (URL.canParse(referer)) referer = new URL(referer).pathname;
				computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
			}
		} else {
			let pathname = routeData.pathname;
			if (this.#domainPathname) pathname = this.pathname;
			else if (url && !routeData.pattern.test(url.pathname)) {
				for (const fallbackRoute of routeData.fallbackRoutes) if (fallbackRoute.pattern.test(url.pathname)) {
					pathname = fallbackRoute.pathname;
					break;
				}
			}
			pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
			computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
			if (routeData.params.length > 0) {
				const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
				if (localeFromParams) computedLocale = localeFromParams;
			}
		}
		this.#currentLocale = computedLocale ?? fallbackTo;
		return this.#currentLocale;
	}
	computePreferredLocale() {
		const { manifest: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
	}
	computePreferredLocaleList() {
		const { manifest: { i18n }, request } = this;
		if (!i18n) return;
		return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
	}
	/**
	* Lazily loads the route's component module. Returns the cached
	* instance if already loaded. The promise is cached so concurrent
	* callers share the same load.
	*/
	async loadComponentInstance() {
		if (this.componentInstance) return this.componentInstance;
		if (this.#componentInstancePromise) return this.#componentInstancePromise;
		this.#componentInstancePromise = getEnvironment(this.manifest).getComponentByRoute(this.manifest, this.routeData).then((mod) => {
			this.componentInstance = mod;
			return mod;
		});
		return this.#componentInstancePromise;
	}
	/**
	* Registers a context provider under the given key. Handlers call
	* this to contribute values to the request context (e.g. sessions).
	* The `create` factory is called lazily on the first `resolve(key)`.
	*/
	provide(key, provider) {
		(this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
	}
	/**
	* Lazily resolves a provider registered under `key`. Calls
	* `provider.create()` on first access and caches the result.
	* Returns `undefined` if no provider was registered for the key.
	*/
	resolve(key) {
		if (this.#providersResolvedValues?.has(key)) return this.#providersResolvedValues.get(key);
		const provider = this.#providers?.get(key);
		if (!provider) return void 0;
		const value = provider.create();
		(this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
		return value;
	}
	/**
	* Runs all registered `finalize` callbacks. Should be called after
	* the response is produced, typically in a `finally` block.
	*
	* Returns synchronously (no promise allocation) when nothing needs
	* finalizing — important for the hot path where sessions are not used.
	*/
	finalizeAll() {
		if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
		let chain;
		for (const [key, provider] of this.#providers) if (provider.finalize && this.#providersResolvedValues.has(key)) {
			const result = provider.finalize(this.#providersResolvedValues.get(key));
			if (result) chain = chain ? chain.then(() => result) : result;
		}
		return chain;
	}
	/**
	* Adds lazy getters to `target` for each registered provider key.
	* Used by context creation (APIContext, Astro global) so that
	* provider values like `session` and `cache` appear as properties
	* without hard-coding the keys.
	*
	* Always defines a `session` getter (returning `undefined` when no
	* provider is registered) so `ctx.session` / `Astro.session` is a
	* present property regardless of whether the sessions handler was
	* included in the pipeline.
	*/
	defineProviderGetters(target) {
		const state = this;
		if (this.#providers) for (const key of this.#providers.keys()) Object.defineProperty(target, key, {
			get: () => state.resolve(key),
			enumerable: true,
			configurable: true
		});
		if (!this.#providers?.has("session")) {
			let warned = false;
			Object.defineProperty(target, "session", {
				get() {
					if (!warned) {
						warned = true;
						state.logger.warn("session", "`Astro.session` was accessed but no session storage is configured. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/");
					}
				},
				enumerable: true,
				configurable: true
			});
		}
	}
	/**
	* Resolves the route to use for this request and stores it on
	* `this.routeData`. If the adapter (or the dev server) provided a
	* `routeData` via render options it's already set and this is a
	* no-op. Otherwise we use the app's synchronous route matcher and
	* fall back to a `404.astro` route so middleware can still run.
	*
	* Called eagerly from the constructor so individual handlers
	* (actions, pages, middleware, etc.) always see a resolved route
	* without the caller needing an extra setup step.
	*
	* Once routeData is known, finalizes `this.pathname`: in dev, if the
	* matched route has no `.html` extension, strip `.html` / `/index.html`
	* suffixes so the rendering pipeline sees the canonical pathname.
	*/
	/**
	* Strip `.html` / `/index.html` suffixes from the pathname so the
	* rendering pipeline sees the canonical route path. Only applies to
	* page routes where `.html` is framework-injected. Endpoint routes
	* preserve `.html` because any such suffix is user-provided (e.g.
	* from `getStaticPaths` params). Skipped when the matched route
	* itself has an `.html` extension in its definition.
	*/
	#stripHtmlExtension() {
		if (this.routeData && this.routeData.type === "page" && !routeHasHtmlExtension(this.routeData)) {
			const original = this.pathname;
			this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
			if (this.manifest.trailingSlash === "always" && this.pathname !== "" && !this.pathname.endsWith("/")) this.pathname += "/";
			if (this.pathname !== original && this.routeData.pattern.test(original) && !this.routeData.pattern.test(this.pathname)) this.pathname = original;
		}
	}
	#resolveRouteData() {
		if (this.routeData) {
			this.#stripHtmlExtension();
			return;
		}
		const matched = matchRoute(this.manifest, this.pathname);
		if (matched && matched.prerender && this.manifest.serverLike) {
			if (matched.params.length > 0) {
				const allMatches = matchAllRoutes(this.manifest, this.pathname);
				this.routeData = allMatches.find((r) => !r.prerender);
			} else this.routeData = void 0;
		} else this.routeData = matched;
		this.logger.debug("router", "Astro matched the following route for " + this.request.url);
		this.logger.debug("router", "RouteData:\n" + this.routeData);
		if (!this.routeData) {
			const custom404 = getCustom404Route(getRouteTable(this.manifest));
			if (custom404 && !custom404.prerender) this.routeData = custom404;
		}
		if (!this.routeData) {
			this.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
			this.logger.debug("router", "Here's the available routes:\n", getRouteTable(this.manifest));
			return;
		}
		this.#stripHtmlExtension();
	}
	/**
	* Strips the manifest's base from a normalized request pathname and prepends
	* a forward slash.
	*
	* Mirrors `BaseApp.removeBase`: the router matches against this stripped path
	* while middleware reads the un-stripped `context.url.pathname`, so both must
	* strip the base identically.
	*/
	#computePathname(normalizedPathname) {
		return prependForwardSlash(stripRequestBase(normalizedPathname, this.manifest.base));
	}
	/**
	* Decodes and normalizes the public request pathname before deriving the
	* separate pathname used for route matching.
	*/
	#normalizePathname(pathname) {
		try {
			pathname = validateAndDecodePathname(pathname);
		} catch (e) {
			if (e instanceof MultiLevelEncodingError) this.invalidEncoding = true;
			else this.logger.error(null, e.toString());
		}
		return collapseDuplicateSlashes(pathname);
	}
	/**
	* Reads X-Forwarded-Proto, X-Forwarded-Host, and X-Forwarded-Port
	* from the request headers, validates them against the manifest's
	* `allowedDomains`, and updates `this.url` accordingly. Also resolves
	* `clientAddress` from X-Forwarded-For when the host is trusted.
	*
	* Only called when `allowedDomains` is configured — without it,
	* forwarded headers are never trusted.
	*/
	#applyForwardedHeaders() {
		const headers = this.request.headers;
		const allowedDomains = this.manifest.allowedDomains;
		const validated = validateForwardedHeaders(getFirstForwardedValue(headers.get("x-forwarded-proto") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-host") ?? void 0), getFirstForwardedValue(headers.get("x-forwarded-port") ?? void 0), allowedDomains);
		if (!validated.protocol && !validated.host && !validated.port) return;
		if (validated.protocol) this.url.protocol = validated.protocol + ":";
		if (validated.host) {
			const colonIdx = validated.host.indexOf(":");
			if (colonIdx !== -1) {
				this.url.hostname = validated.host.slice(0, colonIdx);
				this.url.port = validated.host.slice(colonIdx + 1);
			} else {
				this.url.hostname = validated.host;
				this.url.port = "";
			}
		}
		if (validated.port) this.url.port = validated.port;
		if (validated.host !== void 0 && !this.clientAddress) {
			const forwardedFor = getFirstForwardedValue(this.request.headers.get("x-forwarded-for") ?? void 0);
			if (forwardedFor) this.clientAddress = forwardedFor;
		}
		this.request = new Request(this.url, this.request);
	}
	/**
	* Returns the resolved `props` for this render, computing them lazily
	* from the route + component module on first access. If the
	* `initialProps` already carries user-supplied props (e.g. the
	* container API) those are used verbatim.
	*/
	async getProps() {
		if (this.props !== null) return this.props;
		if (Object.keys(this.initialProps).length > 0) {
			this.props = this.initialProps;
			return this.props;
		}
		const mod = await this.loadComponentInstance();
		this.props = await getProps({
			mod,
			routeData: this.routeData,
			routeCache: getRouteCache(this.manifest),
			pathname: this.pathname,
			logger: this.logger,
			serverLike: this.manifest.serverLike,
			base: this.manifest.base,
			trailingSlash: this.manifest.trailingSlash
		});
		return this.props;
	}
	/**
	* Returns the `ActionAPIContext` for this render, creating it lazily.
	* Used by middleware, actions, and page dispatch.
	*/
	getActionAPIContext() {
		if (this.actionApiContext !== null) return this.actionApiContext;
		const state = this;
		const ctx = {
			get cookies() {
				return state.cookies;
			},
			routePattern: this.routeData.route,
			isPrerendered: this.routeData.prerender,
			get clientAddress() {
				return state.getClientAddress();
			},
			get currentLocale() {
				return state.computeCurrentLocale();
			},
			generator: ASTRO_GENERATOR,
			get locals() {
				return state.locals;
			},
			set locals(_) {
				throw new AstroError(LocalsReassigned);
			},
			params: this.params,
			get preferredLocale() {
				return state.computePreferredLocale();
			},
			get preferredLocaleList() {
				return state.computePreferredLocaleList();
			},
			request: this.request,
			site: getSite(this.manifest),
			url: this.url,
			get originPathname() {
				return getOriginPathname(state.request);
			},
			get csp() {
				return state.getCsp();
			},
			get logger() {
				return astroToRuntimeLogger(state.logger);
			}
		};
		this.defineProviderGetters(ctx);
		this.actionApiContext = ctx;
		return this.actionApiContext;
	}
	/**
	* Returns the `APIContext` for this render, creating it lazily from
	* the memoized props + action context.
	*
	* Callers must ensure `getProps()` has resolved at least once before
	* calling this.
	*/
	getAPIContext() {
		if (this.apiContext !== null) return this.apiContext;
		const actionApiContext = this.getActionAPIContext();
		const state = this;
		const redirect = (path, status = 302) => new Response(null, {
			status,
			headers: { Location: path }
		});
		const rewrite = async (reroutePayload) => {
			return await state.rewrite(reroutePayload);
		};
		actionApiContext[fetchStateSymbol] = this;
		this.apiContext = Object.assign(actionApiContext, {
			props: this.props,
			redirect,
			rewrite,
			getActionResult: createGetActionResult(actionApiContext.locals),
			callAction: createCallAction(actionApiContext)
		});
		return this.apiContext;
	}
	/**
	* Invalidates the cached `APIContext` so the next `getAPIContext()`
	* call re-derives it from the (possibly mutated) state. Used
	* after an in-flight rewrite swaps the route / request / params.
	*/
	invalidateContexts() {
		this.props = null;
		this.actionApiContext = null;
		this.apiContext = null;
	}
	resetResponseMetadata() {
		this.responseRouteType = void 0;
		this.skipErrorReroute = false;
	}
};
//#endregion
//#region node_modules/@astrojs/internal-helpers/dist/object.js
var FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
//#endregion
//#region node_modules/astro/dist/actions/noop-actions.js
var NOOP_ACTIONS_MOD = { server: {} };
//#endregion
//#region node_modules/astro/dist/actions/load.js
var actionsMemo = createAsyncManifestMemo(async (manifest) => manifest.actions ? await manifest.actions() : NOOP_ACTIONS_MOD);
function getActions(manifest) {
	return actionsMemo.get(manifest);
}
async function getAction(manifest, path) {
	const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
	let { server } = await getActions(manifest);
	if (!server || !(typeof server === "object")) throw new TypeError(`Expected \`server\` export in actions file to be an object. Received ${typeof server}.`);
	for (const key of pathKeys) {
		if (typeof server === "function") throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		if (FORBIDDEN_PATH_KEYS.has(key)) throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		if (!Object.hasOwn(server, key)) throw new AstroError({
			...ActionNotFoundError,
			message: ActionNotFoundError.message(pathKeys.join("."))
		});
		server = server[key];
	}
	if (typeof server !== "function") throw new TypeError(`Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`);
	return server;
}
//#endregion
//#region node_modules/astro/dist/actions/runtime/server.js
function getActionContext(context) {
	const callerInfo = getCallerInfo(context);
	const actionResultAlreadySet = Boolean(context.locals._actionPayload);
	let action = void 0;
	if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) action = {
		calledFrom: callerInfo.from,
		name: callerInfo.name,
		handler: async () => {
			const { manifest } = getFetchStateFromAPIContext(context);
			const callerInfoName = shouldAppendForwardSlash(manifest.trailingSlash, manifest.buildFormat) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
			let baseAction;
			try {
				baseAction = await getAction(manifest, callerInfoName);
			} catch (error) {
				if (error instanceof Error && "name" in error && typeof error.name === "string" && error.name === ActionNotFoundError.name) return {
					data: void 0,
					error: new ActionError({ code: "NOT_FOUND" })
				};
				throw error;
			}
			const bodySizeLimit = manifest.actionBodySizeLimit;
			let input;
			try {
				input = await parseRequestBody(context.request, bodySizeLimit);
			} catch (e) {
				if (e instanceof ActionError) return {
					data: void 0,
					error: e
				};
				if (e instanceof TypeError) return {
					data: void 0,
					error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" })
				};
				throw e;
			}
			const omitKeys = [
				"props",
				"getActionResult",
				"callAction",
				"redirect"
			];
			const actionAPIContext = Object.create(Object.getPrototypeOf(context), Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(context)).filter(([key]) => !omitKeys.includes(key))));
			Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
			return baseAction.bind(actionAPIContext)(input);
		}
	};
	function setActionResult(actionName, actionResult) {
		context.locals._actionPayload = {
			actionResult,
			actionName
		};
	}
	return {
		action,
		setActionResult,
		serializeActionResult,
		deserializeActionResult
	};
}
function getCallerInfo(ctx) {
	if (ctx.routePattern === "/_actions/[...path]") return {
		from: "rpc",
		name: ctx.url.pathname.replace(/^.*\/_actions\//, "")
	};
	const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
	if (queryParam) return {
		from: "form",
		name: queryParam
	};
}
async function parseRequestBody(request, bodySizeLimit) {
	const contentType = request.headers.get("content-type");
	const contentLengthHeader = request.headers.get("content-length");
	const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
	const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
	if (!contentType) return void 0;
	if (hasContentLength && contentLength > bodySizeLimit) throw new ActionError({
		code: "CONTENT_TOO_LARGE",
		message: `Request body exceeds ${bodySizeLimit} bytes`
	});
	try {
		if (hasContentType(contentType, formContentTypes)) {
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				return await new Request(request.url, {
					method: request.method,
					headers: request.headers,
					body: toArrayBuffer(body)
				}).formData();
			}
			return await request.clone().formData();
		}
		if (hasContentType(contentType, ["application/json"])) {
			if (contentLength === 0) return void 0;
			if (!hasContentLength) {
				const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
				if (body.byteLength === 0) return void 0;
				return JSON.parse(new TextDecoder().decode(body));
			}
			return await request.clone().json();
		}
	} catch (e) {
		if (e instanceof BodySizeLimitError) throw new ActionError({
			code: "CONTENT_TOO_LARGE",
			message: `Request body exceeds ${bodySizeLimit} bytes`
		});
		throw e;
	}
	throw new TypeError("Unsupported content type");
}
var ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
var formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
	const type = contentType.split(";")[0].toLowerCase();
	return expected.some((t) => type === t);
}
function serializeActionResult(res) {
	if (res.error) {
		if (Object.assign({
			"ASSETS_PREFIX": void 0,
			"BASE_URL": "/",
			"DEV": false,
			"MODE": "production",
			"PROD": true,
			"SITE": void 0,
			"SSR": true
		}, { OS: "Windows_NT" })?.DEV) actionResultErrorStack.set(res.error.stack);
		let body2;
		if (res.error instanceof ActionInputError) body2 = {
			type: res.error.type,
			issues: res.error.issues,
			fields: res.error.fields
		};
		else body2 = {
			...res.error,
			message: res.error.message
		};
		return {
			type: "error",
			status: res.error.status,
			contentType: "application/json",
			body: JSON.stringify(body2)
		};
	}
	if (res.data === void 0) return {
		type: "empty",
		status: 204
	};
	let body;
	try {
		body = stringify(res.data, { URL: (value) => value instanceof URL && value.href });
	} catch (e) {
		let hint = ActionsReturnedInvalidDataError.hint;
		if (res.data instanceof Response) hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
		throw new AstroError({
			...ActionsReturnedInvalidDataError,
			message: ActionsReturnedInvalidDataError.message(String(e)),
			hint
		});
	}
	return {
		type: "data",
		status: 200,
		contentType: "application/json+devalue",
		body
	};
}
function toArrayBuffer(buffer) {
	const copy = new Uint8Array(buffer.byteLength);
	copy.set(buffer);
	return copy.buffer;
}
//#endregion
//#region node_modules/astro/dist/actions/handler.js
function handleAction(apiContext, state) {
	markFeatureUsed(state.manifest, FetchFeatures.actions);
	if (apiContext.isPrerendered) return;
	const { action, setActionResult } = getActionContext(apiContext);
	if (!action) return;
	if (state.manifest.checkOrigin && isForbiddenCrossOriginRequest(apiContext.request, apiContext.url, apiContext.isPrerendered)) return Promise.resolve(createCrossOriginForbiddenResponse(apiContext.request));
	return executeAction(action, setActionResult);
}
async function executeAction(action, setActionResult) {
	const serialized = serializeActionResult(await action.handler());
	if (action.calledFrom === "rpc") {
		if (serialized.type === "empty") return new Response(null, { status: serialized.status });
		return new Response(serialized.body, {
			status: serialized.status,
			headers: { "Content-Type": serialized.contentType }
		});
	}
	setActionResult(action.name, serialized);
}
//#endregion
//#region node_modules/astro/dist/core/routing/3xx.js
function redirectTemplate({ status, absoluteLocation, relativeLocation, from }) {
	const delay = status === 302 ? 2 : 0;
	const rel = escape(String(relativeLocation));
	return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${escape(String(absoluteLocation))}">
<body>
	<a href="${rel}">Redirecting ${from ? `from <code>${escape(from)}</code> ` : ""}to <code>${rel}</code></a>
</body>`;
}
//#endregion
//#region node_modules/astro/dist/core/routing/trailing-slash-handler.js
function handleTrailingSlash(state) {
	const url = new URL(state.request.url);
	const redirect = redirectTrailingSlash(state.manifest.trailingSlash, url.pathname);
	if (redirect === url.pathname) return;
	const addCookieHeader = state.renderOptions.addCookieHeader;
	const status = state.request.method === "GET" ? 301 : 308;
	const response = new Response(redirectTemplate({
		status,
		relativeLocation: url.pathname,
		absoluteLocation: redirect,
		from: state.request.url
	}), {
		status,
		headers: { location: redirect + url.search }
	});
	prepareResponse(response, { addCookieHeader });
	return response;
}
function redirectTrailingSlash(trailingSlash, pathname) {
	if (pathname === "/" || isInternalPath(pathname)) return pathname;
	const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
	if (path !== pathname) return path;
	if (trailingSlash === "ignore") return pathname;
	if (trailingSlash === "always" && !hasFileExtension(pathname)) return appendForwardSlash(pathname);
	if (trailingSlash === "never") return removeTrailingForwardSlash(pathname);
	return pathname;
}
//#endregion
//#region node_modules/astro/dist/core/cache/provider.js
var cacheProviderMemo = createAsyncManifestMemo(async (manifest) => {
	if (manifest.cacheProvider) {
		const factory = (await manifest.cacheProvider())?.default || null;
		return factory ? factory(manifest.cacheConfig?.options) : null;
	}
	return null;
});
function getCacheProvider(manifest) {
	return cacheProviderMemo.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/cache/runtime/utils.js
function defaultSetHeaders(options) {
	const headers = new Headers();
	const directives = [];
	if (options.maxAge !== void 0) directives.push(`max-age=${options.maxAge}`);
	if (options.swr !== void 0) directives.push(`stale-while-revalidate=${options.swr}`);
	if (directives.length > 0) headers.set("CDN-Cache-Control", directives.join(", "));
	if (options.tags && options.tags.length > 0) headers.set("Cache-Tag", options.tags.join(", "));
	if (options.lastModified) headers.set("Last-Modified", options.lastModified.toUTCString());
	if (options.etag) headers.set("ETag", options.etag);
	return headers;
}
function isLiveDataEntry(value) {
	return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
//#endregion
//#region node_modules/astro/dist/core/cache/runtime/cache.js
var APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
var IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
var AstroCache = class {
	#options = {};
	#tags = /* @__PURE__ */ new Set();
	#disabled = false;
	#provider;
	enabled = true;
	constructor(provider) {
		this.#provider = provider;
	}
	set(input) {
		if (input === false) {
			this.#disabled = true;
			this.#tags.clear();
			this.#options = {};
			return;
		}
		this.#disabled = false;
		let options;
		if (isLiveDataEntry(input)) {
			if (!input.cacheHint) return;
			options = input.cacheHint;
		} else options = input;
		if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
		if ("swr" in options && options.swr !== void 0) this.#options.swr = options.swr;
		if ("etag" in options && options.etag !== void 0) this.#options.etag = options.etag;
		if (options.lastModified !== void 0) {
			if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) this.#options.lastModified = options.lastModified;
		}
		if (options.tags) for (const tag of options.tags) this.#tags.add(tag);
	}
	get tags() {
		return [...this.#tags];
	}
	/**
	* Get the current cache options (read-only snapshot).
	* Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
	*/
	get options() {
		return {
			...this.#options,
			tags: this.tags
		};
	}
	async invalidate(input) {
		if (!this.#provider) throw new AstroError(CacheNotEnabled);
		let options;
		if (isLiveDataEntry(input)) options = { tags: input.cacheHint?.tags ?? [] };
		else options = input;
		return this.#provider.invalidate(options);
	}
	/** @internal */
	[APPLY_HEADERS](response, request) {
		if (this.#disabled) return;
		const finalOptions = {
			...this.#options,
			tags: this.tags
		};
		if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
		const headers = this.#provider?.setHeaders?.(finalOptions, request) ?? defaultSetHeaders(finalOptions);
		for (const [key, value] of headers) response.headers.set(key, value);
		if (!response.headers.has("Cache-Control") && !response.headers.has("Expires") && (response.headers.has("Last-Modified") || response.headers.has("ETag"))) response.headers.set("Cache-Control", "no-cache");
	}
	/** @internal */
	get [IS_ACTIVE]() {
		return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
	}
};
function applyCacheHeaders(cache, response, request) {
	if (APPLY_HEADERS in cache) cache[APPLY_HEADERS](response, request);
}
//#endregion
//#region node_modules/astro/dist/core/routing/parts.js
var ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
var ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
	const result = [];
	part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
		if (!str) return;
		const dynamic = i % 2 === 1;
		const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
		if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
		result.push({
			content,
			dynamic,
			spread: dynamic && ROUTE_SPREAD.test(content)
		});
	});
	return result;
}
//#endregion
//#region node_modules/astro/dist/core/cache/runtime/route-matching.js
function compileCacheRoutes(routes, base, trailingSlash) {
	const compiled = Object.entries(routes).map(([path, options]) => {
		const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s) => getParts(s, path));
		return {
			pattern: getPattern(segments, base, trailingSlash),
			options,
			segments,
			route: path
		};
	});
	compiled.sort((a, b) => routeComparator({
		segments: a.segments,
		route: a.route,
		type: "page"
	}, {
		segments: b.segments,
		route: b.route,
		type: "page"
	}));
	return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
	for (const route of compiledRoutes) if (route.pattern.test(pathname)) return route.options;
	return null;
}
//#endregion
//#region node_modules/astro/dist/core/cache/handler.js
var CACHE_KEY = "cache";
function provideCache(state) {
	const manifest = state.manifest;
	if (!manifest.cacheConfig) {
		state.provide(CACHE_KEY, { create: () => new DisabledAstroCache(state.logger) });
		return;
	}
	if (getEnvironment(manifest).runtimeMode === "development") {
		state.provide(CACHE_KEY, { create: () => new NoopAstroCache() });
		return;
	}
	return provideCacheAsync(state, manifest);
}
async function provideCacheAsync(state, manifest) {
	const cacheProvider = await getCacheProvider(manifest);
	state.provide(CACHE_KEY, { create() {
		const cache = new AstroCache(cacheProvider);
		if (manifest.cacheConfig?.routes) {
			const matched = matchCacheRoute(state.pathname, getCompiledCacheRoutes(manifest));
			if (matched) cache.set(matched);
		}
		return cache;
	} });
}
async function handleCache(state, next) {
	markFeatureUsed(state.manifest, FetchFeatures.cache);
	if (!state.manifest.cacheProvider) return next();
	const cache = state.resolve(CACHE_KEY);
	const cacheProvider = await getCacheProvider(state.manifest);
	if (cacheProvider?.onRequest) {
		const response2 = await cacheProvider.onRequest({
			request: state.request,
			url: new URL(state.request.url),
			waitUntil: state.renderOptions.waitUntil,
			logger: {
				info(msg) {
					state.logger.info("cache", msg);
				},
				warn(msg) {
					state.logger.warn("cache", msg);
				},
				error(msg) {
					state.logger.error("cache", msg);
				}
			}
		}, async () => {
			const res = await next();
			applyCacheHeaders(cache, res, state.request);
			return res;
		});
		response2.headers.delete("CDN-Cache-Control");
		response2.headers.delete("Cache-Tag");
		return response2;
	}
	const response = await next();
	applyCacheHeaders(cache, response, state.request);
	return response;
}
var compiledCacheRoutesMemo = createManifestMemo((manifest) => manifest.cacheConfig?.routes ? compileCacheRoutes(manifest.cacheConfig.routes, manifest.base, manifest.trailingSlash) : []);
function getCompiledCacheRoutes(manifest) {
	return compiledCacheRoutesMemo.get(manifest);
}
//#endregion
//#region node_modules/astro/dist/core/redirects/render.js
function isExternalURL(url) {
	return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
	if (typeof redirect === "string") return isExternalURL(redirect);
	else return isExternalURL(redirect.destination);
}
function computeRedirectStatus(method, redirect, redirectRoute) {
	return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
	if (typeof redirectRoute !== "undefined") return getRouteGenerator(redirectRoute.segments, trailingSlash)(params) || redirectRoute?.pathname || "/";
	else if (typeof redirect === "string") {
		if (redirectIsExternal(redirect)) return redirect;
		else {
			let target = redirect;
			for (const param of Object.keys(params)) {
				const paramValue = params[param];
				target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
			}
			return target;
		}
	} else if (typeof redirect === "undefined") return "/";
	return redirect.destination;
}
async function renderRedirect(state) {
	markFeatureUsed(state.manifest, FetchFeatures.redirects);
	const { redirect, redirectRoute } = state.routeData;
	const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
	const headers = { location: encodeURI(resolveRedirectTarget(state.params, redirect, redirectRoute, state.manifest.trailingSlash)) };
	if (redirect && redirectIsExternal(redirect)) {
		if (typeof redirect === "string") return Response.redirect(redirect, status);
		else return Response.redirect(redirect.destination, status);
	}
	return new Response(null, {
		status,
		headers
	});
}
//#endregion
//#region node_modules/astro/dist/core/routing/handler.js
function logRequestFromState(state, payload) {
	if (state.logRequest) state.logRequest(payload);
	else getEnvironment(state.manifest).logRequest(state.manifest, payload);
}
function actionsAndPages(state, ctx) {
	if (!state.skipMiddleware) {
		const actionResult = handleAction(ctx, state);
		if (actionResult) return actionResult.then((response) => response ?? handlePages(state, ctx));
	}
	return handlePages(state, ctx);
}
async function handleRequest(state) {
	await getResolvedLogger(state.manifest);
	markFeatureUsed(state.manifest, ALL_FETCH_FEATURES);
	if (state.invalidEncoding) return new Response(null, {
		status: 400,
		statusText: "Bad Request"
	});
	const trailingSlashRedirect = handleTrailingSlash(state);
	if (trailingSlashRedirect) return trailingSlashRedirect;
	if (!state.routeData) return renderErrorFromState(state, state.request, {
		...state.renderOptions,
		status: 404,
		pathname: state.pathname
	});
	return render(state);
}
async function render(state) {
	const routeData = state.routeData;
	const pathname = state.pathname;
	const request = state.request;
	const { addCookieHeader } = state.renderOptions;
	state.status = getDefaultStatusCode(state.manifest, routeData, pathname);
	let response;
	let finalizeError;
	try {
		const sessionP = state.manifest.sessionConfig ? provideSession(state) : void 0;
		const cacheP = provideCache(state);
		if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
		markFeatureUsed(state.manifest, FetchFeatures.sessions);
		if (routeData.type === "redirect") {
			const redirectResponse = await renderRedirect(state);
			logRequestFromState(state, {
				pathname,
				method: request.method,
				statusCode: redirectResponse.status,
				isRewrite: false,
				timeStart: state.timeStart
			});
			prepareResponse(redirectResponse, { addCookieHeader });
			state.logger.flush();
			return redirectResponse;
		}
		const i18n = getI18n(state.manifest);
		if (!state.manifest.cacheProvider) {
			markFeatureUsed(state.manifest, FetchFeatures.cache);
			response = await handleMiddleware(state, actionsAndPages);
			if (i18n) response = await finalizeI18n(i18n, state, response);
		} else {
			const runPipeline = async () => {
				let res = await handleMiddleware(state, actionsAndPages);
				if (i18n) res = await finalizeI18n(i18n, state, res);
				return res;
			};
			response = await handleCache(state, runPipeline);
		}
		logRequestFromState(state, {
			pathname,
			method: request.method,
			statusCode: response.status,
			isRewrite: state.isRewriting,
			timeStart: state.timeStart
		});
	} catch (err) {
		state.logger.error(null, err.stack || err.message || String(err));
		return renderErrorFromState(state, request, {
			...state.renderOptions,
			status: 500,
			error: err,
			pathname: state.pathname
		});
	} finally {
		try {
			const finalize = state.finalizeAll();
			if (finalize) await finalize;
		} catch (err) {
			finalizeError = err;
			state.logger.error(null, err.stack || err.message || String(err));
		}
	}
	if (finalizeError) return renderErrorFromState(state, request, {
		...state.renderOptions,
		status: 500,
		error: finalizeError,
		pathname: state.pathname
	});
	if (REROUTABLE_STATUS_CODES.includes(response.status) && response.body === null && !state.skipErrorReroute) return renderErrorFromState(state, request, {
		...state.renderOptions,
		response,
		status: response.status,
		error: response.status === 500 ? null : void 0,
		pathname: state.pathname
	});
	prepareResponse(response, { addCookieHeader });
	state.logger.flush();
	return response;
}
//#endregion
//#region node_modules/astro/dist/core/fetch/default-handler.js
var DefaultFetchHandler = class {
	#manifest;
	/**
	* `BaseApp` passes itself so states resolve that app's manifest ahead of
	* the ambient one; generated builds construct the handler with no
	* arguments and use the ambient manifest.
	*/
	constructor(app) {
		this.#manifest = app?.manifest;
	}
	fetch = (request) => {
		const options = getRenderOptions(request);
		return handleRequest(new FetchState(this.#manifest ?? getAmbientManifest(), request, options));
	};
};
//#endregion
//#region \0virtual:astro:fetchable
var _virtual_astro_fetchable_default = new DefaultFetchHandler();
//#endregion
//#region node_modules/astro/dist/core/routing/match-request.js
function safeDecodePathname(manifest, pathname) {
	try {
		return validateAndDecodePathname(pathname);
	} catch (e) {
		new AstroIntegrationLogger(getLogger(manifest).options, manifest.adapterName).debug(e.toString());
		try {
			return decodeURI(pathname);
		} catch {
			return pathname;
		}
	}
}
function matchRequest(manifest, request, allowPrerenderedRoutes = false) {
	const url = new URL(request.url);
	if (manifest.assets.has(url.pathname)) return void 0;
	let pathname = computePathnameFromDomain(request, url, manifest.i18n, manifest.base, manifest.trailingSlash, getLogger(manifest));
	if (!pathname) pathname = prependForwardSlash(stripRequestBase(url.pathname, manifest.base));
	pathname = safeDecodePathname(manifest, pathname);
	const routeData = matchRoute(manifest, pathname);
	if (!routeData) return void 0;
	if (allowPrerenderedRoutes) return routeData;
	if (routeData.prerender) {
		if (routeData.params.length > 0) return matchAllRoutes(manifest, pathname).find((r) => !r.prerender);
		return;
	}
	return routeData;
}
//#endregion
//#region node_modules/astro/dist/core/app/base.js
var BaseApp = class BaseApp {
	manifest;
	#adapterLogger;
	baseWithoutTrailingSlash;
	/**
	* The streaming flag passed to the constructor, surfaced through the
	* protected `resolveStreaming()` hook and fed into the internal
	* `FetchState` facade hooks on the fast path.
	*/
	#streaming;
	/**
	* The handler that turns incoming `Request` objects into `Response`s.
	* Defaults to a `DefaultFetchHandler` pinned to this app and can be
	* overridden via `setFetchHandler` — typically by the bundled
	* entrypoint after importing `virtual:astro:fetchable`.
	*/
	#fetchHandler;
	#errorHandler;
	/**
	* Whether a custom fetch handler (from `src/fetch.ts`) has been set
	* via `setFetchHandler`. When false, the `DefaultFetchHandler` is
	* in use and all features are implicitly active.
	*/
	#hasCustomFetchHandler = false;
	/**
	* Whether the missing-feature check has already run. We only want
	* to warn once — after the first request in dev, or at build end.
	*/
	#featureCheckDone = false;
	get logger() {
		return getLogger(this.manifest);
	}
	/**
	* Route data derived from the manifest, used for route matching. Reads and
	* writes go through the single per-manifest route table, so HMR updates are
	* visible to every consumer at once.
	*/
	get manifestData() {
		return getRouteTable(this.manifest);
	}
	set manifestData(routesList) {
		updateRouteTable(this.manifest, routesList.routes);
	}
	get adapterLogger() {
		const currentOptions = this.logger.options;
		if (!this.#adapterLogger || this.#adapterLogger.options !== currentOptions) this.#adapterLogger = new AstroIntegrationLogger(currentOptions, this.manifest.adapterName);
		return this.#adapterLogger;
	}
	constructor(manifest, streaming = true) {
		this.manifest = manifest;
		this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest.base);
		this.#streaming = streaming;
		getRouteTable(manifest);
		getLogger(manifest);
		this.#fetchHandler = new DefaultFetchHandler(this);
		this.#errorHandler = this.createErrorHandler();
	}
	/**
	* Resolves the user-configured logger destination from the manifest and
	* returns the logger. Lazy and only resolves once; safe to call before
	* the first render (adapters use this to log startup messages through
	* the configured destination).
	*/
	getLogger() {
		return getResolvedLogger(this.manifest);
	}
	/**
	* The streaming flag fed into the internal `FetchState` facade hooks on
	* the fast path. Returns the constructor flag by
	* default; `BuildApp` overrides this to return `undefined` so streaming
	* falls through to the environment default (`manifest.serverLike`).
	*/
	resolveStreaming() {
		return this.#streaming;
	}
	/**
	* Override the fetch handler used to dispatch requests. Entrypoints
	* call this with the default export of `virtual:astro:fetchable` to
	* plug in a user-authored handler from `src/fetch.ts`.
	*/
	setFetchHandler(handler) {
		this.#fetchHandler = handler;
		this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
	}
	/**
	* Returns the error handler used by this app. The default is a thin
	* bridge over the functional error API — strategy selection (production
	* default / dev / build) is environment-driven inside `renderErrorPage`.
	* External subclasses can override this to customize error rendering.
	*/
	createErrorHandler() {
		return { renderError: (request, options) => renderErrorPage(this.manifest, request, options) };
	}
	/**
	* Resets the cached adapter logger so it picks up a new logger instance.
	* Used by BuildApp when the logger is replaced via setOptions().
	*/
	resetAdapterLogger() {
		this.#adapterLogger = void 0;
	}
	getAllowedDomains() {
		return this.manifest.allowedDomains;
	}
	matchesAllowedDomains(forwardedHost, protocol) {
		return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
	}
	static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
		if (!allowedDomains || allowedDomains.length === 0) return false;
		try {
			const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
			return allowedDomains.some((pattern) => {
				return matchPattern(testUrl, pattern);
			});
		} catch {
			return false;
		}
	}
	set setManifestData(newManifestData) {
		updateRouteTable(this.manifest, newManifestData.routes);
	}
	removeBase(pathname) {
		return stripRequestBase(pathname, this.manifest.base);
	}
	/**
	* Fully decodes a pathname, falling back to a single decode and then the raw pathname
	* when validation fails. Adapter matching runs before `render()`, so it must not throw
	* for request input that render-time validation handles.
	*/
	safeDecodePathname(pathname) {
		try {
			return validateAndDecodePathname(pathname);
		} catch (e) {
			this.adapterLogger.debug(e.toString());
			try {
				return decodeURI(pathname);
			} catch {
				return pathname;
			}
		}
	}
	/**
	* Extracts the base-stripped, decoded pathname from a request.
	* Used by adapters to compute the pathname for dev-mode route matching.
	*/
	getPathnameFromRequest(request) {
		const url = new URL(request.url);
		const pathname = prependForwardSlash(this.removeBase(url.pathname));
		return this.safeDecodePathname(pathname);
	}
	/**
	* Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
	* routes aren't returned, even if they are matched.
	*
	* When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
	* @param request
	* @param allowPrerenderedRoutes
	*/
	match(request, allowPrerenderedRoutes = false) {
		return matchRequest(this.manifest, request, allowPrerenderedRoutes);
	}
	/**
	* A matching route function to use in the development server.
	* Contrary to the `.match` function, this function resolves props and params, returning the correct
	* route based on the priority, segments. It also returns the correct, resolved pathname.
	* @param pathname
	*/
	devMatch(pathname) {}
	computePathnameFromDomain(request) {
		return computePathnameFromDomain(request, new URL(request.url), this.manifest.i18n, this.manifest.base, this.manifest.trailingSlash, this.logger);
	}
	async render(request, { addCookieHeader = false, clientAddress = Reflect.get(request, clientAddressSymbol), locals, prerenderedErrorPageFetch = fetch, routeData, waitUntil } = {}) {
		await getResolvedLogger(this.manifest);
		if (routeData) {
			this.logger.debug("router", "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ", request.url);
			this.logger.debug("router", "RouteData");
			this.logger.debug("router", routeData);
		}
		if (locals) {
			if (typeof locals !== "object") {
				const error = new AstroError(LocalsNotAnObject);
				this.logger.error(null, error.stack);
				return this.renderError(request, {
					addCookieHeader,
					clientAddress,
					prerenderedErrorPageFetch,
					locals: void 0,
					routeData,
					waitUntil,
					status: 500,
					error
				});
			}
		}
		if (!routeData) {
			const domainPathname = this.computePathnameFromDomain(request);
			if (domainPathname) routeData = matchRoute(this.manifest, this.safeDecodePathname(domainPathname));
		}
		const resolvedOptions = {
			addCookieHeader,
			clientAddress,
			prerenderedErrorPageFetch,
			locals,
			routeData,
			waitUntil
		};
		let response;
		if (this.#fetchHandler instanceof DefaultFetchHandler) response = await handleRequest(new FetchState(this.manifest, request, resolvedOptions, {
			streaming: this.resolveStreaming(),
			renderError: (req, opts) => this.renderError(req, opts),
			logRequest: (payload) => this.logThisRequest(payload)
		}));
		else {
			setRenderOptions(request, resolvedOptions);
			response = await this.#fetchHandler.fetch(request);
		}
		this.#warnMissingFeatures();
		if (response.headers.get("X-Astro-Error")) {
			response.headers.delete(ASTRO_ERROR_HEADER);
			return this.renderError(request, {
				addCookieHeader,
				clientAddress,
				prerenderedErrorPageFetch,
				locals,
				routeData,
				waitUntil,
				response,
				status: response.status,
				error: response.status === 500 ? null : void 0
			});
		}
		return response;
	}
	setCookieHeaders(response) {
		return getSetCookiesFromResponse(response);
	}
	/**
	* Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
	* For example,
	* ```ts
	* for (const cookie_ of App.getSetCookieFromResponse(response)) {
	*     const cookie: string = cookie_
	* }
	* ```
	* @param response The response to read cookies from.
	* @returns An iterator that yields key-value pairs as equal-sign-separated strings.
	*/
	static getSetCookieFromResponse = getSetCookiesFromResponse;
	/**
	* If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
	* This also handles pre-rendered /404 or /500 routes.
	*
	* Delegates to the app's configured `ErrorHandler`. To customize behavior
	* for a specific environment, override `createErrorHandler()` rather than
	* this method.
	*/
	async renderError(request, options) {
		return this.#errorHandler.renderError(request, options);
	}
	/**
	* One-shot check: after the first request with a custom `src/fetch.ts`,
	* compare `usedFeatures` against the manifest and warn about any
	* configured features the user's pipeline doesn't call.
	*/
	#warnMissingFeatures() {
		if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
		this.#featureCheckDone = true;
		const manifest = this.manifest;
		const missing = [];
		const used = getUsedFeatures(this.manifest);
		if (manifest.routes.some((r) => r.routeData.type === "redirect") && !(used & FetchFeatures.redirects)) missing.push("redirects");
		if (manifest.sessionConfig && !(used & FetchFeatures.sessions)) missing.push("sessions");
		if (manifest.actions && !(used & FetchFeatures.actions)) missing.push("actions");
		if (manifest.middleware && !(used & FetchFeatures.middleware)) missing.push("middleware");
		if (manifest.i18n && manifest.i18n.strategy !== "manual" && !(used & FetchFeatures.i18n)) missing.push("i18n");
		if (manifest.cacheConfig && !(used & FetchFeatures.cache)) missing.push("cache");
		for (const feature of missing) this.logger.warn("router", `Your project uses ${feature}, but your custom src/fetch.ts does not call the ${feature}() handler. This feature will not work unless your fetch handler calls it.`);
	}
	getDefaultStatusCode(routeData, pathname) {
		return getDefaultStatusCode(this.manifest, routeData, pathname);
	}
	getManifest() {
		return this.manifest;
	}
	logThisRequest({ pathname, method, statusCode, isRewrite, timeStart }) {
		const timeEnd = performance.now();
		this.logRequest({
			pathname,
			method,
			statusCode,
			isRewrite,
			reqTime: timeEnd - timeStart
		});
	}
};
//#endregion
//#region node_modules/astro/dist/core/app/app.js
var App = class extends BaseApp {
	isDev() {
		return false;
	}
	logRequest(_options) {}
};
//#endregion
//#region node_modules/astro/dist/core/app/entrypoints/virtual/prod.js
var createApp$1 = ({ streaming } = {}) => {
	const app = new App(manifest, streaming);
	app.setFetchHandler(_virtual_astro_fetchable_default);
	return app;
};
var app = createApp$1();
function createHandler({ notFoundContent }) {
	return async function handler(request, context) {
		const routeData = app.match(request);
		if (!routeData && typeof notFoundContent !== "undefined") return new Response(notFoundContent, {
			status: 404,
			headers: { "Content-Type": "text/html; charset=utf-8" }
		});
		let locals = {};
		const astroLocalsHeader = request.headers.get("x-astro-locals");
		const middlewareSecretHeader = request.headers.get("x-astro-middleware-secret");
		if (astroLocalsHeader) {
			if (middlewareSecretHeader !== "f60602e8-eab8-4b4e-9f72-ba10487b820b") return new Response("Forbidden", { status: 403 });
			request.headers.delete("x-astro-middleware-secret");
			locals = JSON.parse(astroLocalsHeader);
		}
		locals.netlify = { context };
		const response = await app.render(request, {
			routeData,
			locals,
			clientAddress: context.ip
		});
		if (app.setCookieHeaders) for (const setCookieHeader of app.setCookieHeaders(response)) response.headers.append("Set-Cookie", setCookieHeader);
		return response;
	};
}
//#endregion
export { createHandler };
