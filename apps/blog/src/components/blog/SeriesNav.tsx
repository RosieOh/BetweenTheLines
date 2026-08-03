import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { seriesMap, type SeriesPosition } from "@btl/core";
import { stripSeriesPrefix } from "@/lib/seriesTitle";

/**
 * 시리즈 글의 본문 끝에 붙는 이동 영역.
 * 시리즈는 순서대로 읽히는 것을 전제로 하므로, 목차와 앞뒤 이동을 함께 제공합니다.
 */
const SeriesNav = ({ position, currentId }: { position: SeriesPosition; currentId: string }) => {
  const meta = seriesMap[position.key];
  const { posts, index, previous, next } = position;

  return (
    <nav
      aria-label="시리즈 목차"
      className="mt-12 rounded-2xl border border-border bg-secondary/40 p-6"
    >
      <div className="mb-5">
        <p className="text-[15px] font-bold text-foreground">
          {meta?.label ?? "시리즈"}
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {meta?.description ? `${meta.description} · ` : ""}
          {index + 1}/{posts.length}편
        </p>
      </div>

      <ol className="mb-6 border-y border-border divide-y divide-border">
        {posts.map((post, i) => {
          const isCurrent = post.id === currentId;
          const label = post.seriesLabel ?? `${i + 1}편`;

          if (isCurrent) {
            return (
              <li
                key={post.id}
                aria-current="true"
                className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:gap-5"
              >
                <span className="shrink-0 text-[12px] font-semibold text-accent sm:w-24">
                  {label}
                </span>
                <span className="text-[14px] font-semibold leading-snug text-foreground">
                  {stripSeriesPrefix(post.title)}
                </span>
              </li>
            );
          }

          return (
            <li key={post.id}>
              <Link
                to={`/post/${post.id}`}
                className="group flex flex-col gap-1 py-2.5 sm:flex-row sm:items-baseline sm:gap-5"
              >
                <span className="shrink-0 text-[12px] font-medium text-muted-foreground sm:w-24">
                  {label}
                </span>
                <span className="text-[14px] leading-snug text-muted-foreground transition-colors group-hover:text-accent">
                  {stripSeriesPrefix(post.title)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            to={`/post/${previous.id}`}
            rel="prev"
            className="group flex flex-col gap-1 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-secondary"
          >
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
              <ArrowLeft size={13} />
              이전 편
            </span>
            <span className="text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-accent line-clamp-2">
              {stripSeriesPrefix(previous.title)}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}

        {next && (
          <Link
            to={`/post/${next.id}`}
            rel="next"
            className="group flex flex-col gap-1 rounded-xl border border-border bg-background p-4 transition-colors hover:bg-secondary sm:text-right"
          >
            <span className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground sm:justify-end">
              다음 편
              <ArrowRight size={13} />
            </span>
            <span className="text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-accent line-clamp-2">
              {stripSeriesPrefix(next.title)}
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default SeriesNav;
