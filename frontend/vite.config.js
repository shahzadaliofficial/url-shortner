import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  define: {
    // Ensure environment variables are properly available
    'import.meta.env.VITE_FRONTEND_URL': JSON.stringify(process.env.VITE_FRONTEND_URL),
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  }
});
