import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8', // or 'c8'
      reporter: ['text', 'html'], // Formats for coverage report
      all: true, // Include all files in the report, even untested ones
      include: ['src/**/*.{js,jsx,ts,tsx}'], // Files to include
      exclude: ['node_modules', 'tests/**/*'], // Files to exclude
    },
  },
});
