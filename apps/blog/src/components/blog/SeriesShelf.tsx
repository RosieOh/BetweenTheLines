import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import type { PostMeta, SeriesConfig } from "@btl/core";
import { stripSeriesPrefix } from "@/lib/seriesTitle";

export interface SeriesGroup extends SeriesConfig {
  posts: PostMeta[];
}

/** 접기 전에 보여줄 편수. 시리즈 개수와 무관하게 블록 높이를 일정하게 유지합니다. */
const VISIBLE_COUNT = 5;

/**
 * 시리즈를 한 블록에 모아 보여줍니다.
 * 시리즈마다 컨테이너를 쌓으면 시리즈가 늘어날수록 아티클 목록이 밀려나므로,
 * 선택형 탭 하나로 묶어 높이를 시리즈 개수와 분리했습니다.
 */
const SeriesShelf = ({ series }: { series: SeriesGroup[] }) => {
  const [activeKey, setActiveKey] = useState(series[0]?.key ?? "");
  const [expanded, setExpanded] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = useMemo(
    () => series.find((s) => s.key === activeKey) ?? series[0],
    [series, activeKey]
  );

  if (!active) return null;

  const selectTab = (key: string) => {
    setActiveKey(key);
    setExpanded(false); // 시리즈를 바꾸면 펼침 상태도 초기화합니다
  };

  /** 좌우 방향키로 탭 이동 (roving tabindex) */
  const handleTabKey = (e: React.KeyboardEvent, index: number) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + series.length) % series.length;
    selectTab(series[next].key);
    tabRefs.current[next]?.focus();
  };

  const shown = expanded ? active.posts : active.posts.slice(0, VISIBLE_COUNT);
  const hiddenCount = active.posts.length - shown.length;

  return (
    <section aria-labelledby="series-heading" className="mb-14">
      <h2 id="series-heading" className="text-2xl font-bold text-foreground mb-5">
        시리즈
      </h2>

      <div
        role="tablist"
        aria-label="시리즈 선택"
        className="flex gap-6 overflow-x-auto scrollbar-none border-b border-border"
      >
        {series.map((s, i) => {
          const selected = s.key === active.key;
          return (
            <button
              key={s.key}
              ref={(el) => (tabRefs.current[i] = el)}
              role="tab"
              id={`series-tab-${s.key}`}
              aria-selected={selected}
              aria-controls={`series-panel-${s.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(s.key)}
              onKeyDown={(e) => handleTabKey(e, i)}
              className={`relative whitespace-nowrap pb-3 text-[14px] font-semibold transition-colors ${
                selected
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full transition-opacity ${
                  selected ? "bg-accent opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`series-panel-${active.key}`}
        aria-labelledby={`series-tab-${active.key}`}
        className="pt-5"
      >
        <p className="text-[13px] text-muted-foreground mb-4">
          {active.description}
          <span className="mx-1.5" aria-hidden="true">
            ·
          </span>
          {active.posts.length}편
        </p>

        <ol className="border-y border-border divide-y divide-border">
          {shown.map((post, idx) => (
            <li key={post.id}>
              <Link
                to={`/post/${post.id}`}
                className="group flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-5"
              >
                <span className="shrink-0 text-[12px] font-medium text-muted-foreground sm:w-24">
                  {post.seriesLabel ?? `${active.label} ${idx + 1}`}
                </span>
                <span className="text-[14px] leading-snug text-foreground transition-colors group-hover:text-accent">
                  {stripSeriesPrefix(post.title)}
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {hiddenCount > 0 && (
          <button
            onClick={() => setExpanded(true)}
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown size={14} />외 {hiddenCount}편 더 보기
          </button>
        )}
      </div>
    </section>
  );
};

export default SeriesShelf;
