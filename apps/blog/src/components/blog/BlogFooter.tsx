import { Link } from "react-router-dom";

const BlogFooter = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-extrabold text-foreground hover:text-accent transition-colors">
              Between the Lines
            </Link>
            <span className="text-xs text-muted-foreground">by 오태훈</span>
          </div>

          <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">소개</Link>
            <Link to="/engineering" className="hover:text-foreground transition-colors">엔지니어링</Link>
            <a
              href="https://github.com/RosieOh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2025 Between the Lines. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
