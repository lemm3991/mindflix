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

  await new Promise(r => setTimeout(r, 1000));

  // Set auth
  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'user_123', email: 'test@mindflix.com', name: 'Tester' }));`
  });

  // Navigate to /courses
  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Scroll and click first course card
  const courseClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const card = document.querySelector('.course-grid-item[data-type="course"] .course-card') || document.querySelector('.course-card-wrapper .course-card');
        if (card) {
          card.scrollIntoView({ block: 'center' });
          const wrapper = card.closest('[data-course-id]');
          const courseId = wrapper?.getAttribute('data-course-id');
          card.click();
          return { clicked: true, courseId };
        }
        return { clicked: false, totalItems: document.querySelectorAll('.course-grid-item').length };
      })()
    `,
    returnByValue: true
  });

  console.log('COURSE CARD CLICK:', JSON.stringify(courseClick.result?.result?.value, null, 2));

  await new Promise(r => setTimeout(r, 1200));

  const courseModalStatus = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const modal = document.getElementById('course-detail-modal-backdrop');
        const title = document.getElementById('modal-course-title')?.textContent;
        const modules = document.querySelectorAll('.modal-module-card').length;
        const lessons = document.querySelectorAll('.modal-lesson-item').length;
        const isActive = modal?.classList.contains('active');
        const isVisible = modal && getComputedStyle(modal).display !== 'none';
        return { isActive, isVisible, title, modules, lessons };
      })()
    `,
    returnByValue: true
  });

  console.log('COURSE MODAL STATUS:', JSON.stringify(courseModalStatus.result?.result?.value, null, 2));

  const shotCourse = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shotCourse.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/modal_course_verified.png', Buffer.from(shotCourse.result.data, 'base64'));
    console.log('Saved modal_course_verified.png');
  }

  // Close course modal
  await sendSession('Runtime.evaluate', {
    expression: `document.getElementById('modal-close-btn')?.click();`
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Scroll and click first trilha card
  const trilhaClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const card = document.querySelector('.course-grid-item[data-type="trilha"] .trilha-card') || document.querySelector('.trilha-card-wrapper .trilha-card');
        if (card) {
          card.scrollIntoView({ block: 'center' });
          const wrapper = card.closest('[data-trilha-id]');
          const trilhaId = wrapper?.getAttribute('data-trilha-id');
          card.click();
          return { clicked: true, trilhaId };
        }
        return { clicked: false, totalTrilhas: document.querySelectorAll('.course-grid-item[data-type="trilha"]').length };
      })()
    `,
    returnByValue: true
  });

  console.log('TRILHA CARD CLICK:', JSON.stringify(trilhaClick.result?.result?.value, null, 2));

  await new Promise(r => setTimeout(r, 1200));

  const trilhaModalStatus = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const modal = document.getElementById('trilha-detail-modal-backdrop');
        const title = document.getElementById('modal-trilha-title')?.textContent;
        const stages = document.querySelectorAll('.trilha-stage-item').length;
        const isActive = modal?.classList.contains('active');
        const isVisible = modal && getComputedStyle(modal).display !== 'none';
        return { isActive, isVisible, title, stages };
      })()
    `,
    returnByValue: true
  });

  console.log('TRILHA MODAL STATUS:', JSON.stringify(trilhaModalStatus.result?.result?.value, null, 2));

  const shotTrilha = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shotTrilha.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/modal_trilha_verified.png', Buffer.from(shotTrilha.result.data, 'base64'));
    console.log('Saved modal_trilha_verified.png');
  }

  await send('Target.closeTarget', { targetId });
  ws.close();
  console.log('Verification finished');
}

run().catch(console.error);
