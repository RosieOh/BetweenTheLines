import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitizeHref(href?: string): string | undefined {
  if (!href) return undefined;
  if (/^javascript:/i.test(href.trim())) return undefined;
  if (/^data:/i.test(href.trim())) return undefined;
  return href;
}

