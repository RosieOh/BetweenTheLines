// ── 코드 하이라이터 (경량 빌드) ────────────────────────────────
// `Prism` 풀 빌드는 refractor의 전 언어 정의를 끌고 와 상세 페이지 청크를
// 수백 KB 부풀립니다. PrismLight + 실제로 쓰는 언어만 등록해 최소화합니다.
//
// 새 언어로 코드 펜스를 쓰려면 아래 LANGUAGES에 한 줄 추가하세요.
// 등록되지 않은 언어는 하이라이팅 없이 평문으로 렌더됩니다(에러 아님).

import { PrismLight } from "react-syntax-highlighter";

import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import groovy from "react-syntax-highlighter/dist/esm/languages/prism/groovy";
import http from "react-syntax-highlighter/dist/esm/languages/prism/http";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import properties from "react-syntax-highlighter/dist/esm/languages/prism/properties";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";

const LANGUAGES = {
  bash,
  groovy,
  http,
  java,
  javascript,
  json,
  properties,
  python,
  sql,
  typescript,
  yaml,
} as const;

/** 코드 펜스에서 쓰는 별칭 → 등록된 언어 이름 */
const ALIASES: Record<string, keyof typeof LANGUAGES> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  py: "python",
  gradle: "groovy",
};

for (const [name, definition] of Object.entries(LANGUAGES)) {
  PrismLight.registerLanguage(name, definition);
}

for (const [alias, target] of Object.entries(ALIASES)) {
  PrismLight.registerLanguage(alias, LANGUAGES[target]);
}

/** 등록되지 않은 언어면 평문(`text`)으로 떨어뜨립니다. */
export function resolveLanguage(language: string): string {
  const key = language.toLowerCase();
  if (key in LANGUAGES || key in ALIASES) return key;
  return "text";
}

export { PrismLight as SyntaxHighlighter };
