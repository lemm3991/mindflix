// astro-grab-bridge.js - Integração do Astro Grab com a ponte WebSocket global do Antigravity
import astroGrab from "@omniaura/astro-grab";
import { fileURLToPath } from "node:url";

export function astroGrabAntigravity(options = {}) {
  const wsUrl = options.wsUrl || "ws://127.0.0.1:4567";
  const key = options.key || "Alt";
  const base = astroGrab({ ...options, autoImport: false });

  return {
    name: "astro-grab-antigravity",
    hooks: {
      "astro:config:setup"(params) {
        if (params.command !== "dev") return;

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
      }
    }
  };
}

export default astroGrabAntigravity;
