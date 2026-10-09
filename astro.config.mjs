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

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: getAdapter(),
  integrations: [
    astroGrab({ toolbar: false, holdDuration: 0 })
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
