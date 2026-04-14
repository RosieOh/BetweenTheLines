import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { PostData } from "@/data/posts";
import { categoryStyles } from "@/lib/categoryConfig";

interface BlogArticleCardProps {
  post: PostData;
}

const BlogArticleCard = ({ post }: BlogArticleCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Link to={`/post/${post.id}`}>
        <article className="flex gap-5 py-7 cursor-pointer group">
          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className={`px-2 py-0.5 rounded text-[12px] font-semibold ${
                  categoryStyles[post.category] || categoryStyles.SpringBoot
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
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Thumbnail with blur placeholder */}
          <div className="flex-shrink-0 w-[140px] h-[100px] rounded-lg overflow-hidden bg-secondary">
            <img
              src={post.thumbnail}
              alt={post.title}
              loading="lazy"
              width={140}
              height={100}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                imgLoaded ? "blur-0 scale-100" : "blur-sm scale-105"
              }`}
            />
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default BlogArticleCard;
