import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      enabled: true,
    },
    include: ['src/**/*.spec.*'],
  },
});
