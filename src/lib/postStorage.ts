import { samplePosts } from "@/data/posts";
import type { PostData } from "@/data/posts";

const POSTS_KEY = "hyperwise_admin_posts";
const AUTH_KEY = "hyperwise_admin_auth";
// NOTE: frontend-only demo — no real access control
const ADMIN_PASSWORD = "hyperwise2026";

const INQUIRIES_KEY = "hyperwise_inquiries";
const SUBSCRIBERS_KEY = "hyperwise_subscribers";

// ── Storage CRUD ──────────────────────────────────────────

export function getStoredPosts(): PostData[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getAllPosts(): PostData[] {
  return [...samplePosts, ...getStoredPosts()];
}

export function savePost(post: PostData): void {
  const posts = getStoredPosts();
  const idx = posts.findIndex((p) => p.id === post.id);
  if (idx >= 0) {
    posts[idx] = post;
  } else {
    posts.push(post);
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function deletePost(id: string): void {
  const posts = getStoredPosts().filter((p) => p.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
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

export function saveInquiry(data: Omit<Inquiry, "id" | "date">): void {
  try {
    const stored: Inquiry[] = JSON.parse(localStorage.getItem(INQUIRIES_KEY) || "[]");
    stored.push({ ...data, id: Date.now().toString(), date: new Date().toISOString() });
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(stored));
  } catch {}
}

export function getInquiries(): Inquiry[] {
  try {
    return JSON.parse(localStorage.getItem(INQUIRIES_KEY) || "[]");
  } catch {
    return [];
  }
}

// ── Newsletter subscribers ────────────────────────────────

export function saveSubscriber(email: string): boolean {
  try {
    const stored: string[] = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || "[]");
    if (stored.includes(email)) return false; // already subscribed
    stored.push(email);
    localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}

export function getSubscribers(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || "[]");
  } catch {
    return [];
  }
}
