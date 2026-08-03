import { describe, it, expect } from "vitest";
import { findSeriesPosition, samplePosts, seriesList, giscusConfig } from "@btl/core";
import type { PostMeta } from "@btl/core";

const bySeries = (key: string) => samplePosts.filter((p) => p.series === key);

describe("findSeriesPosition", () => {
  it("시리즈의 첫 글에는 이전 편이 없다", () => {
    const posts = bySeries("friday-series").sort(
      (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)
    );
    const pos = findSeriesPosition(posts[0], samplePosts);

    expect(pos).not.toBeNull();
    expect(pos!.index).toBe(0);
    expect(pos!.previous).toBeUndefined();
    expect(pos!.next?.id).toBe(posts[1].id);
  });

  it("시리즈의 마지막 글에는 다음 편이 없다", () => {
    const posts = bySeries("friday-series").sort(
      (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)
    );
    const last = posts[posts.length - 1];
    const pos = findSeriesPosition(last, samplePosts);

    expect(pos!.index).toBe(posts.length - 1);
    expect(pos!.next).toBeUndefined();
    expect(pos!.previous?.id).toBe(posts[posts.length - 2].id);
  });

  it("중간 글은 앞뒤가 모두 있고 seriesOrder 순서를 따른다", () => {
    const posts = bySeries("storyg-realworld-series").sort(
      (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)
    );
    const middle = posts[3];
    const pos = findSeriesPosition(middle, samplePosts)!;

    expect(pos.previous?.id).toBe(posts[2].id);
    expect(pos.next?.id).toBe(posts[4].id);
    expect(pos.posts.map((p) => p.seriesOrder)).toEqual(
      [...pos.posts.map((p) => p.seriesOrder)].sort((a, b) => (a ?? 0) - (b ?? 0))
    );
  });

  it("시리즈가 없는 글은 null 을 돌려준다", () => {
    const standalone = samplePosts.find((p) => !p.series);
    expect(standalone, "시리즈 없는 글이 하나는 있어야 합니다").toBeDefined();
    expect(findSeriesPosition(standalone!, samplePosts)).toBeNull();
  });

  it("혼자뿐인 시리즈는 이동할 곳이 없으므로 null 이다", () => {
    const solo: PostMeta = { ...samplePosts[0], id: "solo", series: "solo-series", seriesOrder: 1 };
    expect(findSeriesPosition(solo, [solo])).toBeNull();
  });

  it("정의된 모든 시리즈에서 앞뒤 이동이 끊기지 않는다", () => {
    for (const series of seriesList) {
      const posts = bySeries(series.key).sort(
        (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)
      );
      if (posts.length < 2) continue;

      // 첫 글에서 next 를 계속 따라가면 마지막 글에 도달해야 합니다.
      let cursor = findSeriesPosition(posts[0], samplePosts)!;
      let hops = 1;
      while (cursor.next) {
        cursor = findSeriesPosition(cursor.next, samplePosts)!;
        hops += 1;
      }
      expect(hops, `${series.key}: 이동 체인이 끊김`).toBe(posts.length);
    }
  });
});

describe("giscus 설정", () => {
  it("댓글이 활성화될 수 있는 값이 채워져 있다", () => {
    // 예전에는 env 전용이라 CI 에 값이 없으면 배포본에서 댓글이 통째로 사라졌습니다.
    expect(giscusConfig.repoId).not.toBe("");
    expect(giscusConfig.categoryId).not.toBe("");
  });

  it("댓글 저장소가 이 블로그 저장소를 가리킨다", () => {
    expect(giscusConfig.repo).toBe("RosieOh/BetweenTheLines");
  });
});
