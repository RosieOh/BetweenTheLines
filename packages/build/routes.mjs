// 프리렌더 / sitemap 이 공유하는 정적 라우트 목록입니다.
// 카테고리는 blog 설정과 어긋나지 않도록 여기서 한 번만 정의합니다.

import { blogMeta } from "./blogMeta.mjs";

/** src/lib/blogConfig.ts 의 categoryList 와 key가 일치해야 합니다. */
export const categoryKeys = ["SpringBoot", "DataAnalysis", "Frontend", "DevOps", "회고"];

export const staticRoutes = [
  {
    route: "/",
    title: `${blogMeta.name} | ${blogMeta.tagline}`,
    description: blogMeta.description,
  },
  {
    route: "/about",
    title: `소개 | ${blogMeta.name}`,
    description: `${blogMeta.author.name} 소개 — ${blogMeta.author.bio}`,
  },
  {
    route: "/engineering",
    title: `엔지니어링 | ${blogMeta.name}`,
    description: "엔지니어링 관련 기록을 모아둔 페이지입니다.",
  },
  {
    route: "/newsletter",
    title: `뉴스레터 | ${blogMeta.name}`,
    description: "새 글이 올라오면 메일로 받아보세요.",
  },
  {
    route: "/search",
    title: `검색 | ${blogMeta.name}`,
    description: "아티클 제목, 태그, 내용, 저자 이름으로 검색할 수 있습니다.",
  },
  {
    route: "/category/all",
    title: `전체 아티클 | ${blogMeta.name}`,
    description: "전체 카테고리의 모든 글입니다.",
  },
  ...categoryKeys.map((key) => ({
    route: `/category/${key.toLowerCase()}`,
    title: `${key} | ${blogMeta.name}`,
    description: `${key} 카테고리의 아티클 모음입니다.`,
  })),
];
