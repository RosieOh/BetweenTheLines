import { useState } from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { saveSubscriber } from "@/lib/postStorage";
import { validateEmail } from "@/lib/utils";

const benefits = [
  {
    title: "주간 베스트 포스트",
    description: "매주 월요일, 이번 주 가장 많이 읽힌 아티클 5편을 선별해 보내드립니다.",
  },
  {
    title: "기술 인사이트 요약",
    description: "긴 아티클을 읽을 시간이 없을 때, 핵심 인사이트만 추출한 요약을 제공합니다.",
  },
  {
    title: "새 포스트 알림",
    description: "새로운 포스트가 올라오면 가장 먼저 이메일로 알려드립니다.",
  },
  {
    title: "개발 커뮤니티 소식",
    description: "주목할 만한 오픈소스, 기술 트렌드, 개발자 커뮤니티 이벤트 소식을 전달합니다.",
  },
];

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("이메일 주소를 입력해주세요.");
      return;
    }
    if (!validateEmail(email)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }
    setError("");
    saveSubscriber(email.trim());
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border py-20">
          <div className="container max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={16} className="text-accent" />
              <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
                Newsletter
              </p>
            </div>
            <h1 className="text-[36px] md:text-[52px] font-extrabold text-foreground leading-[1.15] tracking-tight mb-5">
              Between the Lines
              <br />
              뉴스레터
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed max-w-xl mb-8">
              매주 최고의 기술 인사이트를 이메일로 받아보세요.
              새 포스트 알림부터 개발 트렌드까지, 놓치면 아쉬운 콘텐츠를 선별해 전달합니다.
            </p>

            {/* Subscription form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
                <label htmlFor="hero-email" className="sr-only">이메일 주소</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      id="hero-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="your@email.com"
                      aria-describedby={error ? "hero-email-error" : undefined}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    구독하기
                    <ArrowRight size={14} />
                  </button>
                </div>
                {error && (
                  <p id="hero-email-error" role="alert" className="text-[13px] text-red-500">{error}</p>
                )}
                <p className="text-[12px] text-muted-foreground">
                  스팸 메일은 절대 보내지 않으며, 언제든지 구독을 해지할 수 있습니다.
                </p>
              </form>
            ) : (
              <div className="flex items-start gap-4 p-6 bg-secondary rounded-2xl border border-border max-w-md">
                <CheckCircle size={24} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[16px] font-bold text-foreground mb-1">
                    구독이 완료되었습니다!
                  </p>
                  <p className="text-[14px] text-muted-foreground">
                    <span className="font-medium text-foreground">{email}</span>으로
                    다음 뉴스레터를 보내드리겠습니다.
                    매주 월요일 오전 9시에 발송됩니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container max-w-3xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              구독 혜택
            </p>
            <h2 className="text-[24px] font-extrabold text-foreground mb-8">
              매주 이런 내용을 받아보실 수 있습니다
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="bg-secondary rounded-2xl border border-border p-6">
                  <p className="text-[15px] font-bold text-foreground mb-2">{b.title}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-t border-border py-16 bg-secondary/20">
          <div className="container max-w-3xl">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-[36px] font-extrabold text-foreground mb-1">2,400+</p>
                <p className="text-[14px] text-muted-foreground">구독자</p>
              </div>
              <div>
                <p className="text-[36px] font-extrabold text-foreground mb-1">48%</p>
                <p className="text-[14px] text-muted-foreground">평균 오픈율</p>
              </div>
              <div>
                <p className="text-[36px] font-extrabold text-foreground mb-1">매주</p>
                <p className="text-[14px] text-muted-foreground">월요일 발송</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        {!submitted && (
          <section className="border-t border-border py-16">
            <div className="container max-w-3xl text-center">
              <h2 className="text-[24px] font-extrabold text-foreground mb-3">
                지금 바로 구독하세요
              </h2>
              <p className="text-[14px] text-muted-foreground mb-6">
                무료이며, 언제든지 해지할 수 있습니다.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto"
              >
                <label htmlFor="cta-email" className="sr-only">이메일 주소</label>
                <input
                  id="cta-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
                >
                  구독
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      <BlogFooter />
    </div>
  );
};

export default Newsletter;
