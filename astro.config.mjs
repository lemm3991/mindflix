import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import { astroGrab } from 'astro-grab';

const getAdapter = () => {
  if (process.env.VERCEL) {
    return vercel();
  }
  if (process.env.NETLIFY) {
    return netlify();
  }
  return node({ mode: 'standalone' });
};

const astroGrabBridgeHelper = () => ({
  name: 'astro-grab-bridge-helper',
  hooks: {
    'astro:config:setup': ({ command, injectScript }) => {
      if (command === 'dev') {
        const projectRoot = process.cwd().replace(/\\/g, '/');
        injectScript('page', `
          (() => {
            if (typeof window === 'undefined') return;

            const PROJECT_ROOT = ${JSON.stringify(projectRoot)};
            let ws = null;

            function connectWs() {
              try {
                ws = new WebSocket('ws://127.0.0.1:4567?projectRoot=' + encodeURIComponent(PROJECT_ROOT));
                ws.onclose = () => setTimeout(connectWs, 2000);
                ws.onerror = () => {};
              } catch (e) {}
            }
            connectWs();

            function sendSelectionToBridge(data, targetEl) {
              const payload = {
                projectRoot: PROJECT_ROOT,
                tagName: targetEl?.tagName?.toLowerCase() || 'div',
                file: data.file,
                elementSource: {
                  file: data.file,
                  line: data.targetLine || data.line,
                  column: 1
                },
                snippet: data.snippet,
                formatted: \`Source: \${data.file}:\${data.targetLine}\\n\\n\`\`\`\${data.language || 'astro'}\\n\${data.snippet}\\n\`\`\`,
                timestamp: Date.now()
              };

              if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'astro-grab:context', payload }));
              }
            }

            window.addEventListener('astro-grab:component-targeted', async (e) => {
              const elStr = e.detail?.el;
              if (!elStr) return;
              try {
                const res = await fetch('/__astro_grab/snippet?src=' + encodeURIComponent(elStr) + '&contextLines=5');
                if (res.ok) {
                  const data = await res.json();
                  sendSelectionToBridge(data, null);
                }
              } catch (err) {}
            });

            window.addEventListener('keydown', (e) => {
              if (e.key === 'Alt' && !e.repeat && window.__astroGrabInstance__) {
                window.__astroGrabInstance__.stateMachine.transition('targeting');
              }
            });

            window.addEventListener('keyup', (e) => {
              if (e.key === 'Alt' && window.__astroGrabInstance__ && window.__astroGrabInstance__.stateMachine.getState() === 'targeting') {
                window.__astroGrabInstance__.stateMachine.reset();
              }
            });
          })();
        `);
      }
    }
  }
});

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: getAdapter(),
  integrations: [
    astroGrab({ toolbar: false, holdDuration: 0 }),
    astroGrabBridgeHelper()
  ],
  vite: {
    server: {
      fs: {
        // Allow serving files from parent directory where courses are located
        allow: ['..']
      }
    }
  }
});
