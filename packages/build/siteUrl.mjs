// ── 사이트 주소 단일 소스 ──────────────────────────────────────
// sitemap / robots / prerender 가 같은 주소 규칙을 쓰도록 여기서만 계산합니다.
//
// GitHub Pages 프로젝트 사이트로 배포하므로 경로에 /BetweenTheLines/ 접두사가
// 붙습니다. 커스텀 도메인으로 옮길 때는 CI에서 VITE_BASE_PATH 를 지우고
// SITE_ORIGIN 만 바꾸면 나머지는 따라옵니다.

const DEFAULT_ORIGIN = "https://rosieoh.github.io";

/**
 * env 로부터 주소 규칙을 계산합니다 (순수 함수 — 테스트 가능).
 * @param {{ SITE_ORIGIN?: string, VITE_BASE_PATH?: string }} env
 */
export function resolveSiteUrl(env = {}) {
  /** 프로토콜+호스트 (끝에 슬래시 없음) */
  const siteOrigin = (env.SITE_ORIGIN || DEFAULT_ORIGIN).replace(/\/+$/, "");

  /** Vite base 와 동일한 경로 접두사 (항상 '/' 로 시작하고 '/' 로 끝남) */
  const raw = env.VITE_BASE_PATH || "/";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  const basePath = withLeading.endsWith("/") ? withLeading : `${withLeading}/`;

  /** 앱 내부 라우트('/post/1') → 실제 서빙 경로('/BetweenTheLines/post/1') */
  const routePath = (route) => `${basePath}${route.startsWith("/") ? route.slice(1) : route}`;

  /** 앱 내부 라우트 → 절대 URL */
  const absoluteUrl = (route) => `${siteOrigin}${routePath(route)}`;

  return { siteOrigin, basePath, routePath, absoluteUrl };
}

export const { siteOrigin, basePath, routePath, absoluteUrl } = resolveSiteUrl(process.env);
