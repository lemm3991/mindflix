// astro-grab-bridge.js - Integração do Astro Grab com a ponte WebSocket global do Antigravity
import { fileURLToPath } from "node:url";

export function astroGrabAntigravity(options = {}) {
  const wsUrl = options.wsUrl || "ws://127.0.0.1:4567";
  const key = options.key || "Alt";

  return {
    name: "astro-grab-antigravity",
    hooks: {
      async "astro:config:setup"(params) {
        if (params.command !== "dev") return;

        try {
          const astroGrabModule = await import("@omniaura/astro-grab");
          const astroGrab = astroGrabModule.default || astroGrabModule.astroGrab;
          const base = astroGrab ? astroGrab({ ...options, autoImport: false }) : null;

          if (base?.hooks?.["astro:config:setup"]) {
            base.hooks["astro:config:setup"](params);
          }

          let projectRoot = "";
          try {
            projectRoot = fileURLToPath(params.config.root);
          } catch {
            projectRoot = process.cwd();
          }

          const fullWsUrl = `${wsUrl}?projectRoot=${encodeURIComponent(projectRoot)}`;

          params.injectScript(
            "page",
            `import { initAstroGrab } from "@omniaura/astro-grab/client";\n` +
            `initAstroGrab({\n` +
            `  key: ${JSON.stringify(key)},\n` +
            `  agentUrl: ${JSON.stringify(fullWsUrl)},\n` +
            `  showToast: true,\n` +
            `  holdDuration: 0\n` +
            `});`
          );
        } catch (e) {
          console.debug("[astro-grab-bridge] Skipping dev bridge:", e.message);
        }
      }
    }
  };
}

export default astroGrabAntigravity;
