import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// Standalone visual harness for nearbytes-components (no Electron, mock adapter).
export default defineConfig({
  root: r('.'),
  plugins: [tailwindcss(), svelte()],
  resolve: {
    alias: {
      'nearbytes-components': r('../src/lib/index.ts')
    }
  },
  server: { port: 5199, strictPort: true }
});
