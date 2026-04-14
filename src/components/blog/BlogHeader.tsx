import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/blog/ThemeToggle";

const navItems = [
  { label: "Engineering", href: "/engineering" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "소개", href: "/about" },
];

const BlogHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const submitSearch = (q: string) => {
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") submitSearch(searchQuery);
    if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            Between the Lines
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`text-[14px] font-medium transition-colors ${
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Desktop inline search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.form
                key="search-bar"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                onSubmit={(e) => { e.preventDefault(); submitSearch(searchQuery); }}
                className="hidden md:flex overflow-hidden"
              >
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKey}
                  placeholder="검색..."
                  aria-label="검색어 입력"
                  className="w-full h-8 px-3 rounded-lg border border-border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </motion.form>
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              if (searchOpen && searchQuery.trim()) {
                submitSearch(searchQuery);
              } else {
                setSearchOpen(!searchOpen);
              }
            }}
            aria-label="검색"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          <ThemeToggle />

          <a
            href="https://github.com/RosieOh"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity ml-1"
          >
            GitHub
          </a>

          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="container py-4 flex flex-col gap-3">
              {/* Mobile search */}
              <form
                onSubmit={(e) => { e.preventDefault(); submitSearch(searchQuery); setMobileOpen(false); }}
                className="relative"
              >
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색..."
                  aria-label="검색어 입력"
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </form>

              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`text-sm font-medium py-1.5 transition-colors ${
                    pathname === item.href ? "text-foreground" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://github.com/RosieOh"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                GitHub
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default BlogHeader;
