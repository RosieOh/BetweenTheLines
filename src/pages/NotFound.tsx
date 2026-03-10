import { Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";

const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <BlogHeader />
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-[80px] font-extrabold text-foreground leading-none mb-3">404</p>
        <p className="text-[18px] font-semibold text-foreground mb-2">페이지를 찾을 수 없습니다</p>
        <p className="text-[14px] text-muted-foreground mb-8 max-w-sm">
          요청하신 페이지가 존재하지 않거나 이동됐습니다.
        </p>
        <Link
          to="/"
          className="inline-flex px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
    <BlogFooter />
  </div>
);

export default NotFound;
