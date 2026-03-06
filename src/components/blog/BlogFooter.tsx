const BlogFooter = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-foreground">THE LOGIC</span>
            <span className="text-xs text-muted-foreground">by Hyperwise</span>
          </div>

          <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">개발자 채용</a>
            <a href="#" className="hover:text-foreground transition-colors">뉴스레터 신청</a>
            <a href="#" className="hover:text-foreground transition-colors">RSS</a>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 Hyperwise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
