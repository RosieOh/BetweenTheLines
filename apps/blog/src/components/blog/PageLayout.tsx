import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="min-h-screen bg-background">
    <BlogHeader />
    <main>{children}</main>
    <BlogFooter />
  </div>
);

export default PageLayout;
