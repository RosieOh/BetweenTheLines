import { useParams, Link } from "react-router-dom";
import { FileText } from "lucide-react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import NotFoundInline from "@/components/blog/NotFoundInline";
import { categories } from "@/data/posts";
import { getAllPosts } from "@/lib/postStorage";
import { categoryMap, categoryList } from "@/lib/blogConfig";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const rawCat = category?.toLowerCase();

  // URL 파라미터를 실제 카테고리 key로 매핑
  const matchedCat = !rawCat || rawCat === "all"
    ? null
    : categoryList.find((c) => c.key.toLowerCase() === rawCat)?.key;

  const isAll = !matchedCat;
  const meta = matchedCat ? categoryMap[matchedCat] : null;

  const allPosts = getAllPosts();
  const posts = isAll ? allPosts : allPosts.filter((p) => p.category === matchedCat);
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date.replace(/\. /g, "-").replace(".", "")).getTime()
           - new Date(a.date.replace(/\. /g, "-").replace(".", "")).getTime()
  );

  if (!isAll && !meta) {
    return <NotFoundInline message="카테고리를 찾을 수 없습니다." />;
  }

  const displayLabel = isAll ? "전체" : meta!.label;
  const displayDescription = isAll
    ? "전체 카테고리의 모든 글"
    : meta!.description;
  const headerBg = isAll ? "bg-secondary/20" : meta!.bg;
  const headerBorder = isAll ? "border-border" : meta!.border;
  const textColor = isAll ? "text-foreground" : meta!.textColor;

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className={`border-b border-border py-14 ${headerBg}`}>
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/"
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                홈
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-[13px] text-foreground font-medium">{displayLabel}</span>
            </div>
            <div>
              <h1 className={`text-[40px] font-extrabold ${textColor} leading-none mb-3`}>
                {displayLabel}
              </h1>
              <p className="text-[14px] text-muted-foreground max-w-md">{displayDescription}</p>
            </div>

            {/* Article count */}
            <div className="mt-6">
              <p className="text-[11px] text-muted-foreground mb-1">아티클 수</p>
              <p className="text-[22px] font-extrabold text-foreground">{posts.length}</p>
            </div>
          </div>
        </section>

        {/* Category tabs */}
        <section className={`border-b ${headerBorder} bg-background`}>
          <div className="container max-w-4xl">
            <div className="flex gap-1 py-3 overflow-x-auto">
              {categories.map((c) => {
                const catPath = c === "전체" ? "/category/all" : `/category/${c.toLowerCase()}`;
                const isActive = (c === "전체" && isAll) || c === matchedCat;
                return (
                  <Link
                    key={c}
                    to={catPath}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {c === "전체" ? "전체" : categoryMap[c]?.label ?? c}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-10">
          <div className="container max-w-4xl">
            {sorted.length > 0 ? (
              <div className="divide-y divide-border">
                {sorted.map((post) => (
                  <BlogArticleCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
                  <FileText size={22} className="text-muted-foreground" />
                </div>
                <p className="text-[17px] font-semibold text-foreground mb-2">
                  아직 글이 없습니다
                </p>
                <p className="text-[14px] text-muted-foreground mb-4">
                  이 카테고리의 첫 번째 글을 기다리고 있습니다.
                </p>
                <Link
                  to="/category/all"
                  className="text-[13px] text-accent hover:underline"
                >
                  전체 아티클 보기 →
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
};

export default CategoryPage;
