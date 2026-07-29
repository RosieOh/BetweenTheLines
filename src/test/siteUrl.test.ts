import { describe, it, expect } from "vitest";
import { resolveSiteUrl } from "../../scripts/siteUrl.mjs";

describe("resolveSiteUrl", () => {
  it("프로젝트 경로 배포에서 base 를 붙인다", () => {
    const { routePath, absoluteUrl } = resolveSiteUrl({
      SITE_ORIGIN: "https://rosieoh.github.io",
      VITE_BASE_PATH: "/BetweenTheLines/",
    });

    expect(routePath("/")).toBe("/BetweenTheLines/");
    expect(routePath("/post/35")).toBe("/BetweenTheLines/post/35");
    expect(absoluteUrl("/post/35")).toBe("https://rosieoh.github.io/BetweenTheLines/post/35");
    expect(absoluteUrl("/sitemap.xml")).toBe("https://rosieoh.github.io/BetweenTheLines/sitemap.xml");
  });

  it("커스텀 도메인(base=/) 에서는 접두사가 붙지 않는다", () => {
    const { routePath, absoluteUrl } = resolveSiteUrl({
      SITE_ORIGIN: "https://between-the-lines.blog",
      VITE_BASE_PATH: "/",
    });

    expect(routePath("/")).toBe("/");
    expect(routePath("/post/35")).toBe("/post/35");
    expect(absoluteUrl("/post/35")).toBe("https://between-the-lines.blog/post/35");
  });

  it("base 에 슬래시가 빠져 있어도 정규화한다", () => {
    expect(resolveSiteUrl({ VITE_BASE_PATH: "BetweenTheLines" }).basePath).toBe("/BetweenTheLines/");
    expect(resolveSiteUrl({ VITE_BASE_PATH: "/BetweenTheLines" }).basePath).toBe("/BetweenTheLines/");
  });

  it("origin 끝의 슬래시를 제거해 URL 이 겹치지 않게 한다", () => {
    const { absoluteUrl } = resolveSiteUrl({
      SITE_ORIGIN: "https://example.com/",
      VITE_BASE_PATH: "/",
    });
    expect(absoluteUrl("/about")).toBe("https://example.com/about");
  });

  it("env 가 비어 있으면 기본값(프로젝트 사이트 origin, base=/)을 쓴다", () => {
    const { siteOrigin, basePath } = resolveSiteUrl({});
    expect(siteOrigin).toBe("https://rosieoh.github.io");
    expect(basePath).toBe("/");
  });
});
