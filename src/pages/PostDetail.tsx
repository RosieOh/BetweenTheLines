import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { ArrowLeft, Clock, Calendar, Twitter, Linkedin, Link2, Check, Copy, Heart, ChevronDown } from "lucide-react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import ContactModal from "@/components/blog/ContactModal";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";
import ScrollToTop from "@/components/blog/ScrollToTop";
import GiscusComments from "@/components/blog/GiscusComments";
import { getAllPosts } from "@/lib/postStorage";
import { categoryStyles } from "@/lib/categoryConfig";
import { sanitizeHref } from "@/lib/utils";
import { useLike } from "@/lib/useLike";

function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\uAC00-\uD7A3-]/g, "")
    .replace(/^-+|-+$/g, "");
}

function extractHeadings(markdown: string) {
  return markdown.split("\n").reduce<{ level: number; text: string; id: string }[]>((acc, line) => {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) acc.push({ level: 2, text: h2[1], id: slugify(h2[1]) });
    if (h3) acc.push({ level: 3, text: h3[1], id: slugify(h3[1]) });
    return acc;
  }, []);
}

// Sticky sidebar
const PostDetailSidebar = ({
  headings,
  activeId,
  onContact,
}: {
  headings: { level: number; text: string; id: string }[];
  activeId: string;
  onContact: () => void;
}) => {
  return (
    <aside className="sticky top-20 flex flex-col gap-4">
      {/* Table of contents */}
      {headings.length > 0 && (
        <div className="bg-secondary rounded-2xl p-5 border border-border">
          <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
            목차
          </p>
          <nav className="flex flex-col gap-1">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={`transition-colors leading-snug py-0.5 ${
                  h.level === 3
                    ? "pl-3 text-[12px] border-l border-border"
                    : "text-[13px] font-medium"
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
        </div>
      )}

      {/* CTA */}
      <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
        <p className="text-[10px] font-bold opacity-50 mb-1.5 uppercase tracking-widest">
          Between the Lines
        </p>
        <p className="text-[16px] font-extrabold leading-snug mb-1">
          피드백이나 문의는
        </p>
        <p className="text-[16px] font-extrabold leading-snug mb-4 opacity-70">
          언제든 환영해요
        </p>
        <button
          onClick={onContact}
          className="flex w-full justify-center px-4 py-2.5 rounded-xl bg-primary-foreground text-primary text-[13px] font-bold hover:opacity-90 transition-opacity"
        >
          메시지 보내기
        </button>
      </div>
    </aside>
  );
};

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
  return (
    <div className="relative group my-6">
      <button
        onClick={() => {
          navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 text-[11px] text-white/60 hover:bg-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? <Check size={11} /> : <Copy size={11} />}
        {copied ? "복사됨" : "복사"}
      </button>
      <SyntaxHighlighter
        style={codeStyle}
        language={language}
        PreTag="div"
        customStyle={{ borderRadius: "0.75rem", fontSize: "13px", margin: 0, padding: "1.25rem" }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// Mobile collapsible TOC
const MobileToc = ({
  headings,
  activeId,
}: {
  headings: { level: number; text: string; id: string }[];
  activeId: string;
}) => {
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;
  return (
    <div className="lg:hidden mb-6 rounded-xl border border-border bg-secondary overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-[13px] font-semibold text-foreground"
      >
        목차
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <nav className="px-4 pb-4 flex flex-col gap-1 border-t border-border pt-3">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={() => setOpen(false)}
              className={`transition-colors leading-snug py-0.5 ${
                h.level === 3 ? "pl-3 text-[12px] border-l border-border" : "text-[13px] font-medium"
              } ${activeId === h.id ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
};

// Markdown component factory — recreated when isDark changes for code theme sync
function makeMarkdownComponents(isDark: boolean) {
  const codeStyle = isDark ? oneDark : oneLight;
  return {
    h2({ children }: { children?: React.ReactNode }) {
      const id = slugify(String(children));
      return (
        <h2 id={id} className="scroll-mt-24 text-2xl font-bold text-foreground mt-10 mb-4">
          {children}
        </h2>
      );
    },
    h3({ children }: { children?: React.ReactNode }) {
      const id = slugify(String(children));
      return (
        <h3 id={id} className="scroll-mt-24 text-xl font-semibold text-foreground mt-8 mb-3">
          {children}
        </h3>
      );
    },
    p({ children }: { children?: React.ReactNode }) {
      return <p className="text-foreground/75 leading-[1.9] mb-5 text-[16px]">{children}</p>;
    },
    strong({ children }: { children?: React.ReactNode }) {
      return <strong className="text-foreground font-semibold">{children}</strong>;
    },
    a({ href, children }: { href?: string; children?: React.ReactNode }) {
      return (
        <a href={sanitizeHref(href)} className="text-accent underline underline-offset-2 hover:opacity-80 transition-opacity" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    code({ className, children }: { className?: string; children?: React.ReactNode }) {
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
    pre({ children }: { children?: React.ReactNode }) {
      // CodeBlock already renders its own wrapper — just passthrough
      const child = children as React.ReactElement;
      if (child?.props?.className?.includes("language-")) return <>{children}</>;
      return (
        <pre className="bg-secondary border border-border rounded-xl p-5 overflow-x-auto my-6 text-[14px] leading-relaxed">
          {children}
        </pre>
      );
    },
    blockquote({ children }: { children?: React.ReactNode }) {
      return (
        <blockquote className="border-l-4 border-accent pl-5 my-6 text-muted-foreground italic">
          {children}
        </blockquote>
      );
    },
    ul({ children }: { children?: React.ReactNode }) {
      return <ul className="list-disc list-outside pl-6 mb-5 flex flex-col gap-1.5">{children}</ul>;
    },
    ol({ children }: { children?: React.ReactNode }) {
      return <ol className="list-decimal list-outside pl-6 mb-5 flex flex-col gap-1.5">{children}</ol>;
    },
    li({ children }: { children?: React.ReactNode }) {
      return <li className="text-foreground/75 text-[16px] leading-relaxed">{children}</li>;
    },
    table({ children }: { children?: React.ReactNode }) {
      return (
        <div className="overflow-x-auto my-6">
          <table className="w-full border-collapse text-[14px]">{children}</table>
        </div>
      );
    },
    th({ children }: { children?: React.ReactNode }) {
      return (
        <th className="text-left px-4 py-2.5 bg-secondary border border-border font-semibold text-foreground text-[13px]">
          {children}
        </th>
      );
    },
    td({ children }: { children?: React.ReactNode }) {
      return (
        <td className="px-4 py-2.5 border border-border text-muted-foreground">{children}</td>
      );
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
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const allPosts = getAllPosts();
  const post = allPosts.find((p) => p.id === id);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const { resolvedTheme } = useTheme();
  const { liked, toggle: toggleLike } = useLike(id ?? "");
  const isDark = resolvedTheme === "dark";

  const markdownComponents = useMemo(() => makeMarkdownComponents(isDark), [isDark]);

  // SEO: document title + Open Graph meta tags
  useEffect(() => {
    const prevTitle = document.title;
    if (!post) return;

    document.title = `${post.title} | Between the Lines`;

    const setMeta = (key: string, value: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute("content") ?? "";
      el.setAttribute("content", value);
      return () => { el!.setAttribute("content", prev); };
    };

    const restores = [
      setMeta("description", post.excerpt),
      setMeta("og:title", post.title, true),
      setMeta("og:description", post.excerpt, true),
      setMeta("og:image", post.thumbnail, true),
      setMeta("og:type", "article", true),
      setMeta("og:url", window.location.href, true),
      setMeta("twitter:card", "summary_large_image"),
      setMeta("twitter:title", post.title),
      setMeta("twitter:description", post.excerpt),
      setMeta("twitter:image", post.thumbnail),
    ];

    return () => {
      document.title = prevTitle;
      restores.forEach((r) => r());
    };
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <BlogHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl font-extrabold text-foreground mb-3">404</p>
            <p className="text-muted-foreground mb-6">포스트를 찾을 수 없습니다.</p>
            <Link to="/" className="text-accent font-medium hover:underline">
              홈으로 돌아가기
            </Link>
          </div>
        </main>
        <BlogFooter />
      </div>
    );
  }

  const headings = extractHeadings(post.content);

  // IntersectionObserver for active TOC heading
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    if (headings.length === 0) return;
    observerRef.current?.disconnect();
    const ids = headings.map((h) => h.id);
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (visible.length > 0) {
          // Pick the topmost visible heading
          const first = ids.find((id) => visible.includes(id));
          if (first) setActiveId(first);
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    ids.forEach((hId) => {
      const el = document.getElementById(hId);
      if (el) observerRef.current!.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, [post.id]); // re-run when post changes

  // Related posts: same category or shared tag, excluding current
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    )
    .slice(0, 3);

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
              {post.date}
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
              alt={post.title}
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
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents as any}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Social share + Like */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <ShareButtons title={post.title} />
                <button
                  onClick={toggleLike}
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
                  <p className="font-bold text-foreground mb-1 group-hover:text-accent transition-colors">{post.author}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    얻은 지식을 프로젝트에 적용하고, 기록하는 습관으로 성장하는 개발자입니다.
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
                          <img src={rel.thumbnail} alt={rel.title} className="w-full h-full object-cover" />
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
                          <p className="text-[11px] text-muted-foreground mt-0.5">{rel.date} · {rel.readTime}</p>
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
              <PostDetailSidebar headings={headings} activeId={activeId} onContact={() => setContactOpen(true)} />
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
