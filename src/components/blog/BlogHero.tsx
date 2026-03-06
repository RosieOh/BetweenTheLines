import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { samplePosts } from "@/data/posts";
import { motion, AnimatePresence } from "framer-motion";

const featuredPosts = samplePosts.filter((p) => p.aciScore >= 700);

const BlogHero = () => {
  const [current, setCurrent] = useState(0);
  const post = featuredPosts[current];

  const prev = () =>
    setCurrent((c) => (c === 0 ? featuredPosts.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === featuredPosts.length - 1 ? 0 : c + 1));

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
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
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
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
