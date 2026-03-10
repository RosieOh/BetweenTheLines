import { useParams, Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import AciRadarChart from "@/components/blog/AciRadarChart";
import AciBreakdownBars from "@/components/blog/AciBreakdownBars";
import NotFoundInline from "@/components/blog/NotFoundInline";
import { getAllPosts } from "@/lib/postStorage";

const AuthorPage = () => {
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name || "");

  const posts = getAllPosts().filter((p) => p.author === decodedName);
  const sorted = [...posts].sort((a, b) => b.aciScore - a.aciScore);

  if (!decodedName || posts.length === 0) {
    return <NotFoundInline message="저자를 찾을 수 없습니다." />;
  }

  const totalAci = posts.reduce((s, p) => s + p.aciScore, 0);
  const avgAci = Math.round(totalAci / posts.length);
  const topAci = sorted[0]?.aciScore ?? 0;

  const avgBreakdown = {
    pps: Math.round(posts.reduce((s, p) => s + p.aciBreakdown.pps, 0) / posts.length),
    dig: Math.round(posts.reduce((s, p) => s + p.aciBreakdown.dig, 0) / posts.length),
    gcc: Math.round(posts.reduce((s, p) => s + p.aciBreakdown.gcc, 0) / posts.length),
    wfa: Math.round(posts.reduce((s, p) => s + p.aciBreakdown.wfa, 0) / posts.length),
  };

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Profile header */}
        <section className="border-b border-border py-14 bg-secondary/20">
          <div className="container max-w-4xl">
            <div className="flex items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-extrabold text-primary-foreground">
                  {decodedName.charAt(0)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                  Author
                </p>
                <h1 className="text-[32px] font-extrabold text-foreground mb-1">
                  {decodedName}
                </h1>
                <p className="text-[14px] text-muted-foreground mb-4">
                  Hyperwise 엔지니어 · 대규모 시스템 설계와 성능 최적화 전문
                </p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/tag/${encodeURIComponent(tag)}`}
                      className="px-2.5 py-1 rounded-full bg-background border border-border text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats + Radar */}
        <section className="border-b border-border py-10">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Stats */}
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
                  ACI 통계
                </p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-secondary rounded-xl border border-border p-4 text-center">
                    <p className="text-[11px] text-muted-foreground mb-1">아티클</p>
                    <p className="text-[26px] font-extrabold text-foreground">{posts.length}</p>
                  </div>
                  <div className="bg-secondary rounded-xl border border-border p-4 text-center">
                    <p className="text-[11px] text-muted-foreground mb-1">평균 ACI</p>
                    <p className="text-[26px] font-extrabold text-accent">{avgAci}</p>
                  </div>
                  <div className="bg-secondary rounded-xl border border-border p-4 text-center">
                    <p className="text-[11px] text-muted-foreground mb-1">최고 ACI</p>
                    <p className="text-[26px] font-extrabold text-foreground">{topAci}</p>
                  </div>
                </div>

                {/* Breakdown bars */}
                <AciBreakdownBars breakdown={avgBreakdown} size="md" />
              </div>

              {/* Radar chart */}
              <div className="flex flex-col items-center gap-2">
                <AciRadarChart scores={avgBreakdown} size="lg" showLabels />
                <p className="text-[12px] text-muted-foreground">평균 ACI 레이더</p>
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-10">
          <div className="container max-w-4xl">
            <h2 className="text-[20px] font-extrabold text-foreground mb-5">
              {decodedName}의 아티클
            </h2>
            <div className="divide-y divide-border">
              {sorted.map((post) => (
                <BlogArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
};

export default AuthorPage;
