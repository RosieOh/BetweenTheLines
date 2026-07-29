import type { PostMeta } from "@/data/posts";
import { byNewest } from "@/data/posts";
import { getPublishedPosts } from "@/lib/postStorage";
import { loadAllPostContents } from "@/lib/loadPosts";

/**
 * 전문 검색.
 *
 * 본문은 글 단위 청크로 분리돼 있으므로 여기서 한 번에 끌어옵니다.
 * 목록·상세 경로에서는 호출하지 마세요 — 검색 화면 진입 시에만 비용을 냅니다.
 */
export async function searchPosts(query: string, category: string): Promise<PostMeta[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const candidates = getPublishedPosts().filter(
    (post) => category === "전체" || post.category === category
  );

  // 메타데이터만으로 판정되는 글은 본문을 볼 필요가 없습니다.
  const matchesMeta = (post: PostMeta) =>
    post.title.toLowerCase().includes(q) ||
    post.excerpt.toLowerCase().includes(q) ||
    post.author.toLowerCase().includes(q) ||
    post.tags.some((t) => t.toLowerCase().includes(q));

  const metaHits = candidates.filter(matchesMeta);
  if (metaHits.length === candidates.length) return metaHits.sort(byNewest);

  const contents = await loadAllPostContents();
  const results = candidates.filter((post) => {
    if (matchesMeta(post)) return true;
    const body = post.content ?? contents.get(post.id) ?? "";
    return body.toLowerCase().includes(q);
  });

  return results.sort(byNewest);
}
