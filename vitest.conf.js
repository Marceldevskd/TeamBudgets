import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true, 
    coverage: {
      provider: 'v8', // Use 'v8' for coverage reporting
      reporter: ['text', 'json', 'html'], 
    },
    include: ['src/**/*.test.ts', 'src/__tests__/*.spec.ts'], 
    hookTimeout: 1000,
    testTimeout: 1500,
  },
}); 