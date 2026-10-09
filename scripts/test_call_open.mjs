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
  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'user_123', email: 'test@mindflix.com', name: 'Tester' }));`
  });

  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });
  await new Promise(r => setTimeout(r, 4000));

  const directTest = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const hasOpenCourse = typeof window.openCourseModal;
        const hasOpenTrilha = typeof window.openTrilhaModal;
        
        let courseCall = 'not called';
        let courseErr = null;
        try {
          if (typeof window.openCourseModal === 'function') {
            window.openCourseModal('course-criando-influencer-digital');
            courseCall = 'called';
          }
        } catch (e) {
          courseErr = e.stack || e.message;
        }

        const modal = document.getElementById('course-detail-modal-backdrop');
        const title = document.getElementById('modal-course-title')?.textContent;
        const modules = document.querySelectorAll('.modal-module-card').length;
        const lessons = document.querySelectorAll('.modal-lesson-item').length;

        return {
          hasOpenCourse,
          hasOpenTrilha,
          courseCall,
          courseErr,
          modalDisplay: modal?.style.display,
          modalClass: modal?.className,
          title,
          modules,
          lessons
        };
      })()
    `,
    returnByValue: true
  });

  console.log('DIRECT TEST RESULT:', JSON.stringify(directTest.result?.result?.value, null, 2));

  await new Promise(r => setTimeout(r, 600));
  const shot = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shot.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/direct_open_test.png', Buffer.from(shot.result.data, 'base64'));
    console.log('Saved direct_open_test.png');
  }

  await send('Target.closeTarget', { targetId });
  ws.close();
}

run().catch(console.error);
