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

  await new Promise(r => setTimeout(r, 1500));

  // Set auth in localStorage on localhost
  await sendSession('Runtime.evaluate', {
    expression: `
      localStorage.setItem('mindflix_user', JSON.stringify({ id: 'user_123', email: 'test@mindflix.com', name: 'Tester' }));
    `
  });

  // Navigate to /courses
  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });
  await new Promise(r => setTimeout(r, 3500));

  // Check state
  const state = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        return {
          href: window.location.href,
          cardCount: document.querySelectorAll('.course-card-wrapper').length,
          openFn: typeof window.openCourseModal,
          openTrilhaFn: typeof window.openTrilhaModal
        };
      })()
    `,
    returnByValue: true
  });

  console.log('PAGE STATE ON /courses:', JSON.stringify(state.result?.value, null, 2));

  // Click on first course card
  const courseClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const card = document.querySelector('.course-card-wrapper .course-card');
        if (card) {
          card.click();
          return { clicked: true, id: card.closest('[data-course-id]')?.getAttribute('data-course-id') };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });

  console.log('COURSE CLICK:', JSON.stringify(courseClick.result?.value, null, 2));
  await new Promise(r => setTimeout(r, 1000));

  const courseModal = await sendSession('Runtime.evaluate', {
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

  console.log('COURSE MODAL AFTER CLICK:', JSON.stringify(courseModal.result?.value, null, 2));

  // Screenshot course modal
  const shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shot1.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/modal_course_verified.png', Buffer.from(shot1.result.data, 'base64'));
    console.log('Saved modal_course_verified.png');
  }

  // Close course modal
  await sendSession('Runtime.evaluate', { expression: `window.closeCourseModal && window.closeCourseModal();` });
  await new Promise(r => setTimeout(r, 600));

  // Click on first trilha card
  const trilhaClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const card = document.querySelector('.trilha-card-wrapper .trilha-card');
        if (card) {
          card.click();
          return { clicked: true, id: card.closest('[data-trilha-id]')?.getAttribute('data-trilha-id') };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });

  console.log('TRILHA CLICK:', JSON.stringify(trilhaClick.result?.value, null, 2));
  await new Promise(r => setTimeout(r, 1000));

  const trilhaModal = await sendSession('Runtime.evaluate', {
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

  console.log('TRILHA MODAL AFTER CLICK:', JSON.stringify(trilhaModal.result?.value, null, 2));

  // Screenshot trilha modal
  const shot2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shot2.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/modal_trilha_verified.png', Buffer.from(shot2.result.data, 'base64'));
    console.log('Saved modal_trilha_verified.png');
  }

  await send('Target.closeTarget', { targetId });
  ws.close();
}

run().catch(console.error);
