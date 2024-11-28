import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => {
  const shopify = (await import("vite-plugin-shopify")).default;

  return {
    build: {
      rollupOptions: {
        input: {
          floating: path.resolve(
            __dirname,
            "frontend/entrypoints/floating.jsx"
          ),
          carousel: path.resolve(
            __dirname,
            "frontend/entrypoints/carousel.jsx"
          ),
          tag: path.resolve(__dirname, "frontend/entrypoints/tag.jsx"),
        },
      },
    },
    plugins: [
      shopify({
        themeRoot: "extensions/kodex-extension",
      }),
      react(),
    ],
  };
});
