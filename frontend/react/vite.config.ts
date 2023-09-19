import {defineConfig} from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setup.ts',
    css: true,
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html']
    }
  }
})