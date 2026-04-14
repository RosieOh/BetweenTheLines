import { useParams, Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import NotFoundInline from "@/components/blog/NotFoundInline";
import { getAllPosts } from "@/lib/postStorage";

const AuthorPage = () => {
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name || "");

  const posts = getAllPosts().filter((p) => p.author === decodedName);
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date.replace(/\. /g, "-").replace(".", "")).getTime()
           - new Date(a.date.replace(/\. /g, "-").replace(".", "")).getTime()
  );

  if (!decodedName || posts.length === 0) {
    return <NotFoundInline message="저자를 찾을 수 없습니다." />;
  }

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Profile header */}
        <section className="border-b border-border py-14 bg-secondary/20">
          <div className="container max-w-4xl">
            <div className="flex items-start gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-3xl font-extrabold text-primary-foreground">
                  {decodedName.charAt(0)}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-1">
                  Author
                </p>
                <h1 className="text-[32px] font-extrabold text-foreground mb-1">
                  {decodedName}
                </h1>
                <p className="text-[14px] text-muted-foreground mb-4">
                  얻은 지식을 프로젝트에 적용하고, 기록하는 습관으로 성장하는 개발자
                </p>

                {/* Stats */}
                <div className="flex gap-6 mb-4">
                  <div className="bg-background rounded-xl border border-border p-4 text-center">
                    <p className="text-[11px] text-muted-foreground mb-1">아티클</p>
                    <p className="text-[26px] font-extrabold text-foreground">{posts.length}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/tag/${encodeURIComponent(tag)}`}
                      className="px-2.5 py-1 rounded-full bg-background border border-border text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="py-10">
          <div className="container max-w-4xl">
            <h2 className="text-[20px] font-extrabold text-foreground mb-5">
              {decodedName}의 글
            </h2>
            <div className="divide-y divide-border">
              {sorted.map((post) => (
                <BlogArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
};

export default AuthorPage;
