// @btl/core — 블로그 앱과 관리자 앱이 공유하는 도메인 계층.
// 앱은 개별 파일 경로가 아니라 이 배럴을 통해 import 합니다.

export type { PostMeta, PostData } from "./posts";
export { categories, samplePosts, byNewest, byOldest } from "./posts";

export { blogConfig, giscusConfig, categoryList, categoryMap, allCategoryKeys, allCategoryLabels, seriesList, seriesMap } from "./blogConfig";
export type { CategoryConfig, SeriesConfig } from "./blogConfig";

export { categoryStyles } from "./categoryConfig";

export { loadPostContent, loadAllPostContents, loadPostsFromFiles } from "./loadPosts";

export {
  getStoredPosts,
  getAllPosts,
  getPublishedPosts,
  savePost,
  deletePost,
  generateId,
  isAuthenticated,
  login,
  logout,
  saveInquiry,
  getInquiries,
  deleteInquiry,
  saveSubscriber,
  getSubscribers,
  deleteSubscriber,
} from "./postStorage";
export type { Inquiry } from "./postStorage";

export { cn, validateEmail, sanitizeHref, toIsoDate, formatDisplayDate } from "./utils";
