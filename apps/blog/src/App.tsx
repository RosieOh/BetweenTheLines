import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import RouteLoadingBar from "@/components/ui/RouteLoadingBar";
import { ThemeProvider } from "next-themes";
import { LazyMotion, domAnimation } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const TagPage = lazy(() => import("./pages/TagPage"));
const AuthorPage = lazy(() => import("./pages/AuthorPage"));
const Engineering = lazy(() => import("./pages/Engineering"));
const About = lazy(() => import("./pages/About"));
const Newsletter = lazy(() => import("./pages/Newsletter"));

const PageFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <p className="text-sm text-muted-foreground">페이지를 불러오는 중...</p>
  </div>
);

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {/*
      framer-motion 전체 대신 DOM 애니메이션 기능만 로드합니다.
      strict 모드라 무거운 `motion.*` 를 쓰면 즉시 에러가 나므로,
      컴포넌트에서는 경량 `m.*` 를 사용하세요.
    */}
    <LazyMotion features={domAnimation} strict>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <RouteLoadingBar />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/post/:id" element={<PostDetail />} />

              <Route path="/search" element={<SearchPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/tag/:tag" element={<TagPage />} />
              <Route path="/author/:name" element={<AuthorPage />} />
              <Route path="/engineering" element={<Engineering />} />
              <Route path="/about" element={<About />} />
              <Route path="/newsletter" element={<Newsletter />} />

              {/* 관리자 화면은 apps/admin 으로 분리됐습니다 — npm run dev:admin */}

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LazyMotion>
  </ThemeProvider>
);

export default App;
