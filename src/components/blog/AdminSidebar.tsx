import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  MessageSquare,
  Users,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/postStorage";

const navItems = [
  { label: "대시보드", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "새 게시글", to: "/admin/posts/new", icon: Plus },
  { label: "문의 관리", to: "/admin/inquiries", icon: MessageSquare },
  { label: "구독자 관리", to: "/admin/subscribers", icon: Users },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to: string) => {
    if (to === "/admin/dashboard") return location.pathname === "/admin/dashboard";
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <aside className="w-60 flex-shrink-0 h-screen sticky top-0 flex flex-col border-r border-border bg-secondary/40">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-border">
        <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-0.5">
          Between the Lines
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[17px] font-extrabold text-foreground">Admin</span>
          <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold">
            Panel
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-2">
          메뉴
        </p>
        {navItems.map(({ label, to, icon: Icon }) => {
          const active = isActive(to);
          return (
            <Link
              key={label}
              to={to}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-border flex flex-col gap-0.5">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ExternalLink size={15} />
          블로그 보기
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left"
        >
          <LogOut size={15} />
          로그아웃
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
