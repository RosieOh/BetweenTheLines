import type { PostData } from "@/data/posts";

import thumbArchitecture from "@/assets/thumb-architecture.jpg";
import thumbAiReview from "@/assets/thumb-ai-review.jpg";
import thumbCommunication from "@/assets/thumb-communication.jpg";
import thumbSecurity from "@/assets/thumb-security.jpg";
import thumbCicd from "@/assets/thumb-cicd.jpg";

const thumbnailMap: Record<string, string> = {
  architecture: thumbArchitecture,
  ai: thumbAiReview,
  communication: thumbCommunication,
  security: thumbSecurity,
  cicd: thumbCicd,
};

// Vite import.meta.glob으로 src/posts/*.mdx를 raw 문자열로 로드
const rawFiles = import.meta.glob("../posts/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// gray-matter 없이 브라우저에서 동작하는 간단한 frontmatter 파서
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]*([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, unknown> = {};

  for (const line of yamlBlock.split(/\r?\n/)) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const rawVal = line.slice(colonIdx + 1).trim();

    if (!key) continue;

    // 배열: ['a', 'b'] 또는 ["a", "b"]
    if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
      data[key] = rawVal
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    } else {
      // 따옴표 제거
      data[key] = rawVal.replace(/^['"]|['"]$/g, "");
    }
  }

  return { data, content };
}

function formatDate(raw: unknown): string {
  if (!raw) return "";
  const str = String(raw).trim();
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}.`;
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))}분`;
}

export function loadPostsFromFiles(): PostData[] {
  return Object.entries(rawFiles)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw);
      const id = path.split("/").pop()?.replace(".mdx", "") ?? "";

      return {
        id,
        title: String(data.title ?? ""),
        excerpt: String(data.description ?? data.excerpt ?? ""),
        category: String(data.category ?? "SpringBoot"),
        author: String(data.author ?? "오태훈"),
        date: formatDate(data.date),
        readTime: String(data.readTime ?? estimateReadTime(content)),
        thumbnail: thumbnailMap[String(data.thumbnail ?? "architecture")] ?? thumbArchitecture,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        content: content.trim(),
        series: data.series ? String(data.series) : undefined,
        seriesOrder: data.seriesOrder ? Number(data.seriesOrder) : undefined,
        seriesLabel: data.seriesLabel ? String(data.seriesLabel) : undefined,
      } satisfies PostData;
    })
    .sort((a, b) => {
      const da = a.date.replace(/\. /g, "-").replace(/\.$/, "").trim();
      const db = b.date.replace(/\. /g, "-").replace(/\.$/, "").trim();
      return new Date(db).getTime() - new Date(da).getTime();
    });
}
