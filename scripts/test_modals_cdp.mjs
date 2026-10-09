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

  // Set user auth
  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'test-user', email: 'test@mindflix.com', name: 'Test User' }));`
  });

  // Navigate to /courses
  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });
  
  // Wait until document is ready
  let isReady = false;
  let readyAttempts = 0;
  while (!isReady && readyAttempts < 40) {
    await new Promise(r => setTimeout(r, 200));
    const readyState = await sendSession('Runtime.evaluate', {
      expression: `document.readyState === 'complete' && Boolean(document.getElementById('course-detail-modal-backdrop')) && typeof window.openCourseModal === 'function'`
    });
    if (readyState.result?.result?.value === true) {
      isReady = true;
    }
    readyAttempts++;
  }

  console.log(`Page ready check: isReady=${isReady} after ${readyAttempts * 200}ms`);

  // Test 1: Click course card
  const courseClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const card = document.querySelector('.course-card-wrapper .course-card');
        if (card) {
          card.click();
          return { clicked: true, courseId: card.closest('[data-course-id]')?.getAttribute('data-course-id') };
        }
        return { clicked: false, cardCount: document.querySelectorAll('.course-card-wrapper').length };
      })()
    `,
    returnByValue: true
  });

  console.log('Course click result:', JSON.stringify(courseClick));

  await new Promise(r => setTimeout(r, 1000));

  // Check Course Modal state
  const courseModalCheck = await sendSession('Runtime.evaluate', {
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

  console.log('Course modal check:', JSON.stringify(courseModalCheck));

  const courseShot = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (courseShot.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/actual_course_modal_verified.png', Buffer.from(courseShot.result.data, 'base64'));
    console.log('Captured actual_course_modal_verified.png');
  }

  // Close course modal
  await sendSession('Runtime.evaluate', {
    expression: `window.closeCourseModal && window.closeCourseModal();`
  });
  await new Promise(r => setTimeout(r, 600));

  // Test 2: Click Trilha card
  const trilhaClick = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const trilhaCard = document.querySelector('.trilha-card-wrapper .trilha-card');
        if (trilhaCard) {
          trilhaCard.click();
          return { clicked: true, trilhaId: trilhaCard.closest('[data-trilha-id]')?.getAttribute('data-trilha-id') };
        }
        return { clicked: false, trilhaCount: document.querySelectorAll('.trilha-card-wrapper').length };
      })()
    `,
    returnByValue: true
  });

  console.log('Trilha click result:', JSON.stringify(trilhaClick));

  await new Promise(r => setTimeout(r, 1000));

  // Check Trilha Modal state
  const trilhaModalCheck = await sendSession('Runtime.evaluate', {
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

  console.log('Trilha modal check:', JSON.stringify(trilhaModalCheck));

  const trilhaShot = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (trilhaShot.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/actual_trilha_modal_verified.png', Buffer.from(trilhaShot.result.data, 'base64'));
    console.log('Captured actual_trilha_modal_verified.png');
  }

  await send('Target.closeTarget', { targetId });
  ws.close();
  console.log('All CDP modal verification tests completed successfully');
}

run().catch(console.error);
