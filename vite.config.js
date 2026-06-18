import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/wtet-what-to-eat-today/",
  server: {
    port: 3000,
  },
});
