import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { readPostsMeta } from "./posts.mjs";
import { postsDir, publicDir } from "./paths.mjs";
import { siteOrigin, basePath, routePath } from "./siteUrl.mjs";
import { staticRoutes } from "./routes.mjs";

const posts = readPostsMeta(postsDir);

// 목록/정적 페이지의 "마지막 변경"은 빌드한 날이 아니라 최신 글이 올라온 날입니다.
// 빌드일을 쓰면 내용이 그대로여도 매일 sitemap 이 바뀝니다.
const latestPostDate = posts[0]?.rawDate || new Date().toISOString().slice(0, 10);

const urls = [
  ...staticRoutes.map(({ route }) => ({ loc: route, lastmod: latestPostDate })),
  ...posts.map((post) => ({ loc: `/post/${post.id}`, lastmod: post.rawDate || latestPostDate })),
];

function priorityFor(loc) {
  if (loc === "/") return "1.0";
  return loc.startsWith("/post/") ? "0.8" : "0.7";
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) => `  <url>
    <loc>${siteOrigin}${routePath(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${loc === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${priorityFor(loc)}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(publicDir, "sitemap.xml"), xml, "utf8");

const robots = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
Disallow: ${routePath("/admin")}

Sitemap: ${siteOrigin}${routePath("/sitemap.xml")}
`;

writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");

console.log(
  `sitemap.xml (${urls.length} URLs) / robots.txt 생성 완료 — ${siteOrigin}${basePath}`
);
