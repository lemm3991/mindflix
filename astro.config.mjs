import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import { astroGrab } from 'astro-grab';

const getAdapter = () => {
  if (process.env.VERCEL) {
    return vercel();
  }
  if (process.env.NETLIFY) {
    return netlify();
  }
  return node({ mode: 'standalone' });
};

const astroGrabAltHelper = () => ({
  name: 'astro-grab-alt-helper',
  hooks: {
    'astro:config:setup': ({ command, injectScript }) => {
      if (command === 'dev') {
        injectScript('page', `
          (() => {
            window.addEventListener('keydown', (e) => {
              if (e.key === 'Alt' && !e.repeat && window.__astroGrabInstance__) {
                window.__astroGrabInstance__.stateMachine.transition('targeting');
              }
            });
            window.addEventListener('keyup', (e) => {
              if (e.key === 'Alt' && window.__astroGrabInstance__ && window.__astroGrabInstance__.stateMachine.getState() === 'targeting') {
                window.__astroGrabInstance__.stateMachine.reset();
              }
            });
          })();
        `);
      }
    }
  }
});

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: getAdapter(),
  integrations: [
    astroGrab({ toolbar: false, holdDuration: 0 }),
    astroGrabAltHelper()
  ],
  vite: {
    server: {
      fs: {
        // Allow serving files from parent directory where courses are located
        allow: ['..']
      }
    }
  }
});
