import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
    
    plugins: [react()],
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: import, // Use the loaded environment variable
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  };
});