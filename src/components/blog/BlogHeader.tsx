import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "@/components/blog/ThemeToggle";

const navItems = [
  { label: "Engineering", href: "/engineering" },
  { label: "ACI Pillars", href: "/aci-pillars" },
  { label: "AES Guardrail", href: "/aes-guardrail" },
];

const BlogHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
            THE LOGIC
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors"
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

          <Link
            to="/newsletter"
            className="hidden md:inline-flex px-3.5 py-1.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity ml-1"
          >
            구독하러 가기
          </Link>

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
                  className="text-sm font-medium text-muted-foreground py-1.5"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/newsletter"
                className="mt-2 text-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                구독하러 가기
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default BlogHeader;
