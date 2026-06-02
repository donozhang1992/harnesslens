import react from "@vitejs/plugin-react";
import { copyFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";

function copyManifest(): Plugin {
  return {
    name: "harnesslens-copy-manifest",
    closeBundle() {
      copyFileSync(
        resolve(__dirname, "manifest.json"),
        resolve(__dirname, "dist", "manifest.json"),
      );
      const assetsDirectory = resolve(__dirname, "dist", "assets");
      const contentCss = readdirSync(assetsDirectory).find(
        (file) => file.startsWith("content-") && file.endsWith(".css"),
      );
      if (contentCss !== undefined) {
        copyFileSync(
          resolve(assetsDirectory, contentCss),
          resolve(__dirname, "dist", "content.css"),
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyManifest()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: "src/content/index.tsx"
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]"
      }
    }
  }
});
