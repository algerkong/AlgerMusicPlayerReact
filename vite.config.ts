import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src')
    }
  },
  server: {
    host: '0.0.0.0',
    // 指定端口
    port: 4499,
    proxy: {
      // with options
      '/api': {
        target: 'http://110.42.251.190:9898',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/music': {
        target: 'http://110.42.251.190:4100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/music/, ''),
      },
    },
  },
})
