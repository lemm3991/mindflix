// src/scripts/astro-grab-bridge.ts
// Ponte de comunicação entre o Astro Grab no navegador e o MCP Server (porta 4567)

if (typeof window !== 'undefined') {
  const PROJECT_ROOT = 'd:/projetos antigravity/mindflix';
  let ws: WebSocket | null = null;

  function connectWs() {
    try {
      ws = new WebSocket('ws://127.0.0.1:4567?projectRoot=' + encodeURIComponent(PROJECT_ROOT));
      ws.onclose = () => setTimeout(connectWs, 2000);
      ws.onerror = () => {};
    } catch {}
  }

  connectWs();

  function sendSelectionToBridge(data: any) {
    const payload = {
      projectRoot: PROJECT_ROOT,
      tagName: 'div',
      file: data.file,
      elementSource: {
        file: data.file,
        line: data.targetLine || data.line,
        column: 1
      },
      snippet: data.snippet,
      formatted: `Source: ${data.file}:${data.targetLine}\n\n\`\`\`${data.language || 'astro'}\n${data.snippet}\n\`\`\``,
      timestamp: Date.now()
    };

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'astro-grab:context', payload }));
    }
  }

  window.addEventListener('astro-grab:component-targeted', async (e: any) => {
    const elStr = e.detail?.el;
    if (!elStr) return;
    try {
      const res = await fetch('/__astro_grab/snippet?src=' + encodeURIComponent(elStr) + '&contextLines=5');
      if (res.ok) {
        const data = await res.json();
        sendSelectionToBridge(data);
      }
    } catch {}
  });

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Alt' && !e.repeat) {
      const inst = (window as any).__astroGrabInstance__;
      if (inst) {
        inst.stateMachine.transition('targeting');
      }
    }
  });

  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Alt') {
      const inst = (window as any).__astroGrabInstance__;
      if (inst && inst.stateMachine.getState() === 'targeting') {
        inst.stateMachine.reset();
      }
    }
  });
}
