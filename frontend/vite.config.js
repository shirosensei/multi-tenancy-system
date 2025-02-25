import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  // Extract the required environment variables
  const apiUrl = env.VITE_API_URL;
  const apiKey = env.VITE_API_KEY;

  return {
    define: {
      __API_URL__: JSON.stringify(apiUrl),
      __API_KEY__: JSON.stringify(apiKey),
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiUrl, // Use the loaded environment variable
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});