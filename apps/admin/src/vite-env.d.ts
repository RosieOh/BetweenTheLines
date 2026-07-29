/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 블로그 앱 주소 — "블로그 보기" 링크가 사용합니다. */
  readonly VITE_BLOG_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
