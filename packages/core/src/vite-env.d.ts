/// <reference types="vite/client" />

// @btl/build 의 vite-plugin-posts 가 빌드 타임에 주입하는 가상 모듈입니다.
// 이 파일이 전역(ambient)으로 남아야 하므로 최상위 import 대신 inline import 타입을 씁니다.
declare module "virtual:posts-meta" {
  /** thumbnail은 아직 에셋 URL이 아닌 키 문자열입니다 — loadPosts.ts 에서 매핑합니다. */
  export const postsMeta: (Omit<import("./posts").PostMeta, "thumbnail"> & {
    thumbnail: string;
  })[];
}

interface ImportMetaEnv {
  /** giscus 설정 재정의 — 평소에는 blog.config.json 값을 씁니다. */
  readonly VITE_GISCUS_REPO?: string;
  readonly VITE_GISCUS_REPO_ID?: string;
  readonly VITE_GISCUS_CATEGORY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
