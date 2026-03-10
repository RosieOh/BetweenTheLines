import { Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { getAllPosts } from "@/lib/postStorage";

const categoryMeta = [
  {
    key: "PPS",
    label: "Problem & Performance Scale",
    color: "bg-accent",
    textColor: "text-accent",
    bg: "bg-accent/5",
    border: "border-accent/20",
    description: "대규모 시스템 설계, 성능 최적화, 장애 대응 전략",
  },
  {
    key: "DIG",
    label: "Digital Innovation & Growth",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    description: "AI/ML 도입, 자동화, 신기술 적용 사례",
  },
  {
    key: "GCC",
    label: "Global & Cross-Collaboration",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    description: "글로벌 팀 협업, 원격 근무, 커뮤니케이션 프로토콜",
  },
  {
    key: "WFA",
    label: "Workflow & Architecture",
    color: "bg-violet-500",
    textColor: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    description: "CI/CD 최적화, 아키텍처 설계, 개발 생산성",
  },
  {
    key: "AES",
    label: "Accountability & Engineering Safety",
    color: "bg-red-500",
    textColor: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    description: "보안 사고 회고, 안전한 엔지니어링 문화",
  },
];

const Engineering = () => {
  const allPosts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border py-16">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Engineering Overview
            </p>
            <h1 className="text-[36px] md:text-[52px] font-extrabold text-foreground leading-[1.15] tracking-tight mb-5">
              Engineering
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
              Hyperwise 엔지니어들의 실전 경험을 5개 역량 카테고리로 분류하여 공유합니다.
              ACI 시스템을 통해 각 아티클의 기술적 가치를 객관적으로 평가합니다.
            </p>
          </div>
        </section>

        {/* Category sections */}
        <div className="container max-w-4xl py-12 flex flex-col gap-16">
          {categoryMeta.map((cat) => {
            const posts = allPosts
              .filter((p) => p.category === cat.key)
              .sort((a, b) => b.aciScore - a.aciScore)
              .slice(0, 3);

            return (
              <section key={cat.key}>
                <div className={`rounded-2xl border ${cat.border} ${cat.bg} p-6 mb-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                        <h2 className={`text-[22px] font-extrabold ${cat.textColor}`}>
                          {cat.key}
                        </h2>
                      </div>
                      <p className="text-[14px] font-semibold text-foreground mb-1">{cat.label}</p>
                      <p className="text-[13px] text-muted-foreground">{cat.description}</p>
                    </div>
                    <Link
                      to={`/category/${cat.key.toLowerCase()}`}
                      className={`flex-shrink-0 text-[13px] font-semibold ${cat.textColor} hover:underline`}
                    >
                      전체 보기 →
                    </Link>
                  </div>
                </div>

                {posts.length > 0 ? (
                  <div className="divide-y divide-border">
                    {posts.map((post) => (
                      <BlogArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-[14px] text-muted-foreground">
                    아직 아티클이 없습니다.
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* ACI CTA */}
        <section className="border-t border-border py-16 bg-secondary/20">
          <div className="container max-w-4xl text-center">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              ACI System
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-3">
              ACI 스코어 시스템이란?
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-xl mx-auto mb-6">
              모든 아티클은 PPS · DIG · GCC · WFA 4개 필러로 평가되며,
              총 1,000점 만점의 ACI 스코어가 부여됩니다.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                to="/aci-pillars"
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                ACI Pillars 알아보기
              </Link>
              <Link
                to="/leaderboard"
                className="px-5 py-2.5 rounded-full border border-border text-foreground text-[13px] font-semibold hover:bg-secondary transition-colors"
              >
                ACI 리더보드 →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
};

export default Engineering;
