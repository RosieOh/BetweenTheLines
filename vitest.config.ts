import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { postsMetaPlugin } from "./plugins/vite-plugin-posts.mjs";

export default defineConfig({
  // 앱 코드가 virtual:posts-meta 를 import 하므로 테스트에서도 플러그인이 필요합니다.
  plugins: [react(), postsMetaPlugin({ postsDir: path.resolve(__dirname, "./src/posts") })],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
