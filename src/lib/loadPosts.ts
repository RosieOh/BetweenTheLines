import { postsMeta } from "virtual:posts-meta";
import type { PostMeta } from "@/data/posts";

import thumbArchitecture from "@/assets/thumb-architecture.jpg";
import thumbAiReview from "@/assets/thumb-ai-review.jpg";
import thumbCommunication from "@/assets/thumb-communication.jpg";
import thumbSecurity from "@/assets/thumb-security.jpg";
import thumbCicd from "@/assets/thumb-cicd.jpg";

const thumbnailMap: Record<string, string> = {
  architecture: thumbArchitecture,
  ai: thumbAiReview,
  communication: thumbCommunication,
  security: thumbSecurity,
  cicd: thumbCicd,
};

/**
 * 본문 로더 — eager가 아니므로 각 .mdx가 별도 청크가 되고
 * 실제로 그 글을 열 때만 네트워크를 탑니다.
 */
const contentLoaders = import.meta.glob("../posts/**/*.mdx", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

/** 파일 경로 → 포스트 id(확장자 없는 파일명) */
function idFromPath(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1).replace(/\.mdx$/, "");
}

const loaderById = new Map(
  Object.entries(contentLoaders).map(([path, loader]) => [idFromPath(path), loader])
);

const contentCache = new Map<string, string>();

/** frontmatter 블록을 제거한 본문만 돌려줍니다. */
function stripFrontmatter(raw: string): string {
  const match = raw.match(/^---[\r\n]+[\s\S]*?[\r\n]+---[\r\n]*([\s\S]*)$/);
  return (match ? match[1] : raw).trim();
}

/** 단일 포스트 본문을 로드합니다. 없는 id면 null. */
export async function loadPostContent(id: string): Promise<string | null> {
  const cached = contentCache.get(id);
  if (cached !== undefined) return cached;

  const loader = loaderById.get(id);
  if (!loader) return null;

  const content = stripFrontmatter(await loader());
  contentCache.set(id, content);
  return content;
}

/**
 * 전 포스트 본문을 로드합니다 — 전문 검색 전용.
 * 목록/상세 경로에서는 절대 호출하지 마세요(모든 청크를 끌어옵니다).
 */
export async function loadAllPostContents(): Promise<Map<string, string>> {
  await Promise.all([...loaderById.keys()].map((id) => loadPostContent(id)));
  return contentCache;
}

/** 빌드 타임에 추출된 메타데이터 — 이미 rawDate 내림차순으로 정렬돼 있습니다. */
export function loadPostsFromFiles(): PostMeta[] {
  return postsMeta.map((meta) => ({
    ...meta,
    thumbnail: thumbnailMap[meta.thumbnail] ?? thumbArchitecture,
  }));
}
