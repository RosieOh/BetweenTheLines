import { useState } from "react";
import { samplePosts, categories } from "@/data/posts";
import BlogArticleCard from "./BlogArticleCard";
import BlogSidebar from "./BlogSidebar";

const BlogArticleList = () => {
  const [activeCategory, setActiveCategory] = useState<string>("전체");

  const filtered =
    activeCategory === "전체"
      ? samplePosts
      : samplePosts.filter((p) => p.category === activeCategory);

  return (
    <section className="pb-20">
      <div className="container">
        {/* Section title */}
        <h2 className="text-2xl font-bold text-foreground mb-6">전체 아티클</h2>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-tag-active-bg text-tag-active-fg"
                  : "bg-tag-bg text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content grid: articles + sidebar */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          {/* Article list */}
          <div className="flex flex-col gap-0 divide-y divide-border">
            {filtered.map((post) => (
              <BlogArticleCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <BlogSidebar />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogArticleList;
