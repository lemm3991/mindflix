// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    server: {
      fs: {
        // Allow serving files from parent directory where courses are located
        allow: ['..']
      }
    }
  }
});
