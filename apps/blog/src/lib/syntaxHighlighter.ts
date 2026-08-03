// ── 코드 하이라이터 (경량 빌드) ────────────────────────────────
// `Prism` 풀 빌드는 refractor의 전 언어 정의를 끌고 와 상세 페이지 청크를
// 수백 KB 부풀립니다. PrismLight + 실제로 쓰는 언어만 등록해 최소화합니다.
//
// 새 언어로 코드 펜스를 쓰려면 import 를 추가하고 LANGUAGES 에 넣으세요.
// 등록되지 않은 언어는 하이라이팅 없이 평문으로 렌더됩니다(에러 아님).

import { PrismLight } from "react-syntax-highlighter";

import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import docker from "react-syntax-highlighter/dist/esm/languages/prism/docker";
import groovy from "react-syntax-highlighter/dist/esm/languages/prism/groovy";
import http from "react-syntax-highlighter/dist/esm/languages/prism/http";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import markup from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import properties from "react-syntax-highlighter/dist/esm/languages/prism/properties";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import sql from "react-syntax-highlighter/dist/esm/languages/prism/sql";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import yaml from "react-syntax-highlighter/dist/esm/languages/prism/yaml";

/** refractor 언어 정의는 자신의 이름과 별칭을 함수 프로퍼티로 노출합니다. */
type LanguageDefinition = {
  displayName?: string;
  aliases?: string[];
};

/**
 * tsx / jsx 는 typescript / javascript 의 **별칭이 아니라 별도 모듈**입니다.
 * 예전에 별칭 표로 매핑했다가 조용히 평문으로 렌더돼서, 그 뒤로 모듈을 직접 넣습니다.
 * (등록 자체는 refractor 가 의존 언어까지 함께 처리합니다: typescript → javascript → clike)
 */
const LANGUAGES = [
  bash,
  docker,
  groovy,
  http,
  java,
  javascript,
  json,
  jsx,
  markdown,
  markup,
  properties,
  python,
  sql,
  typescript,
  tsx,
  yaml,
];

/**
 * 지원 언어 집합을 등록한 모듈에서 직접 만듭니다.
 * refractor 인스턴스를 조회하지 않는 이유: 번들러/테스트 환경에 따라
 * `refractor` 와 `refractor/core` 가 다른 인스턴스로 해석될 수 있습니다.
 */
const SUPPORTED = new Set<string>(["text", "plain", "plaintext", "txt"]);

for (const definition of LANGUAGES) {
  const { displayName, aliases } = definition as unknown as LanguageDefinition;
  if (!displayName) continue;

  PrismLight.registerLanguage(displayName, definition);
  SUPPORTED.add(displayName);
  for (const alias of aliases ?? []) SUPPORTED.add(alias);
}

/** 코드 펜스에서 쓸 수 있는 언어 목록 (테스트에서 참조합니다) */
export const supportedLanguages: ReadonlySet<string> = SUPPORTED;

/** 등록되지 않은 언어면 평문(`text`)으로 떨어뜨립니다. */
export function resolveLanguage(language: string): string {
  const key = language.toLowerCase();
  return SUPPORTED.has(key) ? key : "text";
}

export { PrismLight as SyntaxHighlighter };
