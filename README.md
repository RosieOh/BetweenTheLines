# Between the Lines

기록하는 개발자 오태훈의 기술 블로그. **https://rosieoh.github.io/BetweenTheLines/**

Vite + React 18 + TypeScript + Tailwind 로 만든 정적 블로그입니다. 백엔드가 없고
`src/posts/**/*.mdx` 파일이 콘텐츠 소스입니다.

## 시작하기

```sh
npm install
npm run dev          # http://localhost:8080
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | sitemap 생성 → Vite 빌드 → 라우트별 프리렌더 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint |
| `npm run typecheck` | 타입 검사 |
| `npm test` | Vitest |

## 글 쓰기

`src/posts/` 아래 아무 곳에나 `.mdx` 파일을 추가하면 됩니다. **파일명(확장자 제외)이
글 id 이자 URL** 이므로 (`22.mdx` → `/post/22`) 전체에서 유일해야 합니다. 중복되면
빌드가 실패합니다.

```mdx
---
title: '글 제목 (콜론: 포함해도 됩니다)'
date: '2026-04-15'
description: '목록과 검색 결과, OG 태그에 쓰이는 요약'
author: '오태훈'
category: 'SpringBoot'          # blogConfig.ts 의 categoryList 에 있는 key
tags: ['SpringBoot', 'Cache']
readTime: '10분'
thumbnail: 'ai'                 # architecture | ai | communication | security | cicd
series: 'storyg-realworld-series'   # 선택
seriesOrder: 14                     # 선택
seriesLabel: '심화편 11'            # 선택
---

# 본문
```

`npm test` 가 모든 글의 frontmatter(필수 필드, 날짜 형식, 정의된 카테고리, id 중복)를
검사하므로 오타는 CI에서 걸립니다.

## 구조

```
blog.config.json          블로그 이름·저자 (런타임과 빌드 스크립트가 공유하는 단일 소스)
plugins/
  vite-plugin-posts.mjs   .mdx frontmatter → virtual:posts-meta 가상 모듈
scripts/
  posts.mjs               frontmatter 파서 (빌드 타임 단일 소스)
  routes.mjs              정적 라우트 목록 (sitemap/프리렌더 공유)
  siteUrl.mjs             배포 주소 규칙
  generate-sitemap.mjs    sitemap.xml + robots.txt 생성
  prerender.mjs           라우트별 정적 HTML + OG/JSON-LD 주입
src/
  posts/                  글 (.mdx)
  data/posts.ts           PostMeta 타입 + 정렬 비교자
  lib/loadPosts.ts        메타는 즉시, 본문은 글 단위 청크로 지연 로드
  lib/blogConfig.ts       카테고리 정의
```

### 성능상 중요한 규칙

목록 화면이 전체 글 본문을 내려받지 않도록 **메타데이터와 본문이 분리**돼 있습니다.

- 메타데이터: `virtual:posts-meta` (빌드 타임 주입, 즉시 사용 가능)
- 본문: `loadPostContent(id)` — 글마다 별도 청크

`PostMeta` 에는 `content` 가 없습니다. 본문이 필요하면 `loadPostContent(id)` 를 쓰고,
목록·카드 컴포넌트에서는 절대 부르지 마세요.

정렬은 항상 `rawDate`(ISO) 기준의 `byNewest` / `byOldest` 를 쓰고, 화면 표기용
`date`("2026. 04. 15.") 문자열로 정렬하지 마세요.

## 배포

`main` 브랜치 푸시 시 GitHub Actions 가 lint → typecheck → test → build → Pages 배포를 수행합니다.

주소 설정은 `.github/workflows/deploy-pages.yml` 의 env 두 개가 단일 소스입니다.

```yaml
SITE_ORIGIN: https://rosieoh.github.io
VITE_BASE_PATH: /BetweenTheLines/
```

커스텀 도메인으로 옮길 때는 `SITE_ORIGIN` 을 바꾸고 `VITE_BASE_PATH` 를 `/` 로 되돌린 뒤
`public/CNAME` 에 도메인을 넣으면 sitemap·robots·프리렌더 URL이 함께 따라옵니다.

## 알아둘 점

- **관리자 화면(`/admin`)은 프론트 전용 데모입니다.** 비밀번호가 번들에 그대로 들어 있고
  데이터는 localStorage 에만 저장됩니다. 실제 접근 제어가 아닙니다. (robots.txt 에서 제외)
- **프리렌더는 `<head>` 메타데이터까지입니다.** 공유 카드와 검색 스니펫에는 충분하지만
  본문 HTML을 서버에서 렌더하는 완전한 SSR은 아닙니다.
- 애니메이션은 `LazyMotion`(strict) 아래에서 동작합니다. 컴포넌트에서 `motion.*` 대신
  **`m.*`** 를 쓰세요 — `motion.*` 는 런타임 에러가 납니다.
