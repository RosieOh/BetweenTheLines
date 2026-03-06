import { motion } from "framer-motion";
import AciRadarChart from "./AciRadarChart";

const HeroSection = () => {
  const avgScores = { pps: 210, dig: 185, gcc: 195, wfa: 160 };
  const total = avgScores.pps + avgScores.dig + avgScores.gcc + avgScores.wfa;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 surface-subtle" />
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 70% 30%, hsl(var(--brand-glow) / 0.15), transparent 60%)"
        }}
      />

      <div className="container relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              ACI Framework Live
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-5">
              가장 논리적인
              <br />
              <span className="text-gradient">기술 집단</span>의 기록
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              하이퍼와이즈 엔지니어들의 문제 해결 과정, 아키텍처 설계, 그리고 실패로부터의 교훈을 ACI 프레임워크로 정량화합니다.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#posts"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                아티클 탐색하기
              </a>
              <a
                href="#methodology"
                className="px-6 py-3 rounded-lg border border-border text-foreground font-semibold text-sm hover:bg-secondary transition-colors"
              >
                ACI란?
              </a>
            </div>
          </motion.div>

          {/* Right: Live ACI Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="bg-card rounded-2xl border border-border p-8 glow-accent">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                Hyperwise Average
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                팀 평균 ACI 지수
              </p>
              <AciRadarChart scores={avgScores} size="lg" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
