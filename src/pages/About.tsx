import { Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";

const values = [
  {
    title: "기록하는 습관",
    description:
      "배운 것을 기록으로 남깁니다. 글을 쓰는 행위 자체가 이해를 깊게 하고, 미래의 나와 누군가에게 도움이 됩니다.",
  },
  {
    title: "실전 중심",
    description:
      "이론보다 현장에서 직접 부딪히며 얻은 경험을 우선합니다. 프로젝트에 적용해보고, 그 과정을 정직하게 공유합니다.",
  },
  {
    title: "꾸준한 성장",
    description:
      "개발은 완성이 없습니다. 배움을 멈추지 않고 더 나은 방법을 끊임없이 탐구하며 성장합니다.",
  },
  {
    title: "투명한 공유",
    description:
      "성공한 경험뿐 아니라 실패와 시행착오도 솔직하게 공유합니다. 좋은 회고 하나가 모두의 실력을 높입니다.",
  },
];

const skills = [
  { label: "Backend", tags: ["Java", "Spring Boot", "MySQL"] },
  { label: "Data", tags: ["Python", "pandas", "scikit-learn", "시계열 분석"] },
  { label: "Frontend", tags: ["React", "Vite", "TypeScript", "Tailwind CSS"] },
  { label: "DevOps", tags: ["Docker", "GitHub Actions", "Linux"] },
];

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
              Between the Lines
              <br />
              <span className="text-muted-foreground">by 오태훈</span>
            </h1>
            <p className="text-[18px] text-muted-foreground leading-relaxed max-w-2xl">
              오늘을 새롭게 내일을 이롭게 기록합니다.<br />
              얻은 지식을 프로젝트에 적용하고, 그 과정을 솔직하게 남기는 기술 블로그입니다.
            </p>
          </div>
        </section>

        {/* Profile */}
        <section className="py-16">
          <div className="container max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
                  소개
                </p>
                <h2 className="text-[28px] font-extrabold text-foreground mb-5 leading-snug">
                  기록하는 개발자<br />오태훈입니다
                </h2>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                  데이터 사이언스로 개발을 시작하여, 백엔드를 거쳐 다시 데이터와 프론트엔드까지
                  넓은 범위를 탐구하고 있습니다.
                </p>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
                  배운 것을 직접 프로젝트에 적용해보고, 그 과정에서 겪은 시행착오와 깨달음을
                  이 블로그에 기록합니다.
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/RosieOh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    GitHub →
                  </a>
                  <a
                    href="mailto:dhxogns920@gmail.com"
                    className="px-4 py-2 rounded-full border border-border text-foreground text-[13px] font-semibold hover:bg-secondary transition-colors"
                  >
                    이메일 보내기
                  </a>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-4">
                {skills.map((s) => (
                  <div key={s.label} className="bg-secondary rounded-2xl border border-border p-5">
                    <p className="text-[12px] font-bold text-muted-foreground mb-3">{s.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full bg-background border border-border text-[12px] text-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="border-t border-border py-16 bg-secondary/20">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              가치관
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-8">
              이 블로그가 추구하는 것
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="bg-background rounded-2xl border border-border p-6">
                  <h3 className="text-[16px] font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories guide */}
        <section className="border-t border-border py-16">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              카테고리
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-5">
              어떤 글을 쓰나요?
            </h2>
            <div className="flex flex-col gap-3">
              {[
                { cat: "SpringBoot", desc: "스프링부트 실전 개념과 예제" },
                { cat: "DataAnalysis", desc: "데이터 분석, 시계열, 머신러닝 경험" },
                { cat: "Frontend", desc: "React, Vite, TypeScript 개발 경험" },
                { cat: "DevOps", desc: "배포, 자동화, 인프라 관련 경험" },
                { cat: "회고", desc: "프로젝트·공모전 회고와 성장 기록" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[11px] font-bold text-muted-foreground flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <Link
                      to={`/category/${item.cat.toLowerCase()}`}
                      className="text-[14px] font-bold text-foreground hover:text-accent transition-colors"
                    >
                      {item.cat}
                    </Link>
                    <p className="text-[13px] text-muted-foreground">{item.desc}</p>
                  </div>
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
