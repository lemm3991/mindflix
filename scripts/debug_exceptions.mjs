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

  const targetRes = await send('Target.createTarget', { url: 'about:blank' });
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
  await sendSession('Log.enable');

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.sessionId === sessionId) {
      if (data.method === 'Runtime.consoleAPICalled') {
        console.log('CONSOLE:', data.params.type, data.params.args?.map(a => a.value || a.description));
      } else if (data.method === 'Runtime.exceptionThrown') {
        console.log('EXCEPTION:', JSON.stringify(data.params.exceptionDetails, null, 2));
      }
    }
  });

  // Navigate to login first to set auth
  await sendSession('Page.navigate', { url: 'http://localhost:4321/login' });
  await new Promise(r => setTimeout(r, 1500));

  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'user_123', email: 'test@mindflix.com', name: 'Tester' }));`
  });

  console.log('Navigating to /courses with console listeners active...');
  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });
  await new Promise(r => setTimeout(r, 4000));

  // Manually try to import CourseDetailModal
  const manualImport = await sendSession('Runtime.evaluate', {
    expression: `
      (async function() {
        try {
          const mod = await import('/src/components/CourseDetailModal.astro?astro&type=script&index=0&lang.ts');
          return { imported: true, openFn: typeof window.openCourseModal };
        } catch (e) {
          return { imported: false, err: e.stack || e.message };
        }
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });

  console.log('MANUAL IMPORT RESULT:', JSON.stringify(manualImport, null, 2));

  await send('Target.closeTarget', { targetId });
  ws.close();
}

run().catch(console.error);
