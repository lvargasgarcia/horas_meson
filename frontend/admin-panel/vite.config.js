import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // Directorio de salida
    sourcemap: true, // (opcional) Para habilitar mapas de fuente
  },
});