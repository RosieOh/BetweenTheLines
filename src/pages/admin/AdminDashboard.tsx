import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  FileText,
  Edit3,
  BookOpen,
  MessageSquare,
  Users,
  Search,
} from "lucide-react";
import {
  getAllPosts,
  getStoredPosts,
  deletePost,
  getInquiries,
  getSubscribers,
} from "@/lib/postStorage";
import { samplePosts } from "@/data/posts";
import { categoryStyles } from "@/lib/categoryConfig";
import { categoryList } from "@/lib/blogConfig";
import AdminLayout from "@/components/blog/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const [posts, setPosts] = useState(getAllPosts());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const storedIds = new Set(getStoredPosts().map((p) => p.id));
  const sampleIds = new Set(samplePosts.map((p) => p.id));
  const inquiries = getInquiries();
  const subscribers = getSubscribers();

  const handleDelete = (id: string) => {
    deletePost(id);
    setPosts(getAllPosts());
    setDeleteTarget(null);
  };

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [posts, search]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return categoryList
      .map((c) => ({ name: c.label, count: counts[c.key] || 0 }))
      .filter((d) => d.count > 0);
  }, [posts]);

  const statCards = [
    { label: "전체 게시글", value: posts.length, icon: FileText, color: "text-foreground" },
    { label: "직접 작성", value: getStoredPosts().length, icon: Edit3, color: "text-accent" },
    { label: "샘플 게시글", value: samplePosts.length, icon: BookOpen, color: "text-muted-foreground" },
    { label: "수신 문의", value: inquiries.length, icon: MessageSquare, color: "text-blue-500" },
    { label: "구독자 수", value: subscribers.length, icon: Users, color: "text-emerald-500" },
  ];

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[24px] font-extrabold text-foreground">대시보드</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">블로그 현황을 한눈에 확인하세요.</p>
          </div>
          <Link
            to="/admin/posts/new"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            새 게시글
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-secondary rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-muted-foreground">{label}</p>
                <Icon size={14} className={color} />
              </div>
              <p className={`text-[26px] font-extrabold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Category distribution chart */}
        {chartData.length > 0 && (
          <div className="bg-secondary rounded-2xl border border-border p-5 mb-8">
            <p className="text-[13px] font-bold text-foreground mb-4">카테고리별 게시글 수</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)" }}
                  cursor={{ fill: "var(--secondary)" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${(i * 47) % 360}, 65%, 55%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Post list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-extrabold text-foreground">게시글 목록</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="제목, 저자, 카테고리 검색"
              className="h-9 pl-9 pr-4 rounded-xl border border-border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors w-56"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-10">
          {filteredPosts.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          ) : null}
          {filteredPosts.map((post) => {
            const isCustom = storedIds.has(post.id);
            const isSample = sampleIds.has(post.id);

            return (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-secondary/40 transition-colors"
              >
                <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        categoryStyles[post.category] || categoryStyles.SpringBoot
                      }`}
                    >
                      {post.category}
                    </span>
                    {isCustom && (
                      <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-bold">
                        작성됨
                      </span>
                    )}
                    {post.status === "draft" && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                        임시저장
                      </span>
                    )}
                    {isSample && (
                      <span className="px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground text-[10px] font-bold">
                        샘플
                      </span>
                    )}
                    <span className="text-[12px] text-muted-foreground">{post.author}</span>
                  </div>
                  <p className="text-[14px] font-semibold text-foreground line-clamp-1">{post.title}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    {post.date} · {post.readTime}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Link
                    to={`/post/${post.id}`}
                    target="_blank"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    title="미리보기"
                  >
                    <ExternalLink size={15} />
                  </Link>
                  {isCustom && (
                    <>
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        title="수정"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(post.id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent inquiries */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-extrabold text-foreground">최근 문의</h2>
          <Link
            to="/admin/inquiries"
            className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            전체 보기 →
          </Link>
        </div>
        {inquiries.length === 0 ? (
          <div className="rounded-2xl border border-border bg-secondary/30 p-6 text-center">
            <MessageSquare size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-[13px] text-muted-foreground">아직 수신된 문의가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {inquiries.slice(-3).reverse().map((inq) => (
              <div
                key={inq.id}
                className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-background"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={13} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-foreground">{inq.name}</span>
                    {inq.company && (
                      <span className="text-[11px] text-muted-foreground">· {inq.company}</span>
                    )}
                  </div>
                  <p className="text-[12px] text-muted-foreground line-clamp-1">{inq.message}</p>
                </div>
                <p className="text-[11px] text-muted-foreground flex-shrink-0">
                  {new Date(inq.date).toLocaleDateString("ko-KR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-7 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 flex items-center justify-center">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <h3 className="text-[17px] font-extrabold text-foreground">게시글 삭제</h3>
            </div>
            <p className="text-[14px] text-muted-foreground mb-6">
              이 게시글을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-10 rounded-xl border border-border text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 h-10 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
