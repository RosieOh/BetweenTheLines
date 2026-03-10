import { Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import AciRadarChart from "@/components/blog/AciRadarChart";

const team = [
  { name: "김현우", role: "Backend Engineer", specialty: "대규모 시스템 설계 · Kafka · EDA" },
  { name: "이서연", role: "ML Engineer", specialty: "AI/ML 도입 · 자동화 파이프라인" },
  { name: "박민석", role: "Engineering Manager", specialty: "글로벌 팀 협업 · 조직 문화" },
  { name: "정다은", role: "Security Engineer", specialty: "보안 아키텍처 · 컴플라이언스" },
  { name: "최준혁", role: "DevOps Engineer", specialty: "CI/CD · 인프라 자동화" },
];

const values = [
  {
    title: "투명성",
    description:
      "실패와 사고도 솔직하게 공유합니다. 좋은 회고 하나가 팀 전체의 실력을 높입니다.",
  },
  {
    title: "정량적 평가",
    description:
      "ACI 스코어를 통해 기술적 가치를 수치로 측정합니다. 주관적 판단보다 데이터로 이야기합니다.",
  },
  {
    title: "실전 중심",
    description:
      "이론보다 현장 경험을 우선합니다. 실제 프로덕션에서 검증된 솔루션만 공유합니다.",
  },
  {
    title: "지속적 성장",
    description:
      "엔지니어링은 완성이 없습니다. 배움을 멈추지 않고 더 나은 방법을 끊임없이 탐구합니다.",
  },
];

const demoScores = { pps: 210, dig: 230, gcc: 195, wfa: 225 };

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border py-20">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              About
            </p>
            <h1 className="text-[40px] md:text-[60px] font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
              THE LOGIC
              <br />
              <span className="text-muted-foreground">by Hyperwise</span>
            </h1>
            <p className="text-[18px] text-muted-foreground leading-relaxed max-w-2xl">
              Hyperwise Studio 엔지니어들이 만드는 기술 블로그입니다.
              현장에서 검증된 엔지니어링 인사이트를 ACI 스코어 시스템으로 평가하여 공유합니다.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
                  미션
                </p>
                <h2 className="text-[28px] font-extrabold text-foreground mb-5 leading-snug">
                  엔지니어링의 로직을
                  <br />
                  투명하게 기록합니다
                </h2>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                  좋은 엔지니어링은 코드 한 줄에 있지 않습니다. 문제를 정의하는 방식,
                  트레이드오프를 분석하는 시각, 실패로부터 배우는 자세에 있습니다.
                </p>
                <p className="text-[15px] text-muted-foreground leading-relaxed">
                  THE LOGIC은 그 과정을 정직하게 기록합니다. 성공한 사례만이 아니라
                  실패와 사고도 공유하며, 그로부터 배운 교훈을 ACI 시스템으로 평가합니다.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <AciRadarChart scores={demoScores} size="lg" showLabels />
                <p className="text-[13px] text-muted-foreground">Hyperwise 평균 ACI</p>
              </div>
            </div>
          </div>
        </section>

        {/* ACI Origin */}
        <section className="border-t border-border py-16 bg-secondary/20">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              ACI 시스템 탄생 배경
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-5">
              왜 ACI 스코어가 필요했나
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background rounded-2xl border border-border p-6">
                <p className="text-[13px] font-bold text-foreground mb-3">문제</p>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  기술 블로그의 가치를 측정하는 기준이 없었습니다.
                  페이지뷰나 좋아요 수는 인기도를 반영할 뿐,
                  실제 기술적 깊이나 조직 기여도를 측정하지 못했습니다.
                </p>
              </div>
              <div className="bg-background rounded-2xl border border-border p-6">
                <p className="text-[13px] font-bold text-foreground mb-3">해결책</p>
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  PPS · DIG · GCC · WFA 4개 역량 축으로 아티클을 평가하는
                  ACI(Adaptive Competency Index) 시스템을 개발했습니다.
                  각 필러는 최대 250점, 총 1,000점 만점입니다.
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Link
                to="/aci-pillars"
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                ACI Pillars 자세히 보기 →
              </Link>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-border py-16">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              가치관
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-8">
              우리가 지향하는 것
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="bg-secondary rounded-2xl border border-border p-6">
                  <h3 className="text-[16px] font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="border-t border-border py-16 bg-secondary/20">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              팀
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-8">
              Hyperwise 엔지니어링팀
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {team.map((member) => (
                <Link
                  key={member.name}
                  to={`/author/${encodeURIComponent(member.name)}`}
                  className="bg-background rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-foreground group-hover:text-accent transition-colors">
                        {member.name}
                      </p>
                      <p className="text-[12px] text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    {member.specialty}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contribution guide */}
        <section className="border-t border-border py-16">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              기고 가이드
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-5">
              아티클 작성 가이드라인
            </h2>
            <div className="flex flex-col gap-3">
              {[
                "실제 프로덕션 경험을 바탕으로 작성해야 합니다.",
                "정량적 데이터(수치, 비율, 개선율)를 포함해야 합니다.",
                "실패 사례와 교훈을 포함하면 ACI 점수에 긍정적입니다.",
                "AES 관련 사고는 투명하게 공유하며, 재발 방지 대책을 명시해야 합니다.",
                "코드 예시는 실제 동작하는 코드여야 합니다.",
                "최소 7분 이상 읽기 분량을 권장합니다.",
              ].map((guide, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[11px] font-bold text-muted-foreground flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-[14px] text-foreground/80">{guide}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
};

export default About;
