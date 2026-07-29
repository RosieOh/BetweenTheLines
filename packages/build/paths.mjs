// ── 경로 단일 소스 ────────────────────────────────────────────
// 빌드 스크립트는 앱 디렉터리(apps/blog)에서 실행되지만, 글과 설정은
// 워크스페이스 루트에 있습니다. cwd에 의존하면 실행 위치에 따라 깨지므로
// 워크스페이스 루트는 이 파일의 위치에서 역산합니다.

import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** 워크스페이스 루트 (packages/build 에서 두 단계 위) */
export const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** 글 원본 — 앱과 무관하게 항상 같은 위치입니다. */
export const postsDir = join(workspaceRoot, "content", "posts");

/** 블로그 설정 */
export const blogConfigPath = join(workspaceRoot, "blog.config.json");

/** 스크립트를 호출한 앱의 루트 (npm 스크립트의 cwd) */
export const appRoot = process.cwd();

export const publicDir = join(appRoot, "public");
export const distDir = join(appRoot, "dist");
