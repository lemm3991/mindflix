// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    server: {
      fs: {
        // Allow serving files from parent directory where courses are located
        allow: ['..']
      }
    }
  }
});
