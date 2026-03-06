import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center"
          style={{ background: "var(--brand-gradient)" }}
        >
          <div className="relative z-10">
            <p className="text-sm font-semibold text-primary-foreground/70 uppercase tracking-widest mb-4">
              Hyperwise Studio
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-5">
              이 기술력을 당신의
              <br />
              프로젝트에 적용하세요
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
              ACI 프레임워크로 검증된 하이퍼와이즈의 엔지니어링 역량을
              <br className="hidden md:block" />
              당신의 비즈니스에 연결합니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary-foreground text-primary font-bold text-sm hover:opacity-90 transition-opacity"
              >
                프로젝트 문의하기
                <ArrowRight size={16} />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors"
              >
                채용 공고 보기
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
