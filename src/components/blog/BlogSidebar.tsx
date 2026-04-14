import { Link } from "react-router-dom";
import { getPublishedPosts } from "@/lib/postStorage";

const BlogSidebar = () => {
  const allPosts = getPublishedPosts();
  const popularPosts = allPosts
    .slice(0, 3)
    .map((p) => ({ id: p.id, title: p.title, author: p.author }));

  // Tag cloud: count frequency
  const tagFreq = allPosts
    .flatMap((p) => p.tags)
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

  const tags = Object.entries(tagFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20);

  const maxCount = Math.max(...tags.map(([, n]) => n), 1);

  return (
    <aside className="sticky top-20 flex flex-col gap-6">
      {/* Popular posts */}
      <div className="bg-secondary rounded-2xl p-6">
        <h3 className="text-[15px] font-bold text-foreground mb-5">인기 있는 글</h3>
        <ul className="flex flex-col gap-4">
          {popularPosts.map((post, i) => (
            <li key={post.id}>
              <Link to={`/post/${post.id}`} className="flex gap-3 group">
                <span className="text-accent font-bold text-sm mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-[13px] font-semibold text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-1">{post.author}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tag cloud */}
      {tags.length > 0 && (
        <div className="bg-secondary rounded-2xl p-6">
          <h3 className="text-[15px] font-bold text-foreground mb-4">태그</h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map(([tag, count]) => {
              const ratio = count / maxCount;
              const size = ratio > 0.7 ? "text-[14px]" : ratio > 0.4 ? "text-[13px]" : "text-[12px]";
              return (
                <Link
                  key={tag}
                  to={`/tag/${encodeURIComponent(tag)}`}
                  className={`px-2.5 py-1 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors ${size}`}
                >
                  #{tag}
                  {count > 1 && (
                    <span className="ml-1 text-[10px] text-muted-foreground/60">{count}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
        <p className="text-[13px] font-medium opacity-70 mb-2">Between the Lines</p>
        <p className="text-[15px] font-bold leading-snug mb-4">배운 것을 기록하고 함께 성장해요</p>
        <a
          href="https://github.com/RosieOh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex px-4 py-2 rounded-lg bg-primary-foreground text-primary text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          GitHub 방문하기
        </a>
      </div>
    </aside>
  );
};

export default BlogSidebar;
