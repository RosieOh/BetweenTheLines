// 카테고리별 뱃지 스타일 — BlogArticleCard 등에서 사용
// 카테고리 추가/수정은 src/lib/blogConfig.ts 의 categoryList 를 수정하세요.
export const categoryStyles: Record<string, string> = {
  SpringBoot: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  DataAnalysis: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Frontend: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  DevOps: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  회고: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};
