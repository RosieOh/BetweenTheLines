// ── 블로그 전체 설정 파일 ──────────────────────────────────────
// 이 파일에서 블로그 이름, 소개, 저자, 카테고리를 자유롭게 수정하세요.

export const blogConfig = {
  name: "Between the Lines",
  tagline: "오늘을 새롭게 내일을 이롭게 기록합니다.",
  description: "기록하는 개발자 오태훈의 기술 블로그입니다.",
  siteUrl: "https://between-the-lines.blog",
  author: {
    name: "오태훈",
    nickname: "RosieOh",
    email: "dhxogns920@gmail.com",
    github: "https://github.com/RosieOh",
    bio: "얻은 지식을 프로젝트에 적용하고, 기록하는 습관으로 배운 것을 남기는 개발자입니다.",
  },
  copyright: "© 2025 Between the Lines. All rights reserved.",
} as const;

export const giscusConfig = {
  repo: "RosieOh/RosieTechBlog",
  repoId: import.meta.env.VITE_GISCUS_REPO_ID ?? "",
  category: "Announcements",
  categoryId: import.meta.env.VITE_GISCUS_CATEGORY_ID ?? "",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  theme: "preferred_color_scheme",
  lang: "ko",
} as const;

// ── 카테고리 설정 ─────────────────────────────────────────────
// 카테고리를 추가/제거하려면 이 배열을 수정하세요.
// label: 화면에 표시될 이름
// description: 카테고리 설명
// color / textColor / bg / border: Tailwind 클래스

export interface CategoryConfig {
  key: string;
  label: string;
  description: string;
  badgeClass: string;   // 아티클 카드 뱃지용
  color: string;        // dot / progress bar
  textColor: string;    // 제목 텍스트
  bg: string;           // 헤더 배경
  border: string;       // 헤더 테두리
}

export const categoryList: CategoryConfig[] = [
  {
    key: "SpringBoot",
    label: "Spring Boot",
    description: "스프링부트를 마스터하기 위한 실전 기록들",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    color: "bg-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    key: "DataAnalysis",
    label: "Data Analysis",
    description: "데이터 분석과 머신러닝 실전 경험",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    color: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/10",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  {
    key: "Frontend",
    label: "Frontend",
    description: "React, Vite, TypeScript 등 프론트엔드 개발 경험",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    color: "bg-violet-500",
    textColor: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/10",
    border: "border-violet-200 dark:border-violet-800",
  },
  {
    key: "DevOps",
    label: "DevOps",
    description: "CI/CD, 배포, 인프라 자동화 경험",
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    color: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    key: "회고",
    label: "회고",
    description: "프로젝트 회고, 공모전 후기, 성장 기록",
    badgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    color: "bg-rose-500",
    textColor: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/10",
    border: "border-rose-200 dark:border-rose-800",
  },
];

// 카테고리 key → config 빠른 조회
export const categoryMap: Record<string, CategoryConfig> = Object.fromEntries(
  categoryList.map((c) => [c.key, c])
);

// "전체" 포함 전체 카테고리 배열 (필터 탭용)
export const allCategoryKeys = ["전체", ...categoryList.map((c) => c.key)];
export const allCategoryLabels = ["전체", ...categoryList.map((c) => c.label)];
