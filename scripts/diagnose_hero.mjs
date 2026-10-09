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

  const consoleLogs = [];
  const errors = [];

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.consoleAPICalled') {
      consoleLogs.push(data.params.args.map(a => a.value || a.description).join(' '));
    }
    if (data.method === 'Runtime.exceptionThrown') {
      errors.push(data.params.exceptionDetails);
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  // Set auth
  await sendSession('Runtime.evaluate', {
    expression: `localStorage.setItem('mindflix_user', JSON.stringify({ id: 'user_123', email: 'test@mindflix.com', name: 'Tester' }));`
  });

  // Navigate to /
  await sendSession('Page.navigate', { url: 'http://localhost:4321/' });
  await new Promise(r => setTimeout(r, 3000));

  // Inspect current location and hero
  const heroInfo = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const url = window.location.href;
        const title = document.title;
        const hero = document.getElementById('home-hero-section');
        const dots = Array.from(document.querySelectorAll('.indicator-dot')).map((d, i) => ({
          index: i,
          isActive: d.classList.contains('active'),
          classes: d.className,
          box: d.getBoundingClientRect()
        }));
        const soundBtn = document.getElementById('hero-sound-toggle');
        const videos = Array.from(document.querySelectorAll('.hero-bg-video')).map((v, i) => ({
          index: i,
          src: v.src,
          muted: v.muted,
          paused: v.paused,
          volume: v.volume,
          parentActive: v.closest('.hero-video-item')?.classList.contains('active')
        }));
        const slides = Array.from(document.querySelectorAll('.hero-slide')).map((s, i) => ({
          index: i,
          isActive: s.classList.contains('active'),
          title: s.querySelector('.hero-title')?.textContent
        }));
        return {
          url,
          title,
          heroFound: Boolean(hero),
          dots,
          soundBtn: soundBtn ? {
            text: soundBtn.textContent?.trim(),
            box: soundBtn.getBoundingClientRect()
          } : null,
          videos,
          slides
        };
      })()
    `,
    returnByValue: true
  });

  console.log('HERO INFO:', JSON.stringify(heroInfo.result?.result?.value, null, 2));
  console.log('CONSOLE LOGS:', consoleLogs);
  console.log('ERRORS:', JSON.stringify(errors, null, 2));

  // Test clicking second dot
  const clickDot = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const dots = document.querySelectorAll('.indicator-dot');
        if (dots.length > 1) {
          dots[1].click();
          return { clicked: true, totalDots: dots.length };
        }
        return { clicked: false, totalDots: dots.length };
      })()
    `,
    returnByValue: true
  });

  console.log('CLICK DOT RESULT:', clickDot.result?.result?.value);

  await new Promise(r => setTimeout(r, 1000));

  const afterDotInfo = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const dots = Array.from(document.querySelectorAll('.indicator-dot')).map(d => d.classList.contains('active'));
        const slides = Array.from(document.querySelectorAll('.hero-slide')).map(s => s.classList.contains('active'));
        const videos = Array.from(document.querySelectorAll('.hero-bg-video')).map(v => ({
          muted: v.muted,
          paused: v.paused,
          parentActive: v.closest('.hero-video-item')?.classList.contains('active')
        }));
        return { dots, slides, videos };
      })()
    `,
    returnByValue: true
  });

  console.log('AFTER DOT CLICK:', JSON.stringify(afterDotInfo.result?.result?.value, null, 2));

  // Test clicking sound toggle
  const clickSound = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const soundBtn = document.getElementById('hero-sound-toggle');
        if (soundBtn) {
          soundBtn.click();
          return { clicked: true };
        }
        return { clicked: false };
      })()
    `,
    returnByValue: true
  });

  console.log('CLICK SOUND RESULT:', clickSound.result?.result?.value);

  await new Promise(r => setTimeout(r, 1000));

  const afterSoundInfo = await sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const soundBtn = document.getElementById('hero-sound-toggle');
        const activeVideo = document.querySelector('.hero-video-item.active .hero-bg-video');
        return {
          btnText: soundBtn?.textContent?.trim(),
          btnUnmutedClass: soundBtn?.classList.contains('unmuted'),
          videoMuted: activeVideo?.muted,
          videoVolume: activeVideo?.volume
        };
      })()
    `,
    returnByValue: true
  });

  console.log('AFTER SOUND CLICK:', JSON.stringify(afterSoundInfo.result?.result?.value, null, 2));

  const shot = await sendSession('Page.captureScreenshot', { format: 'png' });
  if (shot.result?.data) {
    fs.writeFileSync('C:/Users/Eduardo/.gemini/antigravity/brain/3eacfa5b-15f0-4cab-9067-7153e754e2b8/hero_diagnostics.png', Buffer.from(shot.result.data, 'base64'));
  }

  await send('Target.closeTarget', { targetId });
  ws.close();
}

run().catch(console.error);
