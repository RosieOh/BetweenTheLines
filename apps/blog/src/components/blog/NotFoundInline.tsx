import { Link } from "react-router-dom";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";

interface NotFoundInlineProps {
  message?: string;
  backTo?: string;
  backLabel?: string;
}

const NotFoundInline = ({
  message = "찾을 수 없습니다.",
  backTo = "/",
  backLabel = "홈으로 돌아가기",
}: NotFoundInlineProps) => (
  <div className="min-h-screen bg-background flex flex-col">
    <BlogHeader />
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <p className="text-5xl font-extrabold text-foreground mb-3">404</p>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Link to={backTo} className="text-accent font-medium hover:underline">
          {backLabel}
        </Link>
      </div>
    </div>
    <BlogFooter />
  </div>
);

export default NotFoundInline;
