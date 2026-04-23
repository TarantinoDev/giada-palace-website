import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
// @astrojs/sitemap wired in PR-11 (SEO pass) once real content pages exist

export default defineConfig({
  site: 'https://giadapalace.it',
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    react(),
  ],
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en', 'de', 'fr'],
    routing: {
      prefixDefaultLocale: false,
    },
    fallback: {
      de: 'it',
      fr: 'it',
    },
  },
});
