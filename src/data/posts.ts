import { loadPostsFromFiles } from "@/lib/loadPosts";
import { allCategoryKeys } from "@/lib/blogConfig";

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

// 카테고리 목록 — 추가/수정은 src/lib/blogConfig.ts 의 categoryList 를 수정하세요.
export const categories = allCategoryKeys as readonly string[];

// 빌드 타임에 추출된 .mdx 메타데이터
export const samplePosts: PostMeta[] = loadPostsFromFiles();
