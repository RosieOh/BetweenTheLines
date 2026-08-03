import { loadPostsFromFiles } from "./loadPosts";
import { allCategoryKeys } from "./blogConfig";

/**
 * 목록 화면이 필요로 하는 포스트 메타데이터.
 * 본문은 의도적으로 제외돼 있습니다 — 전체 글 본문을 홈 번들에 실어 나르지
 * 않기 위해 lib/loadPosts.ts 의 loadPostContent(id) 로 분리 로드합니다.
 */
export interface PostMeta {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  /** 화면 표기용 'YYYY. MM. DD.' — 정렬에는 쓰지 마세요. */
  date: string;
  /** 정렬·비교용 ISO 'YYYY-MM-DD'. 단일 정렬 기준입니다. */
  rawDate: string;
  thumbnail: string;
  tags: string[];
  readTime: string;
  status?: "published" | "draft";
  series?: string;
  seriesOrder?: number;
  seriesLabel?: string;
}

/**
 * 본문을 이미 들고 있는 포스트.
 * 관리자 화면에서 localStorage에 저장한 글이 여기 해당합니다.
 * .mdx 파일 기반 글은 content가 없고 별도로 로드합니다.
 */
export interface PostData extends PostMeta {
  content?: string;
}

/** 최신순(rawDate 내림차순) 비교자 — 모든 목록 정렬의 단일 기준입니다. */
export function byNewest(a: PostMeta, b: PostMeta): number {
  return b.rawDate.localeCompare(a.rawDate);
}

/** 오래된순 비교자. */
export function byOldest(a: PostMeta, b: PostMeta): number {
  return a.rawDate.localeCompare(b.rawDate);
}

/** 시리즈 안에서의 위치 — 상세 페이지의 이전/다음 이동에 씁니다. */
export interface SeriesPosition {
  key: string;
  /** seriesOrder 오름차순으로 정렬된 같은 시리즈의 전체 글 */
  posts: PostMeta[];
  /** posts 안에서 현재 글의 0-based 위치 */
  index: number;
  previous?: PostMeta;
  next?: PostMeta;
}

/**
 * 주어진 글이 속한 시리즈와 앞뒤 글을 찾습니다.
 * 시리즈가 없거나 혼자뿐이면 null 을 돌려줍니다.
 */
export function findSeriesPosition(
  post: PostMeta,
  allPosts: PostMeta[]
): SeriesPosition | null {
  if (!post.series) return null;

  const posts = allPosts
    .filter((p) => p.series === post.series)
    .sort(
      (a, b) =>
        (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.seriesOrder ?? Number.MAX_SAFE_INTEGER)
    );

  if (posts.length < 2) return null;

  const index = posts.findIndex((p) => p.id === post.id);
  if (index === -1) return null;

  return {
    key: post.series,
    posts,
    index,
    previous: posts[index - 1],
    next: posts[index + 1],
  };
}

// 카테고리 목록 — 추가/수정은 src/lib/blogConfig.ts 의 categoryList 를 수정하세요.
export const categories = allCategoryKeys as readonly string[];

// 빌드 타임에 추출된 .mdx 메타데이터
export const samplePosts: PostMeta[] = loadPostsFromFiles();
