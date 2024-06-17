import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: '../public',
  envDir: '../',
  build: {
    outDir: '../dist',
  },
  server: {
    port: 3000,
    strictPort: true,
    hmr: {
      clientPort: 80,
      port: 3000,
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@component', replacement: resolve(__dirname, 'src/component') },
      { find: '@pages', replacement: resolve(__dirname, 'src/pages') },
    ],
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
});
