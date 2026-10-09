import http from 'http';
import fs from 'fs';

async function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: '127.0.0.1',
      port: 9222,
      path: '/json/version',
      family: 4
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.webSocketDebuggerUrl);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
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

  // Open existing page or create target
  const targetRes = await send('Target.createTarget', { url: 'http://localhost:4321/courses' });
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

  // Inject user and reload
  await sendSession('Runtime.evaluate', {
    expression: `
      localStorage.setItem('mindflix_user', JSON.stringify({ id: 'user_123', email: 'test@mindflix.com', name: 'Tester' }));
      window.location.href = 'http://localhost:4321/courses';
    `
  });

  // Wait 4 seconds for full load
  await new Promise(r => setTimeout(r, 4000));

  // Check state
  const state = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const cards = document.querySelectorAll('.course-card-wrapper');
        const openFn = typeof window.openCourseModal;
        const openTrilhaFn = typeof window.openTrilhaModal;
        return {
          href: window.location.href,
          cardCount: cards.length,
          openFn,
          openTrilhaFn
        };
      })()
    `,
    returnByValue: true
  });

  console.log('BROWSER STATE:', JSON.stringify(state, null, 2));

  // Test click on course card
  const clickRes = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const firstCourseCard = document.querySelector('.course-card-wrapper .course-card');
        if (firstCourseCard) {
          firstCourseCard.click();
          return { clicked: true, id: firstCourseCard.closest('[data-course-id]')?.getAttribute('data-course-id') };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });

  console.log('CLICK RESULT:', JSON.stringify(clickRes, null, 2));

  await new Promise(r => setTimeout(r, 1200));

  const modalState = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const modal = document.getElementById('course-detail-modal-backdrop');
        const title = document.getElementById('modal-course-title')?.textContent;
        const modules = document.querySelectorAll('.modal-module-card').length;
        const lessons = document.querySelectorAll('.modal-lesson-item').length;
        const isVisible = modal && getComputedStyle(modal).display !== 'none' && modal.classList.contains('active');
        return { isVisible, title, modules, lessons };
      })()
    `,
    returnByValue: true
  });

  console.log('MODAL STATE:', JSON.stringify(modalState, null, 2));

  // Capture screenshot
  const shot = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shot.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/actual_modal_click.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved actual_modal_click.png');
  }

  // Close course modal
  await sendSession('Runtime.evaluate', { expression: `window.closeCourseModal && window.closeCourseModal();` });
  await new Promise(r => setTimeout(r, 600));

  // Click trilha card
  const trilhaClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const trilhaCard = document.querySelector('.trilha-card-wrapper .trilha-card');
        if (trilhaCard) {
          trilhaCard.click();
          return { clicked: true, id: trilhaCard.closest('[data-trilha-id]')?.getAttribute('data-trilha-id') };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });

  console.log('TRILHA CLICK:', JSON.stringify(trilhaClick, null, 2));
  await new Promise(r => setTimeout(r, 1200));

  const trilhaModalState = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const modal = document.getElementById('trilha-detail-modal-backdrop');
        const title = document.getElementById('modal-trilha-title')?.textContent;
        const stages = document.querySelectorAll('.trilha-stage-item').length;
        const isVisible = modal && getComputedStyle(modal).display !== 'none' && modal.classList.contains('active');
        return { isVisible, title, stages };
      })()
    `,
    returnByValue: true
  });

  console.log('TRILHA MODAL STATE:', JSON.stringify(trilhaModalState, null, 2));

  const trilhaShot = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (trilhaShot.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/actual_trilha_modal_click.png', Buffer.from(trilhaShot.result.data, 'base64'));
    console.log('Saved actual_trilha_modal_click.png');
  }

  await send('Target.closeTarget', { targetId });
  ws.close();
}

run().catch(console.error);
