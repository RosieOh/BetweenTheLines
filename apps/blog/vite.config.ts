import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { postsMetaPlugin } from "@btl/build/vite-plugin-posts";

const workspaceRoot = path.resolve(__dirname, "../..");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE_PATH ?? "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    fs: {
      // content/ 와 packages/ 가 앱 루트 바깥에 있어 접근을 허용해야 합니다.
      allow: [workspaceRoot],
    },
  },
  plugins: [
    react(),
    postsMetaPlugin({ postsDir: path.resolve(workspaceRoot, "content/posts") }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // 자주 바뀌지 않는 런타임만 분리해 포스트 추가 시 캐시가 통째로 깨지지 않게 합니다.
        // 마크다운/하이라이터는 여기서 묶지 않습니다 — 묶으면 엔트리의 정적 의존이 되어
        // 상세 페이지에서만 필요한 코드가 홈에서도 modulepreload 됩니다.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
}));
