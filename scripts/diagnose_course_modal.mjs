import http from 'http';

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

  await new Promise(r => setTimeout(r, 1000));
  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'test-user', email: 'test@mindflix.com', name: 'Test' }));`
  });

  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });
  await new Promise(r => setTimeout(r, 4000));

  const diag = await sendSession('Runtime.evaluate', {
    expression: `
      (async function() {
        const jsonEl = document.getElementById('mindflix-courses-json');
        const courses = jsonEl ? JSON.parse(jsonEl.textContent) : [];
        const match = courses.find(c => c.id === 'course-criando-influencer-digital');
        const modalBackdrop = document.getElementById('course-detail-modal-backdrop');

        // Wait up to 3s for client modules to execute
        let attempts = 0;
        while (typeof window.openCourseModal !== 'function' && attempts < 30) {
          await new Promise(r => setTimeout(r, 100));
          attempts++;
        }

        const openFn = typeof window.openCourseModal;
        let callSuccess = false;
        let callErr = null;

        if (typeof window.openCourseModal === 'function') {
          try {
            window.openCourseModal('course-criando-influencer-digital');
            callSuccess = true;
          } catch (e) {
            callErr = e.stack || e.message;
          }
        }

        // Wait a tick for requestAnimationFrame
        await new Promise(r => setTimeout(r, 150));

        const titleEl = document.getElementById('modal-course-title');
        const modulesList = document.getElementById('modal-modules-list');

        return {
          href: window.location.href,
          totalCourses: courses.length,
          foundMatch: Boolean(match),
          backdropFound: Boolean(modalBackdrop),
          attemptsWaited: attempts,
          openFn,
          callSuccess,
          callErr,
          modalTitle: titleEl?.textContent,
          modulesRendered: modulesList?.children.length,
          backdropClassAfter: modalBackdrop?.className,
          backdropDisplayAfter: modalBackdrop?.style.display
        };
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('COURSE DIAG:', JSON.stringify(diag, null, 2));

  await send('Target.closeTarget', { targetId });
  ws.close();
}

run().catch(console.error);
