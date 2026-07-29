import { samplePosts, byNewest } from "@/data/posts";
import type { PostData } from "@/data/posts";
import { toIsoDate } from "@/lib/utils";

const POSTS_KEY = "rosie_blog_posts";
const AUTH_KEY = "rosie_blog_auth";
// NOTE: frontend-only demo — no real access control
const ADMIN_PASSWORD = "rosie2025";

const INQUIRIES_KEY = "rosie_blog_inquiries";
const SUBSCRIBERS_KEY = "rosie_blog_subscribers";

/** localStorage 접근을 한 곳으로 모아 파싱 실패를 조용히 삼키지 않도록 합니다. */
function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (err) {
    console.warn(`[postStorage] "${key}" 를 읽지 못했습니다. 기본값을 사용합니다.`, err);
    return fallback;
  }
}

function writeJson(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // 사파리 프라이빗 모드 / 용량 초과 등에서 발생합니다.
    console.warn(`[postStorage] "${key}" 를 저장하지 못했습니다.`, err);
    return false;
  }
}

// ── Storage CRUD ──────────────────────────────────────────

/**
 * 저장된 포스트에 rawDate가 없으면(구버전 데이터) date 표기에서 복원합니다.
 * rawDate는 모든 정렬의 단일 기준이라 비어 있으면 목록 순서가 무너집니다.
 */
function normalizeStored(post: PostData): PostData {
  if (post.rawDate) return post;
  const fromDisplay = post.date?.replace(/\s/g, "").replace(/\.$/, "").replace(/\./g, "-");
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(fromDisplay ?? "");
  return { ...post, rawDate: isValid ? fromDisplay : toIsoDate() };
}

export function getStoredPosts(): PostData[] {
  return readJson<PostData[]>(POSTS_KEY, []).map(normalizeStored);
}

/**
 * 파일 기반 글 + 관리자가 저장한 글의 병합 결과.
 * 렌더마다 localStorage를 다시 파싱하지 않도록 캐싱하고, 쓰기 시점에만 비웁니다.
 */
let mergedCache: PostData[] | null = null;

export function getAllPosts(): PostData[] {
  if (!mergedCache) {
    mergedCache = [...samplePosts, ...getStoredPosts()].sort(byNewest);
  }
  return mergedCache;
}

/** 공개용: draft 제외 */
export function getPublishedPosts(): PostData[] {
  return getAllPosts().filter((p) => p.status !== "draft");
}

function invalidatePostsCache(): void {
  mergedCache = null;
}

export function savePost(post: PostData): void {
  const posts = getStoredPosts();
  const idx = posts.findIndex((p) => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.push(post);
  }
  writeJson(POSTS_KEY, posts);
  invalidatePostsCache();
}

export function deletePost(id: string): void {
  writeJson(POSTS_KEY, getStoredPosts().filter((p) => p.id !== id));
  invalidatePostsCache();
}

export function generateId(): string {
  return `admin_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ── Auth ──────────────────────────────────────────────────

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

// ── Contact inquiries ─────────────────────────────────────

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  date: string;
}

export function saveInquiry(data: Omit<Inquiry, "id" | "date">): boolean {
  const stored = getInquiries();
  stored.push({ ...data, id: Date.now().toString(), date: new Date().toISOString() });
  return writeJson(INQUIRIES_KEY, stored);
}

export function getInquiries(): Inquiry[] {
  return readJson<Inquiry[]>(INQUIRIES_KEY, []);
}

export function deleteInquiry(id: string): void {
  writeJson(INQUIRIES_KEY, getInquiries().filter((i) => i.id !== id));
}

// ── Newsletter subscribers ────────────────────────────────

export function saveSubscriber(email: string): boolean {
  const stored = getSubscribers();
  if (stored.includes(email)) return false;
  stored.push(email);
  return writeJson(SUBSCRIBERS_KEY, stored);
}

export function getSubscribers(): string[] {
  return readJson<string[]>(SUBSCRIBERS_KEY, []);
}

export function deleteSubscriber(email: string): void {
  writeJson(SUBSCRIBERS_KEY, getSubscribers().filter((e) => e !== email));
}
