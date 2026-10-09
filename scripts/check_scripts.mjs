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
  await sendSession('Log.enable');

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled' || data.method === 'Runtime.exceptionThrown') {
      console.log('BROWSER LOG/ERROR:', JSON.stringify(data.params, null, 2));
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'test-user', email: 'test@mindflix.com', name: 'Test' }));`
  });

  await sendSession('Page.navigate', { url: 'http://localhost:4321/courses' });
  await new Promise(r => setTimeout(r, 2000));

  const scripts = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const s = Array.from(document.querySelectorAll('script')).map(el => ({
          type: el.type,
          src: el.src,
          id: el.id,
          inlineLength: el.textContent?.length
        }));
        return s;
      })()
    `,
    returnByValue: true
  });

  console.log('SCRIPTS ON PAGE:', JSON.stringify(scripts, null, 2));

  await send('Target.closeTarget', { targetId });
  ws.close();
}

run().catch(console.error);
