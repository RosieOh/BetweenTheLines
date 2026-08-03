// ── 포스트 메타데이터 단일 소스 ────────────────────────────────
// Vite 플러그인(plugins/vite-plugin-posts.mjs), sitemap 생성기,
// prerender 스크립트가 모두 이 모듈을 통해 포스트를 읽습니다.
// 파서가 한 벌만 존재하도록 하여 빌드 산출물 간 불일치를 막습니다.

import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const FRONTMATTER_RE = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]*([\s\S]*)$/;

/** 'a' | "a" 형태의 따옴표를 제거합니다. */
function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && /^['"]/.test(trimmed) && trimmed.at(-1) === trimmed[0]) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * 블로그가 쓰는 frontmatter 부분집합만 다루는 파서입니다.
 * (스칼라 / ['a', 'b'] 인라인 배열 — 중첩 구조나 멀티라인 스칼라는 미지원)
 */
export function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {}, content: raw };

  const [, block, content] = match;
  const data = {};

  for (const line of block.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    if (!key || key.startsWith("#")) continue;

    // 값에 콜론이 포함될 수 있으므로(제목 등) 첫 콜론 뒤 전체를 값으로 취합니다.
    const rawValue = line.slice(colonIdx + 1).trim();

    if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      data[key] = rawValue
        .slice(1, -1)
        .split(",")
        .map(unquote)
        .filter(Boolean);
    } else {
      data[key] = unquote(rawValue);
    }
  }

  return { data, content };
}

/** 한국어 본문 기준 분당 500자로 읽기 시간을 추정합니다. */
export function estimateReadTime(content) {
  const chars = content.replace(/\s+/g, "").length;
  return `${Math.max(1, Math.round(chars / 500))}분`;
}

/** ISO(YYYY-MM-DD) → 화면 표기용 'YYYY. MM. DD.' */
export function formatDisplayDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}. ${mm}. ${dd}.`;
}

/** ISO(YYYY-MM-DD)로 정규화합니다. 파싱 실패 시 빈 문자열. */
function toIsoDate(value) {
  if (!value) return "";
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function walkMdxFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return walkMdxFiles(fullPath);
    // basename을 쓰므로 구분자가 OS별로 달라도 안전합니다.
    return entry.isFile() && entry.name.endsWith(".mdx") ? [fullPath] : [];
  });
}

/**
 * postsDir 아래의 모든 .mdx를 읽어 메타데이터를 만듭니다.
 * `content`는 포함하지 않습니다 — 본문은 런타임에 청크로 분리 로드됩니다.
 * 최신 글이 먼저 오도록 rawDate 내림차순 정렬됩니다.
 */
export function readPostsMeta(postsDir) {
  const metas = walkMdxFiles(postsDir).map((filePath) => {
    const raw = readFileSync(filePath, "utf8");
    const { data, content } = parseFrontmatter(raw);
    const id = basename(filePath, ".mdx");
    const rawDate = toIsoDate(data.date);

    return {
      id,
      title: String(data.title ?? ""),
      excerpt: String(data.description ?? data.excerpt ?? ""),
      category: String(data.category ?? "SpringBoot"),
      author: String(data.author ?? "오태훈"),
      rawDate,
      date: rawDate ? formatDisplayDate(rawDate) : String(data.date ?? ""),
      readTime: String(data.readTime ?? estimateReadTime(content)),
      thumbnail: String(data.thumbnail ?? "architecture"),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      ...(data.series ? { series: String(data.series) } : {}),
      ...(data.seriesOrder ? { seriesOrder: Number(data.seriesOrder) } : {}),
      ...(data.seriesLabel ? { seriesLabel: String(data.seriesLabel) } : {}),
    };
  });

  const duplicates = metas
    .map((m) => m.id)
    .filter((id, i, all) => all.indexOf(id) !== i);
  if (duplicates.length > 0) {
    // id는 라우트(/post/:id) 키이므로 충돌하면 글이 조용히 가려집니다.
    throw new Error(
      `중복된 포스트 id가 있습니다: ${[...new Set(duplicates)].join(", ")}. ` +
        `파일명(확장자 제외)은 content/posts 전체에서 유일해야 합니다.`
    );
  }

  return metas.sort((a, b) => b.rawDate.localeCompare(a.rawDate));
}
