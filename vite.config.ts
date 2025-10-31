import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
   server: {
    proxy: {
      '/api/sheets': {
        target: 'https://script.google.com/macros/s/AKfycbwe2Wkbw_ZTxqzlpyk1PpMB8laceMbLpbJYHMSVR9lGFMOstS_FjaK4I6rdqFTwyCI/exec',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/sheets/, ''),
      },
    },
  },


  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  
}));
