import { AlertTriangle, Shield, CheckCircle, FileText, Users, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { getAllPosts } from "@/lib/postStorage";

const principles = [
  {
    icon: Shield,
    title: "Safety by Default",
    description:
      "보안과 안전은 개인의 주의가 아닌 시스템 구조에서 보장되어야 합니다. 기본값이 안전한 방향으로 설계된 시스템을 지향합니다.",
  },
  {
    icon: FileText,
    title: "투명한 사고 보고",
    description:
      "사고를 숨기는 것이 아닌 투명하게 공유함으로써 조직 전체가 학습할 수 있는 문화를 만듭니다. 회고 문서는 필수입니다.",
  },
  {
    icon: Users,
    title: "책임 공유",
    description:
      "사고의 책임은 개인이 아닌 시스템과 프로세스에 있습니다. 블레임 없는 회고 문화(Blameless Postmortem)를 실천합니다.",
  },
  {
    icon: CheckCircle,
    title: "재발 방지 의무",
    description:
      "사고 발생 후 72시간 내 근본 원인 분석과 재발 방지 대책을 수립하고 문서화해야 합니다.",
  },
];

const penaltyTiers = [
  {
    severity: "Critical",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    penalty: "-100점",
    examples: "프로덕션 PII 노출, 대규모 서비스 다운(SLA 99% 이하)",
  },
  {
    severity: "High",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    penalty: "-50점",
    examples: "보안 취약점 미패치, 재해 복구 계획 부재로 인한 데이터 손실",
  },
  {
    severity: "Medium",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    penalty: "-25점",
    examples: "알려진 버그 방치, 모니터링 부재로 인한 사고 지연 발견",
  },
  {
    severity: "Low",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    penalty: "경고",
    examples: "코드 리뷰 절차 미준수, 문서화 누락",
  },
];

const bestPractices = [
  {
    title: "자동화된 보안 스캔",
    description: "SAST/DAST 도구를 CI 파이프라인에 통합하여 보안 취약점을 코드 머지 전에 자동으로 탐지합니다.",
    tags: ["SAST", "DAST", "CI/CD"],
  },
  {
    title: "PII 자동 마스킹",
    description: "로거에 PII 마스킹 레이어를 적용하여 개인정보가 로그에 노출되는 것을 시스템 수준에서 방지합니다.",
    tags: ["Privacy", "Logging", "Security"],
  },
  {
    title: "최소 권한 원칙",
    description: "프로덕션 환경 접근 권한을 최소화하고, 모든 접근을 감사 로그로 기록합니다.",
    tags: ["IAM", "Zero Trust", "Audit"],
  },
  {
    title: "블레임리스 포스트모텀",
    description: "사고 발생 시 개인을 탓하지 않고, 시스템과 프로세스의 개선점을 찾는 회고를 의무화합니다.",
    tags: ["Culture", "Postmortem", "Learning"],
  },
];

const AesGuardrail = () => {
  const allPosts = getAllPosts();
  const aesArticles = allPosts.filter((p) => p.category === "AES");
  const penaltyArticles = allPosts.filter((p) => p.hasAesPenalty);

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border py-16">
          <div className="container max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-red-500" />
              <p className="text-[11px] font-bold tracking-widest uppercase text-red-500">
                AES System
              </p>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-extrabold text-foreground leading-[1.15] tracking-tight mb-5">
              Accountability &
              <br />
              Engineering Safety
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed max-w-2xl mb-8">
              AES Guardrail은 엔지니어링 사고, 보안 취약점, 책임 회피 등을 식별하고
              ACI 스코어에 패널티를 부여하는 Hyperwise의 안전성 보장 시스템입니다.
              높은 기술력만큼이나 중요한 것은 안전하고 책임감 있는 엔지니어링입니다.
            </p>
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <p className="text-[14px] text-red-700">
                AES 패널티가 적용된 아티클은 카드에{" "}
                <span className="font-bold">AES 패널티</span> 배지가 표시됩니다.
                사고 공유 자체는 적극 장려되며, 패널티는 사고의 심각성과 대응 미흡에 부여됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              핵심 원칙
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-8">
              AES Guardrail 4대 원칙
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="bg-secondary rounded-2xl border border-border p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center">
                      <p.icon size={16} className="text-foreground" />
                    </div>
                    <h3 className="text-[15px] font-bold text-foreground">{p.title}</h3>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Penalty system */}
        <section className="border-t border-border py-16 bg-secondary/20">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              패널티 시스템
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-3">
              AES 패널티 등급
            </h2>
            <p className="text-[15px] text-muted-foreground mb-8">
              사고의 심각도에 따라 ACI 총점에서 일정 점수가 차감됩니다.
              단, 사고를 투명하게 공유하고 개선 조치를 상세히 기술한 경우 패널티가 경감될 수 있습니다.
            </p>
            <div className="flex flex-col gap-3">
              {penaltyTiers.map((tier) => (
                <div
                  key={tier.severity}
                  className={`rounded-xl border ${tier.border} ${tier.bg} p-5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[13px] font-bold ${tier.color}`}>
                          {tier.severity}
                        </span>
                      </div>
                      <p className="text-[13px] text-foreground/80">{tier.examples}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`text-[15px] font-extrabold ${tier.color}`}>
                        {tier.penalty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Best practices */}
        <section className="border-t border-border py-16">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              모범 사례
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-8">
              엔지니어링 안전성 Best Practices
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {bestPractices.map((bp) => (
                <div key={bp.title} className="bg-secondary rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock size={14} className="text-accent" />
                    <h3 className="text-[15px] font-bold text-foreground">{bp.title}</h3>
                  </div>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">
                    {bp.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {bp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-background border border-border text-[11px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AES Articles */}
        {aesArticles.length > 0 && (
          <section className="border-t border-border py-16 bg-secondary/20">
            <div className="container max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                    AES 카테고리
                  </p>
                  <h2 className="text-[24px] font-extrabold text-foreground">
                    사고 회고 · 보안 아티클
                  </h2>
                </div>
                <Link
                  to="/category/aes"
                  className="text-[13px] font-semibold text-accent hover:underline"
                >
                  전체 보기 →
                </Link>
              </div>
              <div className="divide-y divide-border">
                {aesArticles.map((post) => (
                  <BlogArticleCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Penalty articles */}
        {penaltyArticles.length > 0 && (
          <section className="border-t border-border py-16">
            <div className="container max-w-4xl">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle size={16} className="text-red-500" />
                <h2 className="text-[24px] font-extrabold text-foreground">
                  AES 패널티 적용 아티클
                </h2>
              </div>
              <p className="text-[14px] text-muted-foreground mb-6">
                아래 아티클들은 AES 패널티가 적용된 사례입니다.
                사고 공유와 투명한 회고를 통해 ACI 커뮤니티 전체가 학습합니다.
              </p>
              <div className="divide-y divide-border">
                {penaltyArticles.map((post) => (
                  <BlogArticleCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <BlogFooter />
    </div>
  );
};

export default AesGuardrail;
