import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Clock, Calendar, AlertTriangle } from "lucide-react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import AciRadarChart from "@/components/blog/AciRadarChart";
import ContactModal from "@/components/blog/ContactModal";
import { getAllPosts } from "@/lib/postStorage";
import { categoryStyles, pillars } from "@/lib/categoryConfig";
import { sanitizeHref } from "@/lib/utils";
import type { PostData } from "@/data/posts";

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

// ACI Scorecard —— shown in the article body
const AciScorecard = ({ post }: { post: PostData }) => {
  const { aciBreakdown, aciScore } = post;

  return (
    <div className="bg-secondary rounded-2xl p-6 mb-10 border border-border">
      <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
        ACI 스코어카드
      </p>

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        {/* Radar chart */}
        <div className="flex-shrink-0">
          <AciRadarChart scores={aciBreakdown} size="lg" showLabels={true} />
        </div>

        {/* Score breakdown */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-4xl font-extrabold text-foreground">{aciScore}</span>
            <span className="text-base text-muted-foreground font-medium">/ 1000</span>
          </div>

          <div className="flex flex-col gap-3.5">
            {pillars.map((p) => {
              const score = aciBreakdown[p.key];
              const pct = Math.round((score / 250) * 100);
              return (
                <div key={p.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${p.color}`} />
                      <span className="text-[12px] font-semibold text-muted-foreground">
                        {p.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">
                        {p.fullName}
                      </span>
                    </div>
                    <span className="text-[13px] font-bold text-foreground tabular-nums">
                      {score}
                      <span className="text-[11px] font-normal text-muted-foreground">/250</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full ${p.color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sticky sidebar
const PostDetailSidebar = ({
  post,
  headings,
  onContact,
}: {
  post: PostData;
  headings: { level: number; text: string; id: string }[];
  onContact: () => void;
}) => {
  const { aciBreakdown, aciScore } = post;

  return (
    <aside className="sticky top-20 flex flex-col gap-4">
      {/* Mini ACI */}
      <div className="bg-secondary rounded-2xl p-5 border border-border">
        <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
          ACI Score
        </p>
        <div className="flex items-center gap-3 mb-4">
          <AciRadarChart scores={aciBreakdown} size="sm" showLabels={false} />
          <div>
            <p className="text-2xl font-extrabold text-foreground leading-none">{aciScore}</p>
            <p className="text-xs text-muted-foreground mt-0.5">/ 1000</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {pillars.map((p) => {
            const score = aciBreakdown[p.key];
            const pct = Math.round((score / 250) * 100);
            return (
              <div key={p.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                    <span className="text-[11px] font-semibold text-muted-foreground">{p.label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-foreground tabular-nums">{score}</span>
                </div>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className={`h-full ${p.color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                className={`text-muted-foreground hover:text-foreground transition-colors leading-snug py-0.5 ${
                  h.level === 3
                    ? "pl-3 text-[12px] border-l border-border"
                    : "text-[13px] font-medium"
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
          Hyperwise Studio
        </p>
        <p className="text-[16px] font-extrabold leading-snug mb-1">
          이 기술력을
        </p>
        <p className="text-[16px] font-extrabold leading-snug mb-4 opacity-70">
          당신의 프로젝트에
        </p>
        <button
          onClick={onContact}
          className="flex w-full justify-center px-4 py-2.5 rounded-xl bg-primary-foreground text-primary text-[13px] font-bold hover:opacity-90 transition-opacity"
        >
          프로젝트 문의하기
        </button>
        <p className="text-[11px] opacity-40 mt-3 text-center">평균 48시간 내 회신</p>
      </div>
    </aside>
  );
};

// Markdown component overrides with heading IDs for TOC
const MarkdownComponents = {
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
  code({ children }: { children?: React.ReactNode }) {
    const isBlock = String(children).includes("\n");
    if (!isBlock) {
      return (
        <code className="bg-secondary text-accent px-1.5 py-0.5 rounded text-[0.875em] font-mono border border-border">
          {children}
        </code>
      );
    }
    return <code className="font-mono text-[0.875em]">{children}</code>;
  },
  pre({ children }: { children?: React.ReactNode }) {
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

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const post = getAllPosts().find((p) => p.id === id);
  const [contactOpen, setContactOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
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

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              to={`/category/${post.category.toLowerCase()}`}
              className={`px-2.5 py-1 rounded-md text-[12px] font-bold hover:opacity-80 transition-opacity ${
                categoryStyles[post.category] || categoryStyles.PPS
              }`}
            >
              {post.category}
            </Link>
            {post.hasAesPenalty && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-[12px] font-bold dark:bg-red-900/30 dark:text-red-400">
                <AlertTriangle size={11} />
                AES 패널티
              </span>
            )}
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
            <span className="font-bold text-accent">ACI {post.aciScore}</span>
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
              {/* ACI Scorecard */}
              <AciScorecard post={post} />

              {/* Markdown body */}
              <div className="text-base">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents as any}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
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
                    Hyperwise의 엔지니어로, 대규모 시스템 설계와 성능 최적화에 관심이 많습니다.
                    기술 블로그를 통해 현장 경험을 공유합니다.
                  </p>
                </div>
              </Link>
            </article>

            {/* ── Sidebar ── */}
            <div className="hidden lg:block">
              <PostDetailSidebar post={post} headings={headings} onContact={() => setContactOpen(true)} />
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
          프로젝트 문의하기
        </button>
      </div>

      <BlogFooter />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
};

export default PostDetail;
