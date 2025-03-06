import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // Allow access from network
    port: 5173, // Change to your Vite port
    strictPort: true, // Ensures it doesn't switch ports
    allowedHosts: [".ngrok-free.app"], // Allow all ngrok subdomains
  },
});
