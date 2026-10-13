// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import node from '@astrojs/node';
import astroGrabAntigravity from './astro-grab-bridge.js';

const getAdapter = () => {
  if (process.env.VERCEL) {
    return vercel();
  }
  // Local development / build default
  return process.env.NODE_ENV === 'production' ? vercel() : node({ mode: 'standalone' });
};

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: getAdapter(),
  integrations: [
    astroGrabAntigravity()
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
