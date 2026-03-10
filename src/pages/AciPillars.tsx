import { Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import AciRadarChart from "@/components/blog/AciRadarChart";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { getAllPosts } from "@/lib/postStorage";

const pillars = [
  {
    key: "pps",
    short: "PPS",
    label: "Problem & Performance Scale",
    color: "bg-accent",
    textColor: "text-accent",
    borderColor: "border-accent/30",
    bgColor: "bg-accent/5",
    score: 250,
    description:
      "기술적 난이도와 성능 임팩트를 평가합니다. 대규모 시스템에서의 병목 해결, 레이턴시 개선, 처리량 향상 등 정량적으로 측정 가능한 엔지니어링 성과에 높은 점수를 부여합니다.",
    criteria: [
      "문제의 기술적 복잡도 및 난이도",
      "성능 개선의 정량적 임팩트 (TPS, 레이턴시, 가용성)",
      "장애 규모와 복구 시간(MTTR)",
      "솔루션의 독창성 및 재현 가능성",
    ],
    example: "초당 50,000건 이벤트 처리 시스템 설계, P99 레이턴시 90% 감소",
  },
  {
    key: "dig",
    short: "DIG",
    label: "Digital Innovation & Growth",
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-50",
    score: 250,
    description:
      "AI/ML, 자동화, 신기술 도입을 통한 혁신과 팀·조직의 성장 기여도를 평가합니다. 새로운 도구나 방법론을 조직에 성공적으로 정착시키는 것도 포함됩니다.",
    criteria: [
      "신기술 도입 및 조직 내 확산 기여",
      "자동화로 인한 공수 절감 효과",
      "AI/ML 활용 수준과 실제 효과",
      "팀 역량 성장에 대한 기여",
    ],
    example: "GPT-4o 코드 리뷰 자동화로 초기 리뷰 시간 2.3일 → 3분 단축",
  },
  {
    key: "gcc",
    short: "GCC",
    label: "Global & Cross-Collaboration",
    color: "bg-amber-500",
    textColor: "text-amber-600",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-50",
    score: 250,
    description:
      "글로벌 팀 협업, 크로스 팀 조율, 조직 문화 개선 활동을 평가합니다. 시차와 언어 장벽을 넘어 효율적으로 협업하는 능력과 그 결과물을 측정합니다.",
    criteria: [
      "다국적 팀과의 협업 효율성",
      "비동기 커뮤니케이션 문화 구축",
      "크로스 팀 프로젝트 성과",
      "조직 문화 개선 기여",
    ],
    example: "4개국 8명 팀의 비동기 협업 프로토콜 수립, 대기 시간 71%→23% 감소",
  },
  {
    key: "wfa",
    short: "WFA",
    label: "Workflow & Architecture",
    color: "bg-violet-500",
    textColor: "text-violet-600",
    borderColor: "border-violet-500/30",
    bgColor: "bg-violet-50",
    score: 250,
    description:
      "개발 워크플로우 최적화, 아키텍처 설계의 품질과 지속 가능성을 평가합니다. CI/CD 파이프라인, 코드 품질, 시스템 유지보수성 등을 종합적으로 측정합니다.",
    criteria: [
      "CI/CD 파이프라인 최적화 수준",
      "아키텍처 설계의 확장성과 유지보수성",
      "개발 생산성 향상 정도",
      "기술 부채 관리 및 코드 품질",
    ],
    example: "Docker 레이어 캐싱 + 테스트 병렬화로 배포 시간 15분 → 5분 단축",
  },
];

const demoScores = { pps: 200, dig: 220, gcc: 185, wfa: 210 };

const AciPillars = () => {
  const allPosts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border py-16">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              ACI System
            </p>
            <h1 className="text-[36px] md:text-[52px] font-extrabold text-foreground leading-[1.15] tracking-tight mb-5">
              Adaptive Competency
              <br />
              Index Pillars
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed max-w-2xl mb-8">
              ACI(Adaptive Competency Index)는 엔지니어링 아티클의 기술적 가치와 조직 기여도를
              4가지 핵심 역량 축으로 평가하는 Hyperwise의 독자적인 스코어링 시스템입니다.
              총점은 1,000점으로 각 필러는 최대 250점입니다.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <AciRadarChart scores={demoScores} size="lg" showLabels />
              </div>
              <div className="flex flex-col gap-3">
                {pillars.map((p) => (
                  <div key={p.key} className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${p.color}`} />
                    <span className="text-[13px] font-semibold text-foreground">{p.short}</span>
                    <span className="text-[13px] text-muted-foreground">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pillars detail */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="flex flex-col gap-12">
              {pillars.map((p, i) => {
                const categoryPosts = allPosts
                  .filter((post) => post.category === p.short)
                  .sort((a, b) => b.aciScore - a.aciScore);

                return (
                  <div
                    key={p.key}
                    className={`rounded-2xl border ${p.borderColor} ${p.bgColor} p-8`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`text-[11px] font-bold tracking-widest uppercase ${p.textColor}`}
                          >
                            Pillar {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h2 className={`text-[28px] font-extrabold ${p.textColor} mb-1`}>
                          {p.short}
                        </h2>
                        <p className="text-[16px] font-semibold text-foreground">{p.label}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[11px] text-muted-foreground mb-1">최대 점수</p>
                        <p className={`text-[32px] font-extrabold ${p.textColor}`}>
                          {p.score}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-[15px] text-foreground/80 leading-relaxed mb-6">
                      {p.description}
                    </p>

                    {/* Criteria */}
                    <div className="mb-6">
                      <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                        평가 기준
                      </p>
                      <ul className="flex flex-col gap-2">
                        {p.criteria.map((c, ci) => (
                          <li key={ci} className="flex items-start gap-2 text-[14px] text-foreground/75">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${p.color} flex-shrink-0`} />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Example */}
                    <div className="bg-background/60 rounded-xl p-4 mb-6 border border-border/50">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        고득점 사례
                      </p>
                      <p className="text-[14px] text-foreground">{p.example}</p>
                    </div>

                    {/* Related articles */}
                    {categoryPosts.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                            {p.short} 카테고리 아티클
                          </p>
                          <Link
                            to={`/category/${p.short.toLowerCase()}`}
                            className={`text-[13px] font-semibold ${p.textColor} hover:underline`}
                          >
                            전체 보기 →
                          </Link>
                        </div>
                        <div className="divide-y divide-border/50">
                          {categoryPosts.map((post) => (
                            <BlogArticleCard key={post.id} post={post} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How scoring works */}
        <section className="border-t border-border py-16 bg-secondary/30">
          <div className="container max-w-4xl">
            <h2 className="text-[24px] font-extrabold text-foreground mb-3">
              ACI 스코어 산정 방식
            </h2>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              각 아티클은 4개 필러에 대해 독립적으로 평가됩니다. AES 패널티가 적용된 아티클은
              총점에서 일정 점수가 차감될 수 있습니다.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-background rounded-xl border border-border p-5">
                <p className="text-[13px] font-bold text-foreground mb-2">총점 계산</p>
                <p className="text-[13px] text-muted-foreground">
                  ACI = PPS + DIG + GCC + WFA (- AES 패널티)
                  <br />
                  최대 1,000점 (각 필러 250점 × 4)
                </p>
              </div>
              <div className="bg-background rounded-xl border border-border p-5">
                <p className="text-[13px] font-bold text-foreground mb-2">등급 구분</p>
                <div className="flex flex-col gap-1 text-[13px] text-muted-foreground">
                  <div className="flex justify-between">
                    <span>700점 이상</span>
                    <span className="text-accent font-semibold">Featured</span>
                  </div>
                  <div className="flex justify-between">
                    <span>500~699점</span>
                    <span className="font-medium text-foreground">Standard</span>
                  </div>
                  <div className="flex justify-between">
                    <span>500점 미만</span>
                    <span className="text-muted-foreground">Draft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
};

export default AciPillars;
