import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { M as maybeRenderHead, P as addAttribute, T as renderComponent, j as renderTemplate } from "./sequence_BzZU-fGI.mjs";
import { t as createComponent } from "./compiler_Cw7rCC9Q.mjs";
import { n as renderScript, t as $$Layout } from "./Layout_DQEGFcGL.mjs";
//#region src/lib/theme.ts
var THEME_PRESETS = [
	{
		id: "cyan-indigo",
		name: "Ciano & Indigo (Padrão)",
		primary: "#00f2fe",
		secondary: "#4facfe",
		primaryRgb: "0, 242, 254",
		secondaryRgb: "79, 172, 254",
		orb1: "radial-gradient(circle, #00f2fe 0%, #3b82f6 70%, transparent 100%)",
		orb2: "radial-gradient(circle, #6366f1 0%, #8b5cf6 70%, transparent 100%)",
		orb3: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
		lineColors: [
			{
				base: "rgba(0, 242, 254, 0.26)",
				active: "rgba(0, 242, 254, 0.95)"
			},
			{
				base: "rgba(56, 189, 248, 0.24)",
				active: "rgba(56, 189, 248, 0.90)"
			},
			{
				base: "rgba(99, 102, 241, 0.22)",
				active: "rgba(129, 140, 248, 0.88)"
			},
			{
				base: "rgba(168, 85, 247, 0.20)",
				active: "rgba(192, 132, 252, 0.85)"
			}
		],
		particleColors: ["#00f2fe", "#818cf8"]
	},
	{
		id: "crimson-orange",
		name: "Vermelho Carmim & Âmbar",
		primary: "#ff2a4b",
		secondary: "#ff7300",
		primaryRgb: "255, 42, 75",
		secondaryRgb: "255, 115, 0",
		orb1: "radial-gradient(circle, #ff2a4b 0%, #dc2626 70%, transparent 100%)",
		orb2: "radial-gradient(circle, #ff7300 0%, #ea580c 70%, transparent 100%)",
		orb3: "radial-gradient(circle, #f43f5e 0%, transparent 70%)",
		lineColors: [
			{
				base: "rgba(255, 42, 75, 0.28)",
				active: "rgba(255, 42, 75, 0.95)"
			},
			{
				base: "rgba(255, 99, 120, 0.24)",
				active: "rgba(255, 99, 120, 0.90)"
			},
			{
				base: "rgba(255, 115, 0, 0.22)",
				active: "rgba(255, 145, 50, 0.88)"
			},
			{
				base: "rgba(234, 88, 12, 0.20)",
				active: "rgba(251, 146, 60, 0.85)"
			}
		],
		particleColors: ["#ff2a4b", "#ff7300"]
	},
	{
		id: "violet-magenta",
		name: "Violeta Cyber & Magenta",
		primary: "#a855f7",
		secondary: "#ec4899",
		primaryRgb: "168, 85, 247",
		secondaryRgb: "236, 72, 153",
		orb1: "radial-gradient(circle, #a855f7 0%, #7c3aed 70%, transparent 100%)",
		orb2: "radial-gradient(circle, #ec4899 0%, #db2777 70%, transparent 100%)",
		orb3: "radial-gradient(circle, #c084fc 0%, transparent 70%)",
		lineColors: [
			{
				base: "rgba(168, 85, 247, 0.28)",
				active: "rgba(168, 85, 247, 0.95)"
			},
			{
				base: "rgba(192, 132, 252, 0.24)",
				active: "rgba(192, 132, 252, 0.90)"
			},
			{
				base: "rgba(236, 72, 153, 0.22)",
				active: "rgba(244, 114, 182, 0.88)"
			},
			{
				base: "rgba(244, 63, 94, 0.20)",
				active: "rgba(251, 113, 133, 0.85)"
			}
		],
		particleColors: ["#a855f7", "#ec4899"]
	},
	{
		id: "emerald-mint",
		name: "Verde Esmeralda & Menta",
		primary: "#10b981",
		secondary: "#06b6d4",
		primaryRgb: "16, 185, 129",
		secondaryRgb: "6, 182, 212",
		orb1: "radial-gradient(circle, #10b981 0%, #059669 70%, transparent 100%)",
		orb2: "radial-gradient(circle, #06b6d4 0%, #0891b2 70%, transparent 100%)",
		orb3: "radial-gradient(circle, #34d399 0%, transparent 70%)",
		lineColors: [
			{
				base: "rgba(16, 185, 129, 0.28)",
				active: "rgba(16, 185, 129, 0.95)"
			},
			{
				base: "rgba(52, 211, 153, 0.24)",
				active: "rgba(52, 211, 153, 0.90)"
			},
			{
				base: "rgba(6, 182, 212, 0.22)",
				active: "rgba(34, 211, 238, 0.88)"
			},
			{
				base: "rgba(20, 184, 166, 0.20)",
				active: "rgba(45, 212, 191, 0.85)"
			}
		],
		particleColors: ["#10b981", "#06b6d4"]
	},
	{
		id: "golden-fire",
		name: "Âmbar Dourado & Fogo",
		primary: "#f59e0b",
		secondary: "#ef4444",
		primaryRgb: "245, 158, 11",
		secondaryRgb: "239, 68, 68",
		orb1: "radial-gradient(circle, #f59e0b 0%, #d97706 70%, transparent 100%)",
		orb2: "radial-gradient(circle, #ef4444 0%, #dc2626 70%, transparent 100%)",
		orb3: "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
		lineColors: [
			{
				base: "rgba(245, 158, 11, 0.28)",
				active: "rgba(245, 158, 11, 0.95)"
			},
			{
				base: "rgba(251, 191, 36, 0.24)",
				active: "rgba(251, 191, 36, 0.90)"
			},
			{
				base: "rgba(239, 68, 68, 0.22)",
				active: "rgba(248, 113, 113, 0.88)"
			},
			{
				base: "rgba(249, 115, 22, 0.20)",
				active: "rgba(251, 146, 60, 0.85)"
			}
		],
		particleColors: ["#f59e0b", "#ef4444"]
	},
	{
		id: "sapphire-turquoise",
		name: "Azul Safira & Turquesa",
		primary: "#2563eb",
		secondary: "#06b6d4",
		primaryRgb: "37, 99, 235",
		secondaryRgb: "6, 182, 212",
		orb1: "radial-gradient(circle, #2563eb 0%, #1d4ed8 70%, transparent 100%)",
		orb2: "radial-gradient(circle, #06b6d4 0%, #0891b2 70%, transparent 100%)",
		orb3: "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
		lineColors: [
			{
				base: "rgba(37, 99, 235, 0.28)",
				active: "rgba(37, 99, 235, 0.95)"
			},
			{
				base: "rgba(96, 165, 250, 0.24)",
				active: "rgba(96, 165, 250, 0.90)"
			},
			{
				base: "rgba(6, 182, 212, 0.22)",
				active: "rgba(34, 211, 238, 0.88)"
			},
			{
				base: "rgba(14, 165, 233, 0.20)",
				active: "rgba(56, 189, 248, 0.85)"
			}
		],
		particleColors: ["#2563eb", "#06b6d4"]
	},
	{
		id: "cyber-rose",
		name: "Neon Rose & Coral Sunset",
		primary: "#f43f5e",
		secondary: "#fb923c",
		primaryRgb: "244, 63, 94",
		secondaryRgb: "251, 146, 60",
		orb1: "radial-gradient(circle, #f43f5e 0%, #e11d48 70%, transparent 100%)",
		orb2: "radial-gradient(circle, #fb923c 0%, #f97316 70%, transparent 100%)",
		orb3: "radial-gradient(circle, #fda4af 0%, transparent 70%)",
		lineColors: [
			{
				base: "rgba(244, 63, 94, 0.28)",
				active: "rgba(244, 63, 94, 0.95)"
			},
			{
				base: "rgba(251, 113, 133, 0.24)",
				active: "rgba(251, 113, 133, 0.90)"
			},
			{
				base: "rgba(251, 146, 60, 0.22)",
				active: "rgba(253, 186, 116, 0.88)"
			},
			{
				base: "rgba(249, 115, 22, 0.20)",
				active: "rgba(251, 146, 60, 0.85)"
			}
		],
		particleColors: ["#f43f5e", "#fb923c"]
	},
	{
		id: "platinum-silver",
		name: "Platina & Prata Titânio",
		primary: "#e2e8f0",
		secondary: "#38bdf8",
		primaryRgb: "226, 232, 240",
		secondaryRgb: "56, 189, 248",
		orb1: "radial-gradient(circle, #e2e8f0 0%, #cbd5e1 70%, transparent 100%)",
		orb2: "radial-gradient(circle, #38bdf8 0%, #0284c7 70%, transparent 100%)",
		orb3: "radial-gradient(circle, #94a3b8 0%, transparent 70%)",
		lineColors: [
			{
				base: "rgba(226, 232, 240, 0.28)",
				active: "rgba(226, 232, 240, 0.95)"
			},
			{
				base: "rgba(203, 213, 225, 0.24)",
				active: "rgba(203, 213, 225, 0.90)"
			},
			{
				base: "rgba(56, 189, 248, 0.22)",
				active: "rgba(125, 211, 252, 0.88)"
			},
			{
				base: "rgba(148, 163, 184, 0.20)",
				active: "rgba(203, 213, 225, 0.85)"
			}
		],
		particleColors: ["#e2e8f0", "#38bdf8"]
	}
];
//#endregion
//#region src/lib/backgrounds.ts
var BACKGROUND_PRESETS = [
	{
		id: "waves",
		name: "Ondas Topográficas",
		tagline: "Fluidez & Interatividade",
		description: "Fitas harmônicas de ondas com partículas em rede e deflexão tátil pelo cursor. O clássico visual dinâmico do Mindflix.",
		category: "Dinâmico",
		previewGradient: "radial-gradient(ellipse at 30% 20%, rgba(0, 242, 254, 0.45) 0%, rgba(79, 172, 254, 0.2) 50%, rgba(7, 9, 14, 0.95) 100%)",
		accentColor: "#00f2fe",
		secondaryColor: "#4facfe"
	},
	{
		id: "aurora",
		name: "Escuro Minimalista",
		tagline: "Foco Absoluto & Estático",
		description: "Fundo escuro sóbrio e elegante (não totalmente preto), 100% estático, sem animações, partículas, interações ou efeitos.",
		category: "Estático",
		previewGradient: "radial-gradient(ellipse at 50% 50%, #151a24 0%, #0d1118 65%, #080b10 100%)",
		accentColor: "#475569",
		secondaryColor: "#1e293b"
	},
	{
		id: "cyber-grid",
		name: "Fluxo Retilíneo",
		tagline: "Foco Executivo & Dados",
		description: "Estrutura sóbria de linhas retilíneas com pulsos luminosos de dados em trânsito aleatório. Disparo de surtos e pulsos quânticos no clique.",
		category: "Minimalista & Tech",
		previewGradient: "radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.35) 0%, rgba(99, 102, 241, 0.18) 50%, rgba(7, 9, 14, 0.95) 100%)",
		accentColor: "#38bdf8",
		secondaryColor: "#6366f1"
	},
	{
		id: "nebula",
		name: "Nebulosa Cósmica",
		tagline: "Espaço & Imersão Noturna",
		description: "Gases interestelares profundos com estrelas cintilantes e atração gravitacional de poeira cósmica ao redor do cursor.",
		category: "Noturno",
		previewGradient: "radial-gradient(ellipse at 40% 40%, rgba(236, 72, 153, 0.4) 0%, rgba(147, 51, 234, 0.25) 50%, rgba(7, 9, 14, 0.95) 100%)",
		accentColor: "#ec4899",
		secondaryColor: "#8b5cf6"
	}
];
//#endregion
//#region src/pages/settings.astro
var settings_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Settings,
	file: () => $$file,
	url: () => $$url
});
var $$Settings = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Preferências — Mindflix",
		"data-astro-cid-3dzwdpwk": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="container settings-page" data-astro-cid-3dzwdpwk><header class="page-header" data-astro-cid-3dzwdpwk><h1 class="page-title" data-astro-cid-3dzwdpwk>Configurações & Preferências</h1><p class="page-subtitle" data-astro-cid-3dzwdpwk>Personalize a sua experiência de estudo, ambiente visual de fundo, tema de cores, reprodução de vídeo e segurança da conta.</p></header><div class="settings-sections-wrapper" data-astro-cid-3dzwdpwk><!-- Ambient Background Selection --><section class="settings-card" data-astro-cid-3dzwdpwk><h2 class="card-section-title" data-astro-cid-3dzwdpwk><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3dzwdpwk><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" data-astro-cid-3dzwdpwk></path></svg><span data-astro-cid-3dzwdpwk>Ambiente Visual de Estudo (Background)</span></h2><p class="section-description" data-astro-cid-3dzwdpwk>Escolha o estilo visual interativo do fundo da plataforma para otimizar sua imersão, foco e conforto visual durante as horas de estudo.</p><div class="bg-style-grid" id="bg-style-grid" data-astro-cid-3dzwdpwk>${BACKGROUND_PRESETS.map((b) => renderTemplate`<button type="button" class="bg-style-card"${addAttribute(b.id, "data-bg-id")}${addAttribute(`Selecionar ambiente de fundo ${b.name}`, "aria-label")} data-astro-cid-3dzwdpwk><div class="theme-check-badge" data-astro-cid-3dzwdpwk><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" data-astro-cid-3dzwdpwk><polyline points="20 6 9 17 4 12" data-astro-cid-3dzwdpwk></polyline></svg></div><div class="bg-style-preview"${addAttribute(`background: ${b.previewGradient}; border-color: rgba(255,255,255,0.12);`, "style")} data-astro-cid-3dzwdpwk><div class="bg-style-badge" data-astro-cid-3dzwdpwk>${b.category}</div><div class="bg-style-glow-dot"${addAttribute(`background: ${b.accentColor}; box-shadow: 0 0 16px ${b.accentColor};`, "style")} data-astro-cid-3dzwdpwk></div></div><div class="bg-style-info" data-astro-cid-3dzwdpwk><div class="bg-style-name-row" data-astro-cid-3dzwdpwk><span class="bg-style-name" data-astro-cid-3dzwdpwk>${b.name}</span><span class="bg-style-tagline" data-astro-cid-3dzwdpwk>${b.tagline}</span></div><p class="bg-style-desc" data-astro-cid-3dzwdpwk>${b.description}</p></div></button>`)}</div></section><!-- Theme Palette Selection --><section class="settings-card" data-astro-cid-3dzwdpwk><h2 class="card-section-title" data-astro-cid-3dzwdpwk><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3dzwdpwk><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" data-astro-cid-3dzwdpwk></path></svg><span data-astro-cid-3dzwdpwk>Tema de Cores da Interface</span></h2><p class="section-description" data-astro-cid-3dzwdpwk>Escolha uma das 8 paletas pré-definidas para personalizar os botões, destaques, bordas, orbes de brilho e as linhas animadas do fundo.</p><div class="theme-grid" id="theme-grid" data-astro-cid-3dzwdpwk>${THEME_PRESETS.map((t) => renderTemplate`<button type="button" class="theme-card"${addAttribute(t.id, "data-theme-id")}${addAttribute(`Selecionar tema ${t.name}`, "aria-label")} data-astro-cid-3dzwdpwk><div class="theme-check-badge" data-astro-cid-3dzwdpwk><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" data-astro-cid-3dzwdpwk><polyline points="20 6 9 17 4 12" data-astro-cid-3dzwdpwk></polyline></svg></div><div class="theme-preview-box" data-astro-cid-3dzwdpwk><div class="theme-gradient-preview"${addAttribute(`background: linear-gradient(135deg, ${t.primary} 0%, ${t.secondary} 100%);`, "style")} data-astro-cid-3dzwdpwk></div><div class="theme-swatch-center" data-astro-cid-3dzwdpwk><span class="theme-color-pill"${addAttribute(`background: ${t.primary}; box-shadow: 0 0 10px ${t.primary};`, "style")} data-astro-cid-3dzwdpwk></span><span class="theme-color-pill"${addAttribute(`background: ${t.secondary}; box-shadow: 0 0 8px ${t.secondary};`, "style")} data-astro-cid-3dzwdpwk></span></div></div><div class="theme-info" data-astro-cid-3dzwdpwk><span class="theme-name" data-astro-cid-3dzwdpwk>${t.name}</span><span class="theme-colors-sub" data-astro-cid-3dzwdpwk>${t.primary} • ${t.secondary}</span></div></button>`)}</div></section><!-- Playback Preferences --><section class="settings-card" data-astro-cid-3dzwdpwk><h2 class="card-section-title" data-astro-cid-3dzwdpwk><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3dzwdpwk><circle cx="12" cy="12" r="10" data-astro-cid-3dzwdpwk></circle><polygon points="10 8 16 12 10 16 10 8" data-astro-cid-3dzwdpwk></polygon></svg><span data-astro-cid-3dzwdpwk>Preferências de Reprodução</span></h2><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Autoplay da Próxima Aula</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Ao terminar o vídeo da aula atual, abre e reproduz a próxima aula automaticamente.</span></div><div class="setting-control" data-astro-cid-3dzwdpwk><label class="switch" data-astro-cid-3dzwdpwk><input type="checkbox" id="pref-autoplay" checked data-astro-cid-3dzwdpwk><span class="slider" data-astro-cid-3dzwdpwk></span></label></div></div><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Retomar Aulas Automaticamente</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Ao abrir uma aula já iniciada, salta direto para o último segundo salvo sem perguntar.</span></div><div class="setting-control" data-astro-cid-3dzwdpwk><label class="switch" data-astro-cid-3dzwdpwk><input type="checkbox" id="pref-auto-resume" checked data-astro-cid-3dzwdpwk><span class="slider" data-astro-cid-3dzwdpwk></span></label></div></div><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Prévia Automática nos Cards</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Permite reproduzir prévia de introdução ao passar o mouse sobre o card.</span></div><div class="setting-control" data-astro-cid-3dzwdpwk><label class="switch" data-astro-cid-3dzwdpwk><input type="checkbox" id="pref-auto-preview" data-astro-cid-3dzwdpwk><span class="slider" data-astro-cid-3dzwdpwk></span></label></div></div></section><!-- Visual Preferences --><section class="settings-card" data-astro-cid-3dzwdpwk><h2 class="card-section-title" data-astro-cid-3dzwdpwk><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3dzwdpwk><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" data-astro-cid-3dzwdpwk></path></svg><span data-astro-cid-3dzwdpwk>Preferências Visuais & Efeitos</span></h2><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Efeito Parallax</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Camadas de profundidade discretas ao movimentar o mouse e rolar a página.</span></div><div class="setting-control" data-astro-cid-3dzwdpwk><label class="switch" data-astro-cid-3dzwdpwk><input type="checkbox" id="pref-parallax" data-astro-cid-3dzwdpwk><span class="slider" data-astro-cid-3dzwdpwk></span></label></div></div><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Background Interativo</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Orbes de iluminação dinâmica e malha tecnológica no fundo da página.</span></div><div class="setting-control" data-astro-cid-3dzwdpwk><label class="switch" data-astro-cid-3dzwdpwk><input type="checkbox" id="pref-interactive-bg" checked data-astro-cid-3dzwdpwk><span class="slider" data-astro-cid-3dzwdpwk></span></label></div></div><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Reduzir Animações</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Desativa transições e movimentos para maior sobriedade ou acessibilidade.</span></div><div class="setting-control" data-astro-cid-3dzwdpwk><label class="switch" data-astro-cid-3dzwdpwk><input type="checkbox" id="pref-reduce-motion" data-astro-cid-3dzwdpwk><span class="slider" data-astro-cid-3dzwdpwk></span></label></div></div></section><!-- Account Security & Change Password --><section class="settings-card" data-astro-cid-3dzwdpwk><h2 class="card-section-title" data-astro-cid-3dzwdpwk><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3dzwdpwk><rect x="3" y="11" width="18" height="11" rx="2" ry="2" data-astro-cid-3dzwdpwk></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" data-astro-cid-3dzwdpwk></path></svg><span data-astro-cid-3dzwdpwk>Segurança & Alteração de Senha</span></h2><form id="change-password-form" class="change-pass-form" data-astro-cid-3dzwdpwk><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Nova Senha</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Digite a sua nova senha de acesso à plataforma (mínimo 6 caracteres).</span></div><div class="setting-control" style="width: 280px;" data-astro-cid-3dzwdpwk><input type="password" id="new-password" class="form-input" placeholder="••••••••" minlength="6" required data-astro-cid-3dzwdpwk></div></div><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Confirmar Nova Senha</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Digite novamente a nova senha para confirmação.</span></div><div class="setting-control" style="width: 280px;" data-astro-cid-3dzwdpwk><input type="password" id="confirm-password" class="form-input" placeholder="••••••••" minlength="6" required data-astro-cid-3dzwdpwk></div></div><div class="pass-btn-row" data-astro-cid-3dzwdpwk><button type="submit" class="btn btn-primary" id="btn-save-pass" data-astro-cid-3dzwdpwk><span data-astro-cid-3dzwdpwk>Atualizar Senha</span></button></div></form></section><!-- AI & RAG Preferences --><section class="settings-card" data-astro-cid-3dzwdpwk><h2 class="card-section-title" data-astro-cid-3dzwdpwk><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3dzwdpwk><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5h-2v-2h2zm0-4h-2V7h2z" data-astro-cid-3dzwdpwk></path></svg><span data-astro-cid-3dzwdpwk>Inteligência Artificial & Busca no Acervo</span></h2><div class="setting-row" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Chave da API Google Gemini (Opcional)</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Habilita síntese contextual em linguagem natural das transcrições do acervo.</span></div><div class="setting-control" style="width: 280px;" data-astro-cid-3dzwdpwk><input type="password" id="pref-gemini-key" class="form-input" placeholder="AIzaSy... (Opcional)" autocomplete="off" data-astro-cid-3dzwdpwk></div></div></section><!-- Advanced Cyber Security / IPS Center --><section class="settings-card admin-only-section" id="sec-monitor-card" style="display: none;" data-astro-cid-3dzwdpwk><h2 class="card-section-title" data-astro-cid-3dzwdpwk><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2" data-astro-cid-3dzwdpwk><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" data-astro-cid-3dzwdpwk></path></svg><span data-astro-cid-3dzwdpwk>Monitor de Ataques & Prevenção de Intrusão (IPS)</span></h2><p class="section-description" data-astro-cid-3dzwdpwk>Acesse o Centro de Operações de Segurança (SOC) para visualizar telemetria de ataques em tempo real, gerenciar regras de auto-bloqueio de IPs maliciosos e auditar incidentes.</p><div class="setting-row" style="margin-top: 1rem;" data-astro-cid-3dzwdpwk><div class="setting-text" data-astro-cid-3dzwdpwk><span class="setting-name" data-astro-cid-3dzwdpwk>Centro de Operações de Segurança (SOC)</span><span class="setting-hint" data-astro-cid-3dzwdpwk>Painel em tempo real com DEFCON, simulador de ataques e gerenciador de bans.</span></div><div class="setting-control" data-astro-cid-3dzwdpwk><a href="/security-monitor" class="btn btn-primary" data-astro-cid-3dzwdpwk><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3dzwdpwk><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" data-astro-cid-3dzwdpwk></polygon></svg><span data-astro-cid-3dzwdpwk>Abrir Monitor de Segurança</span></a></div></div></section><div class="save-status-box" id="save-status-box" style="display: none;" data-astro-cid-3dzwdpwk><span data-astro-cid-3dzwdpwk>Preferências salvas e sincronizadas com sucesso!</span></div></div></div>` })}${renderScript($$result, "D:/projetos antigravity/mindflix/src/pages/settings.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/projetos antigravity/mindflix/src/pages/settings.astro", void 0);
var $$file = "D:/projetos antigravity/mindflix/src/pages/settings.astro";
var $$url = "/settings";
//#endregion
//#region \0virtual:astro:page:src/pages/settings@_@astro
var page = () => settings_exports;
//#endregion
export { page };
