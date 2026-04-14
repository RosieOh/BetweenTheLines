import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const POSTS_DIR = join(ROOT, "src", "posts");
const PUBLIC_DIR = join(ROOT, "public");
const SITE_URL = (process.env.SITE_URL || "https://between-the-lines.blog").replace(/\/+$/, "");

const staticRoutes = ["/", "/engineering", "/about", "/newsletter", "/search"];

function parseDate(raw) {
  const match = raw.match(/^date:\s*['"]?([^'"\n]+)['"]?/m);
  return match?.[1] ?? null;
}

function toIsoDate(dateLike) {
  if (!dateLike) return new Date().toISOString().slice(0, 10);
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function walkMdxFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return walkMdxFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith(".mdx")) return [fullPath];
    return [];
  });
}

const postFiles = walkMdxFiles(POSTS_DIR);
const postRoutes = postFiles.map((fullPath) => {
  const id = fullPath.split("/").pop().replace(/\.mdx$/, "");
  const raw = readFileSync(fullPath, "utf8");
  return {
    loc: `/post/${id}`,
    lastmod: toIsoDate(parseDate(raw)),
  };
});

const urls = [
  ...staticRoutes.map((route) => ({ loc: route, lastmod: new Date().toISOString().slice(0, 10) })),
  ...postRoutes,
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, lastmod }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${loc === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${loc === "/" ? "1.0" : loc.startsWith("/post/") ? "0.8" : "0.7"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap.xml with ${urls.length} URLs`);
