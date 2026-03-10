import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/postStorage";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/admin/dashboard");
    } else {
      setError("비밀번호가 올바르지 않습니다.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
            THE LOGIC
          </p>
          <h1 className="text-[28px] font-extrabold text-foreground">관리자 로그인</h1>
          <p className="text-[14px] text-muted-foreground mt-2">
            게시글을 작성하고 관리하려면 로그인하세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`bg-secondary rounded-2xl border border-border p-7 flex flex-col gap-5 ${
            shaking ? "animate-shake" : ""
          }`}
        >

          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="비밀번호 입력"
                autoFocus
                className={`w-full h-11 pl-10 pr-10 rounded-xl border bg-background text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
                  error
                    ? "border-red-400 focus:ring-red-200"
                    : "border-border focus:ring-accent/30 focus:border-accent"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && <p className="text-[12px] text-red-500 mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-[12px] text-muted-foreground mt-5">
          <Link to="/" className="hover:text-foreground transition-colors">
            ← 블로그로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
