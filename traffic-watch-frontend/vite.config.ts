import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [react()],
    server: {
      watch: {
        usePolling: true,
      },
      host: true,
      strictPort: true,
      port: 4000,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setup.ts",
      coverage: {
        provider: "c8",
        reporter: ["text", "json", "html"],
      },
    },
  };
});
