import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      passWithNoTests: true,
      globals: true,
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        enabled: true,
      },
      include: ['src/**/*.spec.*'],
    },
  }),
);
