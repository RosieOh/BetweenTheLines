import { useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/postStorage";
import ContactModal from "@/components/blog/ContactModal";

const BlogSidebar = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const popularPosts = getAllPosts()
    .sort((a, b) => b.aciScore - a.aciScore)
    .slice(0, 3)
    .map((p) => ({ id: p.id, title: p.title, author: p.author }));

  return (
    <aside className="sticky top-20">
      {/* Popular posts */}
      <div className="bg-secondary rounded-2xl p-6 mb-6">
        <h3 className="text-[15px] font-bold text-foreground mb-5">
          인기 있는 글
        </h3>
        <ul className="flex flex-col gap-4">
          {popularPosts.map((post, i) => (
            <li key={post.id}>
            <Link to={`/post/${post.id}`} className="flex gap-3 group">
              <span className="text-accent font-bold text-sm mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="text-[13px] font-semibold text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {post.author}
                </p>
              </div>
            </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
        <p className="text-[13px] font-medium opacity-70 mb-2">Hyperwise Studio</p>
        <p className="text-[15px] font-bold leading-snug mb-4">
          이 기술력을 당신의 프로젝트에 적용하세요
        </p>
        <button
          onClick={() => setContactOpen(true)}
          className="inline-flex px-4 py-2 rounded-lg bg-primary-foreground text-primary text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          프로젝트 문의
        </button>
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </aside>
  );
};

export default BlogSidebar;
