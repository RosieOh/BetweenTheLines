import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, EyeOff, Save, Download, FileText, RefreshCw } from "lucide-react";
import {
  isAuthenticated,
  getAllPosts,
  savePost,
  generateId,
} from "@/lib/postStorage";
import AdminLayout from "@/components/blog/AdminLayout";
import type { PostData } from "@/data/posts";
import { categoryList } from "@/lib/blogConfig";

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

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}.`;
};

const emptyPost = (): Omit<PostData, "id"> => ({
  title: "",
  excerpt: "",
  category: categoryList[0]?.key ?? "",
  author: "",
  date: today(),
  readTime: "5분",
  thumbnail: THUMBNAIL_OPTIONS[0].src,
  tags: [],
  content: "",
  status: "published",
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
  const handleSaveRef = useRef<() => void>(() => {});

  useEffect(() => {
    handleSaveRef.current = () => {
      const e = validate();
      if (Object.keys(e).length > 0) { setErrors(e); return; }
      const thumb = customThumb.trim() || form.thumbnail;
      const post: PostData = { id: isEdit && id ? id : generateId(), ...form, thumbnail: thumb };
      savePost(post);
      setSaved(true);
      setTimeout(() => { navigate("/admin/dashboard"); }, 800);
    };
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const calcReadTime = () => {
    const words = form.content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    setForm((f) => ({ ...f, readTime: `${minutes}분` }));
  };

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/admin"); return; }
    if (isEdit && id) {
      const post = getAllPosts().find((p) => p.id === id);
      if (post) {
        const { id: _id, ...rest } = post;
        setForm(rest);
        const isPreset = THUMBNAIL_OPTIONS.some((t) => t.src === post.thumbnail);
        if (!isPreset) setCustomThumb(post.thumbnail);
      } else {
        navigate("/admin/dashboard");
      }
    }
  }, [id, isEdit, navigate]);

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

  const handleSave = () => handleSaveRef.current();

  const handleExportMdx = () => {
    const slug = (form.title || "untitled").toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const isoDate = new Date().toISOString().split("T")[0];
    const mdx = [
      "---",
      `title: '${form.title}'`,
      `date: '${isoDate}'`,
      `description: '${form.excerpt}'`,
      `author: '${form.author}'`,
      `category: '${form.category}'`,
      `tags: [${form.tags.map((t) => `'${t}'`).join(", ")}]`,
      `readTime: '${form.readTime}'`,
      `thumbnail: 'architecture'`,
      "---",
      "",
      form.content,
    ].join("\n");

    const blob = new Blob([mdx], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.mdx`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
    <AdminLayout>
      {/* Page header */}
      <div className="px-8 pt-8 pb-4 flex items-center justify-between border-b border-border mb-6">
        <div>
          <h1 className="text-[20px] font-extrabold text-foreground">
            {isEdit ? "게시글 수정" : "새 게시글"}
          </h1>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            {isEdit ? "기존 게시글을 수정합니다." : "새 게시글을 작성합니다."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Draft / Published toggle */}
          <button
            onClick={() => setForm((f) => ({ ...f, status: f.status === "draft" ? "published" : "draft" }))}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[13px] font-medium transition-colors ${
              form.status === "draft"
                ? "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                : "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
            }`}
          >
            <FileText size={14} />
            {form.status === "draft" ? "임시저장" : "공개"}
          </button>
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
            {preview ? "편집" : "미리보기"}
          </button>
          <button
            onClick={handleExportMdx}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            title="MDX 파일로 다운로드"
          >
            <Download size={14} />
            MDX
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

      <main className="px-8 max-w-5xl py-2">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left: main form */}
          <div className="flex flex-col gap-6">
            <Field label="제목" id="title" required error={errors.title}>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErrors((p) => ({ ...p, title: undefined })); }}
                placeholder="게시글 제목을 입력하세요"
                className={inputCls(errors.title)}
              />
            </Field>

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
                    {categoryList.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
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
                  <div className="flex gap-2">
                    <input
                      id="readTime"
                      type="text"
                      value={form.readTime}
                      onChange={(e) => setForm((f) => ({ ...f, readTime: e.target.value }))}
                      placeholder="예: 8분"
                      className={inputCls()}
                    />
                    <button
                      type="button"
                      onClick={calcReadTime}
                      title="본문 글자 수로 자동 계산"
                      className="flex items-center gap-1 px-3 h-10 rounded-xl border border-border text-[12px] font-medium text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                    >
                      <RefreshCw size={12} />
                      자동
                    </button>
                  </div>
                </Field>
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
    </AdminLayout>
  );
};

export default PostEditor;
