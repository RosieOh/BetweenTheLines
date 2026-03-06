import type { PostData } from "@/data/posts";

const categoryStyles: Record<string, string> = {
  PPS: "bg-accent/10 text-accent",
  DIG: "bg-emerald-100 text-emerald-700",
  GCC: "bg-amber-100 text-amber-700",
  WFA: "bg-violet-100 text-violet-700",
  AES: "bg-red-100 text-red-700",
};

interface BlogArticleCardProps {
  post: PostData;
}

const BlogArticleCard = ({ post }: BlogArticleCardProps) => {
  return (
    <article className="flex gap-5 py-7 cursor-pointer group">
      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className={`px-2 py-0.5 rounded text-[12px] font-semibold ${
              categoryStyles[post.category] || categoryStyles.PPS
            }`}
          >
            {post.category}
          </span>
          <span className="text-[12px] text-muted-foreground">{post.author}</span>
        </div>

        <h3 className="text-[17px] font-bold text-foreground leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-[14px] text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span>{post.date}</span>
          {post.aciScore >= 700 && (
            <>
              <span>·</span>
              <span className="font-semibold text-accent">ACI {post.aciScore}</span>
            </>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="flex-shrink-0 w-[140px] h-[100px] rounded-lg overflow-hidden">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    </article>
  );
};

export default BlogArticleCard;
