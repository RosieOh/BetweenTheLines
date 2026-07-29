import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { postsMetaPlugin } from "@btl/build/vite-plugin-posts";

export default defineConfig({
  // @btl/core 가 virtual:posts-meta 를 import 하므로 테스트에서도 플러그인이 필요합니다.
  plugins: [
    react(),
    postsMetaPlugin({ postsDir: path.resolve(__dirname, "./content/posts") }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@btl/core": path.resolve(__dirname, "./packages/core/src/index.ts"),
    },
  },
});
