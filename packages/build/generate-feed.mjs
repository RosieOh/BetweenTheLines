// ── RSS 2.0 피드 생성 ──────────────────────────────────────────
// 블로그의 유일한 구독 수단입니다. sitemap 과 같은 메타데이터를 쓰므로
// 글을 추가하면 자동으로 따라옵니다.

import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { readPostsMeta } from "./posts.mjs";
import { blogMeta } from "./blogMeta.mjs";
import { siteOrigin, absoluteUrl } from "./siteUrl.mjs";
import { postsDir, publicDir } from "./paths.mjs";

/** 피드에 담을 최근 글 수. 전체를 넣으면 파일이 계속 커집니다. */
const FEED_LIMIT = 20;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** 'YYYY-MM-DD' → RFC 822 (RSS 명세가 요구하는 형식) */
function toRfc822(isoDate) {
  const d = new Date(`${isoDate}T09:00:00+09:00`);
  return Number.isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

const posts = readPostsMeta(postsDir).slice(0, FEED_LIMIT);
const lastBuild = posts[0]?.rawDate ?? new Date().toISOString().slice(0, 10);

const items = posts
  .map((post) => {
    const url = absoluteUrl(`/post/${post.id}`);
    const categories = [post.category, ...post.tags]
      .map((c) => `      <category>${escapeXml(c)}</category>`)
      .join("\n");

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <author>${escapeXml(blogMeta.author.email)} (${escapeXml(post.author)})</author>
      <pubDate>${toRfc822(post.rawDate)}</pubDate>
${categories}
    </item>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(blogMeta.name)}</title>
    <link>${escapeXml(absoluteUrl("/"))}</link>
    <description>${escapeXml(blogMeta.description)}</description>
    <language>ko</language>
    <copyright>${escapeXml(blogMeta.copyright)}</copyright>
    <managingEditor>${escapeXml(blogMeta.author.email)} (${escapeXml(blogMeta.author.name)})</managingEditor>
    <lastBuildDate>${toRfc822(lastBuild)}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

writeFileSync(join(publicDir, "feed.xml"), xml, "utf8");
console.log(`feed.xml 생성 완료 — 최근 ${posts.length}편 (${siteOrigin})`);
