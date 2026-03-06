import { motion } from "framer-motion";
import AciRadarChart, { type AciScores } from "./AciRadarChart";

export interface PostData {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  scores: AciScores;
  tags: string[];
  hasAesPenalty?: boolean;
}

interface PostCardProps {
  post: PostData;
  index: number;
}

const categoryColors: Record<string, string> = {
  PPS: "bg-accent/10 text-accent",
  DIG: "bg-emerald-500/10 text-emerald-600",
  GCC: "bg-amber-500/10 text-amber-600",
  WFA: "bg-violet-500/10 text-violet-600",
  AES: "bg-penalty-red/10 text-penalty-red",
};

const PostCard = ({ post, index }: PostCardProps) => {
  const total = post.scores.pps + post.scores.dig + post.scores.gcc + post.scores.wfa;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-card rounded-2xl border border-border hover:border-accent/30 hover:glow-accent transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${categoryColors[post.category] || categoryColors.PPS}`}>
              {post.category}
            </span>
            {post.hasAesPenalty && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-penalty-red/10 text-penalty-red">
                AES Warning
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded text-xs text-text-caption bg-secondary">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-text-caption">
            <span className="font-medium">{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span className="font-semibold text-foreground">ACI {total}</span>
          </div>
        </div>

        {/* Mini Radar */}
        <div className="flex-shrink-0 flex items-center">
          <AciRadarChart scores={post.scores} size="sm" showLabels={false} />
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;
