import purgeCss from '@mojojoejo/vite-plugin-purgecss';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), purgeCss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3700',
    },
  },
  css: {
    preprocessorOptions: {
      scss: false,
    },
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
