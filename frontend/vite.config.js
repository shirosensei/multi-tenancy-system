import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {

  return {
    plugins: [react()],
    define: {
      // Inject the API URL into your app as a global constant
      // __API_URL__: JSON.stringify(import.meta.env.VITE_API_URL),
    },
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: import.meta.env.VITE_API_URL, // Proxy API requests during development
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
    //     },
    //   },
    // },
  };
});