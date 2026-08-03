# Between the Lines

기록하는 개발자 오태훈의 기술 블로그. **https://rosieoh.github.io/BetweenTheLines/**

Vite + React 18 + TypeScript + Tailwind 기반의 정적 블로그입니다. 백엔드가 없고
`content/posts/**/*.mdx` 파일이 콘텐츠 소스입니다.

## 구조

npm workspaces 모노레포입니다.

```
apps/
  blog/      @btl/blog    공개 블로그 — GitHub Pages 로 배포
  admin/     @btl/admin   관리자 — 로컬 저작 도구, 배포하지 않음
packages/
  core/      @btl/core    공유 도메인 (포스트·설정·스토리지·디자인 토큰)
  build/     @btl/build   빌드 타임 도구 (frontmatter 파서·sitemap·프리렌더)
content/
  posts/                  글 (.mdx)
blog.config.json          블로그 이름·저자 (런타임과 빌드가 공유하는 단일 소스)
tailwind.preset.ts        두 앱이 공유하는 디자인 토큰
```

두 앱은 `@btl/core` 배럴을 통해서만 공유 코드를 씁니다. 앱끼리는 서로 의존하지 않습니다.

## 시작하기

```sh
npm install
npm run dev          # 블로그   http://localhost:8080
npm run dev:admin    # 관리자   http://localhost:8081
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` / `dev:admin` | 개발 서버 (블로그 / 관리자) |
| `npm run build` | 블로그: sitemap 생성 → Vite 빌드 → 라우트별 프리렌더 |
| `npm run build:admin` | 관리자 빌드 (배포 대상 아님, 검증용) |
| `npm run build:all` | 둘 다 |
| `npm run lint` | ESLint (워크스페이스 전체) |
| `npm run typecheck` | 패키지·앱별 타입 검사 |
| `npm test` | Vitest |

## 글 쓰기

`content/posts/` 아래 아무 곳에나 `.mdx` 파일을 추가하면 됩니다. **파일명(확장자 제외)이
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
**배포되는 것은 `apps/blog` 뿐입니다.**

주소 설정은 `.github/workflows/deploy-pages.yml` 의 env 두 개가 단일 소스입니다.

```yaml
SITE_ORIGIN: https://rosieoh.github.io
VITE_BASE_PATH: /BetweenTheLines/
```

커스텀 도메인으로 옮길 때는 `SITE_ORIGIN` 을 바꾸고 `VITE_BASE_PATH` 를 `/` 로 되돌린 뒤
`apps/blog/public/CNAME` 에 도메인을 넣으면 sitemap·robots·프리렌더 URL이 함께 따라옵니다.

## 관리자 앱에 대해

`apps/admin` 은 **로컬 저작 도구**이며 GitHub Pages 로 배포하지 않습니다.

- 비밀번호가 번들에 그대로 들어가므로 공개 호스팅에 올리면 의미가 없습니다.
  CI 가 공개 배포본에 관리자 코드가 섞이지 않았는지 매번 검사합니다.
- **데이터가 브라우저 localStorage 에만 저장됩니다.** 방문자가 남긴 문의·구독은
  그 방문자의 브라우저에 저장되므로 관리자 화면에서는 볼 수 없습니다.
  이 기능들이 실제로 동작하려면 백엔드가 필요합니다.
- 실제로 동작하는 발행 경로는 **PostEditor 의 MDX 내보내기**입니다.
  내려받은 `.mdx` 를 `content/posts/` 에 커밋하면 CI 가 배포합니다.

## 알아둘 점

- **프리렌더는 `<head>` 메타데이터까지입니다.** 공유 카드와 검색 스니펫에는 충분하지만
  본문 HTML을 서버에서 렌더하는 완전한 SSR은 아닙니다.
- 애니메이션은 `LazyMotion`(strict) 아래에서 동작합니다. 컴포넌트에서 `motion.*` 대신
  **`m.*`** 를 쓰세요 — `motion.*` 는 런타임 에러가 납니다.
