import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllPosts } from "@/lib/postStorage";
import { motion, AnimatePresence } from "framer-motion";

const BlogHero = () => {
  const featuredPosts = getAllPosts().slice(0, 3);
  const [current, setCurrent] = useState(0);
  const post = featuredPosts[current];

  const prev = () => setCurrent((c) => (c === 0 ? featuredPosts.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === featuredPosts.length - 1 ? 0 : c + 1));

  if (!post) return null;

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl md:text-[40px] font-extrabold text-foreground leading-[1.25] tracking-tight mb-4">
                {post.title}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                <span className="font-medium text-foreground">{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <Link
                to={`/post/${post.id}`}
                className="inline-flex px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
              >
                읽기 →
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={post.id + "-img"}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden aspect-[16/10]"
            >
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls — only shown when there are 2+ posts */}
        {featuredPosts.length > 1 && (
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="이전 아티클"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2" role="tablist" aria-label="슬라이드 선택">
              {featuredPosts.map((p, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={p.title}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === current
                      ? "w-5 h-2 bg-foreground"
                      : "w-2 h-2 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="다음 아티클"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <ChevronRight size={18} />
            </button>

            <span className="text-[13px] text-muted-foreground ml-1">
              {current + 1} / {featuredPosts.length}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogHero;
