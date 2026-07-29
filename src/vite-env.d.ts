/// <reference types="vite/client" />

declare module "virtual:posts-meta" {
  import type { PostMeta } from "@/data/posts";

  /**
   * plugins/vite-plugin-posts.mjs 가 빌드 타임에 주입하는 포스트 메타데이터.
   * thumbnail은 아직 에셋 URL이 아닌 키 문자열입니다 (loadPosts.ts 에서 매핑).
   */
  export const postsMeta: (Omit<PostMeta, "thumbnail"> & { thumbnail: string })[];
}

interface ImportMetaEnv {
  readonly VITE_GISCUS_REPO_ID?: string;
  readonly VITE_GISCUS_CATEGORY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
