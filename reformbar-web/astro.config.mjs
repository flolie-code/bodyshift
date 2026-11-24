import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://reformbar.at',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !/\/(impressum|datenschutz|agb)\/$/.test(page) })],
  vite: {
    // Eigene tsconfig erzwingen (die Website liegt in einem Unterordner des App-Repos)
    tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
  },
});
