import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { ArrowLeft, Clock, Calendar, Twitter, Linkedin, Link2, Check, Copy, Heart, ChevronDown } from "lucide-react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import ContactModal from "@/components/blog/ContactModal";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import ScrollToTop from "@/components/blog/ScrollToTop";
import GiscusComments from "@/components/blog/GiscusComments";
import NotFoundInline from "@/components/blog/NotFoundInline";
import { useLike } from "@/lib/useLike";
import { SyntaxHighlighter, resolveLanguage } from "@/lib/syntaxHighlighter";
import { getAllPosts, loadPostContent, categoryStyles, sanitizeHref, blogConfig } from "@btl/core";

interface Heading {
  level: number;
  text: string;
  id: string;
}

function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w가-힣-]/g, "")
    .replace(/^-+|-+$/g, "");
}

function extractHeadings(markdown: string): Heading[] {
  let inFence = false;

  return markdown.split("\n").reduce<Heading[]>((acc, line) => {
    // 코드 블록 안의 `## 주석`을 목차로 오인하지 않도록 펜스를 추적합니다.
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return acc;
    }
    if (inFence) return acc;

    const heading = /^(#{2,3}) (.+)/.exec(line);
    if (heading) {
      const text = heading[2].trim();
      acc.push({ level: heading[1].length, text, id: slugify(text) });
    }
    return acc;
  }, []);
}

// Table of contents links — shared by desktop sidebar and mobile drawer
const TocLinks = ({
  headings,
  activeId,
  onNavigate,
}: {
  headings: Heading[];
  activeId: string;
  onNavigate?: () => void;
}) => (
  <nav className="flex flex-col gap-1">
    {headings.map((h) => (
      <a
        key={h.id}
        href={`#${h.id}`}
        onClick={onNavigate}
        aria-current={activeId === h.id ? "location" : undefined}
        className={`transition-colors leading-snug py-0.5 ${
          h.level === 3 ? "pl-3 text-[12px] border-l border-border" : "text-[13px] font-medium"
        } ${
          activeId === h.id
            ? "text-foreground font-semibold"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {h.text}
      </a>
    ))}
  </nav>
);

// Sticky sidebar
const PostDetailSidebar = ({
  headings,
  activeId,
  onContact,
}: {
  headings: Heading[];
  activeId: string;
  onContact: () => void;
}) => (
  <aside className="sticky top-20 flex flex-col gap-4">
    {headings.length > 0 && (
      <div className="bg-secondary rounded-2xl p-5 border border-border">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
          목차
        </p>
        <TocLinks headings={headings} activeId={activeId} />
      </div>
    )}

    {/* CTA */}
    <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
      <p className="text-[10px] font-bold opacity-50 mb-1.5 uppercase tracking-widest">
        {blogConfig.name}
      </p>
      <p className="text-[16px] font-extrabold leading-snug mb-1">피드백이나 문의는</p>
      <p className="text-[16px] font-extrabold leading-snug mb-4 opacity-70">언제든 환영해요</p>
      <button
        onClick={onContact}
        className="flex w-full justify-center px-4 py-2.5 rounded-xl bg-primary-foreground text-primary text-[13px] font-bold hover:opacity-90 transition-opacity"
      >
        메시지 보내기
      </button>
    </div>
  </aside>
);

// Code block with copy button
const CodeBlock = ({
  language,
  code,
  codeStyle,
}: {
  language: string;
  code: string;
  codeStyle: Record<string, React.CSSProperties>;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        /* 클립보드 권한이 없으면 조용히 무시합니다 */
      });
  };

  return (
    <div className="relative group my-6">
      <button
        onClick={handleCopy}
        aria-label="코드 복사"
        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-[11px] text-white/60 hover:bg-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
        {copied ? "복사됨" : "복사"}
      </button>
      <SyntaxHighlighter
        style={codeStyle}
        language={resolveLanguage(language)}
        PreTag="div"
        customStyle={{ borderRadius: "0.75rem", fontSize: "13px", margin: 0, padding: "1.25rem" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// Mobile collapsible TOC
const MobileToc = ({ headings, activeId }: { headings: Heading[]; activeId: string }) => {
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;

  return (
    <div className="lg:hidden mb-6 rounded-xl border border-border bg-secondary overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-semibold text-foreground"
      >
        목차
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          <TocLinks headings={headings} activeId={activeId} onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

// Markdown component factory — recreated when isDark changes for code theme sync
function makeMarkdownComponents(isDark: boolean): Components {
  const codeStyle = isDark ? oneDark : oneLight;

  return {
    h2({ children }) {
      return (
        <h2 id={slugify(String(children))} className="scroll-mt-24 text-2xl font-bold text-foreground mt-10 mb-4">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 id={slugify(String(children))} className="scroll-mt-24 text-xl font-semibold text-foreground mt-8 mb-3">
          {children}
        </h3>
      );
    },
    p({ children }) {
      return <p className="text-foreground/75 leading-[1.9] mb-5 text-[16px]">{children}</p>;
    },
    strong({ children }) {
      return <strong className="text-foreground font-semibold">{children}</strong>;
    },
    a({ href, children }) {
      return (
        <a
          href={sanitizeHref(href)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {children}
        </a>
      );
    },
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      if (match) {
        return (
          <CodeBlock
            language={match[1]}
            code={String(children).replace(/\n$/, "")}
            codeStyle={codeStyle}
          />
        );
      }
      return (
        <code className="bg-secondary text-accent px-1.5 py-0.5 rounded text-[0.875em] font-mono border border-border">
          {children}
        </code>
      );
    },
    pre({ children }) {
      // CodeBlock이 자체 래퍼를 렌더하므로 언어가 지정된 블록은 그대로 통과시킵니다.
      const child = children as React.ReactElement<{ className?: string }>;
      if (child?.props?.className?.includes("language-")) return <>{children}</>;
      return (
        <pre className="bg-secondary border border-border rounded-xl p-5 overflow-x-auto my-6 text-[14px] leading-relaxed">
          {children}
        </pre>
      );
    },
    blockquote({ children }) {
      return (
        <blockquote className="border-l-4 border-accent pl-5 my-6 text-muted-foreground italic">
          {children}
        </blockquote>
      );
    },
    ul({ children }) {
      return <ul className="list-disc list-outside pl-6 mb-5 flex flex-col gap-1.5">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal list-outside pl-6 mb-5 flex flex-col gap-1.5">{children}</ol>;
    },
    li({ children }) {
      return <li className="text-foreground/75 text-[16px] leading-relaxed">{children}</li>;
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse text-[14px]">{children}</table>
        </div>
      );
    },
    th({ children }) {
      return (
        <th className="text-left px-4 py-2.5 bg-secondary border border-border font-semibold text-foreground text-[13px]">
          {children}
        </th>
      );
    },
    td({ children }) {
      return <td className="px-4 py-2.5 border border-border text-muted-foreground">{children}</td>;
    },
    hr() {
      return <hr className="border-border my-8" />;
    },
  };
}

// Social share button
const ShareButtons = ({ title }: { title: string }) => {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        /* 클립보드 권한이 없으면 조용히 무시합니다 */
      });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-semibold text-muted-foreground mr-1">공유</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Twitter size={13} />
        Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <Linkedin size={13} />
        LinkedIn
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        {copied ? <Check size={13} className="text-emerald-500" /> : <Link2 size={13} />}
        {copied ? "복사됨" : "링크 복사"}
      </button>
    </div>
  );
};

const ArticleSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-3" aria-hidden="true">
    {[...Array(8)].map((_, i) => (
      <div key={i} className={`h-4 rounded bg-secondary ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
    ))}
  </div>
);

type ContentState = "loading" | "ready" | "error";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [contactOpen, setContactOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [content, setContent] = useState("");
  const [contentState, setContentState] = useState<ContentState>("loading");
  const { resolvedTheme } = useTheme();
  const { liked, toggle: toggleLike } = useLike(id ?? "");

  const isDark = resolvedTheme === "dark";
  const allPosts = useMemo(() => getAllPosts(), []);
  const post = useMemo(() => allPosts.find((p) => p.id === id), [allPosts, id]);
  const markdownComponents = useMemo(() => makeMarkdownComponents(isDark), [isDark]);
  const headings = useMemo(() => extractHeadings(content), [content]);

  // 본문은 글 단위 청크로 분리돼 있어 상세 진입 시점에만 로드합니다.
  useEffect(() => {
    if (!post) return;

    // 관리자 화면에서 저장한 글은 본문을 이미 들고 있습니다.
    if (post.content !== undefined) {
      setContent(post.content);
      setContentState("ready");
      return;
    }

    let cancelled = false;
    setContentState("loading");

    loadPostContent(post.id)
      .then((loaded) => {
        if (cancelled) return;
        if (loaded === null) {
          setContentState("error");
          return;
        }
        setContent(loaded);
        setContentState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(`[PostDetail] 본문 로드 실패: ${post.id}`, err);
        setContentState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [post]);

  // SEO: document title + Open Graph meta tags
  useEffect(() => {
    if (!post) return;

    const prevTitle = document.title;
    document.title = `${post.title} | ${blogConfig.name}`;

    const setMeta = (key: string, value: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute("content") ?? "";
      el.setAttribute("content", value);
      return () => el?.setAttribute("content", prev);
    };

    const absoluteThumb = new URL(post.thumbnail, window.location.origin).href;
    const restores = [
      setMeta("description", post.excerpt),
      setMeta("og:title", post.title, true),
      setMeta("og:description", post.excerpt, true),
      setMeta("og:image", absoluteThumb, true),
      setMeta("og:type", "article", true),
      setMeta("og:url", window.location.href, true),
      setMeta("twitter:card", "summary_large_image"),
      setMeta("twitter:title", post.title),
      setMeta("twitter:description", post.excerpt),
      setMeta("twitter:image", absoluteThumb),
    ];

    return () => {
      document.title = prevTitle;
      restores.forEach((restore) => restore());
    };
  }, [post]);

  // IntersectionObserver for active TOC heading
  useEffect(() => {
    if (headings.length === 0) return;

    const ids = headings.map((h) => h.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = new Set(
          entries.filter((e) => e.isIntersecting).map((e) => e.target.id)
        );
        if (visible.size === 0) return;
        // 문서 순서상 가장 위에 보이는 헤딩을 활성 항목으로 삼습니다.
        const topmost = ids.find((headingId) => visible.has(headingId));
        if (topmost) setActiveId(topmost);
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    ids.forEach((headingId) => {
      const el = document.getElementById(headingId);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // 관련 글: 같은 카테고리이거나 태그가 겹치는 글 (allPosts는 이미 최신순)
  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return allPosts
      .filter(
        (p) =>
          p.id !== post.id &&
          (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
      )
      .slice(0, 3);
  }, [allPosts, post]);

  if (!post) {
    return <NotFoundInline message="포스트를 찾을 수 없습니다." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgressBar />
      <BlogHeader />

      <main>
        {/* ── Article header ────────────────────────────── */}
        <div className="container pt-8 pb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            전체 아티클
          </Link>

          {/* Category badge */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              to={`/category/${post.category.toLowerCase()}`}
              className={`px-2.5 py-1 rounded-md text-[12px] font-bold hover:opacity-80 transition-opacity ${
                categoryStyles[post.category] || "bg-secondary text-foreground"
              }`}
            >
              {post.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-[28px] md:text-[42px] font-extrabold text-foreground leading-[1.2] tracking-tight mb-5 max-w-3xl">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
            <Link
              to={`/author/${encodeURIComponent(post.author)}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[12px] font-bold text-primary-foreground">
                {post.author.charAt(0)}
              </div>
              <span className="font-semibold text-foreground">{post.author}</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              <time dateTime={post.rawDate}>{post.date}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={13} />
              {post.readTime} 읽기
            </div>
          </div>
        </div>

        {/* ── Banner image ───────────────────────────────── */}
        <div className="container mb-12">
          <div className="w-full rounded-2xl overflow-hidden aspect-[16/7]">
            <img
              src={post.thumbnail}
              alt=""
              width={1200}
              height={525}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ── Content grid ──────────────────────────────── */}
        <div className="container pb-24">
          <div className="grid lg:grid-cols-[1fr_292px] gap-14">

            {/* ── Main article ── */}
            <article>
              {/* Mobile TOC */}
              <MobileToc headings={headings} activeId={activeId} />

              {/* Markdown body */}
              <div className="text-base">
                {contentState === "loading" && <ArticleSkeleton />}

                {contentState === "error" && (
                  <div className="rounded-xl border border-border bg-secondary p-6 text-center">
                    <p className="text-[14px] font-semibold text-foreground mb-1">
                      본문을 불러오지 못했습니다
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      네트워크 상태를 확인하고 페이지를 새로고침해 주세요.
                    </p>
                  </div>
                )}

                {contentState === "ready" && (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {content}
                  </ReactMarkdown>
                )}
              </div>

              {/* Social share + Like */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <ShareButtons title={post.title} />
                <button
                  onClick={toggleLike}
                  aria-pressed={liked}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
                    liked
                      ? "border-red-300 bg-red-50 text-red-500 dark:bg-red-950/30 dark:border-red-800"
                      : "border-border text-muted-foreground hover:text-red-500 hover:border-red-300"
                  }`}
                >
                  <Heart size={13} className={liked ? "fill-red-500" : ""} />
                  {liked ? "좋아요 취소" : "좋아요"}
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/tag/${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 rounded-full bg-secondary text-[13px] text-muted-foreground font-medium hover:text-foreground transition-colors border border-border"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Author bio */}
              <Link
                to={`/author/${encodeURIComponent(post.author)}`}
                className="flex items-start gap-4 mt-8 p-6 bg-secondary rounded-2xl border border-border hover:shadow-sm transition-shadow group"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground flex-shrink-0">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                    {post.author}
                  </p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {blogConfig.author.bio}
                  </p>
                </div>
              </Link>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-12">
                  <p className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    관련 아티클
                  </p>
                  <div className="flex flex-col gap-3">
                    {relatedPosts.map((rel) => (
                      <Link
                        key={rel.id}
                        to={`/post/${rel.id}`}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-secondary/40 transition-colors group"
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={rel.thumbnail} alt="" loading="lazy" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                              categoryStyles[rel.category] || "bg-secondary text-foreground"
                            }`}
                          >
                            {rel.category}
                          </span>
                          <p className="text-[13px] font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                            {rel.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {rel.date} · {rel.readTime}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Giscus comments */}
              <GiscusComments />
            </article>

            {/* ── Sidebar ── */}
            <div className="hidden lg:block">
              <PostDetailSidebar
                headings={headings}
                activeId={activeId}
                onContact={() => setContactOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/90 backdrop-blur border-t border-border">
        <button
          onClick={() => setContactOpen(true)}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity"
        >
          메시지 보내기
        </button>
      </div>

      <ScrollToTop />
      <BlogFooter />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
};

export default PostDetail;
