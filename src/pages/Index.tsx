import BlogHeader from "@/components/blog/BlogHeader";
import BlogHero from "@/components/blog/BlogHero";
import BlogArticleList from "@/components/blog/BlogArticleList";
import BlogFooter from "@/components/blog/BlogFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      <main>
        <BlogHero />
        <BlogArticleList />
      </main>
      <BlogFooter />
    </div>
  );
};

export default Index;
