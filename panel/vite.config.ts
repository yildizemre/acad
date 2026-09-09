import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Panel, pazarlama sitesinden ayrı bir uygulama.
// Site 5173'te çalışıyor; panel 5174'te ki ikisi aynı anda açık kalabilsin.
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 },
});
