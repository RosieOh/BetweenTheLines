const BlogArticleCardSkeleton = () => (
  <div className="flex gap-5 py-7 animate-pulse">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="h-5 w-16 rounded bg-secondary" />
        <div className="h-4 w-20 rounded bg-secondary" />
      </div>
      <div className="h-5 w-4/5 rounded bg-secondary mb-2" />
      <div className="h-4 w-full rounded bg-secondary mb-1.5" />
      <div className="h-4 w-2/3 rounded bg-secondary mb-3" />
      <div className="flex gap-2">
        <div className="h-4 w-24 rounded bg-secondary" />
        <div className="h-4 w-4 rounded bg-secondary" />
        <div className="h-4 w-12 rounded bg-secondary" />
      </div>
    </div>
    <div className="flex-shrink-0 w-[140px] h-[100px] rounded-lg bg-secondary" />
  </div>
);

export default BlogArticleCardSkeleton;
