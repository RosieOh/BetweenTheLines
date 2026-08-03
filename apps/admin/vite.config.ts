import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { postsMetaPlugin } from "@btl/build/vite-plugin-posts";

const workspaceRoot = path.resolve(__dirname, "../..");

// 관리자 앱은 로컬 저작 도구입니다. GitHub Pages 배포 대상이 아니므로
// base 는 항상 "/" 이고, 별도 호스팅에 올릴 경우에만 VITE_ADMIN_BASE 를 씁니다.
export default defineConfig(() => ({
  base: process.env.VITE_ADMIN_BASE ?? "/",
  server: {
    host: "::",
    // 블로그(8080)와 동시에 띄울 수 있도록 포트를 분리합니다.
    port: 8081,
    fs: {
      allow: [workspaceRoot],
    },
  },
  plugins: [
    react(),
    postsMetaPlugin({ postsDir: path.resolve(workspaceRoot, "content/posts") }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
        },
      },
    },
  },
}));
