import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "@/data/posts";
import { getPublishedPosts } from "@/lib/postStorage";
import BlogArticleCard from "./BlogArticleCard";
import BlogArticleCardSkeleton from "./BlogArticleCardSkeleton";
import BlogSidebar from "./BlogSidebar";

const PAGE_SIZE = 6;
const SKELETON_COUNT = 4;
const FEATURED_SERIES_KEY = "storyg-realworld-series";

type SortOrder = "newest" | "oldest";

const BlogArticleList = () => {
  const [activeCategory, setActiveCategory] = useState<string>("전체");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortOrder>("newest");
  const [loading, setLoading] = useState(true);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (!isFirstMount.current) return;
    isFirstMount.current = false;
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const allPosts = getPublishedPosts();
  const storygSeriesPosts = allPosts
    .filter((post) => post.series === FEATURED_SERIES_KEY)
    .sort((a, b) => (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) - (b.seriesOrder ?? Number.MAX_SAFE_INTEGER));

  const filtered =
    activeCategory === "전체"
      ? allPosts
      : allPosts.filter((p) => p.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "oldest") return a.date.localeCompare(b.date);
    return b.date.localeCompare(a.date);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const toggleSort = () => {
    setSort((s) => (s === "newest" ? "oldest" : "newest"));
    setPage(1);
  };

  return (
    <section className="pb-20">
      <div className="container">
        {/* Section title + sort */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">전체 아티클</h2>
          <button
            onClick={toggleSort}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowUpDown size={13} />
            {sort === "newest" ? "최신순" : "오래된순"}
          </button>
        </div>

        {/* Category tags */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-tag-active-bg text-tag-active-fg"
                  : "bg-tag-bg text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content grid: articles + sidebar */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          {/* Article list */}
          <div>
            {activeCategory === "전체" && storygSeriesPosts.length > 0 && (
              <div className="mb-8 rounded-2xl border border-border bg-secondary/40 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                    Featured Series
                  </p>
                  <span className="text-[12px] text-muted-foreground">
                    StoryG 실전/심화 {storygSeriesPosts.length}편
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {storygSeriesPosts.map((post, idx) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      className="group rounded-xl border border-border bg-background p-3 hover:bg-secondary transition-colors"
                    >
                      <p className="text-[11px] text-muted-foreground mb-1">
                        {post.seriesLabel ?? `시리즈 ${idx + 1}`}
                      </p>
                      <p className="text-[13px] font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-0 divide-y divide-border">
              {loading ? (
                Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <BlogArticleCardSkeleton key={i} />
                ))
              ) : paginated.length > 0 ? (
                paginated.map((post) => <BlogArticleCard key={post.id} post={post} />)
              ) : (
                <div className="flex flex-col items-center py-20 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
                    <FileText size={22} className="text-muted-foreground" />
                  </div>
                  <p className="text-[16px] font-semibold text-foreground mb-1">
                    아직 아티클이 없습니다
                  </p>
                  <p className="text-[13px] text-muted-foreground mb-4">
                    이 카테고리의 첫 번째 글을 기다리고 있습니다.
                  </p>
                  <Link
                    to="/"
                    onClick={() => handleCategory("전체")}
                    className="text-[13px] text-accent hover:underline"
                  >
                    전체 아티클 보기 →
                  </Link>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                      n === safePage
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogArticleList;
