import { resolve } from 'path';

export default {
  root: resolve(__dirname, 'src'),
  publicDir: '../public',
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
      {
        find: '@component',
        replacement: resolve(__dirname, 'src/component'),
      },
      {
        find: '@pages',
        replacement: resolve(__dirname, 'src/pages'),
      },
    ],
  },
};
