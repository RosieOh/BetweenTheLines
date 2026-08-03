import { describe, it, expect, beforeEach } from "vitest";
import { getAllPosts, getPublishedPosts, savePost, deletePost } from "@btl/core";
import { samplePosts } from "@btl/core";
import type { PostData } from "@btl/core";

const POSTS_KEY = "rosie_blog_posts";

function makePost(overrides: Partial<PostData> = {}): PostData {
  return {
    id: "admin_test_1",
    title: "테스트 글",
    excerpt: "요약",
    category: "SpringBoot",
    author: "오태훈",
    rawDate: "2030-01-01",
    date: "2030. 01. 01.",
    thumbnail: "/thumb.jpg",
    tags: ["Test"],
    readTime: "1분",
    content: "본문",
    status: "published",
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  // getAllPosts 는 캐시를 쓰므로 쓰기 경로를 통해 무효화합니다.
  savePost(makePost({ id: "__warmup__" }));
  deletePost("__warmup__");
});

describe("getAllPosts", () => {
  it("파일 기반 글과 저장된 글을 합쳐 최신순으로 돌려준다", () => {
    savePost(makePost());
    const all = getAllPosts();

    expect(all.length).toBe(samplePosts.length + 1);
    // rawDate 2030 이므로 맨 앞에 와야 합니다.
    expect(all[0].id).toBe("admin_test_1");
  });

  it("쓰기 후 캐시가 무효화된다", () => {
    const before = getAllPosts().length;
    savePost(makePost({ id: "admin_test_2" }));
    expect(getAllPosts().length).toBe(before + 1);

    deletePost("admin_test_2");
    expect(getAllPosts().length).toBe(before);
  });
});

describe("getPublishedPosts", () => {
  it("draft 를 제외한다", () => {
    savePost(makePost({ id: "admin_draft", status: "draft" }));
    expect(getAllPosts().some((p) => p.id === "admin_draft")).toBe(true);
    expect(getPublishedPosts().some((p) => p.id === "admin_draft")).toBe(false);
  });
});

describe("레거시 데이터 보정", () => {
  it("rawDate 가 없는 저장 글은 date 표기에서 복원한다", () => {
    const legacy = { ...makePost({ id: "legacy_1" }) } as Partial<PostData>;
    delete legacy.rawDate;
    localStorage.setItem(POSTS_KEY, JSON.stringify([legacy]));

    const found = getAllPosts().find((p) => p.id === "legacy_1");
    expect(found?.rawDate).toBe("2030-01-01");
  });

  it("깨진 JSON 이면 파일 기반 글만 돌려준다", () => {
    localStorage.setItem(POSTS_KEY, "{ 깨진 JSON");
    expect(getAllPosts().length).toBe(samplePosts.length);
  });
});
