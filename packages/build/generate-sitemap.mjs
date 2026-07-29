import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { readPostsMeta } from "./posts.mjs";
import { postsDir, publicDir } from "./paths.mjs";
import { siteOrigin, basePath, routePath } from "./siteUrl.mjs";
import { staticRoutes } from "./routes.mjs";

const today = new Date().toISOString().slice(0, 10);

const posts = readPostsMeta(postsDir);

const urls = [
  ...staticRoutes.map(({ route }) => ({ loc: route, lastmod: today })),
  ...posts.map((post) => ({ loc: `/post/${post.id}`, lastmod: post.rawDate || today })),
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
