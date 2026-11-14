import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Served from the domain root on Netlify.
  base: "/",
  build: { outDir: "build" }, // matches publish dir in netlify.toml
  server: { open: true },
});
