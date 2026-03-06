import Header from "@/components/blog/Header";
import HeroSection from "@/components/blog/HeroSection";
import PillarSection from "@/components/blog/PillarSection";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import CtaSection from "@/components/blog/CtaSection";
import Footer from "@/components/blog/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedPosts />
        <PillarSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
