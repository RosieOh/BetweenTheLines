import { describe, it, expect } from "vitest";
import { join } from "node:path";

import { parseFrontmatter, estimateReadTime, readPostsMeta, formatDisplayDate } from "../../scripts/posts.mjs";
import { samplePosts, byNewest, byOldest } from "@/data/posts";
import { categoryList } from "@/lib/blogConfig";
import { categoryKeys, staticRoutes } from "../../scripts/routes.mjs";

const POSTS_DIR = join(process.cwd(), "src", "posts");

describe("parseFrontmatter", () => {
  it("값에 콜론이 들어간 제목을 자르지 않는다", () => {
    const { data } = parseFrontmatter("---\ntitle: 'AI 해결기: stale 캐시'\n---\n본문");
    expect(data.title).toBe("AI 해결기: stale 캐시");
  });

  it("인라인 배열을 파싱한다", () => {
    const { data } = parseFrontmatter("---\ntags: ['AI', 'Cache', 'SpringBoot']\n---\n");
    expect(data.tags).toEqual(["AI", "Cache", "SpringBoot"]);
  });

  it("frontmatter 를 제거한 본문만 돌려준다", () => {
    const { content } = parseFrontmatter("---\ntitle: 'x'\n---\n# 제목\n\n본문입니다.");
    expect(content.trim()).toBe("# 제목\n\n본문입니다.");
  });

  it("frontmatter 가 없으면 전체를 본문으로 본다", () => {
    const { data, content } = parseFrontmatter("# 제목만 있는 문서");
    expect(data).toEqual({});
    expect(content).toBe("# 제목만 있는 문서");
  });
});

describe("estimateReadTime", () => {
  it("최소 1분을 보장한다", () => {
    expect(estimateReadTime("짧은 글")).toBe("1분");
  });

  it("한국어 본문을 글자 수 기준으로 센다", () => {
    expect(estimateReadTime("가".repeat(2500))).toBe("5분");
  });
});

describe("readPostsMeta", () => {
  const metas = readPostsMeta(POSTS_DIR);

  it("모든 .mdx 를 읽어온다", () => {
    expect(metas.length).toBeGreaterThan(0);
    expect(metas.length).toBe(samplePosts.length);
  });

  it("id 가 유일하다 (/post/:id 라우트 키)", () => {
    expect(new Set(metas.map((m) => m.id)).size).toBe(metas.length);
  });

  it("모든 글이 파싱 가능한 rawDate 를 갖는다", () => {
    for (const meta of metas) {
      expect(meta.rawDate, `${meta.id}: rawDate 누락`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("필수 메타데이터가 비어 있지 않다", () => {
    for (const meta of metas) {
      expect(meta.title, `${meta.id}: title 누락`).not.toBe("");
      expect(meta.excerpt, `${meta.id}: description 누락`).not.toBe("");
      expect(meta.tags.length, `${meta.id}: tags 누락`).toBeGreaterThan(0);
    }
  });

  it("최신순으로 정렬돼 있다", () => {
    const dates = metas.map((m) => m.rawDate);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("모든 글의 카테고리가 blogConfig 에 정의돼 있다", () => {
    const known = new Set(categoryList.map((c) => c.key));
    for (const meta of metas) {
      expect(known.has(meta.category), `${meta.id}: 미정의 카테고리 "${meta.category}"`).toBe(true);
    }
  });

  it("date 표기가 rawDate 와 일치한다", () => {
    for (const meta of metas) {
      expect(meta.date).toBe(formatDisplayDate(meta.rawDate));
    }
  });
});

describe("정렬 비교자", () => {
  const posts = [
    { rawDate: "2026-01-01" },
    { rawDate: "2026-04-15" },
    { rawDate: "2025-12-31" },
  ] as Parameters<typeof byNewest>[0][];

  it("byNewest 는 최신 글을 앞에 둔다", () => {
    expect([...posts].sort(byNewest).map((p) => p.rawDate)).toEqual([
      "2026-04-15",
      "2026-01-01",
      "2025-12-31",
    ]);
  });

  it("byOldest 는 오래된 글을 앞에 둔다", () => {
    expect([...posts].sort(byOldest).map((p) => p.rawDate)).toEqual([
      "2025-12-31",
      "2026-01-01",
      "2026-04-15",
    ]);
  });
});

describe("빌드 스크립트와 런타임 설정 동기화", () => {
  it("routes.mjs 의 카테고리가 blogConfig.categoryList 와 일치한다", () => {
    expect(categoryKeys).toEqual(categoryList.map((c) => c.key));
  });

  it("모든 카테고리에 프리렌더 라우트가 있다", () => {
    const routes = new Set(staticRoutes.map((r) => r.route));
    for (const key of categoryKeys) {
      expect(routes.has(`/category/${key.toLowerCase()}`), `${key} 라우트 누락`).toBe(true);
    }
  });
});
