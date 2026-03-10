import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Eye, EyeOff, Save, AlertTriangle } from "lucide-react";
import {
  isAuthenticated,
  getAllPosts,
  savePost,
  generateId,
} from "@/lib/postStorage";
import type { PostData } from "@/data/posts";

import thumbArchitecture from "@/assets/thumb-architecture.jpg";
import thumbAiReview from "@/assets/thumb-ai-review.jpg";
import thumbCommunication from "@/assets/thumb-communication.jpg";
import thumbSecurity from "@/assets/thumb-security.jpg";
import thumbCicd from "@/assets/thumb-cicd.jpg";

const THUMBNAIL_OPTIONS = [
  { label: "Architecture", src: thumbArchitecture },
  { label: "AI Review", src: thumbAiReview },
  { label: "Communication", src: thumbCommunication },
  { label: "Security", src: thumbSecurity },
  { label: "CI/CD", src: thumbCicd },
];

const CATEGORIES = ["PPS", "DIG", "GCC", "WFA", "AES"] as const;

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}.`;
};

const emptyPost = (): Omit<PostData, "id"> => ({
  title: "",
  excerpt: "",
  category: "PPS",
  author: "",
  date: today(),
  readTime: "5분",
  thumbnail: THUMBNAIL_OPTIONS[0].src,
  tags: [],
  aciScore: 0,
  hasAesPenalty: false,
  aciBreakdown: { pps: 0, dig: 0, gcc: 0, wfa: 0 },
  content: "",
});

const PostEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<Omit<PostData, "id">>(emptyPost());
  const [tagInput, setTagInput] = useState("");
  const [customThumb, setCustomThumb] = useState("");
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PostData | "tagInput", string>>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/admin"); return; }
    if (isEdit && id) {
      const post = getAllPosts().find((p) => p.id === id);
      if (post) {
        const { id: _id, ...rest } = post;
        setForm(rest);
        // If thumbnail not in presets, treat as custom URL
        const isPreset = THUMBNAIL_OPTIONS.some((t) => t.src === post.thumbnail);
        if (!isPreset) setCustomThumb(post.thumbnail);
      } else {
        navigate("/admin/dashboard");
      }
    }
  }, [id, isEdit, navigate]);

  // ACI total
  const aciTotal =
    form.aciBreakdown.pps +
    form.aciBreakdown.dig +
    form.aciBreakdown.gcc +
    form.aciBreakdown.wfa;

  const setBreakdown = (key: keyof PostData["aciBreakdown"], val: number) => {
    const clamped = Math.min(250, Math.max(0, val));
    const next = { ...form.aciBreakdown, [key]: clamped };
    setForm((f) => ({ ...f, aciBreakdown: next, aciScore: next.pps + next.dig + next.gcc + next.wfa }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (t: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "제목을 입력해주세요.";
    if (!form.excerpt.trim()) e.excerpt = "요약을 입력해주세요.";
    if (!form.author.trim()) e.author = "저자를 입력해주세요.";
    if (!form.content.trim()) e.content = "본문을 입력해주세요.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const thumb = customThumb.trim() || form.thumbnail;
    const post: PostData = { id: isEdit && id ? id : generateId(), ...form, thumbnail: thumb };
    savePost(post);
    setSaved(true);
    setTimeout(() => {
      navigate("/admin/dashboard");
    }, 800);
  };

  const pillars: { key: keyof PostData["aciBreakdown"]; label: string; color: string }[] = [
    { key: "pps", label: "PPS", color: "bg-accent" },
    { key: "dig", label: "DIG", color: "bg-emerald-500" },
    { key: "gcc", label: "GCC", color: "bg-amber-500" },
    { key: "wfa", label: "WFA", color: "bg-violet-500" },
  ];

  const Field = ({
    label, id: fid, required, error, children,
  }: { label: string; id?: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div>
      <label htmlFor={fid} className="block text-[13px] font-semibold text-foreground mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    `w-full h-10 px-3.5 rounded-xl border bg-background text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
      err ? "border-red-400 focus:ring-red-200" : "border-border focus:ring-accent/30 focus:border-accent"
    }`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              대시보드
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-[13px] font-semibold text-foreground">
              {isEdit ? "게시글 수정" : "새 게시글"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {preview ? <EyeOff size={14} /> : <Eye size={14} />}
              {preview ? "편집" : "미리보기"}
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              <Save size={14} />
              {saved ? "저장됨 ✓" : "저장"}
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left: main form */}
          <div className="flex flex-col gap-6">
            {/* Title */}
            <Field label="제목" id="title" required error={errors.title}>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErrors((p) => ({ ...p, title: undefined })); }}
                placeholder="아티클 제목을 입력하세요"
                className={inputCls(errors.title)}
              />
            </Field>

            {/* Excerpt */}
            <Field label="요약" id="excerpt" required error={errors.excerpt}>
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => { setForm((f) => ({ ...f, excerpt: e.target.value })); setErrors((p) => ({ ...p, excerpt: undefined })); }}
                placeholder="독자가 클릭하게 만드는 1~2줄 요약"
                rows={2}
                className={`${inputCls(errors.excerpt)} h-auto py-3 resize-none`}
              />
            </Field>

            {/* Content */}
            <Field label="본문 (Markdown)" id="content" required error={errors.content}>
              {preview ? (
                <div className="min-h-[400px] rounded-xl border border-border bg-background p-5 prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content || "*본문을 입력하면 여기에 미리보기가 표시됩니다.*"}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => { setForm((f) => ({ ...f, content: e.target.value })); setErrors((p) => ({ ...p, content: undefined })); }}
                  placeholder={`## 들어가며\n\n본문을 Markdown으로 작성하세요.\n\n## 소제목\n\n내용...`}
                  rows={20}
                  className={`${inputCls(errors.content)} h-auto py-3 font-mono text-[13px] resize-y`}
                />
              )}
            </Field>

            {/* Tags */}
            <div>
              <label className="block text-[13px] font-semibold text-foreground mb-1.5">
                태그
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="태그 입력 후 Enter"
                  className={inputCls()}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 h-10 rounded-xl border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  추가
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary border border-border text-[12px] text-muted-foreground"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-muted-foreground hover:text-red-500 transition-colors ml-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: meta sidebar */}
          <div className="flex flex-col gap-5">
            {/* Category */}
            <div className="bg-secondary rounded-2xl border border-border p-5">
              <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                기본 정보
              </p>
              <div className="flex flex-col gap-4">
                <Field label="카테고리" id="category">
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={inputCls()}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="저자" id="author" required error={errors.author}>
                  <input
                    id="author"
                    type="text"
                    value={form.author}
                    onChange={(e) => { setForm((f) => ({ ...f, author: e.target.value })); setErrors((p) => ({ ...p, author: undefined })); }}
                    placeholder="홍길동"
                    className={inputCls(errors.author)}
                  />
                </Field>

                <Field label="읽기 시간" id="readTime">
                  <input
                    id="readTime"
                    type="text"
                    value={form.readTime}
                    onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
                    placeholder="예: 8분"
                    className={inputCls()}
                  />
                </Field>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    id="aesPenalty"
                    type="checkbox"
                    checked={form.hasAesPenalty || false}
                    onChange={(e) => setForm((f) => ({ ...f, hasAesPenalty: e.target.checked }))}
                    className="w-4 h-4 rounded border-border accent-red-500"
                  />
                  <label htmlFor="aesPenalty" className="flex items-center gap-1.5 text-[13px] text-foreground cursor-pointer">
                    <AlertTriangle size={13} className="text-red-500" />
                    AES 패널티 적용
                  </label>
                </div>
              </div>
            </div>

            {/* ACI Breakdown */}
            <div className="bg-secondary rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                  ACI 스코어
                </p>
                <span className="text-[18px] font-extrabold text-accent">{aciTotal}</span>
              </div>
              <div className="flex flex-col gap-4">
                {pillars.map((p) => (
                  <div key={p.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${p.color}`} />
                        <span className="text-[12px] font-semibold text-muted-foreground">
                          {p.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={250}
                          value={form.aciBreakdown[p.key]}
                          onChange={(e) => setBreakdown(p.key, Number(e.target.value))}
                          className="w-16 h-7 px-2 rounded-lg border border-border bg-background text-[12px] text-foreground text-right focus:outline-none focus:ring-1 focus:ring-accent/40"
                        />
                        <span className="text-[11px] text-muted-foreground">/250</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={250}
                      value={form.aciBreakdown[p.key]}
                      onChange={(e) => setBreakdown(p.key, Number(e.target.value))}
                      className="w-full h-1.5 appearance-none rounded-full bg-border cursor-pointer accent-current"
                      style={{ accentColor: p.color === "bg-accent" ? "hsl(var(--accent))" : undefined }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Thumbnail */}
            <div className="bg-secondary rounded-2xl border border-border p-5">
              <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                썸네일
              </p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {THUMBNAIL_OPTIONS.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => { setForm((f) => ({ ...f, thumbnail: t.src })); setCustomThumb(""); }}
                    className={`rounded-lg overflow-hidden aspect-video border-2 transition-colors ${
                      form.thumbnail === t.src && !customThumb
                        ? "border-accent"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={t.src} alt={t.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customThumb}
                onChange={(e) => {
                  setCustomThumb(e.target.value);
                  if (e.target.value) setForm((f) => ({ ...f, thumbnail: e.target.value }));
                }}
                placeholder="또는 이미지 URL 입력"
                className={`${inputCls()} text-[13px]`}
              />
              {(customThumb || form.thumbnail) && (
                <div className="mt-2 rounded-lg overflow-hidden aspect-video">
                  <img
                    src={customThumb || form.thumbnail}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Save (mobile-friendly) */}
            <button
              onClick={handleSave}
              disabled={saved}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Save size={15} />
              {saved ? "저장됨 ✓" : isEdit ? "수정 저장" : "게시글 저장"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostEditor;
