import { dev } from 'astro';

console.log('Starting Astro dev server programmatically...');
const server = await dev({
  root: '.',
  server: {
    port: 4321,
    host: '127.0.0.1'
  }
});

console.log('Astro dev server is ready and listening at http://127.0.0.1:4321');
