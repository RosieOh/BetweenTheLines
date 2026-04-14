import { useParams, Link } from "react-router-dom";
import { Tag } from "lucide-react";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import NotFoundInline from "@/components/blog/NotFoundInline";
import { getAllPosts } from "@/lib/postStorage";

const TagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const decodedTag = decodeURIComponent(tag || "");
  const allPostsList = getAllPosts();

  const allTags = Array.from(new Set(allPostsList.flatMap((p) => p.tags))).sort();

  const posts = allPostsList.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase())
  );

  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Related tags: tags that appear in the same posts, excluding current
  const relatedTags = Array.from(
    new Set(posts.flatMap((p) => p.tags).filter((t) => t.toLowerCase() !== decodedTag.toLowerCase()))
  );

  if (!decodedTag || posts.length === 0) {
    return <NotFoundInline message={`"${decodedTag}" 태그를 찾을 수 없습니다.`} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Header */}
        <section className="border-b border-border py-12 bg-secondary/30">
          <div className="container max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/"
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
              >
                홈
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-[13px] text-foreground font-medium">#{decodedTag}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center">
                <Tag size={18} className="text-accent" />
              </div>
              <h1 className="text-[32px] font-extrabold text-foreground">
                #{decodedTag}
              </h1>
            </div>
            <p className="text-[14px] text-muted-foreground">
              <span className="font-semibold text-foreground">{sorted.length}개</span>의 아티클이
              이 태그를 포함합니다.
            </p>

            {/* Related tags */}
            {relatedTags.length > 0 && (
              <div className="mt-5">
                <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  연관 태그
                </p>
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map((t) => (
                    <Link
                      key={t}
                      to={`/tag/${encodeURIComponent(t)}`}
                      className="px-3 py-1 rounded-full bg-background border border-border text-[13px] text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Articles */}
        <section className="py-10">
          <div className="container max-w-3xl">
            <div className="divide-y divide-border">
              {sorted.map((post) => (
                <BlogArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* All tags */}
        <section className="border-t border-border py-12 bg-secondary/20">
          <div className="container max-w-3xl">
            <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
              전체 태그
            </p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((t) => (
                <Link
                  key={t}
                  to={`/tag/${encodeURIComponent(t)}`}
                  className={`px-3 py-1.5 rounded-full border text-[13px] font-medium transition-colors ${
                    t.toLowerCase() === decodedTag.toLowerCase()
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
};

export default TagPage;
