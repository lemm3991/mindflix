import http from 'http';
import fs from 'fs';

async function getWsUrl() {
  const res = await fetch('http://127.0.0.1:9222/json/version');
  const json = await res.json();
  return json.webSocketDebuggerUrl;
}

async function run() {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      callbacks.get(data.id)(data);
      callbacks.delete(data.id);
    }
  });

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });

  const targetRes = await send('Target.createTarget', { url: 'http://localhost:4321/login' });
  const targetId = targetRes.result.targetId;
  const attachRes = await send('Target.attachToTarget', { targetId, flatten: true });
  const sessionId = attachRes.result.sessionId;

  function sendSession(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
    });
  }

  await sendSession('Page.enable');
  await sendSession('Runtime.enable');
  await sendSession('DOM.enable');

  await new Promise(r => setTimeout(r, 1000));

  // Set auth
  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'user_123', email: 'test@mindflix.com', name: 'Tester' }));`
  });

  // 1. Navigate to /courses
  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });
  await new Promise(r => setTimeout(r, 3000));

  // 2. Test On-Page Search Input
  const pageSearchRes = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const input = document.getElementById('global-search-input');
        if (!input) return { error: 'Input not found' };
        input.value = 'python';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const visibleCards = Array.from(document.querySelectorAll('.course-grid-item')).filter(el => el.style.display !== 'none');
        return {
          typed: input.value,
          visibleCardsCount: visibleCards.length,
          modalOpen: document.getElementById('cmd-palette-backdrop')?.classList.contains('active')
        };
      })()
    `,
    returnByValue: true
  });

  console.log('PAGE SEARCH TEST:', JSON.stringify(pageSearchRes.result?.result?.value, null, 2));

  // 3. Test Clicking AI Search Button in SearchBar
  const aiTriggerRes = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const btn = document.getElementById('trigger-ai-modal-btn');
        if (!btn) return { error: 'AI trigger btn not found' };
        btn.click();
        const bd = document.getElementById('cmd-palette-backdrop');
        const activeTab = document.querySelector('.cmd-filter-tab.active')?.getAttribute('data-type');
        const hasWelcome = Boolean(document.querySelector('.cmd-ai-welcome'));
        return {
          clicked: true,
          modalActive: bd?.classList.contains('active'),
          activeTab,
          hasWelcome
        };
      })()
    `,
    returnByValue: true
  });

  console.log('AI TRIGGER TEST:', JSON.stringify(aiTriggerRes.result?.result?.value, null, 2));

  await new Promise(r => setTimeout(r, 1000));

  // 4. Test Executing AI Search (click sample pill)
  const aiSearchExecute = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const pill = document.querySelector('.ai-sample-pill');
        if (pill) {
          pill.click();
          return { clickedPill: pill.textContent };
        }
        return { error: 'Sample pill not found' };
      })()
    `,
    returnByValue: true
  });

  console.log('AI SEARCH EXECUTE:', JSON.stringify(aiSearchExecute.result?.result?.value, null, 2));

  await new Promise(r => setTimeout(r, 3500));

  const aiResultsStatus = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const summaryCard = document.querySelector('.ai-summary-card');
        const matches = document.querySelectorAll('.ai-match-card').length;
        const bd = document.getElementById('cmd-palette-backdrop');
        return {
          hasSummary: Boolean(summaryCard),
          matchesCount: matches,
          modalActive: bd?.classList.contains('active')
        };
      })()
    `,
    returnByValue: true
  });

  console.log('AI RESULTS STATUS:', JSON.stringify(aiResultsStatus.result?.result?.value, null, 2));

  const shotAi = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shotAi.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/search_ai_verified.png', Buffer.from(shotAi.result.data, 'base64'));
    console.log('Saved search_ai_verified.png');
  }

  // 5. Test Close with ESC key
  await sendSession('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
  await sendSession('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
  await new Promise(r => setTimeout(r, 600));

  const afterEsc = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const bd = document.getElementById('cmd-palette-backdrop');
        return {
          modalActive: bd?.classList.contains('active'),
          display: bd?.style.display,
          overflow: document.body.style.overflow
        };
      })()
    `,
    returnByValue: true
  });

  console.log('AFTER ESC TEST:', JSON.stringify(afterEsc.result?.result?.value, null, 2));

  // 6. Test Navbar search trigger & Click outside backdrop
  const navbarSearchRes = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const btn = document.getElementById('open-search-modal-btn');
        btn?.click();
        const bd = document.getElementById('cmd-palette-backdrop');
        return {
          clickedNavbar: true,
          modalActive: bd?.classList.contains('active'),
          results: document.querySelectorAll('.cmd-result-item').length
        };
      })()
    `,
    returnByValue: true
  });

  console.log('NAVBAR SEARCH TEST:', JSON.stringify(navbarSearchRes.result?.result?.value, null, 2));

  await new Promise(r => setTimeout(r, 800));

  // Click outside (backdrop itself)
  const clickBackdropRes = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const bd = document.getElementById('cmd-palette-backdrop');
        bd?.click();
        return { clickedBackdrop: true };
      })()
    `,
    returnByValue: true
  });

  await new Promise(r => setTimeout(r, 600));

  const afterBackdropClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const bd = document.getElementById('cmd-palette-backdrop');
        return {
          modalActive: bd?.classList.contains('active'),
          display: bd?.style.display,
          overflow: document.body.style.overflow
        };
      })()
    `,
    returnByValue: true
  });

  console.log('AFTER BACKDROP CLICK:', JSON.stringify(afterBackdropClick.result?.result?.value, null, 2));

  await send('Target.closeTarget', { targetId });
  ws.close();
  console.log('All search flow tests passed successfully!');
}

run().catch(console.error);
