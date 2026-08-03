import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { resolveLanguage } from "../apps/blog/src/lib/syntaxHighlighter";

const POSTS_DIR = join(process.cwd(), "content", "posts");

function walkMdx(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walkMdx(full);
    return entry.isFile() && entry.name.endsWith(".mdx") ? [full] : [];
  });
}

/** 글에서 실제로 쓰는 코드 펜스 언어 → 그 언어를 쓰는 파일들 */
function fenceLanguages(): Map<string, string[]> {
  const byLang = new Map<string, string[]>();

  for (const path of walkMdx(POSTS_DIR)) {
    const raw = readFileSync(path, "utf8");
    const name = path.slice(path.lastIndexOf("\\") + 1).replace(/\.mdx$/, "");

    for (const match of raw.matchAll(/^```([a-zA-Z0-9+#-]+)[ \t]*$/gm)) {
      const lang = match[1].toLowerCase();
      const files = byLang.get(lang) ?? [];
      if (!files.includes(name)) files.push(name);
      byLang.set(lang, files);
    }
  }
  return byLang;
}

describe("코드 하이라이터 언어 등록", () => {
  const languages = fenceLanguages();

  it("글에서 코드 펜스를 실제로 쓰고 있다", () => {
    expect(languages.size).toBeGreaterThan(0);
  });

  it("사용 중인 모든 펜스 언어가 등록돼 있다", () => {
    // 등록되지 않으면 하이라이팅 없이 평문으로 렌더됩니다 — 조용한 실패라 테스트로 막습니다.
    const missing = [...languages]
      .filter(([lang]) => lang !== "text" && resolveLanguage(lang) === "text")
      .map(([lang, files]) => `${lang} (사용: ${files.join(", ")})`);

    expect(missing, `미등록 언어:\n  ${missing.join("\n  ")}`).toEqual([]);
  });

  it("별칭도 그대로 해석된다", () => {
    for (const alias of ["ts", "tsx", "js", "jsx", "yml", "sh", "py", "md", "dockerfile", "html"]) {
      expect(resolveLanguage(alias), `${alias} 미등록`).toBe(alias);
    }
  });

  it("모르는 언어는 평문으로 떨어뜨린다", () => {
    expect(resolveLanguage("brainfuck")).toBe("text");
    expect(resolveLanguage("")).toBe("text");
  });
});
