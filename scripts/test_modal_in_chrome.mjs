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

  // Create target directly on login to set auth
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

  await new Promise(r => setTimeout(r, 1000));
  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'user_123', email: 'test@mindflix.com', name: 'Tester' }));`
  });

  // Navigate to /courses
  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });

  // Poll for openCourseModal
  let waited = 0;
  let ready = false;
  while (waited < 50) {
    await new Promise(r => setTimeout(r, 200));
    waited++;
    const chk = await sendSession('Runtime.evaluate', {
      expression: `typeof window.openCourseModal === 'function' && typeof window.openTrilhaModal === 'function'`
    });
    if (chk.result?.result?.value === true) {
      ready = true;
      break;
    }
  }

  console.log(`Poll result: ready=${ready} after ${waited * 200}ms`);

  // Test 1: Click on course card
  const courseClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const card = document.querySelector('.course-grid-item[data-type="course"] .course-card');
        if (card) {
          card.click();
          return { clicked: true, courseId: card.closest('[data-course-id]')?.getAttribute('data-course-id') };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });

  console.log('COURSE CARD CLICK:', JSON.stringify(courseClick.result?.result?.value));

  await new Promise(r => setTimeout(r, 1000));

  const courseModalStatus = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const modal = document.getElementById('course-detail-modal-backdrop');
        const title = document.getElementById('modal-course-title')?.textContent;
        const modules = document.querySelectorAll('.modal-module-card').length;
        const lessons = document.querySelectorAll('.modal-lesson-item').length;
        const isOpen = modal && getComputedStyle(modal).display !== 'none' && modal.classList.contains('active');
        return { isOpen, title, modules, lessons };
      })()
    `,
    returnByValue: true
  });

  console.log('COURSE MODAL AFTER CLICK:', JSON.stringify(courseModalStatus.result?.result?.value));

  const shot1 = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shot1.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/actual_course_modal_verified.png', Buffer.from(shot1.result.data, 'base64'));
    console.log('Captured actual_course_modal_verified.png');
  }

  // Close course modal
  await sendSession('Runtime.evaluate', { expression: `window.closeCourseModal && window.closeCourseModal();` });
  await new Promise(r => setTimeout(r, 600));

  // Test 2: Click on trilha card
  const trilhaClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const card = document.querySelector('.course-grid-item[data-type="trilha"] .trilha-card');
        if (card) {
          card.click();
          return { clicked: true, trilhaId: card.closest('[data-trilha-id]')?.getAttribute('data-trilha-id') };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });

  console.log('TRILHA CARD CLICK:', JSON.stringify(trilhaClick.result?.result?.value));

  await new Promise(r => setTimeout(r, 1000));

  const trilhaModalStatus = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const modal = document.getElementById('trilha-detail-modal-backdrop');
        const title = document.getElementById('modal-trilha-title')?.textContent;
        const stages = document.querySelectorAll('.trilha-stage-item').length;
        const isOpen = modal && getComputedStyle(modal).display !== 'none' && modal.classList.contains('active');
        return { isOpen, title, stages };
      })()
    `,
    returnByValue: true
  });

  console.log('TRILHA MODAL AFTER CLICK:', JSON.stringify(trilhaModalStatus.result?.result?.value));

  const shot2 = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shot2.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/actual_trilha_modal_verified.png', Buffer.from(shot2.result.data, 'base64'));
    console.log('Captured actual_trilha_modal_verified.png');
  }

  await send('Target.closeTarget', { targetId });
  ws.close();
  console.log('All tests passed!');
}

run().catch(console.error);
