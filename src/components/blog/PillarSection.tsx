import { motion } from "framer-motion";
import { Brain, Bot, Globe, Workflow } from "lucide-react";

const pillars = [
  {
    key: "PPS",
    label: "Problem Solving",
    desc: "아키텍처 설계, 알고리즘 최적화, 논리적 문제 해결",
    icon: Brain,
    score: 210,
  },
  {
    key: "DIG",
    label: "AI & Automation",
    desc: "AI 도구 활용, 자동화 워크플로우 구축",
    icon: Bot,
    score: 185,
  },
  {
    key: "GCC",
    label: "Communication",
    desc: "글로벌 협업, 비동기 소통, 문서화 프로세스",
    icon: Globe,
    score: 195,
  },
  {
    key: "WFA",
    label: "Workflow",
    desc: "CI/CD, 개발 생산성, 프로세스 자동화",
    icon: Workflow,
    score: 160,
  },
];

const PillarSection = () => {
  return (
    <section id="pillars" className="py-20 md:py-28 surface-subtle">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
            ACI Pillars
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            4가지 핵심 역량 축
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 hover:border-accent/30 hover:glow-accent transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <p.icon size={20} className="text-accent" />
              </div>
              <div className="text-xs font-bold text-accent mb-1">{p.key}</div>
              <h3 className="text-base font-bold text-foreground mb-2">{p.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">{p.score}</span>
                <span className="text-xs text-muted-foreground">/ 250</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${(p.score / 250) * 100}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarSection;
