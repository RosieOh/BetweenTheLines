// 관리자 앱은 블로그와 별도로 배포되므로, 블로그로 가는 링크는
// 라우터 Link 가 아니라 외부 URL 이어야 합니다.
//
// 개발 중에는 `npm run dev` 가 띄우는 8080 을 기본값으로 씁니다.
// 다른 곳을 가리키려면 apps/admin/.env 에 VITE_BLOG_URL 을 지정하세요.
const DEFAULT_BLOG_URL = "http://localhost:8080";

export const blogUrl = (import.meta.env.VITE_BLOG_URL ?? DEFAULT_BLOG_URL).replace(/\/+$/, "");

/** 블로그의 특정 경로로 가는 절대 URL */
export function blogLink(path = "/"): string {
  return `${blogUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
