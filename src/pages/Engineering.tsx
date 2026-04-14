import { Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import BlogArticleCard from "@/components/blog/BlogArticleCard";
import { getAllPosts } from "@/lib/postStorage";
import { categoryList } from "@/lib/blogConfig";

const Engineering = () => {
  const allPosts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border py-16">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
              Engineering Overview
            </p>
            <h1 className="text-[36px] md:text-[52px] font-extrabold text-foreground leading-[1.15] tracking-tight mb-5">
              Engineering
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed max-w-2xl">
              배운 것을 기록하고 프로젝트에 적용한 경험들을 카테고리별로 모아봤습니다.
            </p>
          </div>
        </section>

        {/* Category sections */}
        <div className="container max-w-4xl py-12 flex flex-col gap-16">
          {categoryList.map((cat) => {
            const posts = allPosts
              .filter((p) => p.category === cat.key)
              .slice(0, 3);

            return (
              <section key={cat.key}>
                <div className={`rounded-2xl border ${cat.border} ${cat.bg} p-6 mb-4`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                        <h2 className={`text-[22px] font-extrabold ${cat.textColor}`}>
                          {cat.label}
                        </h2>
                      </div>
                      <p className="text-[13px] text-muted-foreground">{cat.description}</p>
                    </div>
                    <Link
                      to={`/category/${cat.key.toLowerCase()}`}
                      className={`flex-shrink-0 text-[13px] font-semibold ${cat.textColor} hover:underline`}
                    >
                      전체 보기 →
                    </Link>
                  </div>
                </div>

                {posts.length > 0 ? (
                  <div className="divide-y divide-border">
                    {posts.map((post) => (
                      <BlogArticleCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-[14px] text-muted-foreground">
                    아직 글이 없습니다.
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};

export default Engineering;
