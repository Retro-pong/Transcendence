import { resolve } from 'path';

export default {
  root: resolve(__dirname, 'src'),
  publicDir: '../public',
  build: {
    outDir: '../dist',
  },
  server: {
    port: 3000,
  },
};
