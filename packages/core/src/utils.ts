import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// URL 스킴은 ASCII로만 이루어지므로, 검사 전에 출력 불가능한 문자를 전부 걷어냅니다.
// `java<TAB>script:` 처럼 스킴 중간에 제어문자를 끼워 넣는 우회를 막기 위한 처리입니다.
// (`!`=0x21 ~ `~`=0x7e 바깥은 모두 제거 — 검사용 사본에만 적용하고 반환값은 원본입니다.)
const NON_PRINTABLE = /[^!-~]/g;
const DANGEROUS_SCHEME = /^(javascript|data|vbscript):/;

export function sanitizeHref(href?: string): string | undefined {
  if (!href) return undefined;
  const trimmed = href.trim();
  if (DANGEROUS_SCHEME.test(trimmed.replace(NON_PRINTABLE, "").toLowerCase())) {
    return undefined;
  }
  return trimmed;
}

/** Date → 로컬 기준 ISO 날짜 'YYYY-MM-DD' (UTC 변환으로 하루 밀리는 것 방지) */
export function toIsoDate(date: Date = new Date()): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

/** ISO 'YYYY-MM-DD' → 화면 표기용 'YYYY. MM. DD.' */
export function formatDisplayDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, y, m, d] = match;
  return `${y}. ${m}. ${d}.`;
}
