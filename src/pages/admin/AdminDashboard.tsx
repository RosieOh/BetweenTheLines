import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, LogOut, AlertTriangle, ExternalLink } from "lucide-react";
import {
  isAuthenticated,
  logout,
  getAllPosts,
  getStoredPosts,
  deletePost,
} from "@/lib/postStorage";
import { samplePosts } from "@/data/posts";
import { categoryStyles } from "@/lib/categoryConfig";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(getAllPosts());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) navigate("/admin");
  }, [navigate]);

  const storedIds = new Set(getStoredPosts().map((p) => p.id));
  const sampleIds = new Set(samplePosts.map((p) => p.id));

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const handleDelete = (id: string) => {
    deletePost(id);
    setPosts(getAllPosts());
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-[15px] font-extrabold text-foreground">
              THE LOGIC
            </Link>
            <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[11px] font-bold">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/posts/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              새 게시글
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={14} />
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="container py-10 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-secondary rounded-2xl border border-border p-5">
            <p className="text-[11px] text-muted-foreground mb-1">전체 게시글</p>
            <p className="text-[28px] font-extrabold text-foreground">{posts.length}</p>
          </div>
          <div className="bg-secondary rounded-2xl border border-border p-5">
            <p className="text-[11px] text-muted-foreground mb-1">샘플 게시글</p>
            <p className="text-[28px] font-extrabold text-muted-foreground">{samplePosts.length}</p>
          </div>
          <div className="bg-secondary rounded-2xl border border-border p-5">
            <p className="text-[11px] text-muted-foreground mb-1">직접 작성</p>
            <p className="text-[28px] font-extrabold text-accent">{getStoredPosts().length}</p>
          </div>
        </div>

        {/* Post list */}
        <h2 className="text-[18px] font-extrabold text-foreground mb-4">게시글 목록</h2>

        <div className="flex flex-col gap-2">
          {posts.map((post) => {
            const isCustom = storedIds.has(post.id);
            const isSample = sampleIds.has(post.id);

            return (
              <div
                key={post.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-background hover:bg-secondary/40 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        categoryStyles[post.category] || categoryStyles.PPS
                      }`}
                    >
                      {post.category}
                    </span>
                    {post.hasAesPenalty && (
                      <AlertTriangle size={12} className="text-red-500" />
                    )}
                    {isCustom && (
                      <span className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-bold">
                        작성됨
                      </span>
                    )}
                    {isSample && (
                      <span className="px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground text-[10px] font-bold">
                        샘플
                      </span>
                    )}
                    <span className="text-[12px] text-muted-foreground">{post.author}</span>
                  </div>
                  <p className="text-[14px] font-semibold text-foreground line-clamp-1">
                    {post.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    ACI {post.aciScore} · {post.date} · {post.readTime}
                  </p>
                </div>

                {/* Actions */}
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
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
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
      </main>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl border border-border p-7 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
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
    </div>
  );
};

export default AdminDashboard;
