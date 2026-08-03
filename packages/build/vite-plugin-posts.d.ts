import type { Plugin } from "vite";

/** content/posts 의 frontmatter를 `virtual:posts-meta` 로 주입하는 플러그인. */
export function postsMetaPlugin(options: { postsDir: string }): Plugin;
