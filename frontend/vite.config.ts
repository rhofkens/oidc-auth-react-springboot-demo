/// <reference types="vitest" />
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Add resolve section for aliases
    alias: {
      // Use the derived __dirname for path resolution
      components: path.resolve(__dirname, './src/components'),
      utils: path.resolve(__dirname, './src/lib/utils'),
      ui: path.resolve(__dirname, './src/components/ui'),
      lib: path.resolve(__dirname, './src/lib'),
      hooks: path.resolve(__dirname, './src/hooks'),
      services: path.resolve(__dirname, './src/services'), // Add services alias
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
