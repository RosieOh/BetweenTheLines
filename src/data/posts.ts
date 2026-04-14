import { loadPostsFromFiles } from "@/lib/loadPosts";
import { allCategoryKeys } from "@/lib/blogConfig";

export interface PostData {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  thumbnail: string;
  tags: string[];
  readTime: string;
  content: string;
  status?: "published" | "draft";
  series?: string;
  seriesOrder?: number;
  seriesLabel?: string;
}

// 카테고리 목록 — 추가/수정은 src/lib/blogConfig.ts 의 categoryList 를 수정하세요.
export const categories = allCategoryKeys as readonly string[];

// MDX 파일에서 동적으로 로드
export const samplePosts: PostData[] = loadPostsFromFiles();
