import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

// Dev/preview only — the library is published via `svelte-package`.
export default defineConfig({
  plugins: [tailwindcss(), svelte()],
});
