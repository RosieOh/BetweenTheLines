// ── 포스트 메타데이터 가상 모듈 플러그인 ──────────────────────
// `virtual:posts-meta` 를 import 하면 content/posts/**/*.mdx 의 frontmatter만
// 담긴 배열을 얻습니다. 본문은 포함되지 않으므로 목록 화면이 전체 글 본문을
// 내려받지 않아도 됩니다. 본문은 packages/core/src/loadPosts.ts 의 lazy glob이 담당합니다.

import { readPostsMeta } from "./posts.mjs";

const VIRTUAL_ID = "virtual:posts-meta";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

/** @param {{ postsDir: string }} options */
export function postsMetaPlugin({ postsDir }) {
  return {
    name: "vite-plugin-posts-meta",

    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },

    load(id) {
      if (id !== RESOLVED_ID) return null;
      return `export const postsMeta = ${JSON.stringify(readPostsMeta(postsDir))};`;
    },

    configureServer(server) {
      // .mdx의 frontmatter를 고치면 목록/메타가 즉시 반영되도록 가상 모듈을 무효화합니다.
      const invalidate = (file) => {
        if (!file.endsWith(".mdx")) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (!mod) return;
        server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };

      server.watcher.on("add", invalidate);
      server.watcher.on("unlink", invalidate);
      server.watcher.on("change", invalidate);
    },
  };
}
