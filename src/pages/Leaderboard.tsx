import { Link } from "react-router-dom";
import { Trophy, TrendingUp, Star, AlertTriangle } from "lucide-react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { getAllPosts } from "@/lib/postStorage";
import { categoryStyles } from "@/lib/categoryConfig";

// Rank medal colors
function getMedal(rank: number) {
  if (rank === 1) return { color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" };
  if (rank === 2) return { color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" };
  if (rank === 3) return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
  return { color: "text-muted-foreground", bg: "bg-background", border: "border-border" };
}

// Author stats
function buildAuthorStats(allPosts: ReturnType<typeof getAllPosts>) {
  const map: Record<string, { author: string; posts: typeof allPosts }> = {};
  allPosts.forEach((p) => {
    if (!map[p.author]) map[p.author] = { author: p.author, posts: [] };
    map[p.author].posts.push(p);
  });
  return Object.values(map)
    .map(({ author, posts }) => ({
      author,
      count: posts.length,
      avgAci: Math.round(posts.reduce((s, p) => s + p.aciScore, 0) / posts.length),
      topAci: Math.max(...posts.map((p) => p.aciScore)),
    }))
    .sort((a, b) => b.avgAci - a.avgAci);
}

const Leaderboard = () => {
  const allPosts = getAllPosts();
  const sortedByAci = [...allPosts].sort((a, b) => b.aciScore - a.aciScore);
  const authorStats = buildAuthorStats(allPosts);

  const categoryBest: Record<string, typeof allPosts[0]> = {};
  ["PPS", "DIG", "GCC", "WFA", "AES"].forEach((cat) => {
    const best = allPosts.filter((p) => p.category === cat).sort((a, b) => b.aciScore - a.aciScore)[0];
    if (best) categoryBest[cat] = best;
  });

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border py-14 bg-secondary/20">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={16} className="text-yellow-500" />
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                ACI Leaderboard
              </p>
            </div>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-foreground leading-[1.2] mb-3">
              ACI 리더보드
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-xl">
              ACI 스코어를 기준으로 아티클과 저자를 순위별로 정렬합니다.
              높은 기술적 가치와 조직 기여도를 가진 아티클이 상위를 차지합니다.
            </p>
          </div>
        </section>

        <div className="container max-w-4xl py-12 flex flex-col gap-16">
          {/* Article rankings */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Star size={16} className="text-yellow-500" />
              <h2 className="text-[22px] font-extrabold text-foreground">전체 아티클 순위</h2>
            </div>
            <div className="flex flex-col gap-3">
              {sortedByAci.map((post, i) => {
                const medal = getMedal(i + 1);
                return (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className={`flex items-center gap-4 rounded-2xl border ${medal.border} p-5 hover:shadow-sm transition-shadow group`}
                  >
                    {/* Rank */}
                    <div
                      className={`w-10 h-10 rounded-xl ${medal.bg} border ${medal.border} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className={`text-[15px] font-extrabold ${medal.color}`}>{i + 1}</span>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            categoryStyles[post.category]
                          }`}
                        >
                          {post.category}
                        </span>
                        {post.hasAesPenalty && (
                          <AlertTriangle size={12} className="text-red-500" />
                        )}
                        <span className="text-[12px] text-muted-foreground">{post.author}</span>
                      </div>
                      <p className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                        {post.title}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-[20px] font-extrabold ${medal.color}`}>
                        {post.aciScore}
                      </p>
                      <p className="text-[11px] text-muted-foreground">/ 1000</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Author rankings */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={16} className="text-accent" />
              <h2 className="text-[22px] font-extrabold text-foreground">저자별 평균 ACI 순위</h2>
            </div>
            <div className="flex flex-col gap-3">
              {authorStats.map((stat, i) => {
                const medal = getMedal(i + 1);
                return (
                  <Link
                    key={stat.author}
                    to={`/author/${encodeURIComponent(stat.author)}`}
                    className={`flex items-center gap-4 rounded-2xl border ${medal.border} p-5 hover:shadow-sm transition-shadow group`}
                  >
                    {/* Rank */}
                    <div
                      className={`w-10 h-10 rounded-xl ${medal.bg} border ${medal.border} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className={`text-[15px] font-extrabold ${medal.color}`}>{i + 1}</span>
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
                      {stat.author.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-foreground group-hover:text-accent transition-colors">
                        {stat.author}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        아티클 {stat.count}개 · 최고 ACI {stat.topAci}
                      </p>
                    </div>

                    {/* Avg ACI */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-[20px] font-extrabold ${medal.color}`}>{stat.avgAci}</p>
                      <p className="text-[11px] text-muted-foreground">평균</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Category best */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Trophy size={16} className="text-accent" />
              <h2 className="text-[22px] font-extrabold text-foreground">카테고리별 최고 점수</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(categoryBest).map(([cat, post]) => (
                <Link
                  key={cat}
                  to={`/post/${post.id}`}
                  className="rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded text-[12px] font-bold ${categoryStyles[cat]}`}
                    >
                      {cat}
                    </span>
                    <span className="text-[18px] font-extrabold text-foreground">
                      {post.aciScore}
                    </span>
                  </div>
                  <p className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground">{post.author}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};

export default Leaderboard;
