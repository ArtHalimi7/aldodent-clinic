import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'vendor-anim': ['framer-motion', 'gsap'],
          'vendor-ui': ['lucide-react', '@mdi/js', '@mdi/react'],
        }
      }
    }
  }
})
