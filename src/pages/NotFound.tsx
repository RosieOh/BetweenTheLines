import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { getPublishedPosts } from "@/lib/postStorage";
import { categoryStyles } from "@/lib/categoryConfig";

const NotFound = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const recentPosts = getPublishedPosts().slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BlogHeader />

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {/* 404 Header */}
          <div className="text-center mb-10">
            <p className="text-[96px] font-extrabold text-foreground leading-none mb-2 tracking-tight">
              404
            </p>
            <p className="text-[20px] font-bold text-foreground mb-2">
              페이지를 찾을 수 없습니다
            </p>
            <p className="text-[14px] text-muted-foreground max-w-sm mx-auto">
              요청하신 페이지가 존재하지 않거나 이동됐습니다.
              검색으로 원하는 글을 찾아보세요.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative mb-8">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력하세요..."
              autoFocus
              className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-secondary text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
            />
          </form>

          {/* Recent posts */}
          {recentPosts.length > 0 && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                최근 게시글
              </p>
              <div className="flex flex-col gap-2 mb-6">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mb-0.5 ${
                          categoryStyles[post.category] || "bg-secondary text-foreground"
                        }`}
                      >
                        {post.category}
                      </span>
                      <p className="text-[13px] font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                        {post.title}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      <BlogFooter />
    </div>
  );
};

export default NotFound;
