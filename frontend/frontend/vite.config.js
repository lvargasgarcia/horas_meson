import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Directorio de salida
    sourcemap: true, // (opcional) Para habilitar mapas de fuente
  },
  server: {
    port: 3001 // Cambia 3001 por el puerto que quieras usar
  }
});
