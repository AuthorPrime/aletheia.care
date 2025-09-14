import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Update with your repo name if deploying to GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: "./",
});
