import { useState } from "react";
import { X, Send, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { validateEmail } from "@/lib/utils";
import { saveInquiry } from "@/lib/postStorage";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const ContactModal = ({ open, onClose }: ContactModalProps) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "이름을 입력해주세요.";
    if (!form.email.trim()) e.email = "이메일을 입력해주세요.";
    else if (!validateEmail(form.email)) e.email = "올바른 이메일 형식이 아닙니다.";
    if (!form.message.trim()) e.message = "문의 내용을 입력해주세요.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    saveInquiry(form);
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm({ name: "", email: "", company: "", message: "" });
      setErrors({});
      setSubmitted(false);
    }, 300);
  };

  const Field = ({
    label, id, type = "text", value, error, onChange, placeholder, required,
  }: {
    label: string; id: keyof typeof form; type?: string; value: string;
    error?: string; onChange: (v: string) => void; placeholder: string; required?: boolean;
  }) => (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-foreground mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => { onChange(e.target.value); setErrors((prev) => ({ ...prev, [id]: undefined })); }}
        placeholder={placeholder}
        className={`w-full h-10 px-3.5 rounded-xl border bg-background text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
          error ? "border-red-400 focus:ring-red-200" : "border-border focus:ring-accent/30 focus:border-accent"
        }`}
      />
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md bg-background rounded-2xl border border-border shadow-2xl pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-5 border-b border-border">
                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                    Between the Lines
                  </p>
                  <h2 className="text-[20px] font-extrabold text-foreground">프로젝트 문의</h2>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="닫기"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field
                      label="이름" id="name" value={form.name} error={errors.name}
                      placeholder="홍길동" required
                      onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    />
                    <Field
                      label="이메일" id="email" type="email" value={form.email} error={errors.email}
                      placeholder="your@email.com" required
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    />
                    <Field
                      label="회사 / 팀" id="company" value={form.company} error={errors.company}
                      placeholder="(선택)"
                      onChange={(v) => setForm((f) => ({ ...f, company: v }))}
                    />
                    <div>
                      <label htmlFor="message" className="block text-[13px] font-semibold text-foreground mb-1.5">
                        문의 내용<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => {
                          setForm((f) => ({ ...f, message: e.target.value }));
                          setErrors((prev) => ({ ...prev, message: undefined }));
                        }}
                        placeholder="프로젝트 개요, 일정, 예산 등을 자유롭게 적어주세요."
                        rows={4}
                        className={`w-full px-3.5 py-3 rounded-xl border bg-background text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors resize-none ${
                          errors.message
                            ? "border-red-400 focus:ring-red-200"
                            : "border-border focus:ring-accent/30 focus:border-accent"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[12px] text-red-500 mt-1">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity mt-1"
                    >
                      <Send size={15} />
                      문의 보내기
                    </button>
                    <p className="text-[11px] text-muted-foreground text-center">
                      평균 48시간 내 회신드립니다.
                    </p>
                  </form>
                ) : (
                  <div className="flex flex-col items-center text-center py-6 gap-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                      <CheckCircle size={28} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[18px] font-extrabold text-foreground mb-1">
                        문의가 접수되었습니다!
                      </p>
                      <p className="text-[14px] text-muted-foreground">
                        <span className="font-medium text-foreground">{form.email}</span>으로
                        <br />48시간 내 회신드리겠습니다.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
                    >
                      닫기
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
