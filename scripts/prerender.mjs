// ── 라우트별 정적 HTML 생성 ────────────────────────────────────
// SPA는 메타 태그를 JS 실행 후에 주입하므로, JS를 실행하지 않는 크롤러
// (Twitterbot / facebookexternalhit / 카카오톡 등)에는 전부 같은 기본 OG가
// 보입니다. 빌드 후 라우트마다 index.html 사본을 만들고 해당 글의
// title/description/OG/JSON-LD 를 미리 박아 넣어 이 문제를 해결합니다.
//
// 범위: <head> 메타데이터 + <noscript> 요약. 본문 HTML까지 렌더하는 완전한
// SSR은 아닙니다 (localStorage/IntersectionObserver 의존 코드가 있어
// 하이드레이션 리스크가 큽니다). 공유 카드와 검색엔진 스니펫에는 충분합니다.

import { mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { readPostsMeta } from "./posts.mjs";
import { blogMeta } from "./blogMeta.mjs";
import { absoluteUrl, routePath } from "./siteUrl.mjs";
import { staticRoutes } from "./routes.mjs";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");
const POSTS_DIR = join(ROOT, "src", "posts");

const template = readFileSync(join(DIST, "index.html"), "utf8");

/** 빌드 산출물에서 썸네일 파일명(해시 포함)을 찾아 절대 URL로 만듭니다. */
const assetFiles = (() => {
  try {
    return readdirSync(join(DIST, "assets"));
  } catch {
    return [];
  }
})();

function thumbnailUrl(key) {
  const match = assetFiles.find((f) => f.startsWith(`thumb-${key}-`) || f.startsWith(`thumb-${key}.`));
  return match ? absoluteUrl(`/assets/${match}`) : absoluteUrl("/favicon.ico");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 템플릿의 <head>에서 기존 title/description/og/twitter 태그를 걷어냅니다. */
function stripDefaultMeta(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "");
}

function renderHead({ title, description, url, image, type, jsonLd }) {
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(blogMeta.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:locale" content="ko_KR" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  ];

  if (jsonLd) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`
    );
  }

  return tags.join("\n    ");
}

/** JS가 꺼진 환경에서도 최소한의 내용이 남도록 합니다. */
function renderNoscript({ title, description, extra = "" }) {
  return `<noscript><article><h1>${escapeHtml(title)}</h1><p>${escapeHtml(
    description
  )}</p>${extra}<p><a href="${routePath("/")}">${escapeHtml(blogMeta.name)} 홈으로</a></p></article></noscript>`;
}

function buildPage({ route, head, noscript }) {
  let html = stripDefaultMeta(template);
  html = html.replace("</head>", `  ${head}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n    ${noscript}`);

  const outDir = route === "/" ? DIST : join(DIST, route.replace(/^\//, ""));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html, "utf8");
  return join(outDir, "index.html");
}

// ── 정적 라우트 ────────────────────────────────────────────────
let written = 0;

for (const page of staticRoutes) {
  const url = absoluteUrl(page.route);
  buildPage({
    route: page.route,
    head: renderHead({
      title: page.title,
      description: page.description,
      url,
      image: absoluteUrl("/favicon.ico"),
      type: "website",
      jsonLd:
        page.route === "/"
          ? {
              "@context": "https://schema.org",
              "@type": "Blog",
              name: blogMeta.name,
              description: blogMeta.description,
              url,
              author: { "@type": "Person", name: blogMeta.author.name },
            }
          : null,
    }),
    noscript: renderNoscript({ title: page.title, description: page.description }),
  });
  written += 1;
}

// ── 포스트 라우트 ──────────────────────────────────────────────
const posts = readPostsMeta(POSTS_DIR);

for (const post of posts) {
  const url = absoluteUrl(`/post/${post.id}`);
  const image = thumbnailUrl(post.thumbnail);

  buildPage({
    route: `/post/${post.id}`,
    head: renderHead({
      title: `${post.title} | ${blogMeta.name}`,
      description: post.excerpt,
      url,
      image,
      type: "article",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image,
        datePublished: post.rawDate,
        dateModified: post.rawDate,
        author: { "@type": "Person", name: post.author },
        publisher: { "@type": "Organization", name: blogMeta.name },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        keywords: post.tags.join(", "),
        articleSection: post.category,
      },
    }),
    noscript: renderNoscript({
      title: post.title,
      description: post.excerpt,
      extra: `<p>${escapeHtml(post.author)} · ${escapeHtml(post.date)} · ${escapeHtml(post.readTime)}</p>`,
    }),
  });
  written += 1;
}

// GitHub Pages SPA 폴백 — 프리렌더되지 않은 경로(/tag/*, /category/* 등)용
writeFileSync(join(DIST, "404.html"), readFileSync(join(DIST, "index.html"), "utf8"), "utf8");

console.log(`프리렌더 완료: ${written}개 라우트 (포스트 ${posts.length}개 포함) + 404.html`);
