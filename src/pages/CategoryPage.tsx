import { useParams, Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import AciRadarChart from "@/components/blog/AciRadarChart";
import NotFoundInline from "@/components/blog/NotFoundInline";
import { categories } from "@/data/posts";
import { getAllPosts } from "@/lib/postStorage";

const categoryMeta: Record<
  string,
  {
    label: string;
    color: string;
    textColor: string;
    bg: string;
    border: string;
    description: string;
    fullName: string;
  }
> = {
  PPS: {
    label: "PPS",
    fullName: "Problem & Performance Scale",
    color: "bg-accent",
    textColor: "text-accent",
    bg: "bg-accent/5",
    border: "border-accent/20",
    description: "기술적 난이도와 성능 임팩트를 중심으로 한 엔지니어링 인사이트",
  },
  DIG: {
    label: "DIG",
    fullName: "Digital Innovation & Growth",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    description: "AI/ML, 자동화, 신기술 도입을 통한 혁신 사례",
  },
  GCC: {
    label: "GCC",
    fullName: "Global & Cross-Collaboration",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    description: "글로벌 팀 협업과 크로스 팀 조율에 관한 실전 경험",
  },
  WFA: {
    label: "WFA",
    fullName: "Workflow & Architecture",
    color: "bg-violet-500",
    textColor: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    description: "개발 워크플로우 최적화와 아키텍처 설계 인사이트",
  },
  AES: {
    label: "AES",
    fullName: "Accountability & Engineering Safety",
    color: "bg-red-500",
    textColor: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    description: "사고 회고, 보안, 엔지니어링 안전성에 관한 투명한 공유",
  },
  전체: {
    label: "전체",
    fullName: "All Categories",
    color: "bg-primary",
    textColor: "text-primary",
    bg: "bg-secondary",
    border: "border-border",
    description: "전체 카테고리의 모든 엔지니어링 인사이트",
  },
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  // "all" or missing → show 전체; otherwise uppercase for PPS/DIG/GCC/WFA/AES
  const rawCat = category?.toLowerCase();
  const cat = !rawCat || rawCat === "all" ? "전체" : rawCat.toUpperCase();
  const meta = categoryMeta[cat] || categoryMeta["전체"];

  const allPosts = getAllPosts();
  const posts =
    cat === "전체"
      ? allPosts
      : allPosts.filter((p) => p.category === cat);
  const sorted = [...posts].sort((a, b) => b.aciScore - a.aciScore);

  // Stats
  const avgAci =
    posts.length > 0
      ? Math.round(posts.reduce((s, p) => s + p.aciScore, 0) / posts.length)
      : 0;
  const topPost = sorted[0];
  const avgBreakdown = posts.length > 0
    ? {
        pps: Math.round(posts.reduce((s, p) => s + p.aciBreakdown.pps, 0) / posts.length),
        dig: Math.round(posts.reduce((s, p) => s + p.aciBreakdown.dig, 0) / posts.length),
        gcc: Math.round(posts.reduce((s, p) => s + p.aciBreakdown.gcc, 0) / posts.length),
        wfa: Math.round(posts.reduce((s, p) => s + p.aciBreakdown.wfa, 0) / posts.length),
      }
    : { pps: 0, dig: 0, gcc: 0, wfa: 0 };

  if (!categoryMeta[cat]) {
    return <NotFoundInline message="카테고리를 찾을 수 없습니다." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className={`border-b border-border py-14 ${meta.bg}`}>
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/"
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                홈
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-[13px] text-foreground font-medium">{meta.label}</span>
            </div>
            <div className="flex items-start justify-between gap-8">
              <div>
                <h1 className={`text-[40px] font-extrabold ${meta.textColor} leading-none mb-2`}>
                  {meta.label}
                </h1>
                <p className="text-[16px] font-semibold text-foreground mb-3">{meta.fullName}</p>
                <p className="text-[14px] text-muted-foreground max-w-md">{meta.description}</p>
              </div>
              {posts.length > 0 && (
                <div className="hidden md:flex flex-col items-center gap-1 flex-shrink-0">
                  <AciRadarChart scores={avgBreakdown} size="md" showLabels />
                  <p className="text-[11px] text-muted-foreground mt-1">카테고리 평균</p>
                </div>
              )}
            </div>

            {/* Stats */}
            {posts.length > 0 && (
              <div className="flex gap-6 mt-6">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">아티클 수</p>
                  <p className="text-[22px] font-extrabold text-foreground">{posts.length}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">평균 ACI</p>
                  <p className={`text-[22px] font-extrabold ${meta.textColor}`}>{avgAci}</p>
                </div>
                {topPost && (
                  <div>
                    <p className="text-[11px] text-muted-foreground mb-1">최고 ACI</p>
                    <p className="text-[22px] font-extrabold text-foreground">
                      {topPost.aciScore}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Category tabs */}
        <section className="border-b border-border bg-background">
          <div className="container max-w-4xl">
            <div className="flex gap-1 py-3 overflow-x-auto">
              {categories.map((c) => {
                const catPath = c === "전체" ? "/category/all" : `/category/${c.toLowerCase()}`;
                const isActive = c === cat || (c === "전체" && cat === "전체");
                return (
                  <Link
                    key={c}
                    to={catPath}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {c}
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
                <p className="text-[17px] font-semibold text-foreground mb-2">
                  아직 아티클이 없습니다
                </p>
                <p className="text-[14px] text-muted-foreground">
                  이 카테고리의 첫 번째 아티클을 기다리고 있습니다.
                </p>
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
